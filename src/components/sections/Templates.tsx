"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  "All", "Crypto", "Gaming", "AI", "Finance", "Podcast", "Tutorials", "News", "Cars", "Lifestyle",
]

const templates = [
  { id: 1, category: "Crypto", title: "BITCOIN CRASH", sub: "What Happens Next", gradient: "from-orange-500 to-red-600", emoji: "₿", badge: "🔥 Trending" },
  { id: 2, category: "Finance", title: "$1M MILESTONE", sub: "How I Got Here", gradient: "from-emerald-500 to-teal-600", emoji: "💰", badge: "💎 Premium" },
  { id: 3, category: "Gaming", title: "WORLD RECORD", sub: "Impossible Run", gradient: "from-purple-600 to-blue-700", emoji: "🎮", badge: "⚡ Hot" },
  { id: 4, category: "AI", title: "AI TAKES OVER", sub: "2025 Predictions", gradient: "from-cyan-500 to-blue-600", emoji: "🤖", badge: "🆕 New" },
  { id: 5, category: "Podcast", title: "DARK TRUTH", sub: "Episode 47", gradient: "from-gray-800 to-gray-950", emoji: "🎙️", badge: "🎯 Top Pick" },
  { id: 6, category: "Tutorials", title: "LEARN IN 10MIN", sub: "Full Beginner Guide", gradient: "from-amber-500 to-orange-600", emoji: "📚", badge: "✅ Viral" },
  { id: 7, category: "News", title: "BREAKING NOW", sub: "You Need to See This", gradient: "from-red-600 to-rose-700", emoji: "📰", badge: "🚨 Alert" },
  { id: 8, category: "Cars", title: "0–100 RECORD", sub: "Insane Acceleration", gradient: "from-slate-700 to-slate-900", emoji: "🏎️", badge: "🔥 Trending" },
  { id: 9, category: "Lifestyle", title: "QUIT MY JOB", sub: "Best Decision Ever", gradient: "from-pink-500 to-rose-500", emoji: "✨", badge: "💯 Popular" },
  { id: 10, category: "Crypto", title: "NFT MILLIONAIRE", sub: "From $100 to $1M", gradient: "from-violet-600 to-purple-700", emoji: "🖼️", badge: "💎 Premium" },
  { id: 11, category: "Finance", title: "PASSIVE INCOME", sub: "7 Streams Revealed", gradient: "from-green-500 to-emerald-600", emoji: "📈", badge: "⚡ Hot" },
  { id: 12, category: "Gaming", title: "I GOT BANNED", sub: "Here's What Happened", gradient: "from-red-500 to-orange-600", emoji: "🚫", badge: "🔥 Trending" },
]

export default function Templates() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = activeCategory === "All"
    ? templates
    : templates.filter((t) => t.category === activeCategory)

  return (
    <section id="templates" ref={ref} className="py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-[#FF7A00] uppercase tracking-widest">Templates</span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-[#2D1C12] leading-tight">
            Start With{" "}
            <span className="gradient-text">Templates</span>
          </h2>
          <p className="mt-4 text-lg text-[#9A7560] max-w-xl mx-auto">
            Hundreds of battle-tested thumbnail templates across every creator niche.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-[#FF7A00] text-white shadow-md shadow-orange-500/25"
                  : "bg-white border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#FF7A00] hover:text-[#FF7A00]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Templates grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="group cursor-pointer"
              whileHover={{ y: -4 }}
            >
              <div className={`aspect-video rounded-2xl bg-gradient-to-br ${t.gradient} relative overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300`}>
                <div className="absolute inset-0 flex flex-col items-start justify-end p-3">
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-white font-black text-sm leading-tight">{t.title}</div>
                  <div className="text-white/70 text-[10px] mt-0.5">{t.sub}</div>
                </div>
                {/* Badge */}
                <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-0.5 text-white text-[10px] font-medium">
                  {t.badge}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1.5 bg-white rounded-full text-[#2D1C12] text-xs font-bold shadow-lg">
                      Use Template
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 px-1">
                <div className="text-xs font-semibold text-[#2D1C12] truncate">{t.title}</div>
                <div className="text-[10px] text-[#9A7560]">{t.category}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button variant="secondary" size="lg">
            Browse All 500+ Templates →
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
