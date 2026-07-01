import "server-only"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { rowToThumbnail } from "@/lib/data/thumbnails"
import type { Thumbnail, GenerationRequest, User } from "@/types"
import type { GeneratedThumbnail } from "@/lib/ai/types"

/**
 * Persist a generation and its thumbnails, then deduct one credit per image
 * and record it in the ledger. Returns the saved thumbnail rows.
 */
export async function saveGeneration(
  user: User,
  req: GenerationRequest,
  generated: GeneratedThumbnail[]
): Promise<Thumbnail[]> {
  const db = supabaseAdmin()
  const n = generated.length

  const { data: gen, error: genErr } = await db
    .from("thumbnail_generations")
    .insert({
      user_id: user.id,
      project_id: req.project_id ?? null,
      prompt: req.prompt,
      style: req.style,
      category: req.category,
      tone: req.tone,
      color_palette: req.color_palette,
      aspect_ratio: String(req.aspect_ratio),
      count: n,
      credits_used: n,
      status: "done",
    })
    .select("id")
    .single()
  if (genErr) throw genErr

  const rows = generated.map((g, i) => ({
    user_id: user.id,
    project_id: req.project_id ?? null,
    generation_id: gen.id,
    prompt: req.prompt,
    title: g.title,
    preview_url: g.preview_url,
    aspect_ratio: g.aspect_ratio,
    style: req.style,
    category: req.category,
    tone: req.tone,
    ctr_score: g.ctr_score,
    status: "done",
    variation_index: i,
  }))

  const { data: thumbs, error: thumbErr } = await db.from("thumbnails").insert(rows).select("*")
  if (thumbErr) throw thumbErr

  // Deduct credits + ledger entry (read-modify-write is fine at single-user scale).
  await db.from("users").update({ credits_used: user.credits_used + n }).eq("id", user.id)
  await db.from("credits_ledger").insert({
    user_id: user.id,
    delta: -n,
    reason: "generation",
    generation_id: gen.id,
  })

  return (thumbs as Parameters<typeof rowToThumbnail>[0][]).map(rowToThumbnail)
}
