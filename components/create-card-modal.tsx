"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon } from "@/components/icons"

interface CreateCardModalProps {
  children?: React.ReactNode
}

// TODO: Replace with Zustand store data
const mockSubjects = [
  { id: "1", name: "Matemática" },
  { id: "2", name: "História" },
  { id: "3", name: "Programação" },
  { id: "4", name: "Inglês" },
]

export function CreateCardModal({ children }: CreateCardModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    subjectId: "",
  })

  // TODO: Implement form validation with Zod
  // const formSchema = z.object({
  //   front: z.string().min(1, "A frente do card é obrigatória"),
  //   back: z.string().min(1, "O verso do card é obrigatório"),
  //   subjectId: z.string().min(1, "Selecione um assunto"),
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subjectId: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement state management with Zustand
    // const { addCard } = useCardStore();
    // addCard(formData);

    console.log("Card saved:", formData)

    // Reset form and close modal
    setFormData({ front: "", back: "", subjectId: "" })
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when modal closes
      setFormData({ front: "", back: "", subjectId: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <PlusIcon className="h-6 w-6" />
            <span className="sr-only">Criar Novo Card</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Select value={formData.subjectId} onValueChange={handleSubjectChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um assunto" />
              </SelectTrigger>
              <SelectContent>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="front">Frente</Label>
            <Input
              id="front"
              name="front"
              placeholder="Digite a pergunta ou termo"
              value={formData.front}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="back">Verso</Label>
            <Textarea
              id="back"
              name="back"
              placeholder="Digite a resposta ou explicação"
              value={formData.back}
              onChange={handleChange}
              className="min-h-[120px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Dica: Explique como se estivesse ensinando alguém. Nossa IA usará isso para te ajudar.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
