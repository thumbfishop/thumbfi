import "server-only"
import { auth, currentUser } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import type { User, PlanTier } from "@/types"

type UserRow = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  plan: string
  thumb_balance: number
  credits_used: number
  credits_limit: number
  created_at: string
  updated_at: string
}

export function rowToUser(r: UserRow): User {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    avatar_url: r.avatar_url,
    plan: r.plan as PlanTier,
    thumb_balance: r.thumb_balance,
    credits_used: r.credits_used,
    credits_limit: r.credits_limit,
    created_at: r.created_at,
  }
}

/** Clerk user id for the current request, or throw if unauthenticated. */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error("Not authenticated")
  return userId
}

/**
 * Return the current user's DB row, lazily creating it from the Clerk profile
 * on first access. This keeps the `users` table in sync without a webhook.
 */
export async function getOrCreateUser(): Promise<User> {
  const userId = await requireUserId()
  const db = supabaseAdmin()

  const { data: existing, error } = await db
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle()
  if (error) throw error
  if (existing) return rowToUser(existing as UserRow)

  const cu = await currentUser()
  const email =
    cu?.primaryEmailAddress?.emailAddress ??
    cu?.emailAddresses?.[0]?.emailAddress ??
    `${userId}@no-email.thumbfi`
  const name =
    cu?.fullName ??
    [cu?.firstName, cu?.lastName].filter(Boolean).join(" ") ??
    ""
  const avatar_url = cu?.imageUrl ?? null

  const { data, error: insertError } = await db
    .from("users")
    .upsert({ id: userId, email, name, avatar_url }, { onConflict: "id" })
    .select("*")
    .single()
  if (insertError) throw insertError
  return rowToUser(data as UserRow)
}
