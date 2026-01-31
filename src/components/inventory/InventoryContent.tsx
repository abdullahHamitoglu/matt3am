'use client'

import React, { useState } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { useInventoryItems, useCreateInventoryItem } from '@/hooks/inventory-items'
import { useCategories } from '@/hooks/categories'
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  useDisclosure,
  Progress,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import type { InventoryItem, Category } from '@/payload-types'

const columns = [
  { name: 'Item', uid: 'name' },
  { name: 'Stock Level', uid: 'currentStock' },
  { name: 'Unit', uid: 'unit' },
  { name: 'Cost', uid: 'pricing' },
  { name: 'Status', uid: 'status' },
  { name: 'Actions', uid: 'actions' },
]

const units = [
  { key: 'kg', label: 'Kilogram (kg)' },
  { key: 'g', label: 'Gram (g)' },
  { key: 'l', label: 'Liter (l)' },
  { key: 'ml', label: 'Milliliter (ml)' },
  { key: 'piece', label: 'Piece' },
  { key: 'box', label: 'Box' },
  { key: 'bag', label: 'Bag' },
]

interface InventoryFormData {
  name: string
  sku: string
  category: string
  currentStock: number
  lowStockThreshold: number
  unit: string
  costPerUnit: number
  supplierName: string
  supplierPhone: string
  storageLocation: string
  notes: string
  isActive: boolean
}

const initialFormData: InventoryFormData = {
  name: '',
  sku: '',
  category: '',
  currentStock: 0,
  lowStockThreshold: 10,
  unit: 'piece',
  costPerUnit: 0,
  supplierName: '',
  supplierPhone: '',
  storageLocation: '',
  notes: '',
  isActive: true,
}

export const InventoryContent = () => {
  const { data, isLoading, refetch } = useInventoryItems()
  const { data: categoriesData } = useCategories()
  const createMutation = useCreateInventoryItem()
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [formData, setFormData] = useState<InventoryFormData>(initialFormData)

  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const items = (data?.docs as InventoryItem[]) || []
  const categories =
    (categoriesData?.docs as Category[])?.filter((c) => c.type === 'inventory') || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        currentStock: formData.currentStock,
        lowStockThreshold: formData.lowStockThreshold,
        unit: formData.unit as any,
        pricing: {
          costPerUnit: formData.costPerUnit,
          currency: '', // Should be populated based on context
        },
        supplier: {
          supplierName: formData.supplierName,
          supplierPhone: formData.supplierPhone,
        },
        storageInfo: {
          storageLocation: formData.storageLocation,
        },
        notes: formData.notes,
        isActive: formData.isActive,
        restaurant: '', // Should be populated based on context
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      refetch()
    } catch (error) {
      console.error('Failed to create inventory item:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/inventory-items/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          currentStock: formData.currentStock,
          lowStockThreshold: formData.lowStockThreshold,
          unit: formData.unit,
          pricing: {
            costPerUnit: formData.costPerUnit,
          },
          supplier: {
            supplierName: formData.supplierName,
            supplierPhone: formData.supplierPhone,
          },
          storageInfo: {
            storageLocation: formData.storageLocation,
          },
          notes: formData.notes,
          isActive: formData.isActive,
        }),
      })
      if (response.ok) {
        editModal.onClose()
        setSelectedItem(null)
        setFormData(initialFormData)
        refetch()
      }
    } catch (error) {
      console.error('Failed to update inventory item:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/inventory-items/${selectedItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        deleteModal.onClose()
        setSelectedItem(null)
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete inventory item:', error)
    }
  }

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      sku: item.sku || '',
      category: typeof item.category === 'string' ? item.category : item.category?.id || '',
      currentStock: item.currentStock,
      lowStockThreshold: item.lowStockThreshold,
      unit: item.unit,
      costPerUnit: item.pricing?.costPerUnit || 0,
      supplierName: item.supplier?.supplierName || '',
      supplierPhone: item.supplier?.supplierPhone || '',
      storageLocation: item.storageInfo?.storageLocation || '',
      notes: item.notes || '',
      isActive: item.isActive ?? true,
    })
    editModal.onOpen()
  }

  const openDeleteModal = (item: InventoryItem) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / (item.lowStockThreshold * 3)) * 100
    if (item.currentStock <= item.lowStockThreshold) {
      return { color: 'danger' as const, label: 'Low Stock' }
    }
    if (percentage < 50) {
      return { color: 'warning' as const, label: 'Medium' }
    }
    return { color: 'success' as const, label: 'In Stock' }
  }

  const renderCell = React.useCallback((item: InventoryItem, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{item.name}</p>
            <p className="text-tiny text-default-400">{item.sku}</p>
          </div>
        )
      case 'currentStock':
        const stockStatus = getStockStatus(item)
        const percentage = Math.min((item.currentStock / (item.lowStockThreshold * 3)) * 100, 100)
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{item.currentStock}</span>
              <span className="text-tiny text-default-400">/ {item.lowStockThreshold * 3}</span>
            </div>
            <Progress size="sm" color={stockStatus.color} value={percentage} />
          </div>
        )
      case 'unit':
        return (
          <Chip size="sm" variant="flat">
            {item.unit}
          </Chip>
        )
      case 'pricing':
        return (
          <span className="text-sm">
            {item.pricing?.costPerUnit || 0} SAR/{item.unit}
          </span>
        )
      case 'status':
        const status = getStockStatus(item)
        return (
          <Chip color={status.color} size="sm" variant="flat">
            {status.label}
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
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="flex gap-4">
        <Input
          label="Name"
          placeholder="Item name"
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
          isRequired
          className="flex-1"
        />
        <Input
          label="SKU"
          placeholder="Unique code"
          value={formData.sku}
          onValueChange={(value) => setFormData({ ...formData, sku: value })}
          className="w-32"
        />
      </div>
      <Select
        label="Category"
        placeholder="Select category"
        selectedKeys={formData.category ? [formData.category] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, category: selected })
        }}
      >
        {categories.map((cat) => (
          <SelectItem key={cat.id}>{cat.name}</SelectItem>
        ))}
      </Select>

      <h3 className="text-lg font-semibold mt-4">Stock Information</h3>
      <div className="flex gap-4">
        <Input
          label="Current Stock"
          type="number"
          value={formData.currentStock.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, currentStock: parseFloat(value) || 0 })
          }
          isRequired
        />
        <Input
          label="Low Stock Threshold"
          type="number"
          value={formData.lowStockThreshold.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, lowStockThreshold: parseFloat(value) || 0 })
          }
          isRequired
        />
      </div>
      <div className="flex gap-4">
        <Select
          label="Unit"
          selectedKeys={[formData.unit]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string
            setFormData({ ...formData, unit: selected })
          }}
        >
          {units.map((unit) => (
            <SelectItem key={unit.key}>{unit.label}</SelectItem>
          ))}
        </Select>
        <Input
          label="Cost per Unit"
          type="number"
          value={formData.costPerUnit.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, costPerUnit: parseFloat(value) || 0 })
          }
          startContent={<span className="text-default-400 text-small">SAR</span>}
        />
      </div>

      <h3 className="text-lg font-semibold mt-4">Supplier & Storage</h3>
      <div className="flex gap-4">
        <Input
          label="Supplier Name"
          placeholder="Supplier name"
          value={formData.supplierName}
          onValueChange={(value) => setFormData({ ...formData, supplierName: value })}
        />
        <Input
          label="Supplier Phone"
          placeholder="Phone number"
          value={formData.supplierPhone}
          onValueChange={(value) => setFormData({ ...formData, supplierPhone: value })}
        />
      </div>
      <Input
        label="Storage Location"
        placeholder="e.g., Refrigerator, Dry Storage"
        value={formData.storageLocation}
        onValueChange={(value) => setFormData({ ...formData, storageLocation: value })}
      />
      <Textarea
        label="Notes"
        placeholder="Additional notes..."
        value={formData.notes}
        onValueChange={(value) => setFormData({ ...formData, notes: value })}
      />
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
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData(initialFormData)
            createModal.onOpen()
          }}
        >
          Add Item
        </Button>
      </div>

      <GenericTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Add Inventory Item"
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
        title={`Edit: ${selectedItem?.name}`}
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
        title="Delete Inventory Item"
        description={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="danger"
      />
    </div>
  )
}
