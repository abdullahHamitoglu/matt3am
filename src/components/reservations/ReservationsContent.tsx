'use client'

import React, { useState } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { useReservations, useCreateReservation } from '@/hooks/reservations'
import { Button, Chip, Input, Select, SelectItem, Textarea, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import type { Reservation } from '@/payload-types'

const columns = [
  { name: 'Guest', uid: 'customer' },
  { name: 'Date & Time', uid: 'reservationDate' },
  { name: 'Party Size', uid: 'guestCount' },
  { name: 'Status', uid: 'status' },
  { name: 'Actions', uid: 'actions' },
]

const statusOptions = [
  { key: 'pending', label: 'Pending', color: 'warning' as const },
  { key: 'confirmed', label: 'Confirmed', color: 'primary' as const },
  { key: 'seated', label: 'Seated', color: 'success' as const },
  { key: 'completed', label: 'Completed', color: 'default' as const },
  { key: 'cancelled', label: 'Cancelled', color: 'danger' as const },
  { key: 'no-show', label: 'No Show', color: 'danger' as const },
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
            <p className="text-tiny text-default-400">{item.customer.phone}</p>
          </div>
        )
      case 'reservationDate':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {new Date(item.reservationDate).toLocaleDateString()}
            </p>
            <p className="text-tiny text-default-400">
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
              {item.guestCount} {item.childrenCount ? `(+${item.childrenCount} children)` : ''}
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
      <h3 className="text-lg font-semibold">Guest Information</h3>
      <Input
        label="Name"
        placeholder="Guest name"
        value={formData.customerName}
        onValueChange={(value) => setFormData({ ...formData, customerName: value })}
        isRequired
      />
      <div className="flex gap-4">
        <Input
          label="Phone"
          placeholder="Phone number"
          value={formData.customerPhone}
          onValueChange={(value) => setFormData({ ...formData, customerPhone: value })}
          isRequired
        />
        <Input
          label="Email"
          placeholder="Email (optional)"
          type="email"
          value={formData.customerEmail}
          onValueChange={(value) => setFormData({ ...formData, customerEmail: value })}
        />
      </div>

      <h3 className="text-lg font-semibold mt-4">Reservation Details</h3>
      <Input
        label="Date & Time"
        type="datetime-local"
        value={formData.reservationDate}
        onValueChange={(value) => setFormData({ ...formData, reservationDate: value })}
        isRequired
      />
      <div className="flex gap-4">
        <Input
          label="Guests"
          type="number"
          value={formData.guestCount.toString()}
          onValueChange={(value) => setFormData({ ...formData, guestCount: parseInt(value) || 0 })}
          isRequired
        />
        <Input
          label="Children"
          type="number"
          value={formData.childrenCount.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, childrenCount: parseInt(value) || 0 })
          }
        />
      </div>
      <Select
        label="Status"
        selectedKeys={[formData.status]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, status: selected })
        }}
      >
        {statusOptions.map((status) => (
          <SelectItem key={status.key}>{status.label}</SelectItem>
        ))}
      </Select>
      <Textarea
        label="Special Requests"
        placeholder="Any special requests or notes..."
        value={formData.specialRequests}
        onValueChange={(value) => setFormData({ ...formData, specialRequests: value })}
      />
    </div>
  )

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData(initialFormData)
            createModal.onOpen()
          }}
        >
          New Reservation
        </Button>
      </div>

      <GenericTable
        columns={columns}
        data={reservations}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="New Reservation"
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel="Create"
        size="xl"
      >
        <FormFields />
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`Edit Reservation: ${selectedItem?.customer.name}`}
        onSubmit={handleEdit}
        submitLabel="Save Changes"
        size="xl"
      >
        <FormFields />
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title="Cancel Reservation"
        description={`Are you sure you want to cancel the reservation for "${selectedItem?.customer.name}"?`}
        confirmLabel="Cancel Reservation"
        confirmColor="danger"
      />
    </div>
  )
}
