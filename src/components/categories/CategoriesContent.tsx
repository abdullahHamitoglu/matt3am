'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/categories'
import {
  Button,
  Chip,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
  Avatar,
  addToast,
  Spinner,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import type { Category, Media } from '@/payload-types'

const columns = [
  { name: 'name', uid: 'name' },
  { name: 'type', uid: 'type' },
  { name: 'displayOrder', uid: 'displayOrder' },
  { name: 'status', uid: 'isActive' },
  { name: 'actions', uid: 'actions' },
]

interface CategoryFormData {
  name: string
  type: 'menu' | 'inventory'
  description: string
  icon: string
  color: string
  displayOrder: number
  parentCategory: string
  isActive: boolean
}

const initialFormData: CategoryFormData = {
  name: '',
  type: 'menu',
  description: '',
  icon: '',
  color: '#3b82f6',
  displayOrder: 0,
  parentCategory: '',
  isActive: true,
}

interface CategoriesContentProps {
  filterType?: 'menu' | 'inventory' | 'all'
}

export const CategoriesContent = ({ filterType = 'menu' }: CategoriesContentProps) => {
  const t = useTranslations('categoriesPage')
  const tCommon = useTranslations('common')

  const { data, isLoading, refetch } = useCategories()

  const [selectedItem, setSelectedItem] = useState<Category | null>(null)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory(selectedItem?.id || '')
  const deleteMutation = useDeleteCategory(selectedItem?.id || '')

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Modal states
  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  // Filter categories based on type
  const categories = useMemo(() => {
    const allCategories = (data?.docs as Category[]) || []
    if (filterType === 'all') return allCategories
    return allCategories.filter((c) => c.type === filterType)
  }, [data?.docs, filterType])

  // Get parent category options (excluding current item)
  const parentCategoryOptions = useMemo(() => {
    const allCategories = (data?.docs as Category[]) || []
    return allCategories.filter((c) => {
      if (filterType !== 'all' && c.type !== filterType) return false
      if (selectedItem && c.id === selectedItem.id) return false
      return true
    })
  }, [data?.docs, filterType, selectedItem])

  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = t('nameRequired')
    }
    if (!formData.type) {
      errors.type = t('typeRequired')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = async () => {
    if (!validateForm()) return

    try {
      await createMutation.mutateAsync({
        ...formData,
        parentCategory: formData.parentCategory || undefined,
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      setFormErrors({})
      refetch()
      addToast({
        title: t('success'),
        description: t('categoryCreated'),
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to create category:', error)
      addToast({
        title: t('error'),
        description: t('createFailed'),
        color: 'danger',
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    if (!validateForm()) return

    try {
      await updateMutation.mutateAsync({
        ...formData,
        parentCategory: formData.parentCategory || undefined,
      })
      editModal.onClose()
      setSelectedItem(null)
      setFormData(initialFormData)
      setFormErrors({})
      refetch()
      addToast({
        title: t('success'),
        description: t('categoryUpdated'),
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to update category:', error)
      addToast({
        title: t('error'),
        description: t('updateFailed'),
        color: 'danger',
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      await deleteMutation.mutateAsync()
      deleteModal.onClose()
      setSelectedItem(null)
      refetch()
      addToast({
        title: t('success'),
        description: t('categoryDeleted'),
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to delete category:', error)
      addToast({
        title: t('error'),
        description: t('deleteFailed'),
        color: 'danger',
      })
    }
  }

  const openEditModal = useCallback(
    (item: Category) => {
      setSelectedItem(item)
      setFormErrors({})
      setFormData({
        name: item.name,
        type: item.type as 'menu' | 'inventory',
        description: item.description || '',
        icon: item.icon || '',
        color: item.color || '#3b82f6',
        displayOrder: item.displayOrder ?? 0,
        parentCategory:
          typeof item.parentCategory === 'string'
            ? item.parentCategory
            : item.parentCategory?.id || '',
        isActive: item.isActive ?? true,
      })
      editModal.onOpen()
    },
    [editModal],
  )

  const openDeleteModal = useCallback(
    (item: Category) => {
      setSelectedItem(item)
      deleteModal.onOpen()
    },
    [deleteModal],
  )

  const renderCell = useCallback(
    (item: Category, columnKey: React.Key) => {
      switch (columnKey) {
        case 'name':
          const imageUrl = (item.image as Media)?.url
          return (
            <div className="flex items-center gap-3">
              <Avatar
                radius="lg"
                size="sm"
                src={imageUrl}
                showFallback
                fallback={
                  item.icon ? (
                    <Icon icon={item.icon} className="text-lg" />
                  ) : (
                    <Icon icon="solar:folder-bold" className="text-lg" />
                  )
                }
                style={{ backgroundColor: item.color || undefined }}
              />
              <div className="flex flex-col">
                <p className="font-medium text-sm">{item.name}</p>
                {item.description && (
                  <p className="text-default-400 text-xs line-clamp-1">{item.description}</p>
                )}
              </div>
            </div>
          )
        case 'type':
          return (
            <Chip size="sm" variant="flat" color={item.type === 'menu' ? 'primary' : 'secondary'}>
              {item.type === 'menu' ? t('menuType') : t('inventoryType')}
            </Chip>
          )
        case 'displayOrder':
          return <span className="text-default-600 text-sm">{item.displayOrder ?? 0}</span>
        case 'isActive':
          return (
            <Chip size="sm" variant="flat" color={item.isActive ? 'success' : 'danger'}>
              {item.isActive ? t('active') : t('inactive')}
            </Chip>
          )
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => openEditModal(item)}
                aria-label={t('edit')}
              >
                <Icon icon="solar:pen-bold" className="text-default-400" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => openDeleteModal(item)}
                aria-label={t('delete')}
              >
                <Icon icon="solar:trash-bin-trash-bold" className="text-danger" />
              </Button>
            </div>
          )
        default:
          const cellValue = item[columnKey as keyof Category]
          return typeof cellValue === 'object' && cellValue !== null
            ? JSON.stringify(cellValue)
            : String(cellValue ?? '')
      }
    },
    [t, openEditModal, openDeleteModal],
  )

  const FormFields = () => {
    return (
      <div className="flex flex-col gap-4">
        {/* Name */}
        <Input
          label={t('name')}
          placeholder={t('namePlaceholder')}
          value={formData.name}
          onValueChange={(value) => {
            setFormData({ ...formData, name: value })
            if (formErrors.name) {
              setFormErrors({ ...formErrors, name: '' })
            }
          }}
          isRequired
          isInvalid={!!formErrors.name}
          errorMessage={formErrors.name}
        />

        {/* Type */}
        <Select
          label={t('type')}
          placeholder={t('selectType')}
          selectedKeys={formData.type ? [formData.type] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as 'menu' | 'inventory'
            setFormData({ ...formData, type: selected })
            if (formErrors.type) {
              setFormErrors({ ...formErrors, type: '' })
            }
          }}
          isRequired
          isInvalid={!!formErrors.type}
          errorMessage={formErrors.type}
        >
          <SelectItem key="menu">{t('menuType')}</SelectItem>
          <SelectItem key="inventory">{t('inventoryType')}</SelectItem>
        </Select>

        {/* Description */}
        <Textarea
          label={t('description')}
          placeholder={t('descriptionPlaceholder')}
          value={formData.description}
          onValueChange={(value) => setFormData({ ...formData, description: value })}
        />

        {/* Icon & Color */}
        <div className="gap-4 grid grid-cols-2">
          <Input
            label={t('icon')}
            placeholder="solar:folder-bold"
            value={formData.icon}
            onValueChange={(value) => setFormData({ ...formData, icon: value })}
            description={t('iconHint')}
            endContent={
              formData.icon ? (
                <Icon icon={formData.icon} className="text-default-400 text-lg" />
              ) : null
            }
          />
          <Input
            label={t('color')}
            type="color"
            value={formData.color}
            onValueChange={(value) => setFormData({ ...formData, color: value })}
            classNames={{
              input: 'h-5 cursor-pointer rounded-xl overflow-hidden p-0',
            }}
          />
        </div>

        {/* Display Order */}
        <Input
          label={t('displayOrder')}
          type="number"
          min={0}
          value={formData.displayOrder === 0 ? '' : formData.displayOrder.toString()}
          onValueChange={(value) => {
            const numValue = value === '' ? 0 : parseInt(value)
            setFormData({ ...formData, displayOrder: isNaN(numValue) ? 0 : numValue })
          }}
          description={t('displayOrderHint')}
        />

        {/* Parent Category */}
        <Select
          label={t('parentCategory')}
          placeholder={t('selectParent')}
          selectedKeys={formData.parentCategory ? [formData.parentCategory] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string
            setFormData({ ...formData, parentCategory: selected || '' })
          }}
        >
          {parentCategoryOptions.map((cat) => (
            <SelectItem key={cat.id}>{cat.name}</SelectItem>
          ))}
        </Select>

        {/* Active Status */}
        <Switch
          isSelected={formData.isActive}
          onValueChange={(value) => setFormData({ ...formData, isActive: value })}
        >
          {t('active')}
        </Switch>
      </div>
    )
  }

  // Translate column names
  const translatedColumns = columns.map((col) => ({
    ...col,
    name: t(col.uid as any) || col.name,
  }))

  const pageTitle =
    filterType === 'menu'
      ? t('menuCategories')
      : filterType === 'inventory'
        ? t('inventoryCategories')
        : t('allCategories')

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end gap-3">
        <h1 className="font-bold text-2xl">{pageTitle}</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData({ ...initialFormData, type: filterType === 'all' ? 'menu' : filterType })
            setFormErrors({})
            createModal.onOpen()
          }}
          aria-label={t('addCategory')}
        >
          {t('addCategory')}
        </Button>
      </div>

      <GenericTable
        columns={translatedColumns}
        data={categories}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
        emptyContent={t('noCategories')}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title={t('addCategory')}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel={tCommon('save')}
        size="2xl"
      >
        <FormFields />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`${t('editCategory')}: ${selectedItem?.name}`}
        onSubmit={handleEdit}
        isLoading={updateMutation.isPending}
        submitLabel={tCommon('save')}
        size="2xl"
      >
        <FormFields />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('deleteCategory')}
        description={`${t('deleteConfirm')} "${selectedItem?.name}"?`}
        confirmLabel={tCommon('delete')}
        confirmColor="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
