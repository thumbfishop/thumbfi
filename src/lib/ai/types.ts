import type { ThumbnailStyle, ThumbnailCategory, ThumbnailTone, ColorPalette } from "@/types"

export interface GenerateInput {
  prompt: string
  style: ThumbnailStyle
  category: ThumbnailCategory
  tone: ThumbnailTone
  colorPalette: ColorPalette
  aspectRatio: string
  count: number
}

/** A single generated variation (before any DB persistence). */
export interface GeneratedThumbnail {
  id: string
  title: string
  preview_url: string
  ctr_score: number
  style: ThumbnailStyle
  aspect_ratio: string
  seed: number
}

export interface GenerateOutput {
  prompt: string
  thumbnails: GeneratedThumbnail[]
}

/**
 * Provider-agnostic image generator. Swap the implementation (Pollinations →
 * Cloudflare / Replicate / OpenAI) without touching callers. Implementations
 * return a public image URL for the given prompt + dimensions.
 */
export interface ImageProvider {
  readonly name: string
  generate(input: { prompt: string; width: number; height: number; seed: number }): Promise<string>
}
