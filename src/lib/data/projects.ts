import "server-only"
import { supabaseAdmin } from "@/lib/supabase/admin"
import type { Project, ProjectStatus } from "@/types"

type ProjectRow = {
  id: string
  user_id: string
  title: string
  description: string | null
  thumbnail_count: number
  is_favorite: boolean
  status: string
  cover_thumbnail_id: string | null
  created_at: string
  updated_at: string
}

function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id,
    user_id: r.user_id,
    title: r.title,
    description: r.description,
    thumbnail_count: r.thumbnail_count,
    is_favorite: r.is_favorite,
    status: r.status as ProjectStatus,
    cover_thumbnail_id: r.cover_thumbnail_id,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }
}

export async function listProjects(
  userId: string,
  opts: { includeArchived?: boolean } = {}
): Promise<Project[]> {
  const db = supabaseAdmin()
  let query = db.from("projects").select("*").eq("user_id", userId)
  if (!opts.includeArchived) query = query.eq("status", "active")
  const { data, error } = await query.order("updated_at", { ascending: false })
  if (error) throw error
  return (data as ProjectRow[]).map(rowToProject)
}

export async function createProject(
  userId: string,
  input: { title: string; description?: string | null }
): Promise<Project> {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from("projects")
    .insert({ user_id: userId, title: input.title, description: input.description ?? null })
    .select("*")
    .single()
  if (error) throw error
  return rowToProject(data as ProjectRow)
}

export async function updateProject(
  userId: string,
  id: string,
  patch: Partial<{ title: string; description: string | null; is_favorite: boolean; status: ProjectStatus }>
): Promise<Project> {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from("projects")
    .update(patch)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single()
  if (error) throw error
  return rowToProject(data as ProjectRow)
}

export async function deleteProject(userId: string, id: string): Promise<void> {
  const db = supabaseAdmin()
  const { error } = await db.from("projects").delete().eq("id", id).eq("user_id", userId)
  if (error) throw error
}
