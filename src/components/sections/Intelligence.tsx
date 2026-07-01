"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TrendingUp, Target, GitCompare, Eye, Heart, Zap } from "lucide-react"

/* ─── SVG Arc Gauge ─────────────────────────────────────────── */
function ArcGauge({
  score,
  label,
  color = "#FF7A00",
  active,
}: {
  score: number
  label: string
  color?: string
  active: boolean
}) {
  const R = 52
  const cx = 64
  const cy = 64
  const startAngle = -220
  const sweep = 260
  const endAngle = startAngle + sweep * (score / 100)
  const toRad = (d: number) => (d * Math.PI) / 180
  const arc = (a: number) => ({
    x: cx + R * Math.cos(toRad(a)),
    y: cy + R * Math.sin(toRad(a)),
  })
  const bgStart = arc(startAngle)
  const bgEnd = arc(startAngle + sweep)
  const fgEnd = arc(endAngle)
  const largeBg = sweep > 180 ? 1 : 0
  const largeFg = sweep * (score / 100) > 180 ? 1 : 0

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="128" height="128" viewBox="0 0 128 128">
          {/* Track */}
          <path
            d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 ${largeBg} 1 ${bgEnd.x} ${bgEnd.y}`}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.path
            d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 ${largeFg} 1 ${fgEnd.x} ${fgEnd.y}`}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: score / 100, opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          {/* Score text */}
          <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="inherit">
            {score}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="600" fontFamily="inherit">
            {label}
          </text>
        </svg>
      </div>
    </div>
  )
}

/* ─── Mini bar chart ────────────────────────────────────────── */
function BarChart({ data, active }: { data: number[]; active: boolean }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm bg-[#FF7A00]"
          style={{ opacity: 0.3 + (v / max) * 0.7 }}
          initial={{ height: 0 }}
          animate={active ? { height: `${(v / max) * 100}%` } : {}}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.06 }}
        />
      ))}
    </div>
  )
}

const METRICS = [
  { icon: TrendingUp, title: "CTR Prediction", value: "91%", desc: "Predicted click-through rate based on 100M+ thumbnail data points.", score: 91, color: "#10b981", tag: "Excellent" },
  { icon: Target, title: "Thumbnail Score", value: "87/100", desc: "Composite quality score across contrast, layout, and text clarity.", score: 87, color: "#FF7A00", tag: "Strong" },
  { icon: Eye, title: "Readability", value: "96%", desc: "Text size, contrast ratios, and mobile visibility — all checked.", score: 96, color: "#3b82f6", tag: "Perfect" },
  { icon: Heart, title: "Emotion Signal", value: "High Curiosity", desc: "Detects the dominant psychological trigger: FOMO, curiosity, urgency.", score: 82, color: "#a855f7", tag: "FOMO" },
]

export default function Intelligence() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const weeklyData = [42, 58, 51, 73, 88, 79, 91]

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-[#1E1108] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#FF7A00]/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/8 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF7A00]/4 rounded-full blur-[100px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,122,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[#FF7A00] uppercase tracking-widest">Analytics</span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Thumbnail Intelligence
            <br />
            <span className="text-[#FF7A00]">That Actually Works</span>
          </h2>
          <p className="mt-4 text-lg text-white/45 max-w-2xl mx-auto">
            Stop uploading blind. Every ThumbFi generation comes with a full AI-powered analytics suite so you know before you publish.
          </p>
        </motion.div>

        {/* Main dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="rounded-3xl border border-white/8 overflow-hidden shadow-2xl"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {/* Dashboard header bar */}
          <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#FF7A00]" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">ThumbFi Intelligence</div>
                <div className="text-white/35 text-xs">Thumbnail: "Dark Truth About $1M Real Estate" · Last analyzed 2m ago</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold">Live Analysis</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_340px] gap-0">
            {/* Left: Gauges */}
            <div className="p-6 border-r border-white/8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                {METRICS.map((m, i) => (
                  <motion.div
                    key={m.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <ArcGauge score={m.score} label="score" color={m.color} active={inView} />
                    <div className="mt-2">
                      <div className="text-white font-bold text-xs">{m.title}</div>
                      <div className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${m.color}20`, color: m.color }}>
                        {m.tag}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Metric detail cards */}
              <div className="grid sm:grid-cols-2 gap-3">
                {METRICS.map((m, i) => (
                  <motion.div
                    key={m.title + "detail"}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                    className="rounded-xl p-4 border border-white/8 hover:border-white/15 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}18` }}>
                        <m.icon className="w-4 h-4" style={{ color: m.color }} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-white font-semibold text-xs">{m.title}</span>
                          <span className="text-xs font-bold shrink-0" style={{ color: m.color }}>{m.value}</span>
                        </div>
                        <p className="text-white/35 text-[10px] mt-0.5 leading-relaxed">{m.desc}</p>
                        <div className="mt-2 h-1 bg-white/8 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: m.color }}
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${m.score}%` } : {}}
                            transition={{ duration: 1.2, delay: 0.6 + i * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: CTR trend + A/B */}
            <div className="p-6 space-y-5">
              {/* CTR trend */}
              <div className="rounded-2xl p-4 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-white font-bold text-sm">CTR This Week</div>
                    <div className="text-white/35 text-xs">vs. channel average 3.8%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#FF7A00]">7.8%</div>
                    <div className="text-emerald-400 text-xs font-semibold">↑ +105%</div>
                  </div>
                </div>
                <BarChart data={weeklyData} active={inView} />
                <div className="flex justify-between mt-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="text-white/25 text-[9px] flex-1 text-center">{d}</span>
                  ))}
                </div>
              </div>

              {/* A/B comparison */}
              <div className="rounded-2xl p-4 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-white font-bold text-sm mb-3">
                  <GitCompare className="w-3.5 h-3.5 inline mr-1.5 opacity-60" />
                  A/B Comparison
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Version A", pct: 91, winner: true },
                    { label: "Version B", pct: 68, winner: false },
                  ].map(ab => (
                    <div key={ab.label} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 text-xs font-medium">{ab.label}</span>
                          {ab.winner && <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded">Winner</span>}
                        </div>
                        <span className={`text-xs font-bold ${ab.winner ? "text-[#FF7A00]" : "text-white/40"}`}>{ab.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${ab.winner ? "bg-[#FF7A00]" : "bg-white/20"}`}
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${ab.pct}%` } : {}}
                          transition={{ duration: 1.2, delay: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-[10px] mt-3 leading-relaxed">Version A wins by 34%. AI predicts this based on color contrast, text placement, and emotion cues.</p>
              </div>

              {/* Before / After */}
              <div className="rounded-2xl p-4 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="text-white font-bold text-sm mb-3">Before vs. After AI</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end p-2">
                        <div className="text-white/70 text-[9px] font-bold leading-tight">My Video Title Here</div>
                      </div>
                      <div className="absolute top-1.5 left-1.5 bg-red-500/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">CTR 2.1%</div>
                    </div>
                    <div className="text-white/35 text-[9px] text-center mt-1">Before</div>
                  </div>
                  <div>
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute inset-0 flex items-end p-2">
                        <div className="text-white font-black text-[9px] leading-tight">DARK TRUTH About $1M</div>
                      </div>
                      <div className="absolute top-1.5 left-1.5 bg-emerald-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">CTR 7.8%</div>
                    </div>
                    <div className="text-[#FF7A00] text-[9px] text-center mt-1 font-semibold">After ThumbFi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { v: "2.4×", l: "Average CTR increase" },
            { v: "0.81", l: "Prediction correlation vs YouTube analytics" },
            { v: "98%", l: "Score accuracy confirmed by creators" },
          ].map(s => (
            <div key={s.l} className="text-center p-5 rounded-2xl border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-3xl font-black text-[#FF7A00]">{s.v}</div>
              <div className="text-white/35 text-xs mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
