import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category?: string
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            <Image
              src={image || "/placeholder-shoe.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 p-4">
          {category && (
            <span className="text-xs text-muted-foreground uppercase">{category}</span>
          )}
          <h3 className="font-semibold">{name}</h3>
          <p className="text-lg font-bold text-primary">€{price.toFixed(2)}</p>
          <Button className="w-full" variant="outline">
            Ver Detalles
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
