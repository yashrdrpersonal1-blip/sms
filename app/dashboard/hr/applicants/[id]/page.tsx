"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Phone, MapPin, Mail, GraduationCap,
  FileText, Download, RefreshCw, Plus, Send,
  CheckCircle, Circle, ChevronRight, Clock,
  ArrowRight, ArrowLeftIcon, AlertTriangle,
  Briefcase, Shield, Calendar, X, User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"
import {
  useATSStore,
  PIPELINE_STAGES,
  STAGE_COLORS,
  SOURCE_COLORS,
  type ApplicantStage,
} from "@/stores/ats-store"

/* ── Onboarding Modal ─────────────────────────── */

function OnboardingModal({
  open,
  onOpenChange,
  applicantName,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  applicantName: string
  onConfirm: () => void
}) {
  const [department, setDepartment] = useState("")
  const [role, setRole] = useState("")
  const [shift, setShift] = useState("morning")
  const [salary, setSalary] = useState("")
  const [joiningDate, setJoiningDate] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Briefcase className="size-5 text-primary" />
            Finalize Onboarding
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Convert <span className="font-semibold text-foreground">{applicantName}</span> to an Active Employee.
        </p>

        <div className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Department *</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30">
                <option value="">Select...</option>
                <option value="academic">Academic</option>
                <option value="administration">Administration</option>
                <option value="finance">Finance</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Final Role *</label>
              <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. PGT Mathematics" className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shift Timing</label>
              <select value={shift} onChange={(e) => setShift(e.target.value)} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30">
                <option value="morning">Morning (7:30 AM - 2:30 PM)</option>
                <option value="full">Full Day (8:00 AM - 4:00 PM)</option>
                <option value="evening">Evening (12:00 PM - 6:00 PM)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Joining Date</label>
              <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Monthly CTC / Salary</label>
            <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 55,000" className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/30 pt-4">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={onConfirm} className="shadow-md shadow-primary/20">
              Confirm Onboarding
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ── Page ──────────────────────────────────────── */

export default function ApplicantProfilePage() {
  const params = useParams()
  const router = useRouter()
  const applicantId = params.id as string

  const applicants = useATSStore((s) => s.applicants)
  const updateApplicantStage = useATSStore((s) => s.updateApplicantStage)
  const addApplicantTask = useATSStore((s) => s.addApplicantTask)
  const toggleApplicantTask = useATSStore((s) => s.toggleApplicantTask)
  const addTimelineEvent = useATSStore((s) => s.addTimelineEvent)

  const applicant = applicants.find((a) => a.id === applicantId)

  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [newTaskText, setNewTaskText] = useState("")
  const [activeTab, setActiveTab] = useState("context")

  if (!applicant) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <AlertTriangle className="mb-2 size-8" />
          <p className="text-sm">Applicant not found</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/dashboard/hr/applicants")}>
            Back to Applicant Pool
          </Button>
        </div>
      </DashboardShell>
    )
  }

  const currentStageIdx = PIPELINE_STAGES.findIndex((s) => s.id === applicant.stage)
  const src = SOURCE_COLORS[applicant.source]

  function handleNextStage() {
    if (currentStageIdx < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[currentStageIdx + 1].id
      updateApplicantStage(applicantId, nextStage, "HR Manager")
    }
  }

  function handleRevertStage() {
    if (currentStageIdx > 0) {
      const prevStage = PIPELINE_STAGES[currentStageIdx - 1].id
      updateApplicantStage(applicantId, prevStage, "HR Manager")
    }
  }

  function handleWaitlist() {
    addTimelineEvent(applicantId, {
      id: `t-${Date.now()}`,
      type: "note",
      text: "Applicant moved to Waitlist",
      by: "HR Manager",
      at: new Date().toISOString().slice(0, 16).replace("T", " "),
    })
  }

  function handleReject() {
    addTimelineEvent(applicantId, {
      id: `t-${Date.now()}`,
      type: "note",
      text: "Applicant Rejected",
      by: "HR Manager",
      at: new Date().toISOString().slice(0, 16).replace("T", " "),
    })
  }

  function handleOnboardConfirm() {
    updateApplicantStage(applicantId, "onboarded", "HR Manager")
    addTimelineEvent(applicantId, {
      id: `t-${Date.now()}`,
      type: "system",
      text: "Onboarding finalized. Employee record created.",
      by: "HR Manager",
      at: new Date().toISOString().slice(0, 16).replace("T", " "),
    })
    setOnboardingOpen(false)
  }

  function handleAddTask() {
    if (!newTaskText.trim()) return
    addApplicantTask(applicantId, {
      id: `tk-${Date.now()}`,
      text: newTaskText.trim(),
      done: false,
      createdBy: "Current User",
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setNewTaskText("")
  }

  const qualLabel = applicant.qualification === "post-graduation" ? "Post-Graduation" : applicant.qualification === "phd" ? "PhD" : "Graduation"

  return (
    <DashboardShell>
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard/hr/applicants")}
        className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Applicant Pool
      </button>

      {/* Header + Actions */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            {applicant.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {applicant.appliedRole}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="size-3" />
              {applicant.phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="size-3" />
              {applicant.email}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {applicant.place}
            </span>
            <Badge variant="outline" className={cn("text-[10px]", src.border, src.bg, src.text)}>
              {src.label}
            </Badge>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevertStage}
            disabled={currentStageIdx <= 0}
            className="gap-1.5 text-xs"
          >
            <ArrowLeftIcon className="size-3.5" />
            Revert Stage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextStage}
            disabled={currentStageIdx >= PIPELINE_STAGES.length - 1}
            className="gap-1.5 border-emerald-500/30 text-xs text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
          >
            Next Stage
            <ArrowRight className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleWaitlist}
            className="gap-1.5 border-amber-500/30 text-xs text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"
          >
            Waitlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="gap-1.5 border-red-500/30 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-500"
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => setOnboardingOpen(true)}
            disabled={applicant.stage !== "selected"}
            className="gap-1.5 shadow-md shadow-primary/20 text-xs"
          >
            <Briefcase className="size-3.5" />
            Add Onboarding Details
          </Button>
        </div>
      </div>

      {/* Visual Stage Tracker (Chevron) */}
      <div className="mb-6 rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Pipeline Tracker
        </p>

        {/* Desktop Chevron */}
        <div className="hidden items-center gap-0 sm:flex">
          {PIPELINE_STAGES.map((s, i) => {
            const done = i < currentStageIdx
            const active = i === currentStageIdx
            const sc = STAGE_COLORS[s.id]
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div
                  className={cn(
                    "flex h-10 flex-1 items-center justify-center text-xs font-medium transition-all",
                    i === 0 ? "rounded-l-lg" : "",
                    i === PIPELINE_STAGES.length - 1 ? "rounded-r-lg" : "",
                    done
                      ? "bg-emerald-500/15 text-emerald-500"
                      : active
                      ? cn("ring-1 ring-inset", sc.bg, sc.text, `ring-${sc.text.replace("text-", "")}/30`)
                      : "bg-muted/20 text-muted-foreground"
                  )}
                  style={active ? { boxShadow: "inset 0 0 0 1px currentColor", opacity: 0.9 } : undefined}
                >
                  {done && <CheckCircle className="mr-1.5 size-3.5" />}
                  {active && <Circle className="mr-1.5 size-3.5 fill-current opacity-40" />}
                  <span className="truncate px-1">{s.label}</span>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <ChevronRight className={cn("mx-0.5 size-4 shrink-0", done ? "text-emerald-500" : "text-border")} />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile Vertical */}
        <div className="flex flex-col gap-2 sm:hidden">
          {PIPELINE_STAGES.map((s, i) => {
            const done = i < currentStageIdx
            const active = i === currentStageIdx
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                      done
                        ? "border-emerald-500 bg-emerald-500 text-background"
                        : active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/50 bg-muted/30 text-muted-foreground"
                    )}
                  >
                    {done ? <CheckCircle className="size-3.5" /> : i + 1}
                  </div>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div className={cn("h-4 w-px", done ? "bg-emerald-500" : "bg-border/40")} />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    active ? "font-semibold text-foreground" : done ? "text-emerald-500" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 360 Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-1 bg-card/60 p-1 backdrop-blur-xl">
          <TabsTrigger value="context" className="gap-1.5 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            <User className="size-3.5" />
            Context & Profile
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            <FileText className="size-3.5" />
            Documents Vault
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-1.5 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            <CheckCircle className="size-3.5" />
            Task Manager
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            <Clock className="size-3.5" />
            Audit & Activity
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Context & Profile */}
        <TabsContent value="context">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Applicant Details
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileRow icon={<User className="size-4 text-muted-foreground" />} label="Full Name" value={applicant.name} />
              <ProfileRow icon={<Mail className="size-4 text-muted-foreground" />} label="Email" value={applicant.email} />
              <ProfileRow icon={<Phone className="size-4 text-muted-foreground" />} label="Phone" value={applicant.phone} />
              <ProfileRow icon={<MapPin className="size-4 text-muted-foreground" />} label="Place / City" value={applicant.place} />
              <ProfileRow icon={<GraduationCap className="size-4 text-muted-foreground" />} label="Highest Qualification" value={qualLabel} />
              <ProfileRow icon={<Shield className="size-4 text-muted-foreground" />} label="Aadhaar Number" value={applicant.aadhaar} />
              <ProfileRow icon={<Briefcase className="size-4 text-muted-foreground" />} label="Applied Drive" value={applicant.driveTitle} />
              <ProfileRow icon={<Calendar className="size-4 text-muted-foreground" />} label="Applied On" value={applicant.createdAt} />
              {applicant.referredBy && (
                <ProfileRow icon={<User className="size-4 text-muted-foreground" />} label="Referred By" value={applicant.referredBy} />
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Documents Vault */}
        <TabsContent value="documents">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Uploaded Documents
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Resume */}
              <div className="rounded-xl border border-border/40 bg-background/30 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">Resume</p>
                    <p className="text-[11px] text-muted-foreground">
                      {applicant.resumeFileName ?? "Not uploaded"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                    <Download className="size-3" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs text-amber-500 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500">
                    <RefreshCw className="size-3" />
                    Re-upload
                  </Button>
                </div>
              </div>

              {/* Aadhaar */}
              <div className="rounded-xl border border-border/40 bg-background/30 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Shield className="size-5 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">Aadhaar Card</p>
                    <p className="text-[11px] text-muted-foreground">Identity Proof</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                    <Download className="size-3" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs text-amber-500 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500">
                    <RefreshCw className="size-3" />
                    Re-upload
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Task Manager */}
        <TabsContent value="tasks">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              HR Tasks
            </p>

            {/* Add Task */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                placeholder="+ Create Task (e.g. Schedule Technical Interview)"
                className="flex-1 rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <Button size="icon" className="size-9 shrink-0" onClick={handleAddTask}>
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-2">
              {applicant.tasks.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No tasks yet. Create one above.</p>
              )}
              {applicant.tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleApplicantTask(applicantId, t.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                    t.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-border/30 bg-background/30 hover:border-primary/30"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      t.done ? "border-emerald-500 bg-emerald-500 text-background" : "border-border/60"
                    )}
                  >
                    {t.done && <CheckCircle className="size-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", t.done ? "text-muted-foreground line-through" : "text-foreground")}>{t.text}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Created by {t.createdBy} on {t.createdAt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Audit & Activity History */}
        <TabsContent value="audit">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Activity Timeline
            </p>

            <div className="relative flex flex-col gap-0">
              <div className="absolute left-4 top-3 bottom-3 w-px bg-border/40" />

              {[...applicant.timeline].reverse().map((e) => (
                <div key={e.id} className="relative flex gap-4 pb-5 last:pb-0">
                  <div
                    className={cn(
                      "relative z-10 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border",
                      e.type === "stage-change"
                        ? "border-primary/40 bg-primary/10"
                        : e.type === "task"
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : e.type === "note"
                        ? "border-amber-500/40 bg-amber-500/10"
                        : e.type === "document"
                        ? "border-violet-500/40 bg-violet-500/10"
                        : "border-border/40 bg-card/60"
                    )}
                  >
                    {e.type === "stage-change" && <ChevronRight className="size-3.5 text-primary" />}
                    {e.type === "task" && <CheckCircle className="size-3.5 text-emerald-500" />}
                    {e.type === "note" && <FileText className="size-3.5 text-amber-500" />}
                    {e.type === "document" && <FileText className="size-3.5 text-violet-500" />}
                    {e.type === "system" && <Clock className="size-3.5 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm text-foreground">{e.text}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {e.by} at {e.at}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <OnboardingModal
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        applicantName={applicant.name}
        onConfirm={handleOnboardConfirm}
      />
    </DashboardShell>
  )
}

/* ── Profile Row ──────────────────────────────── */

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-background/30 px-3 py-3">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
