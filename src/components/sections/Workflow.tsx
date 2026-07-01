"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"

const STEPS = [
  {
    num: "01",
    icon: "💡",
    label: "Idea",
    desc: "Start with any topic, niche, or content angle",
    detail: "YouTube video, crypto news, gaming clip, or podcast episode",
    color: "from-amber-400 to-orange-500",
    glow: "shadow-amber-200",
    textColor: "text-amber-600",
    bgLight: "bg-amber-50",
  },
  {
    num: "02",
    icon: "✍️",
    label: "Prompt",
    desc: "Describe your vision in plain English",
    detail: "No design jargon. Just tell ThumbFi what you want",
    color: "from-blue-500 to-blue-700",
    glow: "shadow-blue-200",
    textColor: "text-blue-600",
    bgLight: "bg-blue-50",
  },
  {
    num: "03",
    icon: "🤖",
    label: "AI Engine",
    desc: "Our model generates viral variations instantly",
    detail: "Trained on 100M+ high-performing thumbnails",
    color: "from-[#FF7A00] to-red-500",
    glow: "shadow-orange-200",
    textColor: "text-[#FF7A00]",
    bgLight: "bg-orange-50",
    featured: true,
  },
  {
    num: "04",
    icon: "🖼️",
    label: "Thumbnail",
    desc: "Pick your winner, refine with one click",
    detail: "CTR score, emotion analysis, A/B comparison",
    color: "from-purple-500 to-violet-700",
    glow: "shadow-purple-200",
    textColor: "text-purple-600",
    bgLight: "bg-purple-50",
  },
  {
    num: "05",
    icon: "🚀",
    label: "Publish",
    desc: "Export at 4K or push directly to YouTube",
    detail: "PNG, JPG, WebP — or API integration",
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-200",
    textColor: "text-emerald-600",
    bgLight: "bg-emerald-50",
  },
]

export default function Workflow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="py-20 lg:py-32 relative overflow-hidden">
      {/* Orange BG */}
      <div className="absolute inset-0 bg-[#FF7A00]">
        {/* Noise */}
        <div className="absolute inset-0 noise-bg opacity-60" />
        {/* Radial glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e56e00]/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-white/55 uppercase tracking-widest">How It Works</span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Idea to Viral
            <br />
            in Under 60 Seconds
          </h2>
          <p className="mt-4 text-lg text-white/65 max-w-xl mx-auto">
            The fastest, most powerful thumbnail creation workflow ever built for creators.
          </p>
        </motion.div>

        {/* Pipeline */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[12%] right-[12%] h-px">
            <motion.div
              className="h-full bg-white/20 rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ transformOrigin: "left center" }}
            />
            {/* Animated dot on the line */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
              initial={{ left: "0%" }}
              animate={inView ? { left: ["0%", "100%", "0%"] } : {}}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                className="flex flex-col"
              >
                {/* Mobile arrow */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden flex justify-center my-2">
                    <ArrowRight className="w-5 h-5 text-white/40 rotate-90" />
                  </div>
                )}

                <div className={`relative group cursor-default rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${
                  step.featured
                    ? "bg-white/20 backdrop-blur-sm border-2 border-white/40 shadow-2xl shadow-black/10"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30"
                }`}>
                  {step.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded-full text-[#FF7A00] text-[10px] font-black whitespace-nowrap shadow-md">
                      ⚡ Powered by AI
                    </div>
                  )}

                  {/* Step number */}
                  <div className="text-white/30 text-[10px] font-black tracking-widest mb-3">{step.num}</div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${step.bgLight} flex items-center justify-center text-2xl mb-4 shadow-sm ${step.glow}`}>
                    {step.icon}
                  </div>

                  <h3 className="text-white font-black text-lg mb-1.5">{step.label}</h3>
                  <p className="text-white/75 text-sm leading-relaxed">{step.desc}</p>
                  <p className="text-white/45 text-[11px] mt-2 leading-relaxed">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.8 }}
          className="mt-14 grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          {[
            { v: "2.1s", l: "Average generation time" },
            { v: "4K", l: "Export resolution" },
            { v: "100%", l: "Browser-based, no install" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-black text-white">{s.v}</div>
              <div className="text-white/50 text-xs mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-10 text-center"
        >
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#2D1C12] text-white rounded-full font-bold text-base hover:bg-[#3d2a1c] transition-all shadow-xl hover:-translate-y-0.5">
            Try the Full Workflow Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
