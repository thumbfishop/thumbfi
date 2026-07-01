import type { ThumbnailStyle, ThumbnailTone } from "@/types"

const TONE_TITLES: Record<ThumbnailTone, string[]> = {
  shocking:      ["THE TRUTH NOBODY TELLS YOU", "THIS CHANGED EVERYTHING", "YOU WON'T BELIEVE THIS", "I WAS SHOCKED"],
  inspiring:     ["THIS WILL CHANGE YOUR LIFE", "FROM ZERO TO HERO", "THE BREAKTHROUGH YOU NEED", "UNLOCK YOUR POTENTIAL"],
  educational:   ["EVERYTHING YOU NEED TO KNOW", "THE COMPLETE GUIDE", "EXPLAINED IN 5 MINUTES", "MASTER THIS TODAY"],
  controversial: ["WHAT THEY DON'T WANT YOU TO SEE", "THE DARK SIDE", "I WAS COMPLETELY WRONG", "THE REAL STORY"],
  funny:         ["THIS SHOULDN'T HAVE WORKED", "WORST IDEA EVER", "HOW DID THIS HAPPEN", "I TRIED IT SO YOU DON'T"],
  curious:       ["WHAT HAPPENS WHEN YOU...", "THE EXPERIMENT NOBODY EXPECTED", "I TESTED THIS FOR 30 DAYS", "WHAT IF..."],
  urgent:        ["ACT NOW — LIMITED TIME", "DO THIS BEFORE IT'S TOO LATE", "BREAKING: THIS JUST HAPPENED", "LAST CHANCE"],
}

/** Heuristic title: first variation echoes the prompt; others use tone hooks. */
export function pickTitle(prompt: string, tone: ThumbnailTone, index: number): string {
  const clean = prompt.trim()
  if (index === 0 && clean.length > 6) {
    return clean.toUpperCase().slice(0, 42).trim()
  }
  const options = TONE_TITLES[tone] ?? TONE_TITLES.shocking
  return options[index % options.length]
}

const STYLE_BASE: Record<ThumbnailStyle, number> = {
  dramatic: 88, minimal: 74, bold_text: 91, dark_cinema: 85, bright_pop: 83, gradient: 79,
}
const TONE_BONUS: Record<ThumbnailTone, number> = {
  shocking: 8, controversial: 7, urgent: 6, curious: 4, inspiring: 3, educational: 2, funny: 1,
}

/** Rule-based CTR-style score (60–99), deterministic per style/tone/seed. */
export function calcCtrScore(style: ThumbnailStyle, tone: ThumbnailTone, index: number, seed: number): number {
  const base = STYLE_BASE[style] ?? 80
  const bonus = TONE_BONUS[tone] ?? 0
  const noise = (seed % 7) - 3 // -3..+3, stable for a given seed
  return Math.min(99, Math.max(60, base + bonus + noise - index))
}
