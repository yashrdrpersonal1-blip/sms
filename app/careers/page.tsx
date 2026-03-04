"use client"

import { useState } from "react"
import {
  Briefcase, MapPin, Clock, Upload, CheckCircle,
  AlertTriangle, X, ChevronRight, ArrowLeft,
  GraduationCap, FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  useATSStore,
  COOLDOWN_AADHAAR_LIST,
  type Applicant,
  type HiringDrive,
} from "@/stores/ats-store"

/* ── Application Form ─────────────────────────── */

function ApplicationForm({
  drive,
  onClose,
}: {
  drive: HiringDrive
  onClose: () => void
}) {
  const addApplicant = useATSStore((s) => s.addApplicant)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [place, setPlace] = useState("")
  const [qualification, setQualification] = useState<"graduation" | "post-graduation" | "phd">("graduation")
  const [aadhaar, setAadhaar] = useState("")
  const [fileName, setFileName] = useState("")
  const [dragging, setDragging] = useState(false)
  const [cooldownError, setCooldownError] = useState("")
  const [success, setSuccess] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setFileName(file.name)
  }

  function handleSubmit() {
    if (!name.trim() || !email.trim() || !phone.trim() || !place.trim() || !aadhaar.trim()) return

    // Cooldown check
    const cleaned = aadhaar.replace(/\s/g, "")
    const blocked = COOLDOWN_AADHAAR_LIST.find(
      (c) => c.aadhaar.replace(/\s/g, "") === cleaned
    )
    if (blocked) {
      setCooldownError(
        `Application blocked. Our records indicate you have interviewed with us in the past 6 months (${blocked.lastAction} on ${blocked.date}). Please reapply after your cooldown period ends.`
      )
      return
    }

    const applicant: Applicant = {
      id: `ap-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      place: place.trim(),
      qualification,
      aadhaar: aadhaar.trim(),
      stage: "applied",
      source: "portal",
      driveId: drive.id,
      driveTitle: drive.title,
      appliedRole: drive.title.split(" - ")[0],
      resumeFileName: fileName || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: "Careers Portal",
      tasks: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: "system",
          text: "Application received via Public Careers Portal",
          by: "System",
          at: new Date().toISOString().slice(0, 16).replace("T", " "),
        },
        {
          id: `t-${Date.now() + 1}`,
          type: "stage-change",
          text: "Stage set to Applied",
          by: "System",
          at: new Date().toISOString().slice(0, 16).replace("T", " "),
        },
      ],
    }

    addApplicant(applicant)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle className="size-8 text-emerald-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Application Submitted!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you for applying. We will review your application and get back to you soon.
          </p>
        </div>
        <Button onClick={onClose} className="mt-2">
          Back to Careers
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground sm:text-lg">
            Apply: {drive.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {drive.employmentType === "full-time" ? "Full-Time" : drive.employmentType === "part-time" ? "Part-Time" : "Contract"}
            {drive.salaryDisclosure === "disclose-range" && drive.salaryRange && ` | ${drive.salaryRange}`}
          </p>
        </div>
        <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      {cooldownError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{cooldownError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full Name *" value={name} onChange={setName} placeholder="Your full name" />
        <FormField label="Email Address *" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Mobile Number *" value={phone} onChange={setPhone} placeholder="10-digit mobile number" />
        <FormField label="Place / City *" value={place} onChange={setPlace} placeholder="Your city" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Highest Qualification *</label>
          <select value={qualification} onChange={(e) => setQualification(e.target.value as "graduation" | "post-graduation" | "phd")} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30">
            <option value="graduation">Graduation</option>
            <option value="post-graduation">Post-Graduation</option>
            <option value="phd">PhD</option>
          </select>
        </div>
        <FormField label="Aadhaar Card Number *" value={aadhaar} onChange={(v) => { setAadhaar(v); setCooldownError("") }} placeholder="XXXX-XXXX-XXXX" />
      </div>

      {/* Resume Upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Resume (PDF/DOCX)</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragging ? "border-primary/60 bg-primary/5" : "border-border/50 bg-background/30",
          )}
        >
          <Upload className="size-6 text-muted-foreground" />
          {fileName ? (
            <p className="text-sm font-medium text-foreground">{fileName}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Drag and drop your resume here, or click to browse</p>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full shadow-md shadow-primary/20" disabled={!name.trim() || !email.trim() || !phone.trim() || !aadhaar.trim()}>
        Submit Application
      </Button>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
      />
    </div>
  )
}

/* ── Drive Card ───────────────────────────────── */

function DriveCard({
  drive,
  onApply,
}: {
  drive: HiringDrive
  onApply: () => void
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/60 p-5 shadow-2xl backdrop-blur-2xl transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground sm:text-base text-balance">
              {drive.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <Badge variant="outline" className="border-border/40 text-[10px] text-muted-foreground">
                {drive.employmentType === "full-time" ? "Full-Time" : drive.employmentType === "part-time" ? "Part-Time" : "Contract"}
              </Badge>
              {drive.sourceType === "walk-in" && (
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-500">
                  Walk-In
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {drive.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {drive.description}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-border/20 pt-3">
        <div className="flex flex-col gap-0.5">
          {drive.salaryDisclosure === "disclose-range" && drive.salaryRange && (
            <p className="text-xs font-medium text-foreground">{drive.salaryRange}</p>
          )}
          <p className="text-[10px] text-muted-foreground">
            {drive.totalApplicants} applicants
          </p>
        </div>
        <Button size="sm" onClick={onApply} className="gap-1.5 shadow-md shadow-primary/20 text-xs">
          Apply Now
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────── */

export default function CareersPortalPage() {
  const drives = useATSStore((s) => s.drives)
  const openDrives = drives.filter((d) => d.status === "open")
  const [selectedDrive, setSelectedDrive] = useState<HiringDrive | null>(null)

  return (
    <div className="min-h-dvh bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/30">
        {/* Ambient glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/4 size-96 rounded-full bg-primary/[0.08] blur-[100px]" />
          <div className="absolute -bottom-40 right-1/4 size-80 rounded-full bg-primary/[0.06] blur-[80px]" />
        </div>

        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary text-xs">
            <GraduationCap className="mr-1.5 size-3.5" />
            Now Hiring
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Join Our Faculty.<br />Shape the Future.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Become part of an institution committed to excellence in education.
            Explore our open positions and build a fulfilling career.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4" />
              {openDrives.length} Open Positions
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              Rewari, Haryana
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10">
        {selectedDrive ? (
          <div>
            <button
              onClick={() => setSelectedDrive(null)}
              className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to Open Positions
            </button>
            <div className="rounded-2xl border border-border/40 bg-card/60 p-5 shadow-2xl backdrop-blur-2xl sm:p-8">
              <ApplicationForm
                drive={selectedDrive}
                onClose={() => setSelectedDrive(null)}
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mb-6 text-lg font-bold text-foreground sm:text-xl">
              Open Positions
            </h2>
            {openDrives.length === 0 ? (
              <div className="rounded-2xl border border-border/40 bg-card/60 py-16 text-center shadow-2xl backdrop-blur-2xl">
                <Briefcase className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No open positions at the moment. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {openDrives.map((d) => (
                  <DriveCard
                    key={d.id}
                    drive={d}
                    onApply={() => setSelectedDrive(d)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground">
        GroveHub School ERP &middot; Careers Portal
      </div>
    </div>
  )
}
