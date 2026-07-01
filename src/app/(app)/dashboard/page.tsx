"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Wand2, TrendingUp, Zap, FolderOpen, ArrowRight,
  Star, Download, Eye, MoreHorizontal, Sparkles, Clock
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { MOCK_STATS, MOCK_PROJECTS, MOCK_THUMBNAILS } from "@/lib/mock/data"
import { useState } from "react"

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

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

function ThumbnailMini({ thumb, delay }: { thumb: typeof MOCK_THUMBNAILS[0]; delay: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div {...fade(delay)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="group cursor-pointer">
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
        <div className={`absolute inset-0 bg-gradient-to-br ${thumb.preview_gradient}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-white font-black text-[8px] leading-tight">{thumb.title}</p>
          </div>
        </div>
        {hover && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-1.5">
            <Link href={`/editor/${thumb.id}`} className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Eye className="w-3.5 h-3.5 text-white" />
            </Link>
            <button className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Download className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        )}
        <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white ${
          thumb.ctr_score >= 90 ? "bg-emerald-500/90" : "bg-[#FF7A00]/90"
        }`}>
          {thumb.ctr_score}%
        </div>
        {thumb.is_favorite && (
          <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-amber-400/90 flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        )}
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-[10px] font-semibold text-[#2D1C12] truncate capitalize">{thumb.category.replace("_", " ")}</p>
        <p className="text-[10px] text-[#9A7560]">{new Date(thumb.created_at).toLocaleDateString()}</p>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, delay }: { project: typeof MOCK_PROJECTS[0]; delay: number }) {
  const thumb = MOCK_THUMBNAILS.find(t => t.id === project.cover_thumbnail_id)
  return (
    <motion.div {...fade(delay)} className="bg-white rounded-2xl border border-[#EAD9CC]/60 hover:border-[#FF7A00]/20 hover:shadow-md transition-all overflow-hidden group cursor-pointer">
      <div className="h-24 relative overflow-hidden">
        {thumb ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${thumb.preview_gradient}`} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE3] to-[#EAD9CC]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {project.is_favorite && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400/90 flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        )}
        <div className="absolute bottom-2 left-3">
          <p className="text-white font-black text-xs leading-tight">{project.title}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#9A7560]">{project.thumbnail_count} thumbnails</p>
            <p className="text-[10px] text-[#C4A898] mt-0.5">Updated {new Date(project.updated_at).toLocaleDateString()}</p>
          </div>
          <Link href={`/projects`} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useUser()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const stats = MOCK_STATS
  const creditsPercent = Math.round((stats.credits_used / stats.credits_limit) * 100)

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
              {stats.credits_limit - stats.credits_used} credits
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
          <StatCard icon={Wand2} label="Total Generated" value={stats.total_thumbnails.toString()} sub="+24 this week" color="text-[#FF7A00]" bg="bg-[#FF7A00]/8" />
        </motion.div>
        <motion.div {...fade(0.08)}>
          <StatCard icon={TrendingUp} label="Avg CTR Score" value={stats.avg_ctr_score.toString()} suffix="%" sub="+3.4% vs last month" color="text-emerald-600" bg="bg-emerald-50" />
        </motion.div>
        <motion.div {...fade(0.12)}>
          <StatCard icon={Zap} label="Credits Used" value={`${stats.credits_used}`} suffix={`/${stats.credits_limit}`} sub="Resets in 18 days" color="text-blue-600" bg="bg-blue-50" />
        </motion.div>
        <motion.div {...fade(0.16)}>
          <StatCard icon={FolderOpen} label="Active Projects" value={stats.active_projects.toString()} sub="5 with activity" color="text-purple-600" bg="bg-purple-50" />
        </motion.div>
      </div>

      {/* Credit usage bar */}
      <motion.div {...fade(0.2)} className="bg-white rounded-2xl border border-[#EAD9CC]/60 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-black text-sm text-[#2D1C12]">Monthly Usage</h3>
            <p className="text-xs text-[#9A7560] mt-0.5">
              {stats.credits_used} of {stats.credits_limit} credits · resets in 18 days
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
          <span className="text-[11px] text-[#9A7560]">{stats.credits_limit - stats.credits_used} remaining</span>
        </div>
      </motion.div>

      {/* Two-column: recent thumbnails + projects */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Recent thumbnails */}
        <div>
          <motion.div {...fade(0.25)} className="flex items-center justify-between mb-4">
            <h2 className="font-black text-[#2D1C12]">Recent Thumbnails</h2>
            <Link href="/projects" className="text-sm text-[#FF7A00] font-bold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MOCK_THUMBNAILS.slice(0, 8).map((t, i) => (
              <ThumbnailMini key={t.id} thumb={t} delay={0.28 + i * 0.04} />
            ))}
          </div>
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

          {/* Recent projects */}
          <div>
            <motion.div {...fade(0.32)} className="flex items-center justify-between mb-3">
              <h2 className="font-black text-[#2D1C12]">Projects</h2>
              <Link href="/projects" className="text-sm text-[#FF7A00] font-bold hover:underline">View all</Link>
            </motion.div>
            <div className="space-y-2">
              {MOCK_PROJECTS.slice(0, 3).map((p, i) => (
                <motion.div key={p.id} {...fade(0.36 + i * 0.05)}>
                  <Link href="/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-[#EAD9CC]/60 hover:border-[#FF7A00]/20 hover:shadow-sm transition-all group">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${MOCK_THUMBNAILS.find(t => t.id === p.cover_thumbnail_id)?.preview_gradient ?? "from-[#F5EDE3] to-[#EAD9CC]"} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#2D1C12] truncate">{p.title}</p>
                      <p className="text-[10px] text-[#9A7560]">{p.thumbnail_count} thumbnails</p>
                    </div>
                    {p.is_favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
                  </Link>
                </motion.div>
              ))}
            </div>
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
