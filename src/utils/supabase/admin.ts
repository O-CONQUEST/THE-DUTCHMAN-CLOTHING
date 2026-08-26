import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server-only writes (creating orders,
 * decrementing inventory, marking orders paid/fulfilled). Bypasses RLS —
 * never import this into a Client Component or expose its key with a
 * NEXT_PUBLIC_ prefix.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it in Supabase Project Settings > API."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
