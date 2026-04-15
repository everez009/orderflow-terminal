import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // For now, skip auth to make it easy to run
  // In production, add Clerk or Supabase Auth
  
  switch (req.method) {
    case 'GET':
      return await getTrades(req, res);
    case 'POST':
      return await createTrade(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getTrades(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    res.status(200).json(data || []);
  } catch (error: any) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
}

async function createTrade(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tradeData = req.body;

    if (!tradeData.symbol || !tradeData.type || !tradeData.entry_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('trades')
      .insert([{
        ...tradeData,
        status: tradeData.status || 'open'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating trade:', error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
}
