// مثال كامل لاستخدام نظام السلة والطلبات في تطبيق Next.js

// ============================================
// 1. صفحة القائمة - عرض المنتجات مع زر الإضافة
// ============================================
// app/[locale]/menu/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { AddToCartButton } from '@/components/cart'
import { menuItemsService } from '@/services'

export default function MenuPage({ params }: { params: { locale: string } }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const restaurantId = 'your-restaurant-id' // من الكونتكست أو البروبس

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await menuItemsService.list({
          where: { restaurant: { equals: restaurantId } },
        })
        setMenuItems(response.docs)
      } catch (error) {
        console.error('Failed to load menu:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMenu()
  }, [restaurantId])

  if (loading) return <div>جاري التحميل...</div>

  return (
    <div className="mx-auto py-8 container">
      <h1 className="mb-8 font-bold text-3xl">القائمة</h1>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item: any) => (
          <div key={item.id} className="shadow-lg border rounded-lg overflow-hidden">
            {item.image && (
              <img
                src={typeof item.image === 'string' ? item.image : item.image.url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="mb-2 font-semibold text-xl">{item.name}</h3>
              <p className="mb-4 text-gray-600">{item.description}</p>

              <div className="flex justify-between items-center">
                <span className="font-bold text-primary text-2xl">{item.price} ر.س</span>

                <AddToCartButton
                  restaurantId={restaurantId}
                  menuItem={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: typeof item.image === 'object' ? item.image.url : item.image,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 2. Header مع أيقونة السلة
// ============================================
// components/header/MainHeader.tsx

;('use client')

import Link from 'next/link'
import { CartIcon } from '@/components/cart'

export default function MainHeader() {
  const restaurantId = 'your-restaurant-id' // من الكونتكست

  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto px-4 container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl">
            مطعمي
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link href="/menu" className="hover:text-primary">
              القائمة
            </Link>
            <Link href="/reservations" className="hover:text-primary">
              الحجوزات
            </Link>
            <Link href="/about" className="hover:text-primary">
              من نحن
            </Link>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <CartIcon restaurantId={restaurantId} cartUrl="/cart" />

            <Link href="/login" className="bg-primary px-4 py-2 rounded-lg text-white">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

// ============================================
// 3. صفحة السلة
// ============================================
// app/[locale]/cart/page.tsx

;('use client')

import { ShoppingCart } from '@/components/cart'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  const restaurantId = 'your-restaurant-id'

  return (
    <div className="mx-auto py-8 container">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-3xl">سلة التسوق</h1>
          <button onClick={() => router.push('/menu')} className="text-primary hover:underline">
            ← العودة للقائمة
          </button>
        </div>

        <ShoppingCart restaurantId={restaurantId} />
      </div>
    </div>
  )
}

// ============================================
// 4. صفحة الدفع
// ============================================
// app/[locale]/checkout/page.tsx

;('use client')

import { CheckoutPage } from '@/components/cart'

export default function Checkout() {
  const restaurantId = 'your-restaurant-id'

  return <CheckoutPage restaurantId={restaurantId} />
}

// ============================================
// 5. صفحة تتبع الطلب
// ============================================
// app/[locale]/orders/[id]/page.tsx

;('use client')

import { OrderTracking } from '@/components/orders'
import Link from 'next/link'

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto py-8 container">
      <div className="mx-auto max-w-3xl">
        <Link href="/orders" className="inline-block mb-6 text-primary hover:underline">
          ← العودة لقائمة الطلبات
        </Link>

        <OrderTracking orderId={params.id} />
      </div>
    </div>
  )
}

// ============================================
// 6. صفحة قائمة الطلبات (للمستخدم)
// ============================================
// app/[locale]/orders/page.tsx

;('use client')

import { useState, useEffect } from 'react'
import { ordersService } from '@/services'
import Link from 'next/link'

export default function OrdersListPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await ordersService.list({
          sort: '-createdAt',
          limit: 20,
        })
        setOrders(response.docs)
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  if (loading) {
    return <div className="py-8 text-center">جاري التحميل...</div>
  }

  return (
    <div className="mx-auto py-8 container">
      <h1 className="mb-8 font-bold text-3xl">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">لا توجد طلبات</p>
          <Link href="/menu" className="inline-block bg-primary px-6 py-2 rounded-lg text-white">
            تصفح القائمة
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white shadow hover:shadow-lg p-6 rounded-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="mb-2 font-bold text-lg">طلب رقم {order.orderNumber}</h3>
                  <p className="mb-2 text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {order.orderType === 'dine-in' && '🍽️ تناول في المطعم'}
                      {order.orderType === 'takeaway' && '🥡 سفري'}
                      {order.orderType === 'delivery' && '🚗 توصيل'}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-2xl">
                    {order.pricing?.total?.toFixed(2)} ر.س
                  </p>
                  <p className="text-gray-600 text-sm">{order.items?.length || 0} منتج</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// 7. استخدام متقدم - مكون مخصص للسلة
// ============================================
// components/custom/MiniCart.tsx

;('use client')

import { useCart } from '@/hooks/cart'
import { useState } from 'react'

export function MiniCart({ restaurantId }: { restaurantId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, itemCount, total, removeItem, updateQuantity } = useCart({
    restaurantId,
  })

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-gray-100 p-2 rounded-lg"
      >
        🛒
        {itemCount > 0 && (
          <span className="-top-1 -right-1 absolute flex justify-center items-center bg-red-500 rounded-full w-5 h-5 text-white text-xs">
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="left-0 z-50 absolute bg-white shadow-xl mt-2 rounded-lg w-80">
          <div className="p-4 border-b">
            <h3 className="font-bold">سلة التسوق</h3>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            {cart?.items?.length === 0 ? (
              <p className="py-8 text-gray-500 text-center">السلة فارغة</p>
            ) : (
              <div className="space-y-3">
                {cart?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {typeof item.menuItem === 'object' ? item.menuItem.name : 'منتج'}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {item.quantity} × {item.price} ر.س
                      </p>
                    </div>
                    <button onClick={() => removeItem(index)} className="text-red-500 text-xs">
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {itemCount > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-bold">الإجمالي:</span>
                <span className="font-bold text-primary">{total.toFixed(2)} ر.س</span>
              </div>
              <a
                href="/checkout"
                className="block bg-primary hover:bg-primary-dark py-2 rounded-lg w-full text-white text-center"
              >
                إتمام الطلب
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// 8. Context Provider للمطعم (اختياري)
// ============================================
// contexts/RestaurantContext.tsx

;('use client')

import { createContext, useContext, ReactNode } from 'react'

interface RestaurantContextType {
  restaurantId: string
  restaurantName: string
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({
  children,
  restaurantId,
  restaurantName,
}: {
  children: ReactNode
  restaurantId: string
  restaurantName: string
}) {
  return (
    <RestaurantContext.Provider value={{ restaurantId, restaurantName }}>
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider')
  }
  return context
}

// الاستخدام في layout:
// app/[locale]/layout.tsx
/*
import { RestaurantProvider } from '@/contexts/RestaurantContext'

export default function LocaleLayout({ children }) {
  return (
    <RestaurantProvider
      restaurantId="restaurant-123"
      restaurantName="مطعم الذوق"
    >
      {children}
    </RestaurantProvider>
  )
}
*/

// ثم في المكونات:
/*
import { useRestaurant } from '@/contexts/RestaurantContext'

function MyComponent() {
  const { restaurantId } = useRestaurant()
  return <CartIcon restaurantId={restaurantId} />
}
*/
