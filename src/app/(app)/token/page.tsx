"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingUp, Gift, Lock, Star, Receipt, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import type { WalletTransaction } from "@/types"

// No wallet connected / no on-chain activity yet.
const TRANSACTIONS: WalletTransaction[] = []
const BALANCE = 0

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

const TIER_CONFIG = [
  { threshold: 0,      label: "Starter",  discount: 0,   color: "text-[#9A7560]",   bg: "bg-[#F5EDE3]" },
  { threshold: 1000,   label: "Creator",  discount: 10,  color: "text-blue-600",     bg: "bg-blue-50" },
  { threshold: 5000,   label: "Builder",  discount: 20,  color: "text-emerald-600",  bg: "bg-emerald-50" },
  { threshold: 10000,  label: "Pro",      discount: 30,  color: "text-purple-600",   bg: "bg-purple-50" },
  { threshold: 50000,  label: "Legend",   discount: 50,  color: "text-amber-600",    bg: "bg-amber-50" },
]

function getTier(balance: number) {
  let tier = TIER_CONFIG[0]
  for (const t of TIER_CONFIG) {
    if (balance >= t.threshold) tier = t
  }
  return tier
}

function getNextTier(balance: number) {
  for (const t of TIER_CONFIG) {
    if (balance < t.threshold) return t
  }
  return null
}

export default function TokenPage() {
  const balance = BALANCE
  const currentTier = getTier(balance)
  const nextTier = getNextTier(balance)
  const progressToNext = nextTier ? Math.min(100, Math.round((balance / nextTier.threshold) * 100)) : 100

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div {...fade(0)}>
        <h1 className="text-2xl font-black text-[#2D1C12]">Token & Wallet</h1>
        <p className="text-[#9A7560] text-sm mt-1">Manage your $THUMB tokens, tier benefits, and staking rewards</p>
      </motion.div>

      {/* Top row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Balance card */}
        <motion.div {...fade(0.06)} className="md:col-span-2 bg-[#2D1C12] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center">
                  <span className="text-white font-black text-sm">T</span>
                </div>
                <p className="text-white/60 text-sm font-semibold">$THUMB Balance</p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl ${currentTier.bg}`}>
                <Star className={`w-3 h-3 ${currentTier.color} fill-current`} />
                <span className={`text-xs font-black ${currentTier.color}`}>{currentTier.label}</span>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl font-black text-white">{balance.toLocaleString()}</span>
              <span className="text-white/50 font-semibold mb-1">THUMB</span>
            </div>
            <p className="text-white/40 text-xs">≈ ${(balance * 0.012).toFixed(2)} USD at $0.012/THUMB</p>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-white/60 text-[11px]">{nextTier.threshold - balance} THUMB to {nextTier.label} tier</p>
                  <p className="text-white/40 text-[11px]">{progressToNext}%</p>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FF7A00] to-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Wallet connect */}
            <div className="flex items-center gap-2 mt-5">
              <div className="flex-1 bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                <span className="text-white/50 text-xs flex-1 truncate">No wallet connected</span>
              </div>
              <button className="px-4 h-10 rounded-xl bg-[#FF7A00] flex items-center justify-center hover:bg-[#e56e00] transition-colors text-white text-xs font-bold">
                Connect
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tier benefits */}
        <motion.div {...fade(0.1)} className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5">
          <h3 className="font-black text-sm text-[#2D1C12] mb-4">Tier Benefits</h3>
          <div className="space-y-2.5">
            {TIER_CONFIG.map(tier => (
              <div
                key={tier.label}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  currentTier.label === tier.label ? `${tier.bg} ring-1 ring-inset ring-current/20` : ""
                }`}
              >
                <div className={`w-7 h-7 rounded-lg ${tier.bg} flex items-center justify-center`}>
                  <Star className={`w-3.5 h-3.5 ${tier.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#2D1C12]">{tier.label}</p>
                    {currentTier.label === tier.label && (
                      <span className="text-[9px] font-black text-[#FF7A00]">CURRENT</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#9A7560]">
                    {tier.threshold === 0 ? "Free" : `${tier.threshold.toLocaleString()}+ THUMB`}
                    {tier.discount > 0 && ` · ${tier.discount}% off`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Earning opportunities */}
      <motion.div {...fade(0.16)}>
        <h2 className="font-black text-[#2D1C12] mb-4">Earn THUMB</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Lock,       label: "Stake Tokens",     desc: "Earn 12% APY by staking THUMB",           reward: "+500/wk",   color: "text-purple-600", bg: "bg-purple-50" },
            { icon: Gift,       label: "Refer a Friend",   desc: "200 THUMB for each referral who joins",   reward: "+200 each", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: TrendingUp, label: "Share Thumbnails", desc: "Earn THUMB when others use your exports", reward: "+10 each",  color: "text-blue-600",    bg: "bg-blue-50" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5 hover:border-[#FF7A00]/20 hover:shadow-md transition-all">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="font-black text-sm text-[#2D1C12]">{item.label}</h3>
              <p className="text-xs text-[#9A7560] mt-1 mb-3">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-600">{item.reward}</span>
                <button className="text-xs font-bold text-[#FF7A00] hover:underline">Start →</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Transaction history */}
      <motion.div {...fade(0.24)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-[#2D1C12]">Transaction History</h2>
        </div>
        {TRANSACTIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center bg-white rounded-2xl border border-dashed border-[#EAD9CC]">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] flex items-center justify-center">
              <Receipt className="w-6 h-6 text-[#C4A898]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-black text-[#2D1C12]">No transactions yet</p>
              <p className="text-sm text-[#9A7560] mt-1">Connect a wallet to start earning and spending $THUMB.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {TRANSACTIONS.map((tx, i) => {
              const isPositive = tx.amount > 0
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border border-[#EAD9CC]/60"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPositive ? "bg-emerald-50" : "bg-red-50"}`}>
                    {isPositive ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2D1C12] truncate">{tx.description}</p>
                    <p className="text-[11px] text-[#9A7560] mt-0.5">
                      {new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className={`font-black text-sm ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                    {isPositive ? "+" : ""}{tx.amount.toLocaleString()} THUMB
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* CTA */}
      <motion.div {...fade(0.32)} className="bg-gradient-to-r from-[#FF7A00] to-amber-500 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 rounded-2xl" />
        <div className="relative">
          <h3 className="text-white font-black text-lg mb-1">Get more $THUMB</h3>
          <p className="text-white/70 text-sm mb-4">Purchase THUMB tokens at $0.012 each and unlock Pro benefits instantly.</p>
          <button className="px-6 py-2.5 rounded-2xl bg-white text-[#FF7A00] font-black text-sm hover:bg-[#FFF7EF] transition-all shadow-md">
            Buy THUMB Tokens
          </button>
        </div>
      </motion.div>
    </div>
  )
}
