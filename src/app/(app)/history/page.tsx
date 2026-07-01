"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, Download, Trash2, TrendingUp, Clock, BarChart2, Loader2 } from "lucide-react"
import { listThumbnailsAction, deleteThumbnailAction } from "@/lib/actions/thumbnails"
import type { Thumbnail, ThumbnailCategory } from "@/types"

type SortOption = "newest" | "oldest" | "ctr_high" | "ctr_low"

const CATEGORY_LABEL: Record<string, string> = {
  crypto: "Crypto", finance: "Finance", gaming: "Gaming", ai_tech: "AI & Tech",
  lifestyle: "Lifestyle", fitness: "Fitness", podcast: "Podcast", news: "News",
  tutorial: "Tutorial", vlog: "Vlog", entertainment: "Entertainment",
}
const NICHE_FILTERS = ["All", "Crypto", "Finance", "Gaming", "AI & Tech", "Lifestyle"]

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

async function downloadImage(url: string, name: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const objUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = objUrl
    a.download = `${name}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objUrl)
  } catch {
    window.open(url, "_blank")
  }
}

export default function HistoryPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [nicheFilter, setNicheFilter] = useState("All")
  const [sort, setSort] = useState<SortOption>("newest")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const { data: thumbnails = [], isLoading } = useQuery({
    queryKey: ["thumbnails"],
    queryFn: () => listThumbnailsAction(),
  })

  const del = useMutation({
    mutationFn: (id: string) => deleteThumbnailAction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["thumbnails"] }),
  })

  const filtered = thumbnails
    .filter(t => {
      const label = CATEGORY_LABEL[t.category] ?? t.category
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || label.toLowerCase().includes(search.toLowerCase())
      const matchNiche = nicheFilter === "All" || label === nicheFilter
      return matchSearch && matchNiche
    })
    .sort((a, b) => {
      if (sort === "newest") return +new Date(b.created_at) - +new Date(a.created_at)
      if (sort === "oldest") return +new Date(a.created_at) - +new Date(b.created_at)
      if (sort === "ctr_high") return b.ctr_score - a.ctr_score
      return a.ctr_score - b.ctr_score
    })

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const avgCtr = thumbnails.length
    ? Math.round(thumbnails.reduce((acc, t) => acc + t.ctr_score, 0) / thumbnails.length)
    : 0
  const thisMonth = thumbnails.filter(t => {
    const d = new Date(t.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h1 className="text-2xl font-black text-[#2D1C12]">Generation History</h1>
        <p className="text-[#9A7560] mt-1 text-sm">All your AI-generated thumbnails in one place.</p>
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: BarChart2, label: "Total Generated", value: thumbnails.length.toString(), color: "text-[#FF7A00]", bg: "bg-[#FF7A00]/8" },
          { icon: TrendingUp, label: "Avg CTR Score", value: avgCtr > 0 ? `${avgCtr}%` : "—", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Clock, label: "This Month", value: thisMonth.toString(), color: "text-blue-600", bg: "bg-blue-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#EAD9CC]/60 flex items-center gap-3">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.color}`} strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-lg font-black text-[#2D1C12]">{s.value}</div>
              <div className="text-xs text-[#9A7560]">{s.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A7560]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search thumbnails..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] transition-colors text-sm text-[#2D1C12] placeholder-[#C4A898]"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {NICHE_FILTERS.map(n => (
            <button
              key={n}
              onClick={() => setNicheFilter(n)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                nicheFilter === n ? "bg-[#FF7A00] text-white" : "border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#FF7A00]/40 bg-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="px-3 py-2.5 rounded-xl border-2 border-[#EAD9CC] bg-white text-sm font-semibold text-[#2D1C12] focus:outline-none focus:border-[#FF7A00] transition-colors"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="ctr_high">CTR: High to Low</option>
          <option value="ctr_low">CTR: Low to High</option>
        </select>
      </motion.div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#2D1C12] text-white">
          <span className="text-sm font-semibold">{selected.size} selected</span>
          <button
            onClick={() => { selected.forEach(id => del.mutate(id)); setSelected(new Set()) }}
            className="ml-auto flex items-center gap-1.5 text-sm font-bold hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </motion.div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-[#FF7A00] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-[#C4A898]" strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-[#2D1C12]">{thumbnails.length === 0 ? "No thumbnails yet" : "No matches"}</h3>
          <p className="text-sm text-[#9A7560] mt-1">
            {thumbnails.length === 0 ? "Generate your first thumbnail to see it here." : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((thumb: Thumbnail, i) => (
            <motion.div
              key={thumb.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.4) }}
              className="group cursor-pointer"
              onClick={() => toggleSelect(thumb.id)}
            >
              <div className={`relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-[#F5EDE3] ${selected.has(thumb.id) ? "ring-2 ring-[#FF7A00] ring-offset-2" : ""}`}>
                {thumb.preview_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={thumb.preview_url} alt={thumb.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${thumb.preview_gradient || "from-slate-700 to-slate-900"}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <div className="text-white font-black text-[8px] leading-tight line-clamp-2">{thumb.title}</div>
                </div>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => { e.stopPropagation(); if (thumb.preview_url) downloadImage(thumb.preview_url, thumb.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "thumbnail") }}
                    className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); del.mutate(thumb.id) }}
                    className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/70 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold ${thumb.ctr_score >= 92 ? "bg-emerald-500/90" : thumb.ctr_score >= 85 ? "bg-[#FF7A00]/90" : "bg-gray-500/90"}`}>
                  {thumb.ctr_score}%
                </div>
                {selected.has(thumb.id) && (
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#FF7A00] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </div>
              <div className="mt-1.5 px-0.5">
                <div className="text-[10px] font-bold text-[#2D1C12] truncate">{CATEGORY_LABEL[thumb.category] ?? thumb.category}</div>
                <div className="text-[10px] text-[#9A7560]">{relativeTime(thumb.created_at)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
