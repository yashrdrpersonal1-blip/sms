import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setups - GroveHub",
  description: "GroveHub system configuration and setup",
}

export default function SetupsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
