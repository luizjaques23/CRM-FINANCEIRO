import { createClient } from "@supabase/supabase-js";

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vitqkingsalwsaomffwy.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_gjoCw4sTwuKHWMwWKzDukw_iVrBQaTi";

// Sanitize URL to ensure it just contains the origin.
// Users sometimes accidentally provide https://[...].supabase.co/rest/v1/ in their environment variables.
if (supabaseUrl) {
  try {
    const parsedUrl = new URL(supabaseUrl);
    supabaseUrl = parsedUrl.origin;
  } catch (err) {
    console.error("Invalid Supabase URL:", supabaseUrl);
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== "" && supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "" && supabaseAnonKey !== "placeholder";
};
