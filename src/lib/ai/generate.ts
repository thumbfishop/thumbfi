import "server-only"
import { pollinationsProvider } from "@/lib/ai/providers/pollinations"
import { buildImagePrompt } from "@/lib/ai/prompt"
import { pickTitle, calcCtrScore } from "@/lib/ai/titles"
import type { GenerateInput, GenerateOutput, GeneratedThumbnail, ImageProvider } from "@/lib/ai/types"

// Active image provider. Swap this to change the whole backend.
const provider: ImageProvider = pollinationsProvider

const DIMENSIONS: Record<string, { width: number; height: number }> = {
  "16:9": { width: 1280, height: 720 },
  "1:1":  { width: 1024, height: 1024 },
  "4:3":  { width: 1024, height: 768 },
  "9:16": { width: 720, height: 1280 },
}

/**
 * Generate thumbnail variations. Pure generation — no DB, no auth. Returns
 * real image URLs plus heuristic titles and CTR scores. Persistence and
 * credit accounting are layered on top in the server action once a user is
 * known and Supabase is configured.
 */
export async function generateThumbnails(input: GenerateInput): Promise<GenerateOutput> {
  const dims = DIMENSIONS[input.aspectRatio] ?? DIMENSIONS["16:9"]
  const imagePrompt = buildImagePrompt(input)
  const count = Math.min(Math.max(input.count, 1), 8)

  const thumbnails = await Promise.all(
    Array.from({ length: count }, async (_, i): Promise<GeneratedThumbnail> => {
      // Distinct, stable seed per variation so each image differs but reloads consistently.
      const seed = 100000 + i * 7919 + Math.abs(hashString(input.prompt)) % 90000
      const preview_url = await provider.generate({
        prompt: imagePrompt,
        width: dims.width,
        height: dims.height,
        seed,
      })
      return {
        id: `var_${seed}_${i}`,
        title: pickTitle(input.prompt, input.tone, i),
        preview_url,
        ctr_score: calcCtrScore(input.style, input.tone, i, seed),
        style: input.style,
        aspect_ratio: input.aspectRatio,
        seed,
      }
    })
  )

  return { prompt: input.prompt, thumbnails }
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return h
}
