import type React from "react"
import { Header } from "@/components/header"

export default function SubjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0 md:pl-16">{children}</main>
    </div>
  )
}
