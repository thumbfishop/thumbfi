import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * This bypasses RLS, so it must ONLY ever run on the server and every query
 * must be scoped to the authenticated Clerk user's id in application code.
 * Never import this into a client component.
 */
let cached: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    )
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
