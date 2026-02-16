'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
import { useCategories, useCreateCategory } from '@/hooks/categories'
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  useDisclosure,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import type { Category } from '@/payload-types'

const columns = [
  { name: 'name', uid: 'name' },
  { name: 'type', uid: 'type' },
  { name: 'displayOrder', uid: 'displayOrder' },
  { name: 'status', uid: 'isActive' },
  { name: 'actions', uid: 'actions' },
]

const categoryTypes = [
  { key: 'menu', labelKey: 'menuType' },
  { key: 'inventory', labelKey: 'inventoryType' },
]

interface CategoryFormData {
  name: string
  type: string
  description: string
  icon: string
  color: string
  displayOrder: number
  isActive: boolean
}

const initialFormData: CategoryFormData = {
  name: '',
  type: 'menu',
  description: '',
  icon: '',
  color: '#F59E0B',
  displayOrder: 0,
  isActive: true,
}

export const CategoriesContent = () => {
  const t = useTranslations('categoriesPage')
  const { data, isLoading, refetch } = useCategories()
  const createMutation = useCreateCategory()
  const [selectedItem, setSelectedItem] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)

  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const items = (data?.docs as Category[]) || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        type: formData.type as any,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      refetch()
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/categories/${selectedItem.id}`, {
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
      console.error('Failed to update category:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/categories/${selectedItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        deleteModal.onClose()
        setSelectedItem(null)
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const openEditModal = (item: Category) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      type: item.type,
      description: item.description || '',
      icon: item.icon || '',
      color: item.color || '#F59E0B',
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive ?? true,
    })
    editModal.onOpen()
  }

  const openDeleteModal = (item: Category) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const renderCell = React.useCallback((item: Category, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex items-center gap-2">
            {item.color && (
              <div className="rounded-full w-4 h-4" style={{ backgroundColor: item.color }} />
            )}
            <div className="flex flex-col">
              <p className="text-bold text-sm">{item.name}</p>
              {item.description && (
                <p className="text-default-400 text-tiny">{item.description.substring(0, 40)}...</p>
              )}
            </div>
          </div>
        )
      case 'type':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.type === 'menu' ? 'primary' : 'secondary'}
            className="capitalize"
          >
            {item.type === 'menu' ? t('menuType') : t('inventoryType')}
          </Chip>
        )
      case 'displayOrder':
        return <span className="text-sm">{item.displayOrder || 0}</span>
      case 'isActive':
        return (
          <Chip color={item.isActive ? 'success' : 'default'} size="sm" variant="flat">
            {item.isActive ? t('active') : t('inactive')}
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
      <Input
        label={t('name')}
        placeholder={t('namePlaceholder')}
        value={formData.name}
        onValueChange={(value) => setFormData({ ...formData, name: value })}
        isRequired
      />
      <Select
        label={t('type')}
        selectedKeys={[formData.type]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, type: selected })
        }}
      >
        {categoryTypes.map((type) => (
          <SelectItem key={type.key}>{t(type.labelKey)}</SelectItem>
        ))}
      </Select>
      <Textarea
        label={t('description')}
        placeholder={t('descriptionPlaceholder')}
        value={formData.description}
        onValueChange={(value) => setFormData({ ...formData, description: value })}
      />
      <div className="flex gap-4">
        <Input
          label={t('icon')}
          placeholder={t('iconHint')}
          value={formData.icon}
          onValueChange={(value) => setFormData({ ...formData, icon: value })}
        />
        <Input
          label={t('color')}
          type="color"
          value={formData.color}
          onValueChange={(value) => setFormData({ ...formData, color: value })}
          className="w-24"
        />
      </div>
      <Input
        label={t('displayOrder')}
        type="number"
        value={formData.displayOrder.toString()}
        onValueChange={(value) => setFormData({ ...formData, displayOrder: parseInt(value) || 0 })}
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
          {t('addCategory')}
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
        title={t('addCategory')}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel={t('create')}
      >
        <FormFields />
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`${t('editCategory')}: ${selectedItem?.name}`}
        onSubmit={handleEdit}
        submitLabel={t('edit')}
      >
        <FormFields />
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('deleteCategory')}
        description={t('deleteConfirm', { name: selectedItem?.name || '' })}
        confirmLabel={t('delete')}
        confirmColor="danger"
      />
    </div>
  )
}
