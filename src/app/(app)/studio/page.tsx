"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wand2, ChevronDown, Loader2, Download, Copy, RefreshCw,
  Sparkles, ZoomIn, SlidersHorizontal, Check, Share2,
  TrendingUp, Eye, Smile, Type, BarChart2, History, X
} from "lucide-react"

type Stage = "idle" | "generating" | "done"

const NICHES = ["Crypto", "Finance", "Gaming", "AI & Tech", "Lifestyle", "Fitness", "Podcast", "News", "Tutorial", "Vlog"]
const STYLES = ["Dramatic", "Minimal", "Bold Text", "Dark Theme", "Bright & Pop", "Cinematic"]
const EMOTIONS = ["Shocking", "Curious", "Inspiring", "Controversial", "Educational", "Funny"]
const ASPECT_RATIOS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "9:16", w: 9, h: 16 },
]

const VARIATIONS = [
  { gradient: "from-orange-500 via-amber-400 to-yellow-300", text: "BITCOIN CRASHES $30K", ctr: 94 },
  { gradient: "from-slate-900 to-slate-700", text: "THE DARK TRUTH REVEALED", ctr: 91 },
  { gradient: "from-blue-700 to-cyan-600", text: "EXPERTS WERE WRONG", ctr: 88 },
  { gradient: "from-red-600 to-rose-900", text: "I LOST EVERYTHING", ctr: 96 },
]

const ANALYSIS = [
  { label: "CTR Potential", value: 94, color: "#10b981", icon: TrendingUp },
  { label: "Readability", value: 97, color: "#3b82f6", icon: Type },
  { label: "Visual Impact", value: 91, color: "#FF7A00", icon: Eye },
  { label: "Emotion Score", value: 88, color: "#a855f7", icon: Smile },
]

export default function StudioPage() {
  const [prompt, setPrompt] = useState("")
  const [niche, setNiche] = useState("Crypto")
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Dramatic"])
  const [selectedEmotion, setSelectedEmotion] = useState("Shocking")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [stage, setStage] = useState<Stage>("idle")
  const [progress, setProgress] = useState(0)
  const [selectedVar, setSelectedVar] = useState(0)
  const [showNicheMenu, setShowNicheMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const nicheRef = useRef<HTMLDivElement>(null)

  // Auto-generation progress simulation
  useEffect(() => {
    if (stage !== "generating") return
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setStage("done")
          return 100
        }
        return p + Math.random() * 8 + 2
      })
    }, 80)
    return () => clearInterval(interval)
  }, [stage])

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setStage("generating")
    setProgress(0)
  }

  const handleReset = () => {
    setStage("idle")
    setProgress(0)
  }

  const toggleStyle = (s: string) => {
    setSelectedStyles(prev =>
      prev.includes(s) ? (prev.length > 1 ? prev.filter(x => x !== s) : prev) : [...prev, s]
    )
  }

  const ar = ASPECT_RATIOS.find(r => r.label === aspectRatio)!
  const aspectClass = aspectRatio === "9:16" ? "max-w-[260px]" : "w-full"

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
          {ASPECT_RATIOS.map(ar => (
            <button
              key={ar.label}
              onClick={() => setAspectRatio(ar.label)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                aspectRatio === ar.label ? "bg-[#FF7A00] text-white" : "text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3]"
              }`}
            >
              {ar.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {stage === "done" && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAD9CC] text-xs font-semibold text-[#6B3F2A] hover:border-[#FF7A00]/40 transition-all"
              >
                <RefreshCw className="w-3 h-3" /> New Generation
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:bg-[#e56e00] transition-all shadow-sm">
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
                placeholder="Describe your thumbnail idea…&#10;e.g. 'Bitcoin price crashes to $30K, shocked crypto trader face, dramatic red background'"
                disabled={stage === "generating"}
                className="w-full h-28 px-3.5 py-3 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] transition-colors text-[#2D1C12] placeholder-[#C4A898] text-xs leading-relaxed resize-none disabled:opacity-50"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-[#9A7560]">{prompt.length}/500 chars</span>
              </div>
            </div>

            {/* Niche */}
            <div ref={nicheRef} className="relative">
              <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">Niche</label>
              <button
                onClick={() => setShowNicheMenu(!showNicheMenu)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 border-[#EAD9CC] bg-white hover:border-[#FF7A00]/40 transition-all text-sm font-semibold text-[#2D1C12]"
              >
                {niche}
                <ChevronDown className={`w-4 h-4 text-[#9A7560] transition-transform ${showNicheMenu ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showNicheMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-[#EAD9CC] shadow-lg z-50 overflow-hidden"
                  >
                    {NICHES.map(n => (
                      <button
                        key={n}
                        onClick={() => { setNiche(n); setShowNicheMenu(false) }}
                        className={`w-full text-left px-3.5 py-2 text-sm font-medium transition-colors ${
                          niche === n ? "bg-[#FF7A00]/8 text-[#FF7A00] font-bold" : "text-[#2D1C12] hover:bg-[#F5EDE3]"
                        }`}
                      >
                        {n}
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
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedStyles.includes(s)
                        ? "bg-[#FF7A00] text-white shadow-sm"
                        : "border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#FF7A00]/40 hover:text-[#FF7A00]"
                    }`}
                  >
                    {s}
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
                    key={e}
                    onClick={() => setSelectedEmotion(e)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedEmotion === e
                        ? "bg-[#2D1C12] text-white"
                        : "border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#2D1C12]/30 hover:text-[#2D1C12]"
                    }`}
                  >
                    {e}
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
              {stage === "generating" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Thumbnail</>
              )}
            </button>

            {/* Generation progress */}
            {stage === "generating" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#9A7560]">Processing...</span>
                  <span className="text-[#FF7A00]">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FF7A00] to-amber-400 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#9A7560] text-center">
                  {progress < 30 ? "Analyzing prompt context..." :
                   progress < 60 ? "Generating visual concepts..." :
                   progress < 85 ? "Applying CTR optimization..." :
                   "Finalizing variations..."}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div className="flex-1 bg-[#F5EDE3]/30 flex flex-col items-center justify-center p-6 overflow-auto min-w-0">
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-[#FF7A00]/10 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-[#FF7A00]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-black text-[#2D1C12] text-lg">Ready to Generate</h3>
                  <p className="text-[#9A7560] text-sm mt-1 max-w-xs">
                    Enter a prompt in the left panel and click Generate to create your thumbnail.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Bitcoin crash thumbnail", "Gaming highlights", "Finance tips", "AI news"].map(ex => (
                    <button
                      key={ex}
                      onClick={() => setPrompt(ex)}
                      className="px-3 py-1.5 rounded-xl border border-[#EAD9CC] text-xs font-semibold text-[#6B3F2A] hover:border-[#FF7A00]/40 hover:text-[#FF7A00] transition-all bg-white"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === "generating" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`${aspectClass} max-w-2xl`}
              >
                <div
                  className="rounded-2xl overflow-hidden shadow-2xl relative"
                  style={{ aspectRatio: `${ar.w}/${ar.h}` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/20 to-amber-900/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 rounded-full border-4 border-[#FF7A00]/30 border-t-[#FF7A00] mx-auto mb-3"
                        />
                        <p className="text-white/60 text-sm font-semibold">AI is generating...</p>
                        <p className="text-white/30 text-xs mt-1">{Math.round(progress)}% complete</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`${aspectClass} max-w-2xl w-full`}
              >
                {/* Main canvas */}
                <div
                  className="rounded-2xl overflow-hidden shadow-2xl relative mb-4 cursor-pointer"
                  style={{ aspectRatio: `${ar.w}/${ar.h}` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${VARIATIONS[selectedVar].gradient}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="text-white font-black text-3xl leading-tight drop-shadow-lg">
                        {VARIATIONS[selectedVar].text}
                      </div>
                      <div className="text-white/60 text-sm mt-2 font-semibold">
                        {niche} · {selectedEmotion} · Generated by ThumbFi AI
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 px-2.5 py-1.5 rounded-lg bg-black/30 backdrop-blur-sm text-white text-xs font-bold">
                      {aspectRatio}
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold">
                      <TrendingUp className="w-3 h-3" />
                      CTR {VARIATIONS[selectedVar].ctr}%
                    </div>
                  </div>
                </div>

                {/* Variation strip */}
                <div className="flex gap-2">
                  {VARIATIONS.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVar(i)}
                      className={`flex-1 rounded-xl overflow-hidden relative transition-all ${
                        selectedVar === i ? "ring-2 ring-[#FF7A00] ring-offset-2" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`w-full bg-gradient-to-br ${v.gradient}`}
                        style={{ aspectRatio: `${ar.w}/${ar.h}` }}
                      />
                      {selectedVar === i && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF7A00] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center">
                        <span className="text-[8px] font-bold text-white bg-black/40 px-1 rounded-sm">{v.ctr}%</span>
                      </div>
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
            {stage === "done" ? (
              <>
                {/* Overall score */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black text-[#2D1C12] uppercase tracking-wider">Performance</h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Excellent</span>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-[#FF7A00] to-amber-500 p-5 text-center">
                    <div className="text-5xl font-black text-white">{VARIATIONS[selectedVar].ctr}</div>
                    <div className="text-white/70 text-sm mt-1 font-semibold">/ 100 CTR Score</div>
                    <div className="mt-3 text-xs text-white/60">Top 8% of all thumbnails this week</div>
                  </div>
                </div>

                {/* Analysis bars */}
                <div className="space-y-3">
                  {ANALYSIS.map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <item.icon className="w-3 h-3" style={{ color: item.color }} strokeWidth={2.5} />
                          <span className="text-xs font-semibold text-[#6B3F2A]">{item.label}</span>
                        </div>
                        <span className="text-xs font-black" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI suggestions */}
                <div>
                  <h3 className="text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">AI Suggestions</h3>
                  <div className="space-y-2">
                    {[
                      "Add a bold number (e.g. '$100K') to increase urgency",
                      "Increase face size for +12% more clicks",
                      "Try a red arrow pointing up for price context",
                    ].map((s, i) => (
                      <div key={i} className="flex gap-2 p-2.5 rounded-xl bg-[#FFF7EF] border border-[#FF7A00]/10">
                        <Sparkles className="w-3 h-3 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[#6B3F2A] leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export options */}
                <div>
                  <h3 className="text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-2">Export</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FF7A00] text-white text-sm font-bold hover:bg-[#e56e00] transition-all">
                      <Download className="w-4 h-4" /> Download PNG (4K)
                    </button>
                    <button className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#EAD9CC] text-sm font-semibold text-[#2D1C12] hover:border-[#FF7A00]/40 transition-all">
                      <Download className="w-4 h-4" /> Download JPG
                    </button>
                    <button
                      onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                      className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#EAD9CC] text-sm font-semibold text-[#2D1C12] hover:border-[#FF7A00]/40 transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] flex items-center justify-center mb-3">
                  <BarChart2 className="w-6 h-6 text-[#C4A898]" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#2D1C12] text-sm">Analysis Ready</h3>
                <p className="text-xs text-[#9A7560] mt-1 max-w-[160px] leading-relaxed">
                  Generate a thumbnail to see CTR analysis, optimization tips, and export options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
