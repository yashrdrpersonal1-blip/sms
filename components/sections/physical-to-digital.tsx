"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ScanLine, Fingerprint, ArrowRight, Cpu } from "lucide-react"

export function PhysicalToDigital() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const leftX = useTransform(scrollYProgress, [0, 0.5], [-40, 0])
  const rightX = useTransform(scrollYProgress, [0, 0.5], [40, 0])
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} className="relative px-6 py-16 overflow-hidden">
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2"
      >
        {/* Left - Visual */}
        <motion.div style={{ x: leftX }} className="flex items-center justify-center">
          <div className="relative flex h-60 w-full max-w-xs items-center justify-center rounded-2xl border border-border/40 bg-card/50 shadow-xl shadow-black/5 backdrop-blur-2xl dark:shadow-black/30">
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/40 bg-background/50 shadow-sm backdrop-blur-md">
                  <ScanLine className="h-7 w-7 text-primary" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/40 bg-background/50 shadow-sm backdrop-blur-md">
                  <Cpu className="h-7 w-7 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1">
                  <Fingerprint className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">RFID / NFC</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1">
                  <ScanLine className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">QR Scan</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">Physical form to digital record in seconds</p>
            </div>
          </div>
        </motion.div>

        {/* Right - Text */}
        <motion.div style={{ x: rightX }} className="flex flex-col gap-4">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Zero Manual Entry. One Physical-to-Digital Bridge.
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Your only job is the physical-to-digital bridge. Scan it once. The
            AI pipeline handles routing, verification, and database storage
            automatically.
          </p>
          <ul className="flex flex-col gap-2">
            {[
              "RFID/NFC/UHF/BLE attendance capture",
              "OCR document scanning & verification",
              "QR-coded asset & library management",
              "Automated data routing to 100+ sub-modules",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <div className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  )
}
