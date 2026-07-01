"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wand2, ChevronDown, Sparkles, BarChart2, Clock,
} from "lucide-react"

const NICHES = ["Crypto", "Finance", "Gaming", "AI & Tech", "Lifestyle", "Fitness", "Podcast", "News", "Tutorial", "Vlog"]
const STYLES = ["Dramatic", "Minimal", "Bold Text", "Dark Theme", "Bright & Pop", "Cinematic"]
const EMOTIONS = ["Shocking", "Curious", "Inspiring", "Controversial", "Educational", "Funny"]

const ASPECT_RATIOS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "9:16", w: 9, h: 16 },
]

type Stage = "idle" | "unavailable"

export default function StudioPage() {
  const [prompt, setPrompt] = useState("")
  const [niche, setNiche] = useState("Crypto")
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Dramatic"])
  const [selectedEmotion, setSelectedEmotion] = useState("Shocking")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [stage, setStage] = useState<Stage>("idle")
  const [showNicheMenu, setShowNicheMenu] = useState(false)
  const nicheRef = useRef<HTMLDivElement>(null)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setStage("unavailable")
  }

  const toggleStyle = (s: string) => {
    setSelectedStyles(prev =>
      prev.includes(s) ? (prev.length > 1 ? prev.filter(x => x !== s) : prev) : [...prev, s]
    )
  }

  const ar = ASPECT_RATIOS.find(r => r.label === aspectRatio)!

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
                className="w-full h-28 px-3.5 py-3 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] transition-colors text-[#2D1C12] placeholder-[#C4A898] text-xs leading-relaxed resize-none"
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
              disabled={!prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#FF7A00] text-white font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e56e00] transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" /> Generate Thumbnail
            </button>
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div className="flex-1 bg-[#F5EDE3]/30 flex flex-col items-center justify-center p-6 overflow-auto min-w-0">
          <AnimatePresence mode="wait">
            {stage === "idle" ? (
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
              </motion.div>
            ) : (
              <motion.div
                key="unavailable"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md"
              >
                <div
                  className="rounded-2xl overflow-hidden border-2 border-dashed border-[#EAD9CC] bg-white flex flex-col items-center justify-center text-center gap-3 p-8"
                  style={{ aspectRatio: `${ar.w}/${ar.h}` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF7EF] flex items-center justify-center">
                    <Clock className="w-7 h-7 text-[#FF7A00]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-black text-[#2D1C12]">AI generation is coming soon</h3>
                    <p className="text-[#9A7560] text-sm mt-1 max-w-xs">
                      The generation engine isn&apos;t connected yet. Your prompt and settings are saved — you&apos;ll be able to generate real thumbnails here shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setStage("idle")}
                    className="mt-1 px-4 py-2 rounded-xl border border-[#EAD9CC] text-xs font-semibold text-[#6B3F2A] hover:border-[#FF7A00]/40 transition-all"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Analysis (available once generation is connected) */}
        <div className="w-72 flex-shrink-0 bg-white border-l border-[#EAD9CC]/60 overflow-y-auto">
          <div className="p-5">
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] flex items-center justify-center mb-3">
                <BarChart2 className="w-6 h-6 text-[#C4A898]" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[#2D1C12] text-sm">Analysis</h3>
              <p className="text-xs text-[#9A7560] mt-1 max-w-[160px] leading-relaxed">
                CTR analysis and optimization tips will appear here once generation is connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
