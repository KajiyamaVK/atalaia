import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create a test user
  const { hash, salt } = await hashPassword("password123")
  const user = await prisma.user.create({
    data: {
      email: "test@atalaia.com",
      name: "Test User",
      password: hash,
      salt,
    },
  })

  // Create categories
  const mathCategory = await prisma.category.create({
    data: {
      name: "Matemática",
      description: "Assuntos relacionados à matemática",
      color: "#3B82F6",
      icon: "📐",
    },
  })

  const languageCategory = await prisma.category.create({
    data: {
      name: "Idiomas",
      description: "Aprendizado de idiomas",
      color: "#10B981",
      icon: "🌍",
    },
  })

  const techCategory = await prisma.category.create({
    data: {
      name: "Tecnologia",
      description: "Programação e tecnologia",
      color: "#8B5CF6",
      icon: "💻",
    },
  })

  // Create subjects
  const algebraSubject = await prisma.subject.create({
    data: {
      name: "Álgebra",
      description: "Equações e funções algébricas",
      userId: user.id,
      categoryId: mathCategory.id,
    },
  })

  const englishSubject = await prisma.subject.create({
    data: {
      name: "Inglês",
      description: "Vocabulário e gramática inglesa",
      userId: user.id,
      categoryId: languageCategory.id,
    },
  })

  const reactSubject = await prisma.subject.create({
    data: {
      name: "React",
      description: "Biblioteca JavaScript para interfaces",
      userId: user.id,
      categoryId: techCategory.id,
    },
  })

  // Create sample cards
  await prisma.card.createMany({
    data: [
      {
        front: "O que é uma função quadrática?",
        back: "Uma função quadrática é uma função polinomial de segundo grau, da forma f(x) = ax² + bx + c, onde a ≠ 0.",
        userId: user.id,
        subjectId: algebraSubject.id,
      },
      {
        front: 'What does "serendipity" mean?',
        back: "Serendipity means the occurrence and development of events by chance in a happy or beneficial way.",
        userId: user.id,
        subjectId: englishSubject.id,
      },
      {
        front: "O que é o useState em React?",
        back: "useState é um Hook que permite adicionar estado a componentes funcionais. Retorna um array com o valor atual do estado e uma função para atualizá-lo.",
        userId: user.id,
        subjectId: reactSubject.id,
      },
    ],
  })

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
