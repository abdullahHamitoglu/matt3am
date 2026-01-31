'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
} from '@heroui/react'

interface Column {
  uid: string
  name: string
  sortable?: boolean
}

interface GenericTableProps<T> {
  columns: Column[]
  data: T[]
  isLoading?: boolean
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode
  emptyContent?: string
}

export function GenericTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  page = 1,
  totalPages = 1,
  onPageChange,
  renderCell,
  emptyContent = 'No rows to display.',
}: GenericTableProps<T>) {
  const bottomContent = React.useMemo(() => {
    if (!totalPages || totalPages <= 1) return null

    return (
      <div className="flex w-full justify-center px-2 py-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={onPageChange}
        />
      </div>
    )
  }, [page, totalPages, onPageChange])

  return (
    <Table
      aria-label="Data table"
      bottomContent={bottomContent}
      classNames={{
        wrapper: 'min-h-[222px]',
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={emptyContent}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
