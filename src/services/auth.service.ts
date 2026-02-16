/**
 * Authentication Service
 * Handles login, logout, register, and current user operations
 */

import apiClient from '@/lib/api/client'
import { AUTH_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  AuthPayload,
  AuthResponse,
  CurrentUserResponse,
  RegisterPayload,
} from '@/lib/api/types'

export const authService = {
  /**
   * Login with email and password
   */
  async login(payload: AuthPayload, locale: string): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>({
      url: AUTH_ENDPOINTS.LOGIN,
      method: 'POST',
      data: {
        ...payload,
        locale,
        fallbackLocale: false,
      },
      params: {
        'fallback-locale': 'none',
        locale,
      },
      headers: {
        'x-locale': locale,
      },
    })
    console.log('Auth service - login response:', response.data)
    // Token is stored in HTTP-only cookie by the server
    return response.data
  },

  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload)
    // Token is stored in HTTP-only cookie by the server
    return response.data
  },

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>(AUTH_ENDPOINTS.ME)
    return response.data
  },

  /**
   * Logout - clears token from storage
   */
  async logout(): Promise<void> {
    // Server will clear the cookie
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    // Check will be done server-side via cookie
    return true // This should be checked via getCurrentUser instead
  },

  /**
   * Get stored auth token (not available with HTTP-only cookies)
   */
  getToken(): string | null {
    // Token is in HTTP-only cookie, not accessible via JavaScript
    return null
  },

  /**
   * Clear auth token (handled server-side)
   */
  clearToken(): void {
    // Token clearing is handled by logout endpoint
  },
}
