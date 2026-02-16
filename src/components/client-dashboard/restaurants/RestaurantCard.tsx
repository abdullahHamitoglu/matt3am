'use client'

import React from 'react'
import { Card, CardBody, CardFooter, Chip, Button, Image } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { Icon } from '@iconify/react'
import { Restaurant, Media } from '@/payload-types'

interface RestaurantCardProps {
  restaurant: Restaurant
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onView,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('restaurants')

  const firstImage = restaurant.images?.[0]
  const imageUrl = firstImage
    ? typeof firstImage.image === 'object' && firstImage.image !== null
      ? (firstImage.image as Media).url
      : undefined
    : undefined

  return (
    <Card className="w-full">
      <CardBody className="p-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
            radius="none"
          />
        )}
        <div className="space-y-3 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{restaurant.name}</h3>
              {restaurant.district && (
                <p className="text-default-500 text-small">{restaurant.district}</p>
              )}
            </div>
            <Chip color={restaurant.isActive ? 'success' : 'danger'} size="sm" variant="flat">
              {restaurant.isActive ? t('active') : t('inactive')}
            </Chip>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-small">
              <Icon icon="mdi:map-marker" width={16} className="text-default-400" />
              <span>{restaurant.city}</span>
            </div>

            <div className="flex items-center gap-2 text-small">
              <Icon icon="mdi:phone" width={16} className="text-default-400" />
              <span>{restaurant.phone}</span>
            </div>

            {restaurant.workingHours?.openTime && restaurant.workingHours?.closeTime && (
              <div className="flex items-center gap-2 text-small">
                <Icon icon="mdi:clock-outline" width={16} className="text-default-400" />
                <span>
                  {restaurant.workingHours.openTime} - {restaurant.workingHours.closeTime}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {restaurant.features?.hasDineIn && (
              <Chip size="sm" color="primary" variant="flat">
                {t('hasDineIn')}
              </Chip>
            )}
            {restaurant.features?.hasTakeaway && (
              <Chip size="sm" color="secondary" variant="flat" className="dark:text-blue-400">
                {t('hasTakeaway')}
              </Chip>
            )}
            {restaurant.features?.hasDelivery && (
              <Chip size="sm" color="success" variant="flat">
                {t('hasDelivery')}
              </Chip>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter className="gap-2">
        {onView && (
          <Button size="sm" variant="flat" onPress={() => onView(restaurant.id)} fullWidth>
            <Icon icon="mdi:eye-outline" width={16} />
            {t('view')}
          </Button>
        )}
        {onEdit && (
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => onEdit(restaurant.id)}
            isIconOnly
          >
            <Icon icon="mdi:pencil-outline" width={16} />
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="flat"
            color="danger"
            isIconOnly
            onPress={() => onDelete(restaurant.id)}
          >
            <Icon icon="mdi:delete-outline" width={16} />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
