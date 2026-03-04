"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search, Filter, ChevronDown, Users, AlertTriangle,
  BookOpen, X, UserCheck, UserX, Eye, Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─────────────────────────────────────── */

type StudentStatus = "present" | "absent"
type AlertLevel = "red" | "yellow" | "none"

interface Student {
  id: string
  name: string
  srn: string
  photo: string
  class: string
  section: string
  classTeacher: string
  status: StudentStatus
  alertLevel: AlertLevel
  alertTag: string
  fatherName: string
  phone: string
  enrolledAt: string
  enrolledBy: string
}

/* ── Seed Data ─────────────────────────────────── */

const STUDENTS: Student[] = [
  { id: "s-001", name: "Aarav Yadav", srn: "SRN-2026-001", photo: "AY", class: "9", section: "A", classTeacher: "Mrs. Sharma", status: "present", alertLevel: "none", alertTag: "", fatherName: "Ramesh Yadav", phone: "9876543210", enrolledAt: "2025-04-01", enrolledBy: "Admin Office" },
  { id: "s-002", name: "Priya Mehra", srn: "SRN-2026-002", photo: "PM", class: "9", section: "A", classTeacher: "Mrs. Sharma", status: "present", alertLevel: "red", alertTag: "Fee Defaulter", fatherName: "Suresh Mehra", phone: "9876543211", enrolledAt: "2025-04-02", enrolledBy: "Admin Office" },
  { id: "s-003", name: "Rahul Singh", srn: "SRN-2026-003", photo: "RS", class: "9", section: "B", classTeacher: "Mr. Verma", status: "absent", alertLevel: "yellow", alertTag: "Low Attendance", fatherName: "Ajay Singh", phone: "9876543212", enrolledAt: "2025-04-01", enrolledBy: "Front Desk" },
  { id: "s-004", name: "Ananya Gupta", srn: "SRN-2026-004", photo: "AG", class: "10", section: "A", classTeacher: "Mrs. Devi", status: "present", alertLevel: "none", alertTag: "", fatherName: "Vikram Gupta", phone: "9876543213", enrolledAt: "2024-04-10", enrolledBy: "Admin Office" },
  { id: "s-005", name: "Karan Joshi", srn: "SRN-2026-005", photo: "KJ", class: "10", section: "A", classTeacher: "Mrs. Devi", status: "present", alertLevel: "red", alertTag: "Suspended", fatherName: "Manoj Joshi", phone: "9876543214", enrolledAt: "2024-04-10", enrolledBy: "Principal" },
  { id: "s-006", name: "Sneha Patel", srn: "SRN-2026-006", photo: "SP", class: "10", section: "B", classTeacher: "Mr. Kumar", status: "absent", alertLevel: "yellow", alertTag: "Overdue Library Book", fatherName: "Dinesh Patel", phone: "9876543215", enrolledAt: "2024-04-15", enrolledBy: "Front Desk" },
  { id: "s-007", name: "Vikas Tomar", srn: "SRN-2026-007", photo: "VT", class: "8", section: "A", classTeacher: "Ms. Kaur", status: "present", alertLevel: "none", alertTag: "", fatherName: "Bharat Tomar", phone: "9876543216", enrolledAt: "2023-04-05", enrolledBy: "Admin Office" },
  { id: "s-008", name: "Riya Sharma", srn: "SRN-2026-008", photo: "RSh", class: "8", section: "A", classTeacher: "Ms. Kaur", status: "present", alertLevel: "none", alertTag: "", fatherName: "Pankaj Sharma", phone: "9876543217", enrolledAt: "2023-04-05", enrolledBy: "Admin Office" },
  { id: "s-009", name: "Deepak Chauhan", srn: "SRN-2026-009", photo: "DC", class: "8", section: "B", classTeacher: "Mr. Rao", status: "present", alertLevel: "red", alertTag: "Fee Defaulter", fatherName: "Satish Chauhan", phone: "9876543218", enrolledAt: "2023-04-08", enrolledBy: "Front Desk" },
  { id: "s-010", name: "Meera Reddy", srn: "SRN-2026-010", photo: "MR", class: "7", section: "A", classTeacher: "Mrs. Iyer", status: "absent", alertLevel: "none", alertTag: "", fatherName: "Narayan Reddy", phone: "9876543219", enrolledAt: "2024-06-01", enrolledBy: "Admin Office" },
  { id: "s-011", name: "Arjun Nair", srn: "SRN-2026-011", photo: "AN", class: "7", section: "A", classTeacher: "Mrs. Iyer", status: "present", alertLevel: "yellow", alertTag: "Low Attendance", fatherName: "Krishnan Nair", phone: "9876543220", enrolledAt: "2024-06-01", enrolledBy: "Admin Office" },
  { id: "s-012", name: "Tanvi Mishra", srn: "SRN-2026-012", photo: "TM", class: "7", section: "B", classTeacher: "Mr. Pandey", status: "present", alertLevel: "none", alertTag: "", fatherName: "Ashok Mishra", phone: "9876543221", enrolledAt: "2024-06-05", enrolledBy: "Front Desk" },
  { id: "s-013", name: "Sahil Khan", srn: "SRN-2026-013", photo: "SK", class: "6", section: "A", classTeacher: "Mrs. Bose", status: "present", alertLevel: "none", alertTag: "", fatherName: "Imran Khan", phone: "9876543222", enrolledAt: "2025-04-01", enrolledBy: "Admin Office" },
  { id: "s-014", name: "Pooja Kumari", srn: "SRN-2026-014", photo: "PK", class: "6", section: "A", classTeacher: "Mrs. Bose", status: "absent", alertLevel: "yellow", alertTag: "Overdue Library Book", fatherName: "Rajesh Kumar", phone: "9876543223", enrolledAt: "2025-04-03", enrolledBy: "Front Desk" },
  { id: "s-015", name: "Nikhil Bhatt", srn: "SRN-2026-015", photo: "NB", class: "11", section: "A", classTeacher: "Dr. Saxena", status: "present", alertLevel: "none", alertTag: "", fatherName: "Gopal Bhatt", phone: "9876543224", enrolledAt: "2025-04-01", enrolledBy: "Admin Office" },
  { id: "s-016", name: "Ishita Verma", srn: "SRN-2026-016", photo: "IV", class: "11", section: "A", classTeacher: "Dr. Saxena", status: "present", alertLevel: "red", alertTag: "Fee Defaulter", fatherName: "Rakesh Verma", phone: "9876543225", enrolledAt: "2025-04-02", enrolledBy: "Admin Office" },
]

const CLASSES = ["All", "6", "7", "8", "9", "10", "11", "12"]
const SECTIONS = ["All", "A", "B", "C"]
type StatusFilter = "all" | "present" | "absent"
type AlertFilter = "all" | "red" | "yellow" | "none"

/* ── Page Component ────────────────────────────── */

export default function StudentDirectoryPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("All")
  const [sectionFilter, setSectionFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [alertFilter, setAlertFilter] = useState<AlertFilter>("all")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = STUDENTS
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.srn.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q) ||
        s.phone.includes(q)
      )
    }
    if (classFilter !== "All") list = list.filter(s => s.class === classFilter)
    if (sectionFilter !== "All") list = list.filter(s => s.section === sectionFilter)
    if (statusFilter !== "all") list = list.filter(s => s.status === statusFilter)
    if (alertFilter !== "all") list = list.filter(s => s.alertLevel === alertFilter)
    return list
  }, [search, classFilter, sectionFilter, statusFilter, alertFilter])

  const presentCount = STUDENTS.filter(s => s.status === "present").length
  const absentCount = STUDENTS.filter(s => s.status === "absent").length
  const redCount = STUDENTS.filter(s => s.alertLevel === "red").length

  const activeFilterCount = [
    classFilter !== "All",
    sectionFilter !== "All",
    statusFilter !== "all",
    alertFilter !== "all",
  ].filter(Boolean).length

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-5 flex flex-col gap-1">
        <h1 className="text-lg font-bold text-foreground sm:text-xl">Student Directory</h1>
        <p className="text-xs text-muted-foreground">{STUDENTS.length} enrolled students across all classes</p>
      </div>

      {/* Stat Chips -- 2x2 on mobile, 4 across on sm+ */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
        <StatCard label="Total Students" value={STUDENTS.length} icon={<Users className="size-4" />} color="primary" />
        <StatCard label="Present Today" value={presentCount} icon={<UserCheck className="size-4" />} color="emerald" />
        <StatCard label="Absent Today" value={absentCount} icon={<UserX className="size-4" />} color="amber" />
        <StatCard label="Needs Attention" value={redCount} icon={<AlertTriangle className="size-4" />} color="red" />
      </div>

      {/* Search + Filter Toggle */}
      <div className="mb-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, SRN, father, phone..."
              className="h-10 w-full rounded-xl border border-border/50 bg-card/60 pl-10 pr-10 text-sm text-foreground backdrop-blur-2xl placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn("gap-1.5 border-border/50 shrink-0", filtersOpen && "border-primary/40 bg-primary/5 text-primary")}
          >
            <Filter className="size-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{activeFilterCount}</span>
            )}
            <ChevronDown className={cn("size-3 transition-transform", filtersOpen && "rotate-180")} />
          </Button>
        </div>

        {/* Filter Chips Panel */}
        {filtersOpen && (
          <div className="flex flex-col gap-3 rounded-xl border border-border/30 bg-card/40 p-3 shadow-2xl backdrop-blur-2xl">
            <FilterRow label="Class">
              {CLASSES.map(c => (
                <Chip key={c} active={classFilter === c} onClick={() => setClassFilter(c)}>{c === "All" ? "All" : `Grade ${c}`}</Chip>
              ))}
            </FilterRow>
            <FilterRow label="Section">
              {SECTIONS.map(s => (
                <Chip key={s} active={sectionFilter === s} onClick={() => setSectionFilter(s)}>{s === "All" ? "All" : `Sec ${s}`}</Chip>
              ))}
            </FilterRow>
            <FilterRow label="Status">
              <Chip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All</Chip>
              <Chip active={statusFilter === "present"} onClick={() => setStatusFilter("present")}>Present</Chip>
              <Chip active={statusFilter === "absent"} onClick={() => setStatusFilter("absent")}>Absent</Chip>
            </FilterRow>
            <FilterRow label="Alerts">
              <Chip active={alertFilter === "all"} onClick={() => setAlertFilter("all")}>All</Chip>
              <Chip active={alertFilter === "red"} onClick={() => setAlertFilter("red")}>Needs Attention</Chip>
              <Chip active={alertFilter === "yellow"} onClick={() => setAlertFilter("yellow")}>Warning</Chip>
              <Chip active={alertFilter === "none"} onClick={() => setAlertFilter("none")}>Clear</Chip>
            </FilterRow>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setClassFilter("All"); setSectionFilter("All"); setStatusFilter("all"); setAlertFilter("all") }}
                className="self-start text-[11px] font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="mb-2.5 text-[11px] text-muted-foreground">{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/40 bg-card/60 shadow-2xl backdrop-blur-2xl md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 text-left">
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">SRN</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Class</th>
                <th className="hidden px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Class Teacher</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Alert</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sr-only">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s.id}
                  onClick={() => router.push(`/dashboard/students/${s.id}`)}
                  className={cn(
                    "group cursor-pointer border-b border-border/20 transition-colors hover:bg-muted/20",
                    s.alertLevel === "red" && "bg-red-500/[0.07] hover:bg-red-500/[0.12]",
                    s.alertLevel === "yellow" && "bg-amber-500/[0.07] hover:bg-amber-500/[0.12]"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        s.alertLevel === "red" ? "border-red-500/30 bg-red-500/10 text-red-500" :
                        s.alertLevel === "yellow" ? "border-amber-500/30 bg-amber-500/10 text-amber-500" :
                        "border-primary/30 bg-primary/10 text-primary"
                      )}>
                        {s.photo}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground">S/O {s.fatherName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{s.srn}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{s.class}-{s.section}</td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">{s.classTeacher}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      s.status === "present" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-red-500/30 bg-red-500/10 text-red-500"
                    )}>
                      {s.status === "present" ? "Present" : "Absent"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {s.alertTag ? (
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        s.alertLevel === "red" ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                      )}>
                        {s.alertTag}
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/50">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Eye className="size-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">No students match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-2.5 md:hidden">
        {filtered.map(s => (
          <button
            key={s.id}
            onClick={() => router.push(`/dashboard/students/${s.id}`)}
            className={cn(
              "flex flex-col rounded-2xl border bg-card/60 p-3.5 text-left shadow-2xl backdrop-blur-2xl transition-all active:scale-[0.98]",
              s.alertLevel === "red" ? "border-red-500/20 bg-red-500/[0.06]" :
              s.alertLevel === "yellow" ? "border-amber-500/20 bg-amber-500/[0.06]" :
              "border-border/40"
            )}
          >
            {/* Top row: avatar + name + status */}
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                s.alertLevel === "red" ? "border-red-500/30 bg-red-500/10 text-red-500" :
                s.alertLevel === "yellow" ? "border-amber-500/30 bg-amber-500/10 text-amber-500" :
                "border-primary/30 bg-primary/10 text-primary"
              )}>
                {s.photo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">S/O {s.fatherName}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                    "shrink-0 text-[10px]",
                    s.status === "present" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-red-500/30 bg-red-500/10 text-red-500"
                  )}>
                    {s.status === "present" ? "Present" : "Absent"}
                  </Badge>
                </div>

                {/* Meta chips */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="font-mono">{s.srn}</span>
                  <span className="size-0.5 rounded-full bg-border" />
                  <span>Grade {s.class}-{s.section}</span>
                </div>

                {/* Phone + Teacher */}
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="size-2.5" />{s.phone}</span>
                  <span className="flex items-center gap-1">CT: {s.classTeacher}</span>
                </div>

                {/* Alert tag */}
                {s.alertTag && (
                  <div className="mt-2">
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      s.alertLevel === "red" ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    )}>
                      {s.alertLevel === "red" ? <AlertTriangle className="mr-1 size-2.5" /> : <BookOpen className="mr-1 size-2.5" />}
                      {s.alertTag}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Universal Audit Footer */}
            <div className="mt-2.5 border-t border-border/20 pt-2">
              <p className="text-[10px] text-muted-foreground/60">Enrolled by: {s.enrolledBy} on {s.enrolledAt}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border/40 bg-card/60 py-16 text-center text-sm text-muted-foreground shadow-2xl backdrop-blur-2xl">
            No students match your filters
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

/* ── Sub Components ────────────────────────────── */

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const styles: Record<string, string> = {
    primary: "border-primary/20 bg-primary/5 text-primary",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-500",
    red: "border-red-500/20 bg-red-500/5 text-red-500",
  }
  return (
    <div className={cn("flex items-center gap-2.5 rounded-xl border p-3 shadow-2xl backdrop-blur-2xl sm:gap-3", styles[color])}>
      <div className="hidden size-9 items-center justify-center rounded-lg bg-current/10 sm:flex">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none sm:text-xl">{value}</p>
        <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/40 bg-card/40 text-muted-foreground hover:border-border/60 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}
