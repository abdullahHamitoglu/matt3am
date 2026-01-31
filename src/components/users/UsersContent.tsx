'use client'

import React, { useState } from 'react'
import { GenericTable } from '../common/GenericTable'
import { FormModal } from '../common/FormModal'
import { ConfirmModal } from '../common/ConfirmModal'
import { useUsers, useCreateUser } from '@/hooks/users'
import { useRoles } from '@/hooks/roles'
import {
  Button,
  Chip,
  User as UserAvatar,
  Input,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import type { User, Role } from '@/payload-types'

const columns = [
  { name: 'User', uid: 'name' },
  { name: 'Email', uid: 'email' },
  { name: 'Roles', uid: 'roles' },
  { name: 'Status', uid: 'isActive' },
  { name: 'Actions', uid: 'actions' },
]

const positions = [
  { key: 'manager', label: 'Manager' },
  { key: 'waiter', label: 'Waiter' },
  { key: 'chef', label: 'Chef' },
  { key: 'cashier', label: 'Cashier' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'receptionist', label: 'Receptionist' },
]

interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  roles: string[]
  position: string
  isActive: boolean
}

const initialFormData: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  roles: [],
  position: '',
  isActive: true,
}

export const UsersContent = () => {
  const { data, isLoading, refetch } = useUsers()
  const { data: rolesData } = useRoles()
  const createMutation = useCreateUser()
  const [selectedItem, setSelectedItem] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>(initialFormData)

  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const users = (data?.docs as User[]) || []
  const roles = (rolesData?.docs as Role[]) || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        roles: formData.roles,
        employeeInfo: {
          position: formData.position as any,
        },
        isActive: formData.isActive,
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      refetch()
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        roles: formData.roles,
        employeeInfo: {
          position: formData.position,
        },
        isActive: formData.isActive,
      }
      // Only include password if it's been changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/users/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
      if (response.ok) {
        editModal.onClose()
        setSelectedItem(null)
        setFormData(initialFormData)
        refetch()
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

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
      console.error('Failed to delete user:', error)
    }
  }

  const openEditModal = (item: User) => {
    setSelectedItem(item)
    setFormData({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone || '',
      password: '', // Don't populate password
      roles: (item.roles || []).map((r: any) => (typeof r === 'string' ? r : r.id)),
      position: item.employeeInfo?.position || '',
      isActive: item.isActive ?? true,
    })
    editModal.onOpen()
  }

  const openDeleteModal = (item: User) => {
    setSelectedItem(item)
    deleteModal.onOpen()
  }

  const renderCell = React.useCallback((item: User, columnKey: React.Key) => {
    switch (columnKey) {
      case 'name':
        return (
          <UserAvatar
            name={`${item.firstName} ${item.lastName}`}
            description={item.employeeInfo?.position || 'Staff'}
          />
        )
      case 'email':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{item.email}</p>
            {item.phone && <p className="text-tiny text-default-400">{item.phone}</p>}
          </div>
        )
      case 'roles':
        const userRoles = item.roles || []
        return (
          <div className="flex gap-1 flex-wrap">
            {userRoles.length > 0 ? (
              userRoles.slice(0, 2).map((role: any, idx: number) => (
                <Chip key={idx} size="sm" variant="flat" color="primary">
                  {typeof role === 'string' ? role : role.name}
                </Chip>
              ))
            ) : (
              <Chip size="sm" variant="flat" color="default">
                No roles
              </Chip>
            )}
            {userRoles.length > 2 && (
              <Chip size="sm" variant="flat">
                +{userRoles.length - 2}
              </Chip>
            )}
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

  const FormFields = ({ isEdit = false }) => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>
      <div className="flex gap-4">
        <Input
          label="First Name"
          placeholder="First name"
          value={formData.firstName}
          onValueChange={(value) => setFormData({ ...formData, firstName: value })}
          isRequired
        />
        <Input
          label="Last Name"
          placeholder="Last name"
          value={formData.lastName}
          onValueChange={(value) => setFormData({ ...formData, lastName: value })}
          isRequired
        />
      </div>
      <div className="flex gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onValueChange={(value) => setFormData({ ...formData, email: value })}
          isRequired
        />
        <Input
          label="Phone"
          placeholder="Phone number"
          value={formData.phone}
          onValueChange={(value) => setFormData({ ...formData, phone: value })}
        />
      </div>
      <Input
        label={isEdit ? 'New Password (leave empty to keep current)' : 'Password'}
        type="password"
        placeholder={isEdit ? 'Enter new password...' : 'Password'}
        value={formData.password}
        onValueChange={(value) => setFormData({ ...formData, password: value })}
        isRequired={!isEdit}
      />

      <h3 className="text-lg font-semibold mt-4">Role & Position</h3>
      <Select
        label="Roles"
        placeholder="Select roles"
        selectionMode="multiple"
        selectedKeys={new Set(formData.roles)}
        onSelectionChange={(keys) => {
          setFormData({ ...formData, roles: Array.from(keys) as string[] })
        }}
      >
        {roles.map((role) => (
          <SelectItem key={role.id}>{role.name}</SelectItem>
        ))}
      </Select>
      <Select
        label="Position"
        placeholder="Select position"
        selectedKeys={formData.position ? [formData.position] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, position: selected })
        }}
      >
        {positions.map((pos) => (
          <SelectItem key={pos.key}>{pos.label}</SelectItem>
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
        <h1 className="text-2xl font-bold">System Users</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData(initialFormData)
            createModal.onOpen()
          }}
        >
          Add User
        </Button>
      </div>

      <GenericTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Add New User"
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel="Create"
        size="xl"
      >
        <FormFields isEdit={false} />
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`Edit User: ${selectedItem?.firstName} ${selectedItem?.lastName}`}
        onSubmit={handleEdit}
        submitLabel="Save Changes"
        size="xl"
      >
        <FormFields isEdit={true} />
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedItem?.firstName} ${selectedItem?.lastName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="danger"
      />
    </div>
  )
}
