# لوحة التحكم - Dashboard

## نظرة عامة

لوحة تحكم شاملة لإدارة المطاعم والمبيعات والعملاء مع إحصائيات في الوقت الفعلي ورسوم بيانية تفاعلية.

## المميزات

### 📊 بطاقات الإحصائيات (Stat Cards)
- **إجمالي الإيرادات**: عرض إجمالي الإيرادات للشهر الحالي مع مؤشر النمو
- **إجمالي الطلبات**: عدد الطلبات الكلي مع نسبة التغيير
- **إجمالي العملاء**: عدد العملاء الفريدين
- **المطاعم النشطة**: عدد الفروع النشطة

### 📈 الرسوم البيانية
- **مخطط الإيرادات**: رسم بياني تفاعلي يعرض الإيرادات والطلبات لآخر 30 يوم
- يدعم ApexCharts مع animations سلسة
- تنسيق العملة تلقائياً (ريال سعودي)

### 📋 جدول الطلبات الأخيرة
- عرض آخر 10 طلبات
- معلومات العميل والتاريخ والمبلغ
- حالة الطلب مع ألوان مميزة
- زر عرض التفاصيل لكل طلب

## البنية التقنية

### المكونات (Components)

#### 1. StatCard
**المسار**: `src/components/dashboard/StatCard.tsx`

```typescript
<StatCard
  title="إجمالي الإيرادات"
  value="50,000 ر.س"
  icon={<Icon icon="solar:dollar-bold" />}
  trend={{ value: 12.5, isPositive: true }}
  color="success"
/>
```

**الخصائص**:
- `title`: عنوان البطاقة
- `value`: القيمة المعروضة
- `icon`: أيقونة من Iconify
- `trend`: مؤشر النمو (اختياري)
- `color`: اللون (primary, success, warning, etc.)

#### 2. RevenueChart
**المسار**: `src/components/dashboard/RevenueChart.tsx`

```typescript
<RevenueChart
  data={{
    categories: ['يناير', 'فبراير', ...],
    series: [
      { name: 'الإيرادات', data: [1000, 2000, ...] },
      { name: 'الطلبات', data: [10, 20, ...] }
    ]
  }}
/>
```

**المميزات**:
- رسم بياني من نوع Area
- تدرجات لونية
- تنسيق العملة تلقائياً
- Tooltips تفاعلية

#### 3. RecentOrdersTable
**المسار**: `src/components/dashboard/RecentOrdersTable.tsx`

```typescript
<RecentOrdersTable orders={recentOrders} />
```

**الأعمدة**:
- رقم الطلب
- اسم العميل
- التاريخ والوقت
- المبلغ
- حالة الطلب
- إجراءات

### الخدمات (Services)

#### Analytics Service
**المسار**: `src/services/analytics.service.ts`

```typescript
import { analyticsService } from '@/services'

// الحصول على الإحصائيات
const stats = await analyticsService.getDashboardStats(restaurantId)

// الحصول على بيانات الرسم البياني
const chartData = await analyticsService.getRevenueData(restaurantId, 30)
```

**الدوال المتاحة**:
- `getDashboardStats(restaurantId?)`: إحصائيات لوحة التحكم
- `getRevenueData(restaurantId?, days?)`: بيانات الرسم البياني

### API Routes

#### 1. GET /api/analytics/stats
**Query Parameters**:
- `restaurantId` (optional): تصفية حسب المطعم

**Response**:
```json
{
  "totalRevenue": 50000,
  "totalOrders": 120,
  "totalCustomers": 85,
  "activeRestaurants": 3,
  "revenueTrend": {
    "value": 12.5,
    "isPositive": true
  },
  "ordersTrend": {
    "value": 8.3,
    "isPositive": true
  }
}
```

#### 2. GET /api/analytics/revenue
**Query Parameters**:
- `restaurantId` (optional): تصفية حسب المطعم
- `days` (optional, default: 30): عدد الأيام

**Response**:
```json
{
  "categories": ["يناير 1", "يناير 2", ...],
  "series": [
    {
      "name": "الإيرادات",
      "data": [1000, 1500, 2000, ...]
    },
    {
      "name": "الطلبات",
      "data": [10, 15, 20, ...]
    }
  ]
}
```

## الصفحة الرئيسية

**المسار**: `app/(frontend)/[locale]/dashboard/page.tsx`

### الوصول
```
http://localhost:3000/ar/dashboard
http://localhost:3000/en/dashboard
http://localhost:3000/tr/dashboard
```

### الميزات
- ✅ تحميل البيانات بشكل متوازي (Parallel Loading)
- ✅ مؤشر تحميل أثناء جلب البيانات
- ✅ دعم كامل للغات الثلاث (العربية، الإنجليزية، التركية)
- ✅ تصميم متجاوب (Responsive)
- ✅ استخدام HeroUI Components
- ✅ تحديث تلقائي للبيانات

## الترجمات

تم إضافة الرسائل التالية في ملفات `messages/{ar,en,tr}.json`:

```json
{
  "totalRevenue": "إجمالي الإيرادات",
  "totalOrders": "إجمالي الطلبات",
  "totalCustomers": "إجمالي العملاء",
  "activeRestaurants": "المطاعم النشطة",
  "revenueOverview": "نظرة عامة على الإيرادات",
  "recentOrders": "الطلبات الأخيرة",
  "salesChart": "مخطط المبيعات",
  "growth": "النمو",
  "decline": "انخفاض"
}
```

## التخصيص

### تغيير الألوان
في `StatCard.tsx`:
```typescript
const colorClasses = {
  primary: 'bg-primary-50 dark:bg-primary-900/20',
  success: 'bg-success-50 dark:bg-success-900/20',
  // أضف ألوانك المخصصة هنا
}
```

### تغيير عدد الأيام في الرسم البياني
في `page.tsx`:
```typescript
analyticsService.getRevenueData(undefined, 60) // 60 يوم بدلاً من 30
```

### إضافة فلترة حسب المطعم
```typescript
const restaurantId = "restaurant_id_here"
analyticsService.getDashboardStats(restaurantId)
analyticsService.getRevenueData(restaurantId)
```

## المتطلبات

### الحزم المستخدمة
- `@heroui/react`: ^2.8.7
- `react-apexcharts`: ^1.9.0
- `@iconify/react`: ^6.0.2
- `next-intl`: ^4.7.0

### التثبيت
جميع الحزم مثبتة مسبقاً في المشروع.

## الاستخدام

### البدء السريع
```bash
# تشغيل الخادم
pnpm dev

# الوصول للوحة التحكم
http://localhost:3000/ar/dashboard
```

### إضافة إلى القائمة الرئيسية
أضف رابط لوحة التحكم في الـ Header:
```tsx
<Link href="/ar/dashboard">{t('dashboard')}</Link>
```

## الأمان

- ✅ جميع API routes تستخدم Payload Local API
- ✅ دعم Access Control حسب المطعم
- ✅ التحقق من الصلاحيات تلقائياً

## التطوير المستقبلي

### ميزات مقترحة
- [ ] فلترة حسب المطعم من الواجهة
- [ ] فلترة حسب التاريخ (يوم، أسبوع، شهر، سنة)
- [ ] تصدير التقارير (PDF, Excel)
- [ ] إشعارات في الوقت الفعلي
- [ ] مقارنة الأداء بين المطاعم
- [ ] رسوم بيانية إضافية (Pie, Bar, Line)
- [ ] Top Selling Items
- [ ] Customer Analytics
- [ ] Revenue Forecast

## الدعم

للأسئلة أو المشاكل، راجع:
- `docs/CART_AND_ORDERS_SYSTEM.md`
- `.github/copilot-instructions.md`
