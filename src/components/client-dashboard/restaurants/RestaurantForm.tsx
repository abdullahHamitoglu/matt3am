// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import {
  Input,
  Textarea,
  Button,
  Checkbox,
  Select,
  SelectItem,
  Divider,
  Card,
  CardBody,
  Image,
  Chip,
  TimeInput,
  CardHeader,
} from '@heroui/react'
import { Time } from '@internationalized/date'
import { useTranslations } from 'next-intl'
import { Restaurant, Currency, Media } from '@/payload-types'
import { useCurrencies } from '@/hooks/currencies'
import { Icon } from '@iconify/react'

interface RestaurantFormProps {
  restaurant?: Restaurant
  onSubmit: (data: Partial<Restaurant>) => void
  onCancel: () => void
  isLoading?: boolean
}

interface FormData {
  name: string
  city: string
  district?: string
  address: string
  latitude?: number
  longitude?: number
  phone: string
  email?: string
  workingHours: {
    openTime?: Time
    closeTime?: Time
    closedDays?: (
      | 'saturday'
      | 'sunday'
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
    )[]
  }
  features: {
    hasDineIn: boolean
    hasTakeaway: boolean
    hasDelivery: boolean
    hasReservation: boolean
    hasQROrdering: boolean
  }
  capacity: {
    totalTables?: number
    totalSeats?: number
    parkingSpaces?: number
  }
  defaultCurrency: string
  images?: Array<{
    image: string
    caption?: string
  }>
  isActive: boolean
}

const weekDays = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']

export const RestaurantForm: React.FC<RestaurantFormProps> = ({
  restaurant,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const t = useTranslations('restaurants')
  const tCommon = useTranslations('common')
  const { data: currenciesData } = useCurrencies();
  console.log(currenciesData);
  

  const [formData, setFormData] = useState<FormData>({
    name: restaurant?.name || '',
    city: restaurant?.city || '',
    district: restaurant?.district || '',
    address: restaurant?.address || '',
    latitude: restaurant?.latitude || undefined,
    longitude: restaurant?.longitude || undefined,
    phone: restaurant?.phone || '',
    email: restaurant?.email || '',
    workingHours: {
      openTime: restaurant?.workingHours?.openTime
        ? (() => {
            const [hours, minutes] = restaurant.workingHours.openTime.split(':').map(Number)
            return new Time(hours, minutes)
          })()
        : undefined,
      closeTime: restaurant?.workingHours?.closeTime
        ? (() => {
            const [hours, minutes] = restaurant.workingHours.closeTime.split(':').map(Number)
            return new Time(hours, minutes)
          })()
        : undefined,
      closedDays: restaurant?.workingHours?.closedDays || [],
    },
    features: {
      hasDineIn: restaurant?.features?.hasDineIn ?? true,
      hasTakeaway: restaurant?.features?.hasTakeaway ?? true,
      hasDelivery: restaurant?.features?.hasDelivery ?? false,
      hasReservation: restaurant?.features?.hasReservation ?? true,
      hasQROrdering: restaurant?.features?.hasQROrdering ?? true,
    },
    capacity: {
      totalTables: restaurant?.capacity?.totalTables || undefined,
      totalSeats: restaurant?.capacity?.totalSeats || undefined,
      parkingSpaces: restaurant?.capacity?.parkingSpaces || undefined,
    },
    defaultCurrency:
      typeof restaurant?.defaultCurrency === 'object'
        ? restaurant.defaultCurrency.id
        : restaurant?.defaultCurrency || '',
    images: restaurant?.images || [],
    isActive: restaurant?.isActive ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t('required')
    if (!formData.city.trim()) newErrors.city = t('required')
    if (!formData.address.trim()) newErrors.address = t('required')
    if (!formData.phone.trim()) newErrors.phone = t('required')
    if (!formData.defaultCurrency) newErrors.defaultCurrency = t('required')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const submitData = {
        ...formData,
        workingHours: {
          ...formData.workingHours,
          openTime: formData.workingHours.openTime
            ? `${String(formData.workingHours.openTime.hour).padStart(2, '0')}:${String(formData.workingHours.openTime.minute).padStart(2, '0')}`
            : undefined,
          closeTime: formData.workingHours.closeTime
            ? `${String(formData.workingHours.closeTime.hour).padStart(2, '0')}:${String(formData.workingHours.closeTime.minute).padStart(2, '0')}`
            : undefined,
        },
      }
      onSubmit(submitData as any)
    }
  }

  const handleClosedDaysChange = (keys: any) => {
    const closedDaysArray = keys === 'all' ? weekDays : Array.from(keys)
    setFormData({
      ...formData,
      workingHours: {
        ...formData.workingHours,
        closedDays: closedDaysArray as any,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t('basicInfo')}</h3>
        </CardHeader>
        <CardBody className="space-y-4">

          <Input
            label={t('branchName')}
            placeholder={t('branchName')}
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            isInvalid={!!errors.name}
            errorMessage={errors.name}
            isRequired
          />

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <Input
              label={t('city')}
              placeholder={t('city')}
              value={formData.city}
              onChange={(e: any) => setFormData({ ...formData, city: e.target.value })}
              isInvalid={!!errors.city}
              errorMessage={errors.city}
              isRequired
            />

            <Input
              label={t('district')}
              placeholder={t('district')}
              value={formData.district}
              onChange={(e: any) => setFormData({ ...formData, district: e.target.value })}
            />
          </div>

          <Textarea
            label={t('address')}
            placeholder={t('address')}
            value={formData.address}
            onChange={(e: any) => setFormData({ ...formData, address: e.target.value })}
            isInvalid={!!errors.address}
            errorMessage={errors.address}
            isRequired
          />
        </CardBody>
      </Card>

      {/* Location Info */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t('locationInfo')}</h3>
        </CardHeader>
        <CardBody className="space-y-4">

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <Input
              type="number"
              label={t('latitude')}
              placeholder="24.7136"
              value={formData.latitude?.toString() || ''}
              onChange={(e) =>
                setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })
              }
            />

            <Input
              type="number"
              label={t('longitude')}
              placeholder="46.6753"
              value={formData.longitude?.toString() || ''}
              onChange={(e) =>
                setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t('contactInfo')}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <Input
              type="tel"
              label={t('phone')}
              placeholder="+966 50 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone}
              isRequired
            />

            <Input
              type="email"
              label={t('email')}
              placeholder="branch@restaurant.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </CardBody>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t('workingHours')}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <TimeInput
              label={t('openTime')}
              value={formData.workingHours.openTime}
              onChange={(time) =>
                setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, openTime: time },
                })
              }
            />

            <TimeInput
              label={t('closeTime')}
              value={formData.workingHours.closeTime}
              onChange={(time) =>
                setFormData({
                  ...formData,
                  workingHours: { ...formData.workingHours, closeTime: time },
                })
              }
            />
          </div>

          <Select
            label={t('closedDays')}
            placeholder={t('selectDays')}
            selectionMode="multiple"
            selectedKeys={new Set(formData.workingHours.closedDays)}
            onSelectionChange={(keys) => handleClosedDaysChange(keys as Set<string>)}
          >
            {weekDays.map((day) => (
              <SelectItem key={day} value={day}>
                {t(day)}
              </SelectItem>
            ))}
          </Select>
        </CardBody>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t('features')}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <Checkbox
              isSelected={formData.features.hasDineIn}
              onValueChange={(checked) =>
                setFormData({
                  ...formData,
                  features: { ...formData.features, hasDineIn: checked },
                })
              }
            >
              {t('hasDineIn')}
            </Checkbox>

            <Checkbox
              isSelected={formData.features.hasTakeaway}
              onValueChange={(checked) =>
                setFormData({
                  ...formData,
                  features: { ...formData.features, hasTakeaway: checked },
                })
              }
            >
              {t('hasTakeaway')}
            </Checkbox>

            <Checkbox
              isSelected={formData.features.hasDelivery}
              onValueChange={(checked) =>
                setFormData({
                  ...formData,
                  features: { ...formData.features, hasDelivery: checked },
                })
              }
            >
              {t('hasDelivery')}
            </Checkbox>

            <Checkbox
              isSelected={formData.features.hasReservation}
              onValueChange={(checked) =>
                setFormData({
                  ...formData,
                  features: { ...formData.features, hasReservation: checked },
                })
              }
            >
              {t('hasReservation')}
            </Checkbox>

            <Checkbox
              isSelected={formData.features.hasQROrdering}
              onValueChange={(checked) =>
                setFormData({
                  ...formData,
                  features: { ...formData.features, hasQROrdering: checked },
                })
              }
            >
              {t('hasQROrdering')}
            </Checkbox>
          </div>
        </CardBody>
      </Card>

      {/* Capacity */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t('capacity')}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            <Input
              type="number"
              label={t('totalTables')}
              placeholder="20"
              value={formData.capacity.totalTables?.toString() || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: {
                    ...formData.capacity,
                    totalTables: parseInt(e.target.value) || undefined,
                  },
                })
              }
            />

            <Input
              type="number"
              label={t('totalSeats')}
              placeholder="80"
              value={formData.capacity.totalSeats?.toString() || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: {
                    ...formData.capacity,
                    totalSeats: parseInt(e.target.value) || undefined,
                  },
                })
              }
            />

            <Input
              type="number"
              label={t('parkingSpaces')}
              placeholder="30"
              value={formData.capacity.parkingSpaces?.toString() || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: {
                    ...formData.capacity,
                    parkingSpaces: parseInt(e.target.value) || undefined,
                  },
                })
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">{t('defaultCurrency')}</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label={t('defaultCurrency')}
            placeholder={t('selectCurrency')}
            selectedKeys={formData.defaultCurrency ? [formData.defaultCurrency] : []}
            onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
            isInvalid={!!errors.defaultCurrency}
            errorMessage={errors.defaultCurrency}
            isRequired
          >
            {currenciesData?.docs
              ?.filter((c) => c.isActive)
              .map((currency) => (
                <SelectItem key={currency.id} value={currency.id}>
                  {currency.name} ({currency.symbol}) {currency.code}
                </SelectItem>
              )) || []}
          </Select>
        </CardBody>
      </Card>

      {/* Active Status */}
      <Card>
        <CardBody>
          <Checkbox
            isSelected={formData.isActive}
            onValueChange={(checked) => setFormData({ ...formData, isActive: checked })}
          >
            {t('isActive')}
          </Checkbox>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="flat" onPress={onCancel} isDisabled={isLoading}>
          {tCommon('cancel')}
        </Button>
        <Button color="primary" type="submit" isLoading={isLoading}>
          {restaurant ? t('updateRestaurant') : t('addRestaurant')}
        </Button>
      </div>
    </form>
  )
}
