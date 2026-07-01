import "server-only"
import { supabaseAdmin } from "@/lib/supabase/admin"
import type {
  Thumbnail, AspectRatio, ThumbnailStyle, ThumbnailCategory,
  ThumbnailTone, ThumbnailStatus, EditorState,
} from "@/types"

type ThumbnailRow = {
  id: string
  project_id: string | null
  user_id: string
  prompt: string
  title: string
  preview_gradient: string | null
  preview_url: string | null
  aspect_ratio: string
  style: string
  category: string
  tone: string
  ctr_score: number
  status: string
  is_favorite: boolean
  variation_index: number
  generation_id: string | null
  canvas_json: EditorState | null
  created_at: string
  updated_at: string
}

export function rowToThumbnail(r: ThumbnailRow): Thumbnail {
  return {
    id: r.id,
    project_id: r.project_id,
    user_id: r.user_id,
    prompt: r.prompt,
    title: r.title,
    preview_gradient: r.preview_gradient ?? "",
    preview_url: r.preview_url,
    aspect_ratio: r.aspect_ratio as AspectRatio,
    style: r.style as ThumbnailStyle,
    category: r.category as ThumbnailCategory,
    tone: r.tone as ThumbnailTone,
    ctr_score: r.ctr_score,
    status: r.status as ThumbnailStatus,
    is_favorite: r.is_favorite,
    variation_index: r.variation_index,
    generation_id: r.generation_id ?? "",
    created_at: r.created_at,
    updated_at: r.updated_at,
    editor_state: r.canvas_json,
  }
}

export async function listThumbnails(
  userId: string,
  opts: { projectId?: string; limit?: number } = {}
): Promise<Thumbnail[]> {
  const db = supabaseAdmin()
  let query = db.from("thumbnails").select("*").eq("user_id", userId)
  if (opts.projectId) query = query.eq("project_id", opts.projectId)
  query = query.order("created_at", { ascending: false })
  if (opts.limit) query = query.limit(opts.limit)
  const { data, error } = await query
  if (error) throw error
  return (data as ThumbnailRow[]).map(rowToThumbnail)
}

export async function getThumbnail(userId: string, id: string): Promise<Thumbnail | null> {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from("thumbnails")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle()
  if (error) throw error
  return data ? rowToThumbnail(data as ThumbnailRow) : null
}

export async function setThumbnailFavorite(userId: string, id: string, isFavorite: boolean): Promise<void> {
  const db = supabaseAdmin()
  const { error } = await db
    .from("thumbnails")
    .update({ is_favorite: isFavorite })
    .eq("id", id)
    .eq("user_id", userId)
  if (error) throw error
}

export async function saveThumbnailCanvas(userId: string, id: string, canvas: EditorState): Promise<void> {
  const db = supabaseAdmin()
  const { error } = await db
    .from("thumbnails")
    .update({ canvas_json: canvas })
    .eq("id", id)
    .eq("user_id", userId)
  if (error) throw error
}

export async function deleteThumbnail(userId: string, id: string): Promise<void> {
  const db = supabaseAdmin()
  const { error } = await db.from("thumbnails").delete().eq("id", id).eq("user_id", userId)
  if (error) throw error
}
