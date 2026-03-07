import prisma from '../../../lib/prisma';
import redis from '../../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { astrologerId, online } = req.body;
    
    if (!astrologerId || typeof online !== 'boolean') {
      return res.status(400).json({ error: 'Missing astrologerId or online flag' });
    }

    // Update database
    const updatedAstrologer = await prisma.astrologer.update({
      where: { id: astrologerId },
      data: {
        is_online: online,
        status: online ? 'ONLINE' : 'OFFLINE',
        last_active: new Date(),
      },
    });

    // Emit Socket.io event via Redis pub/sub
    // In production, you'd have a Socket.io server listening to Redis
    // For now, we'll just update Redis cache for real-time status
    await redis.set(`astrologer:${astrologerId}:online`, online ? '1' : '0');
    await redis.publish('astrologer-status', JSON.stringify({
      astrologerId,
      online,
      timestamp: Date.now(),
    }));

    res.status(200).json({
      success: true,
      astrologer: {
        id: updatedAstrologer.id,
        name: updatedAstrologer.name,
        is_online: updatedAstrologer.is_online,
        status: updatedAstrologer.status,
      },
    });
  } catch (error) {
    console.error('Failed to update astrologer status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}