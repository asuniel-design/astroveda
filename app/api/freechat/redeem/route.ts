import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireLock, releaseLock } from "@/lib/upstash";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = String(body?.userId || "");
    if (!userId) {
      return NextResponse.json({ ok: false, error: "missing_userId" }, { status: 400 });
    }

    // Best-effort atomicity via Upstash lock (when configured)
    const lockKey = `freechat:${userId}`;
    const ttlMs = 10_000;

    let locked = false;
    try {
      locked = await acquireLock(lockKey, ttlMs);
      if (!locked) {
        return NextResponse.json({ ok: false, error: "busy" }, { status: 409 });
      }
    } catch {
      // If Upstash isn't configured yet, proceed without the lock.
    }

    try {
      const existing = await prisma.user.findUnique({ where: { id: userId }, select: { hasUsedFreeChat: true } });
      if (!existing) {
        // Create minimal user row (until real auth wiring lands)
        await prisma.user.create({ data: { id: userId } });
      }

      const u = await prisma.user.findUnique({ where: { id: userId }, select: { hasUsedFreeChat: true } });
      if (u?.hasUsedFreeChat) {
        return NextResponse.json({ ok: true, alreadyUsed: true });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { hasUsedFreeChat: true, freeChatUsedAt: new Date() },
      });

      return NextResponse.json({ ok: true, alreadyUsed: false });
    } finally {
      if (locked) {
        try {
          await releaseLock(lockKey);
        } catch {
          // ignore
        }
      }
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "error" }, { status: 500 });
  }
}
