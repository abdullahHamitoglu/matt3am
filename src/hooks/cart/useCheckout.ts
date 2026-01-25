import { useState, useCallback } from 'react'
import { ordersService } from '@/services/orders.service'
import { cartService } from '@/services/cart.service'
import type { Cart } from '@/services/cart.service'

export interface CreateOrderFromCartParams {
  cartId: string
  customer: {
    name: string
    phone: string
    email?: string
  }
  orderType: 'dine-in' | 'takeaway' | 'delivery'
  tableId?: string
  deliveryAddress?: {
    street: string
    city: string
    district: string
    notes?: string
  }
  paymentMethod?: 'cash' | 'credit-card' | 'e-wallet' | 'bank-transfer'
  notes?: string
}

export const useCheckout = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  /**
   * Create order from cart
   */
  const createOrderFromCart = useCallback(async (params: CreateOrderFromCartParams) => {
    setLoading(true)
    setError(null)
    setOrderId(null)

    try {
      // Get cart details
      const cart: Cart = await cartService.getById(params.cartId, 2)

      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty')
      }

      // Prepare order data
      const orderData: any = {
        restaurant: cart.restaurant,
        customer: params.customer,
        orderType: params.orderType,
        items: cart.items.map((item: any) => ({
          menuItem: typeof item.menuItem === 'string' ? item.menuItem : item.menuItem.id,
          quantity: item.quantity,
          price: item.price,
          customizations: item.customizations,
          specialInstructions: item.specialInstructions,
        })),
        pricing: {
          subtotal: cart.pricing.subtotal,
          tax: cart.pricing.tax,
          discount: cart.discount,
          total: cart.pricing.total,
        },
        paymentMethod: params.paymentMethod,
        notes: params.notes,
      }

      // Add optional fields
      if (params.tableId) {
        orderData.table = params.tableId
      }

      if (params.deliveryAddress && params.orderType === 'delivery') {
        orderData.deliveryAddress = params.deliveryAddress
      }

      // Create the order
      const order = await ordersService.create(orderData)

      // Mark cart as converted
      await cartService.convertToOrder(params.cartId)

      setOrderId(order.id!)
      return order
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order'
      setError(errorMessage)
      console.error('Error creating order:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Reset checkout state
   */
  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setOrderId(null)
  }, [])

  return {
    loading,
    error,
    orderId,
    createOrderFromCart,
    reset,
  }
}
