import Navbar from "@/components/nav/Navbar"
import Hero from "@/components/sections/Hero"
import SocialProof from "@/components/sections/SocialProof"
import Features from "@/components/sections/Features"
import Templates from "@/components/sections/Templates"
import Workflow from "@/components/sections/Workflow"
import Intelligence from "@/components/sections/Intelligence"
import Token from "@/components/sections/Token"
import Pricing from "@/components/sections/Pricing"
import Testimonials from "@/components/sections/Testimonials"
import FAQ from "@/components/sections/FAQ"
import FinalCTA from "@/components/sections/FinalCTA"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF7EF]">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <Templates />
        <Workflow />
        <Intelligence />
        <Token />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
