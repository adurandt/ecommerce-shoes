import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Obtener órdenes de los últimos 6 meses
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const orders = await prisma.order.findMany({
      where: {
        status: {
          not: "CANCELLED",
        },
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    // Ventas por mes
    const salesByMonthMap = new Map<string, number>()
    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleDateString("es-ES", {
        month: "short",
        year: "numeric",
      })
      const current = salesByMonthMap.get(month) || 0
      salesByMonthMap.set(month, current + order.total)
    })

    const salesByMonth = Array.from(salesByMonthMap.entries())
      .map(([month, sales]) => ({ month, sales }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Ventas por categoría
    const salesByCategoryMap = new Map<string, number>()
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.product.category.name
        const current = salesByCategoryMap.get(category) || 0
        salesByCategoryMap.set(
          category,
          current + item.price * item.quantity
        )
      })
    })

    const salesByCategory = Array.from(salesByCategoryMap.entries()).map(
      ([category, sales]) => ({ category, sales })
    )

    // Productos más vendidos
    const productSalesMap = new Map<string, number>()
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productName = item.product.name
        const current = productSalesMap.get(productName) || 0
        productSalesMap.set(productName, current + item.quantity)
      })
    })

    const topProducts = Array.from(productSalesMap.entries())
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)

    return NextResponse.json({
      salesByMonth,
      salesByCategory,
      topProducts,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Error al obtener analytics" },
      { status: 500 }
    )
  }
}
