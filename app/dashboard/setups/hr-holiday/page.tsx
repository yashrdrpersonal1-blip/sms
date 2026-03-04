"use client"

import { useState } from "react"
import {
  CalendarDays, Plus, X, ChevronLeft, ChevronRight,
  Globe, BookOpen, UserCheck, Trash2, Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet, SheetContent, SheetTitle,
} from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─────────────────────────────────── */

type HolidayType = "gazetted" | "restricted" | "school-specific"

interface HolidayEvent {
  id: string
  date: string
  name: string
  type: HolidayType
  scope: "global" | "class-specific"
  classes: string[]
  teacherAligned: boolean
  createdBy: string
  createdAt: string
}

const TYPE_CFG: Record<HolidayType, { label: string; cls: string }> = {
  gazetted:         { label: "Gazetted",         cls: "border-sky-500/30 bg-sky-500/10 text-sky-500" },
  restricted:       { label: "Restricted",       cls: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  "school-specific": { label: "School Specific", cls: "border-violet-500/30 bg-violet-500/10 text-violet-500" },
}

const SESSIONS = ["2025-26", "2026-27", "2027-28"]

const SEED: HolidayEvent[] = [
  { id: "h1", date: "2026-04-14", name: "Ambedkar Jayanti", type: "gazetted", scope: "global", classes: [], teacherAligned: true, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h2", date: "2026-05-01", name: "May Day", type: "gazetted", scope: "global", classes: [], teacherAligned: false, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h3", date: "2026-08-15", name: "Independence Day", type: "gazetted", scope: "global", classes: [], teacherAligned: true, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h4", date: "2026-10-02", name: "Gandhi Jayanti", type: "gazetted", scope: "global", classes: [], teacherAligned: true, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h5", date: "2026-10-20", name: "Diwali", type: "gazetted", scope: "global", classes: [], teacherAligned: false, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h6", date: "2026-11-04", name: "Guru Nanak Jayanti", type: "gazetted", scope: "global", classes: [], teacherAligned: false, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h7", date: "2026-12-25", name: "Christmas", type: "gazetted", scope: "global", classes: [], teacherAligned: false, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h8", date: "2027-01-26", name: "Republic Day", type: "gazetted", scope: "global", classes: [], teacherAligned: true, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h9", date: "2027-03-14", name: "Holi", type: "gazetted", scope: "global", classes: [], teacherAligned: false, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h10", date: "2026-06-15", name: "Summer Break Start", type: "school-specific", scope: "global", classes: [], teacherAligned: false, createdBy: "Principal", createdAt: "2026-01-10" },
  { id: "h11", date: "2026-09-05", name: "Teachers Day (Holiday for Teachers)", type: "restricted", scope: "global", classes: [], teacherAligned: true, createdBy: "Admin", createdAt: "2025-12-01" },
  { id: "h12", date: "2026-04-10", name: "Class 10 Board Prep Day Off", type: "school-specific", scope: "class-specific", classes: ["10"], teacherAligned: true, createdBy: "Principal", createdAt: "2026-01-10" },
]

const ALL_CLASSES = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
const MONTHS = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"]

/* ── Helpers ───────────────────────────────── */

function parseSession(s: string) {
  const [startYr] = s.split("-").map(Number)
  return { startYear: startYr, endYear: startYr + 1 }
}

function getMonthYear(monthLabel: string, session: string) {
  const { startYear, endYear } = parseSession(session)
  const mIdx = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(monthLabel)
  return mIdx >= 3 ? { year: startYear, month: mIdx } : { year: endYear, month: mIdx }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

/* ── Page ──────────────────────────────────── */

export default function HolidayCalendarPage() {
  const [holidays, setHolidays] = useState<HolidayEvent[]>(SEED)
  const [session, setSession] = useState("2026-27")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // Form state
  const [fDate, setFDate] = useState("")
  const [fName, setFName] = useState("")
  const [fType, setFType] = useState<HolidayType>("gazetted")
  const [fScope, setFScope] = useState<"global" | "class-specific">("global")
  const [fClasses, setFClasses] = useState<string[]>([])
  const [fTeacherAligned, setFTeacherAligned] = useState(false)

  const { startYear, endYear } = parseSession(session)

  // Filter holidays for current session (Apr startYear - Mar endYear)
  const sessionHolidays = holidays.filter(h => {
    const d = new Date(h.date)
    const m = d.getMonth()
    const y = d.getFullYear()
    return (y === startYear && m >= 3) || (y === endYear && m <= 2)
  })

  const holidaysByDate = sessionHolidays.reduce<Record<string, HolidayEvent[]>>((acc, h) => {
    if (!acc[h.date]) acc[h.date] = []
    acc[h.date].push(h)
    return acc
  }, {})

  function openAddSheet(dateStr: string) {
    setEditId(null)
    setFDate(dateStr)
    setFName("")
    setFType("gazetted")
    setFScope("global")
    setFClasses([])
    setFTeacherAligned(false)
    setSheetOpen(true)
  }

  function openEditSheet(h: HolidayEvent) {
    setEditId(h.id)
    setFDate(h.date)
    setFName(h.name)
    setFType(h.type)
    setFScope(h.scope)
    setFClasses(h.classes)
    setFTeacherAligned(h.teacherAligned)
    setSheetOpen(true)
  }

  function handleSave() {
    if (!fName.trim() || !fDate) return
    if (editId) {
      setHolidays(prev => prev.map(h => h.id === editId ? {
        ...h, date: fDate, name: fName.trim(), type: fType, scope: fScope,
        classes: fScope === "class-specific" ? fClasses : [], teacherAligned: fTeacherAligned,
      } : h))
    } else {
      setHolidays(prev => [...prev, {
        id: `h-${Date.now()}`, date: fDate, name: fName.trim(), type: fType, scope: fScope,
        classes: fScope === "class-specific" ? fClasses : [], teacherAligned: fTeacherAligned,
        createdBy: "Current User", createdAt: new Date().toISOString().slice(0, 10),
      }])
    }
    setSheetOpen(false)
  }

  function handleDelete(id: string) {
    setHolidays(prev => prev.filter(h => h.id !== id))
  }

  function toggleClass(c: string) {
    setFClasses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">Holiday & Calendar Master</h1>
            <p className="text-xs text-muted-foreground">{sessionHolidays.length} holidays for session {session}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Session selector */}
            <select
              value={session}
              onChange={e => setSession(e.target.value)}
              className="rounded-lg border border-border/50 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              {SESSIONS.map(s => <option key={s} value={s}>Session {s}</option>)}
            </select>
          </div>
        </div>

        {/* 12 month mini-calendars (Apr-Mar) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MONTHS.map(monthLabel => {
            const { year, month: monthIdx } = getMonthYear(monthLabel, session)
            const days = getDaysInMonth(year, monthIdx)
            const firstDay = getFirstDayOfMonth(year, monthIdx)
            const cells: (number | null)[] = Array(firstDay).fill(null)
            for (let d = 1; d <= days; d++) cells.push(d)
            const monthKey = `${year}-${String(monthIdx + 1).padStart(2, "0")}`

            return (
              <div key={monthLabel} className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
                <p className="mb-2 text-xs font-semibold text-foreground">{monthLabel} {year}</p>
                <div className="grid grid-cols-7 gap-px text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="pb-1 text-[9px] font-medium text-muted-foreground">{d}</div>
                  ))}
                  {cells.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} />
                    const dateStr = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const events = holidaysByDate[dateStr] || []
                    const hasHoliday = events.length > 0
                    const isSunday = new Date(year, monthIdx, day).getDay() === 0
                    return (
                      <button
                        key={dateStr}
                        onClick={() => hasHoliday ? openEditSheet(events[0]) : openAddSheet(dateStr)}
                        title={events.map(e => e.name).join(", ") || "Click to add"}
                        className={cn(
                          "flex size-7 items-center justify-center rounded-md text-[10px] font-medium transition-all hover:bg-primary/10",
                          hasHoliday && "bg-primary/15 text-primary font-bold ring-1 ring-primary/30",
                          isSunday && !hasHoliday && "text-red-500/60",
                          !hasHoliday && !isSunday && "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
                {/* Events under month */}
                {Object.entries(holidaysByDate)
                  .filter(([d]) => d.startsWith(monthKey))
                  .flatMap(([, evts]) => evts)
                  .map(e => (
                    <button key={e.id} onClick={() => openEditSheet(e)} className="mt-1.5 flex w-full items-center gap-1.5 rounded-md bg-primary/5 px-2 py-1 text-left hover:bg-primary/10 transition-colors">
                      <div className="size-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="flex-1 truncate text-[9px] font-medium text-foreground">{e.name}</span>
                      <Badge variant="outline" className={cn("ml-auto h-3.5 px-1 text-[7px]", TYPE_CFG[e.type].cls)}>{TYPE_CFG[e.type].label.slice(0, 3)}</Badge>
                    </button>
                  ))
                }
              </div>
            )
          })}
        </div>

        {/* Holiday List */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">All Holidays - Session {session} ({sessionHolidays.length})</p>
          <div className="flex flex-col gap-2">
            {sessionHolidays.sort((a, b) => a.date.localeCompare(b.date)).map(h => (
              <div key={h.id} className={cn(
                "flex flex-col gap-2 rounded-xl border bg-background/30 px-4 py-3",
                h.scope === "class-specific" ? "border-amber-500/20" : "border-border/30"
              )}>
                <div className="flex items-start gap-3 sm:items-center">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDays className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{h.name}</p>
                      <Badge variant="outline" className={cn("text-[10px]", TYPE_CFG[h.type].cls)}>{TYPE_CFG[h.type].label}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{h.date}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEditSheet(h)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                      <Pencil className="size-3.5" />
                    </button>
                    <button onClick={() => handleDelete(h.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pl-12">
                  {h.scope === "global" ? (
                    <Badge variant="outline" className="text-[10px] border-sky-500/30 text-sky-500"><Globe className="mr-1 size-2.5" />Global</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500"><BookOpen className="mr-1 size-2.5" />Class {h.classes.join(", ")}</Badge>
                  )}
                  {h.teacherAligned && (
                    <Badge variant="outline" className="border-emerald-500/30 text-[10px] text-emerald-500"><UserCheck className="mr-1 size-2.5" />Teachers Aligned</Badge>
                  )}
                </div>
                <p className="pl-12 text-[10px] text-muted-foreground/60">Created by {h.createdBy} on {h.createdAt}</p>
              </div>
            ))}
            {sessionHolidays.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <CalendarDays className="size-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">No holidays configured for this session</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Holiday Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full border-border/40 bg-card/95 p-0 backdrop-blur-2xl sm:!w-[420px] sm:!max-w-[420px] [&>button]:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <SheetTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {editId ? <Pencil className="size-4 text-primary" /> : <Plus className="size-4 text-primary" />}
                {editId ? "Edit Holiday" : "Add Holiday"}
              </SheetTitle>
              <button onClick={() => setSheetOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date *</label>
                  <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Event Name *</label>
                  <input value={fName} onChange={e => setFName(e.target.value)} placeholder="e.g. Republic Day" className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>

                {/* Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Holiday Type</label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {(["gazetted", "restricted", "school-specific"] as const).map(t => (
                      <button key={t} onClick={() => setFType(t)} className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        fType === t ? "border-primary/40 bg-primary/10 text-primary" : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/20"
                      )}>
                        {TYPE_CFG[t].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scope */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Scope</label>
                  <div className="flex gap-2">
                    {(["global", "class-specific"] as const).map(s => (
                      <button key={s} onClick={() => setFScope(s)} className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        fScope === s ? "border-primary/40 bg-primary/10 text-primary" : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/20"
                      )}>
                        {s === "global" ? "Global" : "Class-Specific"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class picker */}
                {fScope === "class-specific" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Select Classes</label>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_CLASSES.map(c => (
                        <button key={c} onClick={() => toggleClass(c)} className={cn(
                          "rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all",
                          fClasses.includes(c) ? "border-primary/40 bg-primary/10 text-primary" : "border-border/40 bg-background/30 text-muted-foreground"
                        )}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teacher Alignment */}
                <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/30 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-foreground">Teacher Alignment</p>
                    <p className="text-[10px] text-muted-foreground">Do teachers align with this holiday?</p>
                  </div>
                  <button onClick={() => setFTeacherAligned(v => !v)} className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    fTeacherAligned ? "bg-primary" : "bg-muted"
                  )}>
                    <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform", fTeacherAligned ? "left-[18px]" : "left-0.5")} />
                  </button>
                </div>

                {/* Delete if editing */}
                {editId && (
                  <button
                    onClick={() => { handleDelete(editId); setSheetOpen(false) }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 py-2.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3.5" />Delete this Holiday
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
