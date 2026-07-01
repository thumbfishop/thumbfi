"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Alex Rivera",
    handle: "@cryptoalex",
    niche: "Crypto Creator • 280K subscribers",
    avatar: "AR",
    avatarBg: "bg-orange-500",
    stars: 5,
    text: "ThumbFi completely changed my upload cadence. What used to take me 3 hours in Photoshop now takes 90 seconds. My CTR went from 4.2% to 7.8% in the first month.",
    metric: "+85% CTR",
    metricColor: "text-emerald-600",
  },
  {
    name: "Priya Sharma",
    handle: "@financepriya",
    niche: "Finance Educator • 120K subscribers",
    avatar: "PS",
    avatarBg: "bg-blue-500",
    stars: 5,
    text: "The CTR prediction is scary accurate. I ran A/B tests and ThumbFi called the winner correctly 9 out of 10 times. It's like having a YouTube consultant on demand.",
    metric: "9/10 Predictions Correct",
    metricColor: "text-blue-600",
  },
  {
    name: "Marcus Chen",
    handle: "@marcusgaming",
    niche: "Gaming Creator • 540K subscribers",
    avatar: "MC",
    avatarBg: "bg-purple-500",
    stars: 5,
    text: "As a solo creator I can't afford a design team. ThumbFi gives me agency-quality thumbnails at a fraction of the cost. The gaming templates are insanely good.",
    metric: "Saved $2,400/yr",
    metricColor: "text-purple-600",
  },
  {
    name: "Jordan Blake",
    handle: "@jordanbuilds",
    niche: "AI & Tech • 90K subscribers",
    avatar: "JB",
    avatarBg: "bg-teal-500",
    stars: 5,
    text: "I'm not a designer and never will be. ThumbFi is my unfair advantage. The $THUMB holder discount alone pays for my subscription — and the weekly free credits are a bonus.",
    metric: "$THUMB Holder",
    metricColor: "text-[#FF7A00]",
  },
  {
    name: "Sarah Kim",
    handle: "@sarahlifestyle",
    niche: "Lifestyle Creator • 1.1M subscribers",
    avatar: "SK",
    avatarBg: "bg-pink-500",
    stars: 5,
    text: "Better than my dedicated thumbnail designer, faster, and 10x cheaper. The emotion detection feature is genuinely groundbreaking — it flagged thumbnails I thought were good but were actually flat.",
    metric: "10× Faster Workflow",
    metricColor: "text-pink-600",
  },
  {
    name: "Devon Walsh",
    handle: "@devonpodcast",
    niche: "Podcast Host • 45K subscribers",
    avatar: "DW",
    avatarBg: "bg-amber-500",
    stars: 5,
    text: "The podcast templates are spot-on. Dark, dramatic, high-contrast — exactly what the algorithm loves. My average view duration also improved because the right audience is now clicking.",
    metric: "+32% View Duration",
    metricColor: "text-amber-600",
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-[#FF7A00] uppercase tracking-widest">Testimonials</span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-[#2D1C12] leading-tight">
            Loved by Creators
            <br />
            <span className="gradient-text">Everywhere</span>
          </h2>
          <p className="mt-4 text-lg text-[#9A7560]">
            Join thousands of creators growing their channels with ThumbFi.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.05 + i * 0.09 }}
              className="break-inside-avoid bg-white rounded-2xl p-6 border border-[#EAD9CC]/60 shadow-sm card-lift mb-5"
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-[#FF7A00]/30 mb-3" fill="#FF7A00" fillOpacity={0.15} />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[#6B3F2A] text-sm leading-relaxed mb-4">{t.text}</p>

              {/* Metric */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EDE3] text-xs font-bold mb-5 ${t.metricColor}`}>
                <span>📈</span>
                {t.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-[#2D1C12] text-sm">{t.name}</div>
                  <div className="text-[#9A7560] text-xs">{t.niche}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
