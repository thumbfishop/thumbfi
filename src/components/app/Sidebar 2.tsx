"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Wand2, FolderOpen, LayoutTemplate,
  Coins, CreditCard, Settings, ChevronRight, Zap,
  LogOut, PanelLeftClose, PanelLeftOpen,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useUIStore } from "@/store/ui.store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
      { href: "/generate",   icon: Wand2,           label: "Generate",  badge: "AI",  highlight: true },
      { href: "/projects",   icon: FolderOpen,      label: "Projects" },
      { href: "/templates",  icon: LayoutTemplate,  label: "Templates" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/token",    icon: Coins,      label: "Token & Wallet" },
      { href: "/billing",  icon: CreditCard, label: "Billing" },
      { href: "/settings", icon: Settings,   label: "Settings" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const creditsPercent = user
    ? Math.round((user.credits_used / user.credits_limit) * 100)
    : 0

  const PLAN_COLORS: Record<string, string> = {
    free:       "bg-[#F5EDE3] text-[#9A7560]",
    creator:    "bg-[#FF7A00]/10 text-[#FF7A00]",
    pro:        "bg-purple-100 text-purple-600",
    enterprise: "bg-blue-100 text-blue-700",
  }

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 248 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex flex-col h-full bg-white border-r border-[#EAD9CC]/70 overflow-hidden flex-shrink-0"
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#EAD9CC]/70 flex-shrink-0">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5"
            >
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FF7A00] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xs">T</span>
                </div>
                <span className="font-black text-[#2D1C12] text-base tracking-tight">ThumbFi</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {sidebarCollapsed && (
          <div className="w-7 h-7 rounded-lg bg-[#FF7A00] flex items-center justify-center mx-auto">
            <span className="text-white font-black text-xs">T</span>
          </div>
        )}

        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="text-[#9A7560] hover:text-[#2D1C12] transition-colors p-1 rounded-lg hover:bg-[#F5EDE3]"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Credits pill */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mt-3 rounded-xl bg-[#FF7A00]/6 border border-[#FF7A00]/12 p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#FF7A00]" />
                <span className="text-[10px] font-semibold text-[#9A7560]">Credits</span>
              </div>
              <span className="text-[10px] font-black text-[#2D1C12]">
                {user?.credits_used ?? 0}/{user?.credits_limit ?? 20}
              </span>
            </div>
            <div className="h-1 bg-[#F5EDE3] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FF7A00] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${creditsPercent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-1">
                <span className="text-[10px] font-black text-[#C4A898] uppercase tracking-widest">
                  {section.label}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl transition-all duration-150 group relative",
                      sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                      active
                        ? "bg-[#FF7A00] text-white shadow-sm shadow-orange-200"
                        : item.highlight
                          ? "text-[#FF7A00] hover:bg-[#FF7A00]/8"
                          : "text-[#6B3F2A] hover:bg-[#F5EDE3] hover:text-[#2D1C12]"
                    )}
                  >
                    <item.icon
                      className={cn("flex-shrink-0", sidebarCollapsed ? "w-5 h-5" : "w-4 h-4")}
                      strokeWidth={2.2}
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-sm font-semibold">{item.label}</span>
                        {item.badge && !active && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#FF7A00]/10 text-[#FF7A00]">
                            {item.badge}
                          </span>
                        )}
                        {active && <ChevronRight className="w-3 h-3 opacity-70" />}
                      </>
                    )}
                    {/* Tooltip when collapsed */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-[#2D1C12] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* THUMB balance */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 rounded-xl bg-[#0F0805] border border-white/6 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center">
                  <Coins className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-white font-black text-sm leading-none">
                    {(user?.thumb_balance ?? 0).toLocaleString()}
                  </div>
                  <div className="text-white/40 text-[9px] mt-0.5">$THUMB</div>
                </div>
              </div>
              <Link href="/token" className="text-[10px] font-bold text-[#FF7A00] hover:underline">
                Manage
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User profile */}
      <div className={cn(
        "flex items-center border-t border-[#EAD9CC]/70 flex-shrink-0",
        sidebarCollapsed ? "justify-center p-3" : "gap-2.5 p-3"
      )}>
        <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
        {!sidebarCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[#2D1C12] truncate leading-tight">{user?.name ?? "User"}</div>
              <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full inline-block mt-0.5", PLAN_COLORS[user?.plan ?? "free"])}>
                {(user?.plan ?? "FREE").toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#9A7560] hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </motion.aside>
  )
}
