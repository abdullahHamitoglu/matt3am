# دليل الاستخدام السريع - نظام السلة والطلبات

## البداية السريعة

### 1. إضافة أيقونة السلة في الهيدر

```tsx
// في ملف Header أو Navbar
import { CartIcon } from '@/components/cart'

export default function Header() {
  return (
    <header>
      {/* ... باقي عناصر الهيدر */}
      <CartIcon restaurantId="your-restaurant-id" />
    </header>
  )
}
```

### 2. عرض المنتجات مع زر الإضافة للسلة

```tsx
import { AddToCartButton } from '@/components/cart'

export default function MenuPage({ menuItems }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {menuItems.map(item => (
        <div key={item.id} className="border rounded-lg p-4">
          <img src={item.image} alt={item.name} />
          <h3>{item.name}</h3>
          <p>{item.price} ر.س</p>
          
          <AddToCartButton
            restaurantId="your-restaurant-id"
            menuItem={{
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image
            }}
          />
        </div>
      ))}
    </div>
  )
}
```

### 3. صفحة السلة

```tsx
// app/cart/page.tsx
import { ShoppingCart } from '@/components/cart'

export default function CartPage() {
  return (
    <div className="container mx-auto py-8">
      <ShoppingCart restaurantId="your-restaurant-id" />
    </div>
  )
}
```

### 4. صفحة الدفع

```tsx
// app/checkout/page.tsx
import { CheckoutPage } from '@/components/cart'

export default function Checkout() {
  return (
    <div className="container mx-auto">
      <CheckoutPage restaurantId="your-restaurant-id" />
    </div>
  )
}
```

### 5. صفحة تتبع الطلب

```tsx
// app/orders/[id]/page.tsx
import { OrderTracking } from '@/components/orders'

export default function OrderPage({ params }) {
  return (
    <div className="container mx-auto py-8">
      <OrderTracking orderId={params.id} />
    </div>
  )
}
```

## استخدام متقدم

### استخدام Hook السلة مباشرة

```tsx
'use client'
import { useCart } from '@/hooks/cart'

export default function CustomCartComponent() {
  const {
    cart,
    loading,
    itemCount,
    total,
    addToCart,
    removeItem,
    updateQuantity,
  } = useCart({ restaurantId: 'your-restaurant-id' })

  const handleAdd = async () => {
    await addToCart({
      menuItemId: 'item-123',
      quantity: 2,
      price: 50,
      customizations: 'بدون بصل'
    })
  }

  return (
    <div>
      <p>عدد المنتجات: {itemCount}</p>
      <p>الإجمالي: {total} ر.س</p>
      <button onClick={handleAdd}>إضافة منتج</button>
    </div>
  )
}
```

### استخدام Hook الدفع

```tsx
'use client'
import { useCheckout } from '@/hooks/cart'

export default function CustomCheckout({ cartId }) {
  const { loading, error, orderId, createOrderFromCart } = useCheckout()

  const handleCheckout = async () => {
    try {
      await createOrderFromCart({
        cartId,
        customer: {
          name: 'أحمد محمد',
          phone: '0501234567',
        },
        orderType: 'delivery',
        deliveryAddress: {
          street: 'شارع الملك فهد',
          city: 'الرياض',
          district: 'العليا',
        },
        paymentMethod: 'cash',
      })
      
      // التوجيه لصفحة الطلب
      router.push(`/orders/${orderId}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'جاري التأكيد...' : 'تأكيد الطلب'}
    </button>
  )
}
```

## API الخدمات

### Cart Service

```typescript
import { cartService } from '@/services/cart.service'

// إنشاء/الحصول على سلة
const cart = await cartService.getOrCreateCart('restaurant-id', 'session-id')

// إضافة منتج
await cartService.addItem(cartId, {
  menuItemId: 'item-id',
  quantity: 2,
  price: 50
})

// تحديث كمية
await cartService.updateItem(cartId, {
  itemIndex: 0,
  quantity: 3
})

// حذف منتج
await cartService.removeItem(cartId, 0)

// مسح السلة
await cartService.clearCart(cartId)

// تطبيق كوبون
await cartService.applyCoupon(cartId, 'SUMMER20')
```

### Orders Service

```typescript
import { ordersService } from '@/services/orders.service'

// الحصول على طلب
const order = await ordersService.getById('order-id')

// تحديث حالة الطلب
await ordersService.update('order-id', {
  status: 'confirmed'
})

// الحصول على طلبات مطعم
const orders = await ordersService.list({
  where: {
    restaurant: { equals: 'restaurant-id' }
  }
})
```

## التخصيص

### تخصيص الألوان والأنماط

يمكنك تخصيص المكونات باستخدام className:

```tsx
<AddToCartButton 
  className="bg-blue-600 hover:bg-blue-700"
  menuItem={item}
  restaurantId="id"
/>
```

### تخصيص معدل الضريبة

في [Cart.ts](../../src/collections/Cart.ts#L186):

```typescript
// تغيير معدل الضريبة من 15% إلى 5%
const taxRate = 0.05
const tax = subtotal * taxRate
```

### تخصيص مدة انتهاء السلة

في [Cart.ts](../../src/collections/Cart.ts#L172):

```typescript
// تغيير من 24 ساعة إلى 48 ساعة
expirationDate.setHours(expirationDate.getHours() + 48)
```

## نصائح مهمة

### 1. معرف المطعم
تأكد من تمرير `restaurantId` الصحيح لجميع المكونات والـ Hooks.

### 2. الجلسات للضيوف
يتم إدارة الجلسات تلقائياً باستخدام cookies. لا حاجة لإدارة يدوية.

### 3. التحديث التلقائي
مكون OrderTracking يقوم بالتحديث التلقائي كل 30 ثانية.

### 4. حسابات الأسعار
جميع حسابات الأسعار تتم تلقائياً في الـ Backend.

### 5. الصلاحيات
السلة متاحة للجميع، الطلبات محمية بصلاحيات.

## استكشاف الأخطاء

### السلة لا تظهر
- تحقق من `restaurantId`
- تحقق من اتصال API
- افحص console للأخطاء

### لا يمكن إضافة منتج
- تحقق من بيانات المنتج
- تحقق من السعر (يجب أن يكون رقم)
- تحقق من الصلاحيات

### الطلب لا يتم إنشاؤه
- تحقق من ملء جميع الحقول المطلوبة
- تحقق من بيانات العميل
- راجع errors في response

## الدعم

للمزيد من المعلومات، راجع:
- [التوثيق الكامل](./CART_AND_ORDERS_SYSTEM.md)
- [Payload CMS Docs](https://payloadcms.com/docs)
- [API Reference](../services/)
