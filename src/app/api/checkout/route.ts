import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      shippingAddress,
      paymentMethod,
    }: {
      shippingAddress: {
        street: string
        city: string
        state?: string
        zipCode: string
        country: string
      }
      paymentMethod: string
    } = body

    // Validar datos
    if (
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.zipCode
    ) {
      return NextResponse.json(
        { error: "Dirección de envío incompleta" },
        { status: 400 }
      )
    }

    // Obtener items del carrito
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      )
    }

    // Verificar stock y calcular total
    let total = 0
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para ${item.product.name}`,
          },
          { status: 400 }
        )
      }
      total += item.product.price * item.quantity
    }

    // Crear o encontrar dirección
    let address = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        street: shippingAddress.street,
        city: shippingAddress.city,
        zipCode: shippingAddress.zipCode,
      },
    })

    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: session.user.id,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country || "España",
        },
      })
    }

    // Crear orden
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PENDING",
        shippingAddressId: address.id,
        paymentMethod,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Actualizar stock de productos
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Limpiar carrito
    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        orderId: order.id,
        message: "Orden creada exitosamente",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Error al procesar la orden" },
      { status: 500 }
    )
  }
}
