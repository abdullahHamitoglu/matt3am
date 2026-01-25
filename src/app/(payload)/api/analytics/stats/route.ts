import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const restaurantId = searchParams.get('restaurantId')

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

    // Calculate current month stats
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const currentMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const lastMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear
    })

    // Calculate revenue
    const currentMonthRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + (order.pricing?.total || 0),
      0,
    )

    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum + (order.pricing?.total || 0),
      0,
    )

    const revenueTrend =
      lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    const ordersTrend =
      lastMonthOrders.length > 0
        ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : 0

    // Get unique customers
    const customerEmails = new Set(orders.map((order) => order.customer?.email).filter(Boolean))

    // Get restaurants count
    const restaurantsResponse = await payload.find({
      collection: 'restaurants',
      limit: 1000,
    })

    const activeRestaurants = restaurantsResponse.docs.filter((r) => r.isActive).length

    const stats = {
      totalRevenue: currentMonthRevenue,
      totalOrders: currentMonthOrders.length,
      totalCustomers: customerEmails.size,
      activeRestaurants,
      revenueTrend: {
        value: Math.abs(revenueTrend),
        isPositive: revenueTrend >= 0,
      },
      ordersTrend: {
        value: Math.abs(ordersTrend),
        isPositive: ordersTrend >= 0,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
