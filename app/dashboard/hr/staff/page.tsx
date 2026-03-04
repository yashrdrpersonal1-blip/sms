"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search, Filter, ChevronDown, Users, X, Eye, Phone,
  Briefcase, UserCheck, UserX, Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ─────────────────────────────────── */

type StaffRole = "teacher" | "driver" | "admin" | "accountant" | "librarian" | "peon"
type EmpType = "full-time" | "part-time" | "internship"
type AttendanceStatus = "present" | "absent" | "on-leave"

interface Staff {
  id: string
  name: string
  empId: string
  photo: string
  roles: StaffRole[]
  empType: EmpType
  shift?: string
  department: string
  experience: string
  phone: string
  attendance: AttendanceStatus
  teacherCategory?: string
  subject?: string
  createdBy: string
  createdAt: string
}

/* ── Seed Data ────────────────────────────── */

const STAFF: Staff[] = [
  { id: "st-001", name: "Mrs. Anita Sharma", empId: "EMP-001", photo: "AS", roles: ["teacher"], empType: "full-time", department: "Academic", experience: "12 yrs", phone: "9876543001", attendance: "present", teacherCategory: "PGT", subject: "Mathematics", createdBy: "Admin", createdAt: "2020-04-01" },
  { id: "st-002", name: "Mr. Rajesh Verma", empId: "EMP-002", photo: "RV", roles: ["teacher"], empType: "full-time", department: "Academic", experience: "8 yrs", phone: "9876543002", attendance: "present", teacherCategory: "TGT", subject: "Science", createdBy: "Admin", createdAt: "2021-07-15" },
  { id: "st-003", name: "Mrs. Priya Devi", empId: "EMP-003", photo: "PD", roles: ["teacher"], empType: "full-time", department: "Academic", experience: "15 yrs", phone: "9876543003", attendance: "on-leave", teacherCategory: "PGT", subject: "English", createdBy: "Admin", createdAt: "2018-04-01" },
  { id: "st-004", name: "Mr. Sunil Kumar", empId: "EMP-004", photo: "SK", roles: ["driver"], empType: "full-time", department: "Transport", experience: "6 yrs", phone: "9876543004", attendance: "present", createdBy: "HR Manager", createdAt: "2022-08-10" },
  { id: "st-005", name: "Ms. Kavita Kaur", empId: "EMP-005", photo: "KK", roles: ["teacher"], empType: "part-time", shift: "First Half", department: "Academic", experience: "3 yrs", phone: "9876543005", attendance: "present", teacherCategory: "PRT", subject: "Hindi", createdBy: "Admin", createdAt: "2024-01-15" },
  { id: "st-006", name: "Mr. Aman Rao", empId: "EMP-006", photo: "AR", roles: ["admin"], empType: "full-time", department: "Administration", experience: "10 yrs", phone: "9876543006", attendance: "present", createdBy: "Admin", createdAt: "2019-06-01" },
  { id: "st-007", name: "Mrs. Sunita Iyer", empId: "EMP-007", photo: "SI", roles: ["teacher"], empType: "full-time", department: "Academic", experience: "20 yrs", phone: "9876543007", attendance: "present", teacherCategory: "PGT", subject: "Physics", createdBy: "Admin", createdAt: "2015-04-01" },
  { id: "st-008", name: "Mr. Harish Pandey", empId: "EMP-008", photo: "HP", roles: ["teacher"], empType: "full-time", department: "Academic", experience: "5 yrs", phone: "9876543008", attendance: "absent", teacherCategory: "TGT", subject: "Social Studies", createdBy: "Admin", createdAt: "2023-04-01" },
  { id: "st-009", name: "Mr. Vikram Singh", empId: "EMP-009", photo: "VS", roles: ["driver"], empType: "full-time", department: "Transport", experience: "4 yrs", phone: "9876543009", attendance: "present", createdBy: "HR Manager", createdAt: "2023-08-01" },
  { id: "st-010", name: "Mrs. Geeta Bose", empId: "EMP-010", photo: "GB", roles: ["teacher"], empType: "full-time", department: "Academic", experience: "14 yrs", phone: "9876543010", attendance: "present", teacherCategory: "PGT", subject: "Chemistry", createdBy: "Admin", createdAt: "2017-04-01" },
  { id: "st-011", name: "Mr. Ramesh Chauhan", empId: "EMP-011", photo: "RC", roles: ["peon"], empType: "full-time", department: "Support", experience: "8 yrs", phone: "9876543011", attendance: "present", createdBy: "Admin", createdAt: "2020-01-01" },
  { id: "st-012", name: "Ms. Deepa Saxena", empId: "EMP-012", photo: "DS", roles: ["teacher", "admin"], empType: "full-time", department: "Academic", experience: "18 yrs", phone: "9876543012", attendance: "present", teacherCategory: "PGT", subject: "Computer Science", createdBy: "Admin", createdAt: "2016-04-01" },
  { id: "st-013", name: "Mr. Neeraj Gupta", empId: "EMP-013", photo: "NG", roles: ["accountant"], empType: "full-time", department: "Finance", experience: "7 yrs", phone: "9876543013", attendance: "present", createdBy: "Admin", createdAt: "2021-04-01" },
  { id: "st-014", name: "Ms. Sonia Mishra", empId: "EMP-014", photo: "SM", roles: ["librarian"], empType: "part-time", shift: "Second Half", department: "Library", experience: "2 yrs", phone: "9876543014", attendance: "present", createdBy: "HR Manager", createdAt: "2025-01-10" },
  { id: "st-015", name: "Mr. Anil Tomar", empId: "EMP-015", photo: "AT", roles: ["teacher"], empType: "internship", shift: "First Half", department: "Academic", experience: "0.5 yrs", phone: "9876543015", attendance: "on-leave", teacherCategory: "Guest Lecturer", subject: "Art", createdBy: "Principal", createdAt: "2026-01-01" },
]

const ROLE_OPTIONS: { value: StaffRole; label: string }[] = [
  { value: "teacher", label: "Teacher" },
  { value: "driver", label: "Driver" },
  { value: "admin", label: "Admin" },
  { value: "accountant", label: "Accountant" },
  { value: "librarian", label: "Librarian" },
  { value: "peon", label: "Support" },
]

const ROLE_COLORS: Record<StaffRole, string> = {
  teacher: "border-sky-500/30 text-sky-500",
  driver: "border-amber-500/30 text-amber-500",
  admin: "border-violet-500/30 text-violet-500",
  accountant: "border-emerald-500/30 text-emerald-500",
  librarian: "border-pink-500/30 text-pink-500",
  peon: "border-muted-foreground/30 text-muted-foreground",
}

const ATT_CONFIG: Record<AttendanceStatus, { label: string; dot: string; text: string }> = {
  present: { label: "Present", dot: "bg-emerald-500", text: "text-emerald-500" },
  absent: { label: "Absent", dot: "bg-red-500", text: "text-red-500" },
  "on-leave": { label: "On Leave", dot: "bg-amber-500", text: "text-amber-500" },
}

/* ── Page ──────────────────────────────────── */

export default function StaffDirectoryPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all")
  const [empTypeFilter, setEmpTypeFilter] = useState<EmpType | "all">("all")
  const [attFilter, setAttFilter] = useState<AttendanceStatus | "all">("all")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = STAFF
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.empId.toLowerCase().includes(q) || s.phone.includes(q) || (s.subject && s.subject.toLowerCase().includes(q)))
    }
    if (roleFilter !== "all") list = list.filter(s => s.roles.includes(roleFilter))
    if (empTypeFilter !== "all") list = list.filter(s => s.empType === empTypeFilter)
    if (attFilter !== "all") list = list.filter(s => s.attendance === attFilter)
    return list
  }, [search, roleFilter, empTypeFilter, attFilter])

  const presentCount = STAFF.filter(s => s.attendance === "present").length
  const teacherCount = STAFF.filter(s => s.roles.includes("teacher")).length
  const ptCount = STAFF.filter(s => s.empType !== "full-time").length

  const activeFilterCount = [roleFilter !== "all", empTypeFilter !== "all", attFilter !== "all"].filter(Boolean).length

  function clearFilters() { setRoleFilter("all"); setEmpTypeFilter("all"); setAttFilter("all") }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">Staff Directory</h1>
            <p className="text-xs text-muted-foreground">{STAFF.length} staff members &middot; {presentCount} present today</p>
          </div>
          <Button size="sm" onClick={() => router.push("/dashboard/hr/onboarding")} className="gap-1.5 self-start shadow-md shadow-primary/20 sm:self-auto">
            <UserCheck className="size-3.5" />Onboard Staff
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
            <p className="text-lg font-bold text-foreground sm:text-2xl">{STAFF.length}</p>
            <p className="text-[10px] text-muted-foreground sm:text-[11px]">Total Staff</p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
            <p className="text-lg font-bold text-sky-500 sm:text-2xl">{teacherCount}</p>
            <p className="text-[10px] text-muted-foreground sm:text-[11px]">Teachers</p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
            <p className="text-lg font-bold text-amber-500 sm:text-2xl">{ptCount}</p>
            <p className="text-[10px] text-muted-foreground sm:text-[11px]">Part-Time / Intern</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, phone, subject..." className="w-full rounded-xl border border-border/40 bg-card/60 py-2.5 pl-9 pr-3 text-sm text-foreground shadow-2xl backdrop-blur-2xl placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <Button variant="outline" size="sm" onClick={() => setFiltersOpen(v => !v)} className={cn("gap-1.5 border-border/40 text-xs", filtersOpen && "border-primary/40 bg-primary/5 text-primary")}>
              <Filter className="size-3.5" />Filters
              {activeFilterCount > 0 && <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{activeFilterCount}</span>}
            </Button>
          </div>

          {filtersOpen && (
            <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Filters</p>
                {activeFilterCount > 0 && <button onClick={clearFilters} className="text-[10px] font-medium text-primary hover:underline">Clear all</button>}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-medium text-muted-foreground">Role</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip label="All" active={roleFilter === "all"} onClick={() => setRoleFilter("all")} />
                  {ROLE_OPTIONS.map(r => <FilterChip key={r.value} label={r.label} active={roleFilter === r.value} onClick={() => setRoleFilter(r.value)} />)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-medium text-muted-foreground">Employment</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip label="All" active={empTypeFilter === "all"} onClick={() => setEmpTypeFilter("all")} />
                  <FilterChip label="Full-Time" active={empTypeFilter === "full-time"} onClick={() => setEmpTypeFilter("full-time")} />
                  <FilterChip label="Part-Time" active={empTypeFilter === "part-time"} onClick={() => setEmpTypeFilter("part-time")} />
                  <FilterChip label="Internship" active={empTypeFilter === "internship"} onClick={() => setEmpTypeFilter("internship")} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-medium text-muted-foreground">Attendance</p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip label="All" active={attFilter === "all"} onClick={() => setAttFilter("all")} />
                  <FilterChip label="Present" active={attFilter === "present"} onClick={() => setAttFilter("present")} />
                  <FilterChip label="Absent" active={attFilter === "absent"} onClick={() => setAttFilter("absent")} />
                  <FilterChip label="On Leave" active={attFilter === "on-leave"} onClick={() => setAttFilter("on-leave")} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden rounded-2xl border border-border/40 bg-card/60 shadow-2xl backdrop-blur-2xl sm:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Staff</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Emp ID</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Roles</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Employment</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Experience</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Attendance</th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const att = ATT_CONFIG[s.attendance]
                  return (
                    <tr key={s.id} onClick={() => router.push(`/dashboard/hr/staff/${s.id}`)} className="cursor-pointer border-b border-border/20 transition-colors hover:bg-primary/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{s.photo}</div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{s.department}{s.subject ? ` - ${s.subject}` : ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.empId}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {s.roles.map(r => <Badge key={r} variant="outline" className={cn("text-[10px] capitalize", ROLE_COLORS[r])}>{r}</Badge>)}
                          {s.teacherCategory && <Badge variant="outline" className="border-primary/30 text-[10px] text-primary">{s.teacherCategory}</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground capitalize">{s.empType}</span>
                        {s.shift && <span className="ml-1 text-[10px] text-muted-foreground/60">({s.shift})</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.experience}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("size-2 rounded-full", att.dot)} />
                          <span className={cn("text-xs font-medium", att.text)}>{att.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Eye className="size-4 text-muted-foreground/40" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No staff found matching filters</div>}
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-2 sm:hidden">
          {filtered.map(s => {
            const att = ATT_CONFIG[s.attendance]
            return (
              <div key={s.id} onClick={() => router.push(`/dashboard/hr/staff/${s.id}`)} className="cursor-pointer rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl transition-colors active:bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{s.photo}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className={cn("size-1.5 rounded-full", att.dot)} />
                        <span className={cn("text-[10px] font-medium", att.text)}>{att.label}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{s.empId} &middot; {s.department}{s.subject ? ` - ${s.subject}` : ""}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {s.roles.map(r => <Badge key={r} variant="outline" className={cn("text-[9px] capitalize", ROLE_COLORS[r])}>{r}</Badge>)}
                      {s.teacherCategory && <Badge variant="outline" className="border-primary/30 text-[9px] text-primary">{s.teacherCategory}</Badge>}
                      <Badge variant="outline" className="border-border/40 text-[9px] capitalize text-muted-foreground">{s.empType}{s.shift ? `: ${s.shift}` : ""}</Badge>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{s.experience} experience</span>
                      <Phone className="size-3 text-muted-foreground/40" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 border-t border-border/20 pt-1.5 text-[10px] text-muted-foreground/60">Onboarded by {s.createdBy} on {s.createdAt}</p>
              </div>
            )
          })}
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No staff found matching filters</div>}
        </div>
      </div>
    </DashboardShell>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-all",
      active ? "border-primary/40 bg-primary/10 text-primary" : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/20"
    )}>
      {label}
    </button>
  )
}
