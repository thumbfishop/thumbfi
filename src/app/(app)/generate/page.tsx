"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Wand2, Sparkles, Zap, RefreshCw, Download, Eye, Star,
  ChevronDown, Check, Loader2, ArrowRight, X
} from "lucide-react"
import { generateThumbnails } from "@/lib/api/ai.service"
import type { ThumbnailStyle, ThumbnailCategory, ThumbnailTone, ColorPalette, GenerationRequest, GenerationResult } from "@/types"

const STYLES: { key: ThumbnailStyle; label: string; desc: string; emoji: string }[] = [
  { key: "dramatic",    label: "Dramatic",    desc: "Bold contrast, high impact",    emoji: "🔥" },
  { key: "minimal",     label: "Minimal",     desc: "Clean, professional look",      emoji: "✨" },
  { key: "bold_text",   label: "Bold Text",   desc: "Text-forward, power words",     emoji: "💥" },
  { key: "dark_cinema", label: "Dark Cinema", desc: "Cinematic, moody atmosphere",   emoji: "🎬" },
  { key: "bright_pop",  label: "Bright Pop",  desc: "Vibrant, attention-grabbing",   emoji: "🎯" },
  { key: "gradient",    label: "Gradient",    desc: "Smooth color transitions",      emoji: "🌈" },
]

const CATEGORIES: { key: ThumbnailCategory; label: string; emoji: string }[] = [
  { key: "crypto",    label: "Crypto",    emoji: "₿" },
  { key: "finance",   label: "Finance",   emoji: "💰" },
  { key: "gaming",    label: "Gaming",    emoji: "🎮" },
  { key: "ai_tech",   label: "AI & Tech", emoji: "🤖" },
  { key: "lifestyle", label: "Lifestyle", emoji: "🌿" },
  { key: "tutorial",  label: "Tutorial",  emoji: "📚" },
  { key: "news",      label: "News",      emoji: "📰" },
  { key: "fitness",   label: "Fitness",   emoji: "💪" },
  { key: "podcast",   label: "Podcast",   emoji: "🎙️" },
  { key: "vlog",      label: "Vlog",      emoji: "📹" },
]

const TONES: { key: ThumbnailTone; label: string }[] = [
  { key: "shocking",     label: "Shocking" },
  { key: "inspiring",    label: "Inspiring" },
  { key: "controversial",label: "Controversial" },
  { key: "educational",  label: "Educational" },
  { key: "curious",      label: "Curious" },
  { key: "urgent",       label: "Urgent" },
  { key: "funny",        label: "Funny" },
]

const PALETTES: { key: ColorPalette; label: string; colors: string[] }[] = [
  { key: "auto",         label: "Auto",     colors: ["#FF7A00","#FFB347","#FFF7EF"] },
  { key: "fire",         label: "Fire",     colors: ["#FF4500","#FF8C00","#FFD700"] },
  { key: "ocean",        label: "Ocean",    colors: ["#003366","#0099CC","#00CCFF"] },
  { key: "neon",         label: "Neon",     colors: ["#39FF14","#FF073A","#0FFF50"] },
  { key: "gold",         label: "Gold",     colors: ["#FFD700","#B8860B","#FFF8DC"] },
  { key: "dark",         label: "Dark",     colors: ["#1A1A2E","#16213E","#0F3460"] },
  { key: "vibrant",      label: "Vibrant",  colors: ["#E040FB","#3D5AFE","#00E5FF"] },
  { key: "monochrome",   label: "Mono",     colors: ["#000000","#444444","#FFFFFF"] },
]

const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:3"]

const PROMPT_SUGGESTIONS = [
  "Bitcoin crashes below $30K — shocked crypto trader reaction",
  "I made $100K on YouTube in 2025 — here's how",
  "AI destroyed my career and THIS happened next",
  "The dark truth about passive income nobody tells you",
  "I tried every productivity hack for 30 days — results",
  "Why 99% of people fail at investing",
]

function VariationCard({ thumb, delay, onFavorite }: {
  thumb: GenerationResult["thumbnails"][0]
  delay: number
  onFavorite: (id: string) => void
}) {
  const [fav, setFav] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
        <div className={`absolute inset-0 bg-gradient-to-br ${thumb.preview_gradient}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white font-black text-xs leading-tight line-clamp-2">{thumb.title}</p>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Link
              href={`/editor/${thumb.id}`}
              className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Eye className="w-4 h-4 text-white" />
            </Link>
            <button className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Download className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => { setFav(!fav); onFavorite(thumb.id) }}
              className={`w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center transition-all ${fav ? "bg-amber-400/80" : "bg-white/20 hover:bg-white/30"}`}
            >
              <Star className={`w-4 h-4 ${fav ? "text-white fill-white" : "text-white"}`} />
            </button>
          </div>
        </div>

        {/* CTR score badge */}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-black text-white shadow-md ${
          thumb.ctr_score >= 90 ? "bg-emerald-500" : "bg-[#FF7A00]"
        }`}>
          {thumb.ctr_score}% CTR
        </div>
      </div>

      <div className="mt-2 px-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#2D1C12] truncate">{thumb.title}</p>
            <p className="text-[10px] text-[#9A7560] capitalize">{thumb.style.replace("_", " ")} · {thumb.aspect_ratio}</p>
          </div>
          <Link href={`/editor/${thumb.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-3.5 h-3.5 text-[#FF7A00]" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

function GeneratingAnimation() {
  const stages = [
    "Analyzing your prompt...",
    "Selecting optimal style...",
    "Generating color palette...",
    "Composing layout...",
    "Adding text overlays...",
    "Applying final effects...",
    "Optimizing for CTR...",
  ]
  const [stage, setStage] = useState(0)

  useState(() => {
    const interval = setInterval(() => {
      setStage(s => (s + 1) % stages.length)
    }, 500)
    return () => clearInterval(interval)
  })

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-[#FF7A00] flex items-center justify-center">
          <Wand2 className="w-7 h-7 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-[#FF7A00] animate-ping opacity-30" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="font-black text-[#2D1C12]">Generating your thumbnails...</p>
        <p className="text-sm text-[#9A7560]">{stages[stage]}</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#FF7A00]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
      <p className="text-xs text-[#C4A898]">This usually takes 3–5 seconds</p>
    </div>
  )
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState<ThumbnailStyle>("dramatic")
  const [category, setCategory] = useState<ThumbnailCategory>("crypto")
  const [tone, setTone] = useState<ThumbnailTone>("shocking")
  const [palette, setPalette] = useState<ColorPalette>("auto")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [count, setCount] = useState(4)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const req: GenerationRequest = { prompt, style, category, tone, color_palette: palette, aspect_ratio: aspectRatio, count }
      const res = await generateThumbnails(req)
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* LEFT: Controls */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5"
          >
            <h2 className="font-black text-[#2D1C12] text-sm mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#FF7A00]" />
              Prompt
            </h2>
            <textarea
              ref={promptRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your video — what happens, who's in it, the emotion you want to capture..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#EAD9CC] bg-[#FFF7EF] focus:outline-none focus:border-[#FF7A00] text-sm text-[#2D1C12] placeholder-[#C4A898] resize-none transition-colors"
            />
            <div className="mt-2">
              <p className="text-[10px] font-bold text-[#9A7560] uppercase tracking-wider mb-2">Suggestions</p>
              <div className="space-y-1">
                {PROMPT_SUGGESTIONS.slice(0, 3).map(s => (
                  <button
                    key={s}
                    onClick={() => { setPrompt(s); promptRef.current?.focus() }}
                    className="w-full text-left text-[11px] text-[#6B3F2A] px-3 py-1.5 rounded-lg bg-[#FFF7EF] hover:bg-[#F5EDE3] transition-colors truncate"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5"
          >
            <h2 className="font-black text-[#2D1C12] text-sm mb-3">Style</h2>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map(s => (
                <button
                  key={s.key}
                  onClick={() => setStyle(s.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                    style === s.key
                      ? "bg-[#FF7A00] text-white shadow-md"
                      : "bg-[#FFF7EF] hover:bg-[#F5EDE3] text-[#2D1C12]"
                  }`}
                >
                  <span className="text-sm">{s.emoji}</span>
                  <div>
                    <p className="text-[11px] font-bold">{s.label}</p>
                    <p className={`text-[9px] ${style === s.key ? "text-white/80" : "text-[#9A7560]"}`}>{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5"
          >
            <h2 className="font-black text-[#2D1C12] text-sm mb-3">Category</h2>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    category === c.key
                      ? "bg-[#2D1C12] text-white"
                      : "bg-[#FFF7EF] text-[#6B3F2A] hover:bg-[#F5EDE3]"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5"
          >
            <h2 className="font-black text-[#2D1C12] text-sm mb-3">Tone</h2>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTone(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    tone === t.key
                      ? "bg-[#FF7A00] text-white"
                      : "bg-[#FFF7EF] text-[#6B3F2A] hover:bg-[#F5EDE3]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Color palette */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5"
          >
            <h2 className="font-black text-[#2D1C12] text-sm mb-3">Color Palette</h2>
            <div className="grid grid-cols-4 gap-2">
              {PALETTES.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPalette(p.key)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    palette === p.key ? "bg-[#FFF7EF] ring-2 ring-[#FF7A00]" : "hover:bg-[#FFF7EF]"
                  }`}
                >
                  <div className="flex gap-0.5">
                    {p.colors.map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold text-[#6B3F2A]">{p.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Aspect ratio + count */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="font-black text-[#2D1C12] text-sm mb-2">Aspect</h2>
                <div className="grid grid-cols-2 gap-1">
                  {ASPECT_RATIOS.map(r => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        aspectRatio === r ? "bg-[#2D1C12] text-white" : "bg-[#FFF7EF] text-[#6B3F2A] hover:bg-[#F5EDE3]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-black text-[#2D1C12] text-sm mb-2">Variations</h2>
                <div className="grid grid-cols-2 gap-1">
                  {[1, 2, 4, 8].map(n => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        count === n ? "bg-[#2D1C12] text-white" : "bg-[#FFF7EF] text-[#6B3F2A] hover:bg-[#F5EDE3]"
                      }`}
                    >
                      {n}×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Generate button */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full py-4 rounded-2xl bg-[#FF7A00] text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-[#e56e00] disabled:opacity-40 transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5 disabled:translate-y-0"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Wand2 className="w-4 h-4" /> Generate Thumbnails</>
            )}
          </motion.button>
        </div>

        {/* RIGHT: Output */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white rounded-2xl border border-[#EAD9CC]/60 min-h-96"
          >
            {loading ? (
              <GeneratingAnimation />
            ) : result ? (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-black text-[#2D1C12]">{result.thumbnails.length} Variations Generated</h2>
                    <p className="text-xs text-[#9A7560] mt-0.5">{result.credits_used} credit{result.credits_used !== 1 ? "s" : ""} used</p>
                  </div>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAD9CC] text-xs font-bold text-[#6B3F2A] hover:border-[#FF7A00]/40 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {result.thumbnails.map((t, i) => (
                    <VariationCard key={t.id} thumb={t} delay={i * 0.1} onFavorite={() => {}} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 gap-4 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF7EF] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#FF7A00]" />
                </div>
                <div>
                  <p className="font-black text-[#2D1C12] mb-1">Ready to generate</p>
                  <p className="text-sm text-[#9A7560] leading-relaxed">
                    Write a prompt describing your video content, choose a style, and hit Generate.
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 gap-2 mt-2">
                  {PROMPT_SUGGESTIONS.slice(0, 4).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setPrompt(s); promptRef.current?.focus() }}
                      className="text-left text-[11px] text-[#6B3F2A] px-3 py-2 rounded-xl bg-[#FFF7EF] hover:bg-[#F5EDE3] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
