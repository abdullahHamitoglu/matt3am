'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Switch,
  Button,
  Input,
  Select,
  SelectItem,
  Divider,
  Tabs,
  Tab,
  Skeleton,
  Chip,
  addToast,
} from '@heroui/react'
import { useCurrentUser } from '@/hooks/auth/useCurrentUser'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import { useRestaurants, useUpdateRestaurant } from '@/hooks/restaurants'
import { useLogout } from '@/hooks/auth/useLogout'
import { useUpdateUser } from '@/hooks/users'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Restaurant } from '@/payload-types'

type SupportedLocale = 'ar' | 'en' | 'tr'

export const SettingsContent = () => {
  const { data: currentUserResponse, isLoading, refetch: refetchUser } = useCurrentUser()
  const { isAdmin, restaurants: userRestaurants } = useUserPermissions()
  const { data: restaurantsData, isLoading: restaurantsLoading } = useRestaurants(
    { limit: 100 },
    { enabled: isAdmin },
  )
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const router = useRouter()
  const pathname = usePathname()

  const user = currentUserResponse?.user
  const updateUserMutation = useUpdateUser(user?.id || '')
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const tRestaurants = useTranslations('restaurants')

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Language state
  const currentLocale = pathname.split('/')[1] as SupportedLocale
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLocale>(currentLocale || 'ar')

  // Phone update state
  const [phone, setPhone] = useState('')
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false)

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone)
    }
  }, [user?.phone])

  if (isLoading) {
    return <SettingsSkeleton />
  }

  if (!user) {
    return (
      <div className="h-full">
        <div className="mx-auto px-4 lg:px-0 pt-3 sm:pt-10 w-full max-w-[90rem]">
          <Card>
            <CardBody className="p-12 text-center">
              <p className="text-default-500">
                {t('loginRequired') || 'الرجاء تسجيل الدخول للوصول إلى الإعدادات.'}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  const handleLanguageChange = (locale: SupportedLocale) => {
    setSelectedLanguage(locale)
    // Navigate to the same page with new locale
    const pathParts = pathname.split('/')
    pathParts[1] = locale
    router.push(pathParts.join('/'))
  }

  const handleUpdatePhone = async () => {
    if (!phone.trim()) return

    setIsUpdatingPhone(true)
    try {
      await updateUserMutation.mutateAsync({ phone })
      await refetchUser()
      addToast({
        title: t('updated') || 'تم التحديث',
        description: t('phoneUpdated') || 'تم تحديث رقم الهاتف بنجاح',
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: t('error') || 'خطأ',
        description: t('phoneUpdateFailed') || 'فشل تحديث رقم الهاتف',
        color: 'danger',
      })
    } finally {
      setIsUpdatingPhone(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast({
        title: t('error') || 'خطأ',
        description: t('fillAllFields') || 'الرجاء ملء جميع الحقول',
        color: 'danger',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      addToast({
        title: t('error') || 'خطأ',
        description: t('passwordMismatch') || 'كلمات المرور غير متطابقة',
        color: 'danger',
      })
      return
    }

    if (newPassword.length < 6) {
      addToast({
        title: t('error') || 'خطأ',
        description: t('passwordTooShort') || 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        color: 'danger',
      })
      return
    }

    setIsUpdatingPassword(true)
    try {
      await updateUserMutation.mutateAsync({ password: newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      addToast({
        title: t('updated') || 'تم التحديث',
        description: t('passwordUpdated') || 'تم تغيير كلمة المرور بنجاح',
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: t('error') || 'خطأ',
        description: t('passwordUpdateFailed') || 'فشل تغيير كلمة المرور',
        color: 'danger',
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push(`/${currentLocale}/login`)
      },
    })
  }

  return (
    <div className="h-full">
      <div className="mx-auto px-4 lg:px-0 pt-3 sm:pt-10 w-full max-w-[90rem]">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">{t('title')}</h1>
        </div>

        <Tabs aria-label="Settings tabs" color="primary" variant="underlined">
          {/* Account Settings */}
          <Tab key="account" title={t('account') || 'الحساب'}>
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-6">
              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">{t('language')}</h3>
                </CardHeader>
                <CardBody className="space-y-6">
                  <Select
                    label={t('language')}
                    selectedKeys={[selectedLanguage]}
                    onChange={(e) => handleLanguageChange(e.target.value as SupportedLocale)}
                  >
                    <SelectItem key="ar">العربية</SelectItem>
                    <SelectItem key="en">English</SelectItem>
                    <SelectItem key="tr">Türkçe</SelectItem>
                  </Select>

                  <div className="bg-default-50 p-4 rounded-lg">
                    <p className="text-default-600 text-sm">
                      {t('languageHint') || 'اللغة الحالية'}:{' '}
                      <strong>
                        {selectedLanguage === 'ar'
                          ? 'العربية'
                          : selectedLanguage === 'en'
                            ? 'English'
                            : 'Türkçe'}
                      </strong>
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Phone Update */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">{t('contactInfo') || 'معلومات الاتصال'}</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label={t('phone') || 'رقم الهاتف'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="bordered"
                    placeholder={t('phonePlaceholder') || 'أدخل رقم الهاتف'}
                  />
                  <Button
                    color="primary"
                    className="w-full"
                    isLoading={isUpdatingPhone}
                    onPress={handleUpdatePhone}
                    isDisabled={phone === user.phone}
                  >
                    {t('updatePhone') || 'تحديث رقم الهاتف'}
                  </Button>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* Security Settings */}
          <Tab key="security" title={t('security') || 'الأمان'}>
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-6">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">
                    {t('changePassword') || 'تغيير كلمة المرور'}
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label={t('currentPassword') || 'كلمة المرور الحالية'}
                    type="password"
                    placeholder={t('currentPasswordPlaceholder') || 'أدخل كلمة المرور الحالية'}
                    variant="bordered"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label={t('newPassword') || 'كلمة المرور الجديدة'}
                    type="password"
                    placeholder={t('newPasswordPlaceholder') || 'أدخل كلمة المرور الجديدة'}
                    variant="bordered"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    label={t('confirmPassword') || 'تأكيد كلمة المرور'}
                    type="password"
                    placeholder={t('confirmPasswordPlaceholder') || 'أعد إدخال كلمة المرور الجديدة'}
                    variant="bordered"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={confirmPassword !== '' && newPassword !== confirmPassword}
                    errorMessage={
                      confirmPassword !== '' && newPassword !== confirmPassword
                        ? t('passwordMismatch') || 'كلمات المرور غير متطابقة'
                        : ''
                    }
                  />
                  <Button
                    color="primary"
                    className="w-full"
                    isLoading={isUpdatingPassword}
                    onPress={handleUpdatePassword}
                    isDisabled={!currentPassword || !newPassword || !confirmPassword}
                  >
                    {t('updatePassword') || 'تحديث كلمة المرور'}
                  </Button>
                </CardBody>
              </Card>

              {/* Session Management */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">{t('sessions') || 'الجلسات'}</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="text-default-500 text-sm">
                    {t('sessionsDesc') || 'إدارة جلساتك النشطة على مختلف الأجهزة.'}
                  </p>

                  {user.sessions && user.sessions.length > 0 ? (
                    <div className="space-y-3">
                      {user.sessions.map((session, index) => (
                        <div
                          key={session.id}
                          className="flex justify-between items-center bg-default-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {t('session') || 'جلسة'} {index + 1}
                            </p>
                            <p className="text-default-500 text-xs">
                              {t('expires') || 'تنتهي'}:{' '}
                              {new Date(session.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Chip size="sm" color="success" variant="flat">
                            {t('active') || 'نشطة'}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-default-50 p-4 rounded-lg text-center">
                      <p className="text-default-400 text-sm">
                        {t('currentSessionOnly') || 'الجلسة الحالية فقط نشطة'}
                      </p>
                    </div>
                  )}

                  <Divider />

                  <Button
                    color="danger"
                    variant="flat"
                    className="w-full"
                    isLoading={isLoggingOut}
                    onPress={handleLogout}
                  >
                    {t('logout')}
                  </Button>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* Restaurant Settings - Only for admins or users with restaurants */}
          {(isAdmin || userRestaurants.length > 0) && (
            <Tab key="restaurants" title={tRestaurants('title') || 'الفروع'}>
              <div className="gap-6 grid grid-cols-1 mt-6">
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">
                      {isAdmin
                        ? tRestaurants('list') || 'جميع الفروع'
                        : tRestaurants('assignedBranches') || 'الفروع المعينة لك'}
                    </h3>
                    {isAdmin && (
                      <Button
                        color="primary"
                        size="sm"
                        onPress={() =>
                          router.push(`/${currentLocale}/admin/collections/restaurants`)
                        }
                      >
                        {tRestaurants('management') || 'إدارة الفروع'}
                      </Button>
                    )}
                  </CardHeader>
                  <CardBody>
                    {restaurantsLoading ? (
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="rounded-lg h-32" />
                        ))}
                      </div>
                    ) : (
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {(isAdmin ? restaurantsData?.docs : userRestaurants)?.map(
                          (restaurant: Restaurant) => (
                            <RestaurantCard
                              key={restaurant.id}
                              restaurant={restaurant}
                              isAdmin={isAdmin}
                            />
                          ),
                        )}
                        {((isAdmin ? restaurantsData?.docs : userRestaurants)?.length || 0) ===
                          0 && (
                          <div className="col-span-full py-8 text-center">
                            <p className="text-default-500">
                              {tRestaurants('noRestaurants') || 'لا توجد فروع'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </Tab>
          )}

          {/* Admin Settings */}
          {isAdmin && (
            <Tab key="admin" title={t('system') || 'النظام'}>
              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-lg">{t('quickLinks') || 'روابط سريعة'}</h3>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin`)}
                    >
                      🔧 {t('payloadDashboard') || 'لوحة تحكم Payload'}
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/users`)}
                    >
                      👥 {t('manageUsers') || 'إدارة المستخدمين'}
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/roles`)}
                    >
                      🛡️ {t('manageRoles') || 'إدارة الأدوار'}
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/currencies`)}
                    >
                      💰 {t('manageCurrencies') || 'إدارة العملات'}
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/categories`)}
                    >
                      📁 {t('manageCategories') || 'إدارة التصنيفات'}
                    </Button>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-lg">{t('systemInfo') || 'معلومات النظام'}</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-default-500">
                        {t('totalBranches') || 'إجمالي الفروع'}
                      </span>
                      <Chip color="primary" variant="flat">
                        {restaurantsData?.totalDocs || 0}
                      </Chip>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                      <span className="text-default-500">
                        {t('activeBranches') || 'الفروع النشطة'}
                      </span>
                      <Chip color="success" variant="flat">
                        {restaurantsData?.docs?.filter((r: Restaurant) => r.isActive).length || 0}
                      </Chip>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                      <span className="text-default-500">{t('accountType') || 'نوع الحساب'}</span>
                      <Chip color="danger" variant="flat">
                        {t('systemAdmin') || 'مدير النظام'}
                      </Chip>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  )
}

// Restaurant Card Component
const RestaurantCard = ({ restaurant, isAdmin }: { restaurant: Restaurant; isAdmin: boolean }) => {
  const updateMutation = useUpdateRestaurant(restaurant.id)
  const t = useTranslations('settings')

  const handleToggleActive = async () => {
    try {
      await updateMutation.mutateAsync({ isActive: !restaurant.isActive })
      addToast({
        title: t('updated') || 'تم التحديث',
        description: `${restaurant.isActive ? t('branchDisabled') || 'تم تعطيل الفرع' : t('branchEnabled') || 'تم تفعيل الفرع'}`,
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: t('error') || 'خطأ',
        description: t('branchUpdateFailed') || 'فشل تحديث حالة الفرع',
        color: 'danger',
      })
    }
  }

  return (
    <Card className="bg-default-50">
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{restaurant.name}</h4>
          <Chip size="sm" color={restaurant.isActive ? 'success' : 'default'} variant="flat">
            {restaurant.isActive ? t('active') || 'نشط' : t('inactive') || 'معطل'}
          </Chip>
        </div>
        <p className="text-default-500 text-sm">{restaurant.city}</p>
        {restaurant.phone && <p className="mt-1 text-default-400 text-xs">📞 {restaurant.phone}</p>}
        <div className="flex flex-wrap gap-1 mt-3">
          {restaurant.features?.hasDineIn && (
            <Chip size="sm" variant="bordered">
              {t('dineIn') || 'طعام محلي'}
            </Chip>
          )}
          {restaurant.features?.hasTakeaway && (
            <Chip size="sm" variant="bordered">
              {t('takeaway') || 'استلام'}
            </Chip>
          )}
          {restaurant.features?.hasDelivery && (
            <Chip size="sm" variant="bordered">
              {t('delivery') || 'توصيل'}
            </Chip>
          )}
        </div>
        {isAdmin && (
          <div className="flex justify-between items-center mt-4 pt-3 border-default-200 border-t">
            <span className="text-default-500 text-xs">{t('toggleActive') || 'تفعيل/تعطيل'}</span>
            <Switch
              size="sm"
              isSelected={restaurant.isActive ?? false}
              onValueChange={handleToggleActive}
              isDisabled={updateMutation.isPending}
            />
          </div>
        )}
      </CardBody>
    </Card>
  )
}

const SettingsSkeleton = () => (
  <div className="h-full">
    <div className="mx-auto px-4 lg:px-0 pt-3 sm:pt-10 w-full max-w-[90rem]">
      <Skeleton className="mb-6 rounded-lg w-32 h-8" />
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardBody className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="rounded-lg h-12" />
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  </div>
)
