'use client'

import React, { useState } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
import { useLoyaltyPrograms, useCreateLoyaltyProgram } from '@/hooks/loyalty-program'
import {
  Button,
  Chip,
  User,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Card,
  CardBody,
  Progress,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import type { LoyaltyProgram } from '@/payload-types'

const columns = [
  { name: 'member', uid: 'customer' },
  { name: 'membershipId', uid: 'membershipId' },
  { name: 'points', uid: 'points' },
  { name: 'tier', uid: 'tier' },
  { name: 'status', uid: 'status' },
  { name: 'actions', uid: 'actions' },
]

const tiers = [
  { key: 'bronze', labelKey: 'bronze', color: 'default' as const, minPoints: 0 },
  { key: 'silver', labelKey: 'silver', color: 'secondary' as const, minPoints: 500 },
  { key: 'gold', labelKey: 'gold', color: 'warning' as const, minPoints: 1500 },
  { key: 'platinum', labelKey: 'platinum', color: 'primary' as const, minPoints: 5000 },
  { key: 'vip', labelKey: 'vip', color: 'danger' as const, minPoints: 10000 },
]

const statusOptions = [
  { key: 'active', labelKey: 'active', color: 'success' as const },
  { key: 'suspended', labelKey: 'suspended', color: 'warning' as const },
  { key: 'cancelled', labelKey: 'cancelled', color: 'danger' as const },
]

interface LoyaltyFormData {
  customerName: string
  customerPhone: string
  customerEmail: string
  customerDob: string
  tier: string
  status: string
}

const initialFormData: LoyaltyFormData = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  customerDob: '',
  tier: 'bronze',
  status: 'active',
}

export const LoyaltyProgramContent = () => {
  const t = useTranslations('loyaltyPage')
  const { data, isLoading, refetch } = useLoyaltyPrograms()
  const createMutation = useCreateLoyaltyProgram()
  const [selectedItem, setSelectedItem] = useState<LoyaltyProgram | null>(null)
  const [formData, setFormData] = useState<LoyaltyFormData>(initialFormData)
  const [adjustPoints, setAdjustPoints] = useState({ points: 0, description: '' })

  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const viewModal = useDisclosure()
  const adjustModal = useDisclosure()

  const members = (data?.docs as LoyaltyProgram[]) || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        customer: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || undefined,
          dateOfBirth: formData.customerDob || undefined,
        },
        membershipId: `LYL-${Date.now()}`, // Auto-generate
        currentPoints: 0,
        lifetimePoints: 0,
        redeemedPoints: 0,
        tier: formData.tier as any,
        status: formData.status as any,
        joinDate: new Date().toISOString(),
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      refetch()
    } catch (error) {
      console.error('Failed to create loyalty member:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return
    try {
      const response = await fetch(`/api/loyalty-program/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.customerName,
            phone: formData.customerPhone,
            email: formData.customerEmail || undefined,
            dateOfBirth: formData.customerDob || undefined,
          },
          tier: formData.tier,
          status: formData.status,
        }),
      })
      if (response.ok) {
        editModal.onClose()
        setSelectedItem(null)
        setFormData(initialFormData)
        refetch()
      }
    } catch (error) {
      console.error('Failed to update loyalty member:', error)
    }
  }

  const handleAdjustPoints = async () => {
    if (!selectedItem) return
    try {
      const newPoints = (selectedItem.currentPoints || 0) + adjustPoints.points
      const newLifetime =
        adjustPoints.points > 0
          ? (selectedItem.lifetimePoints || 0) + adjustPoints.points
          : selectedItem.lifetimePoints

      const response = await fetch(`/api/loyalty-program/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPoints: newPoints,
          lifetimePoints: newLifetime,
          lastActivity: new Date().toISOString(),
          pointsHistory: [
            ...(selectedItem.pointsHistory || []),
            {
              type: adjustPoints.points > 0 ? 'earned' : 'adjusted',
              points: adjustPoints.points,
              balance: newPoints,
              date: new Date().toISOString(),
              description: adjustPoints.description,
            },
          ],
        }),
      })
      if (response.ok) {
        adjustModal.onClose()
        setSelectedItem(null)
        setAdjustPoints({ points: 0, description: '' })
        refetch()
      }
    } catch (error) {
      console.error('Failed to adjust points:', error)
    }
  }

  const openEditModal = (item: LoyaltyProgram) => {
    setSelectedItem(item)
    setFormData({
      customerName: item.customer.name,
      customerPhone: item.customer.phone,
      customerEmail: item.customer.email || '',
      customerDob: item.customer.dateOfBirth || '',
      tier: item.tier,
      status: item.status,
    })
    editModal.onOpen()
  }

  const openViewModal = (item: LoyaltyProgram) => {
    setSelectedItem(item)
    viewModal.onOpen()
  }

  const openAdjustModal = (item: LoyaltyProgram) => {
    setSelectedItem(item)
    setAdjustPoints({ points: 0, description: '' })
    adjustModal.onOpen()
  }

  const getTierColor = (tier: string) => {
    const found = tiers.find((t) => t.key === tier)
    return found?.color || 'default'
  }

  const getStatusColor = (status: string) => {
    const found = statusOptions.find((s) => s.key === status)
    return found?.color || 'default'
  }

  const getNextTier = (tier: string): { tier: string; pointsNeeded: number } | null => {
    const currentIndex = tiers.findIndex((t) => t.key === tier)
    if (currentIndex < tiers.length - 1) {
      return {
        tier: tiers[currentIndex + 1].labelKey,
        pointsNeeded: tiers[currentIndex + 1].minPoints,
      }
    }
    return null
  }

  const renderCell = React.useCallback((item: LoyaltyProgram, columnKey: React.Key) => {
    switch (columnKey) {
      case 'customer':
        return <User name={item.customer.name} description={item.customer.phone} />
      case 'membershipId':
        return <span className="font-mono text-sm">{item.membershipId}</span>
      case 'points':
        return (
          <div className="flex flex-col">
            <span className="font-bold text-primary">{item.currentPoints || 0}</span>
            <span className="text-default-400 text-tiny">
              {t('lifetime')}: {item.lifetimePoints || 0}
            </span>
          </div>
        )
      case 'tier':
        return (
          <Chip color={getTierColor(item.tier)} size="sm" variant="flat" className="capitalize">
            {item.tier}
          </Chip>
        )
      case 'status':
        return (
          <Chip color={getStatusColor(item.status)} size="sm" variant="flat" className="capitalize">
            {item.status}
          </Chip>
        )
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Button isIconOnly size="sm" variant="light" onPress={() => openViewModal(item)}>
              <Icon icon="solar:eye-bold" className="text-default-400" />
            </Button>
            <Button isIconOnly size="sm" variant="light" onPress={() => openAdjustModal(item)}>
              <Icon icon="solar:star-bold" className="text-warning" />
            </Button>
            <Button isIconOnly size="sm" variant="light" onPress={() => openEditModal(item)}>
              <Icon icon="solar:pen-bold" className="text-default-400" />
            </Button>
          </div>
        )
      default:
        return null
    }
  }, [])

  const FormFields = () => (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-lg">{t('memberInfo')}</h3>
      <Input
        label={t('name')}
        placeholder={t('namePlaceholder')}
        value={formData.customerName}
        onValueChange={(value) => setFormData({ ...formData, customerName: value })}
        isRequired
      />
      <div className="flex gap-4">
        <Input
          label={t('phone')}
          placeholder={t('phonePlaceholder')}
          value={formData.customerPhone}
          onValueChange={(value) => setFormData({ ...formData, customerPhone: value })}
          isRequired
        />
        <Input
          label={t('email')}
          type="email"
          placeholder={t('emailPlaceholder')}
          value={formData.customerEmail}
          onValueChange={(value) => setFormData({ ...formData, customerEmail: value })}
        />
      </div>
      <Input
        label={t('dateOfBirth')}
        type="date"
        value={formData.customerDob}
        onValueChange={(value) => setFormData({ ...formData, customerDob: value })}
      />

      <h3 className="mt-4 font-semibold text-lg">{t('membershipSettings')}</h3>
      <div className="flex gap-4">
        <Select
          label={t('tier')}
          selectedKeys={[formData.tier]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string
            setFormData({ ...formData, tier: selected })
          }}
        >
          {tiers.map((tier) => (
            <SelectItem key={tier.key}>{t(tier.labelKey)}</SelectItem>
          ))}
        </Select>
        <Select
          label={t('status')}
          selectedKeys={[formData.status]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string
            setFormData({ ...formData, status: selected })
          }}
        >
          {statusOptions.map((status) => (
            <SelectItem key={status.key}>{t(status.labelKey)}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  )

  const ViewContent = () =>
    selectedItem && (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl">{selectedItem.customer.name}</h3>
            <p className="text-default-400">
              {selectedItem.customer.phone} • {selectedItem.customer.email}
            </p>
            <p className="mt-1 font-mono text-sm">{selectedItem.membershipId}</p>
          </div>
          <Chip
            color={getTierColor(selectedItem.tier)}
            size="lg"
            variant="flat"
            className="capitalize"
          >
            {selectedItem.tier}
          </Chip>
        </div>

        <div className="gap-4 grid grid-cols-3">
          <Card>
            <CardBody className="text-center">
              <p className="font-bold text-primary text-3xl">{selectedItem.currentPoints || 0}</p>
              <p className="text-default-400 text-tiny">{t('currentPoints')}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="font-bold text-3xl">{selectedItem.lifetimePoints || 0}</p>
              <p className="text-default-400 text-tiny">{t('lifetimePoints')}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="font-bold text-3xl">{selectedItem.totalOrders || 0}</p>
              <p className="text-default-400 text-tiny">{t('totalOrders')}</p>
            </CardBody>
          </Card>
        </div>

        {getNextTier(selectedItem.tier) && (
          <div className="bg-default-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>
                {t('progressTo')} {t(getNextTier(selectedItem.tier)?.tier || '')}
              </span>
              <span>
                {selectedItem.lifetimePoints || 0} / {getNextTier(selectedItem.tier)?.pointsNeeded}
              </span>
            </div>
            <Progress
              size="md"
              color="primary"
              value={
                ((selectedItem.lifetimePoints || 0) /
                  (getNextTier(selectedItem.tier)?.pointsNeeded || 1)) *
                100
              }
            />
          </div>
        )}

        {selectedItem.pointsHistory && selectedItem.pointsHistory.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold">{t('recentActivity')}</h4>
            <div className="space-y-2 max-h-40 overflow-auto">
              {selectedItem.pointsHistory
                .slice(-5)
                .reverse()
                .map((history, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-default-50 p-2 rounded"
                  >
                    <div>
                      <p className="text-sm">{history.description || history.type}</p>
                      <p className="text-default-400 text-tiny">
                        {new Date(history.date || '').toLocaleDateString()}
                      </p>
                    </div>
                    <Chip
                      color={history.points > 0 ? 'success' : 'danger'}
                      size="sm"
                      variant="flat"
                    >
                      {history.points > 0 ? '+' : ''}
                      {history.points}
                    </Chip>
                  </div>
                ))}
            </div>
          </div>
        )}
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
          {t('addMember')}
        </Button>
      </div>

      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={members}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title={t('addLoyaltyMember')}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel={t('create')}
        size="lg"
      >
        <FormFields />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`${t('editMember')}: ${selectedItem?.customer.name}`}
        onSubmit={handleEdit}
        submitLabel={t('saveChanges')}
        size="lg"
      >
        <FormFields />
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.onClose}
        title={t('memberDetails')}
        size="lg"
      >
        <ViewContent />
      </FormModal>

      {/* Adjust Points Modal */}
      <FormModal
        isOpen={adjustModal.isOpen}
        onClose={adjustModal.onClose}
        title={`${t('adjustPoints')}: ${selectedItem?.customer.name}`}
        onSubmit={handleAdjustPoints}
        submitLabel={t('apply')}
      >
        <div className="flex flex-col gap-4">
          <div className="bg-default-50 p-4 rounded-lg text-center">
            <p className="font-bold text-primary text-3xl">{selectedItem?.currentPoints || 0}</p>
            <p className="text-default-400 text-tiny">{t('currentPoints')}</p>
          </div>
          <Input
            label={t('pointsToAddRemove')}
            type="number"
            placeholder={t('pointsPlaceholder')}
            value={adjustPoints.points.toString()}
            onValueChange={(value) =>
              setAdjustPoints({ ...adjustPoints, points: parseInt(value) || 0 })
            }
            description={t('pointsDescription')}
          />
          <Input
            label={t('description')}
            placeholder={t('descriptionPlaceholder')}
            value={adjustPoints.description}
            onValueChange={(value) => setAdjustPoints({ ...adjustPoints, description: value })}
          />
          <div className="bg-primary-50 p-4 rounded-lg text-center">
            <p className="font-bold text-primary text-2xl">
              {(selectedItem?.currentPoints || 0) + adjustPoints.points}
            </p>
            <p className="text-default-400 text-tiny">{t('newBalance')}</p>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
