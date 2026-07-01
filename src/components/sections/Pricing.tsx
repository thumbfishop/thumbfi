"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Check, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    fiatPrice: "$0",
    thumbPrice: "0 THUMB",
    period: "/mo",
    desc: "Perfect for exploring ThumbFi.",
    cta: "Start Free",
    ctaVariant: "secondary" as const,
    features: [
      "5 AI thumbnails / month",
      "10 templates",
      "Basic CTR prediction",
      "720p export",
      "ThumbFi watermark",
      "Community support",
    ],
    highlight: false,
    badge: null,
  },
  {
    name: "Creator",
    fiatPrice: "$29",
    thumbPrice: "2,400 THUMB",
    period: "/mo",
    desc: "For serious content creators.",
    cta: "Start Creator",
    ctaVariant: "default" as const,
    features: [
      "150 AI thumbnails / month",
      "500+ templates",
      "Full CTR + Emotion analysis",
      "4K export",
      "No watermark",
      "Background removal",
      "Face enhancement",
      "A/B comparison",
      "Priority support",
    ],
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Pro Holder",
    fiatPrice: "$49",
    thumbPrice: "1,500 THUMB",
    period: "/mo",
    desc: "Max value for $THUMB holders.",
    cta: "Get Pro Holder",
    ctaVariant: "dark" as const,
    features: [
      "Unlimited AI thumbnails",
      "All 1,000+ templates",
      "Full intelligence suite",
      "4K + batch export",
      "White-label option",
      "Custom brand kits",
      "API access",
      "Creator marketplace early access",
      "50% THUMB discount",
      "Dedicated account manager",
    ],
    highlight: false,
    badge: "Best Value w/ THUMB",
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [payWithThumb, setPayWithThumb] = useState(false)

  return (
    <section id="pricing" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-[#FF7A00] uppercase tracking-widest">Pricing</span>
          <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-[#2D1C12] leading-tight">
            Simple,{" "}
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-[#9A7560]">
            No hidden fees. Cancel anytime. Pay less with $THUMB.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white border border-[#EAD9CC] rounded-full p-1.5">
            <button
              onClick={() => setPayWithThumb(false)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !payWithThumb
                  ? "bg-[#2D1C12] text-white shadow-sm"
                  : "text-[#9A7560] hover:text-[#2D1C12]"
              }`}
            >
              Pay with USD
            </button>
            <button
              onClick={() => setPayWithThumb(true)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                payWithThumb
                  ? "bg-[#FF7A00] text-white shadow-sm"
                  : "text-[#9A7560] hover:text-[#2D1C12]"
              }`}
            >
              <span>Pay with THUMB</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Save 30–50%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1 }}
              className={`relative rounded-3xl p-7 border transition-all duration-200 ${
                plan.highlight
                  ? "bg-[#FF7A00] border-[#FF7A00] shadow-2xl shadow-orange-500/30 scale-[1.03]"
                  : "bg-white border-[#EAD9CC]/60 hover:border-[#FF7A00]/30 hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                  plan.highlight ? "bg-[#2D1C12] text-white" : "bg-[#2D1C12] text-white"
                }`}>
                  {plan.highlight ? "⭐ " : "🏆 "}{plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? "text-white" : "text-[#2D1C12]"}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-black mt-3 ${plan.highlight ? "text-white" : "text-[#2D1C12]"}`}>
                  {payWithThumb ? plan.thumbPrice : plan.fiatPrice}
                  {!payWithThumb && (
                    <span className={`text-base font-medium ${plan.highlight ? "text-white/70" : "text-[#9A7560]"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                {payWithThumb && plan.fiatPrice !== "$0" && (
                  <div className={`text-sm mt-0.5 ${plan.highlight ? "text-white/70" : "text-[#9A7560]"}`}>
                    vs. {plan.fiatPrice}/mo in USD
                  </div>
                )}
                <p className={`text-sm mt-3 ${plan.highlight ? "text-white/80" : "text-[#9A7560]"}`}>
                  {plan.desc}
                </p>
              </div>

              <Link href="/sign-up">
                <Button
                  variant={plan.ctaVariant}
                  className={`w-full mb-6 ${plan.highlight ? "bg-white text-[#FF7A00] hover:bg-white/90" : ""}`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className={`h-px mb-6 ${plan.highlight ? "bg-white/20" : "bg-[#EAD9CC]"}`} />

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.highlight ? "text-white" : "text-[#FF7A00]"
                      }`}
                      strokeWidth={2.5}
                    />
                    <span className={`text-sm ${plan.highlight ? "text-white/90" : "text-[#6B3F2A]"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          {["No credit card required", "Cancel anytime", "1-week refund policy", "THUMB accepted worldwide"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-[#9A7560]">
              <Zap className="w-3.5 h-3.5 text-[#FF7A00]" fill="#FF7A00" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
