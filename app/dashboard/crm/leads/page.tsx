"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus, Search, TrendingUp, Users, Phone,
  MapPin, Eye, ChevronDown, ArrowUpDown,
  Calendar, Filter, X, UserPlus, GitBranch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─────────────────────────────────────────── */

type LeadStage = "new" | "contacted" | "visit-scheduled" | "visited" | "applied" | "admitted" | "lost"
type LeadSource = "field-drive" | "walk-in" | "referral" | "digital" | "event"

interface Lead {
  id: string
  studentName: string
  fatherName: string
  phone: string
  village: string
  classApplied: string
  stage: LeadStage
  source: LeadSource
  capturedBy: string
  capturedByAvatar: string
  campaign: string
  createdAt: string
  lastFollowUp: string
  remarks: string
}

/* ── Constants ─────────────────────────────────────── */

const STAGE_CONFIG: Record<LeadStage, { label: string; color: string }> = {
  new: { label: "New", color: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  contacted: { label: "Contacted", color: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  "visit-scheduled": { label: "Visit Scheduled", color: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  visited: { label: "Visited", color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  applied: { label: "Applied", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  admitted: { label: "Admitted", color: "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300" },
  lost: { label: "Lost", color: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400" },
}

const SOURCE_CONFIG: Record<LeadSource, { label: string; color: string }> = {
  "field-drive": { label: "Field Drive", color: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  "walk-in": { label: "Walk-in", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  referral: { label: "Referral", color: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  digital: { label: "Digital", color: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  event: { label: "Event", color: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400" },
}

const ALL_STAGES: LeadStage[] = ["new", "contacted", "visit-scheduled", "visited", "applied", "admitted", "lost"]
const ALL_SOURCES: LeadSource[] = ["field-drive", "walk-in", "referral", "digital", "event"]

/* ── Class Master (synced from Class Master Setup) ── */

interface ClassMasterEntry {
  id: string
  name: string
  category: "Primary" | "Middle" | "Senior" | "Vocational"
  admissionWorkflows: string[]
}

const CLASS_MASTER: ClassMasterEntry[] = [
  { id: "nursery", name: "Nursery", category: "Primary", admissionWorkflows: ["basic-enquiry"] },
  { id: "lkg", name: "LKG", category: "Primary", admissionWorkflows: ["basic-enquiry"] },
  { id: "ukg", name: "UKG", category: "Primary", admissionWorkflows: ["basic-enquiry"] },
  { id: "grade1", name: "Grade 1", category: "Primary", admissionWorkflows: ["basic-enquiry", "rte-quota"] },
  { id: "grade2", name: "Grade 2", category: "Primary", admissionWorkflows: ["basic-enquiry", "rte-quota"] },
  { id: "grade3", name: "Grade 3", category: "Primary", admissionWorkflows: ["basic-enquiry", "lateral-entry"] },
  { id: "grade4", name: "Grade 4", category: "Primary", admissionWorkflows: ["basic-enquiry", "lateral-entry"] },
  { id: "grade5", name: "Grade 5", category: "Primary", admissionWorkflows: ["basic-enquiry", "lateral-entry"] },
  { id: "grade6", name: "Grade 6", category: "Middle", admissionWorkflows: ["basic-enquiry", "lateral-entry"] },
  { id: "grade7", name: "Grade 7", category: "Middle", admissionWorkflows: ["basic-enquiry", "sports-quota"] },
  { id: "grade8", name: "Grade 8", category: "Middle", admissionWorkflows: ["basic-enquiry", "sports-quota"] },
  { id: "grade9", name: "Grade 9", category: "Senior", admissionWorkflows: ["senior-v2", "sports-quota"] },
  { id: "grade10", name: "Grade 10", category: "Senior", admissionWorkflows: ["senior-v2", "sports-quota"] },
  { id: "grade11", name: "Grade 11", category: "Senior", admissionWorkflows: ["senior-v2", "mgmt-quota"] },
  { id: "grade12", name: "Grade 12", category: "Senior", admissionWorkflows: ["senior-v2", "mgmt-quota"] },
]

interface WorkflowOption {
  id: string
  name: string
  description: string
}

const WORKFLOW_OPTIONS: WorkflowOption[] = [
  { id: "basic-enquiry", name: "Basic Enquiry Flow", description: "Standard enquiry-to-admission path" },
  { id: "senior-v2", name: "Senior Secondary V2.0", description: "Enhanced flow for senior classes" },
  { id: "sports-quota", name: "Sports Quota", description: "Merit-based sports admission route" },
  { id: "lateral-entry", name: "Lateral Entry", description: "Mid-year transfer admission flow" },
  { id: "rte-quota", name: "RTE Quota", description: "Right to Education reservation route" },
  { id: "mgmt-quota", name: "Management Quota", description: "Direct management admission path" },
]

/* ── Seed Data ─────────────────────────────────────── */

const SEED_LEADS: Lead[] = [
  { id: "l-1", studentName: "Aarav Yadav", fatherName: "Ramesh Yadav", phone: "9876543210", village: "Haluhera", classApplied: "Grade 1", stage: "new", source: "field-drive", capturedBy: "Ravi Sharma", capturedByAvatar: "RS", campaign: "Rewari District Drive", createdAt: "2026-03-01", lastFollowUp: "-", remarks: "Interested in transport" },
  { id: "l-2", studentName: "Sneha Kumari", fatherName: "Sunil Kumar", phone: "9812345678", village: "Musepur", classApplied: "Grade 5", stage: "contacted", source: "referral", capturedBy: "Priya Yadav", capturedByAvatar: "PY", campaign: "Referral Bonus Spring", createdAt: "2026-02-28", lastFollowUp: "2026-03-02", remarks: "Sibling already enrolled" },
  { id: "l-3", studentName: "Rohan Singh", fatherName: "Vikram Singh", phone: "9998877665", village: "Jatusana", classApplied: "Grade 8", stage: "visit-scheduled", source: "digital", capturedBy: "Manoj Kumar", capturedByAvatar: "MK", campaign: "WhatsApp Blast Feb", createdAt: "2026-02-25", lastFollowUp: "2026-03-01", remarks: "Visit on 5th March" },
  { id: "l-4", studentName: "Pooja Devi", fatherName: "Naresh Devi", phone: "9123456789", village: "Rewari", classApplied: "Nursery", stage: "visited", source: "walk-in", capturedBy: "Sunita Devi", capturedByAvatar: "SD", campaign: "-", createdAt: "2026-02-20", lastFollowUp: "2026-03-03", remarks: "Liked infrastructure" },
  { id: "l-5", studentName: "Kunal Joshi", fatherName: "Praveen Joshi", phone: "9988776655", village: "Dharuhera", classApplied: "Grade 10", stage: "applied", source: "event", capturedBy: "Arvind Yadav", capturedByAvatar: "AY", campaign: "Annual Open Day", createdAt: "2026-02-15", lastFollowUp: "2026-03-02", remarks: "Documents submitted" },
  { id: "l-6", studentName: "Ananya Sharma", fatherName: "Deepak Sharma", phone: "9876001234", village: "Kosli", classApplied: "LKG", stage: "admitted", source: "field-drive", capturedBy: "Ravi Sharma", capturedByAvatar: "RS", campaign: "Rewari District Drive", createdAt: "2026-01-10", lastFollowUp: "2026-02-28", remarks: "Fee paid" },
  { id: "l-7", studentName: "Manish Tanwar", fatherName: "Satish Tanwar", phone: "9111222333", village: "Bawal", classApplied: "Grade 12", stage: "lost", source: "digital", capturedBy: "Kiran Bala", capturedByAvatar: "KB", campaign: "WhatsApp Blast Feb", createdAt: "2026-02-01", lastFollowUp: "2026-02-20", remarks: "Chose competitor school" },
  { id: "l-8", studentName: "Divya Rani", fatherName: "Mohan Lal", phone: "9223344556", village: "Haluhera", classApplied: "Grade 3", stage: "new", source: "field-drive", capturedBy: "Priya Yadav", capturedByAvatar: "PY", campaign: "Rewari District Drive", createdAt: "2026-03-03", lastFollowUp: "-", remarks: "" },
  { id: "l-9", studentName: "Rahul Meena", fatherName: "Bhagwan Meena", phone: "9334455667", village: "Musepur", classApplied: "Grade 6", stage: "contacted", source: "referral", capturedBy: "Sunita Devi", capturedByAvatar: "SD", campaign: "Referral Bonus Spring", createdAt: "2026-03-02", lastFollowUp: "2026-03-04", remarks: "Callback scheduled" },
  { id: "l-10", studentName: "Priti Bai", fatherName: "Kishan Bai", phone: "9445566778", village: "Jatusana", classApplied: "UKG", stage: "visit-scheduled", source: "walk-in", capturedBy: "Manoj Kumar", capturedByAvatar: "MK", campaign: "-", createdAt: "2026-03-01", lastFollowUp: "2026-03-03", remarks: "Bring Aadhaar on visit" },
]

/* ── Stat Card ──────────────────────────────────────── */

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/40 bg-card/60 p-3 backdrop-blur-xl sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("text-xl font-bold sm:text-2xl", color)}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  )
}

/* ── Desktop Row ────────────────────────────────────── */

function LeadRow({ lead, onView }: { lead: Lead; onView: () => void }) {
  const stage = STAGE_CONFIG[lead.stage]
  const source = SOURCE_CONFIG[lead.source]
  return (
    <div className="group grid grid-cols-[1fr_100px_100px_100px_90px_44px] items-center gap-3 rounded-xl border border-border/30 bg-card/40 px-4 py-3 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/60 xl:grid-cols-[1fr_140px_120px_120px_120px_100px_44px]">
      {/* Student + Father */}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{lead.studentName}</p>
        <p className="truncate text-[11px] text-muted-foreground">S/o {lead.fatherName}</p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
          <MapPin className="size-3 shrink-0" /><span className="truncate">{lead.village}</span>
          <span className="hidden xl:inline">|</span>
          <Phone className="hidden size-3 shrink-0 xl:inline" /><span className="hidden xl:inline">{lead.phone}</span>
        </div>
      </div>
      {/* Class */}
      <p className="text-xs font-medium text-foreground">{lead.classApplied}</p>
      {/* Stage */}
      <Badge variant="outline" className={cn("w-fit text-[10px]", stage.color)}>{stage.label}</Badge>
      {/* Source */}
      <Badge variant="outline" className={cn("w-fit text-[10px]", source.color)}>{source.label}</Badge>
      {/* Captured by -- hidden on smaller */}
      <div className="hidden items-center gap-1.5 xl:flex">
        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">{lead.capturedByAvatar}</div>
        <span className="truncate text-xs text-muted-foreground">{lead.capturedBy.split(" ")[0]}</span>
      </div>
      {/* Date */}
      <p className="text-[11px] text-muted-foreground">{lead.createdAt.slice(5)}</p>
      {/* View */}
      <Button variant="ghost" size="icon" onClick={onView} className="size-8 opacity-60 group-hover:opacity-100">
        <Eye className="size-4" />
      </Button>
    </div>
  )
}

/* ── Mobile Card ────────────────────────────────────── */

function LeadCardMobile({ lead, onView }: { lead: Lead; onView: () => void }) {
  const stage = STAGE_CONFIG[lead.stage]
  const source = SOURCE_CONFIG[lead.source]
  return (
    <div className="rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{lead.studentName}</p>
          <p className="text-[11px] text-muted-foreground">S/o {lead.fatherName}</p>
        </div>
        <Badge variant="outline" className={cn("shrink-0 text-[10px]", stage.color)}>{stage.label}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge variant="outline" className={cn("text-[10px]", source.color)}>{source.label}</Badge>
        <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{lead.classApplied}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1"><MapPin className="size-3" /><span className="truncate">{lead.village}</span></div>
        <div className="flex items-center gap-1"><Phone className="size-3" /><span className="truncate">{lead.phone}</span></div>
        <div className="flex items-center gap-1"><Calendar className="size-3" /><span>{lead.createdAt.slice(5)}</span></div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
        <div className="flex items-center gap-1.5">
          <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[8px] font-bold text-primary">{lead.capturedByAvatar}</div>
          <span className="text-[11px] text-muted-foreground">{lead.capturedBy}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onView} className="h-7 gap-1 text-[11px]">
          <Eye className="size-3" />View
        </Button>
      </div>
    </div>
  )
}

/* ── Create Lead Sheet ──────────────────────────────── */

function CreateLeadSheet({ open, onOpenChange, onSave }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (lead: Lead) => void
}) {
  const [name, setName] = useState("")
  const [father, setFather] = useState("")
  const [phone, setPhone] = useState("")
  const [village, setVillage] = useState("")
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("")
  const [source, setSource] = useState<LeadSource>("walk-in")
  const [remarks, setRemarks] = useState("")

  const selectedClass = CLASS_MASTER.find(c => c.id === selectedClassId)
  const availableWorkflows = selectedClass
    ? WORKFLOW_OPTIONS.filter(w => selectedClass.admissionWorkflows.includes(w.id))
    : []

  // Auto-select first workflow when class changes
  function handleClassChange(classId: string) {
    setSelectedClassId(classId)
    const cls = CLASS_MASTER.find(c => c.id === classId)
    if (cls && cls.admissionWorkflows.length > 0) {
      setSelectedWorkflowId(cls.admissionWorkflows[0])
    } else {
      setSelectedWorkflowId("")
    }
  }

  function handleSave() {
    if (!name.trim()) return
    const classEntry = CLASS_MASTER.find(c => c.id === selectedClassId)
    const newLead: Lead = {
      id: `l-${Date.now()}`,
      studentName: name.trim(),
      fatherName: father.trim(),
      phone: phone.trim(),
      village: village.trim(),
      classApplied: classEntry?.name || "Not specified",
      stage: "new",
      source,
      capturedBy: "Current User",
      capturedByAvatar: "CU",
      campaign: "-",
      createdAt: new Date().toISOString().slice(0, 10),
      lastFollowUp: "-",
      remarks: remarks.trim(),
    }
    onSave(newLead)
    setName(""); setFather(""); setPhone(""); setVillage(""); setSelectedClassId(""); setSelectedWorkflowId(""); setRemarks("")
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[90vw] sm:!max-w-[90vw] p-0 overflow-hidden [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3 sm:px-6">
            <SheetTitle className="flex items-center gap-2 text-foreground text-sm sm:text-base">
              <UserPlus className="size-5 text-primary" />Create New Lead
            </SheetTitle>
            <button onClick={() => onOpenChange(false)} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>

          {/* Scrollable form body */}
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Student Name *" value={name} onChange={setName} placeholder="Full name of student" />
                <FormField label="Father Name" value={father} onChange={setFather} placeholder="Father / guardian name" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Phone" value={phone} onChange={setPhone} placeholder="10-digit mobile" />
                <FormField label="Village / City" value={village} onChange={setVillage} placeholder="Location" />
              </div>

              {/* Class from Class Master */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Class Applied *</label>
                <select
                  value={selectedClassId}
                  onChange={e => handleClassChange(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="">Select class...</option>
                  {(["Primary", "Middle", "Senior", "Vocational"] as const).map(cat => {
                    const items = CLASS_MASTER.filter(c => c.category === cat)
                    if (items.length === 0) return null
                    return (
                      <optgroup key={cat} label={cat}>
                        {items.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </optgroup>
                    )
                  })}
                </select>
              </div>

              {/* Admission Workflow -- shown when class is selected */}
              {selectedClassId && (
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <GitBranch className="size-3" />Admission Workflow
                  </label>
                  {availableWorkflows.length > 0 ? (
                    <>
                      <select
                        value={selectedWorkflowId}
                        onChange={e => setSelectedWorkflowId(e.target.value)}
                        className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      >
                        {availableWorkflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                      </select>
                      {selectedWorkflowId && (
                        <p className="text-[11px] text-muted-foreground">
                          {WORKFLOW_OPTIONS.find(w => w.id === selectedWorkflowId)?.description}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                      No admission workflow assigned to {selectedClass?.name}. Please configure in Class Master Setup.
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Source</label>
                  <select
                    value={source}
                    onChange={e => setSource(e.target.value as LeadSource)}
                    className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  >
                    {ALL_SOURCES.map(s => <option key={s} value={s}>{SOURCE_CONFIG[s].label}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Campaign</label>
                  <select
                    className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  >
                    <option value="">No campaign</option>
                    <option>Rewari District Drive</option>
                    <option>WhatsApp Blast Feb</option>
                    <option>Referral Bonus Spring</option>
                    <option>Annual Open Day</option>
                  </select>
                </div>
              </div>
              <FormField label="Remarks" value={remarks} onChange={setRemarks} placeholder="Any notes..." textarea />
            </div>
          </div>

          {/* Sticky bottom bar */}
          <div className="flex items-center justify-end gap-2 border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl sm:px-6">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-border/50">Cancel</Button>
            <Button size="sm" onClick={handleSave} className="shadow-md shadow-primary/20">Save Lead</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function FormField({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
        />
      ) : (
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      )}
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────── */

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS)
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<LeadStage | "all">("all")
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = leads
    .filter(l => {
      if (stageFilter !== "all" && l.stage !== stageFilter) return false
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return l.studentName.toLowerCase().includes(q) ||
          l.fatherName.toLowerCase().includes(q) ||
          l.village.toLowerCase().includes(q) ||
          l.phone.includes(q)
      }
      return true
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime()
      const db = new Date(b.createdAt).getTime()
      return sortAsc ? da - db : db - da
    })

  /* Stats */
  const totalLeads = leads.length
  const newLeads = leads.filter(l => l.stage === "new").length
  const admitted = leads.filter(l => l.stage === "admitted").length
  const lostLeads = leads.filter(l => l.stage === "lost").length
  const convRate = totalLeads > 0 ? ((admitted / totalLeads) * 100).toFixed(1) : "0"

  function handleCreateLead(lead: Lead) {
    setLeads(prev => [lead, ...prev])
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">Lead Pipeline</h1>
          <p className="text-xs text-muted-foreground">Track and manage all admission leads</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 shadow-md shadow-primary/20">
          <Plus className="size-4" />New Lead
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Leads" value={totalLeads} sub={`${newLeads} new`} color="text-foreground" />
        <StatCard label="Admitted" value={admitted} sub={`${convRate}% conversion`} color="text-emerald-500" />
        <StatCard label="In Pipeline" value={totalLeads - admitted - lostLeads} color="text-primary" />
        <StatCard label="Lost" value={lostLeads} color="text-red-500" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, village, phone..."
            className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground backdrop-blur-sm placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
          )}
        </div>

        {/* Stage filter -- horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <Filter className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
          <button
            onClick={() => setStageFilter("all")}
            className={cn(
              "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors",
              stageFilter === "all" ? "bg-primary text-primary-foreground" : "bg-card/60 text-muted-foreground hover:bg-accent"
            )}
          >All</button>
          {ALL_STAGES.map(s => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap",
                stageFilter === s ? "bg-primary text-primary-foreground" : "bg-card/60 text-muted-foreground hover:bg-accent"
              )}
            >{STAGE_CONFIG[s].label}</button>
          ))}
        </div>

        {/* Sort + Source filter */}
        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value as LeadSource | "all")}
            className="rounded-lg border border-border/50 bg-card/60 px-2.5 py-1.5 text-xs text-foreground backdrop-blur-sm focus:border-primary/60 focus:outline-none"
          >
            <option value="all">All Sources</option>
            {ALL_SOURCES.map(s => <option key={s} value={s}>{SOURCE_CONFIG[s].label}</option>)}
          </select>
          <button onClick={() => setSortAsc(p => !p)} className="rounded-lg border border-border/50 bg-card/60 p-1.5 text-muted-foreground transition-colors hover:bg-accent">
            <ArrowUpDown className="size-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-3 text-xs text-muted-foreground">{filtered.length} lead{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Desktop Table */}
      <div className="hidden flex-col gap-2 md:flex">
        {/* Header */}
        <div className="grid grid-cols-[1fr_100px_100px_100px_90px_44px] items-center gap-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground xl:grid-cols-[1fr_140px_120px_120px_120px_100px_44px]">
          <span>Student / Parent</span>
          <span>Class</span>
          <span>Stage</span>
          <span>Source</span>
          <span className="hidden xl:block">Captured By</span>
          <span>Date</span>
          <span></span>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/30 bg-card/30 py-12">
            <Users className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No leads match your filters</p>
          </div>
        )}
        {filtered.map(lead => (
          <LeadRow key={lead.id} lead={lead} onView={() => router.push(`/dashboard/crm/leads/${lead.id}`)} />
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/30 bg-card/30 py-12">
            <Users className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No leads match your filters</p>
          </div>
        )}
        {filtered.map(lead => (
          <LeadCardMobile key={lead.id} lead={lead} onView={() => router.push(`/dashboard/crm/leads/${lead.id}`)} />
        ))}
      </div>

      {/* Create Lead Sheet */}
      <CreateLeadSheet open={createOpen} onOpenChange={setCreateOpen} onSave={handleCreateLead} />
    </DashboardShell>
  )
}
