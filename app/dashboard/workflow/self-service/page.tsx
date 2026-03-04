"use client"

import { useState } from "react"
import {
  LayoutDashboard, CreditCard, Calendar, Clock, FileText,
  Download, TrendingUp, AlertTriangle, CheckCircle, Eye,
  ChevronRight, X, Briefcase, GraduationCap, Heart,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Profile Data ─── */
const PROFILE = {
  name: "Ravi Sharma",
  empId: "EMP-1042",
  role: "BDE - Field Sales",
  department: "CRM & Outreach",
  doj: "2024-08-01",
  shift: "General (8:00 AM - 4:00 PM)",
  reportingTo: "Mrs. Sunita Verma",
  avatar: "RS",
}

/* ── Pay Slips ─── */
const PAY_SLIPS = [
  { month: "Feb 2026", gross: 32000, deductions: 4200, net: 27800, status: "paid" as const },
  { month: "Jan 2026", gross: 32000, deductions: 4200, net: 27800, status: "paid" as const },
  { month: "Dec 2025", gross: 32000, deductions: 4200, net: 27800, status: "paid" as const },
  { month: "Nov 2025", gross: 30000, deductions: 3900, net: 26100, status: "paid" as const },
]

/* ── Leave Balance ─── */
const LEAVE_BAL = [
  { type: "Casual Leave", total: 12, used: 5, pending: 1, color: "text-sky-500" },
  { type: "Sick Leave", total: 10, used: 3, pending: 0, color: "text-red-500" },
  { type: "Earned Leave", total: 15, used: 2, pending: 0, color: "text-emerald-500" },
  { type: "Comp Off", total: 4, used: 1, pending: 1, color: "text-amber-500" },
]

/* ── Quick Actions ─── */
const QUICK_ACTIONS = [
  { id: "payslip", label: "Download Pay Slip", icon: CreditCard, color: "text-emerald-500", desc: "Latest month salary slip" },
  { id: "leave", label: "Apply Leave", icon: Calendar, color: "text-sky-500", desc: "Submit a leave request" },
  { id: "attendance", label: "My Attendance", icon: Clock, color: "text-amber-500", desc: "View attendance log" },
  { id: "documents", label: "My Documents", icon: FileText, color: "text-violet-500", desc: "ID proofs, certificates" },
  { id: "tax", label: "Tax Declaration", icon: Shield, color: "text-primary", desc: "Investment proofs & IT declaration" },
  { id: "training", label: "Trainings", icon: GraduationCap, color: "text-pink-500", desc: "Assigned learning modules" },
]

/* ── Announcements ─── */
const ANNOUNCEMENTS = [
  { id: "1", title: "Annual Sports Day - 15 Mar", type: "event", date: "2026-03-05" },
  { id: "2", title: "Salary credited for Feb 2026", type: "payroll", date: "2026-03-01" },
  { id: "3", title: "PF Contribution Updated - Check Payslip", type: "hr", date: "2026-02-28" },
]

/* ── Attendance Log ─── */
const ATTENDANCE_LOG = [
  { date: "2026-03-05", in: "7:55 AM", out: "4:02 PM", status: "present" as const, hours: "8h 7m" },
  { date: "2026-03-04", in: "8:10 AM", out: "4:15 PM", status: "present" as const, hours: "8h 5m" },
  { date: "2026-03-03", in: "7:50 AM", out: "4:00 PM", status: "present" as const, hours: "8h 10m" },
  { date: "2026-03-02", in: "-", out: "-", status: "absent" as const, hours: "-" },
  { date: "2026-03-01", in: "-", out: "-", status: "holiday" as const, hours: "-" },
  { date: "2026-02-28", in: "8:05 AM", out: "3:45 PM", status: "present" as const, hours: "7h 40m" },
  { date: "2026-02-27", in: "9:20 AM", out: "4:10 PM", status: "late" as const, hours: "6h 50m" },
]

const ATT_STATUS_CFG: Record<string, { label: string; cls: string }> = {
  present: { label: "Present", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" },
  absent:  { label: "Absent",  cls: "border-red-500/30 bg-red-500/10 text-red-500" },
  late:    { label: "Late",    cls: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  holiday: { label: "Holiday", cls: "border-sky-500/30 bg-sky-500/10 text-sky-500" },
}

export default function SelfServicePage() {
  const [paySlipOpen, setPaySlipOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)

  return (
    <DashboardShell>
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        {/* Profile Card */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary sm:size-16">
              {PROFILE.avatar}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-foreground sm:text-xl">{PROFILE.name}</h1>
              <p className="truncate text-xs text-muted-foreground">{PROFILE.role} | {PROFILE.department}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground/70">
                <span>{PROFILE.empId}</span>
                <span className="hidden sm:inline">|</span>
                <span>Joined {PROFILE.doj}</span>
                <span className="hidden sm:inline">|</span>
                <span>Reports to {PROFILE.reportingTo}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 self-start border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500 sm:self-auto">Active</Badge>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    if (a.id === "payslip") setPaySlipOpen(true)
                    if (a.id === "attendance") setAttendanceOpen(true)
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-card/80"
                >
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", a.color.replace("text-", "bg-").replace("500", "500/10"))}>
                    <Icon className={cn("size-5", a.color)} />
                  </div>
                  <span className="text-center text-xs font-semibold text-foreground">{a.label}</span>
                  <span className="text-center text-[10px] text-muted-foreground">{a.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Two Column Grid: Leave + Payroll */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Leave Balance */}
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Leave Balance</p>
              <Badge variant="outline" className="text-[10px] border-border/30">FY 2025-26</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {LEAVE_BAL.map(l => {
                const remaining = l.total - l.used - l.pending
                const pct = (l.used / l.total) * 100
                return (
                  <div key={l.type} className="flex flex-col gap-1.5 rounded-xl border border-border/30 bg-background/30 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{l.type}</span>
                      <span className="text-xs font-bold text-foreground">{remaining}<span className="font-normal text-muted-foreground">/{l.total}</span></span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border/30">
                      <div className={cn("h-full rounded-full", l.color.replace("text-", "bg-"))} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70">
                      <span>Used: {l.used}</span>
                      {l.pending > 0 && <span className="text-amber-500">Pending: {l.pending}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payroll Summary */}
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent Payroll</p>
              <button onClick={() => setPaySlipOpen(true)} className="text-[10px] font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {PAY_SLIPS.slice(0, 3).map(p => (
                <div key={p.month} className="flex items-center justify-between rounded-xl border border-border/30 bg-background/30 p-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">{p.month}</p>
                    <p className="text-[10px] text-muted-foreground">Gross: Rs.{p.gross.toLocaleString("en-IN")} | Ded: Rs.{p.deductions.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-emerald-500">Rs.{p.net.toLocaleString("en-IN")}</span>
                    <button className="rounded-md p-1 hover:bg-accent"><Download className="size-3.5 text-muted-foreground" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">This Week Attendance</p>
            <button onClick={() => setAttendanceOpen(true)} className="text-[10px] font-medium text-primary hover:underline">Full Log</button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
              const entry = ATTENDANCE_LOG[i]
              const st = entry ? ATT_STATUS_CFG[entry.status] : null
              return (
                <div key={d} className="flex flex-col items-center gap-1 rounded-xl border border-border/30 bg-background/30 py-2 sm:py-3">
                  <span className="text-[10px] text-muted-foreground">{d}</span>
                  {st ? (
                    <div className={cn("size-3 rounded-full sm:size-4", st.cls.split(" ")[1])} title={st.label} />
                  ) : (
                    <div className="size-3 rounded-full bg-border/30 sm:size-4" />
                  )}
                  <span className="text-[8px] text-muted-foreground sm:text-[10px]">{entry?.in !== "-" ? entry?.in : ""}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Announcements */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Announcements</p>
          <div className="flex flex-col gap-2">
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/30 px-3 py-2.5">
                <div className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  a.type === "event" ? "bg-violet-500/10" : a.type === "payroll" ? "bg-emerald-500/10" : "bg-sky-500/10"
                )}>
                  {a.type === "event" ? <Calendar className="size-4 text-violet-500" /> : a.type === "payroll" ? <CreditCard className="size-4 text-emerald-500" /> : <AlertTriangle className="size-4 text-sky-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pay Slip Detail Sheet */}
      <Sheet open={paySlipOpen} onOpenChange={setPaySlipOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="size-5 text-emerald-500" />Pay Slips
              </SheetTitle>
              <button onClick={() => setPaySlipOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {PAY_SLIPS.map(p => (
                  <div key={p.month} className="rounded-2xl border border-border/30 bg-background/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-foreground">{p.month}</p>
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">Paid</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div><p className="text-[10px] text-muted-foreground">Gross</p><p className="text-sm font-bold text-foreground">Rs.{p.gross.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-[10px] text-muted-foreground">Deductions</p><p className="text-sm font-bold text-red-500">Rs.{p.deductions.toLocaleString("en-IN")}</p></div>
                      <div><p className="text-[10px] text-muted-foreground">Net Pay</p><p className="text-sm font-bold text-emerald-500">Rs.{p.net.toLocaleString("en-IN")}</p></div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-1.5 border-border/50 text-xs">
                      <Download className="size-3" />Download PDF
                    </Button>
                    <p className="mt-2 text-[10px] text-muted-foreground/50">Generated by: Payroll System on 1st of month</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Attendance Log Sheet */}
      <Sheet open={attendanceOpen} onOpenChange={setAttendanceOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="size-5 text-amber-500" />Attendance Log
              </SheetTitle>
              <button onClick={() => setAttendanceOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                {ATTENDANCE_LOG.map(a => {
                  const st = ATT_STATUS_CFG[a.status]
                  return (
                    <div key={a.date} className="flex items-center justify-between rounded-xl border border-border/30 bg-background/30 px-3 py-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge variant="outline" className={cn("text-[10px] shrink-0", st.cls)}>{st.label}</Badge>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground">{a.date}</p>
                          {a.in !== "-" && <p className="text-[10px] text-muted-foreground">{a.in} - {a.out}</p>}
                        </div>
                      </div>
                      {a.hours !== "-" && <span className="shrink-0 text-xs font-medium text-foreground">{a.hours}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}
