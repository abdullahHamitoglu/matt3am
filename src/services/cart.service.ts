import { BaseService } from './base.service'

export interface CartItem {
  menuItem: string | any
  quantity: number
  price: number
  subtotal?: number
  customizations?: string
  specialInstructions?: string
}

export interface CartPricing {
  subtotal: number
  tax: number
  total: number
}

export interface Cart {
  id?: string
  user?: string | any
  sessionId?: string
  restaurant: string | any
  items: CartItem[]
  pricing: CartPricing
  itemCount: number
  couponCode?: string
  discount: number
  expiresAt?: string
  status: 'active' | 'abandoned' | 'converted' | 'expired'
  createdAt?: string
  updatedAt?: string
}

export interface AddToCartParams {
  menuItemId: string
  quantity: number
  price: number
  customizations?: string
  specialInstructions?: string
}

export interface UpdateCartItemParams {
  itemIndex: number
  quantity?: number
  customizations?: string
  specialInstructions?: string
}

class CartService extends BaseService<Cart> {
  constructor() {
    super('/api/cart')
  }

  /**
   * Get or create cart for current session
   * @param restaurantId - The restaurant ID
   * @param sessionId - Guest session ID (if not logged in)
   */
  async getOrCreateCart(restaurantId: string, sessionId?: string): Promise<Cart> {
    try {
      // Try to get existing cart
      const where: any = {
        restaurant: { equals: restaurantId },
        status: { equals: 'active' },
      }

      if (sessionId) {
        where.sessionId = { equals: sessionId }
      }

      const response = await this.list({
        where,
        limit: 1,
      })

      if (response.docs && response.docs.length > 0) {
        return response.docs[0]
      }

      // Create new cart
      return await this.create({
        restaurant: restaurantId,
        sessionId,
        items: [],
        pricing: {
          subtotal: 0,
          tax: 0,
          total: 0,
        },
        itemCount: 0,
        discount: 0,
        status: 'active',
      })
    } catch (error) {
      throw new Error(`Failed to get or create cart: ${error}`)
    }
  }

  /**
   * Add item to cart
   */
  async addItem(cartId: string, itemData: AddToCartParams): Promise<Cart> {
    try {
      const cart = await this.getById(cartId)

      // Check if item already exists
      const existingItemIndex = cart.items.findIndex((item: CartItem) => {
        const menuItemId = typeof item.menuItem === 'string' ? item.menuItem : item.menuItem?.id
        return (
          menuItemId === itemData.menuItemId &&
          item.customizations === (itemData.customizations || '')
        )
      })

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += itemData.quantity
      } else {
        // Add new item
        cart.items.push({
          menuItem: itemData.menuItemId,
          quantity: itemData.quantity,
          price: itemData.price,
          customizations: itemData.customizations,
          specialInstructions: itemData.specialInstructions,
        })
      }

      return await this.update(cartId, { items: cart.items })
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error}`)
    }
  }

  /**
   * Update cart item
   */
  async updateItem(cartId: string, updateData: UpdateCartItemParams): Promise<Cart> {
    try {
      const cart = await this.getById(cartId)

      if (updateData.itemIndex < 0 || updateData.itemIndex >= cart.items.length) {
        throw new Error('Invalid item index')
      }

      // Update the item
      if (updateData.quantity !== undefined) {
        cart.items[updateData.itemIndex].quantity = updateData.quantity
      }
      if (updateData.customizations !== undefined) {
        cart.items[updateData.itemIndex].customizations = updateData.customizations
      }
      if (updateData.specialInstructions !== undefined) {
        cart.items[updateData.itemIndex].specialInstructions = updateData.specialInstructions
      }

      return await this.update(cartId, { items: cart.items })
    } catch (error) {
      throw new Error(`Failed to update cart item: ${error}`)
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(cartId: string, itemIndex: number): Promise<Cart> {
    try {
      const cart = await this.getById(cartId)

      if (itemIndex < 0 || itemIndex >= cart.items.length) {
        throw new Error('Invalid item index')
      }

      cart.items.splice(itemIndex, 1)

      return await this.update(cartId, { items: cart.items })
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error}`)
    }
  }

  /**
   * Clear all items from cart
   */
  async clearCart(cartId: string): Promise<Cart> {
    try {
      return await this.update(cartId, { items: [] })
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error}`)
    }
  }

  /**
   * Apply coupon code
   */
  async applyCoupon(cartId: string, couponCode: string): Promise<Cart> {
    try {
      // TODO: Validate coupon and calculate discount
      // For now, just update the coupon code
      return await this.update(cartId, { couponCode })
    } catch (error) {
      throw new Error(`Failed to apply coupon: ${error}`)
    }
  }

  /**
   * Convert cart to order
   */
  async convertToOrder(cartId: string): Promise<Cart> {
    try {
      return await this.update(cartId, { status: 'converted' })
    } catch (error) {
      throw new Error(`Failed to convert cart to order: ${error}`)
    }
  }

  /**
   * Get active cart for current user/session
   */
  async getActiveCart(restaurantId: string, sessionId?: string): Promise<Cart | null> {
    try {
      const where: any = {
        restaurant: { equals: restaurantId },
        status: { equals: 'active' },
      }

      if (sessionId) {
        where.sessionId = { equals: sessionId }
      }

      const response = await this.list({
        where,
        limit: 1,
        depth: 2, // Include menu items details
      })

      return response.docs && response.docs.length > 0 ? response.docs[0] : null
    } catch (error) {
      console.error('Failed to get active cart:', error)
      return null
    }
  }
}

export const cartService = new CartService()
