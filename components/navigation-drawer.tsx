"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { MenuIcon, HomeIcon, BookIcon, ChartIcon, SettingsIcon } from "@/components/icons"

export function NavigationDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      name: "Início",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Assuntos",
      href: "/subjects",
      icon: BookIcon,
    },
    {
      name: "Progresso",
      href: "/progress",
      icon: ChartIcon,
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: SettingsIcon,
    },
  ]

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
