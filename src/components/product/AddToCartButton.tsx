"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
  productId: string
  sizes?: string[]
}

export function AddToCartButton({ productId, sizes = [] }: AddToCartButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedSize, setSelectedSize] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/auth/login")
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
      })
      return
    }

    if (sizes.length > 0 && !selectedSize) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor selecciona una talla antes de agregar al carrito",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          size: selectedSize || "N/A",
          quantity: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al agregar al carrito")
      }

      toast({
        title: "Producto agregado",
        description: "El producto se ha agregado al carrito",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {sizes.length > 0 && (
        <Select value={selectedSize} onValueChange={setSelectedSize} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una talla" />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? "Agregando..." : "Agregar al Carrito"}
      </Button>
    </div>
  )
}
