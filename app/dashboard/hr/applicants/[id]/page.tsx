"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Phone, MapPin, Mail, GraduationCap,
  FileText, Download, RefreshCw, Plus, Send,
  CheckCircle, Circle, ChevronRight, Clock,
  ArrowRight, ArrowLeftIcon, AlertTriangle,
  Briefcase, Shield, Calendar, X, User,
  Upload, Wallet, Check,
  ChevronDown as ChevronDownIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Sheet, SheetContent,
} from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"
import {
  useATSStore,
  PIPELINE_STAGES,
  STAGE_COLORS,
  SOURCE_COLORS,
  type ApplicantStage,
  type Applicant,
} from "@/stores/ats-store"

/* ── Types for Onboarding Form ─────────────────── */

type SystemRole = "teacher" | "driver" | "admin" | "accountant" | "librarian" | "support"
type TeacherCategory = "PGT" | "TGT" | "PRT" | "Pre-Primary" | "Mother Teacher" | "Guest Lecturer"
type EmpType = "full-time" | "part-time" | "internship"

/* ── Full Onboarding Sheet (90 vw -- Admission-style UI) ── */

function OnboardingSheet({
  open,
  onOpenChange,
  applicant,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  applicant: Applicant
  onConfirm: () => void
}) {
  const qualLabel = applicant.qualification === "post-graduation" ? "Master's" : applicant.qualification === "phd" ? "Doctorate" : "Bachelor's"

  /* Step 1: Personal -- pre-filled */
  const [fullName, setFullName] = useState(applicant.name)
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [blood, setBlood] = useState("")
  const [marital, setMarital] = useState("")
  const [emergency, setEmergency] = useState(applicant.phone)
  const [aadhaar, setAadhaar] = useState(applicant.aadhaar)
  const [pan, setPan] = useState("")
  const [uan, setUan] = useState("")

  /* Step 2: Education -- qualification pre-filled */
  const [qualification, setQualification] = useState(qualLabel)
  const [yearPass, setYearPass] = useState("")
  const [totalExp, setTotalExp] = useState("")

  /* Step 3: Employment */
  const [empType, setEmpType] = useState<EmpType>("full-time")
  const [shift, setShift] = useState("")

  /* Step 4: Role */
  const [sysRole, setSysRole] = useState<SystemRole>("teacher")
  const [teacherCat, setTeacherCat] = useState<TeacherCategory>("TGT")
  const [bedStatus, setBedStatus] = useState("")
  const [ctet, setCtet] = useState("no")
  const [subjects, setSubjects] = useState("")
  const [licenseType, setLicenseType] = useState("")
  const [licenseExpiry, setLicenseExpiry] = useState("")
  const [badgeNo, setBadgeNo] = useState("")
  const [eyeTest, setEyeTest] = useState("")

  /* Step 5: Compensation */
  const [ctc, setCtc] = useState("")
  const [grossSalary, setGrossSalary] = useState("")
  const [basic, setBasic] = useState("")
  const [hra, setHra] = useState("")
  const [da, setDa] = useState("")
  const [pfPct, setPfPct] = useState("12")
  const [profTax, setProfTax] = useState("")
  const [bankName, setBankName] = useState("")
  const [accNo, setAccNo] = useState("")
  const [ifsc, setIfsc] = useState("")

  /* Step 6: Documents */
  const [joiningDate, setJoiningDate] = useState("")

  const isTeacher = sysRole === "teacher"
  const isDriver = sysRole === "driver"
  const showShift = empType === "part-time" || empType === "internship"

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
              <Briefcase className="size-5 shrink-0 text-primary" />
              <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
                Onboarding - {applicant.name}
              </h2>
              <Badge variant="outline" className="hidden border-primary/30 bg-primary/5 text-[10px] text-primary sm:inline-flex">
                {applicant.appliedRole}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="hidden border-border/50 text-xs sm:flex">Cancel</Button>
              <Button size="sm" onClick={onConfirm} className="shadow-md shadow-primary/20 text-xs">
                <Check className="mr-1.5 size-3.5" />Complete Onboarding
              </Button>
              <button onClick={() => onOpenChange(false)} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Split Body */}
          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">

            {/* LEFT: Pre-filled Summary Panel (Desktop only) */}
            <div className="hidden flex-col gap-4 border-r border-border/30 bg-muted/10 p-5 lg:flex lg:w-[340px] lg:shrink-0 lg:overflow-y-auto">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pre-filled from Application</p>

              <div className="flex flex-col gap-2">
                <SummaryRow label="Full Name" value={applicant.name} filled />
                <SummaryRow label="Email" value={applicant.email} filled />
                <SummaryRow label="Phone" value={applicant.phone} filled />
                <SummaryRow label="Place" value={applicant.place} filled />
                <SummaryRow label="Qualification" value={qualLabel} filled />
                <SummaryRow label="Aadhaar" value={applicant.aadhaar} filled />
                <SummaryRow label="Applied Drive" value={applicant.driveTitle} filled />
                <SummaryRow label="Applied Role" value={applicant.appliedRole} filled />
                {applicant.referredBy && <SummaryRow label="Referred By" value={applicant.referredBy} filled />}
              </div>

              <div className="mt-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Status</p>
                <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">Selected for Onboarding</p>
              </div>

              {/* Upload zone for additional docs */}
              <div className="mt-auto rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/10">
                <Upload className="mx-auto size-6 text-primary/60" />
                <p className="mt-1.5 text-xs font-medium text-foreground">Upload Documents</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Drop certificates, ID proofs, or photos</p>
              </div>
            </div>

            {/* RIGHT: Tabbed Data Entry */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="mb-5 w-full justify-start gap-1 overflow-x-auto bg-muted/30 no-scrollbar">
                  <TabsTrigger value="personal" className="shrink-0 gap-1.5 text-xs"><User className="size-3" />Personal & Statutory</TabsTrigger>
                  <TabsTrigger value="education" className="shrink-0 gap-1.5 text-xs"><GraduationCap className="size-3" />Education</TabsTrigger>
                  <TabsTrigger value="employment" className="shrink-0 gap-1.5 text-xs"><Briefcase className="size-3" />Employment & Shifts</TabsTrigger>
                  <TabsTrigger value="role" className="shrink-0 gap-1.5 text-xs"><Shield className="size-3" />Role & Permissions</TabsTrigger>
                  <TabsTrigger value="compensation" className="shrink-0 gap-1.5 text-xs"><Wallet className="size-3" />Compensation</TabsTrigger>
                  <TabsTrigger value="documents" className="shrink-0 gap-1.5 text-xs"><Upload className="size-3" />Document Locker</TabsTrigger>
                </TabsList>

                {/* TAB 1: Personal & Statutory */}
                <TabsContent value="personal" className="flex flex-col gap-4">
                  <SectionLabel text="Basic Identity" />
                  <OnboardField label="Full Name *" value={fullName} onChange={setFullName} placeholder="Full legal name" prefilled />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <OnboardField label="Date of Birth" type="date" value={dob} onChange={setDob} />
                    <OnboardSelect label="Blood Group" value={blood} onChange={setBlood} options={["", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} />
                    <OnboardSelect label="Gender" value={gender} onChange={setGender} options={["", "Male", "Female", "Other"]} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <OnboardSelect label="Marital Status" value={marital} onChange={setMarital} options={["", "Single", "Married", "Divorced", "Widowed"]} />
                    <OnboardField label="Emergency Contact" value={emergency} onChange={setEmergency} placeholder="Phone number" prefilled />
                  </div>
                  <SectionLabel text="Statutory Details" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <OnboardField label="Aadhaar No" value={aadhaar} onChange={setAadhaar} placeholder="12-digit Aadhaar" prefilled />
                    <OnboardField label="PAN No" value={pan} onChange={setPan} placeholder="ABCDE1234F" />
                    <OnboardField label="UAN (PF Number)" value={uan} onChange={setUan} placeholder="UAN number" />
                  </div>
                </TabsContent>

                {/* TAB 2: Education & Experience */}
                <TabsContent value="education" className="flex flex-col gap-4">
                  <SectionLabel text="Education" />
                  <OnboardSelect label="Highest Qualification" value={qualification} onChange={setQualification} options={["", "Not Educated", "Primary", "10th Pass", "12th Pass", "Diploma", "Bachelor's", "Master's", "Doctorate"]} prefilled />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <OnboardField label="Year of Passing / Graduation" value={yearPass} onChange={setYearPass} placeholder="e.g. 2018" />
                    <OnboardField label="Total Years of Experience" value={totalExp} onChange={setTotalExp} placeholder="e.g. 5" />
                  </div>
                </TabsContent>

                {/* TAB 3: Employment & Shifts */}
                <TabsContent value="employment" className="flex flex-col gap-4">
                  <SectionLabel text="Employment Type" />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {(["full-time", "part-time", "internship"] as const).map(t => (
                      <button key={t} onClick={() => setEmpType(t)} className={cn(
                        "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        empType === t ? "border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/30" : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/20"
                      )}>
                        {t === "full-time" ? "Full-Time" : t === "part-time" ? "Part-Time" : "Internship"}
                      </button>
                    ))}
                  </div>
                  {showShift && (
                    <>
                      <SectionLabel text="Shift Timing" />
                      <div className="flex flex-col gap-2 sm:flex-row">
                        {["First Half (08:00-12:00)", "Second Half (12:00-16:00)", "Custom Hours"].map(s => (
                          <button key={s} onClick={() => setShift(s)} className={cn(
                            "flex-1 rounded-xl border px-4 py-3 text-xs font-medium transition-all",
                            shift === s ? "border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/30" : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/20"
                          )}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <SectionLabel text="Joining Details" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <OnboardField label="Joining Date" type="date" value={joiningDate} onChange={setJoiningDate} />
                    <OnboardField label="Employee ID" value="" onChange={() => {}} placeholder="Auto-generated on save" />
                  </div>
                </TabsContent>

                {/* TAB 4: Role & Permissions */}
                <TabsContent value="role" className="flex flex-col gap-4">
                  <SectionLabel text="System Role" />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(["teacher", "driver", "admin", "accountant", "librarian", "support"] as const).map(r => (
                      <button key={r} onClick={() => setSysRole(r)} className={cn(
                        "rounded-xl border px-3 py-2.5 text-xs font-medium capitalize transition-all",
                        sysRole === r ? "border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/30" : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/20"
                      )}>
                        {r}
                      </button>
                    ))}
                  </div>

                  {isTeacher && (
                    <>
                      <SectionLabel text="Teacher Details" />
                      <OnboardSelect label="Teacher Category" value={teacherCat} onChange={v => setTeacherCat(v as TeacherCategory)} options={["PGT", "TGT", "PRT", "Pre-Primary", "Mother Teacher", "Guest Lecturer"]} />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <OnboardSelect label="B.Ed / M.Ed Status" value={bedStatus} onChange={setBedStatus} options={["", "B.Ed Completed", "M.Ed Completed", "In Progress", "Not Applicable"]} />
                        <OnboardSelect label="CTET Qualified?" value={ctet} onChange={setCtet} options={["no", "yes"]} />
                      </div>
                      <OnboardField label="Subject Specializations" value={subjects} onChange={setSubjects} placeholder="e.g. Mathematics, Physics" />
                    </>
                  )}

                  {isDriver && (
                    <>
                      <SectionLabel text="Driver Credentials" />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <OnboardSelect label="License Type" value={licenseType} onChange={setLicenseType} options={["", "LMV", "HMV", "Both"]} />
                        <OnboardField label="License Expiry Date" type="date" value={licenseExpiry} onChange={setLicenseExpiry} />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <OnboardField label="Badge Number" value={badgeNo} onChange={setBadgeNo} placeholder="Badge number" />
                        <OnboardField label="Last Eye Vision Test Date" type="date" value={eyeTest} onChange={setEyeTest} />
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* TAB 5: Compensation & Payroll */}
                <TabsContent value="compensation" className="flex flex-col gap-4">
                  <SectionLabel text="Salary & Compensation" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <OnboardField label="Annual CTC" value={ctc} onChange={setCtc} placeholder="e.g. 600000" />
                    <OnboardField label="Monthly Gross Salary" value={grossSalary} onChange={setGrossSalary} placeholder="e.g. 50000" />
                    <OnboardField label="Basic Pay" value={basic} onChange={setBasic} placeholder="e.g. 25000" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <OnboardField label="HRA" value={hra} onChange={setHra} placeholder="e.g. 10000" />
                    <OnboardField label="DA" value={da} onChange={setDa} placeholder="e.g. 5000" />
                    <OnboardField label="PF Deduction %" value={pfPct} onChange={setPfPct} placeholder="12" />
                  </div>
                  <OnboardField label="Professional Tax" value={profTax} onChange={setProfTax} placeholder="e.g. 200" />

                  <SectionLabel text="Bank Details" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <OnboardField label="Bank Name" value={bankName} onChange={setBankName} placeholder="Bank name" />
                    <OnboardField label="Account Number" value={accNo} onChange={setAccNo} placeholder="Account number" />
                    <OnboardField label="IFSC Code" value={ifsc} onChange={setIfsc} placeholder="IFSC code" />
                  </div>
                </TabsContent>

                {/* TAB 6: Document Locker */}
                <TabsContent value="documents" className="flex flex-col gap-4">
                  <p className="text-[11px] text-muted-foreground">Required documents for employee record. Some may have been uploaded during the hiring pipeline.</p>

                  <SectionLabel text="Mandatory Documents" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {["Photo", "Aadhaar Card", "PAN Card", "Cancelled Cheque"].map(doc => (
                      <DocUploadRow key={doc} label={doc} status={doc === "Aadhaar Card" ? "uploaded" : "pending"} />
                    ))}
                  </div>

                  {isTeacher && (
                    <>
                      <SectionLabel text="Teacher Documents" />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DocUploadRow label="Degree Certificate" status="pending" />
                        <DocUploadRow label="B.Ed Certificate" status="pending" />
                        <DocUploadRow label="CTET Certificate" status="pending" />
                        <DocUploadRow label="Experience Letter" status="pending" />
                      </div>
                    </>
                  )}

                  {isDriver && (
                    <>
                      <SectionLabel text="Driver Documents" />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DocUploadRow label="Driving License" status="pending" />
                        <DocUploadRow label="Eye Test Report" status="pending" />
                      </div>
                    </>
                  )}

                  <SectionLabel text="Resume (From Application)" />
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-emerald-500" />
                        <span className="text-sm font-medium text-foreground">{applicant.resumeFileName ?? "Not uploaded"}</span>
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">From Pipeline</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <Download className="size-3" />Download
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex items-center justify-between border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl sm:px-6">
            <p className="text-[11px] text-muted-foreground">
              Fields pre-filled from application are marked with a green indicator
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-border/50 text-xs">Cancel</Button>
              <Button size="sm" onClick={onConfirm} className="shadow-md shadow-primary/20 text-xs">
                <Check className="mr-1.5 size-3.5" />Complete Onboarding
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
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

      <OnboardingSheet
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        applicant={applicant}
        onConfirm={handleOnboardConfirm}
      />
    </DashboardShell>
  )
}

/* ── Helper Components ───────────────────────── */

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

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 first:mt-0">
      <div className="h-px flex-1 bg-border/30" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{text}</span>
      <div className="h-px flex-1 bg-border/30" />
    </div>
  )
}

function SummaryRow({ label, value, filled }: { label: string; value: string; filled?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-background/30 px-3 py-2">
      {filled && <div className="size-1.5 shrink-0 rounded-full bg-emerald-500" />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-xs font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

function OnboardField({ label, value, onChange, placeholder, type = "text", prefilled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; prefilled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {prefilled && <span className="inline-flex size-1.5 rounded-full bg-emerald-500" title="Pre-filled from application" />}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30",
          prefilled && value ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-background/80"
        )}
      />
    </div>
  )
}

function OnboardSelect({ label, value, onChange, options, prefilled }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; prefilled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {prefilled && <span className="inline-flex size-1.5 rounded-full bg-emerald-500" title="Pre-filled from application" />}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full rounded-lg border px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30",
          prefilled && value ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-background/80"
        )}
      >
        {options.map(o => <option key={o} value={o}>{o || "Select..."}</option>)}
      </select>
    </div>
  )
}

function DocUploadRow({ label, status }: { label: string; status: "pending" | "uploaded" | "verified" }) {
  const statusStyle = status === "verified"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
    : status === "uploaded"
    ? "border-sky-500/30 bg-sky-500/10 text-sky-500"
    : "border-amber-500/30 bg-amber-500/10 text-amber-500"

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/30 bg-background/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("text-[10px] capitalize", statusStyle)}>{status}</Badge>
        {status === "pending" ? (
          <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px] border-border/50">
            <Upload className="size-3" />Upload
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]">
            <Download className="size-3" />View
          </Button>
        )}
      </div>
    </div>
  )
}
