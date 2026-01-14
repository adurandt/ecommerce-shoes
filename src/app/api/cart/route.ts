import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Error al obtener el carrito" },
      { status: 500 }
    )
  }
}

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
    const { productId, size, quantity = 1 } = body

    if (!productId || !size) {
      return NextResponse.json(
        { error: "productId y size son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el producto existe y tiene stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      )
    }

    // Buscar si ya existe un item en el carrito con el mismo producto y talla
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_size: {
          userId: session.user.id,
          productId,
          size,
        },
      },
    })

    if (existingItem) {
      // Actualizar cantidad
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      })
      return NextResponse.json(updatedItem)
    } else {
      // Crear nuevo item
      const newItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          size,
          quantity,
        },
        include: {
          product: true,
        },
      })
      return NextResponse.json(newItem, { status: 201 })
    }
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "El producto ya está en el carrito" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId es requerido" },
        { status: 400 }
      )
    }

    // Verificar que el item pertenece al usuario
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Item no encontrado o no autorizado" },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ message: "Item eliminado del carrito" })
  } catch (error) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json(
      { error: "Error al eliminar del carrito" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "itemId y quantity son requeridos" },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "La cantidad debe ser mayor a 0" },
        { status: 400 }
      )
    }

    // Verificar que el item pertenece al usuario
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    })

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Item no encontrado o no autorizado" },
        { status: 404 }
      )
    }

    if (item.product.stock < quantity) {
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      )
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json(
      { error: "Error al actualizar el carrito" },
      { status: 500 }
    )
  }
}
