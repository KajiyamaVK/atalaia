"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon } from "@/components/icons"

interface CreateSubjectModalProps {
  children?: React.ReactNode
  subject?: {
    id: string
    name: string
    description: string
  }
  onSave?: (subject: { name: string; description: string }) => void
}

export function CreateSubjectModal({ children, subject, onSave }: CreateSubjectModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    description: subject?.description || "",
  })

  const isEditing = !!subject

  // TODO: Implement form validation with Zod
  // const formSchema = z.object({
  //   name: z.string().min(1, "O nome do assunto é obrigatório"),
  //   description: z.string().optional(),
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement state management with Zustand
    // const { addSubject, updateSubject } = useSubjectStore();
    // if (isEditing) {
    //   updateSubject(subject.id, formData);
    // } else {
    //   addSubject(formData);
    // }

    console.log(isEditing ? "Subject updated:" : "Subject created:", formData)

    if (onSave) {
      onSave(formData)
    }

    // Reset form and close modal
    if (!isEditing) {
      setFormData({ name: "", description: "" })
    }
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen && !isEditing) {
      // Reset form when modal closes (only for new subjects)
      setFormData({ name: "", description: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Assunto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Assunto" : "Criar Novo Assunto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Assunto</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Matemática, História, Programação..."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Breve descrição sobre o assunto..."
              value={formData.description}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? "Salvar Alterações" : "Criar Assunto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
