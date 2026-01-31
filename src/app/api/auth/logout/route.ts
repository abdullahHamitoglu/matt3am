import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      // Even if no token, still return success (already logged out)
      const response = NextResponse.json({
        message: 'Logout successful',
      })
      response.cookies.delete('auth_token')
      return response
    }

    // Logout is handled by clearing the cookie
    // Optionally verify the token is valid
    try {
      const headers = new Headers(request.headers)
      headers.set('authorization', `Bearer ${token}`)
      await payload.auth({
        headers,
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
