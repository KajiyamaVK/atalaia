"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { HomeIcon, BookIcon, ChartIcon, SettingsIcon } from "@/components/icons"

export function Navigation() {
  const pathname = usePathname()

  // Don't show navigation on login page
  if (pathname === "/") {
    return null
  }

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

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 z-10 w-full border-t bg-background md:hidden">
        <div className="grid h-16 grid-cols-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-1 text-xs transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation - Always Visible */}
      <TooltipProvider>
        <nav className="fixed left-0 top-16 z-10 hidden h-[calc(100vh-4rem)] w-16 border-r bg-background md:block">
          <div className="flex flex-col gap-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "mx-2 flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </nav>
      </TooltipProvider>
    </>
  )
}
