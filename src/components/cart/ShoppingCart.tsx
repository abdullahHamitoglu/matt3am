import React from 'react'
import { useCart } from '@/hooks/cart'
import type { CartItem } from '@/services/cart.service'

interface ShoppingCartProps {
  restaurantId: string
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ restaurantId }) => {
  const {
    cart,
    loading,
    error,
    itemCount,
    total,
    subtotal,
    tax,
    discount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart({ restaurantId })

  if (loading && !cart) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 border border-red-200 rounded-lg text-red-600">{error}</div>
    )
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-6xl">🛒</div>
        <h3 className="mb-2 font-semibold text-lg">سلة التسوق فارغة</h3>
        <p className="text-gray-500">أضف عناصر من القائمة لتبدأ الطلب</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl">سلة التسوق ({itemCount})</h2>
        {itemCount > 0 && (
          <button
            onClick={() => clearCart()}
            className="text-red-600 hover:text-red-800 text-sm"
            disabled={loading}
          >
            مسح السلة
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item: CartItem, index: number) => {
          const menuItem = typeof item.menuItem === 'object' ? item.menuItem : null

          return (
            <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
              {/* Item Info */}
              <div className="flex-1">
                <h4 className="font-semibold">{menuItem?.name || 'منتج'}</h4>
                {item.customizations && (
                  <p className="mt-1 text-gray-600 text-sm">{item.customizations}</p>
                )}
                <p className="mt-1 font-medium text-primary text-sm">{item.price} ر.س</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                  className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
                  disabled={loading || item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 font-medium text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
                  disabled={loading}
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="min-w-[80px] text-right">
                <p className="font-bold">{item.subtotal?.toFixed(2)} ر.س</p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-600 hover:text-red-800"
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* Price Summary */}
      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-gray-600">
          <span>المجموع الفرعي:</span>
          <span>{subtotal.toFixed(2)} ر.س</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>الضريبة (15%):</span>
          <span>{tax.toFixed(2)} ر.س</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>الخصم:</span>
            <span>-{discount.toFixed(2)} ر.س</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t font-bold text-lg">
          <span>الإجمالي:</span>
          <span className="text-primary">{total.toFixed(2)} ر.س</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 mt-6 py-3 rounded-lg w-full font-semibold text-white transition-colors"
        disabled={loading || itemCount === 0}
      >
        إتمام الطلب
      </button>
    </div>
  )
}
