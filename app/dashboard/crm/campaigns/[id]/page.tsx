"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft, Download, Search, Users, TrendingUp,
  BarChart3, MapPin, Phone, Calendar, MessageSquare,
  ChevronDown, X, ScanLine, Plus, Clock, ChevronRight,
  Filter, UserCheck, Eye, Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Sheet, SheetContent,
} from "@/components/ui/sheet"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ──────────────────────────────────────────── */

interface StaffMember {
  id: string
  name: string
  avatar: string
  role: string
  leadsCount: number
  conversionRate: number
}

type AnchorStatus = "green" | "yellow" | "red"

interface TimelineEvent {
  id: string
  action: string
  by: string
  date: string
  detail?: string
}

interface Lead {
  id: string
  studentName: string
  fatherName: string
  village: string
  className: string
  phone: string
  status: AnchorStatus
  capturedBy: StaffMember
  timestamp: string
  remarks: string
  timeline: TimelineEvent[]
}

/* ── Seed Data ──────────────────────────────────────── */

const STAFF: StaffMember[] = [
  { id: "s1", name: "Ravi Sharma",   avatar: "RS", role: "Field Coordinator", leadsCount: 58, conversionRate: 38 },
  { id: "s2", name: "Priya Yadav",   avatar: "PY", role: "Sr. Teacher",       leadsCount: 43, conversionRate: 42 },
  { id: "s3", name: "Manoj Kumar",   avatar: "MK", role: "Clerk",             leadsCount: 31, conversionRate: 29 },
  { id: "s4", name: "Sunita Devi",   avatar: "SD", role: "Teacher",           leadsCount: 27, conversionRate: 33 },
  { id: "s5", name: "Arvind Yadav",  avatar: "AY", role: "Principal",         leadsCount: 18, conversionRate: 56 },
  { id: "s6", name: "Kiran Bala",    avatar: "KB", role: "Teacher",           leadsCount: 10, conversionRate: 30 },
]

const VILLAGES = [
  "Berli Khurd", "Dhokia", "Haluhera", "Biharipur", "Musepur",
  "Jatusana", "Khol", "Dahina", "Rewari", "Bawal",
]

const SEED_LEADS: Lead[] = [
  {
    id: "l1", studentName: "Jiya", fatherName: "Narender", village: "Dhokia",
    className: "Grade 5", phone: "98765-43210", status: "green",
    capturedBy: STAFF[0], timestamp: "2026-02-28 10:32",
    remarks: "Fee issue solved, confirmed admission",
    timeline: [
      { id: "t1", action: "Created", by: "Ravi Sharma", date: "2026-02-28", detail: "via Field Survey - Dhokia" },
      { id: "t2", action: "Status: Yellow", by: "Manoj Kumar", date: "2026-03-01", detail: "Fee Issue" },
      { id: "t3", action: "Status: Green", by: "Arvind Yadav", date: "2026-03-02", detail: "Fee resolved, confirmed" },
    ]
  },
  {
    id: "l2", studentName: "Rohit", fatherName: "Suresh Yadav", village: "Berli Khurd",
    className: "Grade 8", phone: "98123-45678", status: "green",
    capturedBy: STAFF[1], timestamp: "2026-02-27 14:15",
    remarks: "Strong academic interest, wants science stream",
    timeline: [
      { id: "t1", action: "Created", by: "Priya Yadav", date: "2026-02-27", detail: "via Field Survey - Berli Khurd" },
      { id: "t2", action: "Status: Green", by: "Priya Yadav", date: "2026-02-27", detail: "Direct admission confirmed" },
    ]
  },
  {
    id: "l3", studentName: "Ananya", fatherName: "Vikram Singh", village: "Haluhera",
    className: "Grade 1", phone: "99887-76543", status: "yellow",
    capturedBy: STAFF[0], timestamp: "2026-02-26 09:48",
    remarks: "Papa will tell on Sunday",
    timeline: [
      { id: "t1", action: "Created", by: "Ravi Sharma", date: "2026-02-26", detail: "via Field Survey - Haluhera" },
      { id: "t2", action: "Status: Yellow", by: "Ravi Sharma", date: "2026-02-26", detail: "Parent undecided" },
    ]
  },
  {
    id: "l4", studentName: "Arjun", fatherName: "Ramesh Patel", village: "Biharipur",
    className: "Grade 10", phone: "97654-32100", status: "yellow",
    capturedBy: STAFF[2], timestamp: "2026-02-25 16:05",
    remarks: "Weak in Math, wants tuition support",
    timeline: [
      { id: "t1", action: "Created", by: "Manoj Kumar", date: "2026-02-25", detail: "via OCR Scan - Biharipur sheet" },
      { id: "t2", action: "Status: Yellow", by: "Manoj Kumar", date: "2026-02-25", detail: "Needs academic counseling" },
    ]
  },
  {
    id: "l5", studentName: "Meera", fatherName: "Bhagwan Das", village: "Musepur",
    className: "Grade 3", phone: "98765-11223", status: "red",
    capturedBy: STAFF[3], timestamp: "2026-02-24 11:20",
    remarks: "Family relocating to Gurugram, unlikely",
    timeline: [
      { id: "t1", action: "Created", by: "Sunita Devi", date: "2026-02-24", detail: "via Field Survey - Musepur" },
      { id: "t2", action: "Status: Red", by: "Sunita Devi", date: "2026-02-24", detail: "Family relocating" },
    ]
  },
  {
    id: "l6", studentName: "Kavya", fatherName: "Dharamveer", village: "Jatusana",
    className: "Nursery", phone: "91234-56789", status: "green",
    capturedBy: STAFF[4], timestamp: "2026-02-23 13:00",
    remarks: "Elder sibling already enrolled, smooth conversion",
    timeline: [
      { id: "t1", action: "Created", by: "Arvind Yadav", date: "2026-02-23", detail: "via Referral - Parent" },
      { id: "t2", action: "Status: Green", by: "Arvind Yadav", date: "2026-02-23", detail: "Sibling reference, confirmed" },
    ]
  },
  {
    id: "l7", studentName: "Lakshmi", fatherName: "Omprakash", village: "Dhokia",
    className: "Grade 5", phone: "99876-54321", status: "yellow",
    capturedBy: STAFF[0], timestamp: "2026-02-22 10:00",
    remarks: "Wants transport facility, checking route",
    timeline: [
      { id: "t1", action: "Created", by: "Ravi Sharma", date: "2026-02-22", detail: "via Field Survey - Dhokia" },
      { id: "t2", action: "Status: Yellow", by: "Ravi Sharma", date: "2026-02-22", detail: "Transport inquiry pending" },
    ]
  },
  {
    id: "l8", studentName: "Sahil", fatherName: "Jagdish", village: "Berli Khurd",
    className: "Grade 12", phone: "98100-23456", status: "green",
    capturedBy: STAFF[1], timestamp: "2026-02-21 15:30",
    remarks: "Science stream confirmed, deposit paid",
    timeline: [
      { id: "t1", action: "Created", by: "Priya Yadav", date: "2026-02-21", detail: "via Field Survey - Berli Khurd" },
      { id: "t2", action: "Status: Green", by: "Priya Yadav", date: "2026-02-22", detail: "Deposit paid, seat locked" },
    ]
  },
]

/* ── Anchor Styles ──────────────────────────────────── */

const ANCHOR: Record<AnchorStatus, { label: string; bg: string; text: string; dot: string }> = {
  green:  { label: "Converted",  bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-500" },
  yellow: { label: "In Progress", bg: "bg-amber-500/15",   text: "text-amber-400",   dot: "bg-amber-500" },
  red:    { label: "Lost/Reject", bg: "bg-rose-500/15",    text: "text-rose-400",     dot: "bg-rose-500" },
}

/* ── Staff Performance Card ─────────────────────────── */

function StaffCard({ staff, rank }: { staff: StaffMember; rank: number }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-xl" style={{ minWidth: 220 }}>
      <div className="relative">
        <div className="flex size-10 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-xs font-bold text-primary">
          {staff.avatar}
        </div>
        {rank <= 3 && (
          <div className={cn(
            "absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full text-[8px] font-bold",
            rank === 1 ? "bg-amber-500 text-background" : rank === 2 ? "bg-muted-foreground text-background" : "bg-orange-700 text-background"
          )}>
            {rank}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{staff.name}</p>
        <p className="text-[10px] text-muted-foreground">{staff.role}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">{staff.leadsCount}</p>
        <p className={cn(
          "text-[10px] font-medium",
          staff.conversionRate >= 40 ? "text-emerald-400" : "text-amber-400"
        )}>{staff.conversionRate}% conv</p>
      </div>
    </div>
  )
}

/* ── Lead Timeline Sheet ────────────────────────────── */

function LeadTimeline({ lead, open, onClose }: { lead: Lead | null; open: boolean; onClose: () => void }) {
  if (!lead) return null
  const anchor = ANCHOR[lead.status]

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-lg">
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("size-2.5 rounded-full", anchor.dot)} />
              <Badge className={cn("text-[10px]", anchor.bg, anchor.text)}>{anchor.label}</Badge>
            </div>
            <h2 className="mt-2 text-xl font-bold text-foreground">{lead.studentName}</h2>
            <p className="text-sm text-muted-foreground">Father: {lead.fatherName}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Village</p>
              <p className="text-sm font-medium text-foreground">{lead.village}</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Class</p>
              <p className="text-sm font-medium text-foreground">{lead.className}</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">{lead.phone}</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Captured By</p>
              <p className="text-sm font-medium text-foreground">{lead.capturedBy.name}</p>
            </div>
          </div>

          {/* Remarks */}
          <div className="rounded-xl border border-border/40 bg-background/30 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Staff Remarks</p>
            <p className="mt-1 text-sm text-foreground leading-relaxed">{lead.remarks}</p>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Audit Trail</h3>
            <div className="relative ml-3 border-l border-border/40 pl-6">
              {lead.timeline.map((event, i) => {
                const isLast = i === lead.timeline.length - 1
                return (
                  <div key={event.id} className="relative mb-6 last:mb-0">
                    {/* Dot on the line */}
                    <div className={cn(
                      "absolute -left-[27px] size-3 rounded-full border-2",
                      isLast ? "border-primary bg-primary" : "border-border bg-background"
                    )} />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {event.action}
                        <span className="text-muted-foreground"> by </span>
                        <span className="text-primary">{event.by}</span>
                      </p>
                      {event.detail && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{event.detail}</p>
                      )}
                      <p className="mt-1 text-[10px] text-muted-foreground/70">{event.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ── OCR Scanner Dialog ─────────────────────────────── */

function OcrScannerDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [assignStaff, setAssignStaff] = useState("")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="size-5 text-primary" />
            Scan Paper Log
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          {/* Upload zone */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-10 transition-colors hover:border-primary/50 hover:bg-primary/10">
            <ScanLine className="size-10 text-primary/60" />
            <p className="text-sm font-medium text-foreground">Upload scanned sheet</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, or PDF</p>
            <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
          </div>

          {/* Assign staff */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Assign these leads to Staff Member
            </label>
            <select
              value={assignStaff}
              onChange={e => setAssignStaff(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="">Select Staff...</option>
              {STAFF.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" className="shadow-md shadow-primary/20">Process & Import</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ── Field Survey Form Dialog ───────────────────────── */

function FieldSurveyDialog({ open, onClose, onSubmit }: {
  open: boolean
  onClose: () => void
  onSubmit: (lead: Lead) => void
}) {
  const [studentName, setStudentName] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [village, setVillage] = useState("")
  const [villageSearch, setVillageSearch] = useState("")
  const [villageOpen, setVillageOpen] = useState(false)
  const [className, setClassName] = useState("")
  const [phone, setPhone] = useState("")
  const [remarks, setRemarks] = useState("")
  const [outcome, setOutcome] = useState<AnchorStatus>("yellow")

  const filteredVillages = VILLAGES.filter(v =>
    v.toLowerCase().includes(villageSearch.toLowerCase())
  )

  function handleSubmit() {
    if (!studentName.trim() || !fatherName.trim()) return
    const newLead: Lead = {
      id: `l-${Date.now()}`,
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      village: village || "Unknown",
      className: className || "Unassigned",
      phone: phone || "-",
      status: outcome,
      capturedBy: STAFF[0], /* Auto-captured logged-in staff */
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      remarks: remarks || "-",
      timeline: [{
        id: `t-${Date.now()}`,
        action: "Created",
        by: STAFF[0].name,
        date: new Date().toISOString().slice(0, 10),
        detail: `via Field Survey${village ? ` - ${village}` : ""}`,
      }],
    }
    onSubmit(newLead)
    setStudentName(""); setFatherName(""); setVillage(""); setClassName("")
    setPhone(""); setRemarks(""); setOutcome("yellow")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Field Survey Entry
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          {/* Auto-captured staff */}
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
              {STAFF[0].avatar}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Captured by: {STAFF[0].name}</p>
              <p className="text-[10px] text-muted-foreground">Auto-detected staff ID</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Student Name" value={studentName} onChange={setStudentName} placeholder="e.g. Jiya" />
            <FormField label="Father's Name" value={fatherName} onChange={setFatherName} placeholder="e.g. Narender" />
          </div>

          {/* Village - searchable */}
          <div className="relative flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Village</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={village || villageSearch}
                onChange={e => { setVillageSearch(e.target.value); setVillage(""); setVillageOpen(true) }}
                onFocus={() => setVillageOpen(true)}
                placeholder="Search village..."
                className="w-full rounded-lg border border-border/50 bg-background/80 py-2.5 pl-9 pr-3 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            {villageOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border/50 bg-card/95 py-1 shadow-xl backdrop-blur-2xl">
                {filteredVillages.map(v => (
                  <button
                    key={v}
                    onClick={() => { setVillage(v); setVillageSearch(""); setVillageOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent/60"
                  >
                    <MapPin className="size-3 text-muted-foreground" />
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Class" value={className} onChange={setClassName} placeholder="e.g. Grade 5" />
            <FormField label="Phone" value={phone} onChange={setPhone} placeholder="e.g. 98765-43210" />
          </div>

          {/* Remarks */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Staff Remarks</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              rows={2}
              placeholder="e.g. Papa will tell on Sunday"
              className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground resize-none focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Outcome Anchor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Outcome Anchor</label>
            <div className="grid grid-cols-3 gap-2">
              {(["green", "yellow", "red"] as AnchorStatus[]).map(s => {
                const a = ANCHOR[s]
                return (
                  <button
                    key={s}
                    onClick={() => setOutcome(s)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                      outcome === s
                        ? `${a.bg} border-current ${a.text}`
                        : "border-border/40 bg-background/30 text-muted-foreground hover:border-border/60"
                    )}
                  >
                    <span className={cn("size-3 rounded-full", a.dot)} />
                    <span className="text-[11px] font-medium">{a.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} className="shadow-md shadow-primary/20">Submit Lead</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FormField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
      />
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────── */

export default function CampaignDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [ocrOpen, setOcrOpen] = useState(false)
  const [surveyOpen, setSurveyOpen] = useState(false)

  /* Sort staff by leads */
  const sortedStaff = useMemo(() => [...STAFF].sort((a, b) => b.leadsCount - a.leadsCount), [])
  const totalInField = STAFF.filter(s => s.leadsCount > 0).length

  const filtered = leads
    .filter(l => statusFilter === "all" || l.status === statusFilter)
    .filter(l =>
      l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.capturedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const greenCount = leads.filter(l => l.status === "green").length
  const yellowCount = leads.filter(l => l.status === "yellow").length
  const redCount = leads.filter(l => l.status === "red").length

  function handleAddLead(lead: Lead) {
    setLeads(prev => [lead, ...prev])
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/crm/campaigns")}
            className="rounded-lg p-1.5 transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground md:text-xl">Rewari District Drive 2026</h1>
            <p className="text-xs text-muted-foreground">Campaign Command -- Field Drive</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOcrOpen(true)} className="gap-1.5 border-border/50">
            <ScanLine className="size-4" />
            Scan Paper Log
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 border-border/50">
            <Download className="size-4" />
            Download QR
          </Button>
          <Button size="sm" onClick={() => setSurveyOpen(true)} className="gap-1.5 shadow-md shadow-primary/20">
            <Plus className="size-4" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Staff Performance Widget */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Staff Performance</h2>
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/60 px-3 py-1.5">
            <UserCheck className="size-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">{totalInField} Staff in Field</span>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sortedStaff.map((s, i) => (
            <StaffCard key={s.id} staff={s} rank={i + 1} />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-xl">
          <Users className="size-5 text-primary" />
          <div>
            <p className="text-lg font-bold text-foreground">{leads.length}</p>
            <p className="text-[10px] text-muted-foreground">Total Leads</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 backdrop-blur-xl">
          <span className="size-3 rounded-full bg-emerald-500" />
          <div>
            <p className="text-lg font-bold text-emerald-400">{greenCount}</p>
            <p className="text-[10px] text-muted-foreground">Converted</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 backdrop-blur-xl">
          <span className="size-3 rounded-full bg-amber-500" />
          <div>
            <p className="text-lg font-bold text-amber-400">{yellowCount}</p>
            <p className="text-[10px] text-muted-foreground">In Progress</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 backdrop-blur-xl">
          <span className="size-3 rounded-full bg-rose-500" />
          <div>
            <p className="text-lg font-bold text-rose-400">{redCount}</p>
            <p className="text-[10px] text-muted-foreground">Lost/Rejected</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student, father, village, staff..."
            className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground backdrop-blur-xl placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["all", "green", "yellow", "red"].map(s => {
            const a = s !== "all" ? ANCHOR[s as AnchorStatus] : null
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === s
                    ? s === "all" ? "bg-primary/15 text-primary border border-primary/30" : `${a!.bg} ${a!.text} border border-current/30`
                    : "bg-card/60 text-muted-foreground border border-border/40 hover:text-foreground"
                )}
              >
                {s !== "all" && <span className={cn("size-1.5 rounded-full", a!.dot)} />}
                {s === "all" ? "All" : a!.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lead Audit Table -- Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl md:block">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 border-b border-border/30 bg-card/60 px-4 py-2.5">
          <div className="col-span-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Student / Father</div>
          <div className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Village</div>
          <div className="col-span-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</div>
          <div className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Captured By</div>
          <div className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Timestamp</div>
          <div className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Remarks</div>
        </div>

        {/* Rows */}
        {filtered.map(lead => {
          const a = ANCHOR[lead.status]
          return (
            <button
              key={lead.id}
              onClick={() => { setSelectedLead(lead); setTimelineOpen(true) }}
              className="grid w-full grid-cols-12 gap-2 border-b border-border/20 px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent/30"
            >
              <div className="col-span-3 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{lead.studentName} / {lead.fatherName}</p>
                <p className="text-[10px] text-muted-foreground">{lead.className} | {lead.phone}</p>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  <MapPin className="size-3 text-muted-foreground" />
                  {lead.village}
                </span>
              </div>
              <div className="col-span-1 flex items-center">
                <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium", a.bg, a.text)}>
                  <span className={cn("size-1.5 rounded-full", a.dot)} />
                  {a.label}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-[8px] font-bold text-primary">
                  {lead.capturedBy.avatar}
                </div>
                <span className="truncate text-xs text-foreground">{lead.capturedBy.name}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-xs text-muted-foreground">{lead.timestamp}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="truncate text-xs text-muted-foreground italic">{lead.remarks}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Lead Cards -- Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map(lead => {
          const a = ANCHOR[lead.status]
          return (
            <button
              key={lead.id}
              onClick={() => { setSelectedLead(lead); setTimelineOpen(true) }}
              className="flex flex-col gap-2.5 rounded-2xl border border-border/40 bg-card/60 p-4 text-left backdrop-blur-xl transition-all hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{lead.studentName} / {lead.fatherName}</p>
                  <p className="text-[11px] text-muted-foreground">{lead.className} | {lead.village}</p>
                </div>
                <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", a.bg, a.text)}>
                  <span className={cn("size-1.5 rounded-full", a.dot)} />
                  {a.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[8px] font-bold text-primary">
                    {lead.capturedBy.avatar}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{lead.capturedBy.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{lead.timestamp}</span>
              </div>
              {lead.remarks && (
                <p className="truncate text-[11px] text-muted-foreground italic">{lead.remarks}</p>
              )}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <Users className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No leads found</p>
        </div>
      )}

      {/* Lead Timeline Sheet */}
      <LeadTimeline lead={selectedLead} open={timelineOpen} onClose={() => setTimelineOpen(false)} />

      {/* OCR Scanner */}
      <OcrScannerDialog open={ocrOpen} onClose={() => setOcrOpen(false)} />

      {/* Field Survey Form */}
      <FieldSurveyDialog open={surveyOpen} onClose={() => setSurveyOpen(false)} onSubmit={handleAddLead} />
    </DashboardShell>
  )
}
