'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
  Spinner,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { Icon } from '@iconify/react'
import { Restaurant } from '@/payload-types'

interface RestaurantsTableProps {
  restaurants: Restaurant[]
  isLoading?: boolean
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const RestaurantsTable: React.FC<RestaurantsTableProps> = ({
  restaurants,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('restaurants')
  const tCommon = useTranslations('common')

  const columns = [
    { key: 'name', label: t('branchName') },
    { key: 'city', label: t('city') },
    { key: 'phone', label: t('phone') },
    { key: 'features', label: t('features') },
    { key: 'isActive', label: t('isActive') },
    { key: 'actions', label: tCommon('actions') },
  ]

  const renderCell = (restaurant: Restaurant, columnKey: React.Key) => {
    const cellValue = restaurant[columnKey as keyof Restaurant]

    switch (columnKey) {
      case 'name':
        return (
          <div className="flex flex-col">
            <p className="font-semibold text-small">{restaurant.name}</p>
            {restaurant.district && (
              <p className="text-default-400 text-tiny">{restaurant.district}</p>
            )}
          </div>
        )
      case 'city':
        return (
          <div className="flex items-center gap-2">
            <Icon icon="mdi:map-marker" width={16} className="text-default-400" />
            <span>{restaurant.city}</span>
          </div>
        )
      case 'phone':
        return (
          <div className="flex items-center gap-2">
            <Icon icon="mdi:phone" width={16} className="text-default-400" />
            <a href={`tel:${restaurant.phone}`} className="text-small">
              {restaurant.phone}
            </a>
          </div>
        )
      case 'features':
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
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
            {restaurant.features?.hasReservation && (
              <Chip size="sm" color="warning" variant="flat">
                {t('hasReservation')}
              </Chip>
            )}
          </div>
        )
      case 'isActive':
        return (
          <Chip color={restaurant.isActive ? 'success' : 'danger'} variant="flat" size="sm">
            {restaurant.isActive ? t('active') : t('inactive')}
          </Chip>
        )
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Tooltip content={t('view')}>
                <Button isIconOnly size="sm" variant="light" onPress={() => onView(restaurant.id)}>
                  <Icon icon="mdi:eye-outline" width={18} />
                </Button>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip content={t('edit')}>
                <Button isIconOnly size="sm" variant="light" onPress={() => onEdit(restaurant.id)}>
                  <Icon icon="mdi:pencil-outline" width={18} />
                </Button>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip content={t('delete')} color="danger">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => onDelete(restaurant.id)}
                >
                  <Icon icon="mdi:delete-outline" width={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        )
      default:
        return cellValue as React.ReactNode
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 h-64">
        <p className="text-default-400">{t('noRestaurants')}</p>
      </div>
    )
  }

  return (
    <Table aria-label="Restaurants table">
      <TableHeader columns={columns}>
        {(column: (typeof columns)[0]) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody items={restaurants}>
        {(item: Restaurant) => (
          <TableRow key={item.id}>
            {(columnKey: React.Key) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
