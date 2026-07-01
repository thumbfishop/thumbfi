"use client"

import { useUser } from "@clerk/nextjs"
import { Providers } from "@/lib/providers"
import { Sidebar } from "@/components/app/Sidebar"
import { TopNav } from "@/components/app/TopNav"

function AppGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FFF7EF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF7A00] flex items-center justify-center animate-pulse">
            <span className="text-white font-black">T</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF6F1] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppGuard>{children}</AppGuard>
    </Providers>
  )
}
