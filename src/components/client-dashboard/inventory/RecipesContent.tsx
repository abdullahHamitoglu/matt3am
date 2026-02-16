'use client'

import React from 'react'
import { GenericTable } from '../../common/GenericTable'
import { Button, User } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { useProductRecipes } from '@/hooks/product-recipes'
import type { ProductRecipe } from '@/payload-types' // Adjust type name if different

const columns = [
  { name: 'recipeName', uid: 'name' },
  // { name: 'Yield', uid: 'yield' }, // Uncomment if yield exists
  { name: 'actions', uid: 'actions' },
]

export const RecipesContent = () => {
  const t = useTranslations('recipesPage')
  const { data, isLoading } = useProductRecipes()
  const recipes = (data?.docs as ProductRecipe[]) || []
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  const renderCell = React.useCallback((item: ProductRecipe, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof ProductRecipe]

    switch (columnKey) {
      case 'name':
        // menuItem can be string (ID) or MenuItem object
        return typeof item.menuItem === 'string' ? item.menuItem : item.menuItem?.name || 'N/A'
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <span className="active:opacity-50 text-default-400 text-lg cursor-pointer">
              <Icon icon="solar:eye-bold" />
            </span>
            <span className="active:opacity-50 text-default-400 text-lg cursor-pointer">
              <Icon icon="solar:pen-bold" />
            </span>
            <span className="active:opacity-50 text-danger text-lg cursor-pointer">
              <Icon icon="solar:trash-bin-trash-bold" />
            </span>
          </div>
        )
      default:
        // Only return primitive values that React can render
        if (
          typeof cellValue === 'string' ||
          typeof cellValue === 'number' ||
          typeof cellValue === 'boolean'
        ) {
          return String(cellValue)
        }
        return null
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end gap-3">
        <h1 className="font-bold text-2xl">{t('title')}</h1>
        <Button color="primary" endContent={<Icon icon="solar:add-circle-bold" />}>
          {t('addRecipe')}
        </Button>
      </div>
      <GenericTable
        columns={columns.map((c) => ({ ...c, name: t(c.name) }))}
        data={recipes}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />
    </div>
  )
}
