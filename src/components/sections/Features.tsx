"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Wand2, Layout, MousePointerClick, Scissors, Smile, Smartphone, CheckCircle2, ArrowRight } from "lucide-react"

const FEATURES = [
  {
    icon: Wand2,
    title: "AI Generation",
    desc: "Describe your thumbnail in plain English. Our AI understands niche context, emotional triggers, and what makes viewers click.",
    detail: "Trained on 100M+ real YouTube thumbnails with verified CTR data.",
    color: "#FF7A00",
    bg: "bg-[#FF7A00]/8",
  },
  {
    icon: Layout,
    title: "Smart Layouts",
    desc: "Hundreds of high-performing composition templates trained on viral thumbnails across every niche and content category.",
    detail: "Crypto, gaming, finance, podcasts, tutorials, lifestyle — all covered.",
    color: "#3b82f6",
    bg: "bg-blue-50",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Editing",
    desc: "Swap text, colors, and images in a single click. No design layers, no Figma exports, zero friction from idea to publish.",
    detail: "Full non-destructive editing with instant preview.",
    color: "#10b981",
    bg: "bg-emerald-50",
  },
  {
    icon: Scissors,
    title: "Background Removal",
    desc: "Crisp, clean subject cutouts in milliseconds. AI-powered edge detection outperforms manual selection every time.",
    detail: "Works with hair, complex backgrounds, and low-contrast images.",
    color: "#a855f7",
    bg: "bg-purple-50",
  },
  {
    icon: Smile,
    title: "Face Enhancement",
    desc: "AI automatically upscales and enhances creator faces for maximum clarity, expression impact, and professional quality.",
    detail: "4K upscaling, expression amplification, lighting correction.",
    color: "#f59e0b",
    bg: "bg-amber-50",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    desc: "Full studio experience on any device. Create, edit, and export professional thumbnails from your phone.",
    detail: "Touch-optimized UI, responsive canvas, offline draft saving.",
    color: "#ec4899",
    bg: "bg-pink-50",
  },
]

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [active, setActive] = useState(0)

  return (
    <section id="features" ref={ref} className="py-20 lg:py-32 relative overflow-hidden section-glow">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF7A00]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/8 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[#FF7A00] uppercase tracking-widest">Features</span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-[#2D1C12] leading-tight tracking-tight">
            No Design Skills
            <br />
            <span className="gradient-text">Required</span>
          </h2>
          <p className="mt-5 text-lg text-[#9A7560] max-w-xl mx-auto">
            ThumbFi handles every step of the process — from your first idea to a 4K export ready to outperform.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Feature list (interactive) */}
          <div className="space-y-2">
            {FEATURES.map((f, i) => (
              <motion.button
                key={f.title}
                initial={{ opacity: 0, x: -28 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.08 + i * 0.07 }}
                onClick={() => setActive(i)}
                className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 group ${
                  active === i
                    ? "bg-white shadow-lg shadow-[#2D1C12]/6 border border-[#EAD9CC]/60"
                    : "hover:bg-white/60 hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    active === i ? f.bg : "bg-[#F5EDE3]"
                  }`}
                >
                  <f.icon
                    className="w-5 h-5 transition-colors"
                    style={{ color: active === i ? f.color : "#9A7560" }}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-bold text-sm transition-colors ${active === i ? "text-[#2D1C12]" : "text-[#6B3F2A]"}`}>
                      {f.title}
                    </h3>
                    <ArrowRight
                      className={`w-4 h-4 flex-shrink-0 transition-all ${active === i ? "text-[#FF7A00] translate-x-0" : "text-transparent -translate-x-2"}`}
                    />
                  </div>
                  <p className={`text-sm mt-1 leading-relaxed transition-colors ${active === i ? "text-[#6B3F2A]" : "text-[#9A7560]"}`}>
                    {f.desc}
                  </p>
                  <AnimatePresence>
                    {active === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs mt-2 font-medium overflow-hidden"
                        style={{ color: f.color }}
                      >
                        ✓ {f.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right: Product mockup */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative lg:sticky lg:top-28"
          >
            {/* Glow */}
            <div className="absolute -inset-6 -z-10 bg-[#FF7A00]/10 rounded-3xl blur-3xl" />

            {/* Browser card */}
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-[#2D1C12]/12 border border-[#EAD9CC]/70 bg-white">
              {/* Chrome */}
              <div className="bg-[#F0E8DF] px-4 py-3 flex items-center gap-2 border-b border-[#EAD9CC]/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                </div>
                <span className="mx-auto text-[11px] text-[#9A7560] font-medium">ThumbFi Studio</span>
              </div>

              <div className="bg-[#FAFAF9] p-5 space-y-4">
                {/* Main thumbnail */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35 }}
                    className="aspect-video rounded-2xl relative overflow-hidden shadow-lg"
                  >
                    {/* Dynamic thumbnail based on active feature */}
                    <div className={`absolute inset-0 ${[
                      "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400",
                      "bg-gradient-to-br from-blue-600 to-blue-900",
                      "bg-gradient-to-br from-emerald-500 to-teal-700",
                      "bg-gradient-to-br from-purple-600 to-slate-900",
                      "bg-gradient-to-br from-pink-500 to-rose-600",
                      "bg-gradient-to-br from-slate-700 to-slate-950",
                    ][active]}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <div className="text-white font-black text-xl drop-shadow-lg">
                          {["VIRAL THUMBNAIL", "SMART LAYOUT", "ONE-CLICK EDIT", "BG REMOVED ✓", "FACE ENHANCED", "MOBILE READY"][active]}
                        </div>
                        <div className="text-white/70 text-sm mt-1">
                          {["AI Generated · 2.1s", "High-CTR template", "Instant customization", "Clean cutout", "4K face upscale", "Pixel-perfect export"][active]}
                        </div>
                      </div>
                      {/* Feature overlay indicator */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[11px] font-bold" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}>
                        {FEATURES[active].title}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-[10px] font-bold">
                        ⚡ CTR {[94, 91, 88, 93, 96, 87][active]}%
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Toolbar */}
                <div className="grid grid-cols-3 gap-2">
                  {FEATURES.slice(0, 3).map((f, i) => (
                    <button
                      key={f.title}
                      onClick={() => setActive(i)}
                      className={`rounded-xl p-2.5 text-center transition-all ${active === i ? "bg-[#FF7A00] shadow-md" : "bg-white border border-[#EAD9CC] hover:border-[#FF7A00]"}`}
                    >
                      <f.icon className={`w-4 h-4 mx-auto mb-1 ${active === i ? "text-white" : "text-[#9A7560]"}`} strokeWidth={2} />
                      <div className={`text-[9px] font-semibold ${active === i ? "text-white" : "text-[#9A7560]"}`}>{f.title.split(" ")[0]}</div>
                    </button>
                  ))}
                </div>

                {/* Progress + status */}
                <div className="bg-white rounded-xl border border-[#EAD9CC]/60 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#2D1C12] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {FEATURES[active].title} · Ready
                    </span>
                    <span className="text-[#FF7A00] text-xs font-black">✓ 100%</span>
                  </div>
                  <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
                    <motion.div
                      key={active}
                      className="h-full rounded-full"
                      style={{ background: FEATURES[active].color }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -right-4 glass rounded-2xl px-4 py-3 shadow-xl border-[#EAD9CC]/50 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center">
                <span className="text-sm">⚡</span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#2D1C12]">10,000+ Generated</div>
                <div className="text-[10px] text-[#9A7560]">Today alone</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
