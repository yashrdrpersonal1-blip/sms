"use client"

import { useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { PipelineFlow } from "@/components/sections/pipeline-flow"
import { PhysicalToDigital } from "@/components/sections/physical-to-digital"
import { SuperModules } from "@/components/sections/super-modules"
import { Pricing } from "@/components/sections/pricing"
import { Company } from "@/components/sections/company"
import { ContactModal } from "@/components/modals/contact-modal"

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Global ambient orbs for glass depth */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 size-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute top-1/2 -right-40 size-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 size-[400px] rounded-full bg-primary/[0.05] blur-[100px]" />
      </div>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-primary"
      />
      <Navbar onContactOpen={() => setContactOpen(true)} />
      <main>
        <Hero onContactOpen={() => setContactOpen(true)} />
        <PipelineFlow />
        <PhysicalToDigital />
        <SuperModules />
        <Pricing onContactOpen={() => setContactOpen(true)} />
        <Company />
      </main>
      <Footer />
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  )
}
