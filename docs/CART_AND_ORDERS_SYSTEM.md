# نظام السلة والطلبات - Shopping Cart & Orders System

## نظرة عامة

تم تطوير نظام شامل لإدارة السلة والطلبات يتضمن:

### المميزات الرئيسية

#### 1. السلة (Cart)
- ✅ إضافة وحذف وتعديل المنتجات
- ✅ دعم المستخدمين الضيوف (Guest Cart)
- ✅ حساب تلقائي للمجموع الفرعي والضريبة والإجمالي
- ✅ إضافة ملاحظات وتخصيصات للمنتجات
- ✅ دعم كوبونات الخصم
- ✅ انتهاء صلاحية السلة بعد 24 ساعة للضيوف
- ✅ تتبع حالة السلة (نشطة، متروكة، محولة لطلب)

#### 2. الطلبات (Orders)
- ✅ إنشاء طلب من السلة
- ✅ أنواع الطلبات (تناول في المطعم، سفري، توصيل)
- ✅ معلومات العميل (الاسم، الجوال، البريد)
- ✅ عنوان التوصيل للطلبات
- ✅ مراحل الطلب المتعددة
- ✅ حالة المطبخ لكل منتج
- ✅ طرق الدفع المتعددة
- ✅ حساب تلقائي للأسعار

## البنية التقنية

### Collections

#### Cart Collection
**المسار:** `src/collections/Cart.ts`

**الحقول الرئيسية:**
```typescript
{
  user?: string           // المستخدم (فارغ للضيوف)
  sessionId?: string      // معرف الجلسة للضيوف
  restaurant: string      // المطعم/الفرع
  items: CartItem[]       // عناصر السلة
  pricing: {              // الأسعار
    subtotal: number
    tax: number
    total: number
  }
  itemCount: number       // عدد المنتجات
  discount: number        // الخصم
  couponCode?: string     // كود الكوبون
  status: string          // الحالة
  expiresAt: Date         // تاريخ الانتهاء
}
```

**CartItem:**
```typescript
{
  menuItem: string        // المنتج من القائمة
  quantity: number        // الكمية
  price: number          // السعر للوحدة
  subtotal: number       // المجموع الفرعي
  customizations?: string // التخصيصات
  specialInstructions?: string // تعليمات خاصة
}
```

#### Orders Collection
**المسار:** `src/collections/Orders.ts`

**المراحل المختلفة للطلب:**
- `pending` - قيد الانتظار
- `confirmed` - مؤكد
- `preparing` - قيد التحضير
- `ready` - جاهز
- `served` - تم التقديم (للمطعم)
- `delivering` - قيد التوصيل
- `completed` - مكتمل
- `cancelled` - ملغي

**حالات الدفع:**
- `pending` - قيد الانتظار
- `paid` - مدفوع
- `partially-paid` - مدفوع جزئياً
- `refunded` - مسترد

**طرق الدفع:**
- `cash` - نقداً
- `credit-card` - بطاقة ائتمان
- `e-wallet` - محفظة إلكترونية
- `bank-transfer` - تحويل بنكي

### Services

#### Cart Service
**المسار:** `src/services/cart.service.ts`

**الوظائف المتاحة:**

```typescript
// الحصول على أو إنشاء سلة
await cartService.getOrCreateCart(restaurantId, sessionId)

// إضافة منتج للسلة
await cartService.addItem(cartId, {
  menuItemId: 'item-id',
  quantity: 2,
  price: 50,
  customizations: 'بدون بصل'
})

// تحديث منتج في السلة
await cartService.updateItem(cartId, {
  itemIndex: 0,
  quantity: 3
})

// حذف منتج من السلة
await cartService.removeItem(cartId, itemIndex)

// مسح السلة
await cartService.clearCart(cartId)

// تطبيق كوبون
await cartService.applyCoupon(cartId, 'DISCOUNT20')

// تحويل السلة لطلب
await cartService.convertToOrder(cartId)

// الحصول على السلة النشطة
await cartService.getActiveCart(restaurantId, sessionId)
```

### React Hooks

#### useCart
**المسار:** `src/hooks/cart/useCart.ts`

**الاستخدام:**
```typescript
const {
  cart,              // بيانات السلة
  loading,           // حالة التحميل
  error,             // الأخطاء
  itemCount,         // عدد المنتجات
  total,             // الإجمالي
  subtotal,          // المجموع الفرعي
  tax,               // الضريبة
  discount,          // الخصم
  // Actions
  loadCart,          // تحميل السلة
  addToCart,         // إضافة منتج
  updateQuantity,    // تحديث الكمية
  removeItem,        // حذف منتج
  clearCart,         // مسح السلة
  applyCoupon,       // تطبيق كوبون
} = useCart({ restaurantId: 'restaurant-id' })
```

#### useCheckout
**المسار:** `src/hooks/cart/useCheckout.ts`

**الاستخدام:**
```typescript
const {
  loading,
  error,
  orderId,
  createOrderFromCart,
  reset,
} = useCheckout()

// إنشاء طلب
await createOrderFromCart({
  cartId: cart.id,
  customer: {
    name: 'أحمد محمد',
    phone: '0501234567',
    email: 'ahmed@example.com'
  },
  orderType: 'delivery',
  deliveryAddress: {
    street: 'شارع الملك فهد',
    city: 'الرياض',
    district: 'العليا',
    notes: 'عمارة رقم 10'
  },
  paymentMethod: 'cash',
  notes: 'الرجاء الاتصال عند الوصول'
})
```

### React Components

#### ShoppingCart
**المسار:** `src/components/cart/ShoppingCart.tsx`

عرض السلة بالكامل مع إمكانية:
- عرض جميع المنتجات
- تعديل الكميات
- حذف المنتجات
- عرض ملخص الأسعار
- زر إتمام الطلب

**الاستخدام:**
```tsx
import { ShoppingCart } from '@/components/cart'

<ShoppingCart restaurantId="restaurant-id" />
```

#### AddToCartButton
**المسار:** `src/components/cart/AddToCartButton.tsx`

زر إضافة للسلة مع نافذة منبثقة لـ:
- اختيار الكمية
- إضافة تخصيصات
- عرض السعر الإجمالي

**الاستخدام:**
```tsx
import { AddToCartButton } from '@/components/cart'

<AddToCartButton
  restaurantId="restaurant-id"
  menuItem={{
    id: 'item-id',
    name: 'برجر لحم',
    price: 35,
    image: '/images/burger.jpg'
  }}
/>
```

#### CheckoutPage
**المسار:** `src/components/cart/CheckoutPage.tsx`

صفحة إتمام الطلب الكاملة مع:
- نموذج معلومات العميل
- اختيار نوع الطلب
- إدخال عنوان التوصيل
- اختيار طريقة الدفع
- ملخص الطلب
- تأكيد الطلب

**الاستخدام:**
```tsx
import { CheckoutPage } from '@/components/cart'

<CheckoutPage restaurantId="restaurant-id" />
```

## مسار العمل (Workflow)

### 1. إضافة منتج للسلة
```
عميل → يختار منتج → يضيف تخصيصات → يحدد الكمية → إضافة للسلة
```

### 2. عرض السلة
```
عرض جميع المنتجات → إمكانية التعديل → عرض الأسعار → زر الدفع
```

### 3. إتمام الطلب
```
تعبئة بيانات العميل → اختيار نوع الطلب → إدخال العنوان (للتوصيل) 
→ اختيار طريقة الدفع → تأكيد الطلب → تحويل السلة لطلب
```

### 4. معالجة الطلب
```
طلب جديد (pending) → تأكيد (confirmed) → تحضير (preparing) 
→ جاهز (ready) → توصيل/تقديم (delivering/served) → مكتمل (completed)
```

## الحسابات التلقائية

### السلة
```typescript
// لكل منتج
item.subtotal = item.price × item.quantity

// للسلة بالكامل
cart.pricing.subtotal = sum(all items subtotals)
cart.pricing.tax = subtotal × 0.15  // ضريبة 15%
cart.pricing.total = subtotal + tax - discount
cart.itemCount = sum(all items quantities)
```

### الطلب
يتم نسخ الحسابات من السلة عند التحويل.

## إدارة الجلسات للضيوف

يتم إنشاء معرف جلسة فريد لكل ضيف:
```typescript
const sessionId = `guest_${Date.now()}_${randomString}`
localStorage.setItem('cart_session_id', sessionId)
```

- يتم حفظ المعرف في localStorage
- يستخدم لربط السلة بالضيف
- تنتهي صلاحيته بعد 24 ساعة

## الصلاحيات والأمان

### Cart Collection
- **القراءة:** الجميع (مع تصفية حسب المستخدم/الجلسة)
- **الإنشاء:** الجميع
- **التحديث:** المالك فقط
- **الحذف:** المالك فقط

### Orders Collection
- **القراءة:** Admin يرى الكل، الموظفون يرون طلبات مطعمهم
- **الإنشاء:** الجميع (للعملاء الجدد) أو بصلاحية
- **التحديث:** Admin أو موظفون بصلاحية لمطعمهم
- **الحذف:** Admin فقط

## التكامل مع المخزون

عند تأكيد الطلب (`status = 'confirmed'`)، يتم:
1. استنزاف المخزون من ProductRecipes
2. إرسال إشعار للمطبخ
3. بدء تتبع الطلب

## التطويرات المستقبلية

- [ ] نظام الكوبونات والخصومات
- [ ] تتبع الطلب في الوقت الفعلي
- [ ] إشعارات push للعملاء
- [ ] تقييم الطلب بعد الاستلام
- [ ] برنامج نقاط الولاء
- [ ] دعم الطلبات المجدولة
- [ ] طلبات متعددة لنفس الطاولة

## الملفات المنشأة

```
src/
├── collections/
│   └── Cart.ts                     ✅ جديد
├── services/
│   └── cart.service.ts             ✅ جديد
├── hooks/
│   └── cart/
│       ├── index.ts                ✅ جديد
│       ├── useCart.ts              ✅ جديد
│       └── useCheckout.ts          ✅ جديد
└── components/
    └── cart/
        ├── index.ts                ✅ جديد
        ├── ShoppingCart.tsx        ✅ جديد
        ├── CheckoutPage.tsx        ✅ جديد
        └── AddToCartButton.tsx     ✅ جديد
```

## التحديثات على الملفات الموجودة

```
src/
├── payload.config.ts               ✅ تم التحديث (إضافة Cart)
└── services/
    └── index.ts                    ✅ تم التحديث (تصدير cart.service)
```

## الاستخدام في التطبيق

### مثال صفحة القائمة
```tsx
import { AddToCartButton } from '@/components/cart'

export default function MenuPage() {
  const menuItems = [...] // من API
  
  return (
    <div>
      {menuItems.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price} ر.س</p>
          <AddToCartButton 
            restaurantId="branch-1"
            menuItem={item}
          />
        </div>
      ))}
    </div>
  )
}
```

### مثال صفحة السلة
```tsx
import { ShoppingCart } from '@/components/cart'

export default function CartPage() {
  return (
    <div>
      <ShoppingCart restaurantId="branch-1" />
    </div>
  )
}
```

### مثال صفحة الدفع
```tsx
import { CheckoutPage } from '@/components/cart'

export default function Checkout() {
  return <CheckoutPage restaurantId="branch-1" />
}
```

---

تم إنشاء نظام شامل ومتكامل لإدارة السلة والطلبات! 🎉
