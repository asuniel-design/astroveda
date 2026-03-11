"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    try {
      const userId = window.localStorage.getItem("userId");
      setAuthed(!!userId);
    } catch {
      setAuthed(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {authed && <Sidebar />}
      <main className={`${authed ? "md:ml-[260px]" : ""} max-w-6xl mx-auto px-4 md:px-6`}>
        {children}
      </main>
    </div>
  );
}
