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

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<SignupFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<SignupFormValues>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof SignupFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (signupError) setSignupError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSignupError(null)

    try {
      // Validate form data
      const validatedData = signupSchema.parse(formData)

      // Create user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta")
      }

      // Sign in with credentials
      await signIn("credentials", {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      })

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form validation errors
        const fieldErrors: Partial<SignupFormValues> = {}
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof SignupFormValues
          fieldErrors[path] = err.message
        })
        setErrors(fieldErrors)
      } else if (error instanceof Error) {
        setSignupError(error.message)
      } else {
        setSignupError("Ocorreu um erro ao criar sua conta")
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
          <h1 className="text-center text-3xl font-bold">Criar Conta</h1>
          <p className="text-center text-sm text-muted-foreground">Crie sua conta para começar a estudar.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>
            {signupError && <p className="text-center text-sm text-destructive">{signupError}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar Conta"}
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
              <span>Continuar com Google</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2" disabled>
              <AppleIcon className="h-4 w-4" />
              <span>Continuar com Apple</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link href="/" className="text-sm underline underline-offset-4 hover:text-primary">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
