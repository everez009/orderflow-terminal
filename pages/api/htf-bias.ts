import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const SYMS = {
  PAXGUSDT: 'PAXGUSDT',
  BTCUSDT: 'BTCUSDT'
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol } = req.query;

  if (!symbol || !SYMS[symbol as keyof typeof SYMS]) {
    return res.status(400).json({ error: 'Invalid symbol' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const klSym = SYMS[symbol as keyof typeof SYMS];

    // Fetch 1H data (last 50 candles)
    const h1Response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${klSym}&interval=1h&limit=50`,
      { timeout: 10000 }
    );
    const h1Data = h1Response.data;

    // Fetch 4H data (last 30 candles)
    const h4Response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${klSym}&interval=4h&limit=30`,
      { timeout: 10000 }
    );
    const h4Data = h4Response.data;

    // Calculate biases
    const h1Bias = calculateTrendBias(h1Data, 20);
    const h4Bias = calculateTrendBias(h4Data, 10);
    const combinedBias = h1Bias * 0.4 + h4Bias * 0.6;

    res.json({
      h1: h1Bias,
      h4: h4Bias,
      combined: combinedBias,
      trend: getTrendLabel(combinedBias)
    });
  } catch (error: any) {
    console.error('HTF Bias Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(500).json({ 
      error: 'Failed to calculate HTF bias',
      details: error.message
    });
  }
}

function calculateTrendBias(klineData: any[], period: number): number {
  if (!klineData || klineData.length < period) return 0;

  const closes = klineData.map((k: any) => parseFloat(k[4]));
  const recentCloses = closes.slice(-period);
  const avgPrice = recentCloses.reduce((a: number, b: number) => a + b, 0) / period;
  const currentPrice = closes[closes.length - 1];

  const pctDiff = ((currentPrice - avgPrice) / avgPrice) * 100;
  const bias = Math.max(-100, Math.min(100, pctDiff * 10));

  return bias;
}

function getTrendLabel(bias: number): string {
  if (bias > 50) return 'Strong Bullish';
  if (bias > 20) return 'Bullish';
  if (bias > -20) return 'Neutral';
  if (bias > -50) return 'Bearish';
  return 'Strong Bearish';
}
