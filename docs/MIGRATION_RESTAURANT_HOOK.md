# Migration: RestaurantContext to useRestaurantSelection Hook

## ✅ التغييرات المنفذة

تم تحويل نظام إدارة المطعم المحدد من Context API إلى custom hook مبني على React Query.

## الملفات المتأثرة

### ملفات جديدة
- ✅ `src/hooks/restaurants/useRestaurantSelection.ts` - Custom hook بديل للـ Context

### ملفات محذوفة
- 🗑️ `src/contexts/RestaurantContext.tsx` - تم الاستغناء عنه بالكامل

### ملفات محدثة (11 ملف)

#### 1. Providers
- `src/app/(frontend)/[locale]/providers.tsx` - إزالة RestaurantProvider

#### 2. Hooks
- `src/hooks/restaurants/index.ts` - إضافة تصدير useRestaurantSelection

#### 3. Components (9 ملفات)
تم تحديث الاستيراد من `useRestaurant` إلى `useRestaurantSelection`:
- `src/components/orders/OrdersContent.tsx`
- `src/components/client-dashboard/sidebar/companies-dropdown.tsx`
- `src/components/client-dashboard/header/RestaurantSelector.tsx`
- `src/components/client-dashboard/home/AdminDashboard.tsx`
- `src/components/client-dashboard/home/CashierDashboard.tsx`
- `src/components/client-dashboard/home/ChefDashboard.tsx`
- `src/components/client-dashboard/home/DeliveryDriverDashboard.tsx`
- `src/components/client-dashboard/home/ManagerDashboard.tsx`
- `src/components/client-dashboard/home/WaiterDashboard.tsx`

## كيفية الاستخدام

### قبل التحويل
```tsx
import { useRestaurant } from '@/contexts/RestaurantContext'

function MyComponent() {
  const { selectedRestaurant, setSelectedRestaurant, restaurants } = useRestaurant()
  // ...
}

// في Providers
<RestaurantProvider>
  {children}
</RestaurantProvider>
```

### بعد التحويل
```tsx
import { useRestaurantSelection } from '@/hooks/restaurants'

function MyComponent() {
  const { selectedRestaurant, setSelectedRestaurant, restaurants } = useRestaurantSelection()
  // ...
}

// لا حاجة للـ Provider
{children}
```

## المزايا

1. ✅ **أبسط** - لا حاجة لـ Context Provider في شجرة المكونات
2. ✅ **متسق** - يستخدم نفس نمط React Query المتبع في باقي المشروع
3. ✅ **أداء أفضل** - البيانات تأتي من `useUserPermissions` (React Query)
4. ✅ **صيانة أسهل** - كود أقل وأوضح

## ملاحظات

- الـ hook الجديد يحافظ على نفس الـ API السابق تماماً
- localStorage persistence لا يزال يعمل بنفس الطريقة
- validation المطاعم للمستخدم لا يزال موجود
- Auto-selection للمطعم الأول لا يزال يعمل

## اختبار التغييرات

```bash
# فحص الأخطاء
pnpm run lint

# التشغيل
pnpm dev

# التأكد من عمل:
# 1. تحديد المطعم في Dashboard
# 2. حفظ الاختيار في localStorage
# 3. تحميل المطعم المحفوظ عند إعادة التحميل
```
