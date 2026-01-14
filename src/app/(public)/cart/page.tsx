"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: string
  quantity: number
  size: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stock: number
  }
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }
    if (status === "authenticated") {
      fetchCart()
    }
  }, [status, router])

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart")
      if (res.ok) {
        const data = await res.json()
        setCartItems(data)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      deleteItem(itemId)
      return
    }

    setUpdating(itemId)
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (res.ok) {
        const updatedItem = await res.json()
        setCartItems((items) =>
          items.map((item) => (item.id === itemId ? updatedItem : item))
        )
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Error al actualizar cantidad",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar cantidad",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const deleteItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setCartItems((items) => items.filter((item) => item.id !== itemId))
        toast({
          title: "Producto eliminado",
          description: "El producto se ha eliminado del carrito",
        })
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar producto",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar producto",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  if (loading || status === "loading") {
    return (
      <div className="container py-8">
        <div className="text-center">Cargando carrito...</div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">
            Agrega productos para comenzar
          </p>
          <Button asChild>
            <Link href="/products">Ver Productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Carrito de Compras</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                    <Image
                      src={item.product.images[0] || "/placeholder-shoe.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Talla: {item.size}
                    </p>
                    <p className="mt-2 font-bold text-primary">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={updating === item.id}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            updating === item.id ||
                            item.quantity >= item.product.stock
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(item.id)}
                        disabled={updating === item.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    `€${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {subtotal < 50 && (
                <p className="text-sm text-muted-foreground">
                  Agrega €{(50 - subtotal).toFixed(2)} más para envío gratis
                </p>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push("/checkout")}
              >
                Proceder al Checkout
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Seguir Comprando</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
