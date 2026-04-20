import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol, interval, limit } = req.query;

  if (!symbol || !interval) {
    return res.status(400).json({ error: 'Missing symbol or interval parameter' });
  }

  const sym = String(symbol).toUpperCase();
  const tf = String(interval);
  const lim = Number(limit) || 300;

  // Try multiple Binance endpoints to bypass geo-blocking
  const endpoints = [
    `https://api1.binance.com/api/v3/klines?symbol=${sym}&interval=${tf}&limit=${lim}`,
    `https://api2.binance.com/api/v3/klines?symbol=${sym}&interval=${tf}&limit=${lim}`,
    `https://api3.binance.com/api/v3/klines?symbol=${sym}&interval=${tf}&limit=${lim}`,
    `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${tf}&limit=${lim}`,
  ];

  let lastError: string | null = null;

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        lastError = `Binance API returned ${response.status}`;
        continue;
      }

      const data = await response.json();

      // Set cache headers for performance
      res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
      res.status(200).json(data);
      return;
    } catch (error: any) {
      lastError = error.message;
      continue;
    }
  }

  // Fallback to Bybit API if Binance fails
  try {
    // Bybit uses the same symbol format
    const bybitUrl = `https://api.bybit.com/v5/market/kline?category=spot&symbol=${sym}&interval=${tf}&limit=${lim}`;
    const response = await fetch(bybitUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    
    if (response.ok) {
      const bybitData = await response.json();
      if (bybitData.retCode === 0 && bybitData.result?.list) {
        // Convert Bybit format to Binance format
        const klines = bybitData.result.list.map((k: any[]) => [
          parseInt(k[0]), // open time
          k[1],           // open
          k[2],           // high
          k[3],           // low
          k[4],           // close
          k[5],           // volume
          parseInt(k[0]) + (getIntervalMs(tf) || 300000), // close time
          k[6],           // quote asset volume
          parseInt(k[7]), // number of trades
          k[8],           // taker buy base asset volume
          k[9],           // taker buy quote asset volume
          '0',            // ignore
        ]);
        
        res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
        res.status(200).json(klines);
        return;
      }
    } else {
      lastError += ` | Bybit HTTP ${response.status}`;
    }
  } catch (e: any) {
    lastError += ` | Bybit fallback failed: ${e.message}`;
  }

  // Fallback 2: CryptoCompare API
  try {
    const base = sym.replace('USDT', '');
    const ccUrl = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${base}&tsym=USDT&limit=${Math.min(lim, 2000)}&aggregate=${getAggregate(tf)}`;
    const response = await fetch(ccUrl);
    
    if (response.ok) {
      const ccData = await response.json();
      if (ccData.Data?.Data) {
        const klines = ccData.Data.Data.map((k: any) => [
          k.time * 1000,
          k.open.toFixed(2),
          k.high.toFixed(2),
          k.low.toFixed(2),
          k.close.toFixed(2),
          k.volumefrom.toString(),
          (k.time + getIntervalMs(tf)) ,
          k.volumeto.toString(),
          '0',
          '0',
          '0',
          '0',
        ]);
        
        res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
        res.status(200).json(klines);
        return;
      }
    }
  } catch (e: any) {
    lastError += ` | CryptoCompare failed: ${e.message}`;
  }

  console.error('Klines proxy error:', lastError);
  res.status(500).json({ error: 'Failed to fetch klines from any source', details: lastError });
}

function getAggregate(interval: string): number {
  const map: Record<string, number> = {
    '1m': 1, '3m': 3, '5m': 5, '15m': 15,
    '30m': 30, '1h': 60, '2h': 120, '4h': 240,
  };
  return map[interval] || 1;
}

function getIntervalMs(interval: string): number {
  const map: Record<string, number> = {
    '1m': 60000, '3m': 180000, '5m': 300000, '15m': 900000,
    '30m': 1800000, '1h': 3600000, '2h': 7200000, '4h': 14400000,
    '6h': 21600000, '8h': 28800000, '12h': 43200000, '1d': 86400000,
  };
  return map[interval] || 300000;
}
