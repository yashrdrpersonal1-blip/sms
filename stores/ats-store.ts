import { create } from "zustand"

/* ── Types ─────────────────────────────────────────── */

export type DriveStatus = "open" | "closed" | "cancelled"
export type EmploymentType = "full-time" | "part-time" | "contract"
export type SourceType = "standard" | "walk-in"
export type SalaryDisclosure = "disclose-range" | "hidden"
export type ApplicantStage = "applied" | "screening" | "interview" | "doc-verification" | "selected" | "onboarded"
export type ApplicantSource = "portal" | "walk-in" | "referral" | "agency"

export interface HiringDrive {
  id: string
  title: string
  employmentType: EmploymentType
  status: DriveStatus
  description: string
  salaryDisclosure: SalaryDisclosure
  salaryRange?: string
  sourceType: SourceType
  requiredDocs: string[]
  totalApplicants: number
  createdBy: string
  createdAt: string
}

export interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  place: string
  qualification: "graduation" | "post-graduation" | "phd"
  aadhaar: string
  stage: ApplicantStage
  source: ApplicantSource
  driveId: string
  driveTitle: string
  appliedRole: string
  resumeFileName?: string
  referredBy?: string
  createdAt: string
  createdBy: string
  tasks: ApplicantTask[]
  timeline: TimelineEvent[]
}

export interface ApplicantTask {
  id: string
  text: string
  done: boolean
  createdBy: string
  createdAt: string
}

export interface TimelineEvent {
  id: string
  type: "stage-change" | "task" | "note" | "document" | "system"
  text: string
  by: string
  at: string
}

/* ── Pipeline stages config ────────────────────────── */

export const PIPELINE_STAGES: { id: ApplicantStage; label: string }[] = [
  { id: "applied", label: "Applied" },
  { id: "screening", label: "Screening" },
  { id: "interview", label: "Interview" },
  { id: "doc-verification", label: "Doc Verification" },
  { id: "selected", label: "Selected" },
  { id: "onboarded", label: "Onboarded" },
]

export const STAGE_COLORS: Record<ApplicantStage, { border: string; bg: string; text: string }> = {
  applied: { border: "border-sky-500/30", bg: "bg-sky-500/10", text: "text-sky-500" },
  screening: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-500" },
  interview: { border: "border-indigo-500/30", bg: "bg-indigo-500/10", text: "text-indigo-500" },
  "doc-verification": { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-500" },
  selected: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-500" },
  onboarded: { border: "border-teal-500/30", bg: "bg-teal-500/10", text: "text-teal-500" },
}

export const SOURCE_COLORS: Record<ApplicantSource, { label: string; border: string; bg: string; text: string }> = {
  portal: { label: "Portal", border: "border-sky-500/30", bg: "bg-sky-500/10", text: "text-sky-500" },
  "walk-in": { label: "Walk-In", border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-500" },
  referral: { label: "Referral", border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-500" },
  agency: { label: "Agency", border: "border-rose-500/30", bg: "bg-rose-500/10", text: "text-rose-500" },
}

/* ── Seed Data ─────────────────────────────────────── */

const SEED_DRIVES: HiringDrive[] = [
  {
    id: "hd-1",
    title: "PGT Mathematics - Session 2026-27",
    employmentType: "full-time",
    status: "open",
    description: "Seeking an experienced PGT Mathematics teacher with minimum 5 years experience. Must have M.Sc. in Mathematics with B.Ed.",
    salaryDisclosure: "disclose-range",
    salaryRange: "45,000 - 65,000 /month",
    sourceType: "standard",
    requiredDocs: ["resume", "cover-letter"],
    totalApplicants: 24,
    createdBy: "Alex Johnson",
    createdAt: "2026-02-01",
  },
  {
    id: "hd-2",
    title: "TGT Science - Mid-Term Replacement",
    employmentType: "contract",
    status: "open",
    description: "Contract position for TGT Science to cover maternity leave. Duration: 6 months. Immediate joining required.",
    salaryDisclosure: "hidden",
    sourceType: "standard",
    requiredDocs: ["resume"],
    totalApplicants: 18,
    createdBy: "HR Manager",
    createdAt: "2026-02-15",
  },
  {
    id: "hd-3",
    title: "PRT Hindi - Walk-In Drive March 2026",
    employmentType: "full-time",
    status: "open",
    description: "Walk-in drive for PRT Hindi position. Candidates must bring original documents.",
    salaryDisclosure: "disclose-range",
    salaryRange: "30,000 - 40,000 /month",
    sourceType: "walk-in",
    requiredDocs: ["resume", "cover-letter"],
    totalApplicants: 12,
    createdBy: "Principal",
    createdAt: "2026-03-01",
  },
  {
    id: "hd-4",
    title: "PGT Physics - Session 2025-26",
    employmentType: "full-time",
    status: "closed",
    description: "Position filled. Senior PGT Physics teacher recruited successfully.",
    salaryDisclosure: "hidden",
    sourceType: "standard",
    requiredDocs: ["resume", "cover-letter"],
    totalApplicants: 32,
    createdBy: "Alex Johnson",
    createdAt: "2025-08-10",
  },
  {
    id: "hd-5",
    title: "Part-Time Art Teacher",
    employmentType: "part-time",
    status: "cancelled",
    description: "Position cancelled due to budget reallocation.",
    salaryDisclosure: "hidden",
    sourceType: "standard",
    requiredDocs: ["resume"],
    totalApplicants: 5,
    createdBy: "HR Manager",
    createdAt: "2025-11-20",
  },
]

const makeTimeline = (name: string, date: string, stage: ApplicantStage): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    { id: `t-${Date.now()}-1`, type: "system", text: `Application received via Portal`, by: "System", at: `${date} 09:00` },
    { id: `t-${Date.now()}-2`, type: "stage-change", text: `Stage set to Applied`, by: "System", at: `${date} 09:00` },
  ]
  if (["screening", "interview", "doc-verification", "selected", "onboarded"].includes(stage)) {
    events.push({ id: `t-${Date.now()}-3`, type: "stage-change", text: `Moved to Screening`, by: "HR Manager", at: `${date} 14:00` })
  }
  if (["interview", "doc-verification", "selected", "onboarded"].includes(stage)) {
    events.push({ id: `t-${Date.now()}-4`, type: "stage-change", text: `Moved to Interview`, by: "HR Manager", at: `${date} 16:00` })
    events.push({ id: `t-${Date.now()}-5`, type: "note", text: `Interview scheduled for next week`, by: "HR Manager", at: `${date} 16:05` })
  }
  if (["doc-verification", "selected", "onboarded"].includes(stage)) {
    events.push({ id: `t-${Date.now()}-6`, type: "stage-change", text: `Moved to Doc Verification`, by: "Interview Panel", at: `${date} 18:00` })
  }
  if (["selected", "onboarded"].includes(stage)) {
    events.push({ id: `t-${Date.now()}-7`, type: "stage-change", text: `Moved to Selected`, by: "Principal", at: `${date} 20:00` })
  }
  return events
}

const SEED_APPLICANTS: Applicant[] = [
  { id: "ap-1", name: "Neha Gupta", email: "neha.gupta@email.com", phone: "9876500001", place: "Rewari", qualification: "post-graduation", aadhaar: "1234-5678-9001", stage: "screening", source: "portal", driveId: "hd-1", driveTitle: "PGT Mathematics", appliedRole: "PGT Math", resumeFileName: "neha_gupta_resume.pdf", createdAt: "2026-02-05", createdBy: "System", tasks: [{ id: "tk-1", text: "Schedule Screening Call", done: true, createdBy: "HR Manager", createdAt: "2026-02-06" }, { id: "tk-2", text: "Review Qualification Docs", done: false, createdBy: "HR Manager", createdAt: "2026-02-07" }], timeline: makeTimeline("Neha Gupta", "2026-02-05", "screening") },
  { id: "ap-2", name: "Vikram Tiwari", email: "vikram.t@email.com", phone: "9876500002", place: "Gurugram", qualification: "post-graduation", aadhaar: "1234-5678-9002", stage: "interview", source: "portal", driveId: "hd-1", driveTitle: "PGT Mathematics", appliedRole: "PGT Math", resumeFileName: "vikram_tiwari_cv.pdf", createdAt: "2026-02-08", createdBy: "System", tasks: [{ id: "tk-3", text: "Schedule Technical Interview", done: false, createdBy: "HR Manager", createdAt: "2026-02-10" }], timeline: makeTimeline("Vikram Tiwari", "2026-02-08", "interview") },
  { id: "ap-3", name: "Priya Sharma", email: "priya.s@email.com", phone: "9876500003", place: "Dharuhera", qualification: "post-graduation", aadhaar: "1234-5678-9003", stage: "applied", source: "portal", driveId: "hd-1", driveTitle: "PGT Mathematics", appliedRole: "PGT Math", resumeFileName: "priya_sharma_resume.pdf", createdAt: "2026-02-12", createdBy: "System", tasks: [], timeline: makeTimeline("Priya Sharma", "2026-02-12", "applied") },
  { id: "ap-4", name: "Arjun Yadav", email: "arjun.y@email.com", phone: "9876500004", place: "Jaipur", qualification: "post-graduation", aadhaar: "1234-5678-9004", stage: "doc-verification", source: "referral", driveId: "hd-1", driveTitle: "PGT Mathematics", appliedRole: "PGT Math", resumeFileName: "arjun_resume.pdf", referredBy: "Mrs. Anita Sharma (EMP-001)", createdAt: "2026-02-03", createdBy: "HR Manager", tasks: [{ id: "tk-4", text: "Verify Degree Certificate", done: false, createdBy: "HR Manager", createdAt: "2026-02-20" }], timeline: makeTimeline("Arjun Yadav", "2026-02-03", "doc-verification") },
  { id: "ap-5", name: "Sunita Mehra", email: "sunita.m@email.com", phone: "9876500005", place: "Delhi", qualification: "phd", aadhaar: "1234-5678-9005", stage: "selected", source: "portal", driveId: "hd-1", driveTitle: "PGT Mathematics", appliedRole: "PGT Math", resumeFileName: "sunita_mehra_cv.pdf", createdAt: "2026-02-01", createdBy: "System", tasks: [{ id: "tk-5", text: "Send Offer Letter", done: true, createdBy: "HR Manager", createdAt: "2026-02-25" }], timeline: makeTimeline("Sunita Mehra", "2026-02-01", "selected") },
  { id: "ap-6", name: "Rahul Pandey", email: "rahul.p@email.com", phone: "9876500006", place: "Noida", qualification: "graduation", aadhaar: "1234-5678-9006", stage: "screening", source: "portal", driveId: "hd-2", driveTitle: "TGT Science", appliedRole: "TGT Science", resumeFileName: "rahul_pandey_resume.pdf", createdAt: "2026-02-18", createdBy: "System", tasks: [], timeline: makeTimeline("Rahul Pandey", "2026-02-18", "screening") },
  { id: "ap-7", name: "Kavita Singh", email: "kavita.s@email.com", phone: "9876500007", place: "Bawal", qualification: "post-graduation", aadhaar: "1234-5678-9007", stage: "applied", source: "walk-in", driveId: "hd-3", driveTitle: "PRT Hindi", appliedRole: "PRT Hindi", resumeFileName: "kavita_singh_cv.pdf", createdAt: "2026-03-02", createdBy: "HR Manager", tasks: [], timeline: makeTimeline("Kavita Singh", "2026-03-02", "applied") },
  { id: "ap-8", name: "Deepak Chauhan", email: "deepak.c@email.com", phone: "9876500008", place: "Rewari", qualification: "graduation", aadhaar: "1234-5678-9008", stage: "interview", source: "walk-in", driveId: "hd-3", driveTitle: "PRT Hindi", appliedRole: "PRT Hindi", resumeFileName: "deepak_resume.pdf", createdAt: "2026-03-01", createdBy: "Walk-In Desk", tasks: [{ id: "tk-6", text: "Schedule Demo Class", done: false, createdBy: "HR Manager", createdAt: "2026-03-03" }], timeline: makeTimeline("Deepak Chauhan", "2026-03-01", "interview") },
  { id: "ap-9", name: "Manish Verma", email: "manish.v@email.com", phone: "9876500009", place: "Kosli", qualification: "post-graduation", aadhaar: "1234-5678-9009", stage: "onboarded", source: "portal", driveId: "hd-4", driveTitle: "PGT Physics", appliedRole: "PGT Physics", resumeFileName: "manish_verma_cv.pdf", createdAt: "2025-08-15", createdBy: "System", tasks: [], timeline: makeTimeline("Manish Verma", "2025-08-15", "onboarded") },
  { id: "ap-10", name: "Geeta Rani", email: "geeta.r@email.com", phone: "9876500010", place: "Jatusana", qualification: "graduation", aadhaar: "1234-5678-9010", stage: "applied", source: "agency", driveId: "hd-2", driveTitle: "TGT Science", appliedRole: "TGT Science", resumeFileName: "geeta_rani_resume.pdf", createdAt: "2026-02-20", createdBy: "Talent Agency", tasks: [], timeline: makeTimeline("Geeta Rani", "2026-02-20", "applied") },
]

/* ── Cooldown Data (Mock) ──────────────────────────── */

export const COOLDOWN_AADHAAR_LIST: { aadhaar: string; name: string; lastAction: string; date: string }[] = [
  { aadhaar: "9999-8888-7777", name: "Blocked Candidate A", lastAction: "Rejected", date: "2026-01-15" },
  { aadhaar: "5555-4444-3333", name: "Blocked Candidate B", lastAction: "Interviewed", date: "2025-12-20" },
]

/* ── Zustand Store ─────────────────────────────────── */

interface ATSState {
  drives: HiringDrive[]
  applicants: Applicant[]
  addDrive: (drive: HiringDrive) => void
  updateDriveStatus: (driveId: string, status: DriveStatus) => void
  addApplicant: (applicant: Applicant) => void
  updateApplicantStage: (applicantId: string, stage: ApplicantStage, by: string) => void
  addApplicantTask: (applicantId: string, task: ApplicantTask) => void
  toggleApplicantTask: (applicantId: string, taskId: string) => void
  addTimelineEvent: (applicantId: string, event: TimelineEvent) => void
}

export const useATSStore = create<ATSState>()((set) => ({
  drives: SEED_DRIVES,
  applicants: SEED_APPLICANTS,

  addDrive: (drive) =>
    set((state) => ({ drives: [drive, ...state.drives] })),

  updateDriveStatus: (driveId, status) =>
    set((state) => ({
      drives: state.drives.map((d) =>
        d.id === driveId ? { ...d, status } : d
      ),
    })),

  addApplicant: (applicant) =>
    set((state) => ({
      applicants: [applicant, ...state.applicants],
      drives: state.drives.map((d) =>
        d.id === applicant.driveId
          ? { ...d, totalApplicants: d.totalApplicants + 1 }
          : d
      ),
    })),

  updateApplicantStage: (applicantId, stage, by) =>
    set((state) => ({
      applicants: state.applicants.map((a) =>
        a.id === applicantId
          ? {
              ...a,
              stage,
              timeline: [
                ...a.timeline,
                {
                  id: `t-${Date.now()}`,
                  type: "stage-change" as const,
                  text: `Moved to ${PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? stage}`,
                  by,
                  at: new Date().toISOString().slice(0, 16).replace("T", " "),
                },
              ],
            }
          : a
      ),
    })),

  addApplicantTask: (applicantId, task) =>
    set((state) => ({
      applicants: state.applicants.map((a) =>
        a.id === applicantId
          ? {
              ...a,
              tasks: [...a.tasks, task],
              timeline: [
                ...a.timeline,
                {
                  id: `t-${Date.now()}`,
                  type: "task" as const,
                  text: `Task created: "${task.text}"`,
                  by: task.createdBy,
                  at: task.createdAt,
                },
              ],
            }
          : a
      ),
    })),

  toggleApplicantTask: (applicantId, taskId) =>
    set((state) => ({
      applicants: state.applicants.map((a) =>
        a.id === applicantId
          ? {
              ...a,
              tasks: a.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
              timeline: (() => {
                const task = a.tasks.find((t) => t.id === taskId)
                if (!task) return a.timeline
                return [
                  ...a.timeline,
                  {
                    id: `t-${Date.now()}`,
                    type: "task" as const,
                    text: task.done
                      ? `Task reopened: "${task.text}"`
                      : `Task completed: "${task.text}"`,
                    by: "Current User",
                    at: new Date().toISOString().slice(0, 16).replace("T", " "),
                  },
                ]
              })(),
            }
          : a
      ),
    })),

  addTimelineEvent: (applicantId, event) =>
    set((state) => ({
      applicants: state.applicants.map((a) =>
        a.id === applicantId
          ? { ...a, timeline: [...a.timeline, event] }
          : a
      ),
    })),
}))
