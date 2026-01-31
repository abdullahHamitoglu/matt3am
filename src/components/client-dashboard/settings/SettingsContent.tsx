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
              <p className="text-default-500">الرجاء تسجيل الدخول للوصول إلى الإعدادات.</p>
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
        title: 'تم التحديث',
        description: 'تم تحديث رقم الهاتف بنجاح',
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: 'خطأ',
        description: 'فشل تحديث رقم الهاتف',
        color: 'danger',
      })
    } finally {
      setIsUpdatingPhone(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول',
        color: 'danger',
      })
      return
    }

    if (newPassword !== confirmPassword) {
      addToast({
        title: 'خطأ',
        description: 'كلمات المرور غير متطابقة',
        color: 'danger',
      })
      return
    }

    if (newPassword.length < 6) {
      addToast({
        title: 'خطأ',
        description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
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
        title: 'تم التحديث',
        description: 'تم تغيير كلمة المرور بنجاح',
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: 'خطأ',
        description: 'فشل تغيير كلمة المرور',
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
          <h1 className="font-bold text-2xl">الإعدادات</h1>
        </div>

        <Tabs aria-label="Settings tabs" color="primary" variant="underlined">
          {/* Account Settings */}
          <Tab key="account" title="الحساب">
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-6">
              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">اللغة والعرض</h3>
                </CardHeader>
                <CardBody className="space-y-6">
                  <Select
                    label="اللغة"
                    selectedKeys={[selectedLanguage]}
                    onChange={(e) => handleLanguageChange(e.target.value as SupportedLocale)}
                  >
                    <SelectItem key="ar">العربية</SelectItem>
                    <SelectItem key="en">English</SelectItem>
                    <SelectItem key="tr">Türkçe</SelectItem>
                  </Select>

                  <div className="bg-default-50 p-4 rounded-lg">
                    <p className="text-default-600 text-sm">
                      اللغة الحالية:{' '}
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
                  <h3 className="font-semibold text-lg">معلومات الاتصال</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="رقم الهاتف"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="bordered"
                    placeholder="أدخل رقم الهاتف"
                  />
                  <Button
                    color="primary"
                    className="w-full"
                    isLoading={isUpdatingPhone}
                    onPress={handleUpdatePhone}
                    isDisabled={phone === user.phone}
                  >
                    تحديث رقم الهاتف
                  </Button>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* Security Settings */}
          <Tab key="security" title="الأمان">
            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-6">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">تغيير كلمة المرور</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="كلمة المرور الحالية"
                    type="password"
                    placeholder="أدخل كلمة المرور الحالية"
                    variant="bordered"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="كلمة المرور الجديدة"
                    type="password"
                    placeholder="أدخل كلمة المرور الجديدة"
                    variant="bordered"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    label="تأكيد كلمة المرور"
                    type="password"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    variant="bordered"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={confirmPassword !== '' && newPassword !== confirmPassword}
                    errorMessage={
                      confirmPassword !== '' && newPassword !== confirmPassword
                        ? 'كلمات المرور غير متطابقة'
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
                    تحديث كلمة المرور
                  </Button>
                </CardBody>
              </Card>

              {/* Session Management */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">الجلسات</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="text-default-500 text-sm">إدارة جلساتك النشطة على مختلف الأجهزة.</p>

                  {user.sessions && user.sessions.length > 0 ? (
                    <div className="space-y-3">
                      {user.sessions.map((session, index) => (
                        <div
                          key={session.id}
                          className="flex justify-between items-center bg-default-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">جلسة {index + 1}</p>
                            <p className="text-default-500 text-xs">
                              تنتهي: {new Date(session.expiresAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          <Chip size="sm" color="success" variant="flat">
                            نشطة
                          </Chip>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-default-50 p-4 rounded-lg text-center">
                      <p className="text-default-400 text-sm">الجلسة الحالية فقط نشطة</p>
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
                    تسجيل الخروج
                  </Button>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* Restaurant Settings - Only for admins or users with restaurants */}
          {(isAdmin || userRestaurants.length > 0) && (
            <Tab key="restaurants" title="الفروع">
              <div className="gap-6 grid grid-cols-1 mt-6">
                <Card>
                  <CardHeader className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">
                      {isAdmin ? 'جميع الفروع' : 'الفروع المعينة لك'}
                    </h3>
                    {isAdmin && (
                      <Button
                        color="primary"
                        size="sm"
                        onPress={() =>
                          router.push(`/${currentLocale}/admin/collections/restaurants`)
                        }
                      >
                        إدارة الفروع
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
                            <p className="text-default-500">لا توجد فروع</p>
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
            <Tab key="admin" title="النظام">
              <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-lg">روابط سريعة</h3>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin`)}
                    >
                      🔧 لوحة تحكم Payload
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/users`)}
                    >
                      👥 إدارة المستخدمين
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/roles`)}
                    >
                      🛡️ إدارة الأدوار
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/currencies`)}
                    >
                      💰 إدارة العملات
                    </Button>
                    <Button
                      variant="flat"
                      className="justify-start w-full"
                      onPress={() => router.push(`/admin/collections/categories`)}
                    >
                      📁 إدارة التصنيفات
                    </Button>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-lg">معلومات النظام</h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-default-500">إجمالي الفروع</span>
                      <Chip color="primary" variant="flat">
                        {restaurantsData?.totalDocs || 0}
                      </Chip>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                      <span className="text-default-500">الفروع النشطة</span>
                      <Chip color="success" variant="flat">
                        {restaurantsData?.docs?.filter((r: Restaurant) => r.isActive).length || 0}
                      </Chip>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                      <span className="text-default-500">نوع الحساب</span>
                      <Chip color="danger" variant="flat">
                        مدير النظام
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

  const handleToggleActive = async () => {
    try {
      await updateMutation.mutateAsync({ isActive: !restaurant.isActive })
      addToast({
        title: 'تم التحديث',
        description: `تم ${restaurant.isActive ? 'تعطيل' : 'تفعيل'} الفرع`,
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: 'خطأ',
        description: 'فشل تحديث حالة الفرع',
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
            {restaurant.isActive ? 'نشط' : 'معطل'}
          </Chip>
        </div>
        <p className="text-default-500 text-sm">{restaurant.city}</p>
        {restaurant.phone && <p className="mt-1 text-default-400 text-xs">📞 {restaurant.phone}</p>}
        <div className="flex flex-wrap gap-1 mt-3">
          {restaurant.features?.hasDineIn && (
            <Chip size="sm" variant="bordered">
              طعام محلي
            </Chip>
          )}
          {restaurant.features?.hasTakeaway && (
            <Chip size="sm" variant="bordered">
              استلام
            </Chip>
          )}
          {restaurant.features?.hasDelivery && (
            <Chip size="sm" variant="bordered">
              توصيل
            </Chip>
          )}
        </div>
        {isAdmin && (
          <div className="flex justify-between items-center mt-4 pt-3 border-default-200 border-t">
            <span className="text-default-500 text-xs">تفعيل/تعطيل</span>
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
