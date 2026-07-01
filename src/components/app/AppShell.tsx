"use client"

import { useState, ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Wand2, Image, Clock, Settings, LogOut,
  Coins, ChevronRight, Menu, X, Bell, Zap
} from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/studio", icon: Wand2, label: "Studio", highlight: true },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    signOut()
    router.push("/")
  }

  const planColors: Record<string, string> = {
    free: "bg-[#F5EDE3] text-[#9A7560]",
    creator: "bg-blue-50 text-blue-600",
    pro: "bg-[#FF7A00]/10 text-[#FF7A00]",
    enterprise: "bg-purple-100 text-purple-600",
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "px-4 py-6" : "px-4 py-6"}`}>
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">T</span>
          </div>
          <span className="font-black text-[#2D1C12] text-lg tracking-tight">ThumbFi</span>
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-[#9A7560] hover:text-[#2D1C12]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Credits pill */}
      <div className="mx-2 mb-6 rounded-2xl bg-[#FF7A00]/6 border border-[#FF7A00]/12 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#9A7560]">Credits remaining</span>
          <Zap className="w-3.5 h-3.5 text-[#FF7A00]" />
        </div>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-2xl font-black text-[#2D1C12]">0</span>
          <span className="text-[#9A7560] text-sm mb-0.5">/ 100</span>
        </div>
        <div className="h-1.5 bg-[#F5EDE3] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF7A00] rounded-full transition-all"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                active
                  ? "bg-[#FF7A00] text-white shadow-md shadow-orange-200"
                  : item.highlight
                    ? "text-[#FF7A00] hover:bg-[#FF7A00]/8"
                    : "text-[#6B3F2A] hover:bg-[#F5EDE3] hover:text-[#2D1C12]"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={2.2} />
              <span className="flex-1">{item.label}</span>
              {item.highlight && !active && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#FF7A00]/10 text-[#FF7A00]">AI</span>
              )}
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* THUMB balance */}
      <div className="mx-2 my-4 rounded-2xl bg-[#0F0805] border border-white/8 p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center">
              <Coins className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-white font-black text-sm">0</div>
              <div className="text-white/40 text-[10px]">$THUMB balance</div>
            </div>
          </div>
          <button className="text-[10px] font-bold text-[#FF7A00] hover:underline">Buy</button>
        </div>
      </div>

      {/* User */}
      <div className="mx-2 flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F5EDE3] transition-colors cursor-default group">
        <div className="w-9 h-9 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          {user?.firstName?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#2D1C12] truncate">
            {user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? "User"}
          </div>
          <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-block ${planColors["free"]}`}>
            FREE
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9A7560] hover:text-red-500"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FBF6F1] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EAD9CC]/60 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#EAD9CC]/60 h-14 flex items-center px-4 lg:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#9A7560] hover:text-[#2D1C12] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Quick actions */}
          <Link
            href="/studio"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-sm font-bold hover:bg-[#e56e00] transition-all shadow-sm shadow-orange-200"
          >
            <Wand2 className="w-3.5 h-3.5" />
            New Thumbnail
          </Link>

          <button className="relative w-9 h-9 rounded-xl border border-[#EAD9CC] flex items-center justify-center text-[#9A7560] hover:text-[#2D1C12] hover:border-[#FF7A00]/40 transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white font-black text-sm">
            {user?.firstName?.[0]?.toUpperCase() ?? "?"}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
