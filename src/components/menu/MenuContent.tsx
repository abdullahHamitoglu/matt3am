'use client'

import React, { useState } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import {
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from '@/hooks/menu-items'
import { useCategories } from '@/hooks/categories'
import {
  Button,
  Chip,
  User,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import type { MenuItem, Category } from '@/payload-types'

const columns = [
  { name: 'Name', uid: 'name' },
  { name: 'Price', uid: 'price' },
  { name: 'Category', uid: 'category' },
  { name: 'Available', uid: 'isAvailable' },
  { name: 'Actions', uid: 'actions' },
]

interface MenuFormData {
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
  isFeatured: boolean
}

const initialFormData: MenuFormData = {
  name: '',
  description: '',
  price: 0,
  category: '',
  isAvailable: true,
  isFeatured: false,
}

export const MenuContent = () => {
  const { data, isLoading, refetch } = useMenuItems()
  const { data: categoriesData } = useCategories()
  const createMutation = useCreateMenuItem()
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState<MenuFormData>(initialFormData)

  // Modal states
  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const menuItems = (data?.docs as MenuItem[]) || []
  const categories = (categoriesData?.docs as Category[])?.filter((c) => c.type === 'menu') || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        isAvailable: formData.isAvailable,
        isFeatured: formData.isFeatured,
        restaurant: [], // Should be populated based on context
        currency: '', // Should be populated based on context
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      refetch()
    } catch (error) {
      console.error('Failed to create menu item:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    try {
      // Using dynamic hook call pattern
      const response = await fetch(`/api/menu-items/${selectedItem.id}`, {
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
      console.error('Failed to update menu item:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/menu-items/${selectedItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        deleteModal.onClose()
        setSelectedItem(null)
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete menu item:', error)
    }
  }

  const openEditModal = (item: MenuItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: typeof item.category === 'string' ? item.category : item.category?.id || '',
      isAvailable: item.isAvailable ?? true,
      isFeatured: item.isFeatured ?? false,
    })
    editModal.onOpen()
  }

  const openDeleteModal = (item: MenuItem) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const renderCell = React.useCallback((item: MenuItem, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof MenuItem]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: (item.images?.[0]?.image as any)?.url }}
            description={item.description?.substring(0, 50)}
            name={cellValue as string}
          />
        )
      case 'price':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{item.price} SAR</p>
            {item.discountPrice && (
              <p className="text-tiny text-success">{item.discountPrice} SAR</p>
            )}
          </div>
        )
      case 'category':
        return (
          <Chip size="sm" variant="flat" color="primary">
            {(item.category as any)?.name || 'Uncategorized'}
          </Chip>
        )
      case 'isAvailable':
        return (
          <Chip
            className="capitalize"
            color={item.isAvailable ? 'success' : 'danger'}
            size="sm"
            variant="flat"
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
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
        label="Name"
        placeholder="Enter menu item name"
        value={formData.name}
        onValueChange={(value) => setFormData({ ...formData, name: value })}
        isRequired
      />
      <Textarea
        label="Description"
        placeholder="Enter description"
        value={formData.description}
        onValueChange={(value) => setFormData({ ...formData, description: value })}
      />
      <Input
        label="Price"
        placeholder="Enter price"
        type="number"
        value={formData.price.toString()}
        onValueChange={(value) => setFormData({ ...formData, price: parseFloat(value) || 0 })}
        isRequired
        startContent={<span className="text-default-400 text-small">SAR</span>}
      />
      <Select
        label="Category"
        placeholder="Select a category"
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
      <div className="flex gap-4">
        <Switch
          isSelected={formData.isAvailable}
          onValueChange={(value) => setFormData({ ...formData, isAvailable: value })}
        >
          Available
        </Switch>
        <Switch
          isSelected={formData.isFeatured}
          onValueChange={(value) => setFormData({ ...formData, isFeatured: value })}
        >
          Featured
        </Switch>
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData(initialFormData)
            createModal.onOpen()
          }}
        >
          Add New
        </Button>
      </div>

      <GenericTable
        columns={columns}
        data={menuItems}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Add New Menu Item"
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel="Create"
      >
        <FormFields />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`Edit: ${selectedItem?.name}`}
        onSubmit={handleEdit}
        submitLabel="Save Changes"
      >
        <FormFields />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="danger"
      />
    </div>
  )
}
