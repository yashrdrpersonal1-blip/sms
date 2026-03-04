"use client"

import { useState, useMemo } from "react"
import {
  ShieldCheck, Plus, Search, Check, RotateCcw, Save,
  Crown, GraduationCap, Users, CreditCard, Server,
  UserCheck, FileText, Heart, Bus, Package,
  BookOpen, Brain, Shield, Award, ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────
interface Role {
  id: string
  name: string
  description: string
  icon: LucideIcon
  group: "default" | "custom"
  isSystem: boolean
}

interface PermissionModule {
  id: string
  name: string
  icon: LucideIcon
  color: string
  permissions: string[]
}

// ── Data ──────────────────────────────────────────
const DEFAULT_ROLES: Role[] = [
  { id: "super_admin", name: "Super Admin", description: "Full system access", icon: Crown, group: "default", isSystem: true },
  { id: "principal", name: "Principal", description: "School-level oversight", icon: ShieldCheck, group: "default", isSystem: true },
  { id: "teacher", name: "Teacher", description: "Class and student management", icon: GraduationCap, group: "default", isSystem: true },
]

const CUSTOM_ROLES: Role[] = [
  { id: "fee_collector", name: "Fee Collector", description: "Fee collection and receipts", icon: CreditCard, group: "custom", isSystem: false },
  { id: "it_support", name: "IT Support", description: "Infrastructure maintenance", icon: Server, group: "custom", isSystem: false },
]

const PERMISSION_MODULES: PermissionModule[] = [
  { id: "student", name: "Student Lifecycle", icon: GraduationCap, color: "text-blue-500",
    permissions: ["View Students","Add Student","Edit Student","Delete Student","View Admissions","Process Admissions","Manage Enrollment","View Attendance","Mark Attendance","Override Attendance","View Grades","Edit Grades"] },
  { id: "parent", name: "Parent Engagement", icon: Heart, color: "text-pink-500",
    permissions: ["View Portal","Send Messages","Schedule Meetings","View Feedback","Respond Feedback","Manage Announcements"] },
  { id: "hr", name: "HR & Staff", icon: Users, color: "text-violet-500",
    permissions: ["View Staff","Add Staff","Edit Staff","Delete Staff","View Payroll","Process Payroll","Approve Payroll","View Leave","Approve Leave","Manage Recruitment"] },
  { id: "finance", name: "Fees & Finance", icon: CreditCard, color: "text-amber-500",
    permissions: ["View Fee Structure","Edit Fee Structure","Collect Fees","View Receipts","Issue Refunds","Manage Scholarships","View Expenses","Approve Expenses"] },
  { id: "transport", name: "Transport", icon: Bus, color: "text-orange-500",
    permissions: ["View Routes","Manage Routes","Track Vehicles","Manage Drivers"] },
  { id: "inventory", name: "Inventory", icon: Package, color: "text-teal-500",
    permissions: ["View Assets","Manage Assets","View Stock","Update Stock","Create Purchase Orders","Approve Procurement"] },
  { id: "library", name: "Library", icon: BookOpen, color: "text-indigo-500",
    permissions: ["View Catalog","Manage Catalog","Issue Books","Return Books","Manage Digital Library"] },
  { id: "ai", name: "AI Hub", icon: Brain, color: "text-violet-500",
    permissions: ["View Analytics","Configure AI Models","View Predictions","Generate Reports"] },
  { id: "governance", name: "Governance", icon: Shield, color: "text-red-500",
    permissions: ["View Compliance","Manage Policies","View Audit Logs","Export Audit Data"] },
  { id: "alumni", name: "Alumni", icon: Award, color: "text-cyan-500",
    permissions: ["View Alumni","Manage Alumni Directory","Manage Events","View Donations"] },
  { id: "it", name: "IT & Infrastructure", icon: Server, color: "text-slate-500",
    permissions: ["System Admin Access","Manage Access Control","View Integrations","Manage Integrations"] },
]

// ── Role List (shared between sidebar and mobile sheet) ───
function RoleList({
  roles,
  activeRole,
  onSelect,
  onCreateNew,
}: {
  roles: Role[]
  activeRole: Role
  onSelect: (role: Role) => void
  onCreateNew: () => void
}) {
  const defaultRoles = roles.filter(r => r.group === "default")
  const customRoles  = roles.filter(r => r.group === "custom")

  const RoleBtn = ({ role }: { role: Role }) => {
    const Icon = role.icon
    const isActive = activeRole.id === role.id
    return (
      <button
        onClick={() => onSelect(role)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
          isActive
            ? "border-primary/60 bg-primary/10 shadow-sm shadow-primary/10"
            : "border-border/40 bg-background/30 hover:border-border/60 hover:bg-background/50"
        )}
      >
        <div className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg border backdrop-blur-sm",
          isActive ? "border-primary/40 bg-primary/15" : "border-border/40 bg-background/40"
        )}>
          <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="flex flex-1 flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{role.name}</span>
          <span className="text-[11px] text-muted-foreground truncate">{role.description}</span>
        </div>
        {role.isSystem && (
          <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0 h-5 bg-muted/60 text-muted-foreground">
            System
          </Badge>
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Roles</h2>
        <Button
          size="sm"
          onClick={onCreateNew}
          className="h-8 gap-1.5 rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
        >
          <Plus className="size-3.5" />
          <span className="text-xs">New</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Default</p>
        <div className="space-y-1.5">
          {defaultRoles.map(r => <RoleBtn key={r.id} role={r} />)}
        </div>
        <Separator className="my-4 bg-border/30" />
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Custom</p>
        <div className="space-y-1.5">
          {customRoles.map(r => <RoleBtn key={r.id} role={r} />)}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────
export default function RolesPage() {
  const [roles, setRoles]         = useState<Role[]>([...DEFAULT_ROLES, ...CUSTOM_ROLES])
  const [activeRole, setActiveRole] = useState<Role>(DEFAULT_ROLES[1])
  const [search, setSearch]       = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [mobileRolesOpen, setMobileRolesOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDesc, setNewRoleDesc] = useState("")
  const [cloneFrom, setCloneFrom] = useState("")

  const [permMap, setPermMap] = useState<Record<string, Set<string>>>(() => {
    const allPerms = PERMISSION_MODULES.flatMap(m => m.permissions)
    return {
      super_admin:   new Set(allPerms),
      principal:     new Set(allPerms.filter((_, i) => i % 5 !== 4)),
      teacher:       new Set(PERMISSION_MODULES.filter(m => ["student","parent","library"].includes(m.id)).flatMap(m => m.permissions).filter((_, i) => i % 3 !== 2)),
      fee_collector: new Set(PERMISSION_MODULES.filter(m => m.id === "finance").flatMap(m => m.permissions)),
      it_support:    new Set(PERMISSION_MODULES.filter(m => m.id === "it").flatMap(m => m.permissions)),
    }
  })

  const activePerms = permMap[activeRole.id] ?? new Set<string>()

  const togglePerm = (perm: string) => {
    setPermMap(prev => {
      const current = new Set(prev[activeRole.id] ?? [])
      current.has(perm) ? current.delete(perm) : current.add(perm)
      return { ...prev, [activeRole.id]: current }
    })
  }

  const filteredModules = useMemo(() => {
    if (!search.trim()) return PERMISSION_MODULES
    const q = search.toLowerCase()
    return PERMISSION_MODULES
      .map(mod => ({ ...mod, permissions: mod.permissions.filter(p => p.toLowerCase().includes(q) || mod.name.toLowerCase().includes(q)) }))
      .filter(mod => mod.permissions.length > 0)
  }, [search])

  const totalPerms    = PERMISSION_MODULES.reduce((n, m) => n + m.permissions.length, 0)
  const selectedCount = activePerms.size

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return
    const newRole: Role = {
      id: newRoleName.toLowerCase().replace(/\s+/g, "_"),
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || "Custom role",
      icon: UserCheck,
      group: "custom",
      isSystem: false,
    }
    setRoles(prev => [...prev, newRole])
    setPermMap(prev => ({
      ...prev,
      [newRole.id]: cloneFrom && prev[cloneFrom] ? new Set(prev[cloneFrom]) : new Set(),
    }))
    setActiveRole(newRole)
    setNewRoleName("")
    setNewRoleDesc("")
    setCloneFrom("")
    setCreateOpen(false)
  }

  const handleSelectRole = (role: Role) => {
    setActiveRole(role)
    setMobileRolesOpen(false)
  }

  return (
    <DashboardShell>
      {/* Page container */}
      <div className="flex h-[calc(100dvh-5rem)] gap-4">

        {/* ── Desktop sidebar (hidden on mobile) ── */}
        <div className="hidden w-72 shrink-0 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl md:flex md:flex-col">
          <RoleList
            roles={roles}
            activeRole={activeRole}
            onSelect={setActiveRole}
            onCreateNew={() => setCreateOpen(true)}
          />
        </div>

        {/* ── Right: Permissions panel ── */}
        <div className="flex flex-1 flex-col rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl overflow-hidden">

          {/* Panel header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/30 px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center gap-3">
              {/* Mobile: tap to open role list sheet */}
              <button
                onClick={() => setMobileRolesOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/30 px-3 py-1.5 text-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 md:hidden"
              >
                <activeRole.icon className="size-4 text-primary" />
                <span className="font-medium text-foreground">{activeRole.name}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>

              {/* Desktop: just show title */}
              <div className="hidden md:block">
                <h3 className="text-base font-bold text-foreground">
                  Editing: <span className="text-primary">{activeRole.name}</span>
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selectedCount} of {totalPerms} permissions selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPermMap(prev => ({ ...prev, [activeRole.id]: new Set() }))}
                className="h-8 gap-1.5 border-border/50 bg-background/30 backdrop-blur-sm"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1.5 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
              >
                <Save className="size-3.5" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>

          {/* Mobile: selected count */}
          <div className="border-b border-border/30 px-4 py-2 text-xs text-muted-foreground md:hidden">
            {selectedCount} of {totalPerms} permissions selected
          </div>

          {/* Search */}
          <div className="border-b border-border/30 px-4 py-3 md:px-6">
            <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/30 px-3 backdrop-blur-sm">
              <Search className="size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter permissions..."
                className="h-9 border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Permissions grid — scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <div className="flex flex-col gap-6 md:gap-8">
              {filteredModules.map(mod => {
                const ModIcon = mod.icon
                return (
                  <div key={mod.id}>
                    <div className="mb-3 flex items-center gap-2">
                      <ModIcon className={cn("size-4", mod.color)} />
                      <h4 className="text-sm font-semibold text-foreground">{mod.name}</h4>
                      <span className="text-[11px] text-muted-foreground">
                        ({mod.permissions.filter(p => activePerms.has(p)).length}/{mod.permissions.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mod.permissions.map(perm => {
                        const isSelected = activePerms.has(perm)
                        return (
                          <button
                            key={perm}
                            onClick={() => togglePerm(perm)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                              isSelected
                                ? "border-primary/60 bg-primary/15 text-primary shadow-sm shadow-primary/10"
                                : "border-border/40 bg-background/30 text-muted-foreground backdrop-blur-sm hover:border-border/60 hover:text-foreground"
                            )}
                          >
                            {isSelected && <Check className="size-3" />}
                            {perm}
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
                No permissions match &ldquo;{search}&rdquo;
              </div>
            )}
            <div className="h-6" />
          </div>
        </div>
      </div>

      {/* ── Mobile: Role list Sheet ── */}
      <Sheet open={mobileRolesOpen} onOpenChange={setMobileRolesOpen}>
        <SheetContent side="bottom" className="h-[75dvh] rounded-t-2xl border-border/50 bg-card/90 px-0 backdrop-blur-2xl">
          <SheetHeader className="px-5 pb-2">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4 text-primary" />
              Select Role
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <RoleList
              roles={roles}
              activeRole={activeRole}
              onSelect={handleSelectRole}
              onCreateNew={() => { setMobileRolesOpen(false); setCreateOpen(true) }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Create Role Dialog ── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-border/50 bg-card/80 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Create New Role
            </DialogTitle>
            <DialogDescription>
              Define a new custom role and optionally clone permissions from an existing one.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role-name" className="text-sm font-medium text-foreground">Role Name</Label>
              <Input
                id="role-name"
                value={newRoleName}
                onChange={e => setNewRoleName(e.target.value)}
                placeholder="e.g. Lab Assistant"
                className="border-border/50 bg-background/40 backdrop-blur-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role-desc" className="text-sm font-medium text-foreground">Description</Label>
              <Textarea
                id="role-desc"
                value={newRoleDesc}
                onChange={e => setNewRoleDesc(e.target.value)}
                placeholder="Brief description of this role's purpose"
                className="min-h-20 resize-none border-border/50 bg-background/40 backdrop-blur-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">Clone Permissions From</Label>
              <Select value={cloneFrom} onValueChange={setCloneFrom}>
                <SelectTrigger className="border-border/50 bg-background/40 backdrop-blur-sm">
                  <SelectValue placeholder="Start fresh (no clone)" />
                </SelectTrigger>
                <SelectContent className="border-border/50 bg-card/90 backdrop-blur-xl">
                  {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="border-border/50 bg-background/30">
              Cancel
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim()}
              className="gap-1.5 bg-primary text-primary-foreground shadow-md shadow-primary/20"
            >
              <Plus className="size-3.5" />
              Create & Configure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
