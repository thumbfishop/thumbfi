/**
 * Mock AI Service — structured for real API swap.
 * Replace generateThumbnails() body with a real API call (OpenAI, Flux, Replicate, etc.)
 * without changing any caller code.
 */

import type {
  GenerationRequest, GenerationResult, Thumbnail,
  ThumbnailStyle, ThumbnailCategory, ThumbnailTone
} from "@/types"

// Gradient banks by style/tone
const GRADIENT_MAP: Record<string, string[]> = {
  dramatic:   ["from-orange-600 via-red-600 to-red-900", "from-amber-500 via-orange-600 to-red-700", "from-yellow-600 to-orange-800", "from-orange-800 to-red-950"],
  minimal:    ["from-slate-100 to-slate-300", "from-gray-50 to-gray-200", "from-stone-100 to-stone-300", "from-zinc-100 to-zinc-200"],
  bold_text:  ["from-black to-gray-900", "from-gray-950 to-slate-900", "from-neutral-950 to-gray-800", "from-zinc-900 to-zinc-950"],
  dark_cinema:["from-slate-900 to-gray-950", "from-gray-900 to-neutral-950", "from-zinc-900 to-slate-950", "from-neutral-900 to-gray-950"],
  bright_pop: ["from-purple-600 to-pink-600", "from-pink-500 to-rose-600", "from-violet-600 to-purple-700", "from-fuchsia-600 to-pink-700"],
  gradient:   ["from-blue-600 to-cyan-500", "from-indigo-600 to-blue-700", "from-cyan-600 to-teal-700", "from-sky-600 to-blue-800"],
}

const TONE_TITLES: Record<string, string[]> = {
  shocking:      ["THE TRUTH NOBODY TELLS YOU", "EVERYTHING CHANGED OVERNIGHT", "SHOCKING REVELATION", "I CAN'T BELIEVE THIS HAPPENED"],
  inspiring:     ["THIS WILL CHANGE YOUR LIFE", "FROM ZERO TO HERO", "THE BREAKTHROUGH YOU NEEDED", "UNLOCK YOUR FULL POTENTIAL"],
  educational:   ["EVERYTHING YOU NEED TO KNOW", "COMPLETE BEGINNER'S GUIDE", "THE ULTIMATE BREAKDOWN", "EXPLAINED IN 5 MINUTES"],
  controversial: ["THE DARK SIDE OF THIS INDUSTRY", "WHAT THEY DON'T WANT YOU TO SEE", "I WAS COMPLETELY WRONG", "THE REAL STORY EXPOSED"],
  funny:         ["I TRIED AND FAILED MISERABLY", "THIS SHOULDN'T HAVE WORKED", "WORST DECISION EVER (ACTUALLY WASN'T)", "HOW DID THIS EVEN HAPPEN"],
  curious:       ["WHAT HAPPENS WHEN YOU...", "THE EXPERIMENT NOBODY EXPECTED", "I TESTED THIS FOR 30 DAYS", "WHAT IF EVERYTHING WAS DIFFERENT"],
  urgent:        ["ACT NOW — LIMITED TIME", "LAST CHANCE TO SEE THIS", "DO THIS BEFORE IT'S TOO LATE", "BREAKING: THIS JUST HAPPENED"],
}

function generateId(): string {
  return `th_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function generateGenId(): string {
  return `gen_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function pickTitle(prompt: string, tone: ThumbnailTone, index: number): string {
  const toneOptions = TONE_TITLES[tone] ?? TONE_TITLES.shocking
  if (index === 0 && prompt.length > 10) {
    return prompt.toUpperCase().slice(0, 40).trim()
  }
  return toneOptions[index % toneOptions.length]
}

function pickGradient(style: ThumbnailStyle, index: number): string {
  const options = GRADIENT_MAP[style] ?? GRADIENT_MAP.dramatic
  return options[index % options.length]
}

function calcCtrScore(style: ThumbnailStyle, tone: ThumbnailTone, index: number): number {
  const base = { dramatic: 88, minimal: 72, bold_text: 91, dark_cinema: 85, bright_pop: 82, gradient: 79 }
  const toneBonus = { shocking: 8, controversial: 7, urgent: 6, curious: 4, inspiring: 3, educational: 2, funny: 1 }
  const noise = Math.floor(Math.random() * 7) - 3
  return Math.min(99, Math.max(60, (base[style] ?? 80) + (toneBonus[tone] ?? 0) + noise - index))
}

/**
 * PRIMARY FUNCTION — replace body to connect real AI backend
 */
export async function generateThumbnails(
  req: GenerationRequest
): Promise<GenerationResult> {
  // Simulate API latency (real AI call would happen here)
  await new Promise(r => setTimeout(r, 2200 + Math.random() * 1000))

  const genId = generateGenId()
  const count = req.count ?? req.variation_count ?? 4

  const thumbnails: Thumbnail[] = Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    project_id: req.project_id ?? null,
    user_id: "usr_1",
    prompt: req.prompt,
    title: pickTitle(req.prompt, req.tone, i),
    preview_gradient: pickGradient(req.style, i),
    preview_url: null,
    aspect_ratio: req.aspect_ratio as import("@/types").AspectRatio,
    style: req.style,
    category: req.category,
    tone: req.tone,
    ctr_score: calcCtrScore(req.style, req.tone, i),
    status: "done" as const,
    is_favorite: false,
    variation_index: i,
    generation_id: genId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))

  return {
    generation_id: genId,
    thumbnails,
    credits_used: count,
  }
}

// Streaming version for future real-time preview support
export async function* generateThumbnailsStream(
  req: GenerationRequest
): AsyncGenerator<{ index: number; thumbnail: Thumbnail }> {
  const count = req.count ?? req.variation_count ?? 4
  const genId = generateGenId()
  for (let i = 0; i < count; i++) {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
    yield {
      index: i,
      thumbnail: {
        id: generateId(),
        project_id: req.project_id ?? null,
        user_id: "usr_1",
        prompt: req.prompt,
        title: pickTitle(req.prompt, req.tone, i),
        preview_gradient: pickGradient(req.style, i),
        preview_url: null,
        aspect_ratio: req.aspect_ratio as import("@/types").AspectRatio,
        style: req.style,
        category: req.category,
        tone: req.tone,
        ctr_score: calcCtrScore(req.style, req.tone, i),
        status: "done" as const,
        is_favorite: false,
        variation_index: i,
        generation_id: genId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  }
}
