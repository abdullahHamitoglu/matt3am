import React, { useState } from 'react'
import { useCart } from '@/hooks/cart'

interface AddToCartButtonProps {
  restaurantId: string
  menuItem: {
    id: string
    name: string
    price: number
    image?: string
  }
  className?: string
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  restaurantId,
  menuItem,
  className = '',
}) => {
  const { addToCart, loading } = useCart({ restaurantId })
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const handleAddToCart = async () => {
    try {
      await addToCart({
        menuItemId: menuItem.id,
        quantity,
        price: menuItem.price,
        customizations: customizations || undefined,
      })

      // Reset form
      setQuantity(1)
      setCustomizations('')
      setShowDetails(false)

      // Show success message (you can use a toast library)
      alert('تمت الإضافة إلى السلة بنجاح!')
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('حدث خطأ أثناء الإضافة إلى السلة')
    }
  }

  if (showDetails) {
    return (
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-xl">{menuItem.name}</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {menuItem.image && (
            <img
              src={menuItem.image}
              alt={menuItem.name}
              className="mb-4 rounded-lg w-full h-48 object-cover"
            />
          )}

          <p className="mb-4 font-bold text-primary text-2xl">{menuItem.price} ر.س</p>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-sm">الكمية</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 font-bold"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 font-semibold text-xl text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full w-10 h-10 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Customizations */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-sm">ملاحظات خاصة (اختياري)</label>
            <textarea
              value={customizations}
              onChange={(e) => setCustomizations(e.target.value)}
              placeholder="مثال: بدون بصل، إضافة جبن..."
              rows={3}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
            />
          </div>

          {/* Total Price */}
          <div className="flex justify-between items-center bg-gray-50 mb-4 p-4 rounded-lg">
            <span className="font-medium">الإجمالي:</span>
            <span className="font-bold text-primary text-xl">
              {(menuItem.price * quantity).toFixed(2)} ر.س
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark disabled:opacity-50 py-3 rounded-lg w-full font-semibold text-white transition-colors"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowDetails(true)}
      className={`bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors ${className}`}
    >
      إضافة إلى السلة
    </button>
  )
}
