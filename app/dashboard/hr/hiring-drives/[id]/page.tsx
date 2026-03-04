"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Users, Eye, Filter, Search,
  XCircle, Lock, CheckCircle, Clock, FileText,
  UserCheck, AlertTriangle, Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"
import {
  useATSStore,
  PIPELINE_STAGES,
  STAGE_COLORS,
  SOURCE_COLORS,
  type ApplicantStage,
} from "@/stores/ats-store"

/* ── KPI Card ─────────────────────────────────── */

function KPICard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3 backdrop-blur-xl">
      <p className={cn("text-xl font-bold sm:text-2xl", color)}>{value}</p>
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
    </div>
  )
}

/* ── Page ──────────────────────────────────────── */

export default function HiringDriveDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const driveId = params.id as string

  const drives = useATSStore((s) => s.drives)
  const applicants = useATSStore((s) => s.applicants)
  const updateDriveStatus = useATSStore((s) => s.updateDriveStatus)

  const drive = drives.find((d) => d.id === driveId)
  const driveApplicants = useMemo(
    () => applicants.filter((a) => a.driveId === driveId),
    [applicants, driveId]
  )

  if (!drive) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <AlertTriangle className="mb-2 size-8" />
          <p className="text-sm">Hiring Drive not found</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/dashboard/hr/hiring-drives")}
          >
            Back to Drives
          </Button>
        </div>
      </DashboardShell>
    )
  }

  const countByStage = (stage: ApplicantStage) =>
    driveApplicants.filter((a) => a.stage === stage).length

  const statusDot =
    drive.status === "open"
      ? "bg-emerald-500"
      : drive.status === "closed"
      ? "bg-red-500"
      : "bg-muted-foreground"

  return (
    <DashboardShell>
      <div className="flex flex-col gap-5">
        {/* Back + Header */}
        <div>
          <button
            onClick={() => router.push("/dashboard/hr/hiring-drives")}
            className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to Hiring Drives
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground sm:text-xl">
                  {drive.title}
                </h1>
                <div className="flex items-center gap-1">
                  <div className={cn("size-2 rounded-full", statusDot)} />
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {drive.status}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {drive.employmentType === "full-time"
                  ? "Full-Time"
                  : drive.employmentType === "part-time"
                  ? "Part-Time"
                  : "Contract"}{" "}
                &middot;{" "}
                {drive.sourceType === "walk-in"
                  ? "Walk-In Drive"
                  : "Standard Application"}{" "}
                &middot; Created by {drive.createdBy} on {drive.createdAt}
              </p>
              {drive.description && (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground/80">
                  {drive.description}
                </p>
              )}
            </div>

            {/* Command Actions */}
            <div className="flex items-center gap-2">
              {drive.status === "open" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-red-500/30 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => updateDriveStatus(driveId, "closed")}
                  >
                    <Lock className="size-3.5" />
                    Close Drive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-border/50 text-xs text-muted-foreground"
                    onClick={() => updateDriveStatus(driveId, "cancelled")}
                  >
                    <XCircle className="size-3.5" />
                    Cancel Drive
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* KPI Bar */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          <KPICard
            label="Total"
            value={driveApplicants.length}
            color="text-foreground"
          />
          <KPICard
            label="Screening"
            value={countByStage("screening")}
            color="text-amber-500"
          />
          <KPICard
            label="Interview"
            value={countByStage("interview")}
            color="text-indigo-500"
          />
          <KPICard
            label="Verification"
            value={countByStage("doc-verification")}
            color="text-violet-500"
          />
          <KPICard
            label="Selected"
            value={countByStage("selected")}
            color="text-emerald-500"
          />
          <KPICard
            label="Rejected"
            value={0}
            color="text-red-500"
          />
        </div>

        {/* Child Applicant Table */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Applicants for this Drive
          </p>

          {/* Desktop */}
          <div className="hidden rounded-2xl border border-border/40 bg-card/60 shadow-2xl backdrop-blur-2xl sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Applicant
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Date Applied
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Current Stage
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Source
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" />
                  </tr>
                </thead>
                <tbody>
                  {driveApplicants.map((a) => {
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
                            {a.createdAt}
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
                          <Eye className="size-4 text-muted-foreground/40" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {driveApplicants.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No applicants yet for this drive
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-2 sm:hidden">
            {driveApplicants.map((a) => {
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
                          {a.createdAt}
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
                    <p className="text-[10px] text-muted-foreground/60">
                      Applied by {a.createdBy}
                    </p>
                  </div>
                </div>
              )
            })}
            {driveApplicants.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No applicants yet
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
