"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight, Play, Sparkles, CheckCircle2, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ─── Typing animation ──────────────────────────────────────── */
const PROMPTS = [
  "Create a viral crypto thumbnail showing Bitcoin breaking $100k with dramatic explosion",
  "Gaming speedrun world record — high energy, dark background, massive text",
  "Finance: How I made $50k in one month using AI side hustles",
  "Dark truth about real estate nobody wants you to know",
  "AI is replacing jobs — here's exactly how to stay ahead in 2025",
]

function useTypingEffect(texts: string[], speed = 42) {
  const [display, setDisplay] = useState("")
  const [ti, setTi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  const [wait, setWait] = useState(false)

  useEffect(() => {
    if (wait) return
    const cur = texts[ti]
    const ms = del ? speed / 2.2 : speed
    const t = setTimeout(() => {
      if (!del) {
        if (ci < cur.length) { setDisplay(cur.slice(0, ci + 1)); setCi(c => c + 1) }
        else { setWait(true); setTimeout(() => { setWait(false); setDel(true) }, 2800) }
      } else {
        if (ci > 0) { setDisplay(cur.slice(0, ci - 1)); setCi(c => c - 1) }
        else { setDel(false); setTi(i => (i + 1) % texts.length) }
      }
    }, ms)
    return () => clearTimeout(t)
  }, [ci, del, ti, texts, speed, wait])
  return display
}

/* ─── Generation state machine ──────────────────────────────── */
type Stage = "idle" | "generating" | "done"

function useGenerationLoop() {
  const [stage, setStage] = useState<Stage>("idle")
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    const cycle = () => {
      setStage("generating")
      setPct(0)
      interval = setInterval(() => {
        setPct(p => {
          const next = p + Math.random() * 6 + 2
          if (next >= 100) {
            clearInterval(interval)
            setStage("done")
            setTimeout(() => { setStage("idle"); setPct(0); setTimeout(cycle, 2200) }, 3500)
            return 100
          }
          return next
        })
      }, 75)
    }
    const t = setTimeout(cycle, 1600)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  return { stage, pct }
}

/* ─── Floating thumbnails ────────────────────────────────────── */
const THUMBS = [
  { id: 1, title: "BITCOIN CRASH", sub: "$100K → $0?", emoji: "₿", g: "from-orange-500 to-red-600", pos: "-top-6 -left-[7%]", rot: "-8deg", dur: 4.2, delay: 0 },
  { id: 2, title: "10X YOUR INCOME", sub: "AI Side Hustles 2025", emoji: "💰", g: "from-amber-400 to-orange-500", pos: "-top-4 -right-[7%]", rot: "6deg", dur: 5.1, delay: 0.7 },
  { id: 3, title: "DARK TRUTH", sub: "Nobody Tells You", emoji: "👁️", g: "from-slate-800 to-slate-950", pos: "bottom-8 -left-[9%]", rot: "5deg", dur: 4.7, delay: 1.3 },
  { id: 4, title: "WORLD RECORD", sub: "Impossible Gaming Run", emoji: "🎮", g: "from-purple-600 to-blue-700", pos: "bottom-12 -right-[8%]", rot: "-5deg", dur: 3.9, delay: 0.9 },
  { id: 5, title: "AI REVOLUTION", sub: "The Next Shift", emoji: "🤖", g: "from-cyan-500 to-blue-600", pos: "top-[42%] -right-[5%]", rot: "3deg", dur: 5.8, delay: 2.1 },
]

const STAGES_TEXT = ["Analyzing prompt…", "Composing layout…", "Generating image…", "Finalizing render…", "Complete ✓"]
function stageText(pct: number) {
  if (pct < 22) return STAGES_TEXT[0]
  if (pct < 48) return STAGES_TEXT[1]
  if (pct < 80) return STAGES_TEXT[2]
  if (pct < 98) return STAGES_TEXT[3]
  return STAGES_TEXT[4]
}

export default function Hero() {
  const prompt = useTypingEffect(PROMPTS, 44)
  const { stage, pct } = useGenerationLoop()
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      mouseX.set(((e.clientX - r.left - r.width / 2) / r.width) * 18)
      mouseY.set(((e.clientY - r.top - r.height / 2) / r.height) * 10)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [mouseX, mouseY])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16 noise-bg">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[1100px] h-[700px] bg-[#FF7A00]/10 rounded-full blur-[130px]" />
        <div className="absolute top-[15%] left-[15%] w-72 h-72 bg-amber-300/12 rounded-full blur-3xl" />
        <div className="absolute top-[25%] right-[10%] w-80 h-80 bg-orange-400/8 rounded-full blur-3xl" />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* ── Text block ── */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-[#FF7A00]/20 text-sm font-semibold text-[#FF7A00] shadow-sm mb-8"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            Powered by AI + $THUMB Token
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-[#2D1C12] leading-[1.02] tracking-[-0.02em] max-w-5xl mx-auto"
          >
            The AI Thumbnail Studio{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">for Modern Creators.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.27 }}
            className="mt-6 text-lg sm:text-xl text-[#9A7560] max-w-2xl mx-auto leading-relaxed"
          >
            Generate click-worthy thumbnails in seconds using AI. Create faster,
            test smarter, and unlock creator rewards with the{" "}
            <span className="text-[#FF7A00] font-semibold">$THUMB ecosystem.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="mt-9 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/sign-up">
              <Button size="lg" className="group gap-3 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40">
                Start Creating Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center group-hover:bg-[#FF7A00]/20 transition-colors">
                <Play className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00] ml-0.5" />
              </div>
              Watch Demo
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62 }}
            className="mt-4 text-sm text-[#9A7560]"
          >
            Free plan available · No credit card required · Cancel anytime
          </motion.p>
        </div>

        {/* ── Product mockup ── */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 72, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.38 }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Glow behind */}
          <div className="absolute -inset-8 -z-10 bg-[#FF7A00]/12 rounded-[48px] blur-[70px]" />
          <div className="absolute -inset-4 -z-10 bg-amber-200/20 rounded-[36px] blur-[40px]" />

          {/* Floating thumbnails */}
          {THUMBS.map(th => (
            <motion.div
              key={th.id}
              className={`absolute ${th.pos} hidden lg:block z-20 cursor-pointer`}
              style={{ rotate: th.rot }}
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: th.dur, repeat: Infinity, ease: "easeInOut", delay: th.delay }}
              whileHover={{ scale: 1.08, rotate: "0deg", zIndex: 30, transition: { duration: 0.25 } }}
            >
              <div className={`w-44 h-[6.5rem] rounded-2xl bg-gradient-to-br ${th.g} p-3.5 shadow-2xl shadow-black/20 border border-white/15`}>
                <div className="text-2xl mb-1.5">{th.emoji}</div>
                <div className="text-white font-black text-sm leading-tight drop-shadow">{th.title}</div>
                <div className="text-white/60 text-[10px] mt-0.5">{th.sub}</div>
              </div>
            </motion.div>
          ))}

          {/* Floating "Generated" badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-2 lg:-right-10 top-12 z-30 hidden sm:flex items-center gap-2.5 glass rounded-2xl px-4 py-2.5 shadow-xl border-[#EAD9CC]/40"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2D1C12]">CTR Score: 94%</div>
              <div className="text-[10px] text-[#9A7560]">Generated in 2.1s</div>
            </div>
          </motion.div>

          {/* CTR trending badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -left-2 lg:-left-10 bottom-20 z-30 hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-2 shadow-lg border-[#EAD9CC]/40"
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-[#2D1C12]">+2.4× avg CTR</span>
          </motion.div>

          {/* Browser frame */}
          <motion.div
            style={{ x: springX, y: springY }}
            className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(45,28,18,0.18),0_0_0_1px_rgba(234,217,204,0.8)] bg-white"
          >
            {/* macOS chrome */}
            <div className="bg-[#F0E8DF] px-5 py-3.5 flex items-center gap-3 border-b border-[#EAD9CC]/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41] shadow-sm" />
              </div>
              <div className="flex gap-2 ml-2 opacity-40">
                <div className="w-4 h-4 rounded bg-[#9A7560]/30" />
                <div className="w-4 h-4 rounded bg-[#9A7560]/30" />
              </div>
              <div className="flex-1 mx-4 max-w-sm">
                <div className="bg-white/70 border border-[#EAD9CC]/70 rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <span className="text-[10px] text-[#9A7560]">🔒</span>
                  <span className="text-[11px] text-[#9A7560] font-medium">app.thumbfi.io/studio</span>
                </div>
              </div>
            </div>

            {/* App header */}
            <div className="bg-white border-b border-[#EAD9CC]/40 px-5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                  <span className="text-sm font-bold text-[#2D1C12]">ThumbFi Studio</span>
                </div>
                <div className="h-4 w-px bg-[#EAD9CC]" />
                <span className="text-xs text-[#9A7560]">Workspace / My Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#FF7A00]/10 text-[#FF7A00] text-[10px] font-bold rounded-full">✨ AI Mode</span>
                <span className="px-2.5 py-1 bg-[#F5EDE3] text-[#9A7560] text-[10px] font-medium rounded-full">History</span>
              </div>
            </div>

            {/* 3-column app layout */}
            <div className="grid grid-cols-[220px_1fr_200px] min-h-[400px]">

              {/* LEFT: Controls */}
              <div className="bg-[#FAFAF9] border-r border-[#EAD9CC]/40 p-4 space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-[#9A7560] uppercase tracking-widest mb-2">AI Prompt</div>
                  <div className="relative bg-white rounded-xl border border-[#EAD9CC]/80 p-3 min-h-[72px] text-xs text-[#2D1C12] leading-relaxed shadow-sm">
                    {prompt}<span className="cursor-blink text-[#FF7A00]">|</span>
                    <div className="absolute bottom-2 right-2 text-[9px] text-[#9A7560]">{prompt.length}/200</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#9A7560] uppercase tracking-widest mb-2">Style</div>
                  <div className="flex flex-wrap gap-1">
                    {["Viral", "Dark", "Bold", "Minimal", "Cinematic"].map((s, i) => (
                      <span key={s} className={`px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${i === 0 ? "bg-[#FF7A00] text-white shadow-sm" : "bg-white border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#FF7A00]"}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#9A7560] uppercase tracking-widest mb-2">Niche</div>
                  <div className="space-y-1">
                    {[
                      { label: "Crypto", icon: "₿", active: true },
                      { label: "Finance", icon: "📈", active: false },
                      { label: "Gaming", icon: "🎮", active: false },
                      { label: "AI & Tech", icon: "🤖", active: false },
                    ].map(n => (
                      <div key={n.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-[11px] font-medium transition-colors ${n.active ? "bg-[#FF7A00]/10 text-[#FF7A00]" : "text-[#6B3F2A] hover:bg-[#F5EDE3]"}`}>
                        <span>{n.icon}</span>{n.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate button */}
                <div className="space-y-2">
                  <button className={`w-full py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    stage === "generating"
                      ? "bg-[#FF7A00]/15 text-[#FF7A00] cursor-wait"
                      : "bg-[#FF7A00] text-white hover:bg-[#e56e00] shadow-md shadow-orange-500/25"
                  }`}>
                    {stage === "generating" ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
                          <Sparkles className="w-3 h-3" />
                        </motion.div>
                        Generating {Math.min(Math.round(pct), 100)}%
                      </>
                    ) : stage === "done" ? (
                      <><CheckCircle2 className="w-3 h-3" /> Regenerate</>
                    ) : (
                      <><Sparkles className="w-3 h-3" /> Generate Thumbnail</>
                    )}
                  </button>

                  {stage === "generating" && (
                    <div className="space-y-1">
                      <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-amber-400"
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.15 }}
                        />
                      </div>
                      <div className="text-[9px] text-[#9A7560] text-center">{stageText(pct)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER: Canvas */}
              <div className="p-5 flex flex-col gap-3 bg-[#F8F5F2]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2D1C12]">Canvas</span>
                  <div className="flex gap-1">
                    {["16:9", "1:1", "4:3"].map((r, i) => (
                      <span key={r} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-colors ${i === 0 ? "bg-[#2D1C12] text-white" : "bg-white border border-[#EAD9CC] text-[#9A7560] hover:border-[#2D1C12]"}`}>{r}</span>
                    ))}
                  </div>
                </div>

                {/* Main canvas */}
                <div className="relative flex-1 aspect-video rounded-xl overflow-hidden shadow-md">
                  {stage === "done" ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <div className="text-white font-black text-xl leading-tight drop-shadow-lg">BREAKING: AI</div>
                        <div className="text-white font-black text-2xl drop-shadow-lg">Changes Everything</div>
                        <div className="text-white/70 text-xs mt-1">My full story revealed</div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">⚡ CTR: 94%</span>
                      </div>
                    </motion.div>
                  ) : stage === "generating" ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE3] to-[#EAD9CC] flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          className="text-5xl mb-3"
                        >✨</motion.div>
                        <div className="text-[#9A7560] text-xs font-medium">{stageText(pct)}</div>
                        <div className="text-[#FF7A00] text-sm font-black mt-1">{Math.round(Math.min(pct, 100))}%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-blue-700 to-blue-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <div className="text-white font-black text-lg leading-tight">DARK TRUTH</div>
                        <div className="text-yellow-300 font-black text-2xl">$1,000,000</div>
                        <div className="text-white/60 text-xs mt-0.5">Real Estate Nobody Talks About</div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">⚡ CTR: 91%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Variation strip */}
                <div className="flex gap-2">
                  {[
                    { g: "from-orange-500 to-red-600", active: false },
                    { g: "from-purple-600 to-blue-700", active: true },
                    { g: "from-slate-800 to-slate-950", active: false },
                    { g: "from-emerald-500 to-teal-600", active: false },
                  ].map((v, i) => (
                    <div key={i} className={`flex-1 aspect-video rounded-lg bg-gradient-to-br ${v.g} cursor-pointer transition-all ${v.active ? "ring-2 ring-[#FF7A00] ring-offset-1 shadow-md" : "opacity-55 hover:opacity-80 hover:scale-105"}`} />
                  ))}
                  <div className="flex-1 aspect-video rounded-lg bg-white border-2 border-dashed border-[#EAD9CC] hover:border-[#FF7A00] flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-[#9A7560] text-sm hover:text-[#FF7A00]">+</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Stats */}
              <div className="border-l border-[#EAD9CC]/40 p-4 space-y-4 bg-white">
                <div>
                  <div className="text-[10px] font-bold text-[#9A7560] uppercase tracking-widest mb-2">Performance</div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-emerald-600">91</span>
                      <span className="text-sm text-emerald-400">/100</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full w-[91%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1.5">Excellent CTR potential</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#9A7560] uppercase tracking-widest mb-2">Analysis</div>
                  <div className="space-y-2.5">
                    {[
                      { l: "Contrast", v: 94, c: "bg-emerald-400" },
                      { l: "Readability", v: 88, c: "bg-blue-400" },
                      { l: "Curiosity", v: 96, c: "bg-[#FF7A00]" },
                      { l: "Emotion", v: 82, c: "bg-purple-400" },
                    ].map(m => (
                      <div key={m.l}>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[#6B3F2A] font-medium">{m.l}</span>
                          <span className="font-bold text-[#2D1C12]">{m.v}%</span>
                        </div>
                        <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
                          <div className={`h-full ${m.c} rounded-full`} style={{ width: `${m.v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-[#9A7560] uppercase tracking-widest mb-2">Export</div>
                  <div className="space-y-1.5">
                    {[["PNG 4K", true], ["JPG Web", false], ["WebP", false]].map(([fmt, primary]) => (
                      <button key={fmt as string} className={`w-full text-left px-2.5 py-2 rounded-lg text-[10px] font-semibold transition-colors ${primary ? "bg-[#2D1C12] text-white" : "bg-[#F5EDE3] text-[#6B3F2A] hover:bg-[#EAD9CC]"}`}>
                        ↓ {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
