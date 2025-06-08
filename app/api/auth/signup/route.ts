import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = signupSchema.parse(body)

    // Dynamic imports to avoid build-time issues
    const { prisma } = await import("@/lib/prisma")
    const { hashPassword } = await import("@/lib/auth")

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Este email já está sendo utilizado" }, { status: 409 })
    }

    // Create new user
    const { hash, salt } = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        salt,
      },
    })

    // Return user without password
    const { password: _, salt: __, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos", errors: error.errors }, { status: 400 })
    }

    console.error("Signup error:", error)
    return NextResponse.json({ message: "Erro ao criar conta" }, { status: 500 })
  }
}
