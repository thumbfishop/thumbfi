"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wand2, ChevronDown, Sparkles, BarChart2, Loader2, Download, RefreshCw, TrendingUp, Check, AlertCircle,
} from "lucide-react"
import type {
  ThumbnailCategory, ThumbnailStyle, ThumbnailTone, GenerationRequest,
} from "@/types"
import type { GeneratedThumbnail } from "@/lib/ai/types"
import { generateThumbnailsAction } from "@/lib/actions/generate"

const NICHES: { label: string; key: ThumbnailCategory }[] = [
  { label: "Crypto", key: "crypto" },
  { label: "Finance", key: "finance" },
  { label: "Gaming", key: "gaming" },
  { label: "AI & Tech", key: "ai_tech" },
  { label: "Lifestyle", key: "lifestyle" },
  { label: "Fitness", key: "fitness" },
  { label: "Podcast", key: "podcast" },
  { label: "News", key: "news" },
  { label: "Tutorial", key: "tutorial" },
  { label: "Vlog", key: "vlog" },
]

const STYLES: { label: string; key: ThumbnailStyle }[] = [
  { label: "Dramatic", key: "dramatic" },
  { label: "Minimal", key: "minimal" },
  { label: "Bold Text", key: "bold_text" },
  { label: "Dark Theme", key: "dark_cinema" },
  { label: "Bright & Pop", key: "bright_pop" },
  { label: "Cinematic", key: "gradient" },
]

const EMOTIONS: { label: string; key: ThumbnailTone }[] = [
  { label: "Shocking", key: "shocking" },
  { label: "Curious", key: "curious" },
  { label: "Inspiring", key: "inspiring" },
  { label: "Controversial", key: "controversial" },
  { label: "Educational", key: "educational" },
  { label: "Funny", key: "funny" },
]

const ASPECT_RATIOS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "9:16", w: 9, h: 16 },
]

type Stage = "idle" | "generating" | "done" | "error"

export default function StudioPage() {
  const [prompt, setPrompt] = useState("")
  const [niche, setNiche] = useState<{ label: string; key: ThumbnailCategory }>(NICHES[0])
  const [selectedStyles, setSelectedStyles] = useState<ThumbnailStyle[]>(["dramatic"])
  const [emotion, setEmotion] = useState<ThumbnailTone>("shocking")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [stage, setStage] = useState<Stage>("idle")
  const [results, setResults] = useState<GeneratedThumbnail[]>([])
  const [selectedVar, setSelectedVar] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showNicheMenu, setShowNicheMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const nicheRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!prompt.trim() || stage === "generating") return
    setStage("generating")
    setError(null)
    setResults([])
    setSelectedVar(0)
    try {
      const req: GenerationRequest = {
        prompt,
        style: selectedStyles[0] ?? "dramatic",
        category: niche.key,
        tone: emotion,
        color_palette: "auto",
        aspect_ratio: aspectRatio,
        count: 4,
      }
      const out = await generateThumbnailsAction(req)
      setResults(out.thumbnails)
      setStage("done")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed. Please try again.")
      setStage("error")
    }
  }

  const handleReset = () => {
    setStage("idle")
    setResults([])
    setError(null)
  }

  const toggleStyle = (s: ThumbnailStyle) => {
    setSelectedStyles(prev =>
      prev.includes(s) ? (prev.length > 1 ? prev.filter(x => x !== s) : prev) : [...prev, s]
    )
  }

  const downloadImage = async (url: string, name: string) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const objUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = objUrl
      a.download = `${name}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objUrl)
    } catch {
      window.open(url, "_blank")
    }
  }

  const ar = ASPECT_RATIOS.find(r => r.label === aspectRatio)!
  const aspectClass = aspectRatio === "9:16" ? "max-w-[260px]" : "w-full"
  const selected = results[selectedVar]

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col overflow-hidden">
      {/* Studio toolbar */}
      <div className="bg-white border-b border-[#EAD9CC]/60 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#FF7A00]" strokeWidth={2.2} />
          <h1 className="font-black text-[#2D1C12] text-sm">AI Studio</h1>
        </div>
        <div className="h-4 w-px bg-[#EAD9CC]" />
        <div className="flex items-center gap-1">
          {ASPECT_RATIOS.map(r => (
            <button
              key={r.label}
              onClick={() => setAspectRatio(r.label)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                aspectRatio === r.label ? "bg-[#FF7A00] text-white" : "text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {stage === "done" && selected && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAD9CC] text-xs font-semibold text-[#6B3F2A] hover:border-[#FF7A00]/40 transition-all"
              >
                <RefreshCw className="w-3 h-3" /> New Generation
              </button>
              <button
                onClick={() => downloadImage(selected.preview_url, selected.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "thumbnail")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:bg-[#e56e00] transition-all shadow-sm"
              >
                <Download className="w-3 h-3" /> Export PNG
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT: Controls */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-[#EAD9CC]/60 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Prompt */}
            <div>
              <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">AI Prompt</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your thumbnail idea…"
                disabled={stage === "generating"}
                className="w-full h-28 px-3.5 py-3 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] transition-colors text-[#2D1C12] placeholder-[#C4A898] text-xs leading-relaxed resize-none disabled:opacity-50"
              />
            </div>

            {/* Niche */}
            <div ref={nicheRef} className="relative">
              <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">Niche</label>
              <button
                onClick={() => setShowNicheMenu(!showNicheMenu)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 border-[#EAD9CC] bg-white hover:border-[#FF7A00]/40 transition-all text-sm font-semibold text-[#2D1C12]"
              >
                {niche.label}
                <ChevronDown className={`w-4 h-4 text-[#9A7560] transition-transform ${showNicheMenu ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showNicheMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-[#EAD9CC] shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {NICHES.map(n => (
                      <button
                        key={n.key}
                        onClick={() => { setNiche(n); setShowNicheMenu(false) }}
                        className={`w-full text-left px-3.5 py-2 text-sm font-medium transition-colors ${
                          niche.key === n.key ? "bg-[#FF7A00]/8 text-[#FF7A00] font-bold" : "text-[#2D1C12] hover:bg-[#F5EDE3]"
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">Visual Style</label>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => toggleStyle(s.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedStyles.includes(s.key)
                        ? "bg-[#FF7A00] text-white shadow-sm"
                        : "border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#FF7A00]/40 hover:text-[#FF7A00]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion */}
            <div>
              <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">Emotion Trigger</label>
              <div className="flex flex-wrap gap-1.5">
                {EMOTIONS.map(e => (
                  <button
                    key={e.key}
                    onClick={() => setEmotion(e.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      emotion === e.key
                        ? "bg-[#2D1C12] text-white"
                        : "border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#2D1C12]/30 hover:text-[#2D1C12]"
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={stage === "generating" || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#FF7A00] text-white font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e56e00] transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5"
            >
              {stage === "generating"
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                : <><Sparkles className="w-4 h-4" /> Generate Thumbnail</>}
            </button>
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div className="flex-1 bg-[#F5EDE3]/30 flex flex-col items-center justify-center p-6 overflow-auto min-w-0">
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#FF7A00]/10 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-[#FF7A00]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-black text-[#2D1C12] text-lg">Ready to Generate</h3>
                  <p className="text-[#9A7560] text-sm mt-1 max-w-xs">
                    Enter a prompt in the left panel and click Generate to create your thumbnail.
                  </p>
                </div>
              </motion.div>
            )}

            {stage === "generating" && (
              <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`${aspectClass} max-w-2xl`}>
                <div className="rounded-2xl overflow-hidden shadow-2xl relative" style={{ aspectRatio: `${ar.w}/${ar.h}` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/20 to-amber-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-[#FF7A00] animate-spin mx-auto mb-3" />
                      <p className="text-[#6B3F2A] text-sm font-semibold">AI is generating…</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "error" && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="font-black text-[#2D1C12]">Generation failed</h3>
                  <p className="text-[#9A7560] text-sm mt-1 max-w-xs">{error}</p>
                </div>
                <button onClick={handleGenerate} className="px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-sm font-bold hover:bg-[#e56e00] transition-all">
                  Try again
                </button>
              </motion.div>
            )}

            {stage === "done" && selected && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className={`${aspectClass} max-w-2xl w-full`}>
                {/* Main canvas */}
                <div className="rounded-2xl overflow-hidden shadow-2xl relative mb-4" style={{ aspectRatio: `${ar.w}/${ar.h}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.preview_url} alt={selected.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-white font-black text-2xl leading-tight drop-shadow-lg line-clamp-2">{selected.title}</div>
                    <div className="text-white/60 text-sm mt-2 font-semibold">{niche.label} · Generated by ThumbFi AI</div>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold">
                    <TrendingUp className="w-3 h-3" /> CTR {selected.ctr_score}%
                  </div>
                </div>

                {/* Variation strip */}
                <div className="flex gap-2">
                  {results.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVar(i)}
                      className={`flex-1 rounded-xl overflow-hidden relative transition-all ${
                        selectedVar === i ? "ring-2 ring-[#FF7A00] ring-offset-2" : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ aspectRatio: `${ar.w}/${ar.h}` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v.preview_url} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                      {selectedVar === i && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF7A00] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Analysis */}
        <div className="w-72 flex-shrink-0 bg-white border-l border-[#EAD9CC]/60 overflow-y-auto">
          <div className="p-5 space-y-5">
            {stage === "done" && selected ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black text-[#2D1C12] uppercase tracking-wider">Performance</h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {selected.ctr_score >= 90 ? "Excellent" : selected.ctr_score >= 80 ? "Strong" : "Good"}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-[#FF7A00] to-amber-500 p-5 text-center">
                    <div className="text-5xl font-black text-white">{selected.ctr_score}</div>
                    <div className="text-white/70 text-sm mt-1 font-semibold">/ 100 CTR Score</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">Details</h3>
                  <div className="space-y-2 text-xs text-[#6B3F2A]">
                    <div className="flex justify-between"><span className="text-[#9A7560]">Niche</span><span className="font-semibold">{niche.label}</span></div>
                    <div className="flex justify-between capitalize"><span className="text-[#9A7560]">Emotion</span><span className="font-semibold">{emotion}</span></div>
                    <div className="flex justify-between"><span className="text-[#9A7560]">Aspect</span><span className="font-semibold">{aspectRatio}</span></div>
                    <div className="flex justify-between"><span className="text-[#9A7560]">Variation</span><span className="font-semibold">{selectedVar + 1} of {results.length}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">Export</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => downloadImage(selected.preview_url, selected.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "thumbnail")}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FF7A00] text-white text-sm font-bold hover:bg-[#e56e00] transition-all"
                    >
                      <Download className="w-4 h-4" /> Download PNG
                    </button>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(selected.preview_url); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#EAD9CC] text-sm font-semibold text-[#2D1C12] hover:border-[#FF7A00]/40 transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />}
                      {copied ? "Copied link!" : "Copy image link"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] flex items-center justify-center mb-3">
                  <BarChart2 className="w-6 h-6 text-[#C4A898]" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#2D1C12] text-sm">Analysis</h3>
                <p className="text-xs text-[#9A7560] mt-1 max-w-[160px] leading-relaxed">
                  Generate a thumbnail to see its CTR score and export options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
