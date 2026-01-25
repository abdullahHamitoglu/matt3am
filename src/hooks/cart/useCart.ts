import { useState, useEffect, useCallback } from 'react'
import { cartService, type Cart, type AddToCartParams } from '@/services/cart.service'

/**
 * Generate or get session ID for guest users
 */
const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('cart_session_id')
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('cart_session_id', sessionId)
  }
  return sessionId
}

export interface UseCartOptions {
  restaurantId: string
  autoLoad?: boolean
}

export const useCart = ({ restaurantId, autoLoad = true }: UseCartOptions) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load cart from server
   */
  const loadCart = useCallback(async () => {
    if (!restaurantId) return

    setLoading(true)
    setError(null)

    try {
      const sessionId = getSessionId()
      const loadedCart = await cartService.getActiveCart(restaurantId, sessionId)

      if (loadedCart) {
        setCart(loadedCart)
      } else {
        // Create new cart if none exists
        const newCart = await cartService.getOrCreateCart(restaurantId, sessionId)
        setCart(newCart)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart')
      console.error('Error loading cart:', err)
    } finally {
      setLoading(false)
    }
  }, [restaurantId])

  /**
   * Add item to cart
   */
  const addToCart = useCallback(
    async (itemData: AddToCartParams) => {
      if (!cart?.id) {
        setError('Cart not initialized')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const updatedCart = await cartService.addItem(cart.id, itemData)
        setCart(updatedCart)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add item')
        console.error('Error adding to cart:', err)
      } finally {
        setLoading(false)
      }
    },
    [cart?.id],
  )

  /**
   * Update cart item quantity
   */
  const updateQuantity = useCallback(
    async (itemIndex: number, quantity: number) => {
      if (!cart?.id) return

      setLoading(true)
      setError(null)

      try {
        const updatedCart = await cartService.updateItem(cart.id, {
          itemIndex,
          quantity,
        })
        setCart(updatedCart)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update quantity')
        console.error('Error updating quantity:', err)
      } finally {
        setLoading(false)
      }
    },
    [cart?.id],
  )

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(
    async (itemIndex: number) => {
      if (!cart?.id) return

      setLoading(true)
      setError(null)

      try {
        const updatedCart = await cartService.removeItem(cart.id, itemIndex)
        setCart(updatedCart)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove item')
        console.error('Error removing item:', err)
      } finally {
        setLoading(false)
      }
    },
    [cart?.id],
  )

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(async () => {
    if (!cart?.id) return

    setLoading(true)
    setError(null)

    try {
      const updatedCart = await cartService.clearCart(cart.id)
      setCart(updatedCart)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart')
      console.error('Error clearing cart:', err)
    } finally {
      setLoading(false)
    }
  }, [cart?.id])

  /**
   * Apply coupon code
   */
  const applyCoupon = useCallback(
    async (couponCode: string) => {
      if (!cart?.id) return

      setLoading(true)
      setError(null)

      try {
        const updatedCart = await cartService.applyCoupon(cart.id, couponCode)
        setCart(updatedCart)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to apply coupon')
        console.error('Error applying coupon:', err)
      } finally {
        setLoading(false)
      }
    },
    [cart?.id],
  )

  // Auto-load cart on mount
  useEffect(() => {
    if (autoLoad && restaurantId) {
      loadCart()
    }
  }, [autoLoad, restaurantId, loadCart])

  return {
    cart,
    loading,
    error,
    itemCount: cart?.itemCount || 0,
    total: cart?.pricing?.total || 0,
    subtotal: cart?.pricing?.subtotal || 0,
    tax: cart?.pricing?.tax || 0,
    discount: cart?.discount || 0,
    // Actions
    loadCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
  }
}
