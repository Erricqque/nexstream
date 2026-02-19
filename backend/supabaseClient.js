// supabaseClient.js - Supabase client for backend
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://nweokaijvelezkqqopam.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53ZW9rYWlqdmVsZXprcXFvcGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTE5MjIsImV4cCI6MjA4NjU2NzkyMn0._F5YVRh2DRX8W0knzkPa40toKRFsKOvx3UMJANJDaWg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };