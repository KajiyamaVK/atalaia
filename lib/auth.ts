import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(password, salt)
  return { hash, salt }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name?: string) {
  const { prisma } = await import("@/lib/prisma")
  const { hash, salt } = await hashPassword(password)

  return prisma.user.create({
    data: {
      email,
      password: hash,
      salt,
      name,
    },
  })
}

export async function getUserByEmail(email: string) {
  const { prisma } = await import("@/lib/prisma")
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user || !user.password) return null

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null

  // Return user without password
  const { password: _, salt: __, ...userWithoutPassword } = user
  return userWithoutPassword
}
