import React, { useEffect, useState } from 'react'
import { ordersService } from '@/services/orders.service'

interface OrderStatus {
  status: string
  label: string
  completed: boolean
  current: boolean
}

interface OrderTrackingProps {
  orderId: string
}

const ORDER_STATUSES = {
  pending: { label: 'قيد الانتظار', icon: '⏳' },
  confirmed: { label: 'تم التأكيد', icon: '✅' },
  preparing: { label: 'قيد التحضير', icon: '👨‍🍳' },
  ready: { label: 'جاهز', icon: '🍽️' },
  served: { label: 'تم التقديم', icon: '✨' },
  delivering: { label: 'قيد التوصيل', icon: '🚗' },
  completed: { label: 'مكتمل', icon: '🎉' },
  cancelled: { label: 'ملغي', icon: '❌' },
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await ordersService.getById(orderId)
        setOrder(orderData)
      } catch (err) {
        setError('فشل تحميل بيانات الطلب')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOrder, 30000)
    return () => clearInterval(interval)
  }, [orderId])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="border-primary border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 p-4 border border-red-200 rounded-lg text-red-600">
        {error || 'لم يتم العثور على الطلب'}
      </div>
    )
  }

  const currentStatus = order.status
  const orderType = order.orderType

  // Define status flow based on order type
  const getStatusFlow = (): string[] => {
    const baseFlow = ['pending', 'confirmed', 'preparing', 'ready']

    if (orderType === 'delivery') {
      return [...baseFlow, 'delivering', 'completed']
    } else if (orderType === 'dine-in') {
      return [...baseFlow, 'served', 'completed']
    } else {
      // takeaway
      return [...baseFlow, 'completed']
    }
  }

  const statusFlow = getStatusFlow()
  const currentIndex = statusFlow.indexOf(currentStatus)

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      {/* Order Header */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="mb-2 font-bold text-2xl">طلب رقم {order.orderNumber}</h2>
            <p className="text-gray-600">
              {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="mb-2 text-3xl">
              {ORDER_STATUSES[currentStatus as keyof typeof ORDER_STATUSES]?.icon || '📦'}
            </div>
            <span className="inline-block bg-primary px-4 py-2 rounded-full font-semibold text-white text-sm">
              {ORDER_STATUSES[currentStatus as keyof typeof ORDER_STATUSES]?.label || currentStatus}
            </span>
          </div>
        </div>

        {/* Order Type & Total */}
        <div className="flex gap-4 text-sm">
          <div className="bg-gray-100 px-3 py-1 rounded">
            {orderType === 'dine-in' && '🍽️ تناول في المطعم'}
            {orderType === 'takeaway' && '🥡 سفري'}
            {orderType === 'delivery' && '🚗 توصيل'}
          </div>
          <div className="bg-primary bg-opacity-10 px-3 py-1 rounded font-bold text-primary">
            {order.pricing?.total?.toFixed(2)} ر.س
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <h3 className="mb-4 font-semibold">مراحل الطلب</h3>
        <div className="relative">
          {statusFlow.map((status, index) => {
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex
            const isLast = index === statusFlow.length - 1

            return (
              <div key={status} className="relative">
                <div className="flex items-center mb-4">
                  {/* Status Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-primary ring-opacity-30' : ''}`}
                  >
                    {ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.icon || '📦'}
                  </div>

                  {/* Status Label */}
                  <div className="ml-4">
                    <p
                      className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      {ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.label || status}
                    </p>
                    {isCurrent && <p className="text-primary text-sm">الحالة الحالية</p>}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute right-5 top-10 w-0.5 h-8 ${
                      isCompleted ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6 pb-6 border-b">
        <h3 className="mb-4 font-semibold">عناصر الطلب</h3>
        <div className="space-y-3">
          {order.items?.map((item: any, index: number) => {
            const menuItem = typeof item.menuItem === 'object' ? item.menuItem : null
            return (
              <div
                key={index}
                className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{menuItem?.name || 'منتج'}</p>
                  {item.customizations && (
                    <p className="mt-1 text-gray-600 text-sm">{item.customizations}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-sm">الكمية: {item.quantity}</span>
                    {item.kitchenStatus && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.kitchenStatus === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : item.kitchenStatus === 'preparing'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.kitchenStatus === 'pending' && 'قيد الانتظار'}
                        {item.kitchenStatus === 'preparing' && 'قيد التحضير'}
                        {item.kitchenStatus === 'ready' && 'جاهز'}
                        {item.kitchenStatus === 'served' && 'تم التقديم'}
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-semibold">{item.subtotal?.toFixed(2)} ر.س</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 pb-6 border-b">
        <h3 className="mb-4 font-semibold">معلومات العميل</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-600">الاسم:</span>{' '}
            <span className="font-medium">{order.customer?.name}</span>
          </p>
          <p>
            <span className="text-gray-600">الجوال:</span>{' '}
            <span className="font-medium">{order.customer?.phone}</span>
          </p>
          {order.customer?.email && (
            <p>
              <span className="text-gray-600">البريد:</span>{' '}
              <span className="font-medium">{order.customer.email}</span>
            </p>
          )}
        </div>
      </div>

      {/* Delivery Address */}
      {orderType === 'delivery' && order.deliveryAddress && (
        <div className="mb-6 pb-6 border-b">
          <h3 className="mb-4 font-semibold">عنوان التوصيل</h3>
          <div className="text-sm">
            <p>{order.deliveryAddress.street}</p>
            <p>
              {order.deliveryAddress.district}, {order.deliveryAddress.city}
            </p>
            {order.deliveryAddress.notes && (
              <p className="mt-2 text-gray-600">{order.deliveryAddress.notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Payment Info */}
      <div>
        <h3 className="mb-4 font-semibold">معلومات الدفع</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">طريقة الدفع</p>
            <p className="font-medium">
              {order.paymentMethod === 'cash' && 'نقداً'}
              {order.paymentMethod === 'credit-card' && 'بطاقة ائتمان'}
              {order.paymentMethod === 'e-wallet' && 'محفظة إلكترونية'}
              {order.paymentMethod === 'bank-transfer' && 'تحويل بنكي'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm">حالة الدفع</p>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                order.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : order.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              {order.paymentStatus === 'paid' && 'مدفوع'}
              {order.paymentStatus === 'pending' && 'قيد الانتظار'}
              {order.paymentStatus === 'partially-paid' && 'مدفوع جزئياً'}
              {order.paymentStatus === 'refunded' && 'مسترد'}
            </span>
          </div>
        </div>
      </div>

      {/* Estimated Time */}
      {order.estimatedTime && currentStatus !== 'completed' && (
        <div className="bg-primary bg-opacity-10 mt-6 p-4 rounded-lg text-center">
          <p className="mb-1 text-gray-600 text-sm">الوقت المتوقع</p>
          <p className="font-bold text-primary text-2xl">{order.estimatedTime} دقيقة</p>
        </div>
      )}
    </div>
  )
}
