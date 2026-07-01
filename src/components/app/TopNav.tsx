"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Bell, Wand2, PanelLeftOpen, X,
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
                </div>
                <div className="flex flex-col items-center justify-center px-4 py-10 text-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5EDE3] flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#C4A898]" strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-bold text-[#2D1C12]">You're all caught up</p>
                  <p className="text-[11px] text-[#9A7560] leading-tight">No new notifications yet.</p>
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
