"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Database,
  ShieldCheck,
  Layers,
  Brain,
  GitFork,
  CheckCircle2,
  Eye,
  UserCheck,
  Rocket,
  AlertTriangle,
  Wrench,
  RefreshCcw,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  CornerDownRight,
  CornerDownLeft,
  RotateCcw,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Step data                                                          */
/* ------------------------------------------------------------------ */

const mainSteps = [
  {
    icon: Database,
    label: "Data Ingestion",
    desc: "All school data enters from RFID scanners, web forms, mobile apps, APIs, and bulk spreadsheet imports.",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    dotColor: "bg-blue-500",
  },
  {
    icon: ShieldCheck,
    label: "Schema Validation",
    desc: "Every record is checked for correct types, required fields, and proper formatting before proceeding.",
    color: "from-sky-500/20 to-sky-600/10",
    iconColor: "text-sky-400",
    borderColor: "border-sky-500/30",
    dotColor: "bg-sky-500",
  },
  {
    icon: Layers,
    label: "Normalize & Enrich",
    desc: "Duplicates are merged, records linked across modules, and metadata tags are automatically applied.",
    color: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    dotColor: "bg-indigo-500",
  },
  {
    icon: Brain,
    label: "AI Analysis",
    desc: "Machine learning models run predictions, detect anomalies, and flag items that need human attention.",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-400",
    borderColor: "border-violet-500/30",
    dotColor: "bg-violet-500",
  },
]

const decisionStep = {
  icon: GitFork,
  label: "Decision Gate",
  desc: "AI confidence score determines if data passes automatically or needs human review.",
  iconColor: "text-purple-400",
}

const successSteps = [
  {
    icon: CheckCircle2,
    label: "Auto-Verified",
    desc: "Checksums match, cross-references validated, and a complete audit trail is generated.",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    color: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    icon: Eye,
    label: "Verification Dashboard",
    desc: "Admins see a live dashboard showing everything is correct -- totals, field counts, and data integrity scores.",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    color: "from-emerald-500/15 to-emerald-600/5",
  },
  {
    icon: UserCheck,
    label: "Manual Intervention",
    desc: "Staff reviews any flagged items, approves changes, and signs off. Only when a human confirms, it moves forward.",
    iconColor: "text-teal-400",
    borderColor: "border-teal-500/30",
    color: "from-teal-500/15 to-teal-600/5",
  },
  {
    icon: Rocket,
    label: "Apply to Live System",
    desc: "Approved data is committed to the live database. Students, fees, schedules -- all updated instantly across all modules.",
    iconColor: "text-teal-400",
    borderColor: "border-teal-500/30",
    color: "from-teal-500/20 to-teal-600/10",
  },
]

const failureSteps = [
  {
    icon: AlertTriangle,
    label: "Error Queue",
    desc: "Failed records are captured with full context, error type, and a trace ID for debugging.",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    icon: Wrench,
    label: "Manual Correction",
    desc: "Staff opens the flagged record, sees exactly what went wrong, edits the data, and marks it resolved.",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    color: "from-amber-500/15 to-amber-600/5",
  },
  {
    icon: RefreshCcw,
    label: "Re-inject into Pipeline",
    desc: "Corrected data is sent back to the beginning of the pipeline to go through the full flow again.",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    color: "from-orange-500/15 to-orange-600/5",
  },
]

/* ------------------------------------------------------------------ */
/*  Animated card                                                      */
/* ------------------------------------------------------------------ */

function StepCard({
  icon: Icon,
  label,
  desc,
  iconColor,
  borderColor,
  color,
  delay,
  index,
}: {
  icon: React.ElementType
  label: string
  desc: string
  iconColor: string
  borderColor: string
  color: string
  delay: number
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className={`group relative rounded-2xl border ${borderColor} bg-gradient-to-br ${color} p-5 shadow-sm shadow-black/5 backdrop-blur-xl transition-all hover:scale-[1.02] hover:shadow-md dark:shadow-black/20`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{String(index).padStart(2, "0")}</span>
            <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Connector                                                          */
/* ------------------------------------------------------------------ */

function Connector({ icon: Icon, color, delay, label }: { icon: React.ElementType; color: string; delay: number; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col items-center gap-1 py-1"
    >
      <Icon className={`h-4 w-4 ${color}`} />
      {label && <span className={`text-[10px] font-semibold tracking-wider uppercase ${color}`}>{label}</span>}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Decision node                                                      */
/* ------------------------------------------------------------------ */

function DecisionNode() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        {/* Diamond shape via rotation */}
        <div className="flex h-20 w-20 rotate-45 items-center justify-center rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-500/25 to-purple-600/10 backdrop-blur-sm">
          <GitFork className="-rotate-45 h-7 w-7 text-purple-400" />
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-foreground">Decision Gate</p>
      <p className="mt-1 max-w-[260px] text-center text-xs text-muted-foreground">
        AI confidence score determines if data passes automatically or needs review.
      </p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Branch header                                                      */
/* ------------------------------------------------------------------ */

function BranchHeader({
  label,
  sublabel,
  color,
  delay,
}: {
  label: string
  sublabel: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: label === "Success" ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="mb-3 text-center"
    >
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>
        {label === "Success" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
        {label} Path
      </span>
      <p className="mt-1.5 text-[11px] text-muted-foreground">{sublabel}</p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Loop-back indicator                                                */
/* ------------------------------------------------------------------ */

function LoopBack() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="mt-2 flex flex-col items-center gap-1"
    >
      <RotateCcw className="h-5 w-5 text-orange-400 animate-[spin_6s_linear_infinite]" />
      <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1">
        <span className="text-[11px] font-semibold text-orange-400">Loops back to Data Ingestion</span>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function PipelineFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="pipeline" ref={ref} className="relative px-4 py-20 sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            How It Works
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            The Pipeline
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            Every piece of school data flows through one intelligent pipeline. From the moment it enters to the moment it goes live -- fully automated, fully verified, with human oversight exactly where it matters.
          </p>
        </motion.div>

        {/* ============ MAIN VERTICAL FLOW ============ */}
        <div className="mx-auto max-w-md flex flex-col items-center">
          {mainSteps.map((step, i) => (
            <div key={step.label} className="w-full flex flex-col items-center">
              <div className="w-full">
                <StepCard {...step} delay={i * 0.12} index={i + 1} />
              </div>
              <Connector icon={ArrowDown} color="text-muted-foreground/60" delay={i * 0.12 + 0.08} />
            </div>
          ))}

          {/* ============ DECISION GATE ============ */}
          <DecisionNode />
        </div>

        {/* ============ BRANCH ARROWS ============ */}
        <div className="mt-3 grid grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <Connector icon={CornerDownLeft} color="text-emerald-400" delay={0.6} label="Yes - Passed" />
          </div>
          <div className="flex flex-col items-center">
            <Connector icon={CornerDownRight} color="text-amber-400" delay={0.6} label="No - Failed" />
          </div>
        </div>

        {/* ============ TWO BRANCH PATHS ============ */}
        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Success path */}
          <div>
            <BranchHeader
              label="Success"
              sublabel="Data verified and ready for deployment"
              color="text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              delay={0.65}
            />
            <div className="flex flex-col items-center gap-0">
              {successSteps.map((step, i) => (
                <div key={step.label} className="w-full flex flex-col items-center">
                  <div className="w-full">
                    <StepCard {...step} delay={0.7 + i * 0.1} index={5 + i} />
                  </div>
                  {i < successSteps.length - 1 && (
                    <Connector icon={ArrowDown} color="text-emerald-500/50" delay={0.75 + i * 0.1} />
                  )}
                </div>
              ))}
              {/* Final deploy indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="mt-3 flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-500" />
                </span>
                <span className="text-xs font-semibold text-teal-400">Live in Production</span>
              </motion.div>
            </div>
          </div>

          {/* Failure path */}
          <div>
            <BranchHeader
              label="Error"
              sublabel="Issues caught and queued for resolution"
              color="text-amber-400 border-amber-500/30 bg-amber-500/10"
              delay={0.65}
            />
            <div className="flex flex-col items-center gap-0">
              {failureSteps.map((step, i) => (
                <div key={step.label} className="w-full flex flex-col items-center">
                  <div className="w-full">
                    <StepCard {...step} delay={0.7 + i * 0.1} index={9 + i} />
                  </div>
                  {i < failureSteps.length - 1 && (
                    <Connector icon={ArrowDown} color="text-amber-500/50" delay={0.75 + i * 0.1} />
                  )}
                </div>
              ))}
              <LoopBack />
            </div>
          </div>
        </div>

        {/* ============ BOTTOM SUMMARY ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 mx-auto max-w-2xl text-center"
        >
          <div className="rounded-2xl border border-border/40 bg-card/40 p-6 shadow-xl shadow-black/5 backdrop-blur-2xl dark:shadow-black/30">
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { value: "11", label: "Pipeline Stages", color: "text-blue-400" },
                { value: "< 3s", label: "Avg. Processing", color: "text-emerald-400" },
                { value: "99.7%", label: "Auto-Resolution", color: "text-teal-400" },
                { value: "0", label: "Data Loss Events", color: "text-amber-400" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center px-4">
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
