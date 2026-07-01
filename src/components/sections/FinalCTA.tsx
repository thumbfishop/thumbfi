"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export default function FinalCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-[#FF7A00] overflow-hidden p-10 sm:p-16 text-center"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-300/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
          </div>

          {/* Floating thumbnail mockups */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: ["-4deg", "-2deg", "-4deg"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-8 w-32 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-700 shadow-xl hidden lg:flex items-end p-2"
            style={{ rotate: "-8deg" }}
          >
            <div>
              <div className="text-white font-black text-xs leading-tight">DARK TRUTH</div>
              <div className="text-white/60 text-[9px]">Nobody Talks About</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -14, 0], rotate: ["5deg", "7deg", "5deg"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute -right-4 top-12 w-36 h-22 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl hidden lg:flex items-end p-2"
            style={{ rotate: "6deg" }}
          >
            <div>
              <div className="text-white font-black text-xs">$1M MILESTONE</div>
              <div className="text-white/60 text-[9px]">How I Got There</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute -left-4 bottom-10 w-28 h-18 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-xl hidden lg:flex items-end p-2"
            style={{ rotate: "4deg" }}
          >
            <div>
              <div className="text-white font-black text-xs">I QUIT MY JOB</div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Start for free — no card needed
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight"
            >
              Ready to Break
              <br />
              The Internet?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-5 text-white/80 text-lg max-w-xl mx-auto"
            >
              Generate your first AI thumbnail in under 60 seconds. Join 5,000+ creators already winning with ThumbFi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2D1C12] text-white rounded-full font-bold text-base hover:bg-[#3d2a1c] transition-all shadow-xl hover:-translate-y-0.5">
                Generate Your First Thumbnail Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#token" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-full font-semibold text-base hover:bg-white/30 transition-colors border border-white/30">
                Join the $THUMB Whitelist
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.65 }}
              className="mt-5 text-white/60 text-sm"
            >
              Free plan • No design skills needed • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
