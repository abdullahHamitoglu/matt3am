import apiClient from '@/lib/api/client'

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  activeRestaurants: number
  revenueTrend: {
    value: number
    isPositive: boolean
  }
  ordersTrend: {
    value: number
    isPositive: boolean
  }
}

export interface RevenueData {
  categories: string[]
  series: {
    name: string
    data: number[]
  }[]
}

/**
 * Analytics Service
 * Provides dashboard statistics and analytics data
 */
class AnalyticsService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(restaurantId?: string, locale?: string): Promise<DashboardStats> {
    try {
      const params = new URLSearchParams()
      if (restaurantId) params.append('restaurantId', restaurantId)
      if (locale) params.append('locale', locale)
      params.append('fallback-locale', 'none')

      const paramsString = params.toString()
      const response = await apiClient.get<DashboardStats>(
        `/analytics/stats${paramsString ? `?${paramsString}` : ''}`,
      )
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  /**
   * Get revenue chart data
   */
  async getRevenueData(
    restaurantId?: string | null,
    days: number = 30,
    locale?: string,
  ): Promise<RevenueData> {
    try {
      const params = new URLSearchParams()
      if (restaurantId) params.append('restaurantId', restaurantId)
      params.append('days', days.toString())
      if (locale) params.append('locale', locale)
      params.append('fallback-locale', 'none')

      const headers = locale ? { 'x-locale': locale } : {}
      const response = await apiClient.get<RevenueData>(`/analytics/revenue?${params}`, {
        headers,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      throw error
    }
  }
}

export const analyticsService = new AnalyticsService()
