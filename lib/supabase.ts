import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-actual-anon-key');

if (!isConfigured) {
  throw new Error('Supabase environment variables are not properly configured. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Export configuration status for components to check
export const isSupabaseConfigured = isConfigured;