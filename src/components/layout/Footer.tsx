import { Sparkles } from "lucide-react"

const footerLinks = {
  Product: ["Features", "Templates", "Pricing", "API Docs", "Changelog"],
  Creators: ["YouTube Creators", "Crypto Creators", "Gaming", "Finance", "Podcasts"],
  Token: ["$THUMB Overview", "Tokenomics", "Whitelist", "Creator Marketplace", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press Kit", "Contact"],
}

export default function Footer() {
  return (
    <footer className="bg-[#2D1C12] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Thumb<span className="text-[#FF7A00]">Fi</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              The AI-powered thumbnail studio for modern creators. Powered by the $THUMB token ecosystem.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {["𝕏", "YT", "TG", "DC"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/8 hover:bg-[#FF7A00]/20 hover:text-[#FF7A00] flex items-center justify-center text-white/50 text-xs font-bold transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                {category}
              </div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2025 ThumbFi. All rights reserved. $THUMB is a utility token.
          </p>
          <div className="flex gap-5 text-xs text-white/30">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="hover:text-white/60 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
