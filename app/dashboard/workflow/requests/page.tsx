"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  GitPullRequest, Plus, Search, Filter, Clock, CheckCircle, XCircle,
  AlertTriangle, ChevronRight, Calendar, X, Send, FileText, CreditCard,
  Briefcase, UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─── */
type ReqStatus = "pending" | "approved" | "rejected" | "in-review"
type ReqType = "leave" | "reimbursement" | "asset" | "onboarding" | "document"

interface Request {
  id: string
  type: ReqType
  title: string
  status: ReqStatus
  submittedAt: string
  updatedAt: string
  approver: string
  description: string
  currentStep: number
  totalSteps: number
}

const TYPE_CFG: Record<ReqType, { label: string; icon: typeof FileText; color: string }> = {
  leave:         { label: "Leave",         icon: Calendar,   color: "text-sky-500" },
  reimbursement: { label: "Reimbursement", icon: CreditCard, color: "text-emerald-500" },
  asset:         { label: "Asset Request", icon: Briefcase,  color: "text-amber-500" },
  onboarding:    { label: "Onboarding",    icon: UserPlus,   color: "text-violet-500" },
  document:      { label: "Document",      icon: FileText,   color: "text-primary" },
}

const STATUS_CFG: Record<ReqStatus, { label: string; cls: string }> = {
  pending:   { label: "Pending",   cls: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  approved:  { label: "Approved",  cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" },
  rejected:  { label: "Rejected",  cls: "border-red-500/30 bg-red-500/10 text-red-500" },
  "in-review": { label: "In Review", cls: "border-sky-500/30 bg-sky-500/10 text-sky-500" },
}

const SEED: Request[] = [
  { id: "r-1", type: "leave", title: "Casual Leave - 3 Days", status: "pending", submittedAt: "2026-03-01", updatedAt: "2026-03-01", approver: "Mrs. Sunita Verma", description: "Family function in Jaipur from 10 Mar to 12 Mar.", currentStep: 1, totalSteps: 3 },
  { id: "r-2", type: "reimbursement", title: "Travel Reimbursement - Field Visit", status: "approved", submittedAt: "2026-02-20", updatedAt: "2026-02-25", approver: "Mr. R.K. Sharma", description: "Visited 3 feeder schools. Bus + auto expenses.", currentStep: 3, totalSteps: 3 },
  { id: "r-3", type: "asset", title: "Laptop Replacement Request", status: "in-review", submittedAt: "2026-02-28", updatedAt: "2026-03-02", approver: "IT Admin", description: "Current laptop keyboard malfunctioning. Need replacement.", currentStep: 2, totalSteps: 4 },
  { id: "r-4", type: "leave", title: "Sick Leave - 1 Day", status: "rejected", submittedAt: "2026-02-15", updatedAt: "2026-02-16", approver: "Mrs. Sunita Verma", description: "Fever and cold. Visited doctor.", currentStep: 2, totalSteps: 3 },
  { id: "r-5", type: "document", title: "Salary Certificate Request", status: "approved", submittedAt: "2026-02-10", updatedAt: "2026-02-12", approver: "HR Admin", description: "Needed for home loan application.", currentStep: 3, totalSteps: 3 },
  { id: "r-6", type: "reimbursement", title: "Medical Reimbursement - OPD", status: "pending", submittedAt: "2026-03-03", updatedAt: "2026-03-03", approver: "Mrs. Sunita Verma", description: "OPD visit for eye checkup.", currentStep: 1, totalSteps: 3 },
]

/* ── STAT CARDS ─── */
function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: typeof Clock; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl sm:p-4">
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10", accent.replace("text-", "bg-").replace("500", "500/10"))}>
        <Icon className={cn("size-4 sm:size-5", accent)} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-foreground sm:text-xl">{value}</p>
        <p className="truncate text-[10px] text-muted-foreground sm:text-xs">{label}</p>
      </div>
    </div>
  )
}

/* ── MAIN PAGE ─── */
export default function MyRequestsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ReqStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<ReqType | "all">("all")
  const [detailReq, setDetailReq] = useState<Request | null>(null)
  const [newOpen, setNewOpen] = useState(false)

  const filtered = SEED.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false
    if (typeFilter !== "all" && r.type !== typeFilter) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const pending = SEED.filter(r => r.status === "pending").length
  const inReview = SEED.filter(r => r.status === "in-review").length
  const approved = SEED.filter(r => r.status === "approved").length

  return (
    <DashboardShell>
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">My Requests</h1>
            <p className="text-xs text-muted-foreground">Track all your submitted workflow requests</p>
          </div>
          <Button size="sm" onClick={() => setNewOpen(true)} className="gap-1.5 self-start shadow-md shadow-primary/20 text-xs sm:self-auto">
            <Plus className="size-3.5" />New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Pending" value={pending} icon={Clock} accent="text-amber-500" />
          <StatCard label="In Review" value={inReview} icon={AlertTriangle} accent="text-sky-500" />
          <StatCard label="Approved" value={approved} icon={CheckCircle} accent="text-emerald-500" />
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="w-full rounded-xl border border-border/50 bg-background/80 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "pending", "in-review", "approved", "rejected"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all",
                  statusFilter === s ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
              >
                {s === "all" ? "All" : s === "in-review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...Object.keys(TYPE_CFG)] as (ReqType | "all")[]).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all",
                typeFilter === t ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              )}
            >
              {t !== "all" && (() => { const I = TYPE_CFG[t].icon; return <I className="size-3" /> })()}
              {t === "all" ? "All Types" : TYPE_CFG[t].label}
            </button>
          ))}
        </div>

        {/* Request Cards */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <GitPullRequest className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No requests found</p>
            </div>
          )}
          {filtered.map(r => {
            const cfg = TYPE_CFG[r.type]
            const stCfg = STATUS_CFG[r.status]
            const Icon = cfg.icon
            return (
              <button
                key={r.id}
                onClick={() => setDetailReq(r)}
                className="group flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-card/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", cfg.color.replace("text-", "bg-").replace("500", "500/10"))}>
                    <Icon className={cn("size-5", cfg.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{r.title}</p>
                      <Badge variant="outline" className={cn("text-[10px] shrink-0", stCfg.cls)}>{stCfg.label}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground/70">
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{r.submittedAt}</span>
                      <span>Approver: {r.approver}</span>
                    </div>
                    {/* Audit footer */}
                    <p className="mt-1 text-[10px] text-muted-foreground/50">Submitted by: You on {r.submittedAt}</p>
                  </div>
                </div>
                {/* Progress mini */}
                <div className="flex items-center gap-3 shrink-0 sm:flex-col sm:items-end sm:gap-1.5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.totalSteps }).map((_, i) => (
                      <div key={i} className={cn("h-1.5 w-5 rounded-full sm:w-4", i < r.currentStep ? "bg-primary" : "bg-border/40")} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Step {r.currentStep}/{r.totalSteps}</span>
                  <ChevronRight className="hidden size-4 text-muted-foreground/30 transition-colors group-hover:text-primary sm:block" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!detailReq} onOpenChange={v => !v && setDetailReq(null)}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] p-0 overflow-hidden [&>button]:hidden">
          {detailReq && (() => {
            const cfg = TYPE_CFG[detailReq.type]
            const stCfg = STATUS_CFG[detailReq.status]
            const Icon = cfg.icon
            return (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className={cn("size-5", cfg.color)} />{detailReq.title}
                  </SheetTitle>
                  <button onClick={() => setDetailReq(null)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-4">
                    {/* Status + Progress */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={cn("text-xs", stCfg.cls)}>{stCfg.label}</Badge>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: detailReq.totalSteps }).map((_, i) => (
                          <div key={i} className={cn("h-2 w-8 rounded-full", i < detailReq.currentStep ? "bg-primary" : "bg-border/40")} />
                        ))}
                      </div>
                    </div>
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { l: "Type", v: cfg.label },
                        { l: "Approver", v: detailReq.approver },
                        { l: "Submitted", v: detailReq.submittedAt },
                        { l: "Updated", v: detailReq.updatedAt },
                      ].map(r => (
                        <div key={r.l} className="rounded-xl border border-border/30 bg-background/30 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.l}</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{r.v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-border/30 bg-background/30 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{detailReq.description}</p>
                    </div>
                    {/* Workflow trail */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Workflow Trail</p>
                      {["Request Submitted", "Manager Review", "HR Approval", "Finance Clearance"].slice(0, detailReq.totalSteps).map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                            i < detailReq.currentStep ? "border-emerald-500 bg-emerald-500 text-white" :
                            i === detailReq.currentStep ? "border-primary bg-primary text-primary-foreground" :
                            "border-border/50 bg-muted/30 text-muted-foreground"
                          )}>
                            {i < detailReq.currentStep ? <CheckCircle className="size-3.5" /> : i + 1}
                          </div>
                          <span className={cn("text-sm", i < detailReq.currentStep ? "text-emerald-500" : i === detailReq.currentStep ? "font-semibold text-foreground" : "text-muted-foreground")}>{step}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground/50">Requested by: You on {detailReq.submittedAt}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
                  {detailReq.status === "pending" && (
                    <Button variant="outline" size="sm" className="border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs">Withdraw</Button>
                  )}
                  <Button size="sm" onClick={() => setDetailReq(null)} className="text-xs shadow-md shadow-primary/20">Close</Button>
                </div>
              </div>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* New Request Sheet (placeholder) */}
      <Sheet open={newOpen} onOpenChange={setNewOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[90vw] sm:!max-w-[90vw] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Plus className="size-5 text-primary" />New Request
              </SheetTitle>
              <button onClick={() => setNewOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-4 text-xs text-muted-foreground">Select request type to begin:</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(TYPE_CFG).map(([key, cfg]) => {
                  const Icon = cfg.icon
                  return (
                    <button key={key} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-card/80">
                      <div className={cn("flex size-10 items-center justify-center rounded-xl", cfg.color.replace("text-", "bg-").replace("500", "500/10"))}>
                        <Icon className={cn("size-5", cfg.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{cfg.label}</p>
                        <p className="text-[11px] text-muted-foreground">Submit a new {cfg.label.toLowerCase()} request</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
              <Button variant="outline" size="sm" onClick={() => setNewOpen(false)} className="border-border/50 text-xs">Cancel</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}
