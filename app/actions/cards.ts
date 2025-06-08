"use server"

import { prisma } from "@/lib/prisma"

export async function createCard(formData: FormData) {
    const question = formData.get("question")
    const answer = formData.get("answer")
    const subjectId = formData.get("subjectId")

    const card = await prisma.card.create({
        data: { question, answer, subjectId },
    })

    return card
}

export async function getAllCards(userId: string) {
    const cards = await prisma.card.findMany({
        where: {
            subject: {
                userId
            }
        }
    })

    return cards
}

export async function getCardById(id: string) {
    const card = await prisma.card.findUnique({
        where: { id },
    })

    return card
}

export async function deleteCard(id: string) {
    const card = await prisma.card.delete({
        where: { id },
    })
}