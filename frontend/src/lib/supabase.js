import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client with optimized settings for MAXIMUM SPEED
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable URL detection for faster loading
    flowType: 'pkce',
    debug: false // Disable debug mode
  },
  global: {
    headers: { 'x-application-name': 'nexstream' },
    fetch: (...args) => fetch(...args)
  },
  realtime: {
    timeout: 5000 // Reduced timeout for faster failures
  },
  db: {
    schema: 'public'
  }
});

// Pre-warm connection (optional but can help)
supabase.auth.getSession().catch(() => {});