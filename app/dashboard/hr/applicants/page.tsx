"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search, Filter, Eye, Users, UserPlus, X,
  Phone, MapPin, Calendar, Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"
import {
  useATSStore,
  PIPELINE_STAGES,
  STAGE_COLORS,
  SOURCE_COLORS,
  type Applicant,
  type ApplicantStage,
  type ApplicantSource,
} from "@/stores/ats-store"

/* ── Add Applicant Drawer ─────────────────────── */

function AddApplicantDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const drives = useATSStore((s) => s.drives)
  const addApplicant = useATSStore((s) => s.addApplicant)
  const openDrives = drives.filter((d) => d.status === "open")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [place, setPlace] = useState("")
  const [qualification, setQualification] = useState<"graduation" | "post-graduation" | "phd">("graduation")
  const [aadhaar, setAadhaar] = useState("")
  const [source, setSource] = useState<ApplicantSource>("walk-in")
  const [driveId, setDriveId] = useState("")
  const [referredBy, setReferredBy] = useState("")

  function handleSave() {
    if (!name.trim() || !driveId) return
    const drive = drives.find((d) => d.id === driveId)
    const applicant: Applicant = {
      id: `ap-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      place: place.trim(),
      qualification,
      aadhaar: aadhaar.trim(),
      stage: "applied",
      source,
      driveId,
      driveTitle: drive?.title ?? "",
      appliedRole: drive?.title.split(" - ")[0] ?? "",
      referredBy: source === "referral" ? referredBy.trim() : undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: "HR Manager",
      tasks: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: "system",
          text: `Manually added by HR (${source === "walk-in" ? "Walk-In" : source === "referral" ? "Direct Referral" : "Agency"})`,
          by: "HR Manager",
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
    setName(""); setEmail(""); setPhone(""); setPlace(""); setAadhaar(""); setReferredBy(""); setDriveId("")
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-border/40 bg-card/95 backdrop-blur-2xl sm:!w-[480px] sm:!max-w-[480px] p-0 overflow-hidden [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3 sm:px-6">
            <SheetTitle className="flex items-center gap-2 text-foreground text-sm sm:text-base">
              <UserPlus className="size-5 text-primary" />
              Add Applicant Manually
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4">
              {/* Drive Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Hiring Drive *
                </label>
                <select
                  value={driveId}
                  onChange={(e) => setDriveId(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="">Select a drive...</option>
                  {openDrives.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Full Name *" value={name} onChange={setName} placeholder="Applicant name" />
                <FormField label="Email" value={email} onChange={setEmail} placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Phone" value={phone} onChange={setPhone} placeholder="10-digit mobile" />
                <FormField label="Place / City" value={place} onChange={setPlace} placeholder="City name" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Aadhaar Number
                </label>
                <input
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Highest Qualification
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value as "graduation" | "post-graduation" | "phd")}
                  className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="graduation">Graduation</option>
                  <option value="post-graduation">Post-Graduation</option>
                  <option value="phd">PhD</option>
                </select>
              </div>

              {/* Source */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as ApplicantSource)}
                  className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="walk-in">Walk-In</option>
                  <option value="referral">Direct Referral</option>
                  <option value="agency">Agency</option>
                </select>
              </div>

              {source === "referral" && (
                <FormField
                  label="Referred By (Employee)"
                  value={referredBy}
                  onChange={setReferredBy}
                  placeholder="Select or type employee name"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/30 px-4 py-3 sm:px-6">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!name.trim() || !driveId}
              className="shadow-md shadow-primary/20"
            >
              Add Applicant
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
      />
    </div>
  )
}

/* ── Page ──────────────────────────────────────── */

export default function ApplicantPoolPage() {
  const router = useRouter()
  const applicants = useATSStore((s) => s.applicants)
  const drives = useATSStore((s) => s.drives)

  const [addOpen, setAddOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<ApplicantStage | "all">("all")
  const [driveFilter, setDriveFilter] = useState<string>("all")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = applicants
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.place.toLowerCase().includes(q)
      )
    }
    if (stageFilter !== "all") list = list.filter((a) => a.stage === stageFilter)
    if (driveFilter !== "all") list = list.filter((a) => a.driveId === driveFilter)
    return list
  }, [applicants, search, stageFilter, driveFilter])

  const activeFilterCount = [stageFilter !== "all", driveFilter !== "all"].filter(Boolean).length

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">
              Applicant Pool
            </h1>
            <p className="text-xs text-muted-foreground">
              {applicants.length} total applicants across all drives
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="gap-1.5 self-start shadow-md shadow-primary/20 sm:self-auto"
          >
            <UserPlus className="size-3.5" />
            Add Applicant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {PIPELINE_STAGES.map((s) => {
            const count = applicants.filter((a) => a.stage === s.id).length
            const sc = STAGE_COLORS[s.id]
            return (
              <div
                key={s.id}
                className="rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl"
              >
                <p className={cn("text-lg font-bold sm:text-xl", sc.text)}>
                  {count}
                </p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone, city..."
                className="w-full rounded-xl border border-border/40 bg-card/60 py-2.5 pl-9 pr-3 text-sm text-foreground shadow-2xl backdrop-blur-2xl placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn(
                "gap-1.5 border-border/40 text-xs",
                filtersOpen && "border-primary/40 bg-primary/5 text-primary"
              )}
            >
              <Filter className="size-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {filtersOpen && (
            <div className="flex flex-col gap-3 rounded-xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Filters
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setStageFilter("all")
                      setDriveFilter("all")
                    }}
                    className="text-[10px] font-medium text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Stage
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip
                    label="All"
                    active={stageFilter === "all"}
                    onClick={() => setStageFilter("all")}
                  />
                  {PIPELINE_STAGES.map((s) => (
                    <FilterChip
                      key={s.id}
                      label={s.label}
                      active={stageFilter === s.id}
                      onClick={() => setStageFilter(s.id)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Hiring Drive
                </p>
                <select
                  value={driveFilter}
                  onChange={(e) => setDriveFilter(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  <option value="all">All Drives</option>
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
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
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Applicant
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Applied Drive
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Source
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const stg = PIPELINE_STAGES.find((s) => s.id === a.stage)
                  const sc = STAGE_COLORS[a.stage]
                  const src = SOURCE_COLORS[a.source]
                  return (
                    <tr
                      key={a.id}
                      onClick={() =>
                        router.push(`/dashboard/hr/applicants/${a.id}`)
                      }
                      className="cursor-pointer border-b border-border/20 transition-colors hover:bg-primary/5"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {a.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {a.name}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {a.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">
                          {a.driveTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            sc.border,
                            sc.bg,
                            sc.text
                          )}
                        >
                          {stg?.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            src.border,
                            src.bg,
                            src.text
                          )}
                        >
                          {src.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {a.createdAt}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60">
                            by {a.createdBy}
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
              No applicants found
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-2 sm:hidden">
          {filtered.map((a) => {
            const stg = PIPELINE_STAGES.find((s) => s.id === a.stage)
            const sc = STAGE_COLORS[a.stage]
            const src = SOURCE_COLORS[a.source]
            return (
              <div
                key={a.id}
                onClick={() =>
                  router.push(`/dashboard/hr/applicants/${a.id}`)
                }
                className="cursor-pointer rounded-2xl border border-border/40 bg-card/60 p-3 shadow-2xl backdrop-blur-2xl transition-colors active:bg-primary/5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {a.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {a.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {a.driveTitle}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[10px]",
                      sc.border,
                      sc.bg,
                      sc.text
                    )}
                  >
                    {stg?.label}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        src.border,
                        src.bg,
                        src.text
                      )}
                    >
                      {src.label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {a.place}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {a.createdAt}
                  </span>
                </div>
                <p className="mt-1.5 border-t border-border/20 pt-1.5 text-[10px] text-muted-foreground/60">
                  Created by {a.createdBy}
                </p>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No applicants found
            </div>
          )}
        </div>
      </div>

      <AddApplicantDrawer open={addOpen} onOpenChange={setAddOpen} />
    </DashboardShell>
  )
}

/* ── Filter Chip ──────────────────────────────── */

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
      )}
    >
      {label}
    </button>
  )
}
