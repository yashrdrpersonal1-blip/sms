"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus, Search, Megaphone, Users, TrendingUp,
  MoreHorizontal, Eye, Pause, Play, BarChart3,
  Target, MapPin, Phone, Globe, Calendar,
  ChevronDown, ArrowUpDown, Filter, QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ── Types ──────────────────────────────────────────── */

interface StaffMember {
  id: string
  name: string
  avatar: string /* initials */
  role: string
}

interface Campaign {
  id: string
  name: string
  type: "field-drive" | "digital" | "referral" | "event" | "door-to-door"
  status: "active" | "paused" | "completed" | "draft"
  manager: StaffMember
  totalLeads: number
  topStaff: StaffMember
  budgetSpent: number
  budgetAllocated: number
  startDate: string
  endDate: string
  villages: string[]
  conversionRate: number
}

/* ── Seed Data ──────────────────────────────────────── */

const STAFF: StaffMember[] = [
  { id: "s1", name: "Ravi Sharma", avatar: "RS", role: "Field Coordinator" },
  { id: "s2", name: "Priya Yadav", avatar: "PY", role: "Sr. Teacher" },
  { id: "s3", name: "Manoj Kumar", avatar: "MK", role: "Clerk" },
  { id: "s4", name: "Sunita Devi", avatar: "SD", role: "Teacher" },
  { id: "s5", name: "Arvind Yadav", avatar: "AY", role: "Principal" },
  { id: "s6", name: "Kiran Bala", avatar: "KB", role: "Teacher" },
]

const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    name: "Rewari District Drive 2026",
    type: "field-drive",
    status: "active",
    manager: STAFF[0],
    totalLeads: 187,
    topStaff: STAFF[1],
    budgetSpent: 42000,
    budgetAllocated: 75000,
    startDate: "2026-01-15",
    endDate: "2026-03-31",
    villages: ["Berli Khurd", "Dhokia", "Haluhera", "Biharipur", "Musepur"],
    conversionRate: 34,
  },
  {
    id: "camp-2",
    name: "Digital Awareness - Social Media",
    type: "digital",
    status: "active",
    manager: STAFF[2],
    totalLeads: 93,
    topStaff: STAFF[3],
    budgetSpent: 18500,
    budgetAllocated: 30000,
    startDate: "2026-02-01",
    endDate: "2026-04-15",
    villages: [],
    conversionRate: 22,
  },
  {
    id: "camp-3",
    name: "Parent Referral Program",
    type: "referral",
    status: "active",
    manager: STAFF[4],
    totalLeads: 64,
    topStaff: STAFF[0],
    budgetSpent: 8000,
    budgetAllocated: 15000,
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    villages: [],
    conversionRate: 48,
  },
  {
    id: "camp-4",
    name: "Annual Open House Event",
    type: "event",
    status: "completed",
    manager: STAFF[1],
    totalLeads: 122,
    topStaff: STAFF[5],
    budgetSpent: 55000,
    budgetAllocated: 55000,
    startDate: "2025-12-10",
    endDate: "2025-12-15",
    villages: [],
    conversionRate: 41,
  },
  {
    id: "camp-5",
    name: "Jatusana Block Door-to-Door",
    type: "door-to-door",
    status: "paused",
    manager: STAFF[3],
    totalLeads: 38,
    topStaff: STAFF[0],
    budgetSpent: 12000,
    budgetAllocated: 25000,
    startDate: "2026-02-10",
    endDate: "2026-03-20",
    villages: ["Jatusana", "Khol", "Dahina"],
    conversionRate: 18,
  },
  {
    id: "camp-6",
    name: "Summer Intake - Early Bird",
    type: "field-drive",
    status: "draft",
    manager: STAFF[4],
    totalLeads: 0,
    topStaff: STAFF[0],
    budgetSpent: 0,
    budgetAllocated: 50000,
    startDate: "2026-04-01",
    endDate: "2026-05-31",
    villages: ["Rewari", "Dharuhera", "Bawal"],
    conversionRate: 0,
  },
]

/* ── Helpers ────────────────────────────────────────── */

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string; icon: typeof Megaphone }> = {
  "field-drive":  { label: "Field Drive",    bg: "bg-sky-500/15",    text: "text-sky-400",     icon: MapPin },
  "digital":      { label: "Digital",         bg: "bg-violet-500/15", text: "text-violet-400",  icon: Globe },
  "referral":     { label: "Referral",        bg: "bg-amber-500/15",  text: "text-amber-400",   icon: Users },
  "event":        { label: "Event",           bg: "bg-emerald-500/15",text: "text-emerald-400", icon: Calendar },
  "door-to-door": { label: "Door-to-Door",    bg: "bg-rose-500/15",   text: "text-rose-400",    icon: MapPin },
}

const STATUS_STYLES: Record<string, { label: string; dot: string }> = {
  active:    { label: "Active",    dot: "bg-emerald-500" },
  paused:    { label: "Paused",    dot: "bg-amber-500" },
  completed: { label: "Completed", dot: "bg-muted-foreground" },
  draft:     { label: "Draft",     dot: "bg-border" },
}

function formatCurrency(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

/* ── Stat Card ──────────────────────────────────────── */

function StatCard({ label, value, sub, icon: Icon }: {
  label: string; value: string; sub?: string; icon: typeof TrendingUp
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/60 px-4 py-3.5 backdrop-blur-xl">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  )
}

/* ── Campaign Row ───────────────────────────────────── */

function CampaignRow({ campaign, onView, onToggle, onQr }: {
  campaign: Campaign
  onView: () => void
  onToggle: () => void
  onQr: () => void
}) {
  const ts = TYPE_STYLES[campaign.type] ?? TYPE_STYLES["field-drive"]
  const ss = STATUS_STYLES[campaign.status] ?? STATUS_STYLES.draft
  const TypeIcon = ts.icon
  const budgetPercent = campaign.budgetAllocated > 0
    ? Math.round((campaign.budgetSpent / campaign.budgetAllocated) * 100)
    : 0

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:flex-row sm:items-center sm:gap-4">
      {/* Identity */}
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/30", ts.bg)}>
          <TypeIcon className={cn("size-5", ts.text)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{campaign.name}</p>
            <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium", ts.bg, ts.text)}>
              {ts.label}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={cn("size-1.5 rounded-full", ss.dot)} />
            <span className="text-[11px] text-muted-foreground">{ss.label}</span>
            <span className="text-[11px] text-muted-foreground">|</span>
            <span className="text-[11px] text-muted-foreground">{campaign.startDate} - {campaign.endDate}</span>
          </div>
        </div>
      </div>

      {/* Manager */}
      <div className="hidden items-center gap-2 lg:flex" style={{ width: 160 }}>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-[10px] font-bold text-primary">
          {campaign.manager.avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-foreground">{campaign.manager.name}</p>
          <p className="text-[10px] text-muted-foreground">{campaign.manager.role}</p>
        </div>
      </div>

      {/* Leads */}
      <div className="hidden items-center gap-3 md:flex" style={{ width: 140 }}>
        <div>
          <p className="text-sm font-bold text-foreground">{campaign.totalLeads}</p>
          <p className="text-[10px] text-muted-foreground">leads</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex size-5 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/15 text-[8px] font-bold text-sky-400">
            {campaign.topStaff.avatar}
          </div>
          <span className="text-[10px] text-muted-foreground truncate max-w-[70px]">{campaign.topStaff.name}</span>
        </div>
      </div>

      {/* Budget */}
      <div className="hidden xl:block" style={{ width: 140 }}>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-foreground">{formatCurrency(campaign.budgetSpent)}</span>
          <span className="text-[11px] text-muted-foreground">/ {formatCurrency(campaign.budgetAllocated)}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border/40">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              budgetPercent > 90 ? "bg-destructive" : budgetPercent > 60 ? "bg-amber-500" : "bg-primary"
            )}
            style={{ width: `${Math.min(budgetPercent, 100)}%` }}
          />
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{budgetPercent}% utilized</p>
      </div>

      {/* Conversion */}
      <div className="hidden items-center gap-2 xl:flex" style={{ width: 80 }}>
        <div className={cn(
          "text-sm font-bold",
          campaign.conversionRate >= 40 ? "text-emerald-500" : campaign.conversionRate >= 20 ? "text-amber-500" : "text-muted-foreground"
        )}>
          {campaign.conversionRate}%
        </div>
        <span className="text-[10px] text-muted-foreground">conv.</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onView} className="gap-1.5 border-border/50 text-xs">
          <Eye className="size-3.5" />
          <span className="hidden sm:inline">View</span>
        </Button>
        <Button variant="outline" size="icon" onClick={onQr} className="size-8 border-border/50" title="Show QR">
          <QrCode className="size-3.5" />
        </Button>
        {campaign.status === "completed" ? (
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px]">
            Completed
          </Badge>
        ) : campaign.status === "draft" ? (
          <Badge variant="outline" className="border-border/40 bg-muted/30 text-muted-foreground text-[10px]">
            Draft
          </Badge>
        ) : (
          <Button variant="outline" size="sm" onClick={onToggle} className="gap-1.5 border-border/50 text-xs">
            {campaign.status === "active" ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span className="hidden sm:inline">{campaign.status === "active" ? "Pause" : "Resume"}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

/* ── Mobile Card ────────────────────────────────────── */

function CampaignCardMobile({ campaign, onView, onToggle, onQr }: {
  campaign: Campaign
  onView: () => void
  onToggle: () => void
  onQr: () => void
}) {
  const ts = TYPE_STYLES[campaign.type] ?? TYPE_STYLES["field-drive"]
  const ss = STATUS_STYLES[campaign.status] ?? STATUS_STYLES.draft
  const TypeIcon = ts.icon
  const budgetPercent = campaign.budgetAllocated > 0
    ? Math.round((campaign.budgetSpent / campaign.budgetAllocated) * 100)
    : 0

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl md:hidden">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/30", ts.bg)}>
          <TypeIcon className={cn("size-5", ts.text)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{campaign.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", ts.bg, ts.text)}>
              {ts.label}
            </span>
            <span className={cn("size-1.5 rounded-full", ss.dot)} />
            <span className="text-[10px] text-muted-foreground">{ss.label}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border/30 bg-background/30 px-3 py-2 text-center">
          <p className="text-base font-bold text-foreground">{campaign.totalLeads}</p>
          <p className="text-[10px] text-muted-foreground">Leads</p>
        </div>
        <div className="rounded-xl border border-border/30 bg-background/30 px-3 py-2 text-center">
          <p className={cn(
            "text-base font-bold",
            campaign.conversionRate >= 40 ? "text-emerald-500" : campaign.conversionRate >= 20 ? "text-amber-500" : "text-muted-foreground"
          )}>{campaign.conversionRate}%</p>
          <p className="text-[10px] text-muted-foreground">Conv.</p>
        </div>
        <div className="rounded-xl border border-border/30 bg-background/30 px-3 py-2 text-center">
          <p className="text-base font-bold text-foreground">{budgetPercent}%</p>
          <p className="text-[10px] text-muted-foreground">Budget</p>
        </div>
      </div>

      {/* Manager + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-[9px] font-bold text-primary">
            {campaign.manager.avatar}
          </div>
          <span className="text-xs text-muted-foreground">{campaign.manager.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onView} className="h-8 gap-1 text-xs">
            <Eye className="size-3" />
            View
          </Button>
          <Button variant="outline" size="icon" onClick={onQr} className="size-8" title="Show QR">
            <QrCode className="size-3" />
          </Button>
          {campaign.status === "completed" ? (
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px]">
              Done
            </Badge>
          ) : campaign.status === "draft" ? (
            <Badge variant="outline" className="border-border/40 bg-muted/30 text-muted-foreground text-[10px]">
              Draft
            </Badge>
          ) : (
            <Button variant="outline" size="sm" onClick={onToggle} className="h-8 text-xs">
              {campaign.status === "active" ? <Pause className="size-3" /> : <Play className="size-3" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ────────────────────────���─────────────── */

export default function CampaignListPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [createOpen, setCreateOpen] = useState(false)

  /* New campaign form state */
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState("field-drive")
  const [newMonitor, setNewMonitor] = useState("")

  /* QR dialog */
  const [qrCampaign, setQrCampaign] = useState<Campaign | null>(null)

  const totalLeads = campaigns.reduce((s, c) => s + c.totalLeads, 0)
  const activeCampaigns = campaigns.filter(c => c.status === "active").length
  const totalBudgetSpent = campaigns.reduce((s, c) => s + c.budgetSpent, 0)
  const avgConversion = campaigns.filter(c => c.totalLeads > 0).length > 0
    ? Math.round(campaigns.filter(c => c.totalLeads > 0).reduce((s, c) => s + c.conversionRate, 0) / campaigns.filter(c => c.totalLeads > 0).length)
    : 0

  const filtered = campaigns
    .filter(c => filterStatus === "all" || c.status === filterStatus)
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 c.manager.name.toLowerCase().includes(searchQuery.toLowerCase()))

  function toggleStatus(id: string) {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c
      return { ...c, status: c.status === "active" ? "paused" : "active" }
    }))
  }

  function handleCreate() {
    if (!newName.trim()) return
    const monitorStaff = STAFF.find(s => s.id === newMonitor) ?? STAFF[0]
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: newName.trim(),
      type: newType as Campaign["type"],
      status: "draft",
      manager: monitorStaff,
      totalLeads: 0,
      topStaff: STAFF[0],
      budgetSpent: 0,
      budgetAllocated: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      villages: [],
      conversionRate: 0,
    }
    setCampaigns(prev => [newCamp, ...prev])
    setNewName("")
    setNewType("field-drive")
    setNewMonitor("")
    setCreateOpen(false)
  }

  return (
    <DashboardShell>
      {/* Title Bar */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">Campaign Command Center</h1>
          <p className="text-xs text-muted-foreground">Manage outreach campaigns and track field performance</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 shadow-md shadow-primary/20">
          <Plus className="size-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Leads" value={totalLeads.toLocaleString()} sub={`${activeCampaigns} active campaigns`} icon={Users} />
        <StatCard label="Active Campaigns" value={activeCampaigns.toString()} sub={`of ${campaigns.length} total`} icon={Megaphone} />
        <StatCard label="Budget Utilized" value={formatCurrency(totalBudgetSpent)} sub="across all campaigns" icon={BarChart3} />
        <StatCard label="Avg Conversion" value={`${avgConversion}%`} sub="lead-to-admission" icon={TrendingUp} />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search campaigns or managers..."
            className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-10 pr-4 text-sm text-foreground backdrop-blur-xl placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["all", "active", "paused", "completed", "draft"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                filterStatus === s
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-card/60 text-muted-foreground border border-border/40 hover:text-foreground"
              )}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop rows */}
      <div className="hidden flex-col gap-3 md:flex">
        {filtered.map(campaign => (
          <CampaignRow
            key={campaign.id}
            campaign={campaign}
            onView={() => router.push(`/dashboard/crm/campaigns/${campaign.id}`)}
            onToggle={() => toggleStatus(campaign.id)}
            onQr={() => setQrCampaign(campaign)}
          />
        ))}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map(campaign => (
          <CampaignCardMobile
            key={campaign.id}
            campaign={campaign}
            onView={() => router.push(`/dashboard/crm/campaigns/${campaign.id}`)}
            onToggle={() => toggleStatus(campaign.id)}
            onQr={() => setQrCampaign(campaign)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <Megaphone className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No campaigns found</p>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Campaign Name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Summer Intake Drive 2026"
                className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Campaign Type</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Object.entries(TYPE_STYLES).map(([key, val]) => {
                  const TIcon = val.icon
                  return (
                    <button
                      key={key}
                      onClick={() => setNewType(key)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                        newType === key
                          ? "border-primary/50 bg-primary/10"
                          : "border-border/40 bg-background/30 hover:border-border/60"
                      )}
                    >
                      <TIcon className={cn("size-5", newType === key ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-[11px] font-medium", newType === key ? "text-primary" : "text-foreground")}>{val.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Monitored By */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Monitored By</label>
              <select
                value={newMonitor}
                onChange={e => setNewMonitor(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="">Select staff member...</option>
                {STAFF.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)} className="border-border/50">Cancel</Button>
              <Button size="sm" onClick={handleCreate} className="shadow-md shadow-primary/20">Create Campaign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!qrCampaign} onOpenChange={(open) => { if (!open) setQrCampaign(null) }}>
        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-2xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Campaign QR Code</DialogTitle>
          </DialogHeader>
          {qrCampaign && (
            <div className="flex flex-col items-center gap-4 py-4">
              {/* QR Code SVG */}
              <div className="rounded-2xl border border-border/40 bg-white p-4">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Outer positioning markers */}
                  <rect x="10" y="10" width="50" height="50" rx="6" fill="none" stroke="#1a1a2e" strokeWidth="4" />
                  <rect x="18" y="18" width="34" height="34" rx="3" fill="#1a1a2e" />
                  <rect x="140" y="10" width="50" height="50" rx="6" fill="none" stroke="#1a1a2e" strokeWidth="4" />
                  <rect x="148" y="18" width="34" height="34" rx="3" fill="#1a1a2e" />
                  <rect x="10" y="140" width="50" height="50" rx="6" fill="none" stroke="#1a1a2e" strokeWidth="4" />
                  <rect x="18" y="148" width="34" height="34" rx="3" fill="#1a1a2e" />
                  {/* Data modules */}
                  {Array.from({ length: 12 }).map((_, i) =>
                    Array.from({ length: 12 }).map((_, j) => {
                      const hash = ((i * 7 + j * 13 + qrCampaign.id.charCodeAt(qrCampaign.id.length - 1)) % 3)
                      if (hash === 0) return null
                      const x = 70 + j * 8
                      const y = 70 + i * 8
                      if (x > 186 || y > 186) return null
                      return <rect key={`${i}-${j}`} x={x} y={y} width="6" height="6" rx="1" fill="#1a1a2e" />
                    })
                  )}
                  {/* Center logo area */}
                  <rect x="80" y="80" width="40" height="40" rx="8" fill="white" stroke="#1a1a2e" strokeWidth="2" />
                  <text x="100" y="106" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1a1a2e">GH</text>
                </svg>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{qrCampaign.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Scan to access campaign lead capture form
                </p>
                <p className="mt-0.5 text-[10px] font-mono text-muted-foreground/60">
                  ID: {qrCampaign.id}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border/50"
                onClick={() => setQrCampaign(null)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
