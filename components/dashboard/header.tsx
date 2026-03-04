"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell, ChevronDown, ChevronRight, School, Sun, Moon,
  Check, LayoutGrid, Menu, Settings, ShieldCheck, Globe,
  User, LogOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useMenuStore } from "@/stores/menu-store"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  breadcrumbs?: { label: string; href?: string }[]
}

const BRANCHES = [
  { id: "all", name: "Overall", isOverall: true },
  { id: "b1",  name: "Riverside Academy" },
  { id: "b2",  name: "Greenfield International School" },
  { id: "b3",  name: "Sundale Higher Secondary" },
  { id: "b4",  name: "Mountview College" },
  { id: "b5",  name: "Harmony Public School" },
  { id: "b6",  name: "Excellence Institute" },
]

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

export function DashboardHeader({ breadcrumbs = [{ label: "Dashboard" }] }: DashboardHeaderProps) {
  const router = useRouter()
  const { theme, setTheme }             = useTheme()
  const { setMegaMenuOpen }             = useMenuStore()
  const [mounted, setMounted]           = useState(false)
  const [branchOpen, setBranchOpen]     = useState(false)
  const [activeBranch, setActiveBranch] = useState(BRANCHES[1])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeRole, setActiveRole]     = useState(ROLES[0])
  const [activeLang, setActiveLang]     = useState(LANGUAGES[0])
  const [roleOpen, setRoleOpen]         = useState(false)
  const [langOpen, setLangOpen]         = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-card/50 px-4 backdrop-blur-xl md:left-16 md:px-5">

        {/* Left: hamburger (mobile) + breadcrumbs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMegaMenuOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm sm:flex">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                ) : (
                  <span className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          <span className="text-sm font-medium text-foreground sm:hidden">
            {breadcrumbs[breadcrumbs.length - 1]?.label}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </button>
          )}

          {/* Notifications */}
          <button
            className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-[18px]" />
            <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center p-0 text-[10px]">3</Badge>
          </button>

          {/* Settings — mobile only, desktop uses sidebar */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Settings"
          >
            <Settings className="size-[18px]" />
          </button>

          <div className="mx-0.5 h-5 w-px bg-border/60" />

          {/* School switcher */}
          <button
            onClick={() => setBranchOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/60 px-2 py-1.5 text-sm backdrop-blur-md transition-colors hover:bg-accent md:px-3"
          >
            <School className="size-4 shrink-0 text-primary" />
            <span className="max-w-[70px] truncate font-medium text-foreground md:max-w-[130px]">
              {activeBranch.name}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Mobile Settings — full bottom sheet with glass card rows */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[88dvh] rounded-t-2xl border-t border-border/40 bg-card/80 px-0 pb-0 backdrop-blur-2xl"
        >
          {/* Drag handle */}
          <div className="mx-auto mb-1 mt-3 h-1 w-10 rounded-full bg-border/50" />

          {/* User identity card */}
          <div className="px-4 pb-3 pt-2">
            <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/30 px-4 py-4 backdrop-blur-sm">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-base font-bold text-primary">
                AJ
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-foreground">{USER_NAME}</p>
                <p className="text-xs text-muted-foreground">{activeRole.label}</p>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto px-4 pb-10">
            <div className="space-y-2">

              {/* Role selector — glass card with inline expand */}
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-background/30 backdrop-blur-sm">
                <button
                  onClick={() => { setRoleOpen(v => !v); setLangOpen(false) }}
                  className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent/50"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                    <ShieldCheck className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Active Role</p>
                    <p className="truncate text-sm font-medium text-foreground">{activeRole.label}</p>
                  </div>
                  <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", roleOpen && "rotate-180")} />
                </button>
                {roleOpen && (
                  <div className="border-t border-border/30 bg-background/20 px-3 pb-3 pt-2">
                    <div className="space-y-1">
                      {ROLES.map(role => (
                        <button
                          key={role.id}
                          onClick={() => { setActiveRole(role); setRoleOpen(false) }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                            activeRole.id === role.id
                              ? "bg-primary/15 text-primary"
                              : "text-foreground hover:bg-accent/60"
                          )}
                        >
                          <span className={cn("size-2 shrink-0 rounded-full", activeRole.id === role.id ? "bg-primary" : "bg-border")} />
                          <span className="flex-1 text-left font-medium">{role.label}</span>
                          {activeRole.id === role.id && <Check className="size-4 shrink-0 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Language selector — glass card with inline expand */}
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-background/30 backdrop-blur-sm">
                <button
                  onClick={() => { setLangOpen(v => !v); setRoleOpen(false) }}
                  className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent/50"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-background/50">
                    <Globe className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Language</p>
                    <p className="truncate text-sm font-medium text-foreground">{activeLang.label}</p>
                  </div>
                  <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", langOpen && "rotate-180")} />
                </button>
                {langOpen && (
                  <div className="border-t border-border/30 bg-background/20 px-3 pb-3 pt-2">
                    <div className="space-y-1">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => { setActiveLang(lang); setLangOpen(false) }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                            activeLang.id === lang.id
                              ? "bg-primary/15 text-primary"
                              : "text-foreground hover:bg-accent/60"
                          )}
                        >
                          <span className={cn("size-2 shrink-0 rounded-full", activeLang.id === lang.id ? "bg-primary" : "bg-border")} />
                          <span className="flex-1 text-left font-medium">{lang.label}</span>
                          {activeLang.id === lang.id && <Check className="size-4 shrink-0 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <button className="flex w-full items-center gap-3 rounded-2xl border border-border/40 bg-background/30 px-4 py-3.5 backdrop-blur-sm transition-colors hover:bg-accent/50">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-background/50">
                  <User className="size-4 text-primary" />
                </div>
                <span className="flex-1 text-left text-sm font-medium text-foreground">Profile Details</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>

              <Separator className="bg-border/30" />

              {/* Logout */}
              <button 
                onClick={() => {
                  setSettingsOpen(false)
                  router.push("/login")
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3.5 backdrop-blur-sm transition-colors hover:bg-destructive/10">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10">
                  <LogOut className="size-4 text-destructive" />
                </div>
                <span className="text-sm font-medium text-destructive">Log Out</span>
              </button>

            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Branch Sheet */}
      <Sheet open={branchOpen} onOpenChange={setBranchOpen}>
        <SheetContent side="right" className="w-full border-border/50 bg-card/80 backdrop-blur-2xl sm:max-w-xs">
          <SheetHeader className="pb-3">
            <SheetTitle className="flex items-center gap-2 text-base">
              <School className="size-4 text-primary" />
              Select School
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-2 overflow-y-auto px-4 pb-6">
            {BRANCHES.filter(b => b.isOverall).map(branch => (
              <button
                key={branch.id}
                onClick={() => { setActiveBranch(branch); setBranchOpen(false) }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                  activeBranch.id === branch.id
                    ? "border-primary/60 bg-primary/15"
                    : "border-border/40 bg-background/30 hover:border-primary/40 hover:bg-primary/10"
                )}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 backdrop-blur-sm">
                  <LayoutGrid className="size-5 text-primary" />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">{branch.name}</span>
                {activeBranch.id === branch.id && <Check className="size-4 shrink-0 text-primary" />}
              </button>
            ))}

            <Separator className="my-3 bg-border/30" />

            <div className="space-y-2">
              {BRANCHES.filter(b => !b.isOverall).map(branch => (
                <button
                  key={branch.id}
                  onClick={() => { setActiveBranch(branch); setBranchOpen(false) }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                    activeBranch.id === branch.id
                      ? "border-primary/60 bg-primary/15"
                      : "border-border/40 bg-background/30 hover:border-primary/40 hover:bg-primary/10"
                  )}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 backdrop-blur-sm">
                    <School className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{branch.name}</span>
                  </div>
                  {activeBranch.id === branch.id && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
