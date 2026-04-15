import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol required' });
  }

  switch (req.method) {
    case 'GET':
      return await getVolumeProfile(req, res, symbol as string);
    case 'POST':
      return await saveVolumeProfile(req, res, symbol as string);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getVolumeProfile(req: NextApiRequest, res: NextApiResponse, symbol: string) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('volume_profiles')
      .select('*')
      .eq('symbol', symbol)
      .eq('session_date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      return res.status(200).json({
        vp: {},
        vol: 0,
        delta: 0
      });
    }

    res.status(200).json({
      vp: data.vp_data,
      vol: data.total_volume,
      delta: data.net_delta
    });
  } catch (error: any) {
    console.error('Error fetching volume profile:', error);
    res.status(500).json({ error: 'Failed to fetch volume profile' });
  }
}

async function saveVolumeProfile(req: NextApiRequest, res: NextApiResponse, symbol: string) {
  try {
    const { vp_data, total_volume, net_delta } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('volume_profiles')
      .select('id')
      .eq('symbol', symbol)
      .eq('session_date', today)
      .single();

    let result;

    if (existing) {
      result = await supabase
        .from('volume_profiles')
        .update({
          vp_data,
          total_volume,
          net_delta,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('volume_profiles')
        .insert([{
          symbol,
          session_date: today,
          vp_data,
          total_volume,
          net_delta
        }])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.status(200).json(result.data);
  } catch (error: any) {
    console.error('Error saving volume profile:', error);
    res.status(500).json({ error: 'Failed to save volume profile' });
  }
}
