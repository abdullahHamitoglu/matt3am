import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/cart'
import { useCheckout, type CreateOrderFromCartParams } from '@/hooks/cart'

interface CheckoutPageProps {
  restaurantId: string
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ restaurantId }) => {
  const router = useRouter()
  const { cart, itemCount, total } = useCart({ restaurantId })
  const { loading, error, orderId, createOrderFromCart } = useCheckout()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    orderType: 'dine-in' as 'dine-in' | 'takeaway' | 'delivery',
    tableId: '',
    street: '',
    city: '',
    district: '',
    addressNotes: '',
    paymentMethod: 'cash' as 'cash' | 'credit-card' | 'e-wallet' | 'bank-transfer',
    notes: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cart?.id) {
      alert('السلة فارغة')
      return
    }

    try {
      const orderParams: CreateOrderFromCartParams = {
        cartId: cart.id,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
        },
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
      }

      if (formData.orderType === 'dine-in' && formData.tableId) {
        orderParams.tableId = formData.tableId
      }

      if (formData.orderType === 'delivery') {
        orderParams.deliveryAddress = {
          street: formData.street,
          city: formData.city,
          district: formData.district,
          notes: formData.addressNotes || undefined,
        }
      }

      const order = await createOrderFromCart(orderParams)

      // Redirect to order confirmation page
      router.push(`/orders/${order.id}`)
    } catch (err) {
      console.error('Checkout error:', err)
    }
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="mx-auto p-8 max-w-2xl text-center">
        <div className="mb-4 text-6xl">🛒</div>
        <h3 className="mb-2 font-semibold text-lg">السلة فارغة</h3>
        <p className="mb-4 text-gray-500">أضف عناصر من القائمة لتبدأ الطلب</p>
        <button
          onClick={() => router.push('/menu')}
          className="bg-primary px-6 py-2 rounded-lg text-white"
        >
          تصفح القائمة
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto p-6 max-w-4xl">
      <h1 className="mb-8 font-bold text-3xl">إتمام الطلب</h1>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white shadow p-6 rounded-lg">
              <h2 className="mb-4 font-semibold text-xl">معلومات العميل</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    الاسم <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                  />
                </div>
              </div>
            </div>

            {/* Order Type */}
            <div className="bg-white shadow p-6 rounded-lg">
              <h2 className="mb-4 font-semibold text-xl">نوع الطلب</h2>
              <div className="space-y-4">
                <div>
                  <select
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleInputChange}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                  >
                    <option value="dine-in">تناول في المطعم</option>
                    <option value="takeaway">سفري</option>
                    <option value="delivery">توصيل</option>
                  </select>
                </div>

                {formData.orderType === 'delivery' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">عنوان التوصيل</h3>
                    <div>
                      <label className="block mb-1 font-medium text-sm">الشارع</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required={formData.orderType === 'delivery'}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="gap-4 grid grid-cols-2">
                      <div>
                        <label className="block mb-1 font-medium text-sm">المدينة</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required={formData.orderType === 'delivery'}
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium text-sm">الحي</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required={formData.orderType === 'delivery'}
                          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-sm">ملاحظات العنوان</label>
                      <textarea
                        name="addressNotes"
                        value={formData.addressNotes}
                        onChange={handleInputChange}
                        rows={2}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow p-6 rounded-lg">
              <h2 className="mb-4 font-semibold text-xl">طريقة الدفع</h2>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
              >
                <option value="cash">نقداً</option>
                <option value="credit-card">بطاقة ائتمان</option>
                <option value="e-wallet">محفظة إلكترونية</option>
                <option value="bank-transfer">تحويل بنكي</option>
              </select>
            </div>

            {/* Notes */}
            <div className="bg-white shadow p-6 rounded-lg">
              <h2 className="mb-4 font-semibold text-xl">ملاحظات إضافية</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="أي ملاحظات خاصة بطلبك..."
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary w-full"
              />
            </div>

            {error && (
              <div className="bg-red-50 p-4 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 py-3 rounded-lg w-full font-semibold text-white transition-colors"
            >
              {loading ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="top-6 sticky bg-white shadow p-6 rounded-lg">
            <h2 className="mb-4 font-semibold text-xl">ملخص الطلب</h2>
            <div className="space-y-3 mb-6">
              {cart.items.map((item: any, index: number) => {
                const menuItem = typeof item.menuItem === 'object' ? item.menuItem : null
                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {menuItem?.name || 'منتج'}
                    </span>
                    <span>{item.subtotal?.toFixed(2)} ر.س</span>
                  </div>
                )
              })}
            </div>
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>المجموع الفرعي:</span>
                <span>{cart.pricing.subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>الضريبة:</span>
                <span>{cart.pricing.tax.toFixed(2)} ر.س</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>الخصم:</span>
                  <span>-{cart.discount.toFixed(2)} ر.س</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t font-bold text-lg">
                <span>الإجمالي:</span>
                <span className="text-primary">{total.toFixed(2)} ر.س</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
