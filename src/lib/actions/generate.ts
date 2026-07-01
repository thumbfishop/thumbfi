"use server"

import { requireUserId } from "@/lib/data/users"
import { generateThumbnails } from "@/lib/ai/generate"
import type { GenerateOutput } from "@/lib/ai/types"
import type { GenerationRequest } from "@/types"

/**
 * Generate thumbnail variations for the signed-in user.
 *
 * Currently pure generation (real image URLs, no persistence) so it works with
 * zero backend setup. Once Supabase is configured this is where we'll deduct a
 * credit and persist the generation + thumbnails.
 */
export async function generateThumbnailsAction(req: GenerationRequest): Promise<GenerateOutput> {
  await requireUserId() // gate to signed-in users
  if (!req.prompt?.trim()) throw new Error("A prompt is required.")

  return generateThumbnails({
    prompt: req.prompt,
    style: req.style,
    category: req.category,
    tone: req.tone,
    colorPalette: req.color_palette,
    aspectRatio: String(req.aspect_ratio),
    count: req.count ?? req.variation_count ?? 4,
  })
}
