"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, Layers, ShieldCheck, RotateCw } from "lucide-react"

const pills = [
  { label: "12 Super-Modules", icon: Layers },
  { label: "100+ Sub-Modules", icon: ShieldCheck },
  { label: "AI-Powered", icon: Bot },
  { label: "Auto Recovery", icon: RotateCw },
]

export function Hero({ onContactOpen }: { onContactOpen: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-12"
    >
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
      {/* Radial fade overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,var(--background)_100%)]" />

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Badge
            variant="outline"
            className="rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 text-xs tracking-wide text-primary"
          >
            12 Super-Modules. One Intelligent Platform.
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          AI-Powered Automation for Every School Operation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          GroveHub runs your entire school ERP on autopilot. From student
          admissions to alumni management, our automated pipeline processes
          everything with AI analysis -- and when something fails, the recovery
          system ensures nothing is lost.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            onClick={onContactOpen}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border/50 bg-card/40 text-foreground backdrop-blur-md hover:bg-card/70"
            asChild
          >
            <a href="#pipeline">See How It Works</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-2 flex flex-wrap items-center justify-center gap-2"
        >
          {pills.map((pill) => {
            const Icon = pill.icon
            return (
              <div
                key={pill.label}
                className="flex items-center gap-1.5 rounded-full border border-border/40 bg-card/50 px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur-md"
              >
                <Icon className="h-3 w-3 text-primary" />
                {pill.label}
              </div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Bottom fade to next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
