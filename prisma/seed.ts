import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Crear usuario administrador
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: adminPassword,
      name: "Administrador",
      role: "ADMIN",
    },
  })

  // Crear usuario de prueba
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: userPassword,
      name: "Usuario de Prueba",
      role: "USER",
    },
  })

  // Crear categorías
  const deportivos = await prisma.category.upsert({
    where: { slug: "deportivos" },
    update: {},
    create: {
      name: "Deportivos",
      slug: "deportivos",
      description: "Zapatos deportivos para running, entrenamiento y actividades físicas",
    },
  })

  const casuales = await prisma.category.upsert({
    where: { slug: "casuales" },
    update: {},
    create: {
      name: "Casuales",
      slug: "casuales",
      description: "Zapatos casuales para el día a día",
    },
  })

  const formales = await prisma.category.upsert({
    where: { slug: "formales" },
    update: {},
    create: {
      name: "Formales",
      slug: "formales",
      description: "Zapatos formales para ocasiones especiales",
    },
  })

  const botas = await prisma.category.upsert({
    where: { slug: "botas" },
    update: {},
    create: {
      name: "Botas",
      slug: "botas",
      description: "Botas para todas las estaciones",
    },
  })

  // Crear productos de ejemplo
  const products = [
    {
      name: "Zapatillas Running Pro",
      description: "Zapatillas de running de alta calidad con tecnología de amortiguación avanzada. Perfectas para corredores que buscan máximo rendimiento y comodidad.",
      price: 89.99,
      images: ["/products/running-1.jpg", "/products/running-2.jpg"],
      stock: 50,
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      categoryId: deportivos.id,
    },
    {
      name: "Zapatillas Casual Urban",
      description: "Zapatillas casuales con diseño moderno y cómodas para el uso diario. Ideales para caminar por la ciudad.",
      price: 59.99,
      images: ["/products/casual-1.jpg", "/products/casual-2.jpg"],
      stock: 75,
      sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
      categoryId: casuales.id,
    },
    {
      name: "Zapatos Oxford Clásicos",
      description: "Zapatos formales de cuero genuino con estilo clásico. Perfectos para ocasiones formales y de negocios.",
      price: 129.99,
      images: ["/products/formal-1.jpg", "/products/formal-2.jpg"],
      stock: 30,
      sizes: ["39", "40", "41", "42", "43", "44", "45"],
      categoryId: formales.id,
    },
    {
      name: "Botas de Cuero Marrón",
      description: "Botas elegantes de cuero marrón con suela antideslizante. Ideales para el otoño e invierno.",
      price: 149.99,
      images: ["/products/botas-1.jpg", "/products/botas-2.jpg"],
      stock: 25,
      sizes: ["39", "40", "41", "42", "43", "44"],
      categoryId: botas.id,
    },
    {
      name: "Zapatillas Deportivas Air",
      description: "Zapatillas deportivas con tecnología de aire para máxima comodidad. Perfectas para entrenamientos intensos.",
      price: 99.99,
      images: ["/products/sport-1.jpg", "/products/sport-2.jpg"],
      stock: 60,
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      categoryId: deportivos.id,
    },
    {
      name: "Zapatos Derby Negros",
      description: "Zapatos Derby de cuero negro con acabado brillante. Elegantes y versátiles para cualquier ocasión formal.",
      price: 119.99,
      images: ["/products/derby-1.jpg", "/products/derby-2.jpg"],
      stock: 40,
      sizes: ["39", "40", "41", "42", "43", "44"],
      categoryId: formales.id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log("Seed completado:")
  console.log("- Usuario admin creado: admin@example.com / admin123")
  console.log("- Usuario de prueba creado: user@example.com / user123")
  console.log("- Categorías creadas")
  console.log("- Productos de ejemplo creados")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
