import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { AddToCartButton } from "@/components/product/AddToCartButton"

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder-shoe.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground uppercase">
              {product.category.name}
            </span>
            <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-primary">
              €{product.price.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <AddToCartButton productId={product.id} sizes={product.sizes} />
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Información del Producto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Stock disponible: {product.stock} unidades</li>
                <li>Tallas disponibles: {product.sizes.join(", ")}</li>
                <li>Categoría: {product.category.name}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
