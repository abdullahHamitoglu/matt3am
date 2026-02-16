'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
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
import { useTranslations } from 'next-intl'
import type { User, Role } from '@/payload-types'

const columns = [
  { name: 'user', uid: 'name' },
  { name: 'email', uid: 'email' },
  { name: 'roles', uid: 'roles' },
  { name: 'status', uid: 'isActive' },
  { name: 'actions', uid: 'actions' },
]

const positions = [
  { key: 'manager', labelKey: 'manager' },
  { key: 'waiter', labelKey: 'waiter' },
  { key: 'chef', labelKey: 'chef' },
  { key: 'cashier', labelKey: 'cashier' },
  { key: 'delivery', labelKey: 'delivery' },
  { key: 'receptionist', labelKey: 'receptionist' },
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
  const t = useTranslations('usersPage')
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
            description={item.employeeInfo?.position ? t(item.employeeInfo.position) : t('staff')}
          />
        )
      case 'email':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{item.email}</p>
            {item.phone && <p className="text-default-400 text-tiny">{item.phone}</p>}
          </div>
        )
      case 'roles':
        const userRoles = item.roles || []
        return (
          <div className="flex flex-wrap gap-1">
            {userRoles.length > 0 ? (
              userRoles.slice(0, 2).map((role: any, idx: number) => (
                <Chip key={idx} size="sm" variant="flat" color="primary">
                  {typeof role === 'string' ? role : role.name}
                </Chip>
              ))
            ) : (
              <Chip size="sm" variant="flat" color="default">
                {t('noRoles')}
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

  const FormFields = ({ isEdit = false }) => (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-lg">{t('personalInfo')}</h3>
      <div className="flex gap-4">
        <Input
          label={t('firstName')}
          placeholder={t('firstNamePlaceholder')}
          value={formData.firstName}
          onValueChange={(value) => setFormData({ ...formData, firstName: value })}
          isRequired
        />
        <Input
          label={t('lastName')}
          placeholder={t('lastNamePlaceholder')}
          value={formData.lastName}
          onValueChange={(value) => setFormData({ ...formData, lastName: value })}
          isRequired
        />
      </div>
      <div className="flex gap-4">
        <Input
          label={t('email')}
          type="email"
          placeholder={t('emailPlaceholder')}
          value={formData.email}
          onValueChange={(value) => setFormData({ ...formData, email: value })}
          isRequired
        />
        <Input
          label={t('phone')}
          placeholder={t('phonePlaceholder')}
          value={formData.phone}
          onValueChange={(value) => setFormData({ ...formData, phone: value })}
        />
      </div>
      <Input
        label={isEdit ? t('newPasswordLabel') : t('password')}
        type="password"
        placeholder={isEdit ? t('newPasswordPlaceholder') : t('password')}
        value={formData.password}
        onValueChange={(value) => setFormData({ ...formData, password: value })}
        isRequired={!isEdit}
      />

      <h3 className="mt-4 font-semibold text-lg">{t('roleAndPosition')}</h3>
      <Select
        label={t('roles')}
        placeholder={t('rolesPlaceholder')}
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
        label={t('position')}
        placeholder={t('positionPlaceholder')}
        selectedKeys={formData.position ? [formData.position] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string
          setFormData({ ...formData, position: selected })
        }}
      >
        {positions.map((pos) => (
          <SelectItem key={pos.key}>{t(pos.labelKey)}</SelectItem>
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
          {t('addUser')}
        </Button>
      </div>

      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={users}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title={t('addNewUser')}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel={t('create')}
        size="xl"
      >
        <FormFields isEdit={false} />
      </FormModal>

      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`${t('editUser')}: ${selectedItem?.firstName} ${selectedItem?.lastName}`}
        onSubmit={handleEdit}
        submitLabel={t('saveChanges')}
        size="xl"
      >
        <FormFields isEdit={true} />
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('deleteUser')}
        description={t('deleteConfirm', {
          name: `${selectedItem?.firstName} ${selectedItem?.lastName}`,
        })}
        confirmLabel={t('delete')}
        confirmColor="danger"
      />
    </div>
  )
}
