"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Phone, MapPin, Calendar, Clock,
  CheckCircle, Circle, MessageSquare, FileText,
  UserCheck, Eye, ChevronRight, Plus, Send,
  Upload, AlertTriangle, XCircle, CheckCircle2, X,
  Image as ImageIcon, ZoomIn, MoreVertical,
  GitBranch, ArrowRight, ArrowLeftIcon, PauseCircle, Ban, ChevronDown as ChevronDownIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Admission Workflow Pipelines (synced from Admission Setup) ── */

interface WorkflowPipeline {
  id: string
  name: string
  stages: { id: string; label: string; category: "data" | "evaluation" | "finance" | "status" }[]
}

const ADMISSION_WORKFLOWS: WorkflowPipeline[] = [
  {
    id: "basic-enquiry",
    name: "Basic Enquiry Flow",
    stages: [
      { id: "enquiry", label: "Basic Enquiry", category: "data" },
      { id: "doc-collection", label: "Document Collection", category: "data" },
      { id: "admission-fee", label: "Admission Fee", category: "finance" },
      { id: "seat-lock", label: "Final Seat Lock", category: "status" },
    ],
  },
  {
    id: "senior-v2",
    name: "Senior Secondary V2.0",
    stages: [
      { id: "enquiry", label: "Basic Enquiry", category: "data" },
      { id: "entrance-exam", label: "Entrance Exam", category: "evaluation" },
      { id: "interview", label: "Interview Panel", category: "evaluation" },
      { id: "admission-fee", label: "Admission Fee", category: "finance" },
      { id: "seat-lock", label: "Seat Lock", category: "status" },
    ],
  },
  {
    id: "sports-quota",
    name: "Sports Quota",
    stages: [
      { id: "enquiry", label: "Basic Enquiry", category: "data" },
      { id: "trial", label: "Sports Trial", category: "evaluation" },
      { id: "merit-review", label: "Merit Review", category: "evaluation" },
      { id: "admission-fee", label: "Admission Fee", category: "finance" },
      { id: "seat-lock", label: "Seat Lock", category: "status" },
    ],
  },
  {
    id: "lateral-entry",
    name: "Lateral Entry",
    stages: [
      { id: "enquiry", label: "Basic Enquiry", category: "data" },
      { id: "doc-verification", label: "Document Verification", category: "data" },
      { id: "tc-clearance", label: "TC Clearance", category: "evaluation" },
      { id: "admission-fee", label: "Admission Fee", category: "finance" },
      { id: "seat-lock", label: "Seat Lock", category: "status" },
    ],
  },
]

type LeadStatus = "active" | "waitlisted" | "rejected"

interface Activity {
  id: string
  type: "call" | "note" | "stage-change" | "document" | "visit"
  text: string
  by: string
  at: string
}

interface FollowUp {
  id: string
  text: string
  done: boolean
  dueDate: string
}

/* ── Seed Data ─────────────────────────────────────── */

const DEMO = {
  id: "l-1",
  studentName: "Aarav Yadav",
  fatherName: "Ramesh Yadav",
  phone: "9876543210",
  village: "Haluhera",
  classApplied: "Grade 1",
  source: "Field Drive",
  campaign: "Rewari District Drive",
  workflowId: "basic-enquiry",
  createdAt: "2026-03-01",
  capturedBy: "Ravi Sharma",
}

const SEED_ACTIVITIES: Activity[] = [
  { id: "a1", type: "stage-change", text: "Stage changed to New", by: "System", at: "2026-03-01 09:00" },
  { id: "a2", type: "call", text: "Phone call with father, interested in transport facility", by: "Ravi Sharma", at: "2026-03-01 14:30" },
  { id: "a3", type: "note", text: "Father works in Rewari, prefers morning transport pickup", by: "Priya Yadav", at: "2026-03-02 10:00" },
  { id: "a4", type: "stage-change", text: "Stage changed to Contacted", by: "Ravi Sharma", at: "2026-03-02 11:15" },
  { id: "a5", type: "visit", text: "School visit scheduled for 5th March", by: "Ravi Sharma", at: "2026-03-03 09:00" },
  { id: "a6", type: "stage-change", text: "Stage changed to Visit Scheduled", by: "System", at: "2026-03-03 09:05" },
]

const SEED_FOLLOWUPS: FollowUp[] = [
  { id: "f1", text: "Confirm visit date with parent", done: true, dueDate: "2026-03-03" },
  { id: "f2", text: "Prepare transport route info for demo", done: false, dueDate: "2026-03-04" },
  { id: "f3", text: "Follow up after school visit", done: false, dueDate: "2026-03-06" },
  { id: "f4", text: "Share fee structure document", done: false, dueDate: "2026-03-07" },
]

/* ── Page ───────────────────────────────────────────── */

export default function LeadOverviewPage() {
  const params = useParams()
  const router = useRouter()

  /* Resolve the admission workflow for this lead */
  const workflow = ADMISSION_WORKFLOWS.find(w => w.id === DEMO.workflowId) ?? ADMISSION_WORKFLOWS[0]
  const stages = workflow.stages

  const [currentStageIdx, setCurrentStageIdx] = useState(1) // at "Document Collection"
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("active")
  const [activities] = useState<Activity[]>(SEED_ACTIVITIES)
  const [followUps, setFollowUps] = useState<FollowUp[]>(SEED_FOLLOWUPS)
  const [admissionOpen, setAdmissionOpen] = useState(false)
  const [newNote, setNewNote] = useState("")

  function toggleFollowUp(id: string) {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, done: !f.done } : f))
  }

  function handleProceed() {
    if (currentStageIdx < stages.length - 1 && leadStatus === "active") {
      setCurrentStageIdx(prev => prev + 1)
    }
  }

  function handleRevert() {
    if (currentStageIdx > 0 && leadStatus === "active") {
      setCurrentStageIdx(prev => prev - 1)
    }
  }

  function handleWaitlist() {
    setLeadStatus(prev => prev === "waitlisted" ? "active" : "waitlisted")
  }

  function handleReject() {
    setLeadStatus(prev => prev === "rejected" ? "active" : "rejected")
  }

  return (
    <DashboardShell>
      {/* Back + Header */}
      <div className="mb-6">
        <button onClick={() => router.push("/dashboard/crm/leads")} className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-3.5" />Back to Leads
        </button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground md:text-xl">{DEMO.studentName}</h1>
            <p className="text-sm text-muted-foreground">S/o {DEMO.fatherName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="size-3" />{DEMO.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="size-3" />{DEMO.village}</span>
              <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-[10px] text-sky-500">{DEMO.source}</Badge>
              <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">{DEMO.classApplied}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {leadStatus === "waitlisted" && (
              <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px]" variant="outline">Waitlisted</Badge>
            )}
            {leadStatus === "rejected" && (
              <Badge className="border-red-500/30 bg-red-500/10 text-red-500 text-[10px]" variant="outline">Rejected</Badge>
            )}

            {/* Three-dot pipeline actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-8 border-border/50">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 border-border/40 bg-card/95 backdrop-blur-2xl">
                <DropdownMenuItem
                  onClick={handleProceed}
                  disabled={currentStageIdx >= stages.length - 1 || leadStatus !== "active"}
                  className="gap-2.5"
                >
                  <ArrowRight className="size-4 text-emerald-500" />
                  <span>Proceed to Next Stage</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleRevert}
                  disabled={currentStageIdx <= 0 || leadStatus !== "active"}
                  className="gap-2.5"
                >
                  <ArrowLeftIcon className="size-4 text-sky-500" />
                  <span>Revert to Previous Stage</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleWaitlist} className="gap-2.5">
                  <PauseCircle className="size-4 text-amber-500" />
                  <span>{leadStatus === "waitlisted" ? "Remove from Waitlist" : "Waitlist"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReject} className="gap-2.5 text-red-500 focus:text-red-500">
                  <Ban className="size-4" />
                  <span>{leadStatus === "rejected" ? "Undo Rejection" : "Reject"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" onClick={() => setAdmissionOpen(true)} className="gap-1.5 shadow-md shadow-primary/20 text-xs">
              <FileText className="size-3.5" />Start Admission
            </Button>
          </div>
        </div>
      </div>

      {/* Pipeline Tracker -- uses admission workflow stages */}
      <div className={cn(
        "mb-6 rounded-2xl border bg-card/60 p-4 backdrop-blur-xl",
        leadStatus === "rejected" ? "border-red-500/30" : leadStatus === "waitlisted" ? "border-amber-500/30" : "border-border/40"
      )}>
        {/* Header with workflow name */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="size-3.5 text-primary" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pipeline Tracker</p>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] text-primary gap-1">
            <GitBranch className="size-2.5" />{workflow.name}
          </Badge>
        </div>

        {/* Waitlisted / Rejected overlay banner */}
        {leadStatus !== "active" && (
          <div className={cn(
            "mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
            leadStatus === "waitlisted" ? "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            {leadStatus === "waitlisted" ? <PauseCircle className="size-3.5" /> : <Ban className="size-3.5" />}
            {leadStatus === "waitlisted"
              ? `Waitlisted at "${stages[currentStageIdx].label}". Use the menu to resume.`
              : `Rejected at "${stages[currentStageIdx].label}". Use the menu to undo.`
            }
          </div>
        )}

        {/* Desktop horizontal stepper */}
        <div className="hidden items-center gap-1 sm:flex">
          {stages.map((s, i) => {
            const done = i < currentStageIdx
            const active = i === currentStageIdx
            const catColor = s.category === "data" ? "sky" : s.category === "evaluation" ? "amber" : s.category === "finance" ? "emerald" : "violet"
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className={cn(
                  "flex h-9 flex-1 items-center justify-center rounded-lg border text-xs font-medium transition-all",
                  leadStatus === "rejected" && active ? "border-red-500/30 bg-red-500/10 text-red-500" :
                  leadStatus === "waitlisted" && active ? "border-amber-500/30 bg-amber-500/10 text-amber-500" :
                  done ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                  active ? "border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/30" :
                  "border-border/30 bg-muted/20 text-muted-foreground"
                )}>
                  {done ? <CheckCircle className="mr-1.5 size-3.5" /> : active ? <Circle className="mr-1.5 size-3.5 fill-primary/30" /> : null}
                  <span className="truncate px-1">{s.label}</span>
                </div>
                {i < stages.length - 1 && (
                  <ChevronRight className={cn("mx-0.5 size-4 shrink-0", done ? "text-emerald-500" : "text-border")} />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile vertical stepper */}
        <div className="flex flex-col gap-2 sm:hidden">
          {stages.map((s, i) => {
            const done = i < currentStageIdx
            const active = i === currentStageIdx
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                    leadStatus === "rejected" && active ? "border-red-500 bg-red-500 text-white" :
                    leadStatus === "waitlisted" && active ? "border-amber-500 bg-amber-500 text-white" :
                    done ? "border-emerald-500 bg-emerald-500 text-white" :
                    active ? "border-primary bg-primary text-primary-foreground" :
                    "border-border/50 bg-muted/30 text-muted-foreground"
                  )}>
                    {done ? <CheckCircle className="size-3.5" /> : active && leadStatus === "rejected" ? <Ban className="size-3" /> : active && leadStatus === "waitlisted" ? <PauseCircle className="size-3" /> : i + 1}
                  </div>
                  {i < stages.length - 1 && <div className={cn("h-4 w-px", done ? "bg-emerald-500" : "bg-border/40")} />}
                </div>
                <div className="flex flex-col">
                  <span className={cn("text-sm", active ? "font-semibold text-foreground" : done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                  <span className="text-[10px] capitalize text-muted-foreground/60">{s.category}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Grid: Follow-ups + Profile | Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Follow-ups + Profile */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Follow-up Tasks */}
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Follow-up Tasks</p>
            <div className="flex flex-col gap-2">
              {followUps.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggleFollowUp(f.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                    f.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-border/30 bg-background/30 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    f.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border/60"
                  )}>
                    {f.done && <CheckCircle className="size-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", f.done ? "text-muted-foreground line-through" : "text-foreground")}>{f.text}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{f.dueDate}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Profile */}
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Profile</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <ProfileRow label="Workflow" value={workflow.name} />
              <ProfileRow label="Current Stage" value={stages[currentStageIdx].label} />
              <ProfileRow label="Campaign" value={DEMO.campaign} />
              <ProfileRow label="Captured By" value={DEMO.capturedBy} />
              <ProfileRow label="Created" value={DEMO.createdAt} />
              <ProfileRow label="Class" value={DEMO.classApplied} />
              <ProfileRow label="Source" value={DEMO.source} />
            </div>
          </div>
        </div>

        {/* Right: Activity Log */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Activity Log</p>

            {/* Add Note */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a quick note..."
                className="flex-1 rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <Button size="icon" className="size-9 shrink-0" onClick={() => setNewNote("")}>
                <Send className="size-4" />
              </Button>
            </div>

            {/* Timeline */}
            <div className="relative flex flex-col gap-0">
              {/* Vertical line */}
              <div className="absolute left-4 top-3 bottom-3 w-px bg-border/40" />

              {[...activities].reverse().map((a, i) => (
                <div key={a.id} className="relative flex gap-4 pb-5 last:pb-0">
                  {/* Dot */}
                  <div className={cn(
                    "relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border",
                    a.type === "stage-change" ? "border-primary/40 bg-primary/10" :
                    a.type === "call" ? "border-emerald-500/40 bg-emerald-500/10" :
                    a.type === "visit" ? "border-amber-500/40 bg-amber-500/10" :
                    a.type === "document" ? "border-violet-500/40 bg-violet-500/10" :
                    "border-border/40 bg-card/60"
                  )}>
                    {a.type === "stage-change" && <ChevronRight className="size-3.5 text-primary" />}
                    {a.type === "call" && <Phone className="size-3.5 text-emerald-500" />}
                    {a.type === "visit" && <Eye className="size-3.5 text-amber-500" />}
                    {a.type === "document" && <FileText className="size-3.5 text-violet-500" />}
                    {a.type === "note" && <MessageSquare className="size-3.5 text-muted-foreground" />}
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm text-foreground">{a.text}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{a.by}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" />{a.at}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Admission Form & Pipeline Desk (90vw) ── */}
      <AdmissionFormSheet open={admissionOpen} onOpenChange={setAdmissionOpen} demo={DEMO} />
    </DashboardShell>
  )
}

/* ── Admission Form Sheet (90vw, mobile-friendly) ──── */

function AdmissionFormSheet({ open, onOpenChange, demo }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  demo: typeof DEMO
}) {
  const [ocrPanelOpen, setOcrPanelOpen] = useState(false)

  const PIPELINE_ALERTS = [
    { type: "error" as const, title: "AI Exception", desc: "Failed to read Bank IFSC. Please correct manually." },
    { type: "warning" as const, title: "Low Confidence", desc: "Father name OCR confidence 72%. Please verify." },
    { type: "success" as const, title: "Auto-Filled", desc: "Student name, DOB, and Aadhaar extracted successfully." },
  ]

  const errorCount = PIPELINE_ALERTS.filter(a => a.type === "error").length
  const warningCount = PIPELINE_ALERTS.filter(a => a.type === "warning").length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[90vw] sm:!max-w-[90vw] p-0 overflow-hidden [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="size-5 shrink-0 text-primary" />
              <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">Admission Form - {demo.studentName}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="hidden border-border/50 text-xs sm:flex">Cancel</Button>
              <Button size="sm" onClick={() => onOpenChange(false)} className="shadow-md shadow-primary/20 text-xs">Save</Button>
              <button onClick={() => onOpenChange(false)} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Mobile: Pipeline Error Banner (collapsible) */}
          <div className="lg:hidden">
            <button
              onClick={() => setOcrPanelOpen(prev => !prev)}
              className="flex w-full items-center justify-between border-b border-border/30 bg-muted/20 px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-amber-500" />
                <span className="text-xs font-medium text-foreground">
                  Pipeline Alerts
                  {errorCount > 0 && <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{errorCount}</span>}
                  {warningCount > 0 && <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">{warningCount}</span>}
                </span>
              </div>
              <ChevronDownIcon className={cn("size-4 text-muted-foreground transition-transform", ocrPanelOpen && "rotate-180")} />
            </button>

            {/* Expanded OCR panel on mobile */}
            {ocrPanelOpen && (
              <div className="flex flex-col gap-3 border-b border-border/30 bg-muted/10 p-4">
                {/* Upload Zone */}
                <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center">
                  <Upload className="mx-auto size-6 text-primary/60" />
                  <p className="mt-1 text-xs font-medium text-foreground">Upload Documents</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Drop forms, certificates, or photos</p>
                </div>

                {/* Alerts */}
                <div className="flex flex-col gap-2">
                  {PIPELINE_ALERTS.map((a, i) => (
                    <div key={i} className={cn(
                      "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
                      a.type === "error" ? "border-red-500/30 bg-red-500/5" : a.type === "warning" ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"
                    )}>
                      {a.type === "error" ? <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" /> : a.type === "warning" ? <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />}
                      <div>
                        <p className={cn("text-xs font-medium", a.type === "error" ? "text-red-600 dark:text-red-400" : a.type === "warning" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>{a.title}</p>
                        <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setOcrPanelOpen(false)} className="self-center rounded-md px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                  Close Panel
                </button>
              </div>
            )}
          </div>

          {/* Split Body -- side-by-side on lg+, form only on mobile */}
          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">

            {/* ── LEFT SIDE: OCR Pipeline & Doc Viewer (desktop only) ── */}
            <div className="hidden flex-col gap-4 border-r border-border/30 bg-muted/10 p-5 lg:flex lg:w-[360px] lg:shrink-0 lg:overflow-y-auto">
              {/* Upload Zone */}
              <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/10">
                <Upload className="mx-auto size-8 text-primary/60" />
                <p className="mt-2 text-sm font-medium text-foreground">Upload Documents</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Drop physical forms, certificates, or photos here</p>
              </div>

              {/* Pipeline Task Queue */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pipeline Task Queue</p>
                {PIPELINE_ALERTS.map((a, i) => (
                  <div key={i} className={cn(
                    "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
                    a.type === "error" ? "border-red-500/30 bg-red-500/5" : a.type === "warning" ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"
                  )}>
                    {a.type === "error" ? <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" /> : a.type === "warning" ? <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />}
                    <div>
                      <p className={cn("text-xs font-medium", a.type === "error" ? "text-red-600 dark:text-red-400" : a.type === "warning" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>{a.title}</p>
                      <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Document Preview */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Document Preview</p>
                <div className="group relative flex aspect-[4/3] items-center justify-center rounded-xl border border-border/40 bg-card/60">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                    <ImageIcon className="size-10" />
                    <p className="text-xs">Upload a document to preview</p>
                  </div>
                  <button className="absolute right-2 top-2 rounded-md border border-border/40 bg-card/80 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <ZoomIn className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDE: Tabbed Data Entry ──────────── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <Tabs defaultValue="academic" className="w-full">
                <TabsList className="mb-5 w-full justify-start gap-1 overflow-x-auto bg-muted/30 no-scrollbar">
                  <TabsTrigger value="academic" className="shrink-0 text-xs">Academic & Profile</TabsTrigger>
                  <TabsTrigger value="demographics" className="shrink-0 text-xs">Demographics & Bank</TabsTrigger>
                  <TabsTrigger value="family" className="shrink-0 text-xs">Family & Income</TabsTrigger>
                  <TabsTrigger value="previous" className="shrink-0 text-xs">Previous School</TabsTrigger>
                  <TabsTrigger value="documents" className="shrink-0 text-xs">Documents</TabsTrigger>
                </TabsList>

                {/* TAB 1: Academic & Basic Profile */}
                <TabsContent value="academic" className="flex flex-col gap-4">
                  <SectionLabel text="Session & Admission" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Academic Session" value="2026-27" />
                    <AdmissionField label="Admission No" value="" placeholder="Auto-generated" />
                    <AdmissionField label="Admission Date" value={new Date().toISOString().slice(0, 10)} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Class" value={demo.classApplied} />
                    <AdmissionField label="Stream" value="" placeholder="Science / Arts / Commerce" />
                    <AdmissionField label="Medium" value="English" />
                  </div>
                  <AdmissionField label="SRN No" value="" placeholder="State Registration Number" />

                  <SectionLabel text="Student Details" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AdmissionField label="Student Name" value={demo.studentName} />
                    <AdmissionField label="Gender" value="" placeholder="Male / Female / Other" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Date of Birth" value="" placeholder="DD/MM/YYYY" />
                    <AdmissionField label="Nationality" value="Indian" />
                    <AdmissionField label="Blood Group" value="" placeholder="A+ / B+ / O+..." />
                  </div>
                  <AdmissionField label="Illness / Medical Conditions" value="" placeholder="Any known medical conditions" />
                </TabsContent>

                {/* TAB 2: Demographics & Bank */}
                <TabsContent value="demographics" className="flex flex-col gap-4">
                  <SectionLabel text="Address & Category" />
                  <AdmissionField label="Full Address" value="" placeholder="House no, street, village/city..." />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="State" value="Haryana" />
                    <AdmissionField label="District" value="" placeholder="District" />
                    <AdmissionField label="Pincode" value="" placeholder="6-digit pincode" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Caste" value="" placeholder="Caste" />
                    <AdmissionField label="Category" value="" placeholder="General / OBC / SC / ST" />
                    <AdmissionField label="Religion" value="" placeholder="Religion" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AdmissionSelect label="BPL" options={["No", "Yes"]} />
                    <AdmissionField label="Physically Challenged" value="" placeholder="If yes, provide details" />
                  </div>

                  <SectionLabel text="Bank Details" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AdmissionField label="Aadhaar No" value="" placeholder="12-digit Aadhaar number" />
                    <AdmissionField label="Bank Name" value="" placeholder="Bank name" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Bank A/c No" value="" placeholder="Account number" />
                    <AdmissionField label="Branch Name / Code" value="" placeholder="Branch" />
                    <AdmissionField label="IFSC Code" value="" placeholder="IFSC code" />
                  </div>
                </TabsContent>

                {/* TAB 3: Family & Income */}
                <TabsContent value="family" className="flex flex-col gap-4">
                  <SectionLabel text="Father Details" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AdmissionField label="Father Name" value={demo.fatherName} />
                    <AdmissionField label="Occupation" value="" placeholder="Occupation" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Educational Qualification" value="" placeholder="Qualification" />
                    <AdmissionField label="Aadhaar / PAN No" value="" placeholder="ID number" />
                    <AdmissionField label="Contact" value={demo.phone} />
                  </div>
                  <AdmissionSelect label="Income Tax Payee" options={["No", "Yes"]} />

                  <SectionLabel text="Mother Details" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AdmissionField label="Mother Name" value="" placeholder="Mother's full name" />
                    <AdmissionField label="Occupation" value="" placeholder="Occupation" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Educational Qualification" value="" placeholder="Qualification" />
                    <AdmissionField label="Aadhaar / PAN No" value="" placeholder="ID number" />
                    <AdmissionField label="Contact" value="" placeholder="Phone number" />
                  </div>
                  <AdmissionSelect label="Income Tax Payee" options={["No", "Yes"]} />

                  <SectionLabel text="Income & Siblings" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AdmissionField label="Family Annual Income" value="" placeholder="Approximate annual income" />
                    <AdmissionField label="Siblings in Same School" value="" placeholder="Names or count" />
                  </div>
                </TabsContent>

                {/* TAB 4: Previous School & Subjects */}
                <TabsContent value="previous" className="flex flex-col gap-4">
                  <SectionLabel text="Previous School Details" />
                  <AdmissionField label="Previous School Name" value="" placeholder="Full school name" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <AdmissionField label="Previous Admission No" value="" placeholder="Admission number" />
                    <AdmissionField label="Leaving Date" value="" placeholder="DD/MM/YYYY" />
                    <AdmissionField label="Marks Obtained (%)" value="" placeholder="Percentage" />
                  </div>

                  <SectionLabel text="Compulsory Subjects" />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["English", "Hindi", "Mathematics", "Science", "Social Studies", "Computer Science"].map(s => (
                      <div key={s} className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/30 px-3 py-2">
                        <input type="checkbox" defaultChecked className="size-3.5 rounded border-border accent-primary" />
                        <span className="text-xs text-foreground">{s}</span>
                      </div>
                    ))}
                  </div>

                  <SectionLabel text="Optional Subjects" />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["Physical Education", "Art", "Music", "Sanskrit", "Economics", "Psychology"].map(s => (
                      <div key={s} className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/30 px-3 py-2">
                        <input type="checkbox" className="size-3.5 rounded border-border accent-primary" />
                        <span className="text-xs text-foreground">{s}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* TAB 5: Mandatory Documents */}
                <TabsContent value="documents" className="flex flex-col gap-3">
                  <p className="text-[11px] text-muted-foreground">Documents dynamically required by the selected admission workflow.</p>
                  {[
                    { name: "School Leaving Certificate (SLC)", status: "pending" as const },
                    { name: "Aadhaar Card (Student)", status: "uploaded" as const },
                    { name: "Aadhaar Card (Father)", status: "pending" as const },
                    { name: "Birth Certificate", status: "verified" as const },
                    { name: "Medical Fitness Certificate", status: "pending" as const },
                    { name: "Transfer Certificate", status: "pending" as const },
                    { name: "Caste Certificate", status: "uploaded" as const },
                    { name: "Passport Size Photo (2x)", status: "verified" as const },
                    { name: "Previous Report Card", status: "pending" as const },
                  ].map(doc => {
                    const statusStyle = doc.status === "verified"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                      : doc.status === "uploaded"
                      ? "border-sky-500/30 bg-sky-500/10 text-sky-500"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    return (
                      <div key={doc.name} className="flex flex-col gap-2 rounded-xl border border-border/30 bg-background/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-foreground">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-[10px] capitalize", statusStyle)}>{doc.status}</Badge>
                          {doc.status === "pending" ? (
                            <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px] border-border/50">
                              <Upload className="size-3" />Upload
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]">
                              <Eye className="size-3" />View
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sticky Bottom Footer */}
          <div className="flex items-center justify-between border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl sm:px-6">
            <p className="text-[11px] text-muted-foreground">3 of 9 documents uploaded</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-border/50 text-xs">Cancel</Button>
              <Button size="sm" onClick={() => onOpenChange(false)} className="shadow-md shadow-primary/20 text-xs">Save & Continue</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ── Helpers ──���─────────────────────────────────────── */

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 first:mt-0">
      <div className="h-px flex-1 bg-border/30" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{text}</span>
      <div className="h-px flex-1 bg-border/30" />
    </div>
  )
}

function AdmissionField({ label, value, placeholder }: { label: string; value: string; placeholder?: string }) {
  const [val, setVal] = useState(value)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type="text"
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
      />
    </div>
  )
}

function AdmissionSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <select className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
