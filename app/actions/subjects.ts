"use server"

export async function createSubject(formData: FormData) {
    const { prisma } = await import("@/lib/prisma")

    const name = formData.get("name")
    const description = formData.get("description")
    const userId = formData.get("userId")

    const subject = await prisma.subject.create({
        data: { name, description, userId },
    })

    return subject
}

export async function deleteSubject(id: string) {
    const { prisma } = await import("@/lib/prisma")

    const subject = await prisma.subject.delete({
        where: { id },
    })

    return subject
}

export async function updateSubject(id: string, formData: FormData) {
    const { prisma } = await import("@/lib/prisma")

    const name = formData.get("name")
    const description = formData.get("description")
    const userId = formData.get("userId")

    const subject = await prisma.subject.update({
        where: { id },
        data: { name, description, userId },
    })

    return subject
}

export async function getAllSubjects(userId: string) {
    const { prisma } = await import("@/lib/prisma")

    const subjects = await prisma.subject.findMany(
        {
            where: {
                userId
            },
        }
    )

    return subjects
}

export async function getSubjectById(id: string) {
    const { prisma } = await import("@/lib/prisma")

    const subject = await prisma.subject.findUnique({
        where: { id },
    })

    return subject
}