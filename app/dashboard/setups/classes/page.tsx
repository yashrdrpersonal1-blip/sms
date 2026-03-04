"use client"

import { useState, useMemo } from "react"
import {
  Plus, GraduationCap, Trash2, ShieldCheck, Save,
  ChevronDown, Users, Layers, Hash, LayoutGrid,
  BookOpen, Dumbbell, Music, Cpu, Calculator,
  FlaskConical, Globe2, Languages, Palette, Microscope,
  History, AlertTriangle, Search, X, GitBranch,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ────────────────────────────────────────── */

interface ClassItem {
  id: string
  name: string
  order: number
  category: "Primary" | "Middle" | "Senior" | "Vocational"
  capacity: number
  maxSections: number
  idealStrength: number
  overSubscription: boolean
  namingPattern: "alphabetical" | "numeric" | "custom"
  customNames: string[]
  coreSubjects: string[]
  activities: string[]
  admissionWorkflows: string[]
}

/* ── Subject & Activity refs from Academic Assets ── */

interface AssetRef {
  id: string
  name: string
  icon: LucideIcon
  color: string
}

const SUBJECT_ASSETS: AssetRef[] = [
  { id: "eng", name: "English", icon: BookOpen, color: "text-blue-500" },
  { id: "math", name: "Mathematics", icon: Calculator, color: "text-primary" },
  { id: "sci", name: "Science", icon: FlaskConical, color: "text-emerald-500" },
  { id: "sst", name: "Social Studies", icon: Globe2, color: "text-amber-500" },
  { id: "hindi", name: "Hindi", icon: Languages, color: "text-orange-500" },
  { id: "cs", name: "Computer Science", icon: Cpu, color: "text-violet-500" },
  { id: "pe", name: "Physical Education", icon: Dumbbell, color: "text-red-500" },
  { id: "art", name: "Art & Craft", icon: Palette, color: "text-pink-500" },
  { id: "bio", name: "Biology", icon: Microscope, color: "text-teal-500" },
  { id: "hist", name: "History", icon: History, color: "text-yellow-600" },
]

const ACTIVITY_ASSETS: AssetRef[] = [
  { id: "yoga", name: "Yoga", icon: Dumbbell, color: "text-red-500" },
  { id: "robotics", name: "Robotics", icon: Cpu, color: "text-violet-500" },
  { id: "cricket", name: "Cricket", icon: Dumbbell, color: "text-emerald-500" },
  { id: "music", name: "Music", icon: Music, color: "text-pink-500" },
  { id: "dance", name: "Dance", icon: Music, color: "text-orange-500" },
  { id: "coding", name: "Coding Club", icon: Cpu, color: "text-primary" },
]

/* ── Admission Workflow options (from Pipeline Architect) ── */

interface WorkflowOption {
  id: string
  name: string
  description: string
}

const WORKFLOW_OPTIONS: WorkflowOption[] = [
  { id: "basic-enquiry", name: "Basic Enquiry Flow", description: "Standard enquiry-to-admission path" },
  { id: "senior-v2", name: "Senior Secondary V2.0", description: "Enhanced flow for senior classes" },
  { id: "sports-quota", name: "Sports Quota", description: "Merit-based sports admission route" },
  { id: "lateral-entry", name: "Lateral Entry", description: "Mid-year transfer admission flow" },
  { id: "rte-quota", name: "RTE Quota", description: "Right to Education reservation route" },
  { id: "mgmt-quota", name: "Management Quota", description: "Direct management admission path" },
]

/* ── Seed Data ────────────────────────────────────── */

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "nursery", name: "Nursery", order: 1, category: "Primary",
    capacity: 60, maxSections: 2, idealStrength: 30, overSubscription: false,
    namingPattern: "alphabetical", customNames: [],
    coreSubjects: ["eng", "math", "hindi", "art", "pe"],
    activities: ["yoga", "music", "dance"],
    admissionWorkflows: ["basic-enquiry"],
  },
  {
    id: "lkg", name: "LKG", order: 2, category: "Primary",
    capacity: 60, maxSections: 2, idealStrength: 30, overSubscription: false,
    namingPattern: "alphabetical", customNames: [],
    coreSubjects: ["eng", "math", "hindi", "art", "pe"],
    activities: ["yoga", "music"],
    admissionWorkflows: ["basic-enquiry"],
  },
  {
    id: "ukg", name: "UKG", order: 3, category: "Primary",
    capacity: 60, maxSections: 2, idealStrength: 30, overSubscription: false,
    namingPattern: "alphabetical", customNames: [],
    coreSubjects: ["eng", "math", "hindi", "art", "pe"],
    activities: ["yoga", "music", "dance"],
    admissionWorkflows: ["basic-enquiry"],
  },
  {
    id: "grade1", name: "Grade 1", order: 4, category: "Primary",
    capacity: 90, maxSections: 3, idealStrength: 30, overSubscription: false,
    namingPattern: "alphabetical", customNames: [],
    coreSubjects: ["eng", "math", "sci", "hindi", "pe", "art"],
    activities: ["yoga", "cricket"],
    admissionWorkflows: ["basic-enquiry", "rte-quota"],
  },
  {
    id: "grade5", name: "Grade 5", order: 8, category: "Primary",
    capacity: 120, maxSections: 3, idealStrength: 40, overSubscription: true,
    namingPattern: "alphabetical", customNames: [],
    coreSubjects: ["eng", "math", "sci", "sst", "hindi", "cs"],
    activities: ["yoga", "cricket", "robotics"],
    admissionWorkflows: ["basic-enquiry", "lateral-entry"],
  },
  {
    id: "grade8", name: "Grade 8", order: 11, category: "Middle",
    capacity: 150, maxSections: 4, idealStrength: 38, overSubscription: true,
    namingPattern: "alphabetical", customNames: [],
    coreSubjects: ["eng", "math", "sci", "sst", "hindi", "cs", "pe"],
    activities: ["cricket", "robotics", "coding"],
    admissionWorkflows: ["basic-enquiry", "sports-quota"],
  },
  {
    id: "grade10", name: "Grade 10", order: 13, category: "Senior",
    capacity: 160, maxSections: 4, idealStrength: 40, overSubscription: false,
    namingPattern: "numeric", customNames: [],
    coreSubjects: ["eng", "math", "sci", "sst", "hindi", "cs", "pe"],
    activities: ["cricket", "robotics", "coding", "yoga"],
    admissionWorkflows: ["senior-v2", "sports-quota"],
  },
  {
    id: "grade12", name: "Grade 12", order: 15, category: "Senior",
    capacity: 120, maxSections: 3, idealStrength: 40, overSubscription: false,
    namingPattern: "custom", customNames: ["Science-A", "Science-B", "Commerce"],
    coreSubjects: ["eng", "math", "bio", "hist", "cs"],
    activities: ["coding", "robotics"],
    admissionWorkflows: ["senior-v2", "mgmt-quota"],
  },
]

/* ── Helpers ──────────────────────────────────────── */

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-xl shadow-sm", className)}>
      {children}
    </div>
  )
}

/* ── Admission Workflow Multi-Select ──────────────── */

function WorkflowMultiSelect({
  selectedIds,
  onToggle,
  onRemove,
}: {
  selectedIds: string[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const filtered = WORKFLOW_OPTIONS.filter(w =>
    w.name.toLowerCase().includes(query.toLowerCase())
  )
  const selected = WORKFLOW_OPTIONS.filter(w => selectedIds.includes(w.id))

  return (
    <div className="relative flex flex-col gap-1.5">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Admission Workflow
      </Label>

      {/* Trigger area */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex min-h-[38px] w-full flex-wrap items-center gap-1.5 rounded-lg border border-border/50 bg-background/80 px-3 py-1.5 text-left text-sm transition-colors hover:border-primary/40"
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground">Standard Admission Route (Default)</span>
        )}
        {selected.map(w => (
          <span
            key={w.id}
            className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {w.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(w.id) }}
              className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-primary/20"
            >
              <X className="size-2.5" />
            </button>
          </span>
        ))}
        <GitBranch className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border/50 bg-card/95 shadow-xl backdrop-blur-2xl">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border/30 px-3 py-2">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search workflows..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">No workflows found</p>
            )}
            {filtered.map(w => {
              const isSelected = selectedIds.includes(w.id)
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onToggle(w.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    isSelected ? "bg-primary/10" : "hover:bg-accent/60"
                  )}
                >
                  <div className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-border/60 bg-background/60"
                  )}>
                    {isSelected && <span className="text-[10px]">&#10003;</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>{w.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{w.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border/30 px-3 py-2">
            <span className="text-[10px] text-muted-foreground">{selectedIds.length} selected</span>
            <button
              type="button"
              onClick={() => { setOpen(false); setQuery("") }}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const CATEGORY_COLOR: Record<string, string> = {
  Primary: "bg-blue-500/15 text-blue-500",
  Middle: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Senior: "bg-primary/15 text-primary",
  Vocational: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

/* ═════════════════════════════════════════════════════
   MAIN PAGE
   ═════════════════════════════════════════════════════ */

export default function ClassMasterPage() {
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ClassItem | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Create form
  const [newName, setNewName] = useState("")
  const [newOrder, setNewOrder] = useState("")
  const [newCategory, setNewCategory] = useState<ClassItem["category"]>("Primary")

  // Derived
  const sorted = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes])
  const totalCapacity = useMemo(() => classes.reduce((s, c) => s + c.capacity, 0), [classes])

  function handleCreate() {
    if (!newName.trim()) return
    const cls: ClassItem = {
      id: newName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: newName.trim(),
      order: parseInt(newOrder) || classes.length + 1,
      category: newCategory,
      capacity: 60,
      maxSections: 2,
      idealStrength: 30,
      overSubscription: false,
      namingPattern: "alphabetical",
      customNames: [],
      coreSubjects: [],
      activities: [],
      admissionWorkflows: [],
    }
    setClasses(prev => [...prev, cls])
    setNewName("")
    setNewOrder("")
    setNewCategory("Primary")
    setCreateOpen(false)
    setExpandedId(cls.id)
  }

  function handleDelete(id: string) {
    setClasses(prev => prev.filter(c => c.id !== id))
    setDeleteTarget(null)
    if (expandedId === id) setExpandedId(null)
  }

  function updateClass(id: string, patch: Partial<ClassItem>) {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  function toggleSubject(classId: string, subjectId: string) {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c
      const has = c.coreSubjects.includes(subjectId)
      return { ...c, coreSubjects: has ? c.coreSubjects.filter(s => s !== subjectId) : [...c.coreSubjects, subjectId] }
    }))
  }

  function toggleActivity(classId: string, activityId: string) {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c
      const has = c.activities.includes(activityId)
      return { ...c, activities: has ? c.activities.filter(a => a !== activityId) : [...c.activities, activityId] }
    }))
  }

  function toggleWorkflow(classId: string, workflowId: string) {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c
      const has = c.admissionWorkflows.includes(workflowId)
      return { ...c, admissionWorkflows: has ? c.admissionWorkflows.filter(w => w !== workflowId) : [...c.admissionWorkflows, workflowId] }
    }))
  }

  function removeWorkflow(classId: string, workflowId: string) {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c
      return { ...c, admissionWorkflows: c.admissionWorkflows.filter(w => w !== workflowId) }
    }))
  }

  return (
    <DashboardShell>
      {/* ── Sticky Header ─────────────────────────────── */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <GraduationCap className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground md:text-xl">Class Master Setup</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Define grade structure, capacity rules, and academic mapping</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Save className="size-4" /> Save All Changes
          </Button>
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Create New Class
          </Button>
        </div>
      </div>

      {/* ── Class Blueprint List ──────────────────────── */}
      <div className="space-y-3 pb-20">
        {sorted.map(cls => {
          const isExpanded = expandedId === cls.id
          return (
            <GlassCard key={cls.id} className={cn("transition-all", isExpanded && "border-primary/30")}>
              {/* Collapsed row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : cls.id)}
                className="flex w-full items-center gap-3 text-left"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <GraduationCap className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{cls.name}</span>
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", CATEGORY_COLOR[cls.category])}>
                      {cls.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {cls.maxSections} sections, {cls.capacity} cap, {cls.coreSubjects.length} subjects
                    {cls.admissionWorkflows.length > 0 && `, ${cls.admissionWorkflows.length} workflow${cls.admissionWorkflows.length > 1 ? "s" : ""}`}
                  </p>
                </div>
                <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
              </button>

              {/* Expanded zones */}
              {isExpanded && (
                <div className="mt-4 space-y-5">
                  <Separator className="bg-border/30" />

                  {/* ZONE A: Enrollment Gatekeeping */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Users className="size-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enrollment Gatekeeping</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Class Capacity</Label>
                        <Input
                          type="number"
                          value={cls.capacity}
                          onChange={e => updateClass(cls.id, { capacity: parseInt(e.target.value) || 0 })}
                          className="h-9 border-border/50 bg-background/80 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Max Sections Allowed</Label>
                        <Input
                          type="number"
                          value={cls.maxSections}
                          onChange={e => updateClass(cls.id, { maxSections: parseInt(e.target.value) || 0 })}
                          className="h-9 border-border/50 bg-background/80 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Ideal Section Strength</Label>
                        <Input
                          type="number"
                          value={cls.idealStrength}
                          onChange={e => updateClass(cls.id, { idealStrength: parseInt(e.target.value) || 0 })}
                          className="h-9 border-border/50 bg-background/80 text-sm"
                        />
                      </div>
                    </div>

                    {/* Admission Workflow & Over-subscription row */}
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Admission Workflow multi-select */}
                      <WorkflowMultiSelect
                        selectedIds={cls.admissionWorkflows}
                        onToggle={(wId) => toggleWorkflow(cls.id, wId)}
                        onRemove={(wId) => removeWorkflow(cls.id, wId)}
                      />

                      {/* Over-subscription toggle */}
                      <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/30 px-4 py-3 backdrop-blur-sm">
                        <div>
                          <p className="text-sm font-medium text-foreground">Allow Over-subscription</p>
                          <p className="text-[11px] text-muted-foreground">Permit beyond capacity</p>
                        </div>
                        <Switch
                          checked={cls.overSubscription}
                          onCheckedChange={v => updateClass(cls.id, { overSubscription: v })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ZONE B: Section Naming */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Layers className="size-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section Naming</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Naming Pattern</Label>
                        <Select
                          value={cls.namingPattern}
                          onValueChange={v => updateClass(cls.id, { namingPattern: v as ClassItem["namingPattern"] })}
                        >
                          <SelectTrigger className="h-9 border-border/50 bg-background/80 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alphabetical">Alphabetical (A, B, C)</SelectItem>
                            <SelectItem value="numeric">Numeric (1, 2, 3)</SelectItem>
                            <SelectItem value="custom">Custom Names</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Preview</Label>
                        <div className="flex h-9 flex-wrap items-center gap-1.5 rounded-lg border border-border/50 bg-background/80 px-3">
                          {cls.namingPattern === "alphabetical" && Array.from({ length: cls.maxSections }, (_, i) => (
                            <Badge key={i} variant="outline" className="h-5 px-1.5 text-[10px]">
                              {cls.name}-{String.fromCharCode(65 + i)}
                            </Badge>
                          ))}
                          {cls.namingPattern === "numeric" && Array.from({ length: cls.maxSections }, (_, i) => (
                            <Badge key={i} variant="outline" className="h-5 px-1.5 text-[10px]">
                              {cls.name}-{i + 1}
                            </Badge>
                          ))}
                          {cls.namingPattern === "custom" && cls.customNames.map((n, i) => (
                            <Badge key={i} variant="outline" className="h-5 px-1.5 text-[10px]">{n}</Badge>
                          ))}
                          {cls.namingPattern === "custom" && cls.customNames.length === 0 && (
                            <span className="text-[11px] text-muted-foreground">No custom names defined</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Custom Name Editor */}
                    {cls.namingPattern === "custom" && (
                      <div className="mt-3 space-y-2">
                        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Custom Section Names</Label>
                        <div className="space-y-1.5">
                          {cls.customNames.map((name, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                                {i + 1}
                              </div>
                              <Input
                                value={name}
                                onChange={e => {
                                  const updated = [...cls.customNames]
                                  updated[i] = e.target.value
                                  updateClass(cls.id, { customNames: updated })
                                }}
                                className="h-8 flex-1 border-border/50 bg-background/80 text-sm"
                              />
                              <button
                                onClick={() => updateClass(cls.id, { customNames: cls.customNames.filter((_, ci) => ci !== i) })}
                                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => updateClass(cls.id, { customNames: [...cls.customNames, `Section ${cls.customNames.length + 1}`] })}
                        >
                          <Plus className="size-3" /> Add Section Name
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* ZONE C: Academic Mapping */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Academic Mapping</h3>
                    </div>

                    {/* Core Subjects */}
                    <p className="mb-2 text-[11px] font-medium text-muted-foreground">Core Subjects</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {SUBJECT_ASSETS.map(subj => {
                        const active = cls.coreSubjects.includes(subj.id)
                        const Icon = subj.icon
                        return (
                          <button
                            key={subj.id}
                            onClick={() => toggleSubject(cls.id, subj.id)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95",
                              active
                                ? "border-primary/50 bg-primary/15 text-primary shadow-sm shadow-primary/10"
                                : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                            )}
                          >
                            <Icon className={cn("size-3.5", active ? "text-primary" : subj.color)} />
                            {subj.name}
                          </button>
                        )
                      })}
                    </div>

                    {/* Co-Curricular Activities */}
                    <p className="mb-2 text-[11px] font-medium text-muted-foreground">Co-Curricular Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_ASSETS.map(act => {
                        const active = cls.activities.includes(act.id)
                        const Icon = act.icon
                        return (
                          <button
                            key={act.id}
                            onClick={() => toggleActivity(cls.id, act.id)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95",
                              active
                                ? "border-primary/50 bg-primary/15 text-primary shadow-sm shadow-primary/10"
                                : "border-border/40 bg-background/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                            )}
                          >
                            <Icon className={cn("size-3.5", active ? "text-primary" : act.color)} />
                            {act.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* ZONE D: Actions */}
                  <Separator className="bg-border/30" />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(cls)}
                    >
                      <Trash2 className="size-4" /> Delete Class
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          )
        })}

        {classes.length === 0 && (
          <GlassCard className="py-16 text-center">
            <GraduationCap className="mx-auto mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No classes configured yet.</p>
            <Button size="sm" className="mt-4 gap-1.5 shadow-md shadow-primary/20" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> Create Your First Class
            </Button>
          </GlassCard>
        )}
      </div>

      {/* ── Fixed Summary Footer ──────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/40 bg-card/80 px-4 py-3 backdrop-blur-2xl md:left-16">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <LayoutGrid className="size-4 text-primary" />
            <span className="text-muted-foreground">Active Grades:</span>
            <span className="font-semibold text-foreground">{classes.length}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="text-muted-foreground">Total Campus Ceiling:</span>
            <span className="font-semibold text-foreground">{totalCapacity.toLocaleString()} Students</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
         CREATE CLASS DIALOG
         ═══════════════════════════════════════════════════ */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-4 text-primary" /> Create New Class
            </DialogTitle>
            <DialogDescription>
              Initialize a new class blueprint with enrollment and section rules.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Class Name</Label>
              <Input
                placeholder='e.g. "Nursery" or "Grade 12"'
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="border-border/50 bg-background/80"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Order Index</Label>
              <Input
                type="number"
                placeholder="Position in list (e.g. 1, 2, 3)"
                value={newOrder}
                onChange={e => setNewOrder(e.target.value)}
                className="border-border/50 bg-background/80"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Primary Category</Label>
              <Select value={newCategory} onValueChange={v => setNewCategory(v as ClassItem["category"])}>
                <SelectTrigger className="border-border/50 bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Middle">Middle</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Vocational">Vocational</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()} className="gap-1.5 shadow-md shadow-primary/20">
              <ShieldCheck className="size-4" /> Initialize Class Blueprint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════
         DELETE CONFIRMATION DIALOG
         ═══════════════════════════════════════════════════ */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur-2xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Delete {deleteTarget?.name}?
            </DialogTitle>
            <DialogDescription>
              This will remove all academic mapping for this grade. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              className="gap-1.5"
            >
              <Trash2 className="size-4" /> Delete Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
