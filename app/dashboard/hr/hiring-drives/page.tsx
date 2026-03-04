"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Plus, Search, Filter, Eye, X, Users,
  Briefcase, Clock, Ban, ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"
import {
  useATSStore,
  type HiringDrive,
  type DriveStatus,
  type EmploymentType,
  type SourceType,
  type SalaryDisclosure,
} from "@/stores/ats-store"

/* ── Status config ────────────────────────────── */

const STATUS_CONFIG: Record<DriveStatus, { label: string; dot: string; text: string }> = {
  open: { label: "Open", dot: "bg-emerald-500", text: "text-emerald-500" },
  closed: { label: "Closed", dot: "bg-red-500", text: "text-red-500" },
  cancelled: { label: "Cancelled", dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

const EMP_TYPE_LABEL: Record<EmploymentType, string> = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  contract: "Contract",
}

/* ── Create Drive Modal ───────────────────────── */

function CreateDriveModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const addDrive = useATSStore((s) => s.addDrive)
  const [title, setTitle] = useState("")
  const [empType, setEmpType] = useState<EmploymentType>("full-time")
  const [description, setDescription] = useState("")
  const [salaryDisc, setSalaryDisc] = useState<SalaryDisclosure>("hidden")
  const [salaryRange, setSalaryRange] = useState("")
  const [sourceType, setSourceType] = useState<SourceType>("standard")
  const [requiredDocs, setRequiredDocs] = useState<Record<string, boolean>>({
    resume: true,
    "cover-letter": false,
  })

  function handleSave() {
    if (!title.trim()) return
    const drive: HiringDrive = {
      id: `hd-${Date.now()}`,
      title: title.trim(),
      employmentType: empType,
      status: "open",
      description: description.trim(),
      salaryDisclosure: salaryDisc,
      salaryRange: salaryDisc === "disclose-range" ? salaryRange.trim() : undefined,
      sourceType,
      requiredDocs: Object.entries(requiredDocs)
        .filter(([, v]) => v)
        .map(([k]) => k),
      totalApplicants: 0,
      createdBy: "Current User",
      createdAt: new Date().toISOString().slice(0, 10),
    }
    addDrive(drive)
    setTitle("")
    setDescription("")
    setSalaryRange("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Plus className="size-5 text-primary" />
            Create New Hiring Drive
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Drive Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PGT Mathematics - Session 2026-27"
              className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Employment Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Employment Type
            </label>
            <select
              value={empType}
              onChange={(e) => setEmpType(e.target.value as EmploymentType)}
              className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Job Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the role requirements, responsibilities, and qualifications..."
              className="w-full resize-none rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Salary Disclosure */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Salary Disclosure
            </label>
            <select
              value={salaryDisc}
              onChange={(e) =>
                setSalaryDisc(e.target.value as SalaryDisclosure)
              }
              className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="disclose-range">Disclose Range</option>
              <option value="hidden">Not Applicable / Hidden</option>
            </select>
          </div>

          {salaryDisc === "disclose-range" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Salary Range
              </label>
              <input
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. 45,000 - 65,000 /month"
                className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          )}

          {/* Source Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Source Type
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as SourceType)}
              className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="standard">Standard Application</option>
              <option value="walk-in">Walk-In Drive</option>
            </select>
          </div>

          {/* Document Requirements */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Required Documents
            </label>
            <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/40 p-3">
              {[
                { key: "resume", label: "Resume" },
                { key: "cover-letter", label: "Cover Letter" },
              ].map((doc) => (
                <label
                  key={doc.key}
                  className="flex items-center gap-2.5 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={requiredDocs[doc.key] ?? false}
                    onChange={(e) =>
                      setRequiredDocs((prev) => ({
                        ...prev,
                        [doc.key]: e.target.checked,
                      }))
                    }
                    className="size-4 rounded border-border accent-primary"
                  />
                  {doc.label}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border/30 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!title.trim()}
              className="shadow-md shadow-primary/20"
            >
              Create Drive
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ── Stat Card ────────────────────────────────── */

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
      <p className={cn("text-lg font-bold sm:text-2xl", color)}>{value}</p>
      <p className="text-[10px] text-muted-foreground sm:text-[11px]">
        {label}
      </p>
    </div>
  )
}

/* ── Page ──────────────────────────────────────── */

export default function HiringDrivesPage() {
  const router = useRouter()
  const drives = useATSStore((s) => s.drives)
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<DriveStatus | "all">("all")

  const filtered = useMemo(() => {
    let list = drives
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.employmentType.includes(q)
      )
    }
    if (statusFilter !== "all")
      list = list.filter((d) => d.status === statusFilter)
    return list
  }, [drives, search, statusFilter])

  const openCount = drives.filter((d) => d.status === "open").length
  const closedCount = drives.filter((d) => d.status === "closed").length
  const totalApplicants = drives.reduce((s, d) => s + d.totalApplicants, 0)

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">
              Hiring Drives
            </h1>
            <p className="text-xs text-muted-foreground">
              {drives.length} drives &middot; {openCount} active
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 self-start shadow-md shadow-primary/20 sm:self-auto"
          >
            <Plus className="size-3.5" />
            New Hiring Drive
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Open Drives" value={openCount} color="text-emerald-500" />
          <StatCard label="Closed" value={closedCount} color="text-red-500" />
          <StatCard label="Total Applicants" value={totalApplicants} color="text-primary" />
        </div>

        {/* Search + Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drives..."
              className="w-full rounded-xl border border-border/40 bg-card/60 py-2.5 pl-9 pr-3 text-sm text-foreground shadow-2xl backdrop-blur-2xl placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as DriveStatus | "all")
            }
            className="rounded-xl border border-border/40 bg-card/60 px-3 py-2 text-sm text-foreground shadow-2xl backdrop-blur-2xl focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Desktop Table */}
        <div className="hidden rounded-2xl border border-border/40 bg-card/60 shadow-2xl backdrop-blur-2xl sm:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Drive Title
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Applicants
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Created
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const st = STATUS_CONFIG[d.status]
                  return (
                    <tr
                      key={d.id}
                      onClick={() =>
                        router.push(`/dashboard/hr/hiring-drives/${d.id}`)
                      }
                      className="cursor-pointer border-b border-border/20 transition-colors hover:bg-primary/5"
                    >
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {d.title}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {d.sourceType === "walk-in"
                              ? "Walk-In Drive"
                              : "Standard Application"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="border-border/40 text-[10px] text-muted-foreground"
                        >
                          {EMP_TYPE_LABEL[d.employmentType]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn("size-2 rounded-full", st.dot)}
                          />
                          <span
                            className={cn("text-xs font-medium", st.text)}
                          >
                            {st.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground">
                            {d.totalApplicants}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {d.createdAt}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60">
                            by {d.createdBy}
                          </p>
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
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No drives found
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-2 sm:hidden">
          {filtered.map((d) => {
            const st = STATUS_CONFIG[d.status]
            return (
              <div
                key={d.id}
                onClick={() =>
                  router.push(`/dashboard/hr/hiring-drives/${d.id}`)
                }
                className="cursor-pointer rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl transition-colors active:bg-primary/5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {d.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {EMP_TYPE_LABEL[d.employmentType]} &middot;{" "}
                      {d.sourceType === "walk-in"
                        ? "Walk-In"
                        : "Standard"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className={cn("size-1.5 rounded-full", st.dot)} />
                    <span className={cn("text-[10px] font-medium", st.text)}>
                      {st.label}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">
                      {d.totalApplicants}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      applicants
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {d.createdAt}
                  </span>
                </div>
                <p className="mt-1.5 border-t border-border/20 pt-1.5 text-[10px] text-muted-foreground/60">
                  Created by {d.createdBy}
                </p>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No drives found
            </div>
          )}
        </div>
      </div>

      <CreateDriveModal open={createOpen} onOpenChange={setCreateOpen} />
    </DashboardShell>
  )
}
