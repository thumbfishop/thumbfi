"use server"

import { getOrCreateUser } from "@/lib/data/users"
import { getDashboardStats } from "@/lib/data/dashboard"
import type { DashboardStats, User } from "@/types"

/** Current user's profile (creates the DB row on first call). */
export async function getCurrentUserAction(): Promise<User> {
  return getOrCreateUser()
}

/** Aggregated dashboard stats for the current user. */
export async function getDashboardStatsAction(): Promise<DashboardStats> {
  const user = await getOrCreateUser()
  return getDashboardStats(user)
}
