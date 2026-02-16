# Restaurant Management System

نظام إدارة شامل للمطاعم مع جميع الميزات المطلوبة.

## المكونات

### 1. صفحة القائمة الرئيسية
- **المسار**: `/dashboard/restaurants`
- **المكون**: `RestaurantsContent`
- **الميزات**:
  - عرض جميع المطاعم في جدول أو شبكة
  - البحث حسب الاسم، المدينة، أو الحي
  - التبديل بين عرض الجدول والبطاقات
  - إضافة مطعم جديد
  - تعديل أو حذف أو عرض التفاصيل

### 2. صفحة إضافة مطعم
- **المسار**: `/dashboard/restaurants/create`
- **المكون**: `RestaurantForm`
- **الحقول**:
  - **معلومات أساسية**: اسم الفرع، المدينة، الحي، العنوان
  - **معلومات الموقع**: خط العرض والطول
  - **معلومات التواصل**: الهاتف، البريد الإلكتروني
  - **ساعات العمل**: وقت الافتتاح/الإغلاق، أيام العطل
  - **الميزات**: خدمات متاحة (تناول الطعام، توصيل، حجز، QR)
  - **السعة**: عدد الطاولات، المقاعد، مواقف السيارات
  - **العملة الافتراضية**
  - **الحالة**: نشط/غير نشط

### 3. صفحة تعديل مطعم
- **المسار**: `/dashboard/restaurants/edit/[id]`
- **المكون**: `RestaurantForm` (مع البيانات المحملة)

### 4. صفحة عرض تفاصيل المطعم
- **المسار**: `/dashboard/restaurants/[id]`
- **المكون**: `RestaurantDetailView`
- **الميزات**:
  - عرض جميع معلومات المطعم
  - عرض الصور
  - خريطة الموقع (إن وجدت)
  - أزرار التعديل والرجوع

## الترجمات

تم إضافة جميع الترجمات المطلوبة في `messages/ar.json` تحت مفتاح `restaurants`:

```json
{
  "restaurants": {
    "title": "المطاعم",
    "management": "إدارة المطاعم",
    "list": "قائمة المطاعم",
    "create": "إضافة مطعم جديد",
    // ... والمزيد
  }
}
```

## الخدمات (Services)

- **restaurantsService**: خدمة للتعامل مع API المطاعم
- **currencyService**: خدمة للتعامل مع العملات

## Hooks المتاحة

من `src/hooks/restaurants/index.ts`:

```typescript
import {
  useRestaurants,        // قائمة المطاعم
  useRestaurantDetail,   // تفاصيل مطعم واحد
  useCreateRestaurant,   // إنشاء مطعم جديد
  useUpdateRestaurant,   // تحديث مطعم
  useDeleteRestaurant,   // حذف مطعم
} from '@/hooks/restaurants'
```

## الاستخدام

### 1. عرض قائمة المطاعم

```tsx
import { useRestaurants } from '@/hooks/restaurants'

const { data, isLoading } = useRestaurants({
  where: { isActive: { equals: true } }
})
```

### 2. إنشاء مطعم جديد

```tsx
import { useCreateRestaurant } from '@/hooks/restaurants'

const { mutate: createRestaurant } = useCreateRestaurant()

createRestaurant({
  name: 'فرع الرياض',
  city: 'الرياض',
  address: 'شارع الملك فهد',
  phone: '+966501234567',
  defaultCurrency: 'currency-id',
  // ... باقي الحقول
})
```

### 3. تحديث مطعم

```tsx
import { useUpdateRestaurant } from '@/hooks/restaurants'

const { mutate: updateRestaurant } = useUpdateRestaurant()

updateRestaurant({
  id: 'restaurant-id',
  data: { isActive: false }
})
```

## التكامل مع Sidebar

تم إضافة رابط المطاعم في Sidebar تحت قسم "النظام":

```tsx
{
  title: t('system'),
  items: [
    { title: t('users'), icon: <DevIcon />, href: '/dashboard/users' },
    { title: t('restaurants.title'), icon: <HomeIcon />, href: '/dashboard/restaurants' }
  ]
}
```

## الصلاحيات

وفقًا لـ Collection Config في `src/collections/Restaurants.ts`:

- **القراءة**: عامة (الجميع)
- **الإنشاء/التعديل/الحذف**: المدير فقط (`isAdmin`)

## ملاحظات مهمة

1. **Multi-Restaurant Support**: النظام يدعم تعدد المطاعم
2. **Localization**: جميع الحقول النصية تدعم التوطين (عربي، إنجليزي، تركي)
3. **Currency**: كل مطعم له عملة افتراضية
4. **Features Flags**: يمكن تفعيل/تعطيل خدمات معينة لكل فرع
5. **Images**: دعم رفع صور متعددة لكل مطعم

## الملفات الرئيسية

```
src/
├── components/restaurants/
│   ├── RestaurantsContent.tsx     # الصفحة الرئيسية
│   ├── RestaurantsTable.tsx       # جدول المطاعم
│   ├── RestaurantCard.tsx         # بطاقة المطعم
│   ├── RestaurantForm.tsx         # نموذج إضافة/تعديل
│   ├── RestaurantDetailView.tsx   # عرض التفاصيل
│   └── index.ts
├── app/(frontend)/[locale]/dashboard/restaurants/
│   ├── page.tsx                   # صفحة القائمة
│   ├── create/page.tsx            # صفحة الإنشاء
│   ├── edit/[id]/page.tsx         # صفحة التعديل
│   └── [id]/page.tsx              # صفحة التفاصيل
├── hooks/restaurants/
│   ├── index.ts
│   └── useRestaurantSelection.ts
├── services/
│   ├── restaurants.service.ts
│   └── currencies.service.ts
└── collections/
    └── Restaurants.ts
```

## الخطوات التالية (اختياري)

- [ ] إضافة تصدير Excel/PDF للمطاعم
- [ ] إضافة خريطة تفاعلية في صفحة التفاصيل
- [ ] إضافة إحصائيات لكل مطعم
- [ ] ربط المطاعم بالطلبات والحجوزات
