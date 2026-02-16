import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Get token from cookie (HTTP-only)
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 })
    }

    // Get locale from query params or header (default: 'ar')
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || request.headers.get('x-locale') || 'ar'

    // Create a new Headers object with the token in Authorization header
    // Payload's auth method expects token in Authorization header
    const headers = new Headers(request.headers)
    headers.set('authorization', `Bearer ${token}`)

    // Verify token and get user
    const { user } = await payload.auth({
      headers,
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 })
    }

    // Fetch full user data with locale support for localized fields
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
      locale: locale as any,
      depth: 2, // Include related data like restaurant
    })

    return NextResponse.json({
      user: fullUser,
    })
  } catch (error: any) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { message: error?.message || 'Authentication failed' },
      { status: 401 },
    )
  }
}
