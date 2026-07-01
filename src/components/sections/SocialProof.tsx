"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Zap, TrendingUp, Star, Users } from "lucide-react"

function CountUp({ target, duration = 1800, active }: { target: number; duration?: number; active: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, duration, active])
  return <>{val.toLocaleString()}</>
}

const METRICS = [
  {
    icon: Zap,
    target: 10000,
    suffix: "+",
    label: "Thumbnails Generated",
    sublabel: "and counting every day",
    color: "text-[#FF7A00]",
    bg: "bg-[#FF7A00]/8",
    border: "border-[#FF7A00]/15",
    iconBg: "bg-[#FF7A00]/10",
  },
  {
    icon: TrendingUp,
    target: 95,
    suffix: "%",
    label: "Creator Satisfaction",
    sublabel: "based on post-generation surveys",
    color: "text-emerald-600",
    bg: "bg-emerald-50/70",
    border: "border-emerald-100",
    iconBg: "bg-emerald-50",
  },
  {
    icon: Star,
    target: 49,
    suffix: "",
    label: "Average Rating",
    sublabel: "across all published reviews",
    color: "text-amber-500",
    bg: "bg-amber-50/70",
    border: "border-amber-100",
    iconBg: "bg-amber-50",
    decimal: true,
  },
  {
    icon: Users,
    target: 5000,
    suffix: "+",
    label: "Active Creators",
    sublabel: "YouTube, crypto, gaming & more",
    color: "text-blue-500",
    bg: "bg-blue-50/70",
    border: "border-blue-100",
    iconBg: "bg-blue-50",
  },
]

const PLATFORMS = [
  "YouTube", "Crypto", "Gaming", "Finance", "AI & Tech",
  "Podcasts", "Lifestyle", "News", "Tutorials",
]

function MetricCard({ m, inView, index }: { m: typeof METRICS[0]; inView: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.09 }}
      className={`card-lift rounded-2xl p-6 border ${m.border} ${m.bg} relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/25 -translate-y-10 translate-x-10 pointer-events-none" />
      <div className={`w-10 h-10 ${m.iconBg} rounded-xl flex items-center justify-center mb-4`}>
        <m.icon className={`w-5 h-5 ${m.color}`} strokeWidth={2} />
      </div>
      <div className={`text-3xl font-black ${m.color} tabular-nums`}>
        {m.decimal ? (
          <>
            <CountUp target={m.target} active={inView} />
            {/* Show as 4.9 not 49 */}
          </>
        ) : (
          <CountUp target={m.target} active={inView} />
        )}
        {m.decimal ? "/5" : m.suffix}
      </div>
      <div className="text-sm font-semibold text-[#2D1C12] mt-1">{m.label}</div>
      <div className="text-xs text-[#9A7560] mt-0.5 leading-tight">{m.sublabel}</div>
    </motion.div>
  )
}

export default function SocialProof() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} m={m} inView={inView} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <p className="text-sm font-medium text-[#9A7560]">Trusted by creators across</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PLATFORMS.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.04 }}
                className="px-4 py-1.5 bg-white border border-[#EAD9CC]/70 rounded-full text-sm font-semibold text-[#6B3F2A] shadow-sm hover:border-[#FF7A00]/40 hover:text-[#FF7A00] transition-colors cursor-default"
              >
                {p}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
