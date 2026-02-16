import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'
import { getApiMessage } from '@/lib/api-messages'

/**
 * Helper to check if user has Administrator role
 */
function isAdminUser(user: User): boolean {
  const userRoles = user.roles
  if (!userRoles) return false

  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles]
  return rolesArray.some((role) => {
    if (typeof role === 'object' && role !== null && 'name' in role) {
      return role.name === 'Administrator'
    }
    return false
  })
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Authenticate user
    const { user } = await payload.auth({
      headers: request.headers,
    })

    const searchParams = request.nextUrl.searchParams
    let restaurantId = searchParams.get('restaurantId')
    const days = parseInt(searchParams.get('days') || '30', 10)
    const locale = request.headers.get('x-locale') || searchParams.get('locale') || 'ar'
    const fallbackLocale = searchParams.get('fallback-locale') || 'none'

    if (!user) {
      return NextResponse.json({ error: getApiMessage('unauthorized', locale) }, { status: 401 })
    }

    // Check if user is active
    if ('isActive' in user && user.isActive === false) {
      return NextResponse.json({ error: getApiMessage('accountInactive', locale) }, { status: 403 })
    }

    // Enforce restaurant scoping for non-admins
    if (!isAdminUser(user)) {
      const userRestaurants = Array.isArray(user.restaurant)
        ? user.restaurant.map((r) => (typeof r === 'string' ? r : r.id))
        : []

      if (userRestaurants.length === 0) {
        return NextResponse.json(
          { error: getApiMessage('noRestaurantsAssigned', locale) },
          { status: 403 },
        )
      }

      // If no restaurantId provided, default to first restaurant
      if (!restaurantId) {
        restaurantId = userRestaurants[0]
      } else if (!userRestaurants.includes(restaurantId)) {
        // User trying to access restaurant they're not assigned to
        return NextResponse.json({ error: getApiMessage('forbidden', locale) }, { status: 403 })
      }
    }

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
      locale: locale as 'ar' | 'en' | 'tr',
      fallbackLocale:
        fallbackLocale === 'none' || fallbackLocale === 'null' || fallbackLocale === 'false'
          ? false
          : (fallbackLocale as 'ar' | 'en' | 'tr'),
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
        new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date),
      )

      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0]
        return orderDate === dateStr
      })

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)

      revenueData.push(dayRevenue)
      ordersData.push(dayOrders.length)
    }

    const seriesNames: Record<string, { revenue: string; orders: string }> = {
      ar: { revenue: 'الإيرادات', orders: 'الطلبات' },
      en: { revenue: 'Revenue', orders: 'Orders' },
      tr: { revenue: 'Gelir', orders: 'Siparişler' },
    }

    const currentLocale = seriesNames[locale] || seriesNames.ar

    const data = {
      categories,
      series: [
        {
          name: currentLocale.revenue,
          data: revenueData,
        },
        {
          name: currentLocale.orders,
          data: ordersData,
        },
      ],
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    const locale = request.nextUrl.searchParams.get('locale') || 'ar'
    return NextResponse.json({ error: getApiMessage('internalError', locale) }, { status: 500 })
  }
}
