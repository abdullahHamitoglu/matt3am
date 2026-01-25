'use client'
import { Button, Input } from '@heroui/react'
import Link from 'next/link'
import React from 'react'
import { DotsIcon } from '@/components/client-dashboard/icons/accounts/dots-icon'
import { ExportIcon } from '@/components/client-dashboard/icons/accounts/export-icon'
import { InfoIcon } from '@/components/client-dashboard/icons/accounts/info-icon'
import { TrashIcon } from '@/components/client-dashboard/icons/accounts/trash-icon'
import { HouseIcon } from '@/components/client-dashboard/icons/breadcrumb/house-icon'
import { UsersIcon } from '@/components/client-dashboard/icons/breadcrumb/users-icon'
import { SettingsIcon } from '@/components/client-dashboard/icons/sidebar/settings-icon'
import { TableWrapper } from '@/components/client-dashboard/table/table'
import { AddUser } from './add-user'

export const Accounts = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto my-10 px-4 lg:px-6 w-full max-w-[95rem]">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={'/'}>
            <span>Home</span>
          </Link>
          <span> / </span>{' '}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Users</span>
          <span> / </span>{' '}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="font-semibold text-xl">All Accounts</h3>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          <Input
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            placeholder="Search users"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row flex-wrap gap-3.5">
          <AddUser />
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[95rem]">
        <TableWrapper />
      </div>
    </div>
  )
}
