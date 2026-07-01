"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    q: "How does the AI thumbnail generation work?",
    a: "You describe your thumbnail in plain language — the topic, mood, style, and niche. Our AI model (fine-tuned on millions of high-performing YouTube thumbnails) generates multiple variations in seconds. You can then refine, remix, or export any result.",
  },
  {
    q: "Do I need design skills to use ThumbFi?",
    a: "Zero design experience required. ThumbFi was built specifically for creators who don't have a design background. The AI handles layout, color, typography, and composition — you just describe what you want.",
  },
  {
    q: "Can I use my own photos and face in the thumbnails?",
    a: "Yes! You can upload your own photo and ThumbFi will automatically detect your face, enhance it, and place it into generated layouts. Background removal, face upscaling, and expression enhancement are all built-in.",
  },
  {
    q: "What is the $THUMB token and do I need it?",
    a: "The $THUMB token is an optional utility token that unlocks discounts (up to 50%), weekly free AI credits, and marketplace access. You don't need it to use ThumbFi — but holding THUMB makes every plan significantly cheaper.",
  },
  {
    q: "Can I change my plan later?",
    a: "Absolutely. You can upgrade, downgrade, or cancel at any time. If you upgrade mid-cycle, you'll only be charged the prorated difference. Downgrades take effect at the end of your billing period.",
  },
  {
    q: "What image quality do exports come in?",
    a: "Free plan exports at 720p (1280×720). Creator and Pro Holder plans export at full 4K resolution (3840×2160), which YouTube recommends for maximum thumbnail sharpness across all devices.",
  },
  {
    q: "How accurate is the CTR prediction?",
    a: "Our CTR prediction model is trained on over 100 million YouTube thumbnails with verified performance data. In internal testing it correlates at 0.81 with actual CTR outcomes — significantly better than human intuition alone.",
  },
  {
    q: "Can I use ThumbFi results commercially?",
    a: "Yes. All thumbnails generated with ThumbFi on paid plans are fully yours to use commercially — including on YouTube, social media, advertising, and merchandise. Free plan usage is for personal/non-commercial content only.",
  },
]

function FAQItem({ faq, index, inView }: { faq: typeof faqs[0]; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.05 + index * 0.06 }}
      className="bg-white rounded-2xl border border-[#EAD9CC]/60 overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#FAFAFA] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-[#2D1C12] text-sm sm:text-base leading-snug">{faq.q}</span>
        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
          open ? "bg-[#FF7A00] text-white" : "bg-[#F5EDE3] text-[#6B3F2A]"
        }`}>
          {open ? <Minus className="w-3.5 h-3.5" strokeWidth={2.5} /> : <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-sm text-[#9A7560] leading-relaxed border-t border-[#EAD9CC]/60 pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="faq" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-[#FF7A00] uppercase tracking-widest">FAQ</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-[#2D1C12] leading-tight">
            Frequently Asked
            <br />
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-[#9A7560]">
            Everything you need to know about ThumbFi.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i} inView={inView} />
          ))}
        </div>

        {/* Support link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center mt-10 text-sm text-[#9A7560]"
        >
          Still have questions?{" "}
          <a href="#" className="text-[#FF7A00] font-semibold hover:underline">
            Chat with us →
          </a>
        </motion.p>
      </div>
    </section>
  )
}
