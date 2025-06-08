"use client"


import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateSubjectModal } from "@/components/create-subject-modal"
import { SearchIcon, MoreHorizontalIcon, EditIcon, TrashIcon } from "@/components/icons"
import { deleteSubject } from "@/app/actions/subjects"

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


export function SubjectsTable({ subjects, searchTerm, setSearchTerm }: { subjects: Subject[], searchTerm: string, setSearchTerm: (searchTerm: string) => void }) {
    const [filteredSubjects, setFilteredSubjects] = useState(subjects)

    useEffect(() => {
        setFilteredSubjects(searchSubjects(subjects, searchTerm))
    }, [subjects, searchTerm])

    return (
        <>
            <div className="mb-6">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar assuntos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                            <TableHead className="hidden md:table-cell">Cards</TableHead>
                            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
                            <TableHead className="w-[70px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {searchTerm ? "Nenhum assunto encontrado." : "Nenhum assunto criado ainda."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubjects.map((subject) => (
                                <TableRow key={subject.id}>
                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{subject.description || "Sem descrição"}</TableCell>
                                    <TableCell className="hidden md:table-cell">{subject.cardCount}</TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {new Date(subject.createdAt).toLocaleDateString("pt-BR")}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontalIcon className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <CreateSubjectModal
                                                    subject={subject}
                                                    onSave={(updatedData) => {
                                                        setSubjects((prev) => prev.map((s) => (s.id === subject.id ? { ...s, ...updatedData } : s)))
                                                    }}
                                                >
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <EditIcon className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                </CreateSubjectModal>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(subject.id)}>
                                                    <TrashIcon className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}