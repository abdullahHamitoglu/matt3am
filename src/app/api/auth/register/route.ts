import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const body = (await request.json()) as {
      email?: string
      password?: string
      firstName?: string
      lastName?: string
      phone?: string
    }
    const { email, password, firstName, lastName, phone } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, password, first name, and last name are required' },
        { status: 400 },
      )
    }

    // Create new user
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        firstName,
        lastName,
        phone,
      },
    })

    // Login the newly created user
    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        message: 'Registration successful',
        token: result.token,
        user: result.user,
      },
      { status: 201 },
    )

    // Set HTTP-only cookie for security
    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        message: error?.message || 'Registration failed',
        errors: error?.data || [],
      },
      { status: 400 },
    )
  }
}
