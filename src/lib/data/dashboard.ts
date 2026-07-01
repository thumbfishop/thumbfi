import "server-only"
import { supabaseAdmin } from "@/lib/supabase/admin"
import type { DashboardStats, User } from "@/types"

/**
 * Aggregate dashboard stats for a user. Counts use head+exact for efficiency;
 * average CTR is computed over the user's thumbnails.
 */
export async function getDashboardStats(user: User): Promise<DashboardStats> {
  const db = supabaseAdmin()
  const userId = user.id

  const startOfMonth = (() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
  })()

  const [totalThumbs, monthThumbs, activeProjects, ctrRows] = await Promise.all([
    db.from("thumbnails").select("*", { count: "exact", head: true }).eq("user_id", userId),
    db.from("thumbnails").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", startOfMonth),
    db.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active"),
    db.from("thumbnails").select("ctr_score").eq("user_id", userId),
  ])

  const scores = (ctrRows.data as { ctr_score: number }[] | null) ?? []
  const avg = scores.length
    ? Math.round((scores.reduce((a, r) => a + (r.ctr_score ?? 0), 0) / scores.length) * 10) / 10
    : 0

  return {
    total_thumbnails: totalThumbs.count ?? 0,
    thumbnails_this_month: monthThumbs.count ?? 0,
    avg_ctr_score: avg,
    credits_used: user.credits_used,
    credits_limit: user.credits_limit,
    thumb_balance: user.thumb_balance,
    active_projects: activeProjects.count ?? 0,
  }
}
