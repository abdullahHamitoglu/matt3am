'use server'
import { cookies } from 'next/headers'

export const createAuthCookie = async () => {
  ;(await cookies()).set('auth_token', 'myToken', { secure: true })
}

export const deleteAuthCookie = async () => {
  ;(await cookies()).delete('auth_token')
}
