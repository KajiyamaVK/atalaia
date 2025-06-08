import { prisma } from "../prisma"
import type { Subject } from "@prisma/client"

export async function getSubjectsByUser(userId: string) {
  return prisma.subject.findMany({
    where: { userId },
    include: {
      category: true,
      _count: {
        select: { cards: true },
      },
    },
    orderBy: { name: "asc" },
  })
}

export async function getSubjectById(id: string, userId: string) {
  return prisma.subject.findFirst({
    where: { id, userId },
    include: {
      category: true,
      cards: true,
    },
  })
}

export async function createSubject(data: {
  name: string
  description?: string
  color?: string
  userId: string
  categoryId: string
}): Promise<Subject> {
  return prisma.subject.create({
    data,
  })
}

export async function updateSubject(
  id: string,
  userId: string,
  data: {
    name?: string
    description?: string
    color?: string
    categoryId?: string
  },
): Promise<Subject> {
  return prisma.subject.update({
    where: { id, userId },
    data,
  })
}

export async function deleteSubject(id: string, userId: string): Promise<Subject> {
  return prisma.subject.delete({
    where: { id, userId },
  })
}
