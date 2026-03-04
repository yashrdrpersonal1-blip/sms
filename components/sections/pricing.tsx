"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    desc: "Single-branch schools getting started.",
    price: "Contact Us",
    features: ["Up to 3 Super-Modules", "500 student records", "Basic AI analysis", "Email support", "Single branch"],
    highlight: false,
  },
  {
    name: "Enterprise",
    desc: "Multi-branch trusts & school groups.",
    price: "Custom",
    features: ["All 12 Super-Modules", "Unlimited student records", "Full AI pipeline + recovery", "Priority 24/7 support", "Multi-branch workspace", "Custom integrations", "Dedicated account manager"],
    highlight: true,
  },
  {
    name: "Professional",
    desc: "Growing schools that need more power.",
    price: "Contact Us",
    features: ["Up to 8 Super-Modules", "5,000 student records", "Advanced AI analysis", "Priority email & chat support", "Up to 3 branches"],
    highlight: false,
  },
]

export function Pricing({ onContactOpen }: { onContactOpen: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const headingY = useTransform(scrollYProgress, [0, 0.3], [30, 0])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  return (
    <section id="pricing" ref={sectionRef} className="relative px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <motion.div style={{ y: headingY, opacity: headingOpacity }} className="mb-8 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Plans that scale with your institution.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every plan includes secure hosting, automatic updates, and data backups.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`flex flex-col rounded-2xl border p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md ${
                plan.highlight
                  ? "border-primary/40 bg-primary/[0.06] shadow-primary/10 hover:shadow-primary/15 dark:bg-primary/[0.08]"
                  : "border-border/40 bg-card/50 shadow-black/5 dark:shadow-black/20"
              }`}
            >
              {plan.highlight && (
                <span className="mb-3 w-fit rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{plan.desc}</p>
              <p className="mt-4 text-2xl font-bold text-foreground">{plan.price}</p>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={onContactOpen}
                className={`mt-5 w-full ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
                size="sm"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
