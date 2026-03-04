"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Shield, Zap, Globe, HeartHandshake } from "lucide-react"

const values = [
  {
    icon: Shield, title: "Security First",
    desc: "Enterprise-grade encryption, RBAC permissions, and audit trails protect every byte of school data.",
  },
  {
    icon: Zap, title: "AI-Native",
    desc: "Built with AI from day one -- not bolted on. Every module leverages intelligent automation.",
  },
  {
    icon: Globe, title: "India-Ready",
    desc: "Full compliance with CBSE, ICSE, and State board requirements. Government scholarship integration built in.",
  },
  {
    icon: HeartHandshake, title: "Partner-Driven",
    desc: "Dedicated onboarding, training, and a support team that treats your school like our own.",
  },
]

export function Company() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const headingY = useTransform(scrollYProgress, [0, 0.3], [30, 0])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  return (
    <section id="company" ref={sectionRef} className="relative px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <motion.div style={{ y: headingY, opacity: headingOpacity }} className="mb-8 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for schools. Powered by intelligence.
          </h2>
          <p className="mt-2 mx-auto max-w-xl text-pretty text-sm text-muted-foreground">
            GroveHub is designed by educators and engineers who understand that
            every school operation matters.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="rounded-2xl border border-border/40 bg-card/50 p-5 shadow-sm shadow-black/5 backdrop-blur-xl transition-all hover:border-border/60 hover:bg-card/70 hover:shadow-md dark:shadow-black/20"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 backdrop-blur-sm">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-foreground">{v.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
