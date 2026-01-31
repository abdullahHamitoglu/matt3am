'use client'

import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'

export const QuickAccess = () => {
  const router = useRouter()

  const actions = [
    {
      key: 'new-order',
      label: 'New Order',
      icon: 'solar:cart-large-2-bold',
      action: () => router.push('/dashboard/orders?new=true'), // Assuming query param triggers modal
    },
    {
      key: 'new-reservation',
      label: 'New Reservation',
      icon: 'solar:calendar-add-bold',
      action: () => router.push('/dashboard/reservations?new=true'),
    },
    {
      key: 'add-product',
      label: 'Add Product',
      icon: 'solar:box-minimalistic-bold',
      action: () => router.push('/dashboard/menu?new=true'),
    },
  ]

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:add-circle-bold" width={20} />}
        >
          Quick Action
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Quick Actions"
        onAction={(key) => {
          const action = actions.find((a) => a.key === key)
          if (action) action.action()
        }}
      >
        {actions.map((item) => (
          <DropdownItem key={item.key} startContent={<Icon icon={item.icon} className="text-xl" />}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
