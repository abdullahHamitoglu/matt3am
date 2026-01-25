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
  async getDashboardStats(restaurantId?: string): Promise<DashboardStats> {
    try {
      const params = restaurantId ? `?restaurantId=${restaurantId}` : ''
      const response = await apiClient.get<DashboardStats>(`/api/analytics/stats${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  /**
   * Get revenue chart data
   */
  async getRevenueData(restaurantId?: string, days: number = 30): Promise<RevenueData> {
    try {
      const params = new URLSearchParams()
      if (restaurantId) params.append('restaurantId', restaurantId)
      params.append('days', days.toString())

      const response = await apiClient.get<RevenueData>(`/api/analytics/revenue?${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      throw error
    }
  }
}

export const analyticsService = new AnalyticsService()
