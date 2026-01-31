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

    return NextResponse.json({
      user,
    })
  } catch (error: any) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { message: error?.message || 'Authentication failed' },
      { status: 401 },
    )
  }
}
