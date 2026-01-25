/**
 * Axios HTTP Client
 * Configures axios with authentication token handling, error handling, and Payload response transformation
 */

import axios, { AxiosError, AxiosResponse } from 'axios'
import { API_BASE_URL } from './endpoints'
import type { ApiError } from './types'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for CSRF
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: any) => {
    // Token is sent automatically via HTTP-only cookie
    // No need to manually add Authorization header
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle Payload response format and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Payload returns different formats based on endpoint
    // For auth endpoints, response.data is the actual data
    // For collections, response.data might have docs, totalDocs, etc.
    return response
  },
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Redirect to login if in browser
      if (typeof window !== 'undefined') {
        // Token is cleared server-side
        window.location.href = '/login'
      }
    }

    // Transform error response
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    }

    return Promise.reject(apiError)
  },
)

export default apiClient
