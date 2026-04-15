import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Trade ID required' });
  }

  switch (req.method) {
    case 'PUT':
      return await updateTrade(req, res, Number(id));
    case 'DELETE':
      return await deleteTrade(req, res, Number(id));
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function updateTrade(req: NextApiRequest, res: NextApiResponse, tradeId: number) {
  try {
    const { exit_price, exit_reason } = req.body;

    const { data: trade, error: fetchError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single();

    if (fetchError || !trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    if (trade.status !== 'open') {
      return res.status(400).json({ error: 'Trade already closed' });
    }

    let profitLoss = 0;
    if (trade.type === 'buy') {
      profitLoss = exit_price - trade.entry_price;
    } else {
      profitLoss = trade.entry_price - exit_price;
    }

    const status = exit_reason === 'tp_hit' ? 'tp_hit' : 
                   exit_reason === 'sl_hit' ? 'sl_hit' : 'closed';

    const { data, error } = await supabase
      .from('trades')
      .update({
        status,
        exit_price,
        exit_reason,
        profit_loss: profitLoss,
        updated_at: new Date().toISOString()
      })
      .eq('id', tradeId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating trade:', error);
    res.status(500).json({ error: 'Failed to update trade' });
  }
}

async function deleteTrade(req: NextApiRequest, res: NextApiResponse, tradeId: number) {
  try {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);

    if (error) throw error;

    res.status(200).json({ message: 'Trade deleted' });
  } catch (error: any) {
    console.error('Error deleting trade:', error);
    res.status(500).json({ error: 'Failed to delete trade' });
  }
}
