'use client'

import React, { useState } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { useTables, useCreateTable } from '@/hooks/tables'
import { Button, Chip, Input, Select, SelectItem, Switch, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import type { Table } from '@/payload-types'

const columns = [
  { name: 'Table Number', uid: 'tableNumber' },
  { name: 'Zone', uid: 'zone' },
  { name: 'Capacity', uid: 'capacity' },
  { name: 'Status', uid: 'status' },
  { name: 'Actions', uid: 'actions' },
]

const zones = [
  { key: 'indoor', label: 'Indoor' },
  { key: 'outdoor', label: 'Outdoor' },
  { key: 'vip', label: 'VIP' },
  { key: 'family', label: 'Family' },
  { key: 'singles', label: 'Singles' },
]

const statuses = [
  { key: 'available', label: 'Available', color: 'success' as const },
  { key: 'reserved', label: 'Reserved', color: 'warning' as const },
  { key: 'occupied', label: 'Occupied', color: 'danger' as const },
  { key: 'cleaning', label: 'Cleaning', color: 'secondary' as const },
  { key: 'unavailable', label: 'Unavailable', color: 'default' as const },
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
            <Icon icon="solar:armchair-bold" className="text-xl text-primary" />
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
            <span className="text-bold text-sm">{item.capacity} seats</span>
            {item.minCapacity && (
              <span className="text-tiny text-default-400">Min: {item.minCapacity}</span>
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
        return cellValue
    }
  }, [])

  const FormFields = () => (
    <div className="flex flex-col gap-4">
      <Input
        label="Table Number"
        placeholder="e.g., T-01, VIP-1"
        value={formData.tableNumber}
        onValueChange={(value) => setFormData({ ...formData, tableNumber: value })}
        isRequired
      />
      <Select
        label="Zone"
        placeholder="Select zone"
        selectedKeys={[formData.zone]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, zone: selected })
        }}
      >
        {zones.map((zone) => (
          <SelectItem key={zone.key}>{zone.label}</SelectItem>
        ))}
      </Select>
      <div className="flex gap-4">
        <Input
          label="Capacity"
          placeholder="Max seats"
          type="number"
          value={formData.capacity.toString()}
          onValueChange={(value) => setFormData({ ...formData, capacity: parseInt(value) || 0 })}
          isRequired
        />
        <Input
          label="Min Capacity"
          placeholder="Min seats"
          type="number"
          value={formData.minCapacity.toString()}
          onValueChange={(value) => setFormData({ ...formData, minCapacity: parseInt(value) || 0 })}
        />
      </div>
      <Select
        label="Status"
        placeholder="Select status"
        selectedKeys={[formData.status]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, status: selected })
        }}
      >
        {statuses.map((status) => (
          <SelectItem key={status.key}>{status.label}</SelectItem>
        ))}
      </Select>
      <Switch
        isSelected={formData.isActive}
        onValueChange={(value) => setFormData({ ...formData, isActive: value })}
      >
        Active
      </Switch>
    </div>
  )

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <h1 className="text-2xl font-bold">Tables</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData(initialFormData)
            createModal.onOpen()
          }}
        >
          Add Table
        </Button>
      </div>

      <GenericTable
        columns={columns}
        data={tables}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Add New Table"
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel="Create"
      >
        <FormFields />
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`Edit Table: ${selectedItem?.tableNumber}`}
        onSubmit={handleEdit}
        submitLabel="Save Changes"
      >
        <FormFields />
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title="Delete Table"
        description={`Are you sure you want to delete table "${selectedItem?.tableNumber}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="danger"
      />
    </div>
  )
}
