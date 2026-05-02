import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string;
  package_amount: number;
  distance_km: number;
  duration_days: number;
  category: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  destination_id: string;
  travel_date: string;
  num_travelers: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_ref: string;
  created_at: string;
}
