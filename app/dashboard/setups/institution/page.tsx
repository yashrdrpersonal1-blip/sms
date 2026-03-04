"use client"

import { useState } from "react"
import {
  Lock, Unlock, Download, Printer,
  Maximize2, Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Reusable sub-components ─────────────────────────────── */

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-xl",
        "flex flex-col gap-4 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
      {children}
    </h2>
  )
}

function FieldInput({ label, value, full, locked }: { label: string; value: string; full?: boolean; locked: boolean }) {
  const [val, setVal] = useState(value)
  return (
    <div className={cn("flex flex-col gap-1.5", full && "md:col-span-2")}>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          disabled={locked}
          className={cn(
            "w-full rounded-lg border px-3 py-2.5 text-sm transition-colors",
            locked
              ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed opacity-75"
              : "border-border/60 bg-background/80 text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
          )}
        />
        {locked && <Lock className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted-foreground/60" />}
      </div>
    </div>
  )
}

function FieldSelect({ label, value, options, locked }: { label: string; value: string; options?: string[]; locked: boolean }) {
  const [val, setVal] = useState(value)
  const opts = options ?? [value]
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          value={val}
          onChange={(e) => setVal(e.target.value)}
          disabled={locked}
          className={cn(
            "w-full appearance-none rounded-lg border px-3 py-2.5 text-sm transition-colors",
            locked
              ? "border-border/50 bg-muted/50 text-muted-foreground cursor-not-allowed opacity-75"
              : "border-border/60 bg-background/80 text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
          )}
        >
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {locked && <Lock className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted-foreground/60" />}
      </div>
    </div>
  )
}

function ToggleRow({ label, checked, locked }: { label: string; checked: boolean; locked: boolean }) {
  const [on, setOn] = useState(checked)
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Switch checked={on} onCheckedChange={setOn} disabled={locked} />
    </div>
  )
}

/* ── A4 mock document ────────────────────────────────────── */

function A4Document({ large }: { large?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg bg-background shadow-lg",
        large
          ? "w-full max-w-2xl p-8"
          : "aspect-[1/1.4] w-full max-w-sm p-6",
      )}
    >
      <div className="border-b border-border pb-3">
        <p className={cn("font-bold text-primary", large ? "text-sm" : "text-xs")}>
          CENTRAL BOARD OF SECONDARY EDUCATION
        </p>
        <p className={cn("mt-1 text-muted-foreground", large ? "text-xs" : "text-[10px]")}>
          New Delhi
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className={cn("font-semibold text-foreground", large ? "text-sm" : "text-xs")}>
          Affiliation Certificate
        </p>
        <p className={cn("leading-relaxed text-muted-foreground", large ? "text-sm" : "text-[10px]")}>
          This is to certify that RAO DEENA RAM VIDYA VIHAR SENIOR SECONDARY SCHOOL
          is duly affiliated with the Central Board of Secondary Education (CBSE) for
          conducting secondary and senior secondary education in accordance with the
          rules and regulations of the Board.
          {large && (
            <> The institution has been authorized to prepare its students for examination
            in Humanities, Science, and Commerce streams.</>
          )}
        </p>
      </div>

      <div className={cn("grid gap-2", large ? "grid-cols-3 text-sm" : "grid-cols-2 text-[9px]")}>
        <div>
          <p className="font-semibold text-muted-foreground">Affiliation No:</p>
          <p className="text-foreground">531923</p>
        </div>
        <div>
          <p className="font-semibold text-muted-foreground">Valid Upto:</p>
          <p className="text-foreground">31/03/2029</p>
        </div>
        {large && (
          <div>
            <p className="font-semibold text-muted-foreground">Issue Date:</p>
            <p className="text-foreground">15/04/2023</p>
          </div>
        )}
      </div>

      {large && (
        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground">State:</p>
              <p className="text-foreground">HARYANA</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">District:</p>
              <p className="text-foreground">REWARI</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Principal:</p>
              <p className="text-foreground">ARVIND YADAV</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Trust/Society:</p>
              <p className="text-foreground">RAO DEENA RAM VIDYA VIHAR SHIKSHA SAMITI</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────── */

export default function InstitutionSetupPage() {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [extracting, setExtracting] = useState(true) /* true = locked, false = editable */

  return (
    <DashboardShell>
      {/* ── Page Title Bar ────────────────────────────────── */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold text-foreground md:text-xl">
          Core Institution Setup
        </h1>
        <Button size="sm" className="shadow-md shadow-primary/20">
          Save Configuration
        </Button>
      </div>

      {/* ── Grid Layout ───────────────────────────────────── */}
      <div className="mx-auto max-w-7xl gap-6 lg:grid lg:grid-cols-12">

        {/* ── LEFT: Form Cards ────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-7">

          {/* Pipeline Banner */}
          <div className={cn(
            "flex flex-col items-start justify-between gap-3 rounded-2xl border p-4 backdrop-blur-md sm:flex-row sm:items-center transition-colors",
            extracting
              ? "border-primary/20 bg-primary/5"
              : "border-border/40 bg-card/60"
          )}>
            <div className="flex items-start gap-3">
              {extracting ? (
                <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
              ) : (
                <Unlock className="mt-0.5 size-5 shrink-0 text-foreground" />
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {extracting ? "Pipeline: Auto-Verified" : "Manual Editing Mode"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {extracting
                    ? "Data successfully extracted and locked. Click to unlock for manual edits."
                    : "Fields are now editable. Make your corrections and save."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setExtracting(prev => !prev)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-colors",
                extracting
                  ? "border-border/50 bg-card/60 text-foreground hover:bg-accent"
                  : "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {extracting ? <Unlock className="size-4" /> : <Lock className="size-4" />}
              {extracting ? "Unlock Fields" : "Lock Fields"}
            </button>
          </div>

          {/* CARD 1: Core Identity */}
          <GlassCard>
            <SectionTitle>Core Identity</SectionTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldInput label="Institution Name" value="RAO DEENA RAM VIDYA VIHAR SENIOR SECONDARY SCHOOL" full locked={extracting} />
              <FieldInput label="Foundation Year" value="2006" locked={extracting} />
              <FieldInput label="Website" value="" locked={extracting} />
              <FieldInput label="School Level" value="Senior Secondary" locked={extracting} />
            </div>
            {/* Logo upload zone */}
            <div className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors",
              extracting
                ? "cursor-not-allowed border-border/60 bg-card/40 opacity-75"
                : "cursor-pointer border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
            )}>
              <div className="flex size-9 items-center justify-center rounded-full bg-muted/60">
                <Upload className="size-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Upload School Logo</p>
              <p className="text-xs text-muted-foreground/60">Drag & drop or click to upload</p>
            </div>
          </GlassCard>

          {/* CARD 2: Governance & Affiliation */}
          <GlassCard>
            <SectionTitle>Governance & Affiliation</SectionTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldSelect label="Board" value="CBSE" options={["CBSE", "ICSE", "State Board"]} locked={extracting} />
              <FieldInput label="Affiliation No" value="531923" locked={extracting} />
              <FieldInput label="Valid Upto" value="31/03/2029" locked={extracting} />
            </div>
            <FieldInput label="Trust/Society Name" value="RAO DEENA RAM VIDYA VIHAR SHIKSHA SAMITI" full locked={extracting} />
          </GlassCard>

          {/* CARD 3: Location Details */}
          <GlassCard>
            <SectionTitle>Location Details</SectionTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldInput label="State" value="HARYANA" locked={extracting} />
              <FieldInput label="District" value="REWARI" locked={extracting} />
              <FieldInput label="Block" value="Jatusana" locked={extracting} />
              <FieldInput label="Pincode" value="123401" locked={extracting} />
            </div>
            <FieldInput label="Postal Address" value="VILL. HALUHERA P.O. MUSEPUR DISTT. REWARI" full locked={extracting} />
          </GlassCard>

          {/* CARD 4: Leadership */}
          <GlassCard>
            <SectionTitle>Leadership</SectionTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldInput label="Principal Name" value="ARVIND YADAV" locked={extracting} />
              <FieldInput label="Qualifications" value="MSc BEd" locked={extracting} />
              <FieldInput label="Admin Exp. (Years)" value="5" locked={extracting} />
              <FieldInput label="Teaching Exp. (Years)" value="2" locked={extracting} />
            </div>
          </GlassCard>

          {/* CARD 5: Demographics */}
          <GlassCard>
            <SectionTitle>Demographics</SectionTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldSelect label="Medium of Instruction" value="English" options={["English", "Hindi", "Bilingual"]} locked={extracting} />
              <FieldSelect label="Primary Regional ID" value="Haryana SRN" options={["Haryana SRN", "Aadhaar", "UDISE"]} locked={extracting} />
            </div>
            <div className="flex flex-col gap-3 border-t border-border/30 pt-4">
              <ToggleRow label="Enable Caste/Category Tracking" checked locked={extracting} />
              <ToggleRow label="Enable Religion Tracking" checked locked={extracting} />
            </div>
          </GlassCard>
        </div>

        {/* ── RIGHT: Document Viewer ──────────────────────── */}
        <div className="mt-6 lg:col-span-5 lg:mt-0">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
            <GlassCard className="h-full overflow-hidden p-0">

              {/* Viewer header */}
              <div className="flex items-center justify-between border-b border-border/30 bg-card/40 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-foreground">Source Document</p>
                <div className="flex gap-1.5">
                  <button className="rounded-lg p-1.5 transition-colors hover:bg-accent">
                    <Download className="size-4 text-muted-foreground" />
                  </button>
                  <button className="rounded-lg p-1.5 transition-colors hover:bg-accent">
                    <Printer className="size-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Viewer body — click to expand */}
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                  <div className="group relative flex flex-1 cursor-zoom-in items-start justify-center overflow-auto bg-muted/20 p-4">
                    {/* Hover overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <div className="flex flex-col items-center gap-2">
                        <Maximize2 className="size-6 text-foreground" />
                        <p className="text-xs font-medium text-foreground">Click to Expand</p>
                      </div>
                    </div>
                    <A4Document />
                  </div>
                </DialogTrigger>

                {/* Expanded modal */}
                <DialogContent className="flex h-[85vh] max-w-4xl flex-col overflow-hidden border-border/40 bg-card/80 p-0 backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-border/30 px-5 py-3">
                    <p className="text-sm font-semibold text-foreground">CBSE Affiliation Certificate</p>
                    <div className="flex gap-1.5">
                      <button className="rounded-lg p-1.5 transition-colors hover:bg-accent">
                        <Download className="size-4 text-muted-foreground" />
                      </button>
                      <button className="rounded-lg p-1.5 transition-colors hover:bg-accent">
                        <Printer className="size-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-1 items-start justify-center overflow-auto bg-muted/10 p-6">
                    <A4Document large />
                  </div>
                </DialogContent>
              </Dialog>

            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
