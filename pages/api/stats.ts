import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { data: trades, error } = await supabase
      .from('trades')
      .select('*');

    if (error) throw error;

    const totalTrades = trades?.length || 0;
    const closedTrades = trades?.filter((t: any) => t.status === 'closed') || [];

    if (closedTrades.length === 0) {
      return res.status(200).json({
        totalTrades,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        netPnL: 0,
        profitFactor: 0
      });
    }

    const wins = closedTrades.filter((t: any) => t.profit_loss > 0);
    const losses = closedTrades.filter((t: any) => t.profit_loss <= 0);

    const winRate = (wins.length / closedTrades.length) * 100;
    const avgWin = wins.length > 0 
      ? wins.reduce((sum: number, t: any) => sum + t.profit_loss, 0) / wins.length 
      : 0;
    const avgLoss = losses.length > 0 
      ? Math.abs(losses.reduce((sum: number, t: any) => sum + t.profit_loss, 0)) / losses.length 
      : 0;
    const netPnL = closedTrades.reduce((sum: number, t: any) => sum + t.profit_loss, 0);

    const totalWins = wins.reduce((sum: number, t: any) => sum + t.profit_loss, 0);
    const totalLosses = Math.abs(losses.reduce((sum: number, t: any) => sum + t.profit_loss, 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;

    res.status(200).json({
      totalTrades,
      winRate: winRate.toFixed(1),
      avgWin: avgWin.toFixed(2),
      avgLoss: avgLoss.toFixed(2),
      netPnL: netPnL.toFixed(2),
      profitFactor: profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)
    });
  } catch (error: any) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
}
