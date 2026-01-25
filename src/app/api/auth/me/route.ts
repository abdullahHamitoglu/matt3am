import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 })
    }

    // Verify token and get user
    const { user } = await payload.auth({
      headers: request.headers,
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
