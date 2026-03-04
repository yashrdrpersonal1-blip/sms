import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - GroveHub",
  description: "GroveHub AI-Powered School ERP Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
