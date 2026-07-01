"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Wand2, TrendingUp, Zap, FolderOpen, ArrowRight,
  Sparkles, Image as ImageIcon,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import type { DashboardStats } from "@/types"

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

// No activity yet — real values will come from the backend once connected.
const stats: DashboardStats = {
  total_thumbnails: 0,
  thumbnails_this_month: 0,
  avg_ctr_score: 0,
  credits_used: 0,
  credits_limit: 20,
  thumb_balance: 0,
  active_projects: 0,
}

function StatCard({ icon: Icon, label, value, suffix, sub, color, bg }: {
  icon: React.ElementType; label: string; value: string; suffix?: string
  sub: string; color: string; bg: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAD9CC]/60 hover:border-[#FF7A00]/20 hover:shadow-md transition-all cursor-default group">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} strokeWidth={2.2} />
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-black text-[#2D1C12]">{value}</span>
        {suffix && <span className="text-sm font-semibold text-[#9A7560] mb-0.5">{suffix}</span>}
      </div>
      <div className="text-xs font-semibold text-[#6B3F2A] mt-0.5">{label}</div>
      <div className="text-[11px] text-[#9A7560] mt-1">{sub}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useUser()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const creditsRemaining = stats.credits_limit - stats.credits_used
  const creditsPercent = stats.credits_limit > 0
    ? Math.round((stats.credits_used / stats.credits_limit) * 100)
    : 0

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fade(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D1C12]">
            {greeting}, {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "Creator"} 👋
          </h1>
          <p className="text-[#9A7560] text-sm mt-1">
            You have{" "}
            <span className="font-bold text-[#FF7A00]">
              {creditsRemaining} credits
            </span>{" "}
            remaining this month.
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all shadow-md shadow-orange-200 hover:-translate-y-0.5"
        >
          <Wand2 className="w-4 h-4" />
          New Thumbnail
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div {...fade(0.04)}>
          <StatCard icon={Wand2} label="Total Generated" value={stats.total_thumbnails.toString()} sub="No thumbnails yet" color="text-[#FF7A00]" bg="bg-[#FF7A00]/8" />
        </motion.div>
        <motion.div {...fade(0.08)}>
          <StatCard icon={TrendingUp} label="Avg CTR Score" value={stats.avg_ctr_score > 0 ? stats.avg_ctr_score.toString() : "—"} suffix={stats.avg_ctr_score > 0 ? "%" : undefined} sub="No data yet" color="text-emerald-600" bg="bg-emerald-50" />
        </motion.div>
        <motion.div {...fade(0.12)}>
          <StatCard icon={Zap} label="Credits Used" value={`${stats.credits_used}`} suffix={`/${stats.credits_limit}`} sub="Resets monthly" color="text-blue-600" bg="bg-blue-50" />
        </motion.div>
        <motion.div {...fade(0.16)}>
          <StatCard icon={FolderOpen} label="Active Projects" value={stats.active_projects.toString()} sub="No projects yet" color="text-purple-600" bg="bg-purple-50" />
        </motion.div>
      </div>

      {/* Credit usage bar */}
      <motion.div {...fade(0.2)} className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-black text-sm text-[#2D1C12]">Monthly Usage</h3>
            <p className="text-xs text-[#9A7560] mt-0.5">
              {stats.credits_used} of {stats.credits_limit} credits used
            </p>
          </div>
          <Link href="/billing" className="text-xs font-bold text-[#FF7A00] hover:underline">
            Upgrade plan
          </Link>
        </div>
        <div className="h-2.5 bg-[#F5EDE3] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF7A00] to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${creditsPercent}%` }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-[#9A7560]">{creditsPercent}% used</span>
          <span className="text-[11px] text-[#9A7560]">{creditsRemaining} remaining</span>
        </div>
      </motion.div>

      {/* Two-column: recent thumbnails + projects */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Recent thumbnails */}
        <div>
          <motion.div {...fade(0.25)} className="flex items-center justify-between mb-4">
            <h2 className="font-black text-[#2D1C12]">Recent Thumbnails</h2>
          </motion.div>
          <motion.div {...fade(0.28)} className="bg-white rounded-2xl border border-[#EAD9CC]/60 border-dashed flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7EF] flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-[#FF7A00]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-black text-[#2D1C12]">No thumbnails yet</p>
              <p className="text-sm text-[#9A7560] mt-1">Generate your first thumbnail to see it here.</p>
            </div>
            <Link href="/generate" className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all">
              <Wand2 className="w-3.5 h-3.5" /> Generate
            </Link>
          </motion.div>
        </div>

        {/* Projects + actions */}
        <div className="space-y-6">
          {/* Quick actions */}
          <motion.div {...fade(0.28)}>
            <h2 className="font-black text-[#2D1C12] mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: "/generate", icon: Wand2,          label: "Generate New Thumbnail", primary: true },
                { href: "/templates", icon: Sparkles,       label: "Browse Templates",        primary: false },
                { href: "/projects",  icon: FolderOpen,     label: "My Projects",             primary: false },
              ].map(a => (
                <Link key={a.href} href={a.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  a.primary
                    ? "bg-[#FF7A00] text-white hover:bg-[#e56e00] shadow-sm"
                    : "bg-white border border-[#EAD9CC] text-[#2D1C12] hover:border-[#FF7A00]/40 hover:bg-[#FFF7EF]"
                }`}>
                  <a.icon className="w-4 h-4" strokeWidth={2} />
                  {a.label}
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Projects */}
          <div>
            <motion.div {...fade(0.32)} className="flex items-center justify-between mb-3">
              <h2 className="font-black text-[#2D1C12]">Projects</h2>
              <Link href="/projects" className="text-sm text-[#FF7A00] font-bold hover:underline">View all</Link>
            </motion.div>
            <motion.div {...fade(0.36)} className="rounded-2xl border border-dashed border-[#EAD9CC] bg-white px-4 py-8 text-center">
              <p className="text-sm font-bold text-[#2D1C12]">No projects yet</p>
              <p className="text-[11px] text-[#9A7560] mt-1">Create a project to organize your thumbnails.</p>
            </motion.div>
          </div>

          {/* Upgrade CTA */}
          <motion.div {...fade(0.48)} className="rounded-2xl bg-[#2D1C12] p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#FF7A00]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <p className="text-xs font-bold text-[#FF7A00] mb-1">Pro Plan</p>
              <h3 className="text-white font-black text-sm leading-tight mb-2">Unlock unlimited generations</h3>
              <p className="text-white/50 text-xs mb-4">1000 credits/mo, 4K exports, API access and priority queue.</p>
              <Link href="/billing" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF7A00] text-white font-bold text-xs hover:bg-[#e56e00] transition-all">
                View Plans <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
