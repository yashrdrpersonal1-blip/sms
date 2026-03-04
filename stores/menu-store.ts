import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LucideIcon } from "lucide-react"
import {
  Megaphone,
  Target,
  TrendingUp,
  GraduationCap,
  Users,
  Briefcase,
  Contact,
  GitPullRequest,
  Inbox,
  LayoutDashboard,
  UserSearch,
  FolderOpen,
} from "lucide-react"

// ── Types ──────────────────────────────────────────
export interface SubModule {
  id: string
  name: string
  icon: LucideIcon
}

export interface SuperModule {
  id: string
  name: string
  icon: LucideIcon
  color: string
  subModules: SubModule[]
}

// ── Data ───────────────────────────────────────────
export const SUPER_MODULES: SuperModule[] = [
  {
    id: "crm",
    name: "CRM & Outreach",
    icon: Target,
    color: "text-sky-500",
    subModules: [
      { id: "campaigns", name: "Campaigns", icon: Megaphone },
      { id: "leads", name: "Leads", icon: TrendingUp },
    ],
  },
  {
    id: "student-lifecycle",
    name: "Student Lifecycle",
    icon: GraduationCap,
    color: "text-emerald-500",
    subModules: [
      { id: "students", name: "Student Directory", icon: Users },
    ],
  },
  {
    id: "hr-staff",
    name: "HR & Staff",
    icon: Briefcase,
    color: "text-amber-500",
    subModules: [
      { id: "staff-directory", name: "Staff Directory", icon: Contact },
      { id: "hiring-drive", name: "Hiring Drives", icon: UserSearch },
      { id: "applicant-pool", name: "Applicant Pool", icon: FolderOpen },
    ],
  },
  {
    id: "global-workflow",
    name: "Global Workflow",
    icon: GitPullRequest,
    color: "text-violet-500",
    subModules: [
      { id: "my-requests", name: "My Requests", icon: GitPullRequest },
      { id: "approval-inbox", name: "Approval Inbox", icon: Inbox },
      { id: "self-service", name: "Employee Self-Service", icon: LayoutDashboard },
    ],
  },
]

// ── Store ──────────────────────────────────────────
interface MenuState {
  pinnedModuleIds: string[]
  megaMenuOpen: boolean
  searchQuery: string
  togglePin: (moduleId: string) => void
  setMegaMenuOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      pinnedModuleIds: ["campaigns", "leads", "students", "staff-directory", "hiring-drive", "applicant-pool", "my-requests"],
      megaMenuOpen: false,
      searchQuery: "",
      togglePin: (moduleId: string) => {
        const current = get().pinnedModuleIds
        if (current.includes(moduleId)) {
          set({ pinnedModuleIds: current.filter((id) => id !== moduleId) })
        } else {
          set({ pinnedModuleIds: [...current, moduleId] })
        }
      },
      setMegaMenuOpen: (open: boolean) => set({ megaMenuOpen: open }),
      setSearchQuery: (query: string) => set({ searchQuery: query }),
    }),
    {
      name: "grovehub-menu-storage",
      partialize: (state) => ({ pinnedModuleIds: state.pinnedModuleIds }),
    }
  )
)

// ── Helpers ────────────────────────────────────────
export function getSubModuleById(id: string): SubModule | undefined {
  for (const mod of SUPER_MODULES) {
    const found = mod.subModules.find((sub) => sub.id === id)
    if (found) return found
  }
  return undefined
}

export function getSuperModuleForSub(subId: string): SuperModule | undefined {
  return SUPER_MODULES.find((mod) => mod.subModules.some((sub) => sub.id === subId))
}
