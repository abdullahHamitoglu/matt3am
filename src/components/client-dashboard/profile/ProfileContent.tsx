'use client'

import React, { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Button,
  Input,
  Divider,
  Chip,
  Skeleton,
  addToast,
} from '@heroui/react'
import { useCurrentUser } from '@/hooks/auth/useCurrentUser'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import { useUpdateUser } from '@/hooks/users'
import { useTranslations } from 'next-intl'
import type { Restaurant, Role } from '@/payload-types'

export const ProfileContent = () => {
  const { data: currentUserResponse, isLoading, refetch } = useCurrentUser()
  const { isAdmin, position, restaurants } = useUserPermissions()
  const [isEditing, setIsEditing] = useState(false)
  const t = useTranslations('profile')
  const tCommon = useTranslations('common')

  const user = currentUserResponse?.user
  const updateUserMutation = useUpdateUser(user?.id || '')

  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({})

  const startEditing = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync(formData)
      await refetch()
      setIsEditing(false)
      addToast({
        title: t('updateSuccess'),
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: t('updateError'),
        color: 'danger',
      })
    }
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!user) {
    return (
      <div className="h-full">
        <div className="mx-auto px-4 lg:px-0 pt-3 sm:pt-10 w-full max-w-[90rem]">
          <Card>
            <CardBody className="p-12 text-center">
              <p className="text-default-500">
                {t('loginRequired') || 'Please log in to view your profile.'}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()

  // Extract role names
  const roleNames =
    user.roles
      ?.map((role) => {
        if (typeof role === 'object' && role !== null) {
          return (role as Role).name
        }
        return null
      })
      .filter(Boolean) || []

  return (
    <div className="h-full">
      <div className="mx-auto px-4 lg:px-0 pt-3 sm:pt-10 w-full max-w-[90rem]">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">{t('title')}</h1>
          <Button
            color={isEditing ? 'danger' : 'primary'}
            variant={isEditing ? 'flat' : 'solid'}
            onPress={() => (isEditing ? setIsEditing(false) : startEditing())}
          >
            {isEditing ? tCommon('cancel') : t('editProfile') || 'Edit Profile'}
          </Button>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardBody className="flex flex-col items-center py-8">
              <Avatar name={initials} className="w-24 h-24 text-2xl" color="primary" />
              <h2 className="mt-4 font-semibold text-xl">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-default-500 text-sm">{user.email}</p>

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {position && (
                  <Chip color="primary" variant="flat" size="sm" className="capitalize">
                    {position}
                  </Chip>
                )}
              </div>

              {roleNames.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {roleNames.map((roleName, index) => (
                    <Chip key={index} variant="bordered" size="sm">
                      {roleName}
                    </Chip>
                  ))}
                </div>
              )}

              <Divider className="my-6" />

              <div className="space-y-3 w-full text-sm">
                <div className="flex justify-between">
                  <span className="text-default-500">{t('status') || 'Status'}</span>
                  <Chip color={user.isActive ? 'success' : 'danger'} variant="dot" size="sm">
                    {user.isActive ? t('active') || 'Active' : t('inactive') || 'Inactive'}
                  </Chip>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-500">{t('memberSince') || 'Member since'}</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.lastLogin && (
                  <div className="flex justify-between">
                    <span className="text-default-500">{t('lastLogin') || 'Last login'}</span>
                    <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="font-semibold text-lg">{t('personalInfo')}</h3>
            </CardHeader>
            <CardBody className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <Input
                label={t('firstName')}
                value={isEditing ? formData.firstName : user.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                isReadOnly={!isEditing}
                variant={isEditing ? 'bordered' : 'flat'}
              />
              <Input
                label={t('lastName')}
                value={isEditing ? formData.lastName : user.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                isReadOnly={!isEditing}
                variant={isEditing ? 'bordered' : 'flat'}
              />
              <Input
                label={t('email')}
                value={user.email}
                isReadOnly
                variant="flat"
                type="email"
                description={t('emailReadonly')}
              />
              <Input
                label={t('phone')}
                value={isEditing ? formData.phone : user.phone || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                isReadOnly={!isEditing}
                variant={isEditing ? 'bordered' : 'flat'}
                placeholder={isEditing ? t('phonePlaceholder') || 'Enter phone number' : ''}
              />

              {user.employeeInfo?.employeeId && (
                <Input
                  label={t('employeeId') || 'Employee ID'}
                  value={user.employeeInfo.employeeId}
                  isReadOnly
                  variant="flat"
                />
              )}

              {user.employeeInfo?.hireDate && (
                <Input
                  label={t('hireDate') || 'Hire Date'}
                  value={new Date(user.employeeInfo.hireDate).toLocaleDateString()}
                  isReadOnly
                  variant="flat"
                />
              )}
            </CardBody>
          </Card>

          {/* Assigned Restaurants */}
          {restaurants.length > 0 && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <h3 className="font-semibold text-lg">
                  {t('assignedRestaurants') || 'Assigned Restaurants'}
                </h3>
              </CardHeader>
              <CardBody>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {restaurants.map((restaurant: Restaurant) => (
                    <Card key={restaurant.id} className="bg-default-50">
                      <CardBody className="p-4">
                        <h4 className="font-medium">{restaurant.name}</h4>
                        <p className="text-default-500 text-sm">{restaurant.city}</p>
                        {restaurant.address && (
                          <p className="mt-1 text-default-400 text-xs">{restaurant.address}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {restaurant.features?.hasDineIn && (
                            <Chip size="sm" variant="flat" color="success">
                              {t('dineIn') || 'Dine-in'}
                            </Chip>
                          )}
                          {restaurant.features?.hasTakeaway && (
                            <Chip size="sm" variant="flat" color="primary">
                              {t('takeaway') || 'Takeaway'}
                            </Chip>
                          )}
                          {restaurant.features?.hasDelivery && (
                            <Chip size="sm" variant="flat" color="warning">
                              {t('delivery') || 'Delivery'}
                            </Chip>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Emergency Contact */}
          {user.employeeInfo?.emergencyContact?.name && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <h3 className="font-semibold text-lg">
                  {t('emergencyContact') || 'Emergency Contact'}
                </h3>
              </CardHeader>
              <CardBody className="gap-6 grid grid-cols-1 md:grid-cols-3">
                <Input
                  label={t('contactName') || 'Contact Name'}
                  value={user.employeeInfo.emergencyContact.name || ''}
                  isReadOnly={!isEditing}
                  variant={isEditing ? 'bordered' : 'flat'}
                />
                <Input
                  label={t('contactPhone') || 'Contact Phone'}
                  value={user.employeeInfo.emergencyContact.phone || ''}
                  isReadOnly={!isEditing}
                  variant={isEditing ? 'bordered' : 'flat'}
                />
                <Input
                  label={t('relationship') || 'Relationship'}
                  value={user.employeeInfo.emergencyContact.relationship || ''}
                  isReadOnly={!isEditing}
                  variant={isEditing ? 'bordered' : 'flat'}
                />
              </CardBody>
            </Card>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="flat" onPress={() => setIsEditing(false)}>
              {tCommon('cancel')}
            </Button>
            <Button color="primary" onPress={handleSave} isLoading={updateUserMutation.isPending}>
              {tCommon('save')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const ProfileSkeleton = () => (
  <div className="h-full">
    <div className="mx-auto px-4 lg:px-0 pt-3 sm:pt-10 w-full max-w-[90rem]">
      <Skeleton className="mb-6 rounded-lg w-32 h-8" />
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="flex flex-col items-center py-8">
            <Skeleton className="rounded-full w-24 h-24" />
            <Skeleton className="mt-4 rounded-lg w-32 h-6" />
            <Skeleton className="mt-2 rounded-lg w-40 h-4" />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardBody className="gap-4 grid grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="rounded-lg h-14" />
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  </div>
)
