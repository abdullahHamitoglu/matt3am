import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
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

    // Logout is handled by clearing the cookie
    // Here we just verify the token is valid
    try {
      await payload.auth({
        headers: request.headers,
      })
    } catch (e) {
      // Token invalid or expired, that's fine for logout
    }

    const response = NextResponse.json({
      message: 'Logout successful',
    })

    // Clear the auth cookie
    response.cookies.delete('auth_token')

    return response
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json({ message: error?.message || 'Logout failed' }, { status: 500 })
  }
}
