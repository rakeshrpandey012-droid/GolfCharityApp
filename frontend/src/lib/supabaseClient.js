// Lightweight Supabase client wrapper with localStorage fallback
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  client = createClient(SUPABASE_URL, SUPABASE_KEY);
}

export function getClient() {
  return client;
}

export async function listUsers() {
  const c = getClient();
  if (!c) {
    try {
      return JSON.parse(localStorage.getItem('dh_mock_users_v1') || '[]');
    } catch {
      return [];
    }
  }

  const { data, error } = await c.from('users').select('*');
  if (error) throw error;
  return data;
}
