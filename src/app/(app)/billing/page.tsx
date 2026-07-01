"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Crown, Star, Building2, ArrowRight, Wallet } from "lucide-react"
import Link from "next/link"
import { PLANS } from "@/types"
import { MOCK_USER } from "@/lib/mock/data"

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

const PLAN_ICONS: Record<string, React.ElementType> = {
  free: Zap,
  creator: Star,
  pro: Crown,
  enterprise: Building2,
}

const PLAN_FEATURES: Record<string, string[]> = {
  free: [
    "10 thumbnail generations/mo",
    "3 active projects",
    "JPG export only",
    "Basic styles",
    "Community support",
  ],
  creator: [
    "200 generations/month",
    "Unlimited projects",
    "PNG + JPG export",
    "All styles & categories",
    "Template library access",
    "Priority queue",
    "Email support",
  ],
  pro: [
    "1,000 generations/month",
    "Unlimited projects",
    "4K PNG + JPG + WebP export",
    "All styles & categories",
    "Template library + upload",
    "Canvas editor",
    "API access (100 req/day)",
    "Priority queue",
    "Dedicated support",
  ],
  enterprise: [
    "Custom generation volume",
    "Unlimited everything",
    "4K + custom resolutions",
    "Custom model fine-tuning",
    "White-label option",
    "Unlimited API access",
    "SLA guarantee",
    "Slack Connect support",
    "Custom onboarding",
  ],
}

export default function BillingPage() {
  const [paymentMode, setPaymentMode] = useState<"usd" | "thumb">("usd")
  const currentPlan = MOCK_USER.plan

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fade(0)}>
        <h1 className="text-2xl font-black text-[#2D1C12]">Billing & Plans</h1>
        <p className="text-[#9A7560] text-sm mt-1">
          Upgrade to generate more thumbnails and unlock advanced features
        </p>
      </motion.div>

      {/* Current plan banner */}
      <motion.div {...fade(0.06)} className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <div>
            <p className="text-xs text-[#9A7560] font-semibold uppercase tracking-wider">Current Plan</p>
            <p className="font-black text-[#2D1C12] capitalize">{currentPlan} Plan</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[#9A7560]">
            <span className="font-bold text-[#2D1C12]">134</span> / 200 credits used this month
          </div>
          <div className="h-2 w-28 bg-[#F5EDE3] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF7A00] rounded-full" style={{ width: "67%" }} />
          </div>
        </div>
        <Link href="/settings" className="text-sm font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
          Manage subscription <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>

      {/* Payment mode toggle */}
      <motion.div {...fade(0.1)} className="flex items-center justify-center">
        <div className="flex items-center gap-1 p-1 bg-[#F5EDE3] rounded-2xl">
          <button
            onClick={() => setPaymentMode("usd")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              paymentMode === "usd"
                ? "bg-white text-[#2D1C12] shadow-sm"
                : "text-[#9A7560] hover:text-[#2D1C12]"
            }`}
          >
            Pay with USD
          </button>
          <button
            onClick={() => setPaymentMode("thumb")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              paymentMode === "thumb"
                ? "bg-white text-[#2D1C12] shadow-sm"
                : "text-[#9A7560] hover:text-[#2D1C12]"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Pay with THUMB
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg">
              Save up to 30%
            </span>
          </button>
        </div>
      </motion.div>

      {/* Plans grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(PLANS).map((plan, i) => {
          const Icon = PLAN_ICONS[plan.key]
          const isCurrent = plan.key === currentPlan
          const isPro = plan.key === "pro"
          const price = paymentMode === "usd" ? plan.price_usd : plan.price_thumb
          const unit = paymentMode === "usd" ? "/mo" : " THUMB/mo"

          return (
            <motion.div
              key={plan.key}
              {...fade(0.14 + i * 0.06)}
              className={`relative bg-white rounded-2xl border overflow-hidden transition-all ${
                isPro
                  ? "border-[#FF7A00] shadow-xl shadow-orange-100"
                  : isCurrent
                  ? "border-[#2D1C12]"
                  : "border-[#EAD9CC]/60 hover:border-[#FF7A00]/20 hover:shadow-md"
              }`}
            >
              {isPro && (
                <div className="bg-[#FF7A00] px-4 py-1.5 text-center">
                  <p className="text-white font-black text-[11px] uppercase tracking-wider">Most Popular</p>
                </div>
              )}
              {isCurrent && !isPro && (
                <div className="bg-[#2D1C12] px-4 py-1.5 text-center">
                  <p className="text-white font-black text-[11px] uppercase tracking-wider">Current Plan</p>
                </div>
              )}

              <div className="p-5">
                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                  isPro ? "bg-[#FF7A00]/10" : "bg-[#F5EDE3]"
                }`}>
                  <Icon className={`w-5 h-5 ${isPro ? "text-[#FF7A00]" : "text-[#6B3F2A]"}`} />
                </div>

                <h3 className="font-black text-[#2D1C12] capitalize">{plan.key}</h3>

                <div className="mt-3 mb-4">
                  {plan.key === "enterprise" ? (
                    <p className="text-2xl font-black text-[#2D1C12]">Custom</p>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-[#2D1C12]">
                        {paymentMode === "usd" ? `$${plan.price_usd}` : plan.price_thumb.toLocaleString()}
                      </span>
                      <span className="text-sm text-[#9A7560] font-semibold mb-0.5">{unit}</span>
                    </div>
                  )}
                  {paymentMode === "thumb" && plan.key !== "free" && plan.key !== "enterprise" && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      Save {Math.round((1 - (plan.price_thumb * 0.012) / plan.price_usd) * 100)}% vs USD
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {PLAN_FEATURES[plan.key].map(feat => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[11px] text-[#6B3F2A]">{feat}</span>
                    </li>
                  ))}
                </ul>

                {plan.key === "enterprise" ? (
                  <button className="w-full py-2.5 rounded-xl border-2 border-[#2D1C12] text-[#2D1C12] font-bold text-sm hover:bg-[#2D1C12] hover:text-white transition-all">
                    Contact Sales
                  </button>
                ) : isCurrent ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-[#F5EDE3] text-[#9A7560] font-bold text-sm cursor-default">
                    Current Plan
                  </button>
                ) : (
                  <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isPro
                      ? "bg-[#FF7A00] text-white hover:bg-[#e56e00] shadow-md shadow-orange-200"
                      : "bg-[#2D1C12] text-white hover:bg-[#1a0f08]"
                  }`}>
                    {plan.price_usd === 0 ? "Downgrade" : "Upgrade"}
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* FAQ */}
      <motion.div {...fade(0.44)}>
        <h2 className="font-black text-[#2D1C12] mb-4">Frequently Asked</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel any time and you'll keep access until the end of your billing period." },
            { q: "What is THUMB payment?", a: "Pay with $THUMB tokens and save up to 30%. Your THUMB balance is used directly from your wallet." },
            { q: "What counts as a credit?", a: "One generation run = 1 credit per variation. Generating 4 variations uses 4 credits." },
            { q: "Do unused credits roll over?", a: "Credits reset monthly and don't roll over. Upgrade your plan for more monthly credits." },
          ].map(item => (
            <div key={item.q} className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5">
              <p className="font-black text-sm text-[#2D1C12] mb-2">{item.q}</p>
              <p className="text-xs text-[#9A7560] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
