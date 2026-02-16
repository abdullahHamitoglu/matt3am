'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { RestaurantsTable, RestaurantCard } from '@/components/client-dashboard/restaurants'
import { useRestaurants, useDeleteRestaurant } from '@/hooks/restaurants'

export const RestaurantsContent: React.FC = () => {
  const t = useTranslations('restaurants')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: restaurantsData, isLoading } = useRestaurants({
    where: searchQuery
      ? {
          or: [
            { name: { contains: searchQuery } },
            { city: { contains: searchQuery } },
            { district: { contains: searchQuery } },
          ],
        }
      : undefined,
  })

  const { mutate: deleteRestaurant, isPending: isDeleting } = useDeleteRestaurant(deleteId || '')

  const handleView = (id: string) => {
    router.push(`/dashboard/restaurants/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/restaurants/edit/${id}`)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    onOpen()
  }

  const handleDeleteConfirm = () => {
    if (!deleteId) return

    deleteRestaurant(undefined, {
      onSuccess: () => {
        alert(t('restaurantDeleted'))
        onClose()
        setDeleteId(null)
      },
      onError: (error: any) => {
        alert(error?.message || t('error'))
      },
    })
  }

  const restaurants = restaurantsData?.docs || []

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-2xl">{t('management')}</h1>
            <p className="text-default-500">{t('list')}</p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="mdi:plus" width={20} />}
            onPress={() => router.push('/dashboard/restaurants/create')}
          >
            {t('create')}
          </Button>
        </CardHeader>
      </Card>

      {/* Search & View Toggle */}
      <Card>
        <CardBody>
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
            <Input
              className="max-w-md"
              placeholder={t('branchName')}
              startContent={<Icon icon="mdi:magnify" width={20} />}
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />

            <div className="flex gap-2">
              <Button
                isIconOnly
                variant={viewMode === 'table' ? 'solid' : 'flat'}
                color={viewMode === 'table' ? 'primary' : 'default'}
                onPress={() => setViewMode('table')}
              >
                <Icon icon="mdi:format-list-bulleted" width={20} />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === 'grid' ? 'solid' : 'flat'}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onPress={() => setViewMode('grid')}
              >
                <Icon icon="mdi:view-grid-outline" width={20} />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Content */}
      <Card>
        <CardBody>
          {viewMode === 'table' ? (
            <RestaurantsTable
              restaurants={restaurants}
              isLoading={isLoading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{t('delete')}</ModalHeader>
          <ModalBody>
            <p>{t('deleteConfirm')}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose} isDisabled={isDeleting}>
              {tCommon('cancel')}
            </Button>
            <Button color="danger" onPress={handleDeleteConfirm} isLoading={isDeleting}>
              {t('delete')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
