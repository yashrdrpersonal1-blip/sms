"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { MegaMenu } from "@/components/dashboard/mega-menu"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Ambient background orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary/[0.07] blur-[100px]" />
        <div className="absolute top-1/3 -right-24 size-80 rounded-full bg-primary/[0.05] blur-[80px]" />
        <div className="absolute -bottom-40 left-1/3 size-72 rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>

      {/* Desktop sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Header: full-width on mobile, offset on desktop */}
      <DashboardHeader
        breadcrumbs={[
          { label: "Student Lifecycle" },
          { label: "Admissions" },
        ]}
      />

      {/* Main content: no left margin on mobile, ml-16 on desktop */}
      <main className="mt-14 p-4 md:ml-16 md:p-6">{children}</main>

      {/* Bottom nav on mobile */}
      <MegaMenu />
    </div>
  )
}
