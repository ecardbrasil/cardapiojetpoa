const SUPABASE_URL = "https://zllvqphfjtecbwvjaqbe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_UDSoxlJZThHhk3c3nBhR9A_SZuU-VZu";

function getSupabaseClient() {
  if (!window.supabase) return null;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
