import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationDrawer } from "@/components/navigation-drawer"

interface HeaderProps {
  showAvatar?: boolean
}

export function Header({ showAvatar = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-3">
        <NavigationDrawer />
        <Link href="/dashboard" className="text-xl font-bold">
          Atalaia
        </Link>
      </div>

      {showAvatar && (
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      )}
    </header>
  )
}
