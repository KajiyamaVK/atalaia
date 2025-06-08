import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { AuthProvider } from "@/components/auth-provider"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Atalaia - Estudo com Repetição Espaçada",
  description: "Aplicativo de estudo com repetição espaçada para melhorar sua retenção de conhecimento",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50`}>
        <AuthProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <Navigation />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
