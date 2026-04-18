import { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';

interface SignalRequest {
  symbol: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!redis) {
    return res.status(503).json({ 
      error: 'Redis not configured',
      message: 'UPSTASH_REDIS_URL environment variable is not set'
    });
  }

  try {
    const { symbol }: SignalRequest = req.body;

    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter required' });
    }

    const keyPrefix = `orderflow:${symbol}`;

    // ── Retrieve Order Flow Data from Redis ────────────────
    const wallKeys = await redis.keys(`${keyPrefix}:wall:*`);
    const walls: any[] = [];
    for (const wallKey of wallKeys) {
      const wallData = await redis.get(wallKey);
      if (wallData) {
        walls.push(JSON.parse(wallData));
      }
    }

    // Retrieve spoof events
    const spoofKeys = await redis.keys(`${keyPrefix}:cancellations:*`);
    const spoofs: Array<{
      price: number;
      side: string;
      cancelCount: number;
      confidence: string;
      reason: string;
    }> = [];
    for (const spoofKey of spoofKeys) {
      const cancellations = await redis.lrange(spoofKey, 0, -1);
      const parsedCancels = cancellations.map((c: string) => JSON.parse(c));
      const now = Date.now();
      const recentCancels = parsedCancels.filter((c: any) => now - c.timestamp < 60000);
      
      if (recentCancels.length >= 3) {
        const priceMatch = spoofKey.match(/:(bid|ask):([\d.]+)$/);
        if (priceMatch) {
          const [, side, price] = priceMatch;
          spoofs.push({
            price: parseFloat(price),
            side,
            cancelCount: recentCancels.length,
            confidence: 'high',
            reason: `Cancelled ${recentCancels.length} times in 60s`
          });
        }
      }
    }

    // Retrieve iceberg detections
    const icebergKeys = await redis.keys(`${keyPrefix}:iceberg:*`);
    const icebergs: any[] = [];
    for (const icebergKey of icebergKeys) {
      const icebergData = await redis.get(icebergKey);
      if (icebergData) {
        icebergs.push(JSON.parse(icebergData));
      }
    }

    // ── TODO: Aggregate additional market data ─────────────
    // For Phase 2, we need to receive this data from the frontend:
    // - Volume profile (POC, VAH, VAL)
    // - Footprint data (delta, cumulative delta)
    // - Candlestick patterns
    // - Recent trade prints
    
    // For now, return the order flow analysis
    res.status(200).json({
      timestamp: Date.now(),
      symbol,
      orderFlowAnalysis: {
        walls,
        spoofs,
        icebergs,
        metrics: {
          totalActiveWalls: walls.length,
          spoofCount: spoofs.length,
          icebergCount: icebergs.length
        }
      },
      note: 'Phase 2: Full signal generation requires additional market data aggregation'
    });

  } catch (error: any) {
    console.error('Signal generation error:', error);
    res.status(500).json({ error: 'Failed to generate signal' });
  }
}
