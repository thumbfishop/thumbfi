"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Bell, Wand2, PanelLeftOpen, X, Check,
  Clock, Zap, TrendingUp,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useUIStore } from "@/store/ui.store"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/generate":   "AI Generator",
  "/projects":   "Projects",
  "/templates":  "Templates",
  "/token":      "Token & Wallet",
  "/billing":    "Billing",
  "/settings":   "Settings",
}

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: Zap, title: "Generation complete", desc: "\"Bitcoin crash\" — 4 variations ready", time: "2m ago", read: false, color: "text-[#FF7A00]" },
  { id: 2, icon: TrendingUp, title: "CTR report ready", desc: "Your weekly analytics are in", time: "1h ago", read: false, color: "text-emerald-500" },
  { id: 3, icon: Clock, title: "Credits renewing soon", desc: "Plan resets in 5 days", time: "3h ago", read: true, color: "text-blue-500" },
]

export function TopNav() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, notificationCount } = useUIStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [notifOpen, setNotifOpen] = useState(false)

  const title = Object.entries(PAGE_TITLES).find(([key]) =>
    pathname === key || pathname.startsWith(key + "/")
  )?.[1] ?? "ThumbFi"

  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-[#EAD9CC]/70 flex items-center px-4 gap-3 z-20 flex-shrink-0 relative">
      {/* Sidebar toggle (mobile + collapsed) */}
      <button
        onClick={toggleSidebar}
        className="text-[#9A7560] hover:text-[#2D1C12] transition-colors p-1.5 rounded-lg hover:bg-[#F5EDE3] flex-shrink-0"
      >
        <PanelLeftOpen className="w-4 h-4" />
      </button>

      {/* Page title */}
      <h1 className="font-black text-[#2D1C12] text-sm hidden sm:block">{title}</h1>

      <div className="flex-1" />

      {/* Search */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A7560]" />
            <input
              autoFocus
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
              placeholder="Search projects, thumbnails..."
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-[#EAD9CC] bg-[#FFF7EF] focus:outline-none focus:border-[#FF7A00] text-xs text-[#2D1C12] placeholder-[#C4A898]"
            />
            <button
              onClick={() => { setSearchOpen(false); setSearchValue("") }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A7560] hover:text-[#2D1C12]"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EAD9CC] text-xs text-[#9A7560] hover:border-[#FF7A00]/40 hover:text-[#2D1C12] transition-all bg-white"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:block">Search</span>
            <kbd className="hidden md:block text-[10px] bg-[#F5EDE3] px-1 py-0.5 rounded font-mono">⌘K</kbd>
          </button>
        )}
      </AnimatePresence>

      {/* Generate CTA */}
      <Link
        href="/generate"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:bg-[#e56e00] transition-all shadow-sm shadow-orange-200"
      >
        <Wand2 className="w-3.5 h-3.5" />
        Generate
      </Link>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-8 h-8 rounded-xl border border-[#EAD9CC] flex items-center justify-center text-[#9A7560] hover:text-[#2D1C12] hover:border-[#FF7A00]/40 transition-all"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF7A00] border-2 border-white" />
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#EAD9CC]/70 shadow-xl z-40 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAD9CC]/50">
                  <h3 className="font-black text-sm text-[#2D1C12]">Notifications</h3>
                  <button className="text-xs font-semibold text-[#FF7A00] hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-[#EAD9CC]/40">
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-[#FFF7EF] transition-colors cursor-pointer ${!n.read ? "bg-[#FFF7EF]/50" : ""}`}>
                      <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center ${!n.read ? "bg-[#FF7A00]/8" : "bg-[#F5EDE3]"}`}>
                        <n.icon className={`w-3.5 h-3.5 ${n.color}`} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-[#2D1C12] leading-tight">{n.title}</p>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] text-[#9A7560] mt-0.5 leading-tight">{n.desc}</p>
                        <p className="text-[10px] text-[#C4A898] mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-[#EAD9CC]/50">
                  <button className="text-xs font-semibold text-[#9A7560] hover:text-[#FF7A00] transition-colors w-full text-center">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar */}
      <UserButton />
    </header>
  )
}
