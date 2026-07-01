import type { ImageProvider } from "@/lib/ai/types"

/**
 * Pollinations.ai — free, no API key, no account. The returned URL *is* the
 * image: fetching it (e.g. via <img src>) triggers generation on their side.
 * Best-effort uptime; fine for launch, swap for a paid provider as you grow.
 */
export const pollinationsProvider: ImageProvider = {
  name: "pollinations",
  async generate({ prompt, width, height, seed }) {
    const base = "https://image.pollinations.ai/prompt/"
    const params = new URLSearchParams({
      width: String(width),
      height: String(height),
      seed: String(seed),
      model: "flux",
      nologo: "true",
      enhance: "true",
    })
    return `${base}${encodeURIComponent(prompt)}?${params.toString()}`
  },
}
