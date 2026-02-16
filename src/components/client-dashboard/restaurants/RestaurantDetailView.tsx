'use client'

import React from 'react'
import { Card, CardBody, Chip, Divider, Button, Image } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { Icon } from '@iconify/react'
import { Restaurant, Media, Currency } from '@/payload-types'
import { formatCurrency } from '@/lib/currency'

interface RestaurantDetailViewProps {
  restaurant: Restaurant
  onEdit?: (id: string) => void
  onBack?: () => void
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({
  restaurant,
  onEdit,
  onBack,
}) => {
  const t = useTranslations('restaurants')
  const tCommon = useTranslations('common')

  const currency =
    typeof restaurant.defaultCurrency === 'object' && restaurant.defaultCurrency !== null
      ? (restaurant.defaultCurrency as Currency)
      : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button isIconOnly variant="flat" onPress={onBack}>
              <Icon icon="mdi:arrow-left" width={20} />
            </Button>
          )}
          <div>
            <h1 className="font-bold text-2xl">{restaurant.name}</h1>
            {restaurant.district && <p className="text-default-500">{restaurant.district}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Chip color={restaurant.isActive ? 'success' : 'danger'} variant="flat">
            {restaurant.isActive ? t('active') : t('inactive')}
          </Chip>
          {onEdit && (
            <Button
              color="primary"
              onPress={() => onEdit(restaurant.id)}
              startContent={<Icon icon="mdi:pencil-outline" width={18} />}
            >
              {t('edit')}
            </Button>
          )}
        </div>
      </div>

      {/* Images */}
      {restaurant.images && restaurant.images.length > 0 && (
        <Card>
          <CardBody>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              {restaurant.images.map((item, index) => {
                const imageUrl =
                  typeof item.image === 'object' && item.image !== null
                    ? (item.image as Media).url
                    : undefined
                return (
                  <div key={index} className="space-y-2">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={item.caption || restaurant.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    {item.caption && <p className="text-default-500 text-small">{item.caption}</p>}
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Contact & Location */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        <Card>
          <CardBody className="space-y-4">
            <h2 className="font-semibold text-lg">{t('contactInfo')}</h2>
            <Divider />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon icon="mdi:map-marker" width={20} className="mt-1 text-primary" />
                <div>
                  <p className="font-medium">{t('address')}</p>
                  <p className="text-default-500 text-small">{restaurant.address}</p>
                  <p className="text-default-500 text-small">
                    {restaurant.city}
                    {restaurant.district && `, ${restaurant.district}`}
                  </p>
                </div>
              </div>

              {(restaurant.latitude || restaurant.longitude) && (
                <div className="flex items-start gap-3">
                  <Icon icon="mdi:map-marker" width={20} className="mt-1 text-primary" />
                  <div>
                    <p className="font-medium">{t('mapLocation')}</p>
                    <p className="text-default-500 text-small">
                      {restaurant.latitude}, {restaurant.longitude}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Icon icon="mdi:phone" width={20} className="text-primary" />
                <div>
                  <p className="font-medium">{t('phone')}</p>
                  <p className="text-default-500 text-small">{restaurant.phone}</p>
                </div>
              </div>

              {restaurant.email && (
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:email-outline" width={20} className="text-primary" />
                  <div>
                    <p className="font-medium">{t('email')}</p>
                    <p className="text-default-500 text-small">{restaurant.email}</p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <h2 className="font-semibold text-lg">{t('workingHours')}</h2>
            <Divider />

            <div className="space-y-3">
              {restaurant.workingHours?.openTime && restaurant.workingHours?.closeTime && (
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:clock-outline" width={20} className="text-primary" />
                  <div>
                    <p className="font-medium">{t('workingHours')}</p>
                    <p className="text-default-500 text-small">
                      {restaurant.workingHours.openTime} - {restaurant.workingHours.closeTime}
                    </p>
                  </div>
                </div>
              )}

              {restaurant.workingHours?.closedDays &&
                restaurant.workingHours.closedDays.length > 0 && (
                  <div>
                    <p className="mb-2 font-medium">{t('closedDays')}</p>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.workingHours.closedDays.map((day) => (
                        <Chip key={day} size="sm" variant="flat">
                          {t(day)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardBody className="space-y-4">
          <h2 className="font-semibold text-lg">{t('features')}</h2>
          <Divider />

          <div className="flex flex-wrap gap-2">
            {restaurant.features?.hasDineIn && (
              <Chip color="primary" variant="flat">
                {t('hasDineIn')}
              </Chip>
            )}
            {restaurant.features?.hasTakeaway && (
              <Chip color="secondary" variant="flat">
                {t('hasTakeaway')}
              </Chip>
            )}
            {restaurant.features?.hasDelivery && (
              <Chip color="success" variant="flat">
                {t('hasDelivery')}
              </Chip>
            )}
            {restaurant.features?.hasReservation && (
              <Chip color="warning" variant="flat">
                {t('hasReservation')}
              </Chip>
            )}
            {restaurant.features?.hasQROrdering && (
              <Chip color="danger" variant="flat">
                {t('hasQROrdering')}
              </Chip>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Capacity */}
      {(restaurant.capacity?.totalTables ||
        restaurant.capacity?.totalSeats ||
        restaurant.capacity?.parkingSpaces) && (
        <Card>
          <CardBody className="space-y-4">
            <h2 className="font-semibold text-lg">{t('capacity')}</h2>
            <Divider />

            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              {restaurant.capacity.totalTables && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Icon icon="mdi:table-furniture" width={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-default-500 text-small">{t('totalTables')}</p>
                    <p className="font-semibold text-xl">{restaurant.capacity.totalTables}</p>
                  </div>
                </div>
              )}

              {restaurant.capacity.totalSeats && (
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-lg">
                    <Icon icon="mdi:seat-outline" width={24} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-default-500 text-small">{t('totalSeats')}</p>
                    <p className="font-semibold text-xl">{restaurant.capacity.totalSeats}</p>
                  </div>
                </div>
              )}

              {restaurant.capacity.parkingSpaces && (
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 p-2 rounded-lg">
                    <Icon icon="mdi:parking" width={24} className="text-success" />
                  </div>
                  <div>
                    <p className="text-default-500 text-small">{t('parkingSpaces')}</p>
                    <p className="font-semibold text-xl">{restaurant.capacity.parkingSpaces}</p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Currency */}
      {currency && (
        <Card>
          <CardBody>
            <h2 className="mb-2 font-semibold text-lg">{t('defaultCurrency')}</h2>
            <Divider className="mb-4" />
            <div className="flex items-center gap-2">
              <Chip color="primary" variant="flat">
                {currency.name} ({currency.symbol})
              </Chip>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
