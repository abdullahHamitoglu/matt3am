'use client'

import React from 'react'
import { GenericTable } from '../common/GenericTable'
import { Button, User } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useProductRecipes } from '@/hooks/product-recipes'
import type { ProductRecipe } from '@/payload-types' // Adjust type name if different

const columns = [
  { name: 'Recipe Name', uid: 'name' },
  // { name: 'Yield', uid: 'yield' }, // Uncomment if yield exists
  { name: 'Actions', uid: 'actions' },
]

export const RecipesContent = () => {
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
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Icon icon="solar:eye-bold" />
            </span>
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Icon icon="solar:pen-bold" />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
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
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Button color="primary" endContent={<Icon icon="solar:add-circle-bold" />}>
          Add Recipe
        </Button>
      </div>
      <GenericTable
        columns={columns}
        data={recipes}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />
    </div>
  )
}
