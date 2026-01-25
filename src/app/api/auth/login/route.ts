import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const body = (await request.json()) as { email?: string; password?: string }
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    // Use Payload's login method
    const result = await payload.login({
      collection: 'users',
      data: {
        email: email as string,
        password: password as string,
      },
    })

    // Get the token from result
    const token = result.token
    const user = result.user

    console.log('Login result:', { hasToken: !!token, hasUser: !!user })

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'Login successful',
      token: token,
      user: user,
    })

    // Set HTTP-only cookie for security
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        message: error?.message || 'Invalid credentials',
        errors: error?.data || [],
      },
      { status: 401 },
    )
  }
}
