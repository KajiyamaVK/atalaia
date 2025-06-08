import { prisma } from "../prisma"
import type { Category } from "@prisma/client"

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { id },
    include: {
      subjects: {
        include: {
          _count: {
            select: { cards: true },
          },
        },
      },
    },
  })
}

export async function createCategory(data: {
  name: string
  description?: string
  color?: string
  icon?: string
}): Promise<Category> {
  return prisma.category.create({
    data,
  })
}

export async function updateCategory(
  id: string,
  data: {
    name?: string
    description?: string
    color?: string
    icon?: string
  },
): Promise<Category> {
  return prisma.category.update({
    where: { id },
    data,
  })
}

export async function deleteCategory(id: string): Promise<Category> {
  return prisma.category.delete({
    where: { id },
  })
}
