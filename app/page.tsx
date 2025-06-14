"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppleIcon, GoogleIcon } from "@/components/icons"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<LoginFormValues>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof LoginFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (loginError) setLoginError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData)

      // Sign in with credentials
      const result = await signIn("credentials", {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      })

      if (result?.error) {
        setLoginError("Email ou senha inválidos")
        setIsLoading(false)
        return
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form validation errors
        const fieldErrors: Partial<LoginFormValues> = {}
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginFormValues
          fieldErrors[path] = err.message
        })
        setErrors(fieldErrors)
      } else {
        setLoginError("Ocorreu um erro ao fazer login")
      }
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h1 className="text-center text-3xl font-bold">Atalaia</h1>
          <p className="text-center text-sm text-muted-foreground">Acesse sua conta para continuar seus estudos.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            {loginError && <p className="text-center text-sm text-destructive">{loginError}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <span className="relative bg-card px-2 text-sm text-muted-foreground">ou</span>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" className="flex items-center justify-center gap-2" onClick={handleGoogleSignIn}>
              <GoogleIcon className="h-4 w-4" />
              <span>Entrar com Google</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2" disabled>
              <AppleIcon className="h-4 w-4" />
              <span>Entrar com Apple</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            <Link href="/reset-password" className="text-sm underline underline-offset-4 hover:text-primary">
              Esqueci minha senha
            </Link>
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link href="/signup" className="text-sm underline underline-offset-4 hover:text-primary">
              Criar uma conta
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
