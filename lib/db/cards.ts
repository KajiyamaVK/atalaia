import { prisma } from "../prisma"
import type { Card } from "@prisma/client"

export async function getCardsByUser(userId: string) {
  return prisma.card.findMany({
    where: { userId },
    include: {
      subject: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCardsBySubject(subjectId: string, userId: string) {
  return prisma.card.findMany({
    where: { subjectId, userId },
    include: {
      subject: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCardsForReview(userId: string) {
  return prisma.card.findMany({
    where: {
      userId,
      nextReviewAt: {
        lte: new Date(),
      },
    },
    include: {
      subject: {
        include: { category: true },
      },
    },
    orderBy: { nextReviewAt: "asc" },
  })
}

export async function createCard(data: {
  front: string
  back: string
  userId: string
  subjectId: string
}): Promise<Card> {
  return prisma.card.create({
    data,
  })
}

export async function updateCard(
  id: string,
  userId: string,
  data: {
    front?: string
    back?: string
    subjectId?: string
  },
): Promise<Card> {
  return prisma.card.update({
    where: { id, userId },
    data,
  })
}

export async function deleteCard(id: string, userId: string): Promise<Card> {
  return prisma.card.delete({
    where: { id, userId },
  })
}

// Spaced Repetition Algorithm (SM-2)
export async function updateCardAfterReview(
  cardId: string,
  userId: string,
  quality: number, // 0-5 rating
): Promise<Card> {
  const card = await prisma.card.findFirst({
    where: { id: cardId, userId },
  })

  if (!card) throw new Error("Card not found")

  // SM-2 Algorithm implementation
  let { easeFactor, interval, repetitions } = card

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else {
    // Incorrect response
    repetitions = 0
    interval = 1
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < 1.3) easeFactor = 1.3

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + interval)

  // Update card and create review record
  const [updatedCard] = await prisma.$transaction([
    prisma.card.update({
      where: { id: cardId },
      data: {
        easeFactor,
        interval,
        repetitions,
        nextReviewAt,
        lastReviewAt: new Date(),
      },
    }),
    prisma.review.create({
      data: {
        quality,
        userId,
        cardId,
      },
    }),
  ])

  return updatedCard
}
