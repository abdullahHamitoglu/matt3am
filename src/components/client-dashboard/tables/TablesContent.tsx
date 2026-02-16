'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
import { useTables, useCreateTable } from '@/hooks/tables'
import { Button, Chip, Input, Select, SelectItem, Switch, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import type { Table } from '@/payload-types'

const columns = [
  { name: 'tableNumber', uid: 'tableNumber' },
  { name: 'zone', uid: 'zone' },
  { name: 'capacity', uid: 'capacity' },
  { name: 'status', uid: 'status' },
  { name: 'actions', uid: 'actions' },
]

const zones = [
  { key: 'indoor', labelKey: 'indoor' },
  { key: 'outdoor', labelKey: 'outdoor' },
  { key: 'vip', labelKey: 'vip' },
  { key: 'family', labelKey: 'family' },
  { key: 'singles', labelKey: 'singles' },
]

const statuses = [
  { key: 'available', labelKey: 'available', color: 'success' as const },
  { key: 'reserved', labelKey: 'reserved', color: 'warning' as const },
  { key: 'occupied', labelKey: 'occupied', color: 'danger' as const },
  { key: 'cleaning', labelKey: 'cleaning', color: 'secondary' as const },
  { key: 'unavailable', labelKey: 'unavailable', color: 'default' as const },
]

interface TableFormData {
  tableNumber: string
  zone: string
  capacity: number
  minCapacity: number
  status: string
  isActive: boolean
}

const initialFormData: TableFormData = {
  tableNumber: '',
  zone: 'indoor',
  capacity: 4,
  minCapacity: 1,
  status: 'available',
  isActive: true,
}

export const TablesContent = () => {
  const t = useTranslations('tablesPage')
  const { data, isLoading, refetch } = useTables()
  const createMutation = useCreateTable()
  const [selectedItem, setSelectedItem] = useState<Table | null>(null)
  const [formData, setFormData] = useState<TableFormData>(initialFormData)

  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const tables = (data?.docs as Table[]) || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        tableNumber: formData.tableNumber,
        zone: formData.zone as any,
        capacity: formData.capacity,
        minCapacity: formData.minCapacity,
        status: formData.status as any,
        isActive: formData.isActive,
        restaurant: '', // Should be populated based on context
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      refetch()
    } catch (error) {
      console.error('Failed to create table:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/tables/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        editModal.onClose()
        setSelectedItem(null)
        setFormData(initialFormData)
        refetch()
      }
    } catch (error) {
      console.error('Failed to update table:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/tables/${selectedItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        deleteModal.onClose()
        setSelectedItem(null)
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete table:', error)
    }
  }

  const openEditModal = (item: Table) => {
    setSelectedItem(item)
    setFormData({
      tableNumber: item.tableNumber,
      zone: item.zone,
      capacity: item.capacity,
      minCapacity: item.minCapacity || 1,
      status: item.status,
      isActive: item.isActive ?? true,
    })
    editModal.onOpen()
  }

  const openDeleteModal = (item: Table) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const getStatusColor = (status: string) => {
    const found = statuses.find((s) => s.key === status)
    return found?.color || 'default'
  }

  const renderCell = React.useCallback((item: Table, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Table]

    switch (columnKey) {
      case 'tableNumber':
        return (
          <div className="flex items-center gap-2">
            <Icon icon="solar:armchair-bold" className="text-primary text-xl" />
            <span className="font-semibold">{item.tableNumber}</span>
          </div>
        )
      case 'zone':
        return (
          <Chip size="sm" variant="flat" color="secondary" className="capitalize">
            {item.zone}
          </Chip>
        )
      case 'capacity':
        return (
          <div className="flex flex-col">
            <span className="text-bold text-sm">
              {item.capacity} {t('seats')}
            </span>
            {item.minCapacity && (
              <span className="text-default-400 text-tiny">
                {t('minLabel')}: {item.minCapacity}
              </span>
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
        return cellValue as React.ReactNode
    }
  }, [])

  const FormFields = () => (
    <div className="flex flex-col gap-4">
      <Input
        label={t('tableNumber')}
        placeholder={t('tableNumberPlaceholder')}
        value={formData.tableNumber}
        onValueChange={(value) => setFormData({ ...formData, tableNumber: value })}
        isRequired
      />
      <Select
        label={t('zone')}
        placeholder={t('zonePlaceholder')}
        selectedKeys={[formData.zone]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, zone: selected })
        }}
      >
        {zones.map((zone) => (
          <SelectItem key={zone.key}>{t(zone.labelKey)}</SelectItem>
        ))}
      </Select>
      <div className="flex gap-4">
        <Input
          label={t('capacity')}
          placeholder={t('capacityPlaceholder')}
          type="number"
          value={formData.capacity.toString()}
          onValueChange={(value) => setFormData({ ...formData, capacity: parseInt(value) || 0 })}
          isRequired
        />
        <Input
          label={t('minCapacity')}
          placeholder={t('minCapacityPlaceholder')}
          type="number"
          value={formData.minCapacity.toString()}
          onValueChange={(value) => setFormData({ ...formData, minCapacity: parseInt(value) || 0 })}
        />
      </div>
      <Select
        label={t('status')}
        placeholder={t('statusPlaceholder')}
        selectedKeys={[formData.status]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, status: selected })
        }}
      >
        {statuses.map((status) => (
          <SelectItem key={status.key}>{t(status.labelKey)}</SelectItem>
        ))}
      </Select>
      <Switch
        isSelected={formData.isActive}
        onValueChange={(value) => setFormData({ ...formData, isActive: value })}
      >
        {t('active')}
      </Switch>
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
          {t('addTable')}
        </Button>
      </div>

      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={tables}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title={t('addNewTable')}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel={t('create')}
      >
        <FormFields />
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`${t('editTable')}: ${selectedItem?.tableNumber}`}
        onSubmit={handleEdit}
        submitLabel={t('saveChanges')}
      >
        <FormFields />
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('deleteTable')}
        description={t('deleteConfirm', { name: selectedItem?.tableNumber || '' })}
        confirmLabel={t('deleteTable')}
        confirmColor="danger"
      />
    </div>
  )
}
