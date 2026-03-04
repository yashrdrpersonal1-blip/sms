"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Pin, PinOff, ShieldCheck, Settings, FileText, Server, CalendarDays, Clock, ScrollText, UserSearch } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  useMenuStore,
  SUPER_MODULES,
  getSubModuleById,
} from "@/stores/menu-store"
import { cn } from "@/lib/utils"

/* Map sub-module IDs to their page routes */
const SUB_MODULE_ROUTES: Record<string, string> = {
  campaigns: "/dashboard/crm/campaigns",
  leads: "/dashboard/crm/leads",
  students: "/dashboard/students",
  "staff-directory": "/dashboard/hr/staff",
  "hiring-drive": "/dashboard/hr/hiring-drives",
  "applicant-pool": "/dashboard/hr/applicants",
  "my-requests": "/dashboard/workflow/requests",
  "approval-inbox": "/dashboard/workflow/approvals",
  "self-service": "/dashboard/workflow/self-service",
}

const SETUP_LINKS = [
  { id: "institution", name: "Institution Setup", icon: ShieldCheck, href: "/dashboard/setups/institution", description: "Core institution and document verification" },
  { id: "roles", name: "Roles & Permissions", icon: ShieldCheck, href: "/dashboard/setups/roles", description: "Manage system roles and access controls" },
  { id: "academic", name: "Academic Assets Library", icon: FileText, href: "/dashboard/setups/academic", description: "Subjects, curriculum, and co-curricular programs" },
  { id: "classes", name: "Class Master", icon: ShieldCheck, href: "/dashboard/setups/classes", description: "Grade structure, sections, and capacity rules" },
  { id: "infrastructure", name: "Infrastructure Mapping", icon: Server, href: "/dashboard/setups/infrastructure", description: "Rooms, building blocks, and campus blueprint" },
  { id: "admission", name: "Admission Setup", icon: FileText, href: "/dashboard/setups/admission", description: "Admission pipeline workflows and document rules" },
  { id: "hiring-workflow", name: "Hiring Workflow Setup", icon: UserSearch, href: "/dashboard/setups/hiring", description: "Hiring pipelines, interview stages, and onboarding routes" },
  { id: "hr-holiday", name: "Holiday & Calendar", icon: CalendarDays, href: "/dashboard/setups/hr-holiday", description: "Holidays, events, and teacher alignment" },
  { id: "hr-shift", name: "Shift & Employment", icon: Clock, href: "/dashboard/setups/hr-shift", description: "Employment types and shift definitions" },
  { id: "hr-leave", name: "Leave & Exception Rules", icon: ScrollText, href: "/dashboard/setups/hr-leave", description: "Leave policies, quotas, and exception handling" },
]

export function MegaMenu() {
  const router = useRouter()
  const {
    megaMenuOpen,
    setMegaMenuOpen,
    searchQuery,
    setSearchQuery,
    pinnedModuleIds,
    togglePin,
  } = useMenuStore()

  const [activeTab, setActiveTab] = useState("apps")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (megaMenuOpen) {
      setSearchQuery("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [megaMenuOpen, setSearchQuery])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && megaMenuOpen) setMegaMenuOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [megaMenuOpen, setMegaMenuOpen])

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return SUPER_MODULES
    const q = searchQuery.toLowerCase()
    return SUPER_MODULES.map((mod) => ({
      ...mod,
      subModules: mod.subModules.filter(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          mod.name.toLowerCase().includes(q)
      ),
    })).filter((mod) => mod.subModules.length > 0)
  }, [searchQuery])

  const filteredSetups = useMemo(() => {
    if (!searchQuery.trim()) return SETUP_LINKS
    const q = searchQuery.toLowerCase()
    return SETUP_LINKS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const pinnedSubs = pinnedModuleIds
    .map((id) => getSubModuleById(id))
    .filter(Boolean)

  return (
    <AnimatePresence>
      {megaMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setMegaMenuOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-2 flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-5xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-2xl backdrop-blur-2xl sm:mt-8"
          >
            {/* Search bar + tabs header */}
            <div className="shrink-0 border-b border-border/40 px-5 pt-3 pb-0">
              <div className="flex items-center gap-3 pb-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === "apps" ? "Search modules..." : "Search setups..."}
                  className="h-8 border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
                />
                <button
                  onClick={() => setMegaMenuOpen(false)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-9 w-full bg-transparent p-0">
                  <TabsTrigger
                    value="apps"
                    className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 text-muted-foreground"
                  >
                    Apps
                  </TabsTrigger>
                  <TabsTrigger
                    value="setups"
                    className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 text-muted-foreground"
                  >
                    Setups
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {activeTab === "apps" && (
                <>
                  {/* Pinned section */}
                  {pinnedSubs.length > 0 && !searchQuery.trim() && (
                    <>
                      <div className="mb-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Pinned
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {pinnedSubs.map((sub) => {
                            if (!sub) return null
                            const Icon = sub.icon
                            return (
                              <button
                                key={sub.id}
                                className="group flex items-center gap-2 rounded-lg border border-border/50 bg-background/30 px-3 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5"
                              >
                                <Icon className="size-4 text-primary" />
                                <span>{sub.name}</span>
                                <PinOff
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePin(sub.id)
                                  }}
                                  className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <Separator className="mb-6 bg-border/30" />
                    </>
                  )}

                  {/* All modules */}
                  <div className="flex flex-col gap-8">
                    {filteredModules.map((mod) => {
                      const ModIcon = mod.icon
                      return (
                        <div key={mod.id}>
                          <div className="mb-4 flex items-center gap-2">
                            <ModIcon className={cn("size-5", mod.color)} />
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                              {mod.name}
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {mod.subModules.map((sub) => {
                              const SubIcon = sub.icon
                              const isPinned = pinnedModuleIds.includes(sub.id)
                              const route = SUB_MODULE_ROUTES[sub.id]
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    if (route) {
                                      setMegaMenuOpen(false)
                                      router.push(route)
                                    }
                                  }}
                                  className={cn(
                                    "group relative flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-background/30 p-3 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 active:scale-95",
                                    !route && "opacity-50 cursor-not-allowed"
                                  )}
                                >
                                  <SubIcon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                                  <span className="text-xs font-medium text-foreground line-clamp-2">
                                    {sub.name}
                                  </span>
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      togglePin(sub.id)
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.stopPropagation()
                                        togglePin(sub.id)
                                      }
                                    }}
                                    className={cn(
                                      "absolute top-2 right-2 flex size-5 items-center justify-center rounded-full transition-all",
                                      isPinned
                                        ? "bg-primary/15 text-primary"
                                        : "bg-muted/40 text-muted-foreground/40 opacity-0 group-hover:opacity-100"
                                    )}
                                    aria-label={isPinned ? `Unpin ${sub.name}` : `Pin ${sub.name}`}
                                  >
                                    <Pin
                                      className={cn(
                                        "size-3 transition-transform",
                                        isPinned && "fill-primary rotate-45"
                                      )}
                                    />
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {filteredModules.length === 0 && (
                    <div className="py-16 text-center text-sm text-muted-foreground">
                      No modules found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </>
              )}

              {activeTab === "setups" && (
                <>
                  {/* Setups grouped by category */}
                  <div className="flex flex-col gap-8">
                    {/* All setups in sections */}
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <Settings className="size-5 text-primary" />
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                          Configuration
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {filteredSetups.map((setup) => {
                          const Icon = setup.icon
                          return (
                            <button
                              key={setup.id}
                              onClick={() => {
                                setMegaMenuOpen(false)
                                router.push(setup.href)
                              }}
                              className="group relative flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-background/30 p-3 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 active:scale-95"
                            >
                              <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                              <span className="text-xs font-medium text-foreground line-clamp-2">
                                {setup.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground line-clamp-1 opacity-60">
                                {setup.description}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {filteredSetups.length === 0 && (
                    <div className="py-16 text-center text-sm text-muted-foreground">
                      No setups found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </>
              )}

              <div className="h-6" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
