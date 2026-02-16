'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
import { useReservations, useCreateReservation } from '@/hooks/reservations'
import { Button, Chip, Input, Select, SelectItem, Textarea, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import type { Reservation } from '@/payload-types'

const columns = [
  { name: 'guest', uid: 'customer' },
  { name: 'dateTime', uid: 'reservationDate' },
  { name: 'partySize', uid: 'guestCount' },
  { name: 'status', uid: 'status' },
  { name: 'actions', uid: 'actions' },
]

const statusOptions = [
  { key: 'pending', labelKey: 'pending', color: 'warning' as const },
  { key: 'confirmed', labelKey: 'confirmed', color: 'primary' as const },
  { key: 'seated', labelKey: 'seated', color: 'success' as const },
  { key: 'completed', labelKey: 'completed', color: 'default' as const },
  { key: 'cancelled', labelKey: 'cancelled', color: 'danger' as const },
  { key: 'no-show', labelKey: 'noShow', color: 'danger' as const },
]

interface ReservationFormData {
  customerName: string
  customerPhone: string
  customerEmail: string
  reservationDate: string
  guestCount: number
  childrenCount: number
  status: string
  specialRequests: string
}

const initialFormData: ReservationFormData = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  reservationDate: '',
  guestCount: 2,
  childrenCount: 0,
  status: 'pending',
  specialRequests: '',
}

export const ReservationsContent = () => {
  const t = useTranslations('reservationsPage')
  const { data, isLoading, refetch } = useReservations()
  const createMutation = useCreateReservation()
  const [selectedItem, setSelectedItem] = useState<Reservation | null>(null)
  const [formData, setFormData] = useState<ReservationFormData>(initialFormData)

  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const reservations = (data?.docs as Reservation[]) || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        customer: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || undefined,
        },
        reservationDate: formData.reservationDate,
        guestCount: formData.guestCount,
        childrenCount: formData.childrenCount,
        status: formData.status as any,
        preferences: {
          specialRequests: formData.specialRequests || undefined,
        },
        restaurant: '', // Should be populated based on context
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      refetch()
    } catch (error) {
      console.error('Failed to create reservation:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/reservations/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.customerName,
            phone: formData.customerPhone,
            email: formData.customerEmail || undefined,
          },
          reservationDate: formData.reservationDate,
          guestCount: formData.guestCount,
          childrenCount: formData.childrenCount,
          status: formData.status,
          preferences: {
            specialRequests: formData.specialRequests || undefined,
          },
        }),
      })
      if (response.ok) {
        editModal.onClose()
        setSelectedItem(null)
        setFormData(initialFormData)
        refetch()
      }
    } catch (error) {
      console.error('Failed to update reservation:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/reservations/${selectedItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        deleteModal.onClose()
        setSelectedItem(null)
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete reservation:', error)
    }
  }

  const openEditModal = (item: Reservation) => {
    setSelectedItem(item)
    setFormData({
      customerName: item.customer.name,
      customerPhone: item.customer.phone,
      customerEmail: item.customer.email || '',
      reservationDate: item.reservationDate,
      guestCount: item.guestCount,
      childrenCount: item.childrenCount || 0,
      status: item.status,
      specialRequests: item.preferences?.specialRequests || '',
    })
    editModal.onOpen()
  }

  const openDeleteModal = (item: Reservation) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const getStatusColor = (status: string) => {
    const found = statusOptions.find((s) => s.key === status)
    return found?.color || 'default'
  }

  const renderCell = React.useCallback((item: Reservation, columnKey: React.Key) => {
    switch (columnKey) {
      case 'customer':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{item.customer.name}</p>
            <p className="text-default-400 text-tiny">{item.customer.phone}</p>
          </div>
        )
      case 'reservationDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {new Date(item.reservationDate).toLocaleDateString()}
            </p>
            <p className="text-default-400 text-tiny">
              {new Date(item.reservationDate).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )
      case 'guestCount':
        return (
          <div className="flex items-center gap-2">
            <Icon icon="solar:users-group-rounded-bold" className="text-default-400" />
            <span>
              {item.guestCount}{' '}
              {item.childrenCount ? `(+${item.childrenCount} ${t('childrenSuffix')})` : ''}
            </span>
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
            <Button isIconOnly size="sm" variant="light" onPress={() => openEditModal(item)}>
              <Icon icon="solar:pen-bold" className="text-default-400" />
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

  const FormFields = () => (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-lg">{t('guestInfo')}</h3>
      <Input
        label={t('name')}
        placeholder={t('namePlaceholder')}
        value={formData.customerName}
        onValueChange={(value) => setFormData({ ...formData, customerName: value })}
        isRequired
      />
      <div className="flex gap-4">
        <Input
          label={t('phone')}
          placeholder={t('phonePlaceholder')}
          value={formData.customerPhone}
          onValueChange={(value) => setFormData({ ...formData, customerPhone: value })}
          isRequired
        />
        <Input
          label={t('email')}
          placeholder={t('emailPlaceholder')}
          type="email"
          value={formData.customerEmail}
          onValueChange={(value) => setFormData({ ...formData, customerEmail: value })}
        />
      </div>

      <h3 className="mt-4 font-semibold text-lg">{t('reservationDetails')}</h3>
      <Input
        label={t('dateTimeLabel')}
        type="datetime-local"
        value={formData.reservationDate}
        onValueChange={(value) => setFormData({ ...formData, reservationDate: value })}
        isRequired
      />
      <div className="flex gap-4">
        <Input
          label={t('guests')}
          type="number"
          value={formData.guestCount.toString()}
          onValueChange={(value) => setFormData({ ...formData, guestCount: parseInt(value) || 0 })}
          isRequired
        />
        <Input
          label={t('children')}
          type="number"
          value={formData.childrenCount.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, childrenCount: parseInt(value) || 0 })
          }
        />
      </div>
      <Select
        label={t('status')}
        selectedKeys={[formData.status]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, status: selected })
        }}
      >
        {statusOptions.map((status) => (
          <SelectItem key={status.key}>{t(status.labelKey)}</SelectItem>
        ))}
      </Select>
      <Textarea
        label={t('specialRequests')}
        placeholder={t('specialRequestsPlaceholder')}
        value={formData.specialRequests}
        onValueChange={(value) => setFormData({ ...formData, specialRequests: value })}
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end gap-3">
        <h1 className="font-bold text-2xl">{t('title')}</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData(initialFormData)
            createModal.onOpen()
          }}
        >
          {t('newReservation')}
        </Button>
      </div>

      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={reservations}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title={t('newReservation')}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel={t('create')}
        size="xl"
      >
        <FormFields />
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`${t('editReservation')}: ${selectedItem?.customer.name}`}
        onSubmit={handleEdit}
        submitLabel={t('saveChanges')}
        size="xl"
      >
        <FormFields />
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('cancelReservation')}
        description={t('cancelConfirm', { name: selectedItem?.customer.name || '' })}
        confirmLabel={t('cancelReservation')}
        confirmColor="danger"
      />
    </div>
  )
}
