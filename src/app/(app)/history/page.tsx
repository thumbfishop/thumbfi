"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, Eye, Trash2, TrendingUp, Clock, BarChart2 } from "lucide-react"

type SortOption = "newest" | "oldest" | "ctr_high" | "ctr_low"

type HistoryItem = {
  id: number
  title: string
  niche: string
  ctr: number
  gradient: string
  date: string
  time: string
}

// No generation history yet — real items will load from the backend once connected.
const ALL_HISTORY: HistoryItem[] = []

const NICHE_FILTERS = ["All", "Crypto", "Finance", "Gaming", "AI & Tech", "Lifestyle"]

export default function HistoryPage() {
  const [search, setSearch] = useState("")
  const [nicheFilter, setNicheFilter] = useState("All")
  const [sort, setSort] = useState<SortOption>("newest")
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const filtered = ALL_HISTORY
    .filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.niche.toLowerCase().includes(search.toLowerCase())
      const matchNiche = nicheFilter === "All" || t.niche === nicheFilter
      return matchSearch && matchNiche
    })
    .sort((a, b) => {
      if (sort === "newest") return b.id - a.id
      if (sort === "oldest") return a.id - b.id
      if (sort === "ctr_high") return b.ctr - a.ctr
      return a.ctr - b.ctr
    })

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const avgCtr = ALL_HISTORY.length
    ? Math.round(ALL_HISTORY.reduce((acc, t) => acc + t.ctr, 0) / ALL_HISTORY.length)
    : 0
  const thisMonthCount = ALL_HISTORY.length

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h1 className="text-2xl font-black text-[#2D1C12]">Generation History</h1>
        <p className="text-[#9A7560] mt-1 text-sm">All your AI-generated thumbnails in one place.</p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { icon: BarChart2, label: "Total Generated", value: ALL_HISTORY.length.toString(), color: "text-[#FF7A00]", bg: "bg-[#FF7A00]/8" },
          { icon: TrendingUp, label: "Avg CTR Score", value: avgCtr > 0 ? `${avgCtr}%` : "—", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Clock, label: "This Month", value: thisMonthCount.toString(), color: "text-blue-600", bg: "bg-blue-50" },
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A7560]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search thumbnails..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] transition-colors text-sm text-[#2D1C12] placeholder-[#C4A898]"
          />
        </div>

        {/* Niche filter */}
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

        {/* Sort */}
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
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#2D1C12] text-white"
        >
          <span className="text-sm font-semibold">{selected.size} selected</span>
          <button className="ml-auto flex items-center gap-1.5 text-sm font-bold hover:text-[#FF7A00] transition-colors">
            <Download className="w-4 h-4" /> Download All
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="flex items-center gap-1.5 text-sm font-bold hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filtered.map((thumb, i) => (
          <motion.div
            key={thumb.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="group cursor-pointer"
            onClick={() => toggleSelect(thumb.id)}
          >
            <div className={`relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${selected.has(thumb.id) ? "ring-2 ring-[#FF7A00] ring-offset-2" : ""}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${thumb.gradient}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <div className="text-white font-black text-[8px] leading-tight">{thumb.title}</div>
                </div>
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => { e.stopPropagation() }}
                  className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  onClick={e => { e.stopPropagation() }}
                  className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* CTR badge */}
              <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold ${
                thumb.ctr >= 92 ? "bg-emerald-500/90" : thumb.ctr >= 85 ? "bg-[#FF7A00]/90" : "bg-gray-500/90"
              }`}>
                {thumb.ctr}%
              </div>

              {/* Select check */}
              {selected.has(thumb.id) && (
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#FF7A00] flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>

            <div className="mt-1.5 px-0.5">
              <div className="text-[10px] font-bold text-[#2D1C12] truncate">{thumb.niche}</div>
              <div className="text-[10px] text-[#9A7560]">{thumb.time}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EDE3] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-[#C4A898]" strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-[#2D1C12]">No thumbnails yet</h3>
          <p className="text-sm text-[#9A7560] mt-1">Your generated thumbnails will appear here.</p>
        </div>
      )}
    </div>
  )
}
