import type { ThumbnailStyle, ThumbnailTone, ColorPalette, ThumbnailCategory } from "@/types"

const STYLE_DESC: Record<ThumbnailStyle, string> = {
  dramatic: "dramatic high-contrast lighting, intense cinematic mood",
  minimal: "clean minimal composition, lots of negative space, professional",
  bold_text: "bold graphic composition with clear space for large text overlay",
  dark_cinema: "dark moody cinematic atmosphere, dramatic film still",
  bright_pop: "vibrant saturated colors, punchy and energetic pop style",
  gradient: "smooth modern colorful gradient background",
}

const TONE_DESC: Record<ThumbnailTone, string> = {
  shocking: "shocking, attention-grabbing, jaw-dropping",
  inspiring: "inspiring, uplifting, aspirational",
  educational: "clear, informative, trustworthy",
  controversial: "provocative, bold, debate-sparking",
  funny: "playful, humorous, light-hearted",
  curious: "intriguing, mysterious, curiosity-driven",
  urgent: "urgent, breaking-news energy, high stakes",
}

const PALETTE_DESC: Record<ColorPalette, string> = {
  auto: "",
  fire: "warm fiery orange, red and gold color palette",
  ocean: "cool blue and teal color palette",
  neon: "electric neon color palette, glowing accents",
  gold: "luxurious gold and amber color palette",
  dark: "deep dark navy and black color palette",
  vibrant: "highly vibrant multicolor palette",
  monochrome: "high-contrast black and white palette",
  warm: "warm sunset color palette",
  cool: "cool desaturated color palette",
}

const CATEGORY_DESC: Partial<Record<ThumbnailCategory, string>> = {
  crypto: "cryptocurrency and trading theme",
  finance: "finance, money and investing theme",
  gaming: "video game and esports theme",
  ai_tech: "futuristic AI and technology theme",
  lifestyle: "lifestyle and vlog theme",
  fitness: "fitness and workout theme",
  podcast: "podcast studio theme",
  news: "breaking news broadcast theme",
  tutorial: "how-to tutorial theme",
  vlog: "personal vlog theme",
  entertainment: "entertainment and pop-culture theme",
}

/** Build a rich image-model prompt from the user's request. */
export function buildImagePrompt(input: {
  prompt: string
  style: ThumbnailStyle
  tone: ThumbnailTone
  category: ThumbnailCategory
  colorPalette: ColorPalette
}): string {
  const parts = [
    input.prompt.trim(),
    "professional YouTube thumbnail",
    CATEGORY_DESC[input.category],
    STYLE_DESC[input.style],
    TONE_DESC[input.tone],
    PALETTE_DESC[input.colorPalette],
    "eye-catching composition, high detail, sharp focus, 8k",
  ].filter(Boolean)
  return parts.join(", ")
}
