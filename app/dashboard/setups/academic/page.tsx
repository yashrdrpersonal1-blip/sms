"use client"

import { useState, useMemo } from "react"
import {
  Search, Plus, BookOpen, Calculator, FlaskConical, Globe2,
  History, Palette, Music, Cpu, Dumbbell, Languages,
  Microscope, Library, GraduationCap, Pen,
  Trash2, GripVertical, ExternalLink, X,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Data Types ────────────────────────────────────── */

interface Subject {
  id: string
  name: string
  code: string
  icon: LucideIcon
  type: "core"
  color: string
  units: Unit[]
  resources: Resource[]
}

interface Unit {
  id: string
  name: string
  chapters: string[]
  status: "not-started" | "in-progress" | "completed"
}

interface Resource {
  id: string
  title: string
  type: "textbook" | "link"
  url?: string
}

interface Activity {
  id: string
  name: string
  icon: LucideIcon
  coach: string
  equipment: string[]
  schedule: string
}

/* ── Seed Data ─────────────────────────────────────── */

const SUBJECTS: Subject[] = [
  {
    id: "eng", name: "English", code: "ENG", icon: BookOpen, color: "text-blue-500",
    units: [
      { id: "u1", name: "Prose & Short Stories", chapters: ["The Last Leaf", "A Letter to God", "The Midnight Visitor"], status: "completed" },
      { id: "u2", name: "Poetry", chapters: ["Dust of Snow", "Fire and Ice", "A Tiger in the Zoo"], status: "in-progress" },
      { id: "u3", name: "Grammar", chapters: ["Tenses", "Active & Passive Voice", "Reported Speech"], status: "not-started" },
    ],
    resources: [
      { id: "r1", title: "First Flight (NCERT)", type: "textbook" },
      { id: "r2", title: "Wren & Martin Grammar", type: "textbook" },
      { id: "r3", title: "DIKSHA English Lessons", type: "link", url: "https://diksha.gov.in" },
    ],
  },
  {
    id: "math", name: "Mathematics", code: "MATH", icon: Calculator, color: "text-primary",
    units: [
      { id: "u1", name: "Algebra", chapters: ["Polynomials", "Pair of Linear Equations", "Quadratic Equations"], status: "completed" },
      { id: "u2", name: "Geometry", chapters: ["Triangles", "Circles", "Coordinate Geometry"], status: "in-progress" },
      { id: "u3", name: "Statistics & Probability", chapters: ["Mean Median Mode", "Probability"], status: "not-started" },
    ],
    resources: [
      { id: "r1", title: "NCERT Mathematics X", type: "textbook" },
      { id: "r2", title: "R.D. Sharma Reference", type: "textbook" },
      { id: "r3", title: "Khan Academy Math", type: "link", url: "https://khanacademy.org" },
    ],
  },
  {
    id: "sci", name: "Science", code: "SCI", icon: FlaskConical, color: "text-emerald-500",
    units: [
      { id: "u1", name: "Physics", chapters: ["Light", "Electricity", "Magnetic Effects"], status: "in-progress" },
      { id: "u2", name: "Chemistry", chapters: ["Chemical Reactions", "Acids Bases Salts", "Carbon Compounds"], status: "not-started" },
      { id: "u3", name: "Biology", chapters: ["Life Processes", "Heredity", "Our Environment"], status: "not-started" },
    ],
    resources: [
      { id: "r1", title: "NCERT Science X", type: "textbook" },
      { id: "r2", title: "Lakhmir Singh Science", type: "textbook" },
    ],
  },
  {
    id: "sst", name: "Social Studies", code: "SST", icon: Globe2, color: "text-amber-500",
    units: [
      { id: "u1", name: "History", chapters: ["Rise of Nationalism", "Industrial Revolution", "Novels Society & History"], status: "completed" },
      { id: "u2", name: "Geography", chapters: ["Resources & Development", "Agriculture", "Minerals & Energy"], status: "in-progress" },
      { id: "u3", name: "Civics", chapters: ["Power Sharing", "Federalism", "Democracy & Diversity"], status: "not-started" },
    ],
    resources: [
      { id: "r1", title: "NCERT Democratic Politics", type: "textbook" },
      { id: "r2", title: "India & Contemporary World", type: "textbook" },
    ],
  },
  {
    id: "hindi", name: "Hindi", code: "HIN", icon: Languages, color: "text-orange-500",
    units: [
      { id: "u1", name: "Kshitij", chapters: ["Surdas ke Pad", "Ram Lakshman Parshuram", "Atmaparichay"], status: "in-progress" },
      { id: "u2", name: "Kritika", chapters: ["Mata ka Aanchal", "George Pancham ki Naak"], status: "not-started" },
    ],
    resources: [
      { id: "r1", title: "Kshitij (NCERT)", type: "textbook" },
      { id: "r2", title: "Kritika (NCERT)", type: "textbook" },
    ],
  },
  {
    id: "cs", name: "Computer Science", code: "CS", icon: Cpu, color: "text-violet-500",
    units: [
      { id: "u1", name: "Programming Concepts", chapters: ["Python Basics", "Data Structures", "Functions & Modules"], status: "completed" },
      { id: "u2", name: "Database", chapters: ["SQL Fundamentals", "Relational Model", "MySQL Queries"], status: "in-progress" },
    ],
    resources: [
      { id: "r1", title: "NCERT CS Class XI", type: "textbook" },
      { id: "r2", title: "W3Schools Python", type: "link", url: "https://w3schools.com/python" },
    ],
  },
  {
    id: "pe", name: "Physical Education", code: "PE", icon: Dumbbell, color: "text-red-500",
    units: [
      { id: "u1", name: "Health & Fitness", chapters: ["Nutrition", "Yoga", "First Aid"], status: "in-progress" },
    ],
    resources: [
      { id: "r1", title: "NCERT Physical Education", type: "textbook" },
    ],
  },
  {
    id: "art", name: "Art & Craft", code: "ART", icon: Palette, color: "text-pink-500",
    units: [
      { id: "u1", name: "Visual Arts", chapters: ["Sketching", "Watercolour", "Clay Modelling"], status: "not-started" },
    ],
    resources: [],
  },
  {
    id: "bio", name: "Biology", code: "BIO", icon: Microscope, color: "text-teal-500",
    units: [
      { id: "u1", name: "Cell Biology", chapters: ["Cell Structure", "Cell Division", "Transport in Cells"], status: "completed" },
      { id: "u2", name: "Genetics", chapters: ["DNA & RNA", "Mendelian Genetics", "Genetic Disorders"], status: "in-progress" },
    ],
    resources: [
      { id: "r1", title: "NCERT Biology XII", type: "textbook" },
    ],
  },
  {
    id: "hist", name: "History", code: "HIST", icon: History, color: "text-yellow-600",
    units: [
      { id: "u1", name: "Ancient India", chapters: ["Indus Valley", "Vedic Period", "Mauryan Empire"], status: "completed" },
      { id: "u2", name: "Modern India", chapters: ["British Rule", "Freedom Movement", "Post Independence"], status: "in-progress" },
    ],
    resources: [
      { id: "r1", title: "Themes in Indian History (NCERT)", type: "textbook" },
    ],
  },
]

const ACTIVITIES: Activity[] = [
  { id: "yoga", name: "Yoga", icon: Dumbbell, coach: "Mrs. Sunita Devi", equipment: ["Yoga Mats", "Blocks", "Straps"], schedule: "Mon, Wed, Fri — 7:00 AM" },
  { id: "robotics", name: "Robotics", icon: Cpu, coach: "Mr. Rajesh Kumar", equipment: ["Arduino Kits", "Sensors", "Laptops"], schedule: "Tue, Thu — 3:30 PM" },
  { id: "cricket", name: "Cricket", icon: Dumbbell, coach: "Mr. Vikas Singh", equipment: ["Bats", "Balls", "Pads", "Stumps"], schedule: "Mon–Fri — 4:00 PM" },
  { id: "music", name: "Music", icon: Music, coach: "Mrs. Anita Sharma", equipment: ["Harmonium", "Tabla", "Tanpura"], schedule: "Wed, Fri — 2:00 PM" },
  { id: "dance", name: "Dance", icon: Music, coach: "Ms. Priya Gupta", equipment: ["Sound System", "Ghungroo", "Costume Wardrobe"], schedule: "Tue, Thu — 2:30 PM" },
  { id: "coding", name: "Coding Club", icon: Cpu, coach: "Mr. Amit Verma", equipment: ["Laptops", "Projector", "Internet Access"], schedule: "Sat — 10:00 AM" },
]

/* ── Status badge helper ──────────────────────────── */

function StatusBadge({ status }: { status: Unit["status"] }) {
  const map = {
    "not-started": { label: "Not Started", cls: "bg-muted/80 text-muted-foreground" },
    "in-progress": { label: "In Progress", cls: "bg-primary/15 text-primary" },
    completed: { label: "Completed", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  }
  const s = map[status]
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", s.cls)}>{s.label}</span>
}

/* ── Glass Card ───────────────────────────────────── */

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-xl shadow-sm", className)}>
      {children}
    </div>
  )
}

/* ═════════════════════════════════════════════════════
   MAIN PAGE
   ═════════════════════════════════════════════════════ */

export default function AcademicAssetsPage() {
  const [search, setSearch] = useState("")

  // Subject sheet
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [subjectSheetOpen, setSubjectSheetOpen] = useState(false)

  // Activity sheet
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [activitySheetOpen, setActivitySheetOpen] = useState(false)

  // Dialogs
  const [addSubjectOpen, setAddSubjectOpen] = useState(false)
  const [addActivityOpen, setAddActivityOpen] = useState(false)

  // New subject/activity form
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectCode, setNewSubjectCode] = useState("")
  const [newActivityName, setNewActivityName] = useState("")
  const [newActivityCoach, setNewActivityCoach] = useState("")

  const q = search.toLowerCase()
  const filteredSubjects = useMemo(() => SUBJECTS.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)), [q])
  const filteredActivities = useMemo(() => ACTIVITIES.filter(a => a.name.toLowerCase().includes(q)), [q])

  function openSubject(s: Subject) {
    setSelectedSubject(s)
    setSubjectSheetOpen(true)
  }

  function openActivity(a: Activity) {
    setSelectedActivity(a)
    setActivitySheetOpen(true)
  }

  return (
    <DashboardShell>
      {/* ── Page Title Bar ─────────────────────────────── */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">Academic Assets Library</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Manage subjects, curriculum, and co-curricular programs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setAddSubjectOpen(true)}>
            <Plus className="size-4" /> Add Subject
          </Button>
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20" onClick={() => setAddActivityOpen(true)}>
            <Plus className="size-4" /> Add Activity
          </Button>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────── */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search subjects, activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 border-border/50 bg-card/60 pl-10 text-sm backdrop-blur-xl"
        />
      </div>

      {/* ── SECTION 1: Core Subjects ───────────────────── */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-2.5 pb-2">
          <Library className="size-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Core Academic Subjects</h2>
            <p className="text-xs text-muted-foreground">Click a subject to map curriculum and syllabus details</p>
          </div>
        </div>
        <Separator className="bg-border/30" />

        <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredSubjects.map(subject => {
            const Icon = subject.icon
            return (
              <button
                key={subject.id}
                onClick={() => openSubject(subject)}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-border/40 bg-background/30 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 active:scale-95"
              >
                <div className="flex size-11 items-center justify-center rounded-xl border border-border/40 bg-card/80 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                  <Icon className={cn("size-5", subject.color)} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{subject.name}</p>
                  <p className="text-[10px] text-muted-foreground">{subject.code}</p>
                </div>
              </button>
            )
          })}
          {filteredSubjects.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No subjects match your search.
            </p>
          )}
        </div>
      </GlassCard>

      {/* ── SECTION 2: Programs & Co-Curricular ────────── */}
      <GlassCard>
        <div className="flex items-center gap-2.5 pb-2">
          <GraduationCap className="size-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Programs & Co-Curricular Activities</h2>
            <p className="text-xs text-muted-foreground">Tap to configure coach, equipment, and schedule</p>
          </div>
        </div>
        <Separator className="bg-border/30" />

        <div className="flex flex-wrap gap-2.5 pt-3">
          {filteredActivities.map(activity => {
            const Icon = activity.icon
            return (
              <button
                key={activity.id}
                onClick={() => openActivity(activity)}
                className="group flex items-center gap-2 rounded-xl border border-border/40 bg-background/30 px-3.5 py-2.5 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 active:scale-95"
              >
                <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="text-sm font-medium text-foreground">{activity.name}</span>
              </button>
            )
          })}
          {filteredActivities.length === 0 && (
            <p className="w-full py-8 text-center text-sm text-muted-foreground">
              No activities match your search.
            </p>
          )}
        </div>
      </GlassCard>

      {/* ═══════════════════════════════════════════════════
         SUBJECT DEEP-DIVE SHEET
         ═══════════════════════════════════════════════════ */}
      <Sheet open={subjectSheetOpen} onOpenChange={setSubjectSheetOpen}>
        <SheetContent side="right" className="w-full border-border/50 bg-card/80 backdrop-blur-2xl sm:max-w-md">
          {selectedSubject && (() => {
            const Icon = selectedSubject.icon
            return (
              <>
                <SheetHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                      <Icon className={cn("size-5", selectedSubject.color)} />
                    </div>
                    <div>
                      <SheetTitle className="text-base">{selectedSubject.name} Configuration</SheetTitle>
                      <SheetDescription className="text-xs">Code: {selectedSubject.code}</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <Tabs defaultValue="curriculum" className="flex flex-1 flex-col overflow-hidden">
                  <TabsList className="mx-4 w-auto">
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  </TabsList>

                  {/* Curriculum Tab */}
                  <TabsContent value="curriculum" className="flex-1 overflow-y-auto px-4 pb-6">
                    <div className="space-y-3 pt-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit Builder</h3>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          <Plus className="size-3" /> Add Unit
                        </Button>
                      </div>
                      {selectedSubject.units.map((unit, idx) => (
                        <div key={unit.id} className="rounded-xl border border-border/40 bg-background/30 backdrop-blur-sm">
                          <div className="flex items-center justify-between px-3.5 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <GripVertical className="size-3.5 text-muted-foreground/60" />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Unit {idx + 1}: {unit.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{unit.chapters.length} chapters</p>
                              </div>
                            </div>
                            <StatusBadge status={unit.status} />
                          </div>
                          <div className="border-t border-border/30 px-3.5 pb-3 pt-2">
                            <div className="space-y-1">
                              {unit.chapters.map((ch, ci) => (
                                <div key={ci} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent/50">
                                  <Pen className="size-3" />
                                  <span className="flex-1 text-foreground">{ch}</span>
                                  <Trash2 className="size-3 cursor-pointer text-muted-foreground/60 hover:text-destructive" />
                                </div>
                              ))}
                            </div>
                            <Button variant="ghost" size="sm" className="mt-2 h-7 w-full gap-1 text-xs text-muted-foreground">
                              <Plus className="size-3" /> Add Chapter
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Resources Tab */}
                  <TabsContent value="resources" className="flex-1 overflow-y-auto px-4 pb-6">
                    <div className="space-y-3 pt-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Materials</h3>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          <Plus className="size-3" /> Add Resource
                        </Button>
                      </div>
                      {selectedSubject.resources.map(res => (
                        <div key={res.id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 px-3.5 py-3 backdrop-blur-sm">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-card/80">
                            {res.type === "textbook" ? (
                              <BookOpen className="size-3.5 text-muted-foreground" />
                            ) : (
                              <ExternalLink className="size-3.5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{res.title}</p>
                            <p className="text-[10px] uppercase text-muted-foreground">{res.type}</p>
                          </div>
                          <Trash2 className="size-3.5 shrink-0 cursor-pointer text-muted-foreground/60 hover:text-destructive" />
                        </div>
                      ))}
                      {selectedSubject.resources.length === 0 && (
                        <p className="py-8 text-center text-xs text-muted-foreground">No resources added yet.</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Assessment Tab */}
                  <TabsContent value="assessment" className="flex-1 overflow-y-auto px-4 pb-6">
                    <div className="space-y-4 pt-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assessment Configuration</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Max Marks (Theory)</label>
                          <Input defaultValue="80" className="border-border/50 bg-background/80 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Max Marks (Practical)</label>
                          <Input defaultValue="20" className="border-border/50 bg-background/80 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pass Percentage</label>
                          <Input defaultValue="33" className="border-border/50 bg-background/80 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Grading Scale</label>
                          <Input defaultValue="A1, A2, B1, B2, C1, C2, D, E" className="border-border/50 bg-background/80 text-sm" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* ═══════════════════════════════════════════════════
         ACTIVITY SHEET
         ═══════════════════════════════════════════════════ */}
      <Sheet open={activitySheetOpen} onOpenChange={setActivitySheetOpen}>
        <SheetContent side="right" className="w-full border-border/50 bg-card/80 backdrop-blur-2xl sm:max-w-sm">
          {selectedActivity && (() => {
            const Icon = selectedActivity.icon
            return (
              <>
                <SheetHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <SheetTitle className="text-base">{selectedActivity.name} Details</SheetTitle>
                      <SheetDescription className="text-xs">Activity configuration</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-6">
                  {/* Coach */}
                  <div className="rounded-xl border border-border/40 bg-background/30 p-4 backdrop-blur-sm">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coach / Instructor</label>
                    <Input defaultValue={selectedActivity.coach} className="mt-1.5 border-border/50 bg-background/80 text-sm" />
                  </div>

                  {/* Schedule */}
                  <div className="rounded-xl border border-border/40 bg-background/30 p-4 backdrop-blur-sm">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Schedule</label>
                    <Input defaultValue={selectedActivity.schedule} className="mt-1.5 border-border/50 bg-background/80 text-sm" />
                  </div>

                  {/* Equipment */}
                  <div className="rounded-xl border border-border/40 bg-background/30 p-4 backdrop-blur-sm">
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Equipment List</label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedActivity.equipment.map((eq, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 bg-muted/80 text-xs">
                          {eq}
                          <X className="size-3 cursor-pointer text-muted-foreground hover:text-destructive" />
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 h-7 gap-1 text-xs text-muted-foreground">
                      <Plus className="size-3" /> Add Equipment
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* ═══════════════════════════════════════════════════
         ADD SUBJECT DIALOG
         ═══════════════════════════════════════════════════ */}
      <Dialog open={addSubjectOpen} onOpenChange={setAddSubjectOpen}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>Create a new academic subject for the library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Subject Name</label>
              <Input value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="e.g. Economics" className="border-border/50 bg-background/80" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Subject Code</label>
              <Input value={newSubjectCode} onChange={(e) => setNewSubjectCode(e.target.value)} placeholder="e.g. ECON" className="border-border/50 bg-background/80" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddSubjectOpen(false)}>Cancel</Button>
            <Button className="shadow-md shadow-primary/20" onClick={() => setAddSubjectOpen(false)}>Create Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════
         ADD ACTIVITY DIALOG
         ═══════════════════════════════════════════════════ */}
      <Dialog open={addActivityOpen} onOpenChange={setAddActivityOpen}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>Create a new co-curricular activity.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Activity Name</label>
              <Input value={newActivityName} onChange={(e) => setNewActivityName(e.target.value)} placeholder="e.g. Photography" className="border-border/50 bg-background/80" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coach / Instructor</label>
              <Input value={newActivityCoach} onChange={(e) => setNewActivityCoach(e.target.value)} placeholder="e.g. Mr. Sharma" className="border-border/50 bg-background/80" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddActivityOpen(false)}>Cancel</Button>
            <Button className="shadow-md shadow-primary/20" onClick={() => setAddActivityOpen(false)}>Create Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
