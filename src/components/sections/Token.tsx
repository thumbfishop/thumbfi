"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Coins, Percent, Gift, Flame, Share2, Store, TrendingUp } from "lucide-react"

const FLOW = [
  { label: "Buy THUMB", icon: Coins, desc: "Acquire tokens via DEX or platform", color: "#FF7A00", angle: -90 },
  { label: "Hold & Stake", icon: TrendingUp, desc: "Hold to unlock tier discounts", color: "#F59E0B", angle: -30 },
  { label: "Generate", icon: "✨", desc: "Create AI thumbnails at reduced cost", color: "#10b981", angle: 30 },
  { label: "Burn Mechanism", icon: Flame, desc: "2% of every tx burned permanently", color: "#ef4444", angle: 90 },
  { label: "Earn Rewards", icon: Gift, desc: "Weekly credits + referral bonuses", color: "#3b82f6", angle: 150 },
  { label: "Marketplace", icon: Store, desc: "Buy & sell templates with THUMB", color: "#a855f7", angle: 210 },
]

const UTILITIES = [
  { icon: Coins, title: "Pay with THUMB", desc: "Use $THUMB to pay for any plan or credit pack at a fixed token rate.", tag: "Core", tagC: "text-[#FF7A00] bg-[#FF7A00]/10", hl: false },
  { icon: Percent, title: "Up to 50% Discounts", desc: "Tiered holder discounts — the more THUMB you hold, the less you pay.", tag: "Holder Perk", tagC: "text-emerald-600 bg-emerald-50", hl: true },
  { icon: Gift, title: "Weekly Free Credits", desc: "Active THUMB holders receive free AI generation credits automatically every week.", tag: "Rewards", tagC: "text-blue-600 bg-blue-50", hl: false },
  { icon: Flame, title: "Burn Mechanism", desc: "2% of every transaction permanently reduces the total THUMB supply.", tag: "Deflationary", tagC: "text-red-500 bg-red-50", hl: false },
  { icon: Share2, title: "Referral Rewards", desc: "Earn THUMB tokens for every creator you refer, paid instantly on-chain.", tag: "Earn", tagC: "text-purple-600 bg-purple-50", hl: false },
  { icon: Store, title: "Creator Marketplace", desc: "Buy and sell custom thumbnails, brand kits, and AI presets using THUMB.", tag: "Coming Soon", tagC: "text-[#9A7560] bg-[#F5EDE3]", hl: false, soon: true },
]

export default function Token() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="token" ref={ref} className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0F0805] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF7A00]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/6 rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,122,0,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[#FF7A00] uppercase tracking-widest">Web3 Utility</span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            The{" "}
            <span className="text-[#FF7A00]">$THUMB Ecosystem</span>
          </h2>
          <p className="mt-4 text-lg text-white/45 max-w-2xl mx-auto">
            ThumbFi isn't just a tool — it's a creator economy. Every generation, every export, and every marketplace transaction flows through $THUMB.
          </p>
        </motion.div>

        {/* Ecosystem infographic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="relative max-w-3xl mx-auto mb-16"
          style={{ height: 480 }}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-72 h-72 rounded-full border border-[#FF7A00]/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute w-80 h-80 rounded-full border border-white/4" />
          </div>

          {/* Central token */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Pulsing glow */}
              <motion.div
                className="absolute -inset-6 rounded-full bg-[#FF7A00]/20 blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex flex-col items-center justify-center shadow-2xl border-2 border-[#FF7A00]/40">
                <div className="text-white font-black text-lg leading-tight">$THUMB</div>
                <div className="text-white/60 text-[9px] font-medium">SPL TOKEN</div>
              </div>
            </motion.div>
          </div>

          {/* Orbital flow nodes */}
          {FLOW.map((node, i) => {
            const rad = (node.angle - 90) * (Math.PI / 180)
            const r = 190
            const x = 50 + (r / 6) * Math.cos(rad) // percent
            const y = 50 + (r / 6) * Math.sin(rad)

            return (
              <motion.div
                key={node.label}
                className="absolute z-20"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.08, zIndex: 30 }}
              >
                <div className="flex flex-col items-center gap-1 cursor-default group">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 transition-all group-hover:scale-105"
                    style={{ background: `${node.color}22`, borderColor: `${node.color}30` }}
                  >
                    {typeof node.icon === "string" ? (
                      <span className="text-2xl">{node.icon}</span>
                    ) : (
                      <node.icon className="w-6 h-6" style={{ color: node.color }} strokeWidth={2} />
                    )}
                  </div>
                  <div className="text-white text-[10px] font-bold text-center leading-tight max-w-[80px] whitespace-nowrap">{node.label}</div>
                  <div className="text-white/35 text-[9px] text-center max-w-[90px] leading-tight hidden sm:block">{node.desc}</div>
                </div>
              </motion.div>
            )
          })}

          {/* SVG connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {FLOW.map((node, i) => {
              const rad = (node.angle - 90) * (Math.PI / 180)
              const r = 31.7
              const x = 50 + r * Math.cos(rad)
              const y = 50 + r * Math.sin(rad)
              return (
                <motion.line
                  key={node.label}
                  x1="50" y1="50" x2={x} y2={y}
                  stroke={node.color}
                  strokeWidth="0.3"
                  strokeOpacity="0.3"
                  strokeDasharray="1.5 1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                />
              )
            })}
          </svg>
        </motion.div>

        {/* Utility cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {UTILITIES.map((u, i) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.07 }}
              className={`relative rounded-2xl p-6 border transition-all duration-200 cursor-default ${
                u.hl
                  ? "bg-[#FF7A00] border-[#FF7A00] shadow-2xl shadow-orange-500/30"
                  : "border-white/8 hover:border-white/15"
              } ${u.soon ? "opacity-75" : ""}`}
              style={!u.hl ? { background: "rgba(255,255,255,0.04)" } : {}}
              whileHover={!u.hl ? { y: -4 } : {}}
            >
              {u.hl && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#2D1C12] rounded-full text-white text-[10px] font-black whitespace-nowrap shadow-md">
                  ⭐ Most Popular
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.hl ? "bg-white/20" : "bg-white/8"}`}>
                  <u.icon className={`w-5 h-5 ${u.hl ? "text-white" : "text-white/70"}`} strokeWidth={2} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.hl ? "bg-white/20 text-white" : u.tagC}`}>{u.tag}</span>
              </div>
              <h3 className={`font-bold text-base mb-2 ${u.hl ? "text-white" : "text-white"}`}>{u.title}</h3>
              <p className={`text-sm leading-relaxed ${u.hl ? "text-white/80" : "text-white/45"}`}>{u.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tokenomics bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.65 }}
          className="mt-10 rounded-3xl p-8 border border-white/8 grid sm:grid-cols-[1fr_auto] gap-6 items-center"
          style={{ background: "rgba(255,122,0,0.06)" }}
        >
          <div>
            <h3 className="text-xl font-black text-white">Ready to join the creator economy?</h3>
            <p className="text-white/45 mt-1.5 text-sm">Join the $THUMB whitelist — get early access, bonus credits, and founding creator status.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[["Total Supply", "1B $THUMB"], ["Creator Rewards", "30% allocation"], ["Burn Rate", "2% per tx"]].map(([l, v]) => (
                <div key={l} className="px-4 py-2 bg-white/6 border border-white/10 rounded-xl">
                  <div className="text-white/40 text-[10px] font-medium">{l}</div>
                  <div className="text-white font-bold text-sm mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-7 py-4 bg-[#FF7A00] text-white rounded-2xl font-bold text-sm hover:bg-[#e56e00] transition-all shadow-xl shadow-orange-500/25 hover:-translate-y-0.5 whitespace-nowrap">
            Join the Whitelist
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
