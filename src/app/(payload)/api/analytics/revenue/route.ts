import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const restaurantId = searchParams.get('restaurantId')
    const days = parseInt(searchParams.get('days') || '30', 10)

    const payload = await getPayload({ config })

    // Build query with restaurant filter if provided
    const whereQuery: any = {}
    if (restaurantId) {
      whereQuery.restaurant = { equals: restaurantId }
    }

    // Fetch orders
    const ordersResponse = await payload.find({
      collection: 'orders',
      where: whereQuery,
      limit: 1000,
      sort: '-createdAt',
    })

    const orders = ordersResponse.docs

    // Generate last N days
    const categories: string[] = []
    const revenueData: number[] = []
    const ordersData: number[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      categories.push(
        new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric' }).format(date),
      )

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
        return orderDate === dateStr
      })

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)

      revenueData.push(dayRevenue)
      ordersData.push(dayOrders.length)
    }

    const data = {
      categories,
      series: [
        {
          name: 'الإيرادات',
          data: revenueData,
        },
        {
          name: 'الطلبات',
          data: ordersData,
        },
      ],
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 })
  }
}
