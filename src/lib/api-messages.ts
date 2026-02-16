/**
 * API Messages Localization
 * Provides translated messages for API responses and errors
 */

type Locale = 'ar' | 'en' | 'tr'

interface Messages {
  // Auth errors
  unauthorized: string
  accountInactive: string
  noRestaurantsAssigned: string
  forbidden: string
  invalidCredentials: string

  // Cart errors
  cartNotFound: string
  itemNotFound: string
  invalidQuantity: string
  cartExpired: string

  // Order errors
  orderNotFound: string
  orderCreationFailed: string
  invalidOrderType: string

  // General errors
  internalError: string
  validationError: string
  notFound: string
  badRequest: string

  // Success messages
  success: string
  orderCreated: string
  cartUpdated: string
}

const messages: Record<Locale, Messages> = {
  ar: {
    // Auth errors
    unauthorized: 'غير مصرح',
    accountInactive: 'الحساب غير نشط',
    noRestaurantsAssigned: 'لا توجد مطاعم مخصصة',
    forbidden: 'ممنوع - ليس لديك صلاحية الوصول لهذا المطعم',
    invalidCredentials: 'بيانات الدخول غير صحيحة',

    // Cart errors
    cartNotFound: 'السلة غير موجودة',
    itemNotFound: 'المنتج غير موجود',
    invalidQuantity: 'الكمية غير صحيحة',
    cartExpired: 'انتهت صلاحية السلة',

    // Order errors
    orderNotFound: 'الطلب غير موجود',
    orderCreationFailed: 'فشل إنشاء الطلب',
    invalidOrderType: 'نوع الطلب غير صحيح',

    // General errors
    internalError: 'حدث خطأ داخلي',
    validationError: 'خطأ في البيانات المدخلة',
    notFound: 'غير موجود',
    badRequest: 'طلب غير صحيح',

    // Success messages
    success: 'تمت العملية بنجاح',
    orderCreated: 'تم إنشاء الطلب بنجاح',
    cartUpdated: 'تم تحديث السلة بنجاح',
  },
  en: {
    // Auth errors
    unauthorized: 'Unauthorized',
    accountInactive: 'Account is inactive',
    noRestaurantsAssigned: 'No restaurants assigned',
    forbidden: 'Forbidden - You do not have access to this restaurant',
    invalidCredentials: 'Invalid credentials',

    // Cart errors
    cartNotFound: 'Cart not found',
    itemNotFound: 'Item not found',
    invalidQuantity: 'Invalid quantity',
    cartExpired: 'Cart has expired',

    // Order errors
    orderNotFound: 'Order not found',
    orderCreationFailed: 'Failed to create order',
    invalidOrderType: 'Invalid order type',

    // General errors
    internalError: 'Internal server error',
    validationError: 'Validation error',
    notFound: 'Not found',
    badRequest: 'Bad request',

    // Success messages
    success: 'Success',
    orderCreated: 'Order created successfully',
    cartUpdated: 'Cart updated successfully',
  },
  tr: {
    // Auth errors
    unauthorized: 'Yetkisiz',
    accountInactive: 'Hesap etkin değil',
    noRestaurantsAssigned: 'Atanmış restoran yok',
    forbidden: 'Yasak - Bu restorana erişim izniniz yok',
    invalidCredentials: 'Geçersiz kimlik bilgileri',

    // Cart errors
    cartNotFound: 'Sepet bulunamadı',
    itemNotFound: 'Ürün bulunamadı',
    invalidQuantity: 'Geçersiz miktar',
    cartExpired: 'Sepetin süresi doldu',

    // Order errors
    orderNotFound: 'Sipariş bulunamadı',
    orderCreationFailed: 'Sipariş oluşturulamadı',
    invalidOrderType: 'Geçersiz sipariş türü',

    // General errors
    internalError: 'İç sunucu hatası',
    validationError: 'Doğrulama hatası',
    notFound: 'Bulunamadı',
    badRequest: 'Hatalı istek',

    // Success messages
    success: 'Başarılı',
    orderCreated: 'Sipariş başarıyla oluşturuldu',
    cartUpdated: 'Sepet başarıyla güncellendi',
  },
}

/**
 * Get localized message
 */
export function getApiMessage(key: keyof Messages, locale: string = 'ar'): string {
  const normalizedLocale = (locale.startsWith('ar') ? 'ar' : locale) as Locale
  const validLocale: Locale = ['ar', 'en', 'tr'].includes(normalizedLocale)
    ? normalizedLocale
    : 'ar'

  return messages[validLocale][key] || messages.ar[key]
}

/**
 * Get all messages for a locale
 */
export function getApiMessages(locale: string = 'ar'): Messages {
  const normalizedLocale = (locale.startsWith('ar') ? 'ar' : locale) as Locale
  const validLocale: Locale = ['ar', 'en', 'tr'].includes(normalizedLocale)
    ? normalizedLocale
    : 'ar'

  return messages[validLocale]
}

/**
 * Create error response with localized message
 */
export function createErrorResponse(
  messageKey: keyof Messages,
  locale: string = 'ar',
  statusCode: number = 500,
  additionalData?: Record<string, any>,
) {
  return {
    error: getApiMessage(messageKey, locale),
    statusCode,
    ...additionalData,
  }
}
