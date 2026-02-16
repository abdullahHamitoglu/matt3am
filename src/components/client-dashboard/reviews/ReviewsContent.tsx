'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
import { useReviews } from '@/hooks/reviews'
import { Button, Chip, Textarea, useDisclosure, Progress } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import type { Review } from '@/payload-types'

const columns = [
  { name: 'customer', uid: 'customer' },
  { name: 'ratings', uid: 'ratings' },
  { name: 'comment', uid: 'comment' },
  { name: 'status', uid: 'status' },
  { name: 'actions', uid: 'actions' },
]

const statusOptions = [
  { key: 'pending', labelKey: 'pending', color: 'warning' as const },
  { key: 'published', labelKey: 'published', color: 'success' as const },
  { key: 'hidden', labelKey: 'hidden', color: 'default' as const },
  { key: 'deleted', labelKey: 'deleted', color: 'danger' as const },
]

export const ReviewsContent = () => {
  const t = useTranslations('reviewsPage')
  const { data, isLoading, refetch } = useReviews()
  const [selectedItem, setSelectedItem] = useState<Review | null>(null)
  const [responseText, setResponseText] = useState('')

  const viewModal = useDisclosure()
  const respondModal = useDisclosure()
  const deleteModal = useDisclosure()

  const reviews = (data?.docs as Review[]) || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleRespond = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/reviews/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: {
            text: responseText,
            respondedAt: new Date().toISOString(),
          },
        }),
      })
      if (response.ok) {
        respondModal.onClose()
        setSelectedItem(null)
        setResponseText('')
        refetch()
      }
    } catch (error) {
      console.error('Failed to respond to review:', error)
    }
  }

  const handleUpdateStatus = async (item: Review, newStatus: string) => {
    try {
      const response = await fetch(`/api/reviews/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        refetch()
      }
    } catch (error) {
      console.error('Failed to update review status:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/reviews/${selectedItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        deleteModal.onClose()
        setSelectedItem(null)
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  const openViewModal = (item: Review) => {
    setSelectedItem(item)
    viewModal.onOpen()
  }

  const openRespondModal = (item: Review) => {
    setSelectedItem(item)
    setResponseText(item.response?.text || '')
    respondModal.onOpen()
  }

  const openDeleteModal = (item: Review) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const getStatusColor = (status: string) => {
    const found = statusOptions.find((s) => s.key === status)
    return found?.color || 'default'
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'success'
    if (rating >= 3) return 'warning'
    return 'danger'
  }

  const renderCell = React.useCallback((item: Review, columnKey: React.Key) => {
    switch (columnKey) {
      case 'customer':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{item.customer.name}</p>
            <p className="text-default-400 text-tiny">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        )
      case 'ratings':
        return (
          <div className="flex flex-col gap-1 w-24">
            <div className="flex items-center gap-1">
              <Icon icon="solar:star-bold" className="text-warning" />
              <span className="font-semibold">{item.ratings.overall}/5</span>
            </div>
            <Progress
              size="sm"
              color={getRatingColor(item.ratings.overall) as any}
              value={(item.ratings.overall / 5) * 100}
            />
          </div>
        )
      case 'comment':
        return (
          <div className="max-w-xs">
            <p className="text-default-600 text-sm line-clamp-2">
              {item.comment || t('noComment')}
            </p>
            {item.response?.text && (
              <div className="flex items-center gap-1 mt-1">
                <Icon icon="solar:reply-bold" className="text-primary text-sm" />
                <span className="text-primary text-tiny">{t('responded')}</span>
              </div>
            )}
          </div>
        )
      case 'status':
        return (
          <Chip className="capitalize" color={getStatusColor(item.status)} size="sm" variant="flat">
            {item.status}
          </Chip>
        )
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Button isIconOnly size="sm" variant="light" onPress={() => openViewModal(item)}>
              <Icon icon="solar:eye-bold" className="text-default-400" />
            </Button>
            <Button isIconOnly size="sm" variant="light" onPress={() => openRespondModal(item)}>
              <Icon icon="solar:reply-bold" className="text-primary" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => openDeleteModal(item)}
            >
              <Icon icon="solar:trash-bin-trash-bold" className="text-danger" />
            </Button>
          </div>
        )
      default:
        return null
    }
  }, [])

  const ViewContent = () =>
    selectedItem && (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{selectedItem.customer.name}</h3>
            <p className="text-default-400">
              {selectedItem.customer.phone} • {selectedItem.customer.email}
            </p>
          </div>
          <Chip color={selectedItem.verified ? 'success' : 'default'} size="sm" variant="flat">
            {selectedItem.verified ? t('verified') : t('unverified')}
          </Chip>
        </div>

        <div className="gap-4 grid grid-cols-3 bg-default-50 p-4 rounded-lg">
          <div className="text-center">
            <p className="font-bold text-warning text-2xl">{selectedItem.ratings.overall}</p>
            <p className="text-default-400 text-tiny">{t('overall')}</p>
          </div>
          {selectedItem.ratings.food && (
            <div className="text-center">
              <p className="font-semibold text-lg">{selectedItem.ratings.food}</p>
              <p className="text-default-400 text-tiny">{t('food')}</p>
            </div>
          )}
          {selectedItem.ratings.service && (
            <div className="text-center">
              <p className="font-semibold text-lg">{selectedItem.ratings.service}</p>
              <p className="text-default-400 text-tiny">{t('service')}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-2 font-semibold">{t('commentLabel')}</h4>
          <p className="text-default-600">{selectedItem.comment || t('noCommentProvided')}</p>
        </div>

        {selectedItem.response?.text && (
          <div className="bg-primary-50 p-3 rounded-lg">
            <h4 className="mb-2 font-semibold text-primary">{t('yourResponse')}</h4>
            <p className="text-default-600">{selectedItem.response.text}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            color="success"
            variant="flat"
            onPress={() => handleUpdateStatus(selectedItem, 'published')}
            isDisabled={selectedItem.status === 'published'}
          >
            {t('publish')}
          </Button>
          <Button
            color="default"
            variant="flat"
            onPress={() => handleUpdateStatus(selectedItem, 'hidden')}
            isDisabled={selectedItem.status === 'hidden'}
          >
            {t('hide')}
          </Button>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end gap-3">
        <h1 className="font-bold text-2xl">{t('title')}</h1>
        <div className="flex gap-2">
          <Chip color="success" variant="flat">
            {reviews.filter((r) => r.status === 'published').length} {t('published')}
          </Chip>
          <Chip color="warning" variant="flat">
            {reviews.filter((r) => r.status === 'pending').length} {t('pending')}
          </Chip>
        </div>
      </div>

      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={reviews}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      {/* View Modal */}
      <FormModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.onClose}
        title={t('reviewDetails')}
        size="lg"
      >
        <ViewContent />
      </FormModal>

      {/* Respond Modal */}
      <FormModal
        isOpen={respondModal.isOpen}
        onClose={respondModal.onClose}
        title={t('respondTo', { name: selectedItem?.customer.name || '' })}
        onSubmit={handleRespond}
        submitLabel={t('sendResponse')}
      >
        <div className="flex flex-col gap-4">
          <div className="bg-default-50 p-3 rounded-lg">
            <p className="text-default-600">{selectedItem?.comment || t('noComment')}</p>
          </div>
          <Textarea
            label={t('yourResponse')}
            placeholder={t('responsePlaceholder')}
            value={responseText}
            onValueChange={setResponseText}
            minRows={4}
          />
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('deleteReview')}
        description={t('deleteConfirm', { name: selectedItem?.customer.name || '' })}
        confirmLabel={t('deleteReview')}
        confirmColor="danger"
      />
    </div>
  )
}
