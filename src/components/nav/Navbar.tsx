"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles } from "lucide-react"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

const links = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "Token", href: "#token" },
  { label: "FAQ", href: "#faq" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FFF7EF]/90 backdrop-blur-xl shadow-sm shadow-[#EAD9CC]/60 border-b border-[#EAD9CC]/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-[#2D1C12] tracking-tight">
              Thumb<span className="text-[#FF7A00]">Fi</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#6B3F2A] hover:text-[#FF7A00] transition-colors rounded-full hover:bg-[#FFF0E0]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button className="text-sm font-medium text-[#6B3F2A] hover:text-[#2D1C12] transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <Button size="default">
                  Launch App →
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button size="default" variant="secondary">
                  Dashboard
                </Button>
              </Link>
              <UserButton />
            </Show>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-[#2D1C12] hover:bg-[#FFF0E0] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#FFF7EF]/95 backdrop-blur-xl border-t border-[#EAD9CC]/50 px-4 pb-6"
          >
            <div className="flex flex-col gap-1 pt-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-[#2D1C12] hover:text-[#FF7A00] hover:bg-[#FFF0E0] rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Show when="signed-out">
                  <SignInButton mode="redirect">
                    <Button variant="secondary" className="w-full">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="redirect">
                    <Button className="w-full">
                      Launch App →
                    </Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                </Show>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
