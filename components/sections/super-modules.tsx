"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  GraduationCap, Users, Briefcase, CreditCard, TrendingUp,
  Bus, Package, BookOpen, BrainCircuit, Shield, Award, Server,
  ChevronDown,
} from "lucide-react"

const modules = [
  {
    id: "01", icon: GraduationCap, title: "Student Lifecycle & Academic Core",
    desc: "Manages every part of a student's journey from admission to graduation.",
    subs: ["Admissions & Enrollment","Student Information System (SIS)","Student One View (360)","Class & Section Management","Curriculum + Lesson Planning","Timetable Scheduling","Classroom Management","Attendance (RFID/NFC/UHF/BLE/QR)","Examination & Report Cards","Board Exam Submission Portal","Student Promotion / Retention","Student Transfer / TC","Counseling & Well-being","Co-curricular, Clubs, Houses","Homework / Assignments (LMS)","Learning Resources Library","Government Scholarship Tracking","Board Deadlines & Exam Alerts"],
  },
  {
    id: "02", icon: Users, title: "Parent & Community Engagement",
    desc: "Connects the school with families, guardians, and the community.",
    subs: ["Parent One View","Notification Center (SMS/WhatsApp/Email)","Parent Query Portal","PTM & Appointments","Government Scholarship News Portal","Government Education Circular Alerts","Entrance Exam Deadline Hub","Document Request System"],
  },
  {
    id: "03", icon: Briefcase, title: "Staff & HR Management",
    desc: "Manages the entire lifecycle of teachers and staff.",
    subs: ["HRIS (Staff Information)","Staff One View","Onboarding & Verification","Staff Attendance & Leave","Payroll & Salary Processing","Appraisals & Performance","Training & Development","Staff Offboarding & Clearance"],
  },
  {
    id: "04", icon: CreditCard, title: "Fees, Billing & Collections",
    desc: "Handles all student-related billing, fee structures, and collections.",
    subs: ["Fee Plans & Structures","Online Payments (UPI/Cards/Net Banking)","Fee Reminders","Transport Fee","Coaching Fee","Fine/Concession/Scholarship","Refund Requests"],
  },
  {
    id: "05", icon: TrendingUp, title: "Finance, Accounting & School Economics",
    desc: "Manages the school's internal financial system beyond student fees.",
    subs: ["Budgeting & Fund Allocation","Vendor Payments & Expenses","Petty Cash","Salary Ledgers","Department-wise Spending","Purchase Bills","AI Invoice Scanning","Year-End CA-Ready Reports","Export to Tally / QuickBooks","Fuel Expenses","Bus Repair & Maintenance Logs","CapEx / OpEx Management","Workshop & Building Repair Logs"],
  },
  {
    id: "06", icon: Bus, title: "Transport, Safety & Infrastructure",
    desc: "Ensures safe transportation, secure premises, and maintained vehicles.",
    subs: ["Bus Routes & GPS Tracking","Student Bus Attendance (RFID)","Driver & Conductor Records","Fuel Management","Bus Repair & Maintenance","Gate Entry/Exit Logs","Visitor Management System","CCTV Integration","Emergency Alert & Safety Protocols"],
  },
  {
    id: "07", icon: Package, title: "Inventory, Assets & Procurement",
    desc: "Tracks every item the school owns and manages vendor relationships.",
    subs: ["Stock Management","Purchase Orders","Vendor Ledger","Asset Register","Issue/Return System","Depreciation Tracking","Inventory Alerts & Reorder Levels"],
  },
  {
    id: "08", icon: BookOpen, title: "Library & Digital Learning",
    desc: "Supports reading, research, and digital learning with a modern library system.",
    subs: ["Library Management","Book Issue/Return","Late Fee Automation","ISBN/Barcode/QR Scanning","eBooks / Digital Content Library"],
  },
  {
    id: "09", icon: BrainCircuit, title: "AI, Automation & Intelligence Hub",
    desc: "The intelligence layer with AI-powered automation and predictive insights.",
    subs: ["AI Document Scanner (OCR)","Government Document Verification","Rules & Workflow Automation","Predictive Insights","AI Chatbot for Parents & Staff","AI Auto-Scheduler","AI Student Risk Alerts"],
  },
  {
    id: "10", icon: Shield, title: "Governance, Compliance & Multi-School",
    desc: "Provides governance for schools, regions, and corporate levels.",
    subs: ["Multi-Branch Workspace","Corporate Region School Controls","Board Compliance (CBSE/ICSE/State)","Audit Trail & Activity Logs","Policy Management","User & Role Permissions (RBAC)","Report Generation & Download Center"],
  },
  {
    id: "11", icon: Award, title: "Alumni & Post-School Services",
    desc: "Supports students after graduation with documentation and networking.",
    subs: ["Alumni One View","Document Request Portal","Verification Portal","Alumni Events & Networking","Donation/Contribution System"],
  },
  {
    id: "12", icon: Server, title: "IT, Infrastructure & Deployment",
    desc: "The technical backbone handling auth, security, deployments, and APIs.",
    subs: ["Authentication (OTP/SSO)","RBAC Permissions","API Layer","Cloud/Edge Deployment","Backup & Restore","Mobile Apps (Parents/Teachers/Staff)"],
  },
]

function ModuleCard({ mod, index }: { mod: typeof modules[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = mod.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className="group overflow-hidden rounded-xl border border-border/40 bg-card/50 shadow-sm shadow-black/5 backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-card/70 hover:shadow-md dark:shadow-black/20"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 backdrop-blur-sm">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <span className="rounded bg-secondary px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
              {mod.id}
            </span>
            <h3 className="truncate text-xs font-semibold text-foreground sm:text-sm">
              {mod.title}
            </h3>
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">{mod.desc}</p>
        </div>
        <ChevronDown
          className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30 px-4 pt-3 pb-4">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {mod.subs.map((sub) => (
                  <div key={sub} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <div className="h-0.5 w-0.5 shrink-0 rounded-full bg-primary" />
                    {sub}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function SuperModules() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const headingY = useTransform(scrollYProgress, [0, 0.3], [30, 0])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  return (
    <section id="products" ref={sectionRef} className="relative px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="mb-8 text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your school needs, in one platform.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            12 Super-Modules covering every operation from admissions to IT infrastructure.
          </p>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
