import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product/ProductCard"
import { prisma } from "@/lib/prisma"
import { ArrowRight, TrendingUp, Shield, Truck } from "lucide-react"

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 6,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      take: 4,
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const categories = await getCategories()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Encuentra el Par Perfecto
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Descubre nuestra colección exclusiva de zapatos para cada ocasión.
              Calidad, estilo y comodidad en un solo lugar.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/products">
                  Ver Productos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products?category=deportivos">Zapatos Deportivos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-3xl font-bold">Categorías</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-lg"
              >
                <h3 className="font-semibold group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Button asChild variant="outline">
              <Link href="/products">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images[0] || "/placeholder-shoe.jpg"}
                category={product.category.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Envío Gratis</h3>
              <p className="text-muted-foreground">
                Envío gratuito en pedidos superiores a €50
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Garantía de Calidad</h3>
              <p className="text-muted-foreground">
                Productos de alta calidad con garantía
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tendencias Actuales</h3>
              <p className="text-muted-foreground">
                Las últimas tendencias en calzado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-3xl font-bold">Lo Que Dicen Nuestros Clientes</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <p className="mb-4 text-muted-foreground">
                "Excelente calidad y servicio. Los zapatos son muy cómodos y duraderos."
              </p>
              <p className="font-semibold">- María González</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <p className="mb-4 text-muted-foreground">
                "Gran variedad de estilos y tallas. Encontré exactamente lo que buscaba."
              </p>
              <p className="font-semibold">- Juan Pérez</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <p className="mb-4 text-muted-foreground">
                "El proceso de compra fue muy fácil y el envío llegó rápido. Muy recomendado."
              </p>
              <p className="font-semibold">- Ana Martínez</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
