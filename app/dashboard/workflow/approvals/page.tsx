"use client"

import { useState } from "react"
import {
  Inbox, CheckCircle, XCircle, Clock, ChevronRight,
  Search, Filter, Calendar, X, UserCheck, AlertTriangle,
  MessageSquare, Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─── */
type Urgency = "normal" | "urgent" | "overdue"

interface Approval {
  id: string
  title: string
  requester: string
  requesterRole: string
  type: string
  submittedAt: string
  urgency: Urgency
  description: string
  sla: string
}

const URGENCY_CFG: Record<Urgency, { label: string; cls: string }> = {
  normal:  { label: "Normal",  cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" },
  urgent:  { label: "Urgent",  cls: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  overdue: { label: "Overdue", cls: "border-red-500/30 bg-red-500/10 text-red-500" },
}

const SEED: Approval[] = [
  { id: "a-1", title: "Casual Leave - 3 Days", requester: "Ravi Sharma", requesterRole: "BDE - Field Sales", type: "Leave", submittedAt: "2026-03-01", urgency: "urgent", description: "Family function in Jaipur, 10-12 Mar. Backup assigned to Mohit.", sla: "24h remaining" },
  { id: "a-2", title: "Laptop Replacement", requester: "Neha Gupta", requesterRole: "Computer Lab Incharge", type: "Asset", submittedAt: "2026-02-28", urgency: "overdue", description: "Laptop keyboard non-functional since 2 weeks. Impacting lab classes.", sla: "Overdue by 2d" },
  { id: "a-3", title: "Medical Reimbursement - Rs.2,500", requester: "Priya Singh", requesterRole: "Math Teacher - Grade 6", type: "Reimbursement", submittedAt: "2026-03-02", urgency: "normal", description: "OPD eye checkup. Bills attached.", sla: "3 days remaining" },
  { id: "a-4", title: "Salary Certificate Request", requester: "Amit Yadav", requesterRole: "Sports Coach", type: "Document", submittedAt: "2026-03-03", urgency: "normal", description: "Needs salary certificate for home loan application.", sla: "5 days remaining" },
  { id: "a-5", title: "Sick Leave - 2 Days", requester: "Sunita Devi", requesterRole: "Hindi Teacher - Grade 9", type: "Leave", submittedAt: "2026-03-04", urgency: "urgent", description: "Diagnosed with viral fever. Doctor's note attached.", sla: "12h remaining" },
]

export default function ApprovalInboxPage() {
  const [search, setSearch] = useState("")
  const [urgFilter, setUrgFilter] = useState<Urgency | "all">("all")
  const [selected, setSelected] = useState<Approval | null>(null)
  const [comment, setComment] = useState("")

  const filtered = SEED.filter(a => {
    if (urgFilter !== "all" && a.urgency !== urgFilter) return false
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.requester.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const overdue = SEED.filter(a => a.urgency === "overdue").length
  const urgent = SEED.filter(a => a.urgency === "urgent").length

  return (
    <DashboardShell>
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        {/* Header */}
        <div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Approval Inbox</h1>
          <p className="text-xs text-muted-foreground">
            {SEED.length} pending approvals
            {overdue > 0 && <span className="ml-1.5 text-red-500 font-medium">{overdue} overdue</span>}
            {urgent > 0 && <span className="ml-1.5 text-amber-500 font-medium">{urgent} urgent</span>}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
            <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10"><AlertTriangle className="size-4 text-red-500" /></div>
            <div><p className="text-lg font-bold text-foreground">{overdue}</p><p className="text-[10px] text-muted-foreground">Overdue</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10"><Clock className="size-4 text-amber-500" /></div>
            <div><p className="text-lg font-bold text-foreground">{urgent}</p><p className="text-[10px] text-muted-foreground">Urgent</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10"><Inbox className="size-4 text-sky-500" /></div>
            <div><p className="text-lg font-bold text-foreground">{SEED.length}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
          </div>
        </div>

        {/* Search + Urgency filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or title..."
              className="w-full rounded-xl border border-border/50 bg-background/80 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", "overdue", "urgent", "normal"] as const).map(u => (
              <button
                key={u}
                onClick={() => setUrgFilter(u)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all",
                  urgFilter === u ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
              >
                {u === "all" ? "All" : u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Approval Cards */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <CheckCircle className="size-10 text-emerald-500/30" />
              <p className="text-sm text-muted-foreground">All caught up! No pending approvals.</p>
            </div>
          )}
          {filtered.map(a => {
            const urg = URGENCY_CFG[a.urgency]
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={cn(
                  "group flex flex-col gap-3 rounded-2xl border bg-card/60 p-4 text-left shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:bg-card/80 sm:flex-row sm:items-center sm:justify-between",
                  a.urgency === "overdue" ? "border-red-500/30" : a.urgency === "urgent" ? "border-amber-500/30" : "border-border/40"
                )}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Avatar */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {a.requester.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
                      <Badge variant="outline" className={cn("text-[10px] shrink-0", urg.cls)}>{urg.label}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.requester} <span className="text-muted-foreground/50">({a.requesterRole})</span></p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground/70">
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{a.submittedAt}</span>
                      <span>{a.type}</span>
                      <span className={cn(a.urgency === "overdue" ? "text-red-500" : "text-muted-foreground/70")}>{a.sla}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground/50">Requested by: {a.requester} on {a.submittedAt}</p>
                  </div>
                </div>
                <ChevronRight className="hidden size-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary sm:block" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Approval Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[500px] sm:!max-w-[500px] p-0 overflow-hidden [&>button]:hidden">
          {selected && (() => {
            const urg = URGENCY_CFG[selected.urgency]
            return (
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <UserCheck className="size-5 text-primary" />Review Request
                  </SheetTitle>
                  <button onClick={() => setSelected(null)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-4">
                    {/* Title + urgency */}
                    <div className="rounded-2xl border border-border/30 bg-background/30 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <p className="text-base font-bold text-foreground">{selected.title}</p>
                        <Badge variant="outline" className={cn("text-[10px]", urg.cls)}>{urg.label} - {selected.sla}</Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">{selected.description}</p>
                    </div>

                    {/* Requester info */}
                    <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-background/30 p-4">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {selected.requester.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{selected.requester}</p>
                        <p className="text-xs text-muted-foreground">{selected.requesterRole}</p>
                        <p className="text-[10px] text-muted-foreground/50">Submitted {selected.submittedAt}</p>
                      </div>
                    </div>

                    {/* Info chips */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { l: "Request Type", v: selected.type },
                        { l: "SLA", v: selected.sla },
                      ].map(r => (
                        <div key={r.l} className="rounded-xl border border-border/30 bg-background/30 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.l}</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{r.v}</p>
                        </div>
                      ))}
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Approval Comment</label>
                      <div className="relative">
                        <textarea
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          rows={3}
                          placeholder="Add a comment (optional)..."
                          className="w-full rounded-xl border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground/50">Requested by: {selected.requester} on {selected.submittedAt}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
                  <Button variant="outline" size="sm" onClick={() => setSelected(null)} className="border-red-500/30 text-red-500 hover:bg-red-500/10 gap-1 text-xs">
                    <XCircle className="size-3.5" />Reject
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(null)} className="border-border/50 text-xs">Defer</Button>
                    <Button size="sm" onClick={() => setSelected(null)} className="gap-1 text-xs shadow-md shadow-primary/20">
                      <CheckCircle className="size-3.5" />Approve
                    </Button>
                  </div>
                </div>
              </div>
            )
          })()}
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}
