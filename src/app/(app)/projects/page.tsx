"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  FolderOpen, Plus, Search, Grid3x3, List, Star, MoreHorizontal,
  Pencil, Trash2, Copy, Archive, SortAsc, Filter, Wand2
} from "lucide-react"
import type { Project } from "@/types"

// No projects yet — real projects will load from the backend once connected.
const PROJECTS: Project[] = []

type SortBy = "updated" | "created" | "name" | "thumbnails"
type ViewMode = "grid" | "list"

function ProjectMenu({ project, onRename, onDelete, onDuplicate, onArchive, onFavorite }: {
  project: Project
  onRename: () => void
  onDelete: () => void
  onDuplicate: () => void
  onArchive: () => void
  onFavorite: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(!open) }}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3] transition-all"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={e => { e.stopPropagation(); setOpen(false) }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-[#EAD9CC]/70 shadow-xl z-40 overflow-hidden"
            >
              {[
                { icon: Star,    label: project.is_favorite ? "Unfavorite" : "Favorite", action: onFavorite },
                { icon: Pencil,  label: "Rename",    action: onRename },
                { icon: Copy,    label: "Duplicate", action: onDuplicate },
                { icon: Archive, label: "Archive",   action: onArchive },
                { icon: Trash2,  label: "Delete",    action: onDelete, danger: true },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={e => { e.stopPropagation(); item.action(); setOpen(false) }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold transition-colors ${
                    item.danger ? "text-red-500 hover:bg-red-50" : "text-[#2D1C12] hover:bg-[#FFF7EF]"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  const [fav, setFav] = useState(project.is_favorite)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-[#EAD9CC]/60 hover:border-[#FF7A00]/20 hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
    >
      <Link href="/generate" className="block">
        <div className="h-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE3] to-[#EAD9CC] flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-[#C4A898]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {project.status === "archived" && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white/80">
              Archived
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-sm text-[#2D1C12] truncate">{project.title}</h3>
            <p className="text-[11px] text-[#9A7560] truncate mt-0.5">{project.description}</p>
          </div>
          <ProjectMenu
            project={project}
            onFavorite={() => setFav(!fav)}
            onRename={() => {}}
            onDelete={() => {}}
            onDuplicate={() => {}}
            onArchive={() => {}}
          />
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5EDE3]">
          <div className="flex items-center gap-1 text-[11px] text-[#9A7560]">
            <FolderOpen className="w-3 h-3" />
            {project.thumbnail_count} thumbnails
          </div>
          <div className="flex items-center gap-2">
            {fav && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
            <span className="text-[10px] text-[#C4A898]">
              {new Date(project.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectListRow({ project, index }: { project: Project; index: number }) {
  const [fav, setFav] = useState(project.is_favorite)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border border-[#EAD9CC]/60 hover:border-[#FF7A00]/20 hover:shadow-sm transition-all"
    >
      <div className="w-12 h-8 rounded-lg flex-shrink-0 overflow-hidden bg-gradient-to-br from-[#F5EDE3] to-[#EAD9CC]" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#2D1C12] truncate">{project.title}</p>
        <p className="text-[11px] text-[#9A7560] truncate">{project.description}</p>
      </div>
      <div className="hidden sm:block text-[11px] text-[#9A7560] flex-shrink-0">
        {project.thumbnail_count} thumbnails
      </div>
      <div className="hidden md:block text-[11px] text-[#C4A898] flex-shrink-0">
        {new Date(project.updated_at).toLocaleDateString()}
      </div>
      {fav && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
      <ProjectMenu
        project={project}
        onFavorite={() => setFav(!fav)}
        onRename={() => {}}
        onDelete={() => {}}
        onDuplicate={() => {}}
        onArchive={() => {}}
      />
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("updated")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showArchived, setShowArchived] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newName, setNewName] = useState("")

  const filtered = PROJECTS
    .filter(p => showArchived || p.status === "active")
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name")       return a.title.localeCompare(b.title)
      if (sortBy === "thumbnails") return b.thumbnail_count - a.thumbnail_count
      if (sortBy === "created")    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

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
          <h1 className="text-2xl font-black text-[#2D1C12]">Projects</h1>
          <p className="text-[#9A7560] text-sm mt-1">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all shadow-md shadow-orange-200 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A7560]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EAD9CC] bg-white focus:outline-none focus:border-[#FF7A00] text-sm text-[#2D1C12] placeholder-[#C4A898] transition-colors"
          />
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="px-3 py-2 rounded-xl border border-[#EAD9CC] bg-white text-sm text-[#2D1C12] focus:outline-none focus:border-[#FF7A00] transition-colors"
        >
          <option value="updated">Last updated</option>
          <option value="created">Date created</option>
          <option value="name">Name</option>
          <option value="thumbnails">Most thumbnails</option>
        </select>

        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
            showArchived ? "border-[#FF7A00] bg-[#FFF7EF] text-[#FF7A00]" : "border-[#EAD9CC] text-[#9A7560] hover:border-[#FF7A00]/40"
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          Archived
        </button>

        <div className="flex rounded-xl overflow-hidden border border-[#EAD9CC]">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#FF7A00] text-white" : "bg-white text-[#9A7560] hover:bg-[#FFF7EF]"}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#FF7A00] text-white" : "bg-white text-[#9A7560] hover:bg-[#FFF7EF]"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Grid/List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-3 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FFF7EF] flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-[#FF7A00]" />
          </div>
          <p className="font-black text-[#2D1C12]">No projects found</p>
          <p className="text-sm text-[#9A7560]">Try a different search or create a new project.</p>
          <button onClick={() => setShowNewModal(true)} className="mt-2 px-4 py-2 rounded-xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all">
            New Project
          </button>
        </motion.div>
      ) : viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p, i) => <ProjectGridCard key={p.id} project={p} index={i} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => <ProjectListRow key={p.id} project={p} index={i} />)}
        </div>
      )}

      {/* New project modal */}
      <AnimatePresence>
        {showNewModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setShowNewModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl pointer-events-auto p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-black text-xl text-[#2D1C12]">New Project</h2>
                  <button onClick={() => setShowNewModal(false)} className="text-[#9A7560] hover:text-[#2D1C12]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-[#2D1C12] uppercase tracking-wider mb-1.5">Project Name</label>
                    <input
                      autoFocus
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="My YouTube Channel"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#EAD9CC] focus:outline-none focus:border-[#FF7A00] text-sm text-[#2D1C12] placeholder-[#C4A898] transition-colors"
                    />
                  </div>
                  <button
                    disabled={!newName.trim()}
                    onClick={() => { setShowNewModal(false); setNewName("") }}
                    className="w-full py-3 rounded-2xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] disabled:opacity-40 transition-all"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
