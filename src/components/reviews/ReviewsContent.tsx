'use client'

import React, { useState } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { useReviews } from '@/hooks/reviews'
import { Button, Chip, Textarea, useDisclosure, Progress } from '@heroui/react'
import { Icon } from '@iconify/react'
import type { Review } from '@/payload-types'

const columns = [
  { name: 'Customer', uid: 'customer' },
  { name: 'Ratings', uid: 'ratings' },
  { name: 'Comment', uid: 'comment' },
  { name: 'Status', uid: 'status' },
  { name: 'Actions', uid: 'actions' },
]

const statusOptions = [
  { key: 'pending', label: 'Pending', color: 'warning' as const },
  { key: 'published', label: 'Published', color: 'success' as const },
  { key: 'hidden', label: 'Hidden', color: 'default' as const },
  { key: 'deleted', label: 'Deleted', color: 'danger' as const },
]

export const ReviewsContent = () => {
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
            <p className="text-tiny text-default-400">
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
            <p className="text-sm text-default-600 line-clamp-2">{item.comment || 'No comment'}</p>
            {item.response?.text && (
              <div className="mt-1 flex items-center gap-1">
                <Icon icon="solar:reply-bold" className="text-primary text-sm" />
                <span className="text-tiny text-primary">Responded</span>
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
            <h3 className="text-lg font-semibold">{selectedItem.customer.name}</h3>
            <p className="text-default-400">
              {selectedItem.customer.phone} • {selectedItem.customer.email}
            </p>
          </div>
          <Chip color={selectedItem.verified ? 'success' : 'default'} size="sm" variant="flat">
            {selectedItem.verified ? 'Verified' : 'Unverified'}
          </Chip>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-default-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{selectedItem.ratings.overall}</p>
            <p className="text-tiny text-default-400">Overall</p>
          </div>
          {selectedItem.ratings.food && (
            <div className="text-center">
              <p className="text-lg font-semibold">{selectedItem.ratings.food}</p>
              <p className="text-tiny text-default-400">Food</p>
            </div>
          )}
          {selectedItem.ratings.service && (
            <div className="text-center">
              <p className="text-lg font-semibold">{selectedItem.ratings.service}</p>
              <p className="text-tiny text-default-400">Service</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Comment</h4>
          <p className="text-default-600">{selectedItem.comment || 'No comment provided'}</p>
        </div>

        {selectedItem.response?.text && (
          <div className="p-3 bg-primary-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-primary">Your Response</h4>
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
            Publish
          </Button>
          <Button
            color="default"
            variant="flat"
            onPress={() => handleUpdateStatus(selectedItem, 'hidden')}
            isDisabled={selectedItem.status === 'hidden'}
          >
            Hide
          </Button>
        </div>
      </div>
    )

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex gap-2">
          <Chip color="success" variant="flat">
            {reviews.filter((r) => r.status === 'published').length} Published
          </Chip>
          <Chip color="warning" variant="flat">
            {reviews.filter((r) => r.status === 'pending').length} Pending
          </Chip>
        </div>
      </div>

      <GenericTable
        columns={columns}
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
        title="Review Details"
        size="lg"
      >
        <ViewContent />
      </FormModal>

      {/* Respond Modal */}
      <FormModal
        isOpen={respondModal.isOpen}
        onClose={respondModal.onClose}
        title={`Respond to ${selectedItem?.customer.name}`}
        onSubmit={handleRespond}
        submitLabel="Send Response"
      >
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-default-50 rounded-lg">
            <p className="text-default-600">{selectedItem?.comment || 'No comment'}</p>
          </div>
          <Textarea
            label="Your Response"
            placeholder="Write your response to this review..."
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
        title="Delete Review"
        description={`Are you sure you want to delete the review from "${selectedItem?.customer.name}"?`}
        confirmLabel="Delete"
        confirmColor="danger"
      />
    </div>
  )
}
