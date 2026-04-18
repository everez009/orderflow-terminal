import { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';

interface OrderBookLevel {
  price: number;
  size: number;
  timestamp: number;
}

interface WallEvent {
  price: number;
  size: number;
  side: 'bid' | 'ask';
  timestamp: number;
  action: 'placed' | 'cancelled' | 'filled';
}

interface TradePrint {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { symbol, orderBook, tradePrints } = req.body;

    if (!symbol || !orderBook || !tradePrints) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const now = Date.now();
    const windowMs = 60000; // 60-second tracking window
    const keyPrefix = `orderflow:${symbol}`;

    // ── Track Order Book Walls ──────────────────────────
    const walls: WallEvent[] = [];

    // Process bid walls
    for (const level of orderBook.bids || []) {
      const wallKey = `${keyPrefix}:wall:bid:${level.price}`;
      const existingWall = await redis.get(wallKey);

      if (existingWall) {
        // Wall exists - update or detect cancellation
        const wallData = JSON.parse(existingWall);
        
        // If size dropped significantly or disappeared, mark as cancelled
        if (level.size === 0 || level.size < wallData.size * 0.1) {
          walls.push({
            price: level.price,
            size: wallData.size,
            side: 'bid',
            timestamp: now,
            action: 'cancelled'
          });
          await redis.del(wallKey);
          
          // Log cancellation event for spoof detection
          const cancelKey = `${keyPrefix}:cancellations:bid:${level.price}`;
          await redis.lpush(cancelKey, JSON.stringify({ timestamp: now, size: wallData.size }));
          await redis.expire(cancelKey, 120); // Keep for 2 minutes
        } else {
          // Update existing wall
          await redis.set(wallKey, JSON.stringify({ ...wallData, size: level.size, lastUpdate: now }));
        }
      } else if (level.size > 0) {
        // New wall detected
        walls.push({
          price: level.price,
          size: level.size,
          side: 'bid',
          timestamp: now,
          action: 'placed'
        });
        await redis.set(wallKey, JSON.stringify({
          price: level.price,
          size: level.size,
          side: 'bid',
          placedAt: now,
          lastUpdate: now
        }));
      }
    }

    // Process ask walls
    for (const level of orderBook.asks || []) {
      const wallKey = `${keyPrefix}:wall:ask:${level.price}`;
      const existingWall = await redis.get(wallKey);

      if (existingWall) {
        const wallData = JSON.parse(existingWall);
        
        if (level.size === 0 || level.size < wallData.size * 0.1) {
          walls.push({
            price: level.price,
            size: wallData.size,
            side: 'ask',
            timestamp: now,
            action: 'cancelled'
          });
          await redis.del(wallKey);
          
          const cancelKey = `${keyPrefix}:cancellations:ask:${level.price}`;
          await redis.lpush(cancelKey, JSON.stringify({ timestamp: now, size: wallData.size }));
          await redis.expire(cancelKey, 120);
        } else {
          await redis.set(wallKey, JSON.stringify({ ...wallData, size: level.size, lastUpdate: now }));
        }
      } else if (level.size > 0) {
        walls.push({
          price: level.price,
          size: level.size,
          side: 'ask',
          timestamp: now,
          action: 'placed'
        });
        await redis.set(wallKey, JSON.stringify({
          price: level.price,
          size: level.size,
          side: 'ask',
          placedAt: now,
          lastUpdate: now
        }));
      }
    }

    // ── Detect Spoofs ──────────────────────────────────
    const spoofs: Array<{
      price: number;
      side: 'bid' | 'ask';
      confidence: string;
      reason: string;
      timestamp: number;
    }> = [];

    for (const wall of walls) {
      if (wall.action === 'cancelled') {
        const cancelKey = `${keyPrefix}:cancellations:${wall.side}:${wall.price}`;
        const cancellations = await redis.lrange(cancelKey, 0, -1);
        
        // Check for rapid cancellations (3+ times in 60 seconds)
        const recentCancels = cancellations
          .map((c: string) => JSON.parse(c))
          .filter((c: any) => now - c.timestamp < windowMs);

        if (recentCancels.length >= 3) {
          spoofs.push({
            price: wall.price,
            side: wall.side,
            confidence: 'high',
            reason: `Cancelled ${recentCancels.length} times in 60s`,
            timestamp: now
          });
        }

        // Check if wall was short-lived (< 5 seconds)
        const wallKey = `${keyPrefix}:wall:${wall.side}:${wall.price}`;
        // Wall already deleted, but we can check placement time from memory
        // For now, skip this check (would need to store placement separately)
      }
    }

    // ── Detect Icebergs ────────────────────────────────
    const icebergs: Array<{
      price: number;
      side: 'buy' | 'sell';
      estimatedSize: number;
      visibleSize: number;
      fillCount: number;
      confidence: string;
    }> = [];
    
    // Store trade prints for iceberg analysis
    for (const trade of tradePrints) {
      const tradeKey = `${keyPrefix}:trades:${trade.price}`;
      await redis.lpush(tradeKey, JSON.stringify({
        price: trade.price,
        size: trade.size,
        side: trade.side,
        timestamp: trade.timestamp
      }));
      await redis.ltrim(tradeKey, 0, 99); // Keep last 100 trades per price level
      await redis.expire(tradeKey, 120);
    }

    // Analyze for iceberg patterns
    const allTradeKeys = await redis.keys(`${keyPrefix}:trades:*`);
    for (const tradeKey of allTradeKeys) {
      const trades = await redis.lrange(tradeKey, 0, -1);
      const parsedTrades: TradePrint[] = trades.map((t: string) => JSON.parse(t));

      if (parsedTrades.length >= 5) {
        // Check for repeated small fills at same price (iceberg signature)
        const sameSideTrades = parsedTrades.filter(t => t.side === parsedTrades[0].side);
        
        if (sameSideTrades.length >= 5) {
          const totalVolume = sameSideTrades.reduce((sum, t) => sum + t.size, 0);
          const avgSize = totalVolume / sameSideTrades.length;
          const timeSpan = Math.max(...sameSideTrades.map(t => t.timestamp)) - 
                          Math.min(...sameSideTrades.map(t => t.timestamp));

          // Iceberg pattern: many small trades at same price over short time
          if (timeSpan < 30000 && avgSize < totalVolume * 0.3) {
            icebergs.push({
              price: parsedTrades[0].price,
              side: parsedTrades[0].side,
              estimatedSize: totalVolume * 2, // Estimate hidden size
              visibleSize: avgSize,
              fillCount: sameSideTrades.length,
              confidence: 'medium'
            });
          }
        }
      }
    }

    // ── Calculate Aggregated Metrics ───────────────────
    const activeWalls = await redis.keys(`${keyPrefix}:wall:*`);
    const wallDetails: any[] = [];
    
    for (const wallKey of activeWalls) {
      const wallData = await redis.get(wallKey);
      if (wallData) {
        wallDetails.push(JSON.parse(wallData));
      }
    }

    // Clean up old data
    const oldKeys = await redis.keys(`${keyPrefix}:*`);
    for (const key of oldKeys) {
      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        await redis.expire(key, 120); // Set 2-minute expiry on keys without TTL
      }
    }

    // ── Return Analysis ────────────────────────────────
    res.status(200).json({
      timestamp: now,
      symbol,
      walls: wallDetails,
      spoofs,
      icebergs,
      metrics: {
        totalActiveWalls: wallDetails.length,
        spoofCount: spoofs.length,
        icebergCount: icebergs.length
      }
    });

  } catch (error: any) {
    console.error('Order flow tracker error:', error);
    res.status(500).json({ error: 'Failed to process order flow data' });
  }
}
