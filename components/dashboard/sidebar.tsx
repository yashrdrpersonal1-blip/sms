"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutGrid, Settings, LogOut, User, Globe, ChevronRight, Check, ShieldCheck } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useMenuStore, getSubModuleById } from "@/stores/menu-store"
import { cn } from "@/lib/utils"

const ROLES = [
  { id: "super_admin", label: "Super Admin" },
  { id: "admin",       label: "Admin" },
  { id: "teacher",     label: "Teacher" },
  { id: "hr",          label: "HR Manager" },
  { id: "accountant",  label: "Accountant" },
]

const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
  { id: "hi", label: "Hindi" },
  { id: "fr", label: "French" },
]

const USER_NAME = "Alex Johnson"

const SUB_MODULE_ROUTES: Record<string, string> = {
  campaigns: "/dashboard/crm/campaigns",
  leads: "/dashboard/crm/leads",
  students: "/dashboard/students",
  "staff-directory": "/dashboard/hr/staff",
  "hiring-drive": "/dashboard/hr/hiring-drives",
  "applicant-pool": "/dashboard/hr/applicants",
  onboarding: "/dashboard/hr/onboarding",
  "my-requests": "/dashboard/workflow/requests",
  "approval-inbox": "/dashboard/workflow/approvals",
  "self-service": "/dashboard/workflow/self-service",
}

export function DashboardSidebar() {
  const { pinnedModuleIds, setMegaMenuOpen } = useMenuStore()
  const router = useRouter()

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [activeRole, setActiveRole] = useState(ROLES[0])
  const [activeLang, setActiveLang] = useState(LANGUAGES[0])
  const [roleOpen, setRoleOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-dvh w-16 flex-col items-center border-r border-border/50 bg-card/50 py-3 backdrop-blur-xl">

      {/* Menu trigger */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setMegaMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Open menu"
          >
            <LayoutGrid className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Menu</TooltipContent>
      </Tooltip>

      <Separator className="my-3 w-8" />

      {/* Pinned modules */}
      <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
        {pinnedModuleIds.map((id) => {
          const sub = getSubModuleById(id)
          if (!sub) return null
          const Icon = sub.icon
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <button
                  className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={sub.name}
                  onClick={() => {
                    const route = SUB_MODULE_ROUTES[id]
                    if (route) router.push(route)
                  }}
                >
                  <Icon className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{sub.name}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      <Separator className="my-3 w-8" />

      {/* Settings — opens Popover */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-foreground",
              popoverOpen ? "bg-accent text-foreground" : "text-muted-foreground"
            )}
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="end"
          sideOffset={8}
          className="w-56 border-border/50 bg-card/80 p-3 backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-2">

            {/* User name at top */}
            <div className="px-1 pb-1">
              <p className="text-xs font-semibold text-muted-foreground">YOUR ACCOUNT</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{USER_NAME}</p>
            </div>

            <Separator className="my-1" />

            {/* Active Role selector — inline like Language */}
            <div className="relative">
              <button
                onClick={() => setRoleOpen(v => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-primary" />
                  <span className="text-foreground">
                    <span className="text-muted-foreground text-xs">Role: </span>
                    {activeRole.label}
                  </span>
                </div>
                <ChevronRight className={cn("size-3.5 text-muted-foreground transition-transform", roleOpen && "rotate-90")} />
              </button>

              {roleOpen && (
                <div className="mt-0.5 rounded-lg border border-border/40 bg-background/80 p-1 backdrop-blur-md">
                  {ROLES.map(role => (
                    <button
                      key={role.id}
                      onClick={() => { setActiveRole(role); setRoleOpen(false) }}
                      className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                    >
                      <span className="text-foreground">{role.label}</span>
                      {activeRole.id === role.id && <Check className="size-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(v => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="size-4 text-muted-foreground" />
                  <span className="text-foreground">
                    <span className="text-muted-foreground text-xs">Language: </span>
                    {activeLang.label}
                  </span>
                </div>
                <ChevronRight className={cn("size-3.5 text-muted-foreground transition-transform", langOpen && "rotate-90")} />
              </button>

              {langOpen && (
                <div className="mt-0.5 rounded-lg border border-border/40 bg-background/80 p-1 backdrop-blur-md">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => { setActiveLang(lang); setLangOpen(false) }}
                      className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                    >
                      <span className="text-foreground">{lang.label}</span>
                      {activeLang.id === lang.id && <Check className="size-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <button className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent">
              <User className="size-4 text-muted-foreground" />
              <span className="text-foreground">Profile Details</span>
            </button>

            <Separator className="my-1" />

            {/* Logout */}
            <button className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10">
              <LogOut className="size-4" />
              <span>Log Out</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </aside>
  )
}
