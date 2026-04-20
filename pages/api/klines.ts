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

  const url = `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${tf}&limit=${lim}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Binance API returned ${response.status}`);
    }

    const data = await response.json();

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Klines proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch klines', details: error.message });
  }
}
