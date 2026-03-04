"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft, Phone, MapPin, Droplets, Calendar,
  MoreVertical, CreditCard, FileText, MessageSquare,
  ClipboardCheck, AlertTriangle, Edit, UserCheck,
  BookOpen, Library, ShieldCheck, TrendingUp, Clock,
  Users, DollarSign, Heart, ChevronRight, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet, SheetContent,
} from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Demo Data ─────────────────────────────────── */

const STUDENT = {
  id: "s-001",
  name: "Aarav Yadav",
  photo: "AY",
  class: "9",
  section: "A",
  srn: "SRN-2026-001",
  fatherName: "Ramesh Yadav",
  bloodGroup: "B+",
  dob: "2012-05-15",
  phone: "9876543210",
  address: "Haluhera, Rewari",
  status: "present" as const,
  entryTime: "08:15 AM",
  classTeacher: "Mrs. Sharma",
  classTeacherStatus: "present" as const,
  substituteTeacher: null as string | null,
  enrolledAt: "2025-04-01",
  enrolledBy: "Admin Office",
}

/* Widget data */
const ACADEMIC = {
  cgpa: 8.7,
  lastTest: "Unit Test 3 - Math",
  lastScore: 85,
  trend: [72, 78, 80, 75, 82, 85],
  rank: 5,
  totalStudents: 42,
}

const FINANCIAL = {
  totalDue: 12000,
  siblingName: "Aarav (8th A)",
  siblingDue: 4000,
  familyDue: 16000,
  lastPayment: "2026-01-15",
  lastPaymentAmt: 8000,
}

const DISCIPLINARY = {
  activeAlerts: 0,
  counselingSessions: 1,
  nextSession: "2026-03-10",
  counselor: "Ms. Priya",
  remarks: [],
}

const LIBRARY_DATA = {
  booksIssued: 2,
  booksOverdue: 1,
  overdueBook: "Physics NCERT Part II",
  overdueSince: "2026-02-20",
  fineAmount: 50,
}

const COMPLIANCE = {
  scholarshipStatus: "Approved",
  scholarshipName: "National Merit Scholarship",
  boardRegistration: "Completed",
  boardRollNo: "HR-2026-89045",
  aadharVerified: true,
}

interface ActivityItem {
  id: string
  text: string
  type: "fee" | "library" | "counseling" | "academic" | "admin" | "attendance"
  date: string
  actor: string
}

const ACTIVITY_LOG: ActivityItem[] = [
  { id: "a1", text: "Fee paid Rs. 8,000 via UPI", type: "fee", date: "2026-01-15", actor: "Ramesh Yadav (Parent)" },
  { id: "a2", text: "Library book issued: Advanced Mathematics", type: "library", date: "2026-02-01", actor: "Library Desk" },
  { id: "a3", text: "Counseling session booked", type: "counseling", date: "2026-02-10", actor: "Admin" },
  { id: "a4", text: "Unit Test 3 - Math: 85/100 (Rank 5)", type: "academic", date: "2026-02-18", actor: "Mrs. Sharma" },
  { id: "a5", text: "Physics NCERT marked overdue", type: "library", date: "2026-02-20", actor: "System" },
  { id: "a6", text: "Promoted to Class 9 from Class 8", type: "admin", date: "2025-04-01", actor: "Principal" },
  { id: "a7", text: "Transfer Certificate generated", type: "admin", date: "2025-03-28", actor: "Admin Office" },
  { id: "a8", text: "Annual Fee Rs. 24,000 paid", type: "fee", date: "2025-06-15", actor: "Ramesh Yadav (Parent)" },
  { id: "a9", text: "Library book returned: Chemistry Basics", type: "library", date: "2025-09-10", actor: "Library Desk" },
  { id: "a10", text: "Attendance warning issued (75% threshold)", type: "attendance", date: "2025-11-02", actor: "System" },
]

const ACTIVITY_ICON: Record<ActivityItem["type"], typeof CreditCard> = {
  fee: CreditCard,
  library: Library,
  counseling: Heart,
  academic: TrendingUp,
  admin: ShieldCheck,
  attendance: ClipboardCheck,
}

const ACTIVITY_COLOR: Record<ActivityItem["type"], string> = {
  fee: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  library: "text-sky-500 border-sky-500/30 bg-sky-500/10",
  counseling: "text-pink-500 border-pink-500/30 bg-pink-500/10",
  academic: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  admin: "text-violet-500 border-violet-500/30 bg-violet-500/10",
  attendance: "text-orange-500 border-orange-500/30 bg-orange-500/10",
}

/* ── Page Component ────────────────────────────── */

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null)

  const s = STUDENT

  return (
    <DashboardShell>
      {/* Back + Actions Row */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard/students")} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          <span className="hidden sm:inline">Back to Directory</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* RBAC Action Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 border-border/50 text-xs">
              Actions <MoreVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-border/40 bg-card/95 backdrop-blur-2xl">
            <DropdownMenuItem className="gap-2.5 text-xs">
              <CreditCard className="size-4 text-emerald-500" />Collect Fee
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2.5 text-xs">
              <FileText className="size-4 text-sky-500" />Generate TC
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2.5 text-xs">
              <MessageSquare className="size-4 text-pink-500" />Book Counseling Session
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2.5 text-xs">
              <ClipboardCheck className="size-4 text-amber-500" />Mark Manual Attendance
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2.5 text-xs">
              <AlertTriangle className="size-4 text-red-500" />Add Disciplinary Remark
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2.5 text-xs">
              <Edit className="size-4 text-muted-foreground" />Edit Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header Identity Card */}
      <div className="mb-5 rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          {/* Avatar */}
          <div className="flex size-14 shrink-0 items-center justify-center self-start rounded-2xl border border-primary/30 bg-primary/10 text-lg font-bold text-primary sm:size-20 sm:text-2xl">
            {s.photo}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex flex-wrap items-start gap-2">
              <h1 className="text-base font-bold text-foreground sm:text-xl">{s.name}</h1>
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] text-primary">
                Grade {s.class}-{s.section}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">S/O {s.fatherName}</p>

            {/* Info chips -- stack differently on mobile */}
            <div className="mt-3 flex flex-col gap-1.5 text-[11px] text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
              <span className="flex items-center gap-1"><BookOpen className="size-3 shrink-0" />{s.srn}</span>
              <span className="flex items-center gap-1"><Droplets className="size-3 shrink-0" />{s.bloodGroup}</span>
              <span className="flex items-center gap-1"><Calendar className="size-3 shrink-0" />DOB: {s.dob}</span>
              <span className="flex items-center gap-1"><Phone className="size-3 shrink-0" />{s.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="size-3 shrink-0" />{s.address}</span>
            </div>

            {/* Real-time badges -- stack on mobile */}
            <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-2">
              <Badge variant="outline" className={cn(
                "text-[10px] gap-1 w-fit",
                s.status === "present" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-red-500/30 bg-red-500/10 text-red-500"
              )}>
                <UserCheck className="size-2.5" />
                Student: {s.status === "present" ? `Present Today ${s.entryTime}` : "Absent Today"}
              </Badge>
              <Badge variant="outline" className={cn(
                "text-[10px] gap-1 w-fit",
                s.classTeacherStatus === "present" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-red-500/30 bg-red-500/10 text-red-500"
              )}>
                CT: {s.classTeacher} | {s.classTeacherStatus === "present" ? "Present" : `Absent - Sub: ${s.substituteTeacher}`}
              </Badge>
            </div>

            {/* Universal Audit Footer */}
            <div className="mt-3 border-t border-border/20 pt-2">
              <p className="text-[10px] text-muted-foreground/60">Enrolled by: {s.enrolledBy} on {s.enrolledAt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Widget Grid -- 1 col mobile, 2 col sm, 3 col lg */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Widget A: Academics */}
        <WidgetCard
          title="Academics"
          icon={<TrendingUp className="size-4" />}
          color="amber"
          onClick={() => setActiveDrawer("academic")}
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{ACADEMIC.cgpa}</p>
              <p className="text-[10px] text-muted-foreground">CGPA (Current Year)</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Rank #{ACADEMIC.rank}</p>
              <p className="text-[10px] text-muted-foreground">of {ACADEMIC.totalStudents}</p>
            </div>
          </div>
          {/* Sparkline */}
          <div className="mt-3 flex items-end gap-1 h-10">
            {ACADEMIC.trend.map((v, i) => (
              <div key={i} className="flex-1 rounded-sm bg-amber-500/20" style={{ height: `${(v / 100) * 100}%` }}>
                <div className="h-full rounded-sm bg-amber-500/60" style={{ height: `${(v / 100) * 100}%` }} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{ACADEMIC.lastTest}: <span className="font-medium text-foreground">{ACADEMIC.lastScore}/100</span></p>
        </WidgetCard>

        {/* Widget B: Financial */}
        <WidgetCard
          title="Financial & Sibling"
          icon={<DollarSign className="size-4" />}
          color="emerald"
          onClick={() => setActiveDrawer("financial")}
        >
          <p className="text-2xl font-bold text-foreground">Rs. {FINANCIAL.totalDue.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-muted-foreground">Total Fee Due</p>
          <div className="mt-3 rounded-lg border border-border/30 bg-background/20 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Users className="size-3 shrink-0" />
              <span className="truncate">Sibling: {FINANCIAL.siblingName} Due: <span className="font-medium text-foreground">Rs. {FINANCIAL.siblingDue.toLocaleString("en-IN")}</span></span>
            </div>
            <p className="mt-1 text-xs font-semibold text-foreground">Total Family Due: Rs. {FINANCIAL.familyDue.toLocaleString("en-IN")}</p>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Last: Rs. {FINANCIAL.lastPaymentAmt.toLocaleString("en-IN")} on {FINANCIAL.lastPayment}</p>
        </WidgetCard>

        {/* Widget C: Disciplinary */}
        <WidgetCard
          title="Disciplinary & Well-being"
          icon={<Heart className="size-4" />}
          color="pink"
          onClick={() => setActiveDrawer("disciplinary")}
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{DISCIPLINARY.activeAlerts}</p>
              <p className="text-[10px] text-muted-foreground">Active Alerts</p>
            </div>
            <div className="h-8 w-px bg-border/30" />
            <div>
              <p className="text-2xl font-bold text-foreground">{DISCIPLINARY.counselingSessions}</p>
              <p className="text-[10px] text-muted-foreground">Counseling</p>
            </div>
          </div>
          {DISCIPLINARY.counselingSessions > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-pink-500/20 bg-pink-500/5 px-3 py-2 text-[11px]">
              <Calendar className="size-3 shrink-0 text-pink-500" />
              <span className="text-muted-foreground truncate">Next: {DISCIPLINARY.nextSession} with {DISCIPLINARY.counselor}</span>
            </div>
          )}
        </WidgetCard>

        {/* Widget D: Library */}
        <WidgetCard
          title="Library & Assets"
          icon={<Library className="size-4" />}
          color="sky"
          onClick={() => setActiveDrawer("library")}
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{LIBRARY_DATA.booksIssued}</p>
              <p className="text-[10px] text-muted-foreground">Books Issued</p>
            </div>
            <div className="h-8 w-px bg-border/30" />
            <div>
              <p className="text-2xl font-bold text-red-500">{LIBRARY_DATA.booksOverdue}</p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </div>
          </div>
          {LIBRARY_DATA.booksOverdue > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-[11px]">
              <AlertTriangle className="size-3 shrink-0 text-red-500" />
              <span className="text-muted-foreground truncate">{LIBRARY_DATA.overdueBook} (since {LIBRARY_DATA.overdueSince})</span>
            </div>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">Fine: Rs. {LIBRARY_DATA.fineAmount}</p>
        </WidgetCard>

        {/* Widget E: Government & Compliance */}
        <WidgetCard
          title="Govt & Compliance"
          icon={<ShieldCheck className="size-4" />}
          color="violet"
          onClick={() => setActiveDrawer("compliance")}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Scholarship</span>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">{COMPLIANCE.scholarshipStatus}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Board Reg.</span>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">{COMPLIANCE.boardRegistration}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Aadhaar</span>
              <Badge variant="outline" className={cn("text-[10px]", COMPLIANCE.aadharVerified ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-amber-500/30 bg-amber-500/10 text-amber-500")}>
                {COMPLIANCE.aadharVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
          <p className="mt-2 truncate text-[11px] text-muted-foreground">{COMPLIANCE.scholarshipName} | Roll: {COMPLIANCE.boardRollNo}</p>
        </WidgetCard>
      </div>

      {/* Activity & Audit Log */}
      <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Activity & Audit Log</h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-0 h-full w-px bg-border/30 sm:left-[17px]" />

          <div className="flex flex-col gap-4">
            {ACTIVITY_LOG.map(a => {
              const Icon = ACTIVITY_ICON[a.type]
              const color = ACTIVITY_COLOR[a.type]
              return (
                <div key={a.id} className="relative flex gap-3 pl-0 sm:gap-4">
                  <div className={cn("relative z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full border sm:size-9", color)}>
                    <Icon className="size-3.5 sm:size-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-foreground leading-snug">{a.text}</p>
                    {/* Audit footer -- always visible */}
                    <p className="mt-1 text-[10px] text-muted-foreground/60">
                      {a.actor} at {a.date}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detail Drawers */}
      <DetailDrawer
        open={activeDrawer !== null}
        onClose={() => setActiveDrawer(null)}
        title={
          activeDrawer === "academic" ? "Full Academic Report" :
          activeDrawer === "financial" ? "Fee Ledger" :
          activeDrawer === "disciplinary" ? "Counseling & Discipline Hub" :
          activeDrawer === "library" ? "Library Ledger" :
          activeDrawer === "compliance" ? "Government & Compliance" : ""
        }
        studentName={s.name}
      >
        {activeDrawer === "academic" && <AcademicDrawerContent />}
        {activeDrawer === "financial" && <FinancialDrawerContent />}
        {activeDrawer === "disciplinary" && <DisciplinaryDrawerContent />}
        {activeDrawer === "library" && <LibraryDrawerContent />}
        {activeDrawer === "compliance" && <ComplianceDrawerContent />}
      </DetailDrawer>
    </DashboardShell>
  )
}

/* ── Widget Card ───────────────────────────────── */

function WidgetCard({ title, icon, color, onClick, children }: {
  title: string
  icon: React.ReactNode
  color: string
  onClick: () => void
  children: React.ReactNode
}) {
  const accents: Record<string, string> = {
    amber: "hover:border-amber-500/30",
    emerald: "hover:border-emerald-500/30",
    pink: "hover:border-pink-500/30",
    sky: "hover:border-sky-500/30",
    violet: "hover:border-violet-500/30",
  }
  const iconColor: Record<string, string> = {
    amber: "text-amber-500",
    emerald: "text-emerald-500",
    pink: "text-pink-500",
    sky: "text-sky-500",
    violet: "text-violet-500",
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:bg-card/80 active:scale-[0.98]",
        accents[color]
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={iconColor[color]}>{icon}</span>
          <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        </div>
        <ChevronRight className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
      </div>
      {children}
    </button>
  )
}

/* ── Detail Drawer ─────────────────────────────── */

function DetailDrawer({ open, onClose, title, studentName, children }: {
  open: boolean
  onClose: () => void
  title: string
  studentName: string
  children: React.ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[90vw] sm:!max-w-[90vw] p-0 overflow-hidden [&>button]:hidden">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">{title}</h2>
              <p className="text-[11px] text-muted-foreground">{studentName}</p>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ── Drawer Contents ───────────────────────────── */

function AcademicDrawerContent() {
  const tests = [
    { name: "Unit Test 1 - Math", score: 72, total: 100, date: "2025-08-15", by: "Mrs. Sharma" },
    { name: "Unit Test 1 - Science", score: 78, total: 100, date: "2025-08-16", by: "Mr. Verma" },
    { name: "Mid Term - Math", score: 80, total: 100, date: "2025-10-10", by: "Mrs. Sharma" },
    { name: "Mid Term - Science", score: 75, total: 100, date: "2025-10-11", by: "Mr. Verma" },
    { name: "Unit Test 2 - Math", score: 82, total: 100, date: "2025-12-05", by: "Mrs. Sharma" },
    { name: "Unit Test 3 - Math", score: 85, total: 100, date: "2026-02-18", by: "Mrs. Sharma" },
    { name: "Unit Test 3 - Science", score: 88, total: 100, date: "2026-02-19", by: "Mr. Verma" },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        <MiniStat label="CGPA" value={String(ACADEMIC.cgpa)} />
        <MiniStat label="Class Rank" value={`#${ACADEMIC.rank}`} />
        <MiniStat label="Total Tests" value={String(tests.length)} />
        <MiniStat label="Avg Score" value={`${Math.round(tests.reduce((a, t) => a + t.score, 0) / tests.length)}%`} />
      </div>
      <div className="rounded-xl border border-border/30 bg-background/20">
        <div className="border-b border-border/20 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Test History
        </div>
        {tests.map((t, i) => (
          <div key={i} className="flex flex-col gap-1 border-b border-border/10 px-4 py-2.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{t.name}</p>
            </div>
            <div className="flex items-center gap-2 sm:shrink-0">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border/30 sm:w-24">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${t.score}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-foreground">{t.score}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground/60 sm:hidden">Recorded by: {t.by} at {t.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FinancialDrawerContent() {
  const ledger = [
    { date: "2026-01-15", desc: "Tuition Fee Payment (UPI)", credit: 8000, balance: 12000, by: "Ramesh Yadav" },
    { date: "2025-10-01", desc: "Lab Fee - Term 2", credit: 0, balance: 20000, debit: 2000, by: "Accounts" },
    { date: "2025-08-15", desc: "Annual Fee Payment (Cash)", credit: 15000, balance: 18000, by: "Ramesh Yadav" },
    { date: "2025-06-01", desc: "Admission Fee + Tuition Q1", credit: 0, balance: 33000, debit: 33000, by: "Accounts" },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        <MiniStat label="Fee Due" value={`Rs. ${FINANCIAL.totalDue.toLocaleString("en-IN")}`} />
        <MiniStat label="Family Due" value={`Rs. ${FINANCIAL.familyDue.toLocaleString("en-IN")}`} />
        <MiniStat label="Last Payment" value={FINANCIAL.lastPayment} />
      </div>

      {/* Mobile-friendly: card layout on mobile, table on desktop */}
      <div className="hidden overflow-x-auto rounded-xl border border-border/30 bg-background/20 sm:block">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/20 text-left">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Amount</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((l, i) => (
              <tr key={i} className="border-b border-border/10 last:border-0">
                <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{l.date}</td>
                <td className="px-4 py-2.5 text-foreground">{l.desc}</td>
                <td className={cn("px-4 py-2.5 text-right font-medium whitespace-nowrap", l.credit > 0 ? "text-emerald-500" : "text-red-500")}>
                  {l.credit > 0 ? `+${l.credit.toLocaleString("en-IN")}` : `-${(l.debit ?? 0).toLocaleString("en-IN")}`}
                </td>
                <td className="px-4 py-2.5 text-right text-foreground whitespace-nowrap">{l.balance.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="flex flex-col gap-2 sm:hidden">
        {ledger.map((l, i) => (
          <div key={i} className="rounded-xl border border-border/30 bg-background/20 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-foreground">{l.desc}</p>
              <span className={cn("shrink-0 text-sm font-semibold", l.credit > 0 ? "text-emerald-500" : "text-red-500")}>
                {l.credit > 0 ? `+${l.credit.toLocaleString("en-IN")}` : `-${(l.debit ?? 0).toLocaleString("en-IN")}`}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Balance: Rs. {l.balance.toLocaleString("en-IN")}</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground/60">Recorded by: {l.by} at {l.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DisciplinaryDrawerContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        <MiniStat label="Active Alerts" value={String(DISCIPLINARY.activeAlerts)} />
        <MiniStat label="Counseling" value={String(DISCIPLINARY.counselingSessions)} />
      </div>
      <div className="rounded-xl border border-border/30 bg-background/20 p-4">
        <p className="text-xs font-semibold text-foreground">Upcoming Session</p>
        <p className="mt-1 text-sm text-muted-foreground">{DISCIPLINARY.nextSession} with {DISCIPLINARY.counselor}</p>
        <p className="mt-2 text-[10px] text-muted-foreground/60">Created by: Admin at 2026-02-10</p>
      </div>
      <div className="rounded-xl border border-border/30 bg-background/20 p-4">
        <p className="text-xs font-semibold text-foreground">Disciplinary Remarks</p>
        <p className="mt-1 text-sm text-muted-foreground">No active disciplinary remarks on record.</p>
      </div>
    </div>
  )
}

function LibraryDrawerContent() {
  const books = [
    { title: "Advanced Mathematics", issued: "2026-02-01", due: "2026-03-01", status: "active" as const, issuedBy: "Library Desk" },
    { title: "Physics NCERT Part II", issued: "2026-01-10", due: "2026-02-10", status: "overdue" as const, issuedBy: "Library Desk" },
    { title: "Chemistry Basics", issued: "2025-08-15", due: "2025-09-15", status: "returned" as const, issuedBy: "Library Desk" },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2.5">
        <MiniStat label="Issued" value={String(LIBRARY_DATA.booksIssued)} />
        <MiniStat label="Overdue" value={String(LIBRARY_DATA.booksOverdue)} />
        <MiniStat label="Fine" value={`Rs. ${LIBRARY_DATA.fineAmount}`} />
      </div>
      <div className="flex flex-col gap-2">
        {books.map((b, i) => (
          <div key={i} className={cn(
            "flex flex-col gap-1.5 rounded-xl border p-3",
            b.status === "overdue" ? "border-red-500/20 bg-red-500/[0.05]" : "border-border/30 bg-background/20"
          )}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{b.title}</p>
              <Badge variant="outline" className={cn(
                "shrink-0 text-[10px]",
                b.status === "active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" :
                b.status === "overdue" ? "border-red-500/30 bg-red-500/10 text-red-500" :
                "border-border/30 text-muted-foreground"
              )}>
                {b.status === "active" ? "Active" : b.status === "overdue" ? "Overdue" : "Returned"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">Issued: {b.issued} | Due: {b.due}</p>
            <p className="text-[10px] text-muted-foreground/60">Issued by: {b.issuedBy} at {b.issued}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ComplianceDrawerContent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        <MiniStat label="Scholarship" value={COMPLIANCE.scholarshipStatus} />
        <MiniStat label="Board Reg." value={COMPLIANCE.boardRegistration} />
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Scholarship Name", value: COMPLIANCE.scholarshipName },
          { label: "Board Roll No", value: COMPLIANCE.boardRollNo },
          { label: "Aadhaar Status", value: COMPLIANCE.aadharVerified ? "Verified" : "Pending Verification" },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border/30 bg-background/20 px-4 py-3">
            <span className="text-xs text-muted-foreground">{r.label}</span>
            <span className="text-xs font-medium text-foreground">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/30 bg-background/20 p-3 shadow-2xl backdrop-blur-2xl">
      <p className="text-lg font-bold text-foreground leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}
