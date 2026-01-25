import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'
import { restaurantScoped } from '@/access/restaurant-scoped'
import { canCreate, canRead, canUpdate, canDelete } from '@/access/permissions'

export const ProductRecipes: CollectionConfig = {
  slug: 'product-recipes',
  admin: {
    useAsTitle: 'menuItem',
    defaultColumns: ['menuItem', 'restaurant', 'totalCost'],
    group: 'Inventory',
    description:
      'Link dishes to raw materials - This table is responsible for automatic inventory deduction',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      const hasPermission = canRead('inventory')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    create: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      return canCreate('inventory')({ req })
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      const hasPermission = canUpdate('inventory')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    delete: canDelete('inventory'),
  },
  fields: [
    {
      name: 'menuItem',
      type: 'relationship',
      relationTo: 'menu-items',
      required: true,
      label: 'Dish',
    },
    {
      name: 'restaurant',
      type: 'relationship',
      relationTo: 'restaurants',
      required: true,
      label: 'Branch',
      admin: {
        description: 'Recipe is specific to each branch (ingredients may vary)',
      },
    },
    {
      name: 'ingredients',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Ingredients',
      admin: {
        description: 'Raw materials used in preparing the dish',
      },
      fields: [
        {
          name: 'inventoryItem',
          type: 'relationship',
          relationTo: 'inventory-items',
          required: true,
          label: 'Raw Material',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              label: 'Quantity Used',
              admin: {
                width: '50%',
                step: 0.01,
                description: 'Quantity required to prepare one serving',
              },
            },
            {
              name: 'unit',
              type: 'select',
              required: true,
              label: 'Unit',
              admin: {
                width: '50%',
              },
              options: [
                { label: 'Kilogram', value: 'kg' },
                { label: 'Gram', value: 'g' },
                { label: 'Liter', value: 'l' },
                { label: 'Milliliter', value: 'ml' },
                { label: 'Piece', value: 'piece' },
              ],
            },
          ],
        },
        {
          name: 'notes',
          type: 'text',
          label: 'Notes',
          admin: {
            description: 'Example: Optional, can be replaced with...',
          },
        },
      ],
    },
    {
      name: 'totalCost',
      type: 'number',
      label: 'Total Cost',
      admin: {
        readOnly: true,
        description: 'Automatically calculated from ingredient costs',
      },
    },
    {
      name: 'profitMargin',
      type: 'number',
      label: 'Profit Margin (%)',
      admin: {
        description: 'Automatically calculated: (Selling Price - Cost) / Selling Price × 100',
      },
    },
    {
      name: 'instructions',
      type: 'richText',
      label: 'Preparation Instructions',
      admin: {
        description: 'Dish preparation steps for the kitchen',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Calculate total cost automatically
        if (data.ingredients && data.ingredients.length > 0) {
          let totalCost = 0

          for (const ingredient of data.ingredients) {
            if (ingredient.inventoryItem && ingredient.quantity) {
              try {
                const inventoryItem = await req.payload.findByID({
                  collection: 'inventory-items',
                  id:
                    typeof ingredient.inventoryItem === 'string'
                      ? ingredient.inventoryItem
                      : ingredient.inventoryItem.id,
                  depth: 0,
                })

                if (inventoryItem?.pricing?.costPerUnit) {
                  totalCost += ingredient.quantity * inventoryItem.pricing.costPerUnit
                }
              } catch (error) {
                console.error('Error calculating cost:', error)
              }
            }
          }

          data.totalCost = parseFloat(totalCost.toFixed(2))

          // Calculate profit margin if price is available
          if (data.menuItem) {
            try {
              const menuItem = await req.payload.findByID({
                collection: 'menu-items',
                id: typeof data.menuItem === 'string' ? data.menuItem : data.menuItem.id,
                depth: 0,
              })

              if (menuItem?.price && data.totalCost) {
                const profitMargin = ((menuItem.price - data.totalCost) / menuItem.price) * 100
                data.profitMargin = parseFloat(profitMargin.toFixed(2))
              }
            } catch (error) {
              console.error('Error calculating profit margin:', error)
            }
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
