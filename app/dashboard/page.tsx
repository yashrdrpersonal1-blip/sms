"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Users, GraduationCap, CreditCard, TrendingUp, Clock } from "lucide-react"

const stats = [
  { label: "Total Students", value: "2,847", change: "+12%", icon: GraduationCap },
  { label: "Staff Members", value: "186", change: "+3%", icon: Users },
  { label: "Fees Collected", value: "$1.2M", change: "+8%", icon: CreditCard },
  { label: "Attendance Today", value: "94.2%", change: "+1.5%", icon: BarChart3 },
]

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, Admin. Here is what is happening today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardContent className="flex items-start justify-between p-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                    <span className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</span>
                    <span className="flex items-center gap-1 text-xs text-emerald-500">
                      <TrendingUp className="size-3" />
                      {stat.change} this month
                    </span>
                  </div>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm">
                    <Icon className="size-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Canvas placeholder */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-3 p-8">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm">
              <BarChart3 className="size-7 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Dashboard Canvas</h2>
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              This is where module-specific content will render. Select a sub-module from the sidebar or open the mega-menu to navigate.
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity placeholder */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Recent Activity</h3>
              <div className="flex flex-col gap-3">
                {[
                  { action: "New admission application received", time: "2 min ago", icon: GraduationCap },
                  { action: "Payroll processed for March 2026", time: "1 hr ago", icon: CreditCard },
                  { action: "Staff attendance marked", time: "3 hrs ago", icon: Users },
                  { action: "Fee structure updated for Term 2", time: "5 hrs ago", icon: CreditCard },
                ].map((item, i) => {
                  const ItemIcon = item.icon
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
                        <ItemIcon className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm text-foreground">{item.action}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardContent className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "New Admission",
                  "Mark Attendance",
                  "Collect Fees",
                  "Generate Report",
                  "Send Notice",
                  "View Calendar",
                ].map((action) => (
                  <button
                    key={action}
                    className="rounded-xl border border-border/50 bg-background/30 px-3 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
