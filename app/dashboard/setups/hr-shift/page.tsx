"use client"

import { useState } from "react"
import { Clock, Plus, X, Briefcase, Sun, Moon, Settings, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─────────────────────────────────── */

interface EmploymentType {
  id: string
  name: string
  icon: "briefcase" | "sun" | "moon"
  shiftRequired: boolean
  color: string
}

interface ShiftBlock {
  id: string
  name: string
  start: string
  end: string
  type: "first-half" | "second-half" | "custom"
  createdBy: string
  createdAt: string
}

const EMP_TYPES: EmploymentType[] = [
  { id: "full-time", name: "Full-Time", icon: "briefcase", shiftRequired: false, color: "emerald" },
  { id: "part-time", name: "Part-Time", icon: "sun", shiftRequired: true, color: "amber" },
  { id: "internship", name: "Internship", icon: "moon", shiftRequired: true, color: "sky" },
]

const SEED_SHIFTS: ShiftBlock[] = [
  { id: "s1", name: "First Half", start: "08:00", end: "12:00", type: "first-half", createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "s2", name: "Second Half", start: "12:00", end: "16:00", type: "second-half", createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "s3", name: "Full Day", start: "08:00", end: "16:00", type: "custom", createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "s4", name: "Extended Morning", start: "07:00", end: "13:00", type: "custom", createdBy: "HR Manager", createdAt: "2026-01-15" },
]

const ICONS: Record<string, typeof Briefcase> = { briefcase: Briefcase, sun: Sun, moon: Moon }

/* ── Page ──────────────────────────────────── */

export default function ShiftEmploymentPage() {
  const [shifts, setShifts] = useState<ShiftBlock[]>(SEED_SHIFTS)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [fName, setFName] = useState("")
  const [fStart, setFStart] = useState("08:00")
  const [fEnd, setFEnd] = useState("12:00")
  const [fType, setFType] = useState<ShiftBlock["type"]>("first-half")

  function openAdd() {
    setEditId(null)
    setFName("")
    setFStart("08:00")
    setFEnd("12:00")
    setFType("first-half")
    setSheetOpen(true)
  }

  function openEdit(s: ShiftBlock) {
    setEditId(s.id)
    setFName(s.name)
    setFStart(s.start)
    setFEnd(s.end)
    setFType(s.type)
    setSheetOpen(true)
  }

  function handleSave() {
    if (!fName.trim()) return
    if (editId) {
      setShifts(prev => prev.map(s => s.id === editId ? {
        ...s, name: fName.trim(), start: fStart, end: fEnd, type: fType,
      } : s))
    } else {
      setShifts(prev => [...prev, {
        id: `s-${Date.now()}`, name: fName.trim(), start: fStart, end: fEnd, type: fType,
        createdBy: "Current User", createdAt: new Date().toISOString().slice(0, 10),
      }])
    }
    setSheetOpen(false)
  }

  function handleDelete(id: string) {
    setShifts(prev => prev.filter(s => s.id !== id))
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">Shift & Employment Master</h1>
            <p className="text-xs text-muted-foreground">Configure employment types and define shift blocks</p>
          </div>
          <Button size="sm" onClick={openAdd} className="gap-1.5 self-start shadow-md shadow-primary/20 sm:self-auto">
            <Plus className="size-3.5" />Add Shift
          </Button>
        </div>

        {/* Employment Type Cards */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employment Types</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {EMP_TYPES.map(t => {
              const Icon = ICONS[t.icon]
              return (
                <div key={t.id} className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex size-10 items-center justify-center rounded-xl",
                      t.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : t.color === "amber" ? "bg-amber-500/10 text-amber-500" : "bg-sky-500/10 text-sky-500"
                    )}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.shiftRequired ? "Shift timing required" : "Standard full-day schedule"}</p>
                    </div>
                  </div>
                  {t.shiftRequired && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {shifts.map(s => (
                        <Badge key={s.id} variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{s.name}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Shift Blocks */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shift Blocks ({shifts.length})</p>
          <div className="flex flex-col gap-2">
            {shifts.map(s => (
              <div key={s.id} className="flex flex-col gap-1.5 rounded-xl border border-border/30 bg-background/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">{s.start} - {s.end}</p>
                  </div>
                  <Badge variant="outline" className={cn("shrink-0 text-[10px]",
                    s.type === "first-half" ? "border-amber-500/30 text-amber-500" : s.type === "second-half" ? "border-sky-500/30 text-sky-500" : "border-violet-500/30 text-violet-500"
                  )}>
                    {s.type === "first-half" ? "First Half" : s.type === "second-half" ? "Second Half" : "Custom"}
                  </Badge>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => openEdit(s)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                      <Pencil className="size-3.5" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <p className="pl-12 text-[10px] text-muted-foreground/60">Created by {s.createdBy} on {s.createdAt}</p>
              </div>
            ))}
            {shifts.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Clock className="size-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">No shift blocks defined</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Shift Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[420px] sm:!max-w-[420px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {editId ? <Pencil className="size-4 text-primary" /> : <Settings className="size-4 text-primary" />}
                {editId ? "Edit Shift" : "Add Shift Block"}
              </SheetTitle>
              <button onClick={() => setSheetOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shift Name *</label>
                  <input value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. Morning Shift" className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shift Type</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {(["first-half", "second-half", "custom"] as const).map(t => (
                      <button key={t} onClick={() => {
                        setFType(t)
                        if (t === "first-half") { setFStart("08:00"); setFEnd("12:00") }
                        if (t === "second-half") { setFStart("12:00"); setFEnd("16:00") }
                      }} className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        fType === t ? "border-primary/40 bg-primary/10 text-primary" : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/20"
                      )}>
                        {t === "first-half" ? "First Half" : t === "second-half" ? "Second Half" : "Custom Range"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Start Time</label>
                    <input type="time" value={fStart} onChange={e => setFStart(e.target.value)} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">End Time</label>
                    <input type="time" value={fEnd} onChange={e => setFEnd(e.target.value)} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  </div>
                </div>

                {editId && (
                  <button
                    onClick={() => { handleDelete(editId); setSheetOpen(false) }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 py-2.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3.5" />Delete this Shift
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
              <Button variant="outline" size="sm" onClick={() => setSheetOpen(false)} className="border-border/50">Cancel</Button>
              <Button size="sm" onClick={handleSave} className="shadow-md shadow-primary/20">{editId ? "Update" : "Save"}</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}
