'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
import { useUsers } from '@/hooks/users'
import { Button, Chip, User as UserAvatar, Input, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import type { User } from '@/payload-types'

const columns = [
  { name: 'customer', uid: 'name' },
  { name: 'contact', uid: 'contact' },
  { name: 'orders', uid: 'orders' },
  { name: 'status', uid: 'isActive' },
  { name: 'actions', uid: 'actions' },
]

export const CustomersContent = () => {
  const t = useTranslations('customersPage')
  const { data, isLoading, refetch } = useUsers()
  const [selectedItem, setSelectedItem] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const viewModal = useDisclosure()
  const deleteModal = useDisclosure()

  // Filter to show only customers (users without employee roles)
  const customers = ((data?.docs as User[]) || []).filter((user) => {
    // This is a simplified filter - you may want to adjust based on your role structure
    const hasEmployeeRole = user.roles?.some((role: any) => {
      const roleName = typeof role === 'string' ? role : role.name
      return ['manager', 'waiter', 'chef', 'cashier', 'delivery', 'admin'].includes(
        roleName?.toLowerCase() || '',
      )
    })
    return !hasEmployeeRole
  })

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      customer.firstName?.toLowerCase().includes(searchLower) ||
      customer.lastName?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchQuery)
    )
  })

  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/users/${selectedItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        deleteModal.onClose()
        setSelectedItem(null)
        refetch()
      }
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  const openViewModal = (item: User) => {
    setSelectedItem(item)
    viewModal.onOpen()
  }

  const openDeleteModal = (item: User) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const renderCell = React.useCallback((item: User, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return <UserAvatar name={`${item.firstName} ${item.lastName}`} description={item.email} />
      case 'contact':
        return (
          <div className="flex flex-col">
            <p className="text-sm">{item.phone || t('noPhone')}</p>
            <p className="text-default-400 text-tiny">{item.email}</p>
          </div>
        )
      case 'orders':
        // This would ideally come from backend aggregation
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">-</span>
            <span className="text-default-400 text-tiny">{t('orders')}</span>
          </div>
        )
      case 'isActive':
        return (
          <Chip color={item.isActive ? 'success' : 'danger'} size="sm" variant="flat">
            {item.isActive ? t('active') : t('inactive')}
          </Chip>
        )
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Button isIconOnly size="sm" variant="light" onPress={() => openViewModal(item)}>
              <Icon icon="solar:eye-bold" className="text-default-400" />
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
        <div className="flex items-center gap-4">
          <UserAvatar
            name={`${selectedItem.firstName} ${selectedItem.lastName}`}
            description={selectedItem.email}
          />
        </div>

        <div className="gap-4 grid grid-cols-2 bg-default-50 p-4 rounded-lg">
          <div>
            <p className="text-default-400 text-tiny">{t('phone')}</p>
            <p className="font-medium">{selectedItem.phone || t('notProvided')}</p>
          </div>
          <div>
            <p className="text-default-400 text-tiny">{t('emailLabel')}</p>
            <p className="font-medium">{selectedItem.email}</p>
          </div>
          <div>
            <p className="text-default-400 text-tiny">{t('joined')}</p>
            <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-default-400 text-tiny">{t('lastLogin')}</p>
            <p className="font-medium">
              {selectedItem.lastLogin
                ? new Date(selectedItem.lastLogin).toLocaleDateString()
                : t('never')}
            </p>
          </div>
        </div>

        <div className="gap-4 grid grid-cols-3">
          <div className="bg-primary-50 p-4 rounded-lg text-center">
            <p className="font-bold text-primary text-2xl">-</p>
            <p className="text-default-400 text-tiny">{t('totalOrders')}</p>
          </div>
          <div className="bg-success-50 p-4 rounded-lg text-center">
            <p className="font-bold text-success text-2xl">-</p>
            <p className="text-default-400 text-tiny">{t('totalSpent')}</p>
          </div>
          <div className="bg-warning-50 p-4 rounded-lg text-center">
            <p className="font-bold text-warning text-2xl">-</p>
            <p className="text-default-400 text-tiny">{t('loyaltyPoints')}</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end gap-3">
        <h1 className="font-bold text-2xl">{t('title')}</h1>
        <div className="flex items-center gap-3">
          <Input
            className="w-64"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="solar:magnifer-linear" className="text-default-400" />}
            size="sm"
          />
          <Chip color="primary" variant="flat">
            {filteredCustomers.length} {t('total')}
          </Chip>
        </div>
      </div>

      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={filteredCustomers}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      {/* View Modal */}
      <FormModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.onClose}
        title={`${selectedItem?.firstName} ${selectedItem?.lastName}`}
        size="lg"
      >
        <ViewContent />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('deleteCustomer')}
        description={t('deleteConfirm', {
          name: `${selectedItem?.firstName} ${selectedItem?.lastName}`,
        })}
        confirmLabel={t('delete')}
        confirmColor="danger"
      />
    </div>
  )
}
