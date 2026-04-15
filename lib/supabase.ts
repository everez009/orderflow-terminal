import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Trade {
  id?: number;
  user_id?: string;
  symbol: string;
  type: 'buy' | 'sell';
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  stars?: string;
  conditions?: any[];
  status: 'open' | 'closed' | 'tp_hit' | 'sl_hit';
  exit_price?: number;
  profit_loss?: number;
  exit_reason?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VolumeProfile {
  id?: number;
  user_id?: string;
  symbol: string;
  session_date: string;
  vp_data: any;
  total_volume: number;
  net_delta: number;
  created_at?: string;
  updated_at?: string;
}
