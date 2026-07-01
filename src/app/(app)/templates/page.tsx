"use client"

import { motion } from "framer-motion"
import { Wand2, LayoutTemplate } from "lucide-react"
import Link from "next/link"

export default function TemplatesPage() {
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
            Start from a proven design — templates are on the way.
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

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="flex flex-col items-center justify-center text-center gap-4 py-24 bg-white rounded-2xl border border-dashed border-[#EAD9CC]"
      >
        <div className="w-16 h-16 rounded-3xl bg-[#FFF7EF] flex items-center justify-center">
          <LayoutTemplate className="w-8 h-8 text-[#FF7A00]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-black text-[#2D1C12] text-lg">No templates yet</p>
          <p className="text-sm text-[#9A7560] mt-1 max-w-sm">
            We&apos;re building a library of proven thumbnail templates. In the
            meantime, generate a custom thumbnail from scratch.
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] text-white font-bold text-sm hover:bg-[#e56e00] transition-all"
        >
          <Wand2 className="w-4 h-4" />
          Generate a thumbnail
        </Link>
      </motion.div>
    </div>
  )
}
