import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreateCardModal } from "@/components/create-card-modal"
import { requireAuth } from "@/lib/auth-utils"
import { getAllSubjects } from "@/app/actions/subjects"
import { Subject } from "@/types/subjects"
import { getAllCards } from "../actions/cards"
import { Card as CardType } from "@/types/cards"

export default async function DashboardPage() {
  // This will redirect to login if user is not authenticated
  const user = await requireAuth()
  let subjectsList: Subject[] = []
  let cardsList: CardType[] = []

  async function getInitialData() {
    const [subjects, cards] = await Promise.all([
      getAllSubjects(user.id),
      getAllCards(user.id)
    ])
    return { subjects, cards }
  }

  interface IGetCardsCount {
    total: number
    totalReviewPending: number
  }

  function getCardsCountBySubject(subjectId: string): IGetCardsCount {
    const total = cardsList.filter((card) => card.subjectId === subjectId).length
    const totalReviewPending = cardsList.filter((card) => card.subjectId === subjectId && card.nextReviewAt < new Date()).length
    return { total, totalReviewPending }
  }

  if (user) {
    const { subjects, cards } = await getInitialData()
    subjectsList = subjects
    cardsList = cards
  }





  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-8">
      <Link href="/review" className="w-full max-w-md">
        <Card className="w-full transition-all hover:shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 space-y-2">
              <h2 className="text-2xl font-bold">
                Revisar <span className="text-primary">12</span> Cards Hoje
              </h2>
              <Progress value={25} className="h-2" />
              <p className="text-sm text-muted-foreground">3 de 12 cards revisados</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div className="fixed bottom-20 right-4 md:bottom-4">
        <CreateCardModal />
      </div>
    </div>
  )
}
