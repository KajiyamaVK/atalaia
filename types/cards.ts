export interface Card {
    id: string
    front: string
    back: string
    subjectId: string
    nextReviewAt: Date
    createdAt: Date
    updatedAt: Date
}