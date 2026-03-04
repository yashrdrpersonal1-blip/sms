"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, ArrowRight, Check, User, GraduationCap,
  Briefcase, Shield, Wallet, Upload, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Step config ──────────────────────────── */

const STEPS = [
  { id: 1, label: "Personal & Statutory", icon: User, short: "Personal" },
  { id: 2, label: "Education & Experience", icon: GraduationCap, short: "Education" },
  { id: 3, label: "Employment & Shifts", icon: Briefcase, short: "Employment" },
  { id: 4, label: "Role & Permissions", icon: Shield, short: "Role" },
  { id: 5, label: "Compensation & Payroll", icon: Wallet, short: "Payroll" },
  { id: 6, label: "Document Locker", icon: Upload, short: "Documents" },
]

type SystemRole = "teacher" | "driver" | "admin" | "accountant" | "librarian" | "support"
type TeacherCategory = "PGT" | "TGT" | "PRT" | "Pre-Primary" | "Mother Teacher" | "Guest Lecturer"
type EmpType = "full-time" | "part-time" | "internship"

/* ── Page ──────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1: Personal
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [blood, setBlood] = useState("")
  const [marital, setMarital] = useState("")
  const [emergency, setEmergency] = useState("")
  const [aadhaar, setAadhaar] = useState("")
  const [pan, setPan] = useState("")
  const [uan, setUan] = useState("")

  // Step 2: Education
  const [qualification, setQualification] = useState("")
  const [yearPass, setYearPass] = useState("")
  const [totalExp, setTotalExp] = useState("")

  // Step 3: Employment
  const [empType, setEmpType] = useState<EmpType>("full-time")
  const [shift, setShift] = useState("")

  // Step 4: Role
  const [sysRole, setSysRole] = useState<SystemRole>("teacher")
  const [teacherCat, setTeacherCat] = useState<TeacherCategory>("TGT")
  const [bedStatus, setBedStatus] = useState("")
  const [ctet, setCtet] = useState("no")
  const [subjects, setSubjects] = useState("")
  const [licenseType, setLicenseType] = useState("")
  const [licenseExpiry, setLicenseExpiry] = useState("")
  const [badgeNo, setBadgeNo] = useState("")
  const [eyeTest, setEyeTest] = useState("")

  // Step 5: Compensation
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

  const isTeacher = sysRole === "teacher"
  const isDriver = sysRole === "driver"
  const showShift = empType === "part-time" || empType === "internship"

  function nextStep() { if (step < 6) setStep(s => s + 1) }
  function prevStep() { if (step > 1) setStep(s => s - 1) }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/hr/staff")} className="flex size-8 items-center justify-center rounded-lg border border-border/40 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">Onboarding Desk</h1>
            <p className="text-xs text-muted-foreground">Step {step} of 6 &middot; {STEPS[step - 1].label}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
          {/* Desktop */}
          <div className="hidden items-center gap-1 sm:flex">
            {STEPS.map((s, i) => {
              const done = i < step - 1
              const active = i === step - 1
              const Icon = s.icon
              return (
                <div key={s.id} className="flex flex-1 items-center">
                  <button onClick={() => setStep(s.id)} className={cn(
                    "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-all",
                    done ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" :
                    active ? "border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/30" :
                    "border-border/30 bg-muted/20 text-muted-foreground"
                  )}>
                    {done ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                    <span className="hidden lg:inline">{s.short}</span>
                  </button>
                  {i < STEPS.length - 1 && <ArrowRight className={cn("mx-0.5 size-3.5 shrink-0", done ? "text-emerald-500" : "text-border")} />}
                </div>
              )
            })}
          </div>
          {/* Mobile */}
          <div className="flex items-center gap-2 sm:hidden">
            {STEPS.map((s, i) => {
              const done = i < step - 1
              const active = i === step - 1
              return (
                <button key={s.id} onClick={() => setStep(s.id)} className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-[10px] font-bold transition-all",
                  done ? "border-emerald-500 bg-emerald-500 text-white" :
                  active ? "border-primary bg-primary text-primary-foreground" :
                  "border-border/50 bg-muted/30 text-muted-foreground"
                )}>
                  {done ? <Check className="size-3" /> : s.id}
                </button>
              )
            })}
            <span className="ml-2 text-xs font-medium text-foreground">{STEPS[step - 1].short}</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-2xl sm:p-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <SectionLabel text="Basic Identity" />
              <FormField label="Full Name *" value={fullName} onChange={setFullName} placeholder="Full legal name" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField label="Date of Birth" type="date" value={dob} onChange={setDob} />
                <FormSelect label="Blood Group" value={blood} onChange={setBlood} options={["", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} />
                <FormSelect label="Gender" value={gender} onChange={setGender} options={["", "Male", "Female", "Other"]} />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormSelect label="Marital Status" value={marital} onChange={setMarital} options={["", "Single", "Married", "Divorced", "Widowed"]} />
                <FormField label="Emergency Contact" value={emergency} onChange={setEmergency} placeholder="Phone number" />
              </div>
              <SectionLabel text="Statutory Details" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField label="Aadhaar No" value={aadhaar} onChange={setAadhaar} placeholder="12-digit Aadhaar" />
                <FormField label="PAN No" value={pan} onChange={setPan} placeholder="ABCDE1234F" />
                <FormField label="UAN (PF Number)" value={uan} onChange={setUan} placeholder="UAN number" />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <SectionLabel text="Education" />
              <FormSelect label="Highest Qualification" value={qualification} onChange={setQualification} options={["", "Not Educated", "Primary", "10th Pass", "12th Pass", "Diploma", "Bachelor's", "Master's", "Doctorate"]} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Year of Passing / Graduation" value={yearPass} onChange={setYearPass} placeholder="e.g. 2018" />
                <FormField label="Total Years of Experience" value={totalExp} onChange={setTotalExp} placeholder="e.g. 5" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
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
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
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
                  <FormSelect label="Teacher Category" value={teacherCat} onChange={v => setTeacherCat(v as TeacherCategory)} options={["PGT", "TGT", "PRT", "Pre-Primary", "Mother Teacher", "Guest Lecturer"]} />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormSelect label="B.Ed / M.Ed Status" value={bedStatus} onChange={setBedStatus} options={["", "B.Ed Completed", "M.Ed Completed", "In Progress", "Not Applicable"]} />
                    <FormSelect label="CTET Qualified?" value={ctet} onChange={setCtet} options={["no", "yes"]} />
                  </div>
                  <FormField label="Subject Specializations" value={subjects} onChange={setSubjects} placeholder="e.g. Mathematics, Physics" />
                </>
              )}

              {isDriver && (
                <>
                  <SectionLabel text="Driver Credentials" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormSelect label="License Type" value={licenseType} onChange={setLicenseType} options={["", "LMV", "HMV", "Both"]} />
                    <FormField label="License Expiry Date" type="date" value={licenseExpiry} onChange={setLicenseExpiry} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Badge Number" value={badgeNo} onChange={setBadgeNo} placeholder="Badge number" />
                    <FormField label="Last Eye Vision Test Date" type="date" value={eyeTest} onChange={setEyeTest} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="flex flex-col gap-4">
              <SectionLabel text="Salary & Compensation" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField label="Annual CTC" value={ctc} onChange={setCtc} placeholder="e.g. 600000" />
                <FormField label="Monthly Gross Salary" value={grossSalary} onChange={setGrossSalary} placeholder="e.g. 50000" />
                <FormField label="Basic Pay" value={basic} onChange={setBasic} placeholder="e.g. 25000" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField label="HRA" value={hra} onChange={setHra} placeholder="e.g. 10000" />
                <FormField label="DA" value={da} onChange={setDa} placeholder="e.g. 5000" />
                <FormField label="PF Deduction %" value={pfPct} onChange={setPfPct} placeholder="12" />
              </div>
              <FormField label="Professional Tax" value={profTax} onChange={setProfTax} placeholder="e.g. 200" />

              <SectionLabel text="Bank Details" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormField label="Bank Name" value={bankName} onChange={setBankName} placeholder="Bank name" />
                <FormField label="Account Number" value={accNo} onChange={setAccNo} placeholder="Account number" />
                <FormField label="IFSC Code" value={ifsc} onChange={setIfsc} placeholder="IFSC code" />
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="flex flex-col gap-4">
              <SectionLabel text="Mandatory Documents" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Photo", "Aadhaar Card", "PAN Card", "Cancelled Cheque"].map(doc => (
                  <DocUploadZone key={doc} label={doc} />
                ))}
              </div>

              {isTeacher && (
                <>
                  <SectionLabel text="Teacher Documents" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DocUploadZone label="Degree Certificate" />
                    <DocUploadZone label="CTET Certificate" />
                  </div>
                </>
              )}

              {isDriver && (
                <>
                  <SectionLabel text="Driver Documents" />
                  <DocUploadZone label="Driving License" />
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={prevStep} disabled={step === 1} className="gap-1.5 border-border/50">
            <ArrowLeft className="size-3.5" />Previous
          </Button>
          {step < 6 ? (
            <Button size="sm" onClick={nextStep} className="gap-1.5 shadow-md shadow-primary/20">
              Next<ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => router.push("/dashboard/hr/staff")} className="gap-1.5 shadow-md shadow-primary/20">
              <Check className="size-3.5" />Complete Onboarding
            </Button>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}

/* ── Helpers ──────────────────────────────── */

function SectionLabel({ text }: { text: string }) {
  return <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{text}</p>
}

function FormField({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30" />
    </div>
  )
}

function FormSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30">
        {options.map(o => <option key={o} value={o}>{o || "Select..."}</option>)}
      </select>
    </div>
  )
}

function DocUploadZone({ label }: { label: string }) {
  const [uploaded, setUploaded] = useState(false)
  return (
    <button onClick={() => setUploaded(v => !v)} className={cn(
      "flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-all",
      uploaded ? "border-emerald-500/30 bg-emerald-500/5" : "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
    )}>
      {uploaded ? <Check className="size-6 text-emerald-500" /> : <Upload className="size-6 text-primary/60" />}
      <p className={cn("text-xs font-medium", uploaded ? "text-emerald-500" : "text-foreground")}>{label}</p>
      <p className="text-[10px] text-muted-foreground">{uploaded ? "Uploaded (click to remove)" : "Click to upload"}</p>
    </button>
  )
}
