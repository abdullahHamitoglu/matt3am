# API Messages Localization Guide

## نظام ترجمة رسائل الـ API

تم إنشاء نظام موحد لترجمة جميع رسائل الـ API (رسائل النجاح والأخطاء) إلى اللغات الثلاث المدعومة: العربية، الإنجليزية، والتركية.

## الملفات الأساسية

- **`src/lib/api-messages.ts`**: ملف الرسائل المترجمة والدوال المساعدة

## كيفية الاستخدام

### 1. في API Routes

```typescript
import { getApiMessage } from '@/lib/api-messages'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // الحصول على اللغة من header أو query parameter
  const locale = request.headers.get('x-locale') || 
                 request.nextUrl.searchParams.get('locale') || 
                 'ar'

  try {
    // ... your code

    if (!user) {
      return NextResponse.json(
        { error: getApiMessage('unauthorized', locale) },
        { status: 401 }
      )
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: getApiMessage('forbidden', locale) },
        { status: 403 }
      )
    }

    // Success
    return NextResponse.json({ 
      message: getApiMessage('success', locale),
      data: result 
    })

  } catch (error) {
    return NextResponse.json(
      { error: getApiMessage('internalError', locale) },
      { status: 500 }
    )
  }
}
```

### 2. استخدام createErrorResponse

دالة مساعدة لإنشاء استجابة خطأ كاملة:

```typescript
import { createErrorResponse } from '@/lib/api-messages'

export async function POST(request: NextRequest) {
  const locale = request.headers.get('x-locale') || 'ar'

  try {
    // ... validation

    if (quantity < 1) {
      const error = createErrorResponse(
        'invalidQuantity',
        locale,
        400,
        { field: 'quantity', min: 1 }
      )
      return NextResponse.json(error, { status: error.statusCode })
    }

  } catch (error) {
    const errorResponse = createErrorResponse('internalError', locale, 500)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}
```

### 3. إضافة رسائل جديدة

لإضافة رسائل جديدة، قم بتحديث ملف `src/lib/api-messages.ts`:

```typescript
interface Messages {
  // ... existing messages
  
  // رسائل جديدة
  orderCancelled: string
  refundProcessed: string
}

const messages: Record<Locale, Messages> = {
  ar: {
    // ... existing messages
    orderCancelled: 'تم إلغاء الطلب بنجاح',
    refundProcessed: 'تمت معالجة استرداد الأموال',
  },
  en: {
    // ... existing messages
    orderCancelled: 'Order cancelled successfully',
    refundProcessed: 'Refund processed successfully',
  },
  tr: {
    // ... existing messages
    orderCancelled: 'Sipariş başarıyla iptal edildi',
    refundProcessed: 'İade işlendi',
  },
}
```

## الرسائل المتاحة حالياً

### رسائل المصادقة
- `unauthorized` - غير مصرح / Unauthorized / Yetkisiz
- `accountInactive` - الحساب غير نشط / Account is inactive / Hesap etkin değil
- `invalidCredentials` - بيانات الدخول غير صحيحة / Invalid credentials / Geçersiz kimlik

### رسائل المطاعم
- `noRestaurantsAssigned` - لا توجد مطاعم مخصصة / No restaurants assigned / Atanmış restoran yok
- `forbidden` - ممنوع - ليس لديك صلاحية الوصول / Forbidden / Yasak

### رسائل السلة
- `cartNotFound` - السلة غير موجودة / Cart not found / Sepet bulunamadı
- `itemNotFound` - المنتج غير موجود / Item not found / Ürün bulunamadı
- `invalidQuantity` - الكمية غير صحيحة / Invalid quantity / Geçersiz miktar
- `cartExpired` - انتهت صلاحية السلة / Cart has expired / Sepet süresi doldu

### رسائل الطلبات
- `orderNotFound` - الطلب غير موجود / Order not found / Sipariş bulunamadı
- `orderCreationFailed` - فشل إنشاء الطلب / Failed to create order / Sipariş oluşturulamadı
- `invalidOrderType` - نوع الطلب غير صحيح / Invalid order type / Geçersiz sipariş türü

### رسائل عامة
- `internalError` - حدث خطأ داخلي / Internal server error / İç sunucu hatası
- `validationError` - خطأ في البيانات المدخلة / Validation error / Doğrulama hatası
- `notFound` - غير موجود / Not found / Bulunamadı
- `badRequest` - طلب غير صحيح / Bad request / Hatalı istek

### رسائل النجاح
- `success` - تمت العملية بنجاح / Success / Başarılı
- `orderCreated` - تم إنشاء الطلب بنجاح / Order created successfully / Sipariş oluşturuldu
- `cartUpdated` - تم تحديث السلة بنجاح / Cart updated successfully / Sepet güncellendi

## أمثلة من الكود الحالي

تم تطبيق هذا النظام على:

1. **`/api/analytics/stats`** - إحصائيات لوحة التحكم
2. **`/api/analytics/revenue`** - بيانات الإيرادات

## تمرير اللغة للـ API

يمكن تمرير اللغة بثلاث طرق:

### 1. عبر Header
```typescript
fetch('/api/analytics/stats', {
  headers: {
    'x-locale': 'ar'
  }
})
```

### 2. عبر Query Parameter
```typescript
fetch('/api/analytics/stats?locale=en')
```

### 3. في الـ Service
```typescript
// في analytics.service.ts
async getDashboardStats(restaurantId?: string, locale?: string) {
  const params = new URLSearchParams()
  if (locale) params.append('locale', locale)
  // ...
}
```

## أفضل الممارسات

1. **دائماً استخدم `getApiMessage`** بدلاً من كتابة النصوص مباشرة
2. **مرر اللغة من الـ request** لضمان التوافق مع اختيار المستخدم
3. **أضف رسائل جديدة للغات الثلاث** عند إضافة features جديدة
4. **استخدم مفاتيح واضحة** للرسائل (مثل `orderCreated` بدلاً من `msg1`)
5. **وثّق الرسائل الجديدة** في هذا الملف

## الدمج مع Payload CMS

نظام الترجمة هذا يعمل جنباً إلى جنب مع نظام localization في Payload:

```typescript
// في payload.config.ts
localization: {
  locales: [
    { label: 'العربية', code: 'ar', rtl: true },
    { label: 'English', code: 'en' },
    { label: 'Türkçe', code: 'tr' },
  ],
  defaultLocale: 'ar',
  fallback: true,
}
```

عند استدعاء Payload API:
```typescript
await payload.find({
  collection: 'orders',
  locale: locale as 'ar' | 'en' | 'tr',
  fallbackLocale: false, // أو 'en' للـ fallback
})
```

## الخطوات التالية

- [ ] تطبيق النظام على باقي API routes
- [ ] إضافة رسائل للـ Cart API
- [ ] إضافة رسائل للـ Orders API
- [ ] إضافة رسائل للـ Auth API
- [ ] دمج مع نظام الإشعارات (Toast notifications)
