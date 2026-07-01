/**
 * AI Service — not yet connected.
 *
 * These functions are the integration points for the real thumbnail
 * generation backend (OpenAI, Flux, Replicate, etc.). They intentionally do
 * NOT return placeholder/mock results — until a real backend is wired up they
 * throw, so no fabricated thumbnails or CTR scores can reach the UI.
 */

import type { GenerationRequest, GenerationResult, Thumbnail } from "@/types"

const NOT_CONNECTED =
  "AI generation is not connected yet. Wire up the real generation backend in src/lib/api/ai.service.ts."

/**
 * PRIMARY FUNCTION — implement this to connect the real AI backend.
 */
export async function generateThumbnails(
  _req: GenerationRequest
): Promise<GenerationResult> {
  throw new Error(NOT_CONNECTED)
}

// Streaming version for future real-time preview support.
export async function* generateThumbnailsStream(
  _req: GenerationRequest
): AsyncGenerator<{ index: number; thumbnail: Thumbnail }> {
  throw new Error(NOT_CONNECTED)
}
