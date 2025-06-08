import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const subjectSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    userId: z.string().min(1),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, description, color, icon, userId } = subjectSchema.parse(body)

        const { prisma } = await import("@/lib/prisma")

        const subject = await prisma.subject.create({
            data: { name, description, color, icon, userId },
        })

        return NextResponse.json(subject, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao criar assunto" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma")

        const subjects = await prisma.subject.findMany()

        return NextResponse.json(subjects, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar assuntos" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma")

        const id = req.nextUrl.searchParams.get("id")
        if (!id) {
            return NextResponse.json({ message: "ID do assunto não encontrado" }, { status: 400 })
        }

        const subject = await prisma.subject.delete({
            where: { id },
        })

        return NextResponse.json(subject, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao deletar assunto" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { prisma } = await import("@/lib/prisma")

        const id = req.nextUrl.searchParams.get("id")
        if (!id) {
            return NextResponse.json({ message: "ID do assunto não encontrado" }, { status: 400 })
        }

        const body = await req.json()
        const { name, description, color, icon } = subjectSchema.parse(body)

        const subject = await prisma.subject.update({
            where: { id },
            data: { name, description, color, icon },
        })

        return NextResponse.json(subject, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Erro ao atualizar assunto" }, { status: 500 })
    }
}


