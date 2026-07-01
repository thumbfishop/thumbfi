"use server"

import { getOrCreateUser } from "@/lib/data/users"
import { saveGeneration } from "@/lib/data/generations"
import { generateThumbnails } from "@/lib/ai/generate"
import type { GenerateOutput, GeneratedThumbnail } from "@/lib/ai/types"
import type { GenerationRequest } from "@/types"

/**
 * Generate thumbnails for the signed-in user: enforce the monthly credit
 * limit, render real images, then persist the generation + thumbnails and
 * deduct credits. Persistence is best-effort — if the DB write fails the user
 * still gets their images rather than a hard error.
 */
export async function generateThumbnailsAction(req: GenerationRequest): Promise<GenerateOutput> {
  if (!req.prompt?.trim()) throw new Error("A prompt is required.")

  const user = await getOrCreateUser()
  const remaining = user.credits_limit - user.credits_used
  if (remaining <= 0) {
    throw new Error("You're out of credits this month. Upgrade your plan for more.")
  }

  const requested = req.count ?? req.variation_count ?? 4
  const count = Math.min(requested, remaining)

  const out = await generateThumbnails({
    prompt: req.prompt,
    style: req.style,
    category: req.category,
    tone: req.tone,
    colorPalette: req.color_palette,
    aspectRatio: String(req.aspect_ratio),
    count,
  })

  try {
    const saved = await saveGeneration(user, { ...req, count }, out.thumbnails)
    const thumbnails: GeneratedThumbnail[] = saved.map((t, i) => ({
      id: t.id,
      title: t.title,
      preview_url: t.preview_url ?? out.thumbnails[i]?.preview_url ?? "",
      ctr_score: t.ctr_score,
      style: t.style,
      aspect_ratio: t.aspect_ratio,
      seed: out.thumbnails[i]?.seed ?? 0,
    }))
    return { prompt: req.prompt, thumbnails }
  } catch (err) {
    console.error("Failed to persist generation:", err)
    return out // still return the generated images
  }
}
