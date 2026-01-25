import React from 'react'
import Link from 'next/link'
import { useCart } from '@/hooks/cart'

interface CartIconProps {
  restaurantId: string
  cartUrl?: string
}

export const CartIcon: React.FC<CartIconProps> = ({ restaurantId, cartUrl = '/cart' }) => {
  const { itemCount, loading } = useCart({ restaurantId, autoLoad: true })

  return (
    <Link
      href={cartUrl}
      className="inline-flex relative items-center hover:bg-gray-100 p-2 rounded-lg transition-colors"
    >
      {/* Cart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {/* Badge */}
      {itemCount > 0 && (
        <span className="-top-1 -right-1 absolute flex justify-center items-center bg-primary rounded-full w-5 h-5 font-bold text-white text-xs">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}

      {/* Loading Indicator */}
      {loading && (
        <span className="-top-1 -right-1 absolute w-5 h-5">
          <span className="inline-flex absolute bg-primary opacity-75 rounded-full w-full h-full animate-ping"></span>
        </span>
      )}
    </Link>
  )
}
