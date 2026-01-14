"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold">¡Pedido Confirmado!</h1>
            <p className="mb-2 text-muted-foreground">
              Gracias por tu compra. Tu pedido ha sido procesado correctamente.
            </p>
            {orderId && (
              <p className="mb-8 text-sm text-muted-foreground">
                Número de pedido: <span className="font-mono font-semibold">{orderId}</span>
              </p>
            )}
            <p className="mb-8 text-muted-foreground">
              Te enviaremos un email de confirmación con los detalles de tu pedido.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/products">Seguir Comprando</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
