
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateSubjectModal } from "@/components/create-subject-modal"
import { SearchIcon, MoreHorizontalIcon, EditIcon, TrashIcon } from "@/components/icons"
import { getAllSubjects, deleteSubject } from "@/app/actions/subjects"

// TODO: Replace with Zustand store data
// const mockSubjects = [
//   {
//     id: "1",
//     name: "Matemática",
//     description: "Álgebra, geometria e cálculo",
//     cardCount: 45,
//     createdAt: "2024-01-15",
//   },
//   {
//     id: "2",
//     name: "História",
//     description: "História mundial e do Brasil",
//     cardCount: 32,
//     createdAt: "2024-01-10",
//   },
//   {
//     id: "3",
//     name: "Programação",
//     description: "JavaScript, React e Node.js",
//     cardCount: 78,
//     createdAt: "2024-01-20",
//   },
//   {
//     id: "4",
//     name: "Inglês",
//     description: "Vocabulário e gramática",
//     cardCount: 156,
//     createdAt: "2024-01-05",
//   },
// ]

interface Subject {
  id: string
  name: string
  description: string
  createdAt: Date
}

const searchSubjects = (subjects: Subject[], searchTerm: string) => {
  return subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

export default async function SubjectsPage() {
  const subjects = await getAllSubjects()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assuntos</h1>
          <p className="text-muted-foreground">Gerencie os assuntos dos seus cards de estudo</p>
        </div>
        <CreateSubjectModal />
      </div>


    </div>
  )
}
