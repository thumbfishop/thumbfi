"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Crown, X, Wand2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { MOCK_TEMPLATES } from "@/lib/mock/data"
import type { Template } from "@/types"

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  crypto: "Crypto",
  finance: "Finance",
  gaming: "Gaming",
  ai_tech: "AI & Tech",
  lifestyle: "Lifestyle",
  news: "News",
  tutorial: "Tutorial",
  fitness: "Fitness",
  podcast: "Podcast",
  vlog: "Vlog",
}

function TemplateCard({ template, delay, onClick }: {
  template: Template
  delay: number
  onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
        <div className={`absolute inset-0 bg-gradient-to-br ${template.preview_gradient}`} />
        {template.preview_url && (
          <img
            src={template.preview_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-black text-xs leading-tight">{template.title}</p>
        </div>

        {template.is_premium && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400/90 text-[9px] font-black text-white">
            <Crown className="w-2.5 h-2.5" />
            PRO
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-white text-[#2D1C12] font-black text-xs shadow-lg hover:bg-[#FFF7EF]">
            Use Template
          </button>
        </div>
      </div>
      <div className="mt-2 px-1">
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className="text-xs font-bold text-[#2D1C12]">{template.title}</p>
            <p className="text-[10px] text-[#9A7560] mt-0.5">{template.description}</p>
          </div>
        </div>
        <p className="text-[10px] text-[#C4A898] mt-1">{template.uses_count.toLocaleString()} uses</p>
      </div>
    </motion.div>
  )
}

function TemplateModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden">
            <div className={`aspect-video relative bg-gradient-to-br ${template.preview_gradient}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-black text-lg leading-tight">{template.title}</p>
              </div>
              {template.is_premium && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/90 text-xs font-black text-white">
                  <Crown className="w-3 h-3" /> PRO
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-sm text-[#9A7560] mb-4">{template.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {template.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#FFF7EF] text-[11px] font-semibold text-[#6B3F2A]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-black text-[#2D1C12] uppercase tracking-wider">Stats</p>
                  <p className="text-sm text-[#9A7560] mt-1">{template.uses_count.toLocaleString()} creators used this</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#2D1C12] uppercase tracking-wider">Style</p>
                  <p className="text-sm text-[#9A7560] mt-1 capitalize">{template.style.replace("_", " ")}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/generate"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all shadow-md shadow-orange-200"
                >
                  <Wand2 className="w-4 h-4" />
                  Use Template
                </Link>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-2xl border border-[#EAD9CC] text-sm font-semibold text-[#9A7560] hover:border-[#FF7A00]/40 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}

export default function TemplatesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const categories = ["all", ...new Set(MOCK_TEMPLATES.map(t => t.category))]

  const filtered = MOCK_TEMPLATES
    .filter(t => category === "all" || t.category === category)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-[#2D1C12]">Templates</h1>
          <p className="text-[#9A7560] text-sm mt-1">
            {filtered.length} templates · start from a proven design
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all shadow-md shadow-orange-200 hover:-translate-y-0.5"
        >
          <Wand2 className="w-4 h-4" />
          Custom Generate
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A7560]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] text-sm text-[#2D1C12] placeholder-[#C4A898] transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-[#2D1C12] text-white"
                  : "bg-white border border-[#EAD9CC] text-[#6B3F2A] hover:border-[#FF7A00]/40"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <p className="font-black text-[#2D1C12]">No templates found</p>
          <p className="text-sm text-[#9A7560]">Try a different category or search term.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t, i) => (
            <TemplateCard key={t.id} template={t} delay={i * 0.04} onClick={() => setSelectedTemplate(t)} />
          ))}
        </div>
      )}

      {selectedTemplate && (
        <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      )}
    </div>
  )
}
