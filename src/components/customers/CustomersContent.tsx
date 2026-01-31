'use client'

import React, { useState } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { useUsers } from '@/hooks/users'
import { Button, Chip, User as UserAvatar, Input, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import type { User } from '@/payload-types'

const columns = [
  { name: 'Customer', uid: 'name' },
  { name: 'Contact', uid: 'contact' },
  { name: 'Orders', uid: 'orders' },
  { name: 'Status', uid: 'isActive' },
  { name: 'Actions', uid: 'actions' },
]

export const CustomersContent = () => {
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
            <p className="text-sm">{item.phone || 'No phone'}</p>
            <p className="text-tiny text-default-400">{item.email}</p>
          </div>
        )
      case 'orders':
        // This would ideally come from backend aggregation
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">-</span>
            <span className="text-tiny text-default-400">Orders</span>
          </div>
        )
      case 'isActive':
        return (
          <Chip color={item.isActive ? 'success' : 'danger'} size="sm" variant="flat">
            {item.isActive ? 'Active' : 'Inactive'}
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

        <div className="grid grid-cols-2 gap-4 p-4 bg-default-50 rounded-lg">
          <div>
            <p className="text-tiny text-default-400">Phone</p>
            <p className="font-medium">{selectedItem.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-tiny text-default-400">Email</p>
            <p className="font-medium">{selectedItem.email}</p>
          </div>
          <div>
            <p className="text-tiny text-default-400">Joined</p>
            <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-tiny text-default-400">Last Login</p>
            <p className="font-medium">
              {selectedItem.lastLogin
                ? new Date(selectedItem.lastLogin).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <p className="text-2xl font-bold text-primary">-</p>
            <p className="text-tiny text-default-400">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-2xl font-bold text-success">-</p>
            <p className="text-tiny text-default-400">Total Spent</p>
          </div>
          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <p className="text-2xl font-bold text-warning">-</p>
            <p className="text-tiny text-default-400">Loyalty Points</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex gap-3 items-center">
          <Input
            className="w-64"
            placeholder="Search customers..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="solar:magnifer-linear" className="text-default-400" />}
            size="sm"
          />
          <Chip color="primary" variant="flat">
            {filteredCustomers.length} Total
          </Chip>
        </div>
      </div>

      <GenericTable
        columns={columns}
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
        title="Delete Customer"
        description={`Are you sure you want to delete "${selectedItem?.firstName} ${selectedItem?.lastName}"? This will also delete their order history.`}
        confirmLabel="Delete"
        confirmColor="danger"
      />
    </div>
  )
}
