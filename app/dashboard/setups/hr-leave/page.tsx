"use client"

import { useState } from "react"
import { ScrollText, Plus, X, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─────────────────────────────────── */

type ExceptionAction = "reject" | "lop" | "deduct-next" | "no-deduction"

interface LeavePolicy {
  id: string
  name: string
  code: string
  annualQuota: number
  accrual: "monthly" | "quarterly" | "yearly"
  carryForward: boolean
  maxCarry: number
  exceptionAction: ExceptionAction
  createdBy: string
  createdAt: string
}

const EXCEPTION_LABELS: Record<ExceptionAction, { label: string; color: string; desc: string }> = {
  reject: { label: "Enforce Rejection", color: "red", desc: "Request is auto-rejected when balance is insufficient" },
  lop: { label: "Allow LOP / Salary Cut", color: "amber", desc: "Allow with Loss of Pay deduction from salary" },
  "deduct-next": { label: "Deduct from Next Month", color: "sky", desc: "Approved but deducted from next month balance" },
  "no-deduction": { label: "No Deduction (Exceptional)", color: "violet", desc: "Approved without any deduction - requires admin approval" },
}

const SEED: LeavePolicy[] = [
  { id: "lp1", name: "Sick Leave", code: "SL", annualQuota: 12, accrual: "monthly", carryForward: false, maxCarry: 0, exceptionAction: "lop", createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "lp2", name: "Casual Leave", code: "CL", annualQuota: 12, accrual: "monthly", carryForward: false, maxCarry: 0, exceptionAction: "reject", createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "lp3", name: "Earned Leave", code: "EL", annualQuota: 15, accrual: "quarterly", carryForward: true, maxCarry: 30, exceptionAction: "deduct-next", createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "lp4", name: "Maternity Leave", code: "ML", annualQuota: 180, accrual: "yearly", carryForward: false, maxCarry: 0, exceptionAction: "no-deduction", createdBy: "HR Manager", createdAt: "2026-01-10" },
  { id: "lp5", name: "Paternity Leave", code: "PL", annualQuota: 15, accrual: "yearly", carryForward: false, maxCarry: 0, exceptionAction: "no-deduction", createdBy: "HR Manager", createdAt: "2026-01-10" },
]

/* ── Page ──────────────────────────────────── */

export default function LeaveRulesPage() {
  const [policies, setPolicies] = useState<LeavePolicy[]>(SEED)
  const [sheetOpen, setSheetOpen] = useState(false)

  const [fName, setFName] = useState("")
  const [fCode, setFCode] = useState("")
  const [fQuota, setFQuota] = useState(12)
  const [fAccrual, setFAccrual] = useState<LeavePolicy["accrual"]>("monthly")
  const [fCarry, setFCarry] = useState(false)
  const [fMaxCarry, setFMaxCarry] = useState(0)
  const [fException, setFException] = useState<ExceptionAction>("reject")

  function handleSave() {
    if (!fName.trim() || !fCode.trim()) return
    setPolicies(prev => [...prev, {
      id: `lp-${Date.now()}`, name: fName.trim(), code: fCode.trim().toUpperCase(), annualQuota: fQuota, accrual: fAccrual, carryForward: fCarry, maxCarry: fCarry ? fMaxCarry : 0, exceptionAction: fException, createdBy: "Current User", createdAt: new Date().toISOString().slice(0, 10),
    }])
    setSheetOpen(false)
    setFName(""); setFCode("")
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">Leave & Exception Rules</h1>
            <p className="text-xs text-muted-foreground">{policies.length} leave policies configured</p>
          </div>
          <Button size="sm" onClick={() => { setFName(""); setFCode(""); setSheetOpen(true) }} className="gap-1.5 self-start shadow-md shadow-primary/20 sm:self-auto">
            <Plus className="size-3.5" />Add Policy
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["reject", "lop", "deduct-next", "no-deduction"] as const).map(act => {
            const count = policies.filter(p => p.exceptionAction === act).length
            const cfg = EXCEPTION_LABELS[act]
            return (
              <div key={act} className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
                <p className={cn("text-lg font-bold sm:text-2xl",
                  cfg.color === "red" ? "text-red-500" : cfg.color === "amber" ? "text-amber-500" : cfg.color === "sky" ? "text-sky-500" : "text-violet-500"
                )}>{count}</p>
                <p className="text-[10px] text-muted-foreground leading-tight sm:text-[11px]">{cfg.label}</p>
              </div>
            )
          })}
        </div>

        {/* Policy List */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">All Leave Policies</p>
          <div className="flex flex-col gap-2">
            {policies.map(p => {
              const exc = EXCEPTION_LABELS[p.exceptionAction]
              return (
                <div key={p.id} className="rounded-xl border border-border/30 bg-background/30 px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">{p.code}</div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.annualQuota} days/year &middot; {p.accrual} accrual</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0">
                      {p.carryForward && (
                        <Badge variant="outline" className="border-emerald-500/30 text-[10px] text-emerald-500">
                          <ShieldCheck className="mr-1 size-2.5" />Carry {p.maxCarry}d
                        </Badge>
                      )}
                      <Badge variant="outline" className={cn("text-[10px]",
                        exc.color === "red" ? "border-red-500/30 text-red-500" : exc.color === "amber" ? "border-amber-500/30 text-amber-500" : exc.color === "sky" ? "border-sky-500/30 text-sky-500" : "border-violet-500/30 text-violet-500"
                      )}>
                        <ShieldAlert className="mr-1 size-2.5" />{exc.label}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground/60">Created by {p.createdBy} on {p.createdAt}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Policy Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ScrollText className="size-4 text-primary" />Add Leave Policy
              </SheetTitle>
              <button onClick={() => setSheetOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Leave Name *</label>
                    <input value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. Sick Leave" className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Code *</label>
                    <input value={fCode} onChange={e => setFCode(e.target.value)} placeholder="SL" className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Annual Quota (Days)</label>
                    <input type="number" value={fQuota} onChange={e => setFQuota(Number(e.target.value))} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Accrual Frequency</label>
                    <select value={fAccrual} onChange={e => setFAccrual(e.target.value as LeavePolicy["accrual"])} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30">
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                {/* Carry Forward */}
                <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/30 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-foreground">Carry Forward</p>
                    <p className="text-[10px] text-muted-foreground">Allow unused leaves to carry to next year</p>
                  </div>
                  <button onClick={() => setFCarry(v => !v)} className={cn("relative h-5 w-9 rounded-full transition-colors", fCarry ? "bg-primary" : "bg-muted")}>
                    <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform", fCarry ? "left-[18px]" : "left-0.5")} />
                  </button>
                </div>
                {fCarry && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Max Carry Days</label>
                    <input type="number" value={fMaxCarry} onChange={e => setFMaxCarry(Number(e.target.value))} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                )}

                {/* Exception Action */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <AlertTriangle className="size-3" />Exception Action (when balance exceeded)
                  </label>
                  <div className="flex flex-col gap-2">
                    {(Object.keys(EXCEPTION_LABELS) as ExceptionAction[]).map(act => {
                      const cfg = EXCEPTION_LABELS[act]
                      return (
                        <button key={act} onClick={() => setFException(act)} className={cn(
                          "flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-all",
                          fException === act ? "border-primary/40 bg-primary/10" : "border-border/40 bg-background/30 hover:border-primary/20"
                        )}>
                          <span className={cn("text-xs font-medium",
                            fException === act ? "text-primary" : "text-foreground"
                          )}>{cfg.label}</span>
                          <span className="text-[10px] text-muted-foreground">{cfg.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
              <Button variant="outline" size="sm" onClick={() => setSheetOpen(false)} className="border-border/50">Cancel</Button>
              <Button size="sm" onClick={handleSave} className="shadow-md shadow-primary/20">Save Policy</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}
