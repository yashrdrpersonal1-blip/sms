"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Phone, Mail, MapPin, Briefcase, Wallet,
  Clock, GitPullRequest, Shield, Eye, FileText,
  Calendar, ChevronRight, X, ClipboardCheck, CircleDot,
  CheckCircle2, AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Demo data ────────────────────────────── */

const STAFF = {
  id: "st-001",
  name: "Mrs. Anita Sharma",
  empId: "EMP-001",
  photo: "AS",
  roles: ["Teacher"],
  empType: "Full-Time",
  department: "Academic",
  teacherCategory: "PGT",
  subject: "Mathematics",
  phone: "9876543001",
  email: "anita.sharma@school.edu",
  address: "B-12, Sector 8, Rewari, Haryana 123401",
  dob: "1986-03-15",
  gender: "Female",
  qualification: "M.Sc Mathematics, B.Ed",
  experience: "12 yrs",
  attendance: "present" as const,
  joinDate: "2020-04-01",
  createdBy: "Admin Office",
}

const PAYROLL = {
  ctc: "7,20,000",
  basic: "30,000",
  hra: "12,000",
  da: "6,000",
  gross: "60,000",
  pf: "3,600",
  profTax: "200",
  net: "56,200",
  bankAcc: "****4092",
  bankName: "State Bank of India",
}

const PENDING_REQUESTS = [
  { id: "REQ-042", type: "Leave", summary: "CL: 5-7 Mar 2026", status: "pending" as const, date: "2026-02-28", module: "HR" },
  { id: "REQ-038", type: "Reimbursement", summary: "Travel to Rewari Workshop", status: "approved" as const, date: "2026-02-20", module: "Finance" },
  { id: "REQ-035", type: "Leave", summary: "SL: 15 Feb 2026", status: "approved" as const, date: "2026-02-14", module: "HR" },
]

type TaskStatus = "upcoming" | "overdue" | "completed"

interface StaffTask {
  id: string
  title: string
  dueDate: string
  status: TaskStatus
  module: string
  link: string
  assignedBy: string
  assignedAt: string
}

const TASKS: StaffTask[] = [
  { id: "t1", title: "Submit Term 2 Grades for Class 9-A", dueDate: "2026-03-15", status: "upcoming", module: "Academic", link: "/dashboard/workflow/requests", assignedBy: "Principal", assignedAt: "2026-03-01" },
  { id: "t2", title: "Complete Annual Appraisal Self-Review", dueDate: "2026-03-10", status: "upcoming", module: "HR", link: "/dashboard/workflow/self-service", assignedBy: "HR Admin", assignedAt: "2026-02-25" },
  { id: "t3", title: "Update Emergency Contact Details", dueDate: "2026-02-28", status: "overdue", module: "HR", link: "/dashboard/workflow/self-service", assignedBy: "System", assignedAt: "2026-02-15" },
  { id: "t4", title: "Attend Math Dept Meeting", dueDate: "2026-03-08", status: "upcoming", module: "Academic", link: "/dashboard/workflow/requests", assignedBy: "HOD Math", assignedAt: "2026-03-02" },
  { id: "t5", title: "Submit Jan Attendance Report", dueDate: "2026-02-05", status: "completed", module: "HR", link: "/dashboard/workflow/requests", assignedBy: "HR Admin", assignedAt: "2026-01-25" },
]

const TASK_STATUS_CFG: Record<TaskStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  upcoming:  { label: "Upcoming",  cls: "border-sky-500/30 bg-sky-500/10 text-sky-500", icon: CircleDot },
  overdue:   { label: "Overdue",   cls: "border-red-500/30 bg-red-500/10 text-red-500", icon: AlertCircle },
  completed: { label: "Done",      cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
}

const AUDIT_LOG = [
  { id: "a1", date: "2026-03-01", module: "HR" as const, event: "Marked present via biometric at 07:52 AM", actor: "System" },
  { id: "a2", date: "2026-02-28", module: "HR" as const, event: "Applied for Casual Leave (5-7 Mar)", actor: "Self" },
  { id: "a3", date: "2026-02-20", module: "Finance" as const, event: "Travel reimbursement approved - Rs 2,400", actor: "Mr. Rao (Finance)" },
  { id: "a4", date: "2026-02-15", module: "Academic" as const, event: "Assigned as Class Teacher for 9-A", actor: "Principal" },
  { id: "a5", date: "2026-02-14", module: "HR" as const, event: "Sick Leave approved (1 day)", actor: "Mr. Kumar (HR)" },
  { id: "a6", date: "2026-02-01", module: "Finance" as const, event: "February salary processed - Net Rs 56,200", actor: "System" },
  { id: "a7", date: "2026-01-25", module: "Transport" as const, event: "Flagged for late arrival to bus duty", actor: "Mr. Singh (Transport)" },
  { id: "a8", date: "2026-01-15", module: "Academic" as const, event: "Submitted Term 1 grades for Class 9-A", actor: "Self" },
]

const MODULE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  HR: { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
  Finance: { bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" },
  Academic: { bg: "bg-violet-500/10", text: "text-violet-500", dot: "bg-violet-500" },
  Transport: { bg: "bg-sky-500/10", text: "text-sky-500", dot: "bg-sky-500" },
}

/* ── Page ──────────────────────────────────── */

export default function StaffProfilePage() {
  const router = useRouter()
  const [payrollOpen, setPayrollOpen] = useState(false)
  const [requestsOpen, setRequestsOpen] = useState(false)
  const [tasksOpen, setTasksOpen] = useState(false)

  const overdueTasks = TASKS.filter(t => t.status === "overdue").length
  const upcomingTasks = TASKS.filter(t => t.status === "upcoming").length

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        {/* Back */}
        <button onClick={() => router.push("/dashboard/hr/staff")} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground self-start">
          <ArrowLeft className="size-3.5" />Back to Directory
        </button>

        {/* Identity Header */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary sm:size-20 sm:text-2xl">
              {STAFF.photo}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-foreground sm:text-xl">{STAFF.name}</h1>
                  <p className="text-xs text-muted-foreground">{STAFF.empId} &middot; {STAFF.department}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-500">Present Today</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="border-sky-500/30 text-[10px] text-sky-500">Teacher</Badge>
                <Badge variant="outline" className="border-primary/30 text-[10px] text-primary">{STAFF.teacherCategory}</Badge>
                <Badge variant="outline" className="border-amber-500/30 text-[10px] text-amber-500">{STAFF.subject}</Badge>
                <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{STAFF.empType}</Badge>
                <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{STAFF.experience}</Badge>
              </div>
              <div className="mt-3 flex flex-col gap-1.5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-1"><Phone className="size-3" />{STAFF.phone}</span>
                <span className="flex items-center gap-1"><Mail className="size-3" />{STAFF.email}</span>
                <span className="flex items-center gap-1"><Calendar className="size-3" />Joined {STAFF.joinDate}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 border-t border-border/20 pt-2 text-[10px] text-muted-foreground/60">
            Onboarded by {STAFF.createdBy} on {STAFF.joinDate}
          </p>
        </div>

        {/* Bento Widgets -- 2x2 grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Widget A: Tasks */}
          <button onClick={() => setTasksOpen(true)} className="group rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10">
                  <ClipboardCheck className="size-4 text-sky-500" />
                </div>
                <p className="text-xs font-semibold text-foreground">Tasks & Dues</p>
              </div>
              <div className="flex items-center gap-2">
                {overdueTasks > 0 && (
                  <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-[9px] text-red-500">{overdueTasks} overdue</Badge>
                )}
                <ChevronRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {TASKS.filter(t => t.status !== "completed").slice(0, 3).map(t => {
                const cfg = TASK_STATUS_CFG[t.status]
                return (
                  <div key={t.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] text-muted-foreground">{t.title}</span>
                    <Badge variant="outline" className={cn("ml-2 shrink-0 text-[9px]", cfg.cls)}>{t.dueDate.slice(5)}</Badge>
                  </div>
                )
              })}
              {upcomingTasks > 3 && <p className="text-[10px] text-muted-foreground/50">+{upcomingTasks - 3} more...</p>}
            </div>
          </button>

          {/* Widget B: Payroll */}
          <button onClick={() => setPayrollOpen(true)} className="group rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Wallet className="size-4 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-foreground">Compensation</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-muted-foreground">Net Payable</span>
                <span className="text-sm font-bold text-foreground">Rs {PAYROLL.net}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-muted-foreground">CTC</span>
                <span className="text-xs text-muted-foreground">Rs {PAYROLL.ctc}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-muted-foreground">Bank</span>
                <span className="text-xs text-muted-foreground">{PAYROLL.bankName} {PAYROLL.bankAcc}</span>
              </div>
            </div>
          </button>

          {/* Widget C: Pending Requests */}
          <button onClick={() => setRequestsOpen(true)} className="group rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <GitPullRequest className="size-4 text-amber-500" />
                </div>
                <p className="text-xs font-semibold text-foreground">Requests</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div className="flex flex-col gap-1.5">
              {PENDING_REQUESTS.slice(0, 3).map(r => (
                <div key={r.id} className="flex items-center justify-between">
                  <span className="truncate text-[11px] text-muted-foreground">{r.summary}</span>
                  <Badge variant="outline" className={cn("ml-2 shrink-0 text-[9px]",
                    r.status === "pending" ? "border-amber-500/30 text-amber-500" : "border-emerald-500/30 text-emerald-500"
                  )}>{r.status}</Badge>
                </div>
              ))}
            </div>
          </button>

          {/* Widget D: Quick Info */}
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
                <Shield className="size-4 text-violet-500" />
              </div>
              <p className="text-xs font-semibold text-foreground">Qualifications</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <InfoRow label="Qualification" value={STAFF.qualification} />
              <InfoRow label="DOB" value={STAFF.dob} />
              <InfoRow label="Gender" value={STAFF.gender} />
              <InfoRow label="Address" value={STAFF.address} />
            </div>
          </div>
        </div>

        {/* Omni Audit Log */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Omni-Audit Log</p>
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border/40 sm:left-[15px]" />
            {AUDIT_LOG.map((a) => {
              const mc = MODULE_COLORS[a.module] || MODULE_COLORS.HR
              return (
                <div key={a.id} className="relative flex gap-3 pb-4 sm:gap-4">
                  <div className={cn("relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full sm:size-8", mc.bg)}>
                    <div className={cn("size-2 rounded-full sm:size-2.5", mc.dot)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                      <Badge variant="outline" className={cn("w-fit text-[9px]", mc.text, `border-${a.module === "HR" ? "amber" : a.module === "Finance" ? "emerald" : a.module === "Academic" ? "violet" : "sky"}-500/30`)}>{a.module}</Badge>
                      <span className="text-[10px] text-muted-foreground">{a.date}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-foreground">{a.event}</p>
                    <p className="text-[10px] text-muted-foreground/60">By {a.actor}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tasks Drawer */}
      <Sheet open={tasksOpen} onOpenChange={setTasksOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ClipboardCheck className="size-4 text-sky-500" />Tasks & Dues
              </SheetTitle>
              <button onClick={() => setTasksOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {TASKS.map(t => {
                  const cfg = TASK_STATUS_CFG[t.status]
                  const StatusIcon = cfg.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setTasksOpen(false); router.push(t.link) }}
                      className="flex flex-col gap-1.5 rounded-xl border border-border/30 bg-background/30 px-4 py-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex items-start gap-3">
                        <StatusIcon className={cn("mt-0.5 size-4 shrink-0", cfg.cls.split(" ").pop())} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{t.title}</p>
                            <Badge variant="outline" className={cn("text-[10px]", cfg.cls)}>{cfg.label}</Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="size-3" />Due: {t.dueDate}</span>
                            <span>{t.module}</span>
                          </div>
                          <p className="mt-1 text-[10px] text-muted-foreground/50">Assigned by: {t.assignedBy} on {t.assignedAt}</p>
                        </div>
                        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/30" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Payroll Drawer */}
      <Sheet open={payrollOpen} onOpenChange={setPayrollOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wallet className="size-4 text-emerald-500" />Compensation Details
              </SheetTitle>
              <button onClick={() => setPayrollOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-3">
                <PayrollRow label="Annual CTC" value={`Rs ${PAYROLL.ctc}`} highlight />
                <PayrollRow label="Monthly Gross" value={`Rs ${PAYROLL.gross}`} />
                <div className="h-px bg-border/30" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Earnings</p>
                <PayrollRow label="Basic Pay" value={`Rs ${PAYROLL.basic}`} />
                <PayrollRow label="HRA" value={`Rs ${PAYROLL.hra}`} />
                <PayrollRow label="DA" value={`Rs ${PAYROLL.da}`} />
                <div className="h-px bg-border/30" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Deductions</p>
                <PayrollRow label="PF Deduction" value={`Rs ${PAYROLL.pf}`} />
                <PayrollRow label="Professional Tax" value={`Rs ${PAYROLL.profTax}`} />
                <div className="h-px bg-border/30" />
                <PayrollRow label="Net Payable" value={`Rs ${PAYROLL.net}`} highlight />
                <div className="h-px bg-border/30" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bank Details</p>
                <PayrollRow label="Bank" value={PAYROLL.bankName} />
                <PayrollRow label="Account" value={PAYROLL.bankAcc} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Requests Drawer */}
      <Sheet open={requestsOpen} onOpenChange={setRequestsOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <GitPullRequest className="size-4 text-amber-500" />Requests History
              </SheetTitle>
              <button onClick={() => setRequestsOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {PENDING_REQUESTS.map(r => (
                  <div key={r.id} className="rounded-xl border border-border/30 bg-background/30 px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                      <Badge variant="outline" className={cn("text-[10px]",
                        r.status === "pending" ? "border-amber-500/30 text-amber-500" : "border-emerald-500/30 text-emerald-500"
                      )}>{r.status}</Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{r.summary}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{r.type} &middot; {r.module} &middot; {r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}

/* ── Helpers ──────────────────────────────── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <span className="text-right text-xs text-foreground">{value}</span>
    </div>
  )
}

function PayrollRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-xs", highlight ? "font-semibold text-foreground" : "text-muted-foreground")}>{label}</span>
      <span className={cn("text-xs font-mono", highlight ? "font-bold text-primary" : "text-foreground")}>{value}</span>
    </div>
  )
}
