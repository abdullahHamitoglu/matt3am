'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
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
import { useTranslations } from 'next-intl'
import type { InventoryItem, Category } from '@/payload-types'

const columns = [
  { name: 'itemName', uid: 'name' },
  { name: 'stockLevel', uid: 'currentStock' },
  { name: 'unit', uid: 'unit' },
  { name: 'cost', uid: 'pricing' },
  { name: 'status', uid: 'status' },
  { name: 'actions', uid: 'actions' },
]

const units = [
  { key: 'kg', labelKey: 'kilogram' },
  { key: 'g', labelKey: 'gram' },
  { key: 'l', labelKey: 'liter' },
  { key: 'ml', labelKey: 'milliliter' },
  { key: 'piece', labelKey: 'piece' },
  { key: 'box', labelKey: 'box' },
  { key: 'bag', labelKey: 'bag' },
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
  const t = useTranslations('inventoryPage')
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
      return { color: 'danger' as const, labelKey: 'lowStock' }
    }
    if (percentage < 50) {
      return { color: 'warning' as const, labelKey: 'medium' }
    }
    return { color: 'success' as const, labelKey: 'inStock' }
  }

  const renderCell = React.useCallback((item: InventoryItem, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{item.name}</p>
            <p className="text-default-400 text-tiny">{item.sku}</p>
          </div>
        )
      case 'currentStock':
        const stockStatus = getStockStatus(item)
        const percentage = Math.min((item.currentStock / (item.lowStockThreshold * 3)) * 100, 100)
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between">
              <span className="font-medium text-sm">{item.currentStock}</span>
              <span className="text-default-400 text-tiny">/ {item.lowStockThreshold * 3}</span>
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
            {t(status.labelKey)}
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
      <h3 className="font-semibold text-lg">{t('basicInfo')}</h3>
      <div className="flex gap-4">
        <Input
          label={t('name')}
          placeholder={t('namePlaceholder')}
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
          isRequired
          className="flex-1"
        />
        <Input
          label={t('sku')}
          placeholder={t('skuPlaceholder')}
          value={formData.sku}
          onValueChange={(value) => setFormData({ ...formData, sku: value })}
          className="w-32"
        />
      </div>
      <Select
        label={t('category')}
        placeholder={t('categoryPlaceholder')}
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

      <h3 className="mt-4 font-semibold text-lg">{t('stockInfo')}</h3>
      <div className="flex gap-4">
        <Input
          label={t('currentStock')}
          type="number"
          value={formData.currentStock.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, currentStock: parseFloat(value) || 0 })
          }
          isRequired
        />
        <Input
          label={t('lowStockThreshold')}
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
          label={t('unit')}
          selectedKeys={[formData.unit]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string
            setFormData({ ...formData, unit: selected })
          }}
        >
          {units.map((unit) => (
            <SelectItem key={unit.key}>{t(unit.labelKey)}</SelectItem>
          ))}
        </Select>
        <Input
          label={t('costPerUnit')}
          type="number"
          value={formData.costPerUnit.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, costPerUnit: parseFloat(value) || 0 })
          }
          startContent={<span className="text-default-400 text-small">SAR</span>}
        />
      </div>

      <h3 className="mt-4 font-semibold text-lg">{t('supplierStorage')}</h3>
      <div className="flex gap-4">
        <Input
          label={t('supplierName')}
          placeholder={t('supplierNamePlaceholder')}
          value={formData.supplierName}
          onValueChange={(value) => setFormData({ ...formData, supplierName: value })}
        />
        <Input
          label={t('supplierPhone')}
          placeholder={t('supplierPhonePlaceholder')}
          value={formData.supplierPhone}
          onValueChange={(value) => setFormData({ ...formData, supplierPhone: value })}
        />
      </div>
      <Input
        label={t('storageLocation')}
        placeholder={t('storageLocationPlaceholder')}
        value={formData.storageLocation}
        onValueChange={(value) => setFormData({ ...formData, storageLocation: value })}
      />
      <Textarea
        label={t('notes')}
        placeholder={t('notesPlaceholder')}
        value={formData.notes}
        onValueChange={(value) => setFormData({ ...formData, notes: value })}
      />
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
          {t('addItem')}
        </Button>
      </div>

      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title={t('addInventoryItem')}
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
        title={`${t('editItem')}: ${selectedItem?.name}`}
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
        title={t('deleteItem')}
        description={t('deleteConfirm', { name: selectedItem?.name || '' })}
        confirmLabel={t('deleteItem')}
        confirmColor="danger"
      />
    </div>
  )
}
