'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { GenericTable } from '../../common/GenericTable'
import { FormModal } from '../../common/FormModal'
import { ConfirmModal } from '../../common/ConfirmModal'
import {
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from '@/hooks/menu-items'
import { useCategories } from '@/hooks/categories'
import { useCurrencies } from '@/hooks/currencies'
import { useRestaurants } from '@/hooks/restaurants'
import {
  Button,
  Chip,
  User,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
  Card,
  CardBody,
  Tabs,
  Tab,
  Divider,
  Spinner,
  addToast,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/currency'
import type { MenuItem, Category, Currency, Restaurant } from '@/payload-types'

const columns = [
  { name: 'name', uid: 'name' },
  { name: 'price', uid: 'price' },
  { name: 'category', uid: 'category' },
  { name: 'available', uid: 'isAvailable' },
  { name: 'actions', uid: 'actions' },
]

interface MenuFormData {
  name: string
  description: string
  price: number
  discountPrice?: number
  category: string
  currency: string
  restaurant: string[]
  isAvailable: boolean
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
  images: Array<{ image: string }>
  dietary: {
    calories?: number
    tags: (
      | 'vegetarian'
      | 'spicy'
      | 'gluten-free'
      | 'healthy'
      | 'best-seller'
      | 'new'
      | 'recommended'
    )[]
    allergens: ('peanuts' | 'dairy' | 'eggs' | 'seafood' | 'wheat')[]
  }
  preparation: {
    prepTime: number
    servingSize: string
  }
  customizations: Array<{
    name: string
    isRequired: boolean
    options: Array<{
      optionName: string
      additionalPrice: number
    }>
  }>
}

const initialFormData: MenuFormData = {
  name: '',
  description: '',
  price: 0,
  discountPrice: undefined,
  category: '',
  currency: '',
  restaurant: [],
  isAvailable: true,
  isFeatured: false,
  isActive: true,
  displayOrder: 0,
  images: [],
  dietary: {
    calories: undefined,
    tags: [],
    allergens: [],
  },
  preparation: {
    prepTime: 15,
    servingSize: '',
  },
  customizations: [],
}

export const MenuContent = () => {
  const t = useTranslations('menu')
  const tCommon = useTranslations('common')

  const { data, isLoading, refetch } = useMenuItems()
  const { data: categoriesData } = useCategories()
  const { data: currenciesData } = useCurrencies()
  const { data: restaurantsData } = useRestaurants()

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const createMutation = useCreateMenuItem()
  const updateMutation = useUpdateMenuItem(selectedItem?.id || '')
  const deleteMutation = useDeleteMenuItem(selectedItem?.id || '')

  const [formData, setFormData] = useState<MenuFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Modal states
  const createModal = useDisclosure()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()

  const menuItems = useMemo(() => (data?.docs as MenuItem[]) || [], [data?.docs])
  const categories = useMemo(
    () => (categoriesData?.docs as Category[])?.filter((c) => c.type === 'menu') || [],
    [categoriesData?.docs],
  )
  const currencies = useMemo(
    () => (currenciesData?.docs as Currency[])?.filter((c) => c.isActive) || [],
    [currenciesData?.docs],
  )
  const restaurants = useMemo(
    () => (restaurantsData?.docs as Restaurant[])?.filter((r) => r.isActive) || [],
    [restaurantsData?.docs],
  )
  const totalPages = data?.totalPages || 1
  const page = data?.page || 1

  // Check if required dropdown data is loaded
  const isDropdownDataLoading = !categoriesData || !currenciesData || !restaurantsData
  const hasNoCategories = categories.length === 0
  const hasNoCurrencies = currencies.length === 0
  const hasNoRestaurants = restaurants.length === 0

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = t('error')
    }
    if (!formData.category) {
      errors.category = t('error')
    }
    if (!formData.currency) {
      errors.currency = t('error')
    }
    if (formData.restaurant.length === 0) {
      errors.restaurant = t('error')
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = t('error')
    }
    if (formData.discountPrice && formData.discountPrice >= formData.price) {
      errors.discountPrice = t('error')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = async () => {
    if (!validateForm()) {
      return
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      } as any)
      createModal.onClose()
      setFormData(initialFormData)
      setFormErrors({})
      refetch()
      addToast({
        title: t('success'),
        description: t('itemCreated'),
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to create menu item:', error)
      addToast({
        title: t('error'),
        description: t('createFailed'),
        color: 'danger',
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedItem) return

    if (!validateForm()) {
      return
    }

    try {
      await updateMutation.mutateAsync({
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      })
      editModal.onClose()
      setSelectedItem(null)
      setFormData(initialFormData)
      setFormErrors({})
      refetch()
      addToast({
        title: t('success'),
        description: t('itemUpdated'),
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to update menu item:', error)
      addToast({
        title: t('error'),
        description: t('updateFailed'),
        color: 'danger',
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      await deleteMutation.mutateAsync()
      deleteModal.onClose()
      setSelectedItem(null)
      refetch()
      addToast({
        title: t('success'),
        description: t('itemDeleted'),
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      addToast({
        title: t('error'),
        description: t('deleteFailed'),
        color: 'danger',
      })
    }
  }

  const openEditModal = useCallback(
    (item: MenuItem) => {
      setSelectedItem(item)
      setFormErrors({})
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        discountPrice: item.discountPrice,
        category: typeof item.category === 'string' ? item.category : item.category?.id || '',
        currency: typeof item.currency === 'string' ? item.currency : item.currency?.id || '',
        restaurant: Array.isArray(item.restaurant)
          ? item.restaurant.map((r) => (typeof r === 'string' ? r : r.id))
          : [],
        isAvailable: item.isAvailable ?? true,
        isFeatured: item.isFeatured ?? false,
        isActive: item.isActive ?? true,
        displayOrder: item.displayOrder ?? 0,
        images:
          item.images?.map((img) => ({
            image: typeof img.image === 'string' ? img.image : img.image?.id || '',
          })) || [],
        dietary: {
          calories: item.dietary?.calories,
          tags: (item.dietary?.tags || []) as (
            | 'vegetarian'
            | 'spicy'
            | 'gluten-free'
            | 'healthy'
            | 'best-seller'
            | 'new'
            | 'recommended'
          )[],
          allergens: (item.dietary?.allergens || []) as (
            | 'peanuts'
            | 'dairy'
            | 'eggs'
            | 'seafood'
            | 'wheat'
          )[],
        },
        preparation: {
          prepTime: item.preparation?.prepTime ?? 15,
          servingSize: item.preparation?.servingSize || '',
        },
        customizations:
          item.customizations?.map((custom) => ({
            name: custom.name || '',
            isRequired: custom.isRequired ?? false,
            options:
              custom.options?.map((opt) => ({
                optionName: opt.optionName || '',
                additionalPrice: opt.additionalPrice ?? 0,
              })) || [],
          })) || [],
      })
      editModal.onOpen()
    },
    [editModal],
  )

  const openDeleteModal = useCallback(
    (item: MenuItem) => {
      setSelectedItem(item)
      deleteModal.onOpen()
    },
    [deleteModal],
  )

  const renderCell = useCallback(
    (item: MenuItem, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof MenuItem]

      switch (columnKey) {
        case 'name':
          const description = item.description || ''
          const truncatedDescription =
            description.length > 50 ? `${description.substring(0, 50)}...` : description
          return (
            <User
              avatarProps={{ radius: 'lg', src: (item.images?.[0]?.image as any)?.url }}
              description={truncatedDescription}
              name={cellValue as string}
            />
          )
        case 'price':
          const currencyObj = item.currency as Currency
          const hasDiscount = item.discountPrice && item.discountPrice < item.price
          return (
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <p className="text-bold text-success text-sm">
                    {formatCurrency(item.discountPrice!, { currency: currencyObj })}
                  </p>
                  <p className="text-default-400 text-tiny line-through">
                    {formatCurrency(item.price, { currency: currencyObj })}
                  </p>
                </>
              ) : (
                <p className="text-bold text-sm">
                  {formatCurrency(item.price, { currency: currencyObj })}
                </p>
              )}
            </div>
          )
        case 'category':
          return (
            <Chip size="sm" variant="flat" color="primary">
              {(item.category as any)?.name || t('selectCategory')}
            </Chip>
          )
        case 'isAvailable':
          return (
            <Chip
              className="capitalize"
              color={item.isAvailable ? 'success' : 'danger'}
              size="sm"
              variant="flat"
            >
              {item.isAvailable ? t('available') : t('unavailable')}
            </Chip>
          )
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Button
                isIconOnly
                type="button"
                size="sm"
                variant="light"
                onPress={() => openEditModal(item)}
              >
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
          return typeof cellValue === 'object' && cellValue !== null
            ? JSON.stringify(cellValue)
            : String(cellValue ?? '')
      }
    },
    [t, openEditModal, openDeleteModal],
  )

  const FormFields = () => {
    if (isDropdownDataLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      )
    }

    if (hasNoCategories || hasNoCurrencies || hasNoRestaurants) {
      return (
        <div className="flex flex-col gap-4 bg-warning-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-warning-700">
            <Icon icon="solar:danger-triangle-bold" className="text-xl" />
            <span className="font-medium">{t('missingData')}</span>
          </div>
          <ul className="text-warning-600 text-sm list-disc list-inside">
            {hasNoCategories && <li>{t('noCategoriesWarning')}</li>}
            {hasNoCurrencies && <li>{t('noCurrenciesWarning')}</li>}
            {hasNoRestaurants && <li>{t('noRestaurantsWarning')}</li>}
          </ul>
        </div>
      )
    }

    return (
      <Tabs aria-label="Menu Item Form" variant="underlined" defaultSelectedKey="basic">
        {/* Basic Information */}
        <Tab key="basic" title={t('basicInfo')}>
          <div className="gap-4 grid grid-cols-2 py-4">
            <Input
              label={t('itemName')}
              placeholder={t('itemName')}
              value={formData.name}
              onValueChange={(value) => {
                setFormData({ ...formData, name: value })
                if (formErrors.name) {
                  setFormErrors({ ...formErrors, name: '' })
                }
              }}
              isRequired
              isInvalid={!!formErrors.name}
              errorMessage={formErrors.name}
            />
            <Select
              label={t('category')}
              placeholder={t('selectCategory')}
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                setFormData({ ...formData, category: selected })
                if (formErrors.category) {
                  setFormErrors({ ...formErrors, category: '' })
                }
              }}
              isRequired
              isInvalid={!!formErrors.category}
              errorMessage={formErrors.category}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id}>{cat.name}</SelectItem>
              ))}
            </Select>
            <Textarea
              label={t('description')}
              placeholder={t('description')}
              value={formData.description}
              onValueChange={(value) => setFormData({ ...formData, description: value })}
              className="col-span-2"
            />
          </div>
        </Tab>

        {/* Pricing Information */}
        <Tab key="pricing" title={t('pricingInfo')}>
          <div className="gap-4 grid grid-cols-3 py-4">
            <Input
              label={t('price')}
              placeholder="0.00"
              type="number"
              min={0}
              step={0.01}
              value={formData.price === 0 ? '' : formData.price.toString()}
              onValueChange={(value) => {
                const numValue = value === '' ? 0 : parseFloat(value)
                setFormData({ ...formData, price: isNaN(numValue) ? 0 : numValue })
                if (formErrors.price) {
                  setFormErrors({ ...formErrors, price: '' })
                }
              }}
              isRequired
              isInvalid={!!formErrors.price}
              errorMessage={formErrors.price}
              startContent={
                <span className="text-default-400 text-sm">{currencies[0]?.symbol || '$'}</span>
              }
            />
            <Input
              label={t('discountPrice')}
              placeholder="0.00"
              type="number"
              min={0}
              step={0.01}
              value={formData.discountPrice?.toString() || ''}
              onValueChange={(value) => {
                if (value === '') {
                  setFormData({ ...formData, discountPrice: undefined })
                } else {
                  const numValue = parseFloat(value)
                  setFormData({
                    ...formData,
                    discountPrice: isNaN(numValue) ? undefined : numValue,
                  })
                }
                if (formErrors.discountPrice) {
                  setFormErrors({ ...formErrors, discountPrice: '' })
                }
              }}
              isInvalid={!!formErrors.discountPrice}
              errorMessage={formErrors.discountPrice}
              description={
                formData.price > 0 ? t('discountPriceHint', { price: formData.price }) : undefined
              }
            />
            <Select
              label={t('currency')}
              placeholder={t('currency')}
              selectedKeys={formData.currency ? [formData.currency] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                setFormData({ ...formData, currency: selected })
                if (formErrors.currency) {
                  setFormErrors({ ...formErrors, currency: '' })
                }
              }}
              isRequired
              isInvalid={!!formErrors.currency}
              errorMessage={formErrors.currency}
            >
              {currencies.map((curr) => (
                <SelectItem key={curr.id}>{`${curr.name} (${curr.symbol})`}</SelectItem>
              ))}
            </Select>
          </div>
        </Tab>

        {/* Restaurant/Branches */}
        <Tab key="branches" title={t('branches')}>
          <div className="gap-4 grid grid-cols-3 py-4">
            <Select
              label={t('branches')}
              placeholder={t('selectRestaurant')}
              selectionMode="multiple"
              selectedKeys={formData.restaurant}
              onSelectionChange={(keys) => {
                setFormData({ ...formData, restaurant: Array.from(keys) as string[] })
                if (formErrors.restaurant) {
                  setFormErrors({ ...formErrors, restaurant: '' })
                }
              }}
              isRequired
              isInvalid={!!formErrors.restaurant}
              errorMessage={formErrors.restaurant}
              className="col-span-3"
            >
              {restaurants.map((rest) => (
                <SelectItem key={rest.id}>{rest.name}</SelectItem>
              ))}
            </Select>
          </div>
        </Tab>

        {/* Nutrition Information */}
        <Tab key="nutrition" title={t('nutritionInfo')}>
          <div className="gap-4 grid grid-cols-2 py-4">
            <Input
              label={t('calories')}
              placeholder="0"
              type="number"
              min={0}
              value={formData.dietary.calories?.toString() || ''}
              onValueChange={(value) => {
                if (value === '') {
                  setFormData({
                    ...formData,
                    dietary: { ...formData.dietary, calories: undefined },
                  })
                } else {
                  const numValue = parseInt(value)
                  setFormData({
                    ...formData,
                    dietary: {
                      ...formData.dietary,
                      calories: isNaN(numValue) ? undefined : numValue,
                    },
                  })
                }
              }}
              endContent={<span className="text-default-400 text-sm">kcal</span>}
            />
            <Select
              label={t('tags')}
              placeholder={t('tags')}
              selectionMode="multiple"
              selectedKeys={formData.dietary.tags}
              onSelectionChange={(keys) => {
                setFormData({
                  ...formData,
                  dietary: {
                    ...formData.dietary,
                    tags: Array.from(keys) as (
                      | 'vegetarian'
                      | 'spicy'
                      | 'gluten-free'
                      | 'healthy'
                      | 'best-seller'
                      | 'new'
                      | 'recommended'
                    )[],
                  },
                })
              }}
            >
              <SelectItem key="vegetarian">{t('vegetarian')}</SelectItem>
              <SelectItem key="spicy">{t('spicy')}</SelectItem>
              <SelectItem key="gluten-free">{t('glutenFree')}</SelectItem>
              <SelectItem key="healthy">{t('healthy')}</SelectItem>
              <SelectItem key="best-seller">{t('bestSeller')}</SelectItem>
              <SelectItem key="new">{t('new')}</SelectItem>
              <SelectItem key="recommended">{t('recommended')}</SelectItem>
            </Select>
            <Select
              label={t('allergens')}
              placeholder={t('allergens')}
              selectionMode="multiple"
              selectedKeys={formData.dietary.allergens}
              onSelectionChange={(keys) => {
                setFormData({
                  ...formData,
                  dietary: {
                    ...formData.dietary,
                    allergens: Array.from(keys) as (
                      | 'peanuts'
                      | 'dairy'
                      | 'eggs'
                      | 'seafood'
                      | 'wheat'
                    )[],
                  },
                })
              }}
            >
              <SelectItem key="peanuts">{t('peanuts')}</SelectItem>
              <SelectItem key="dairy">{t('dairy')}</SelectItem>
              <SelectItem key="eggs">{t('eggs')}</SelectItem>
              <SelectItem key="seafood">{t('seafood')}</SelectItem>
              <SelectItem key="wheat">{t('wheat')}</SelectItem>
            </Select>
          </div>
        </Tab>

        {/* Preparation Information */}
        <Tab key="preparation" title={t('preparationInfo')}>
          <div className="gap-4 grid grid-cols-2 py-4">
            <Input
              label={t('prepTime')}
              placeholder="15"
              type="number"
              min={0}
              value={
                formData.preparation.prepTime === 0 ? '' : formData.preparation.prepTime.toString()
              }
              onValueChange={(value) => {
                const numValue = value === '' ? 15 : parseInt(value)
                setFormData({
                  ...formData,
                  preparation: {
                    ...formData.preparation,
                    prepTime: isNaN(numValue) ? 15 : numValue,
                  },
                })
              }}
              endContent={<span className="text-default-400 text-sm">{t('minutes')}</span>}
            />
            <Input
              label={t('servingSize')}
              placeholder={t('servingSize')}
              value={formData.preparation.servingSize}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preparation: { ...formData.preparation, servingSize: value },
                })
              }
            />
          </div>
        </Tab>

        {/* Customizations */}
        <Tab key="customizations" title={t('customizationInfo')}>
          <div className="flex flex-col gap-4 py-4">
            {formData.customizations.map((custom, customIndex) => (
              <Card key={customIndex}>
                <CardBody>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <Input
                        label={t('customizationName')}
                        value={custom.name}
                        onValueChange={(value) => {
                          const newCustomizations = [...formData.customizations]
                          newCustomizations[customIndex].name = value
                          setFormData({ ...formData, customizations: newCustomizations })
                        }}
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        size="sm"
                        onPress={() => {
                          const newCustomizations = formData.customizations.filter(
                            (_, i) => i !== customIndex,
                          )
                          setFormData({ ...formData, customizations: newCustomizations })
                        }}
                      >
                        <Icon icon="solar:trash-bin-trash-bold" />
                      </Button>
                    </div>

                    <Switch
                      isSelected={custom.isRequired}
                      onValueChange={(value) => {
                        const newCustomizations = [...formData.customizations]
                        newCustomizations[customIndex].isRequired = value
                        setFormData({ ...formData, customizations: newCustomizations })
                      }}
                    >
                      {t('required')}
                    </Switch>

                    <Divider />

                    {custom.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-end gap-2">
                        <Input
                          label={t('optionName')}
                          value={option.optionName}
                          onValueChange={(value) => {
                            const newCustomizations = [...formData.customizations]
                            newCustomizations[customIndex].options[optIndex].optionName = value
                            setFormData({ ...formData, customizations: newCustomizations })
                          }}
                          className="flex-1"
                        />
                        <Input
                          label={t('additionalPrice')}
                          type="number"
                          value={option.additionalPrice.toString()}
                          onValueChange={(value) => {
                            const newCustomizations = [...formData.customizations]
                            newCustomizations[customIndex].options[optIndex].additionalPrice =
                              parseFloat(value) || 0
                            setFormData({ ...formData, customizations: newCustomizations })
                          }}
                          className="w-32"
                        />
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          size="sm"
                          onPress={() => {
                            const newCustomizations = [...formData.customizations]
                            newCustomizations[customIndex].options = newCustomizations[
                              customIndex
                            ].options.filter((_, i) => i !== optIndex)
                            setFormData({ ...formData, customizations: newCustomizations })
                          }}
                        >
                          <Icon icon="solar:trash-bin-trash-bold" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        const newCustomizations = [...formData.customizations]
                        newCustomizations[customIndex].options.push({
                          optionName: '',
                          additionalPrice: 0,
                        })
                        setFormData({ ...formData, customizations: newCustomizations })
                      }}
                    >
                      {t('addOption')}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}

            <Button
              color="primary"
              variant="flat"
              onPress={() => {
                setFormData({
                  ...formData,
                  customizations: [
                    ...formData.customizations,
                    { name: '', isRequired: false, options: [] },
                  ],
                })
              }}
            >
              {t('addCustomization')}
            </Button>
          </div>
        </Tab>

        {/* Availability & Status */}
        <Tab key="availability" title={t('availabilityInfo')}>
          <div className="gap-4 grid grid-cols-2 py-4">
            <Switch
              isSelected={formData.isAvailable}
              onValueChange={(value) => setFormData({ ...formData, isAvailable: value })}
            >
              {t('available')}
            </Switch>
            <Switch
              isSelected={formData.isFeatured}
              onValueChange={(value) => setFormData({ ...formData, isFeatured: value })}
            >
              {t('featured')}
            </Switch>
            <Switch
              isSelected={formData.isActive}
              onValueChange={(value) => setFormData({ ...formData, isActive: value })}
            >
              {t('active')}
            </Switch>
            <Input
              label={t('displayOrder')}
              type="number"
              min={0}
              value={formData.displayOrder === 0 ? '' : formData.displayOrder.toString()}
              onValueChange={(value) => {
                const numValue = value === '' ? 0 : parseInt(value)
                setFormData({ ...formData, displayOrder: isNaN(numValue) ? 0 : numValue })
              }}
              description={t('displayOrderHint')}
            />
          </div>
        </Tab>
      </Tabs>
    )
  }

  // Translate column names
  const translatedColumns = columns.map((col) => ({
    ...col,
    name: t(col.uid as any) || col.name,
  }))

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-end gap-3">
        <h1 className="font-bold text-2xl">{t('menuItems')}</h1>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" />}
          onPress={() => {
            setFormData(initialFormData)
            setFormErrors({})
            createModal.onOpen()
          }}
          isDisabled={isDropdownDataLoading}
          aria-label={t('addItem')}
        >
          {t('addItem')}
        </Button>
      </div>

      <GenericTable
        columns={translatedColumns}
        data={menuItems}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        renderCell={renderCell}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title={t('addItem')}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        submitLabel={tCommon('save')}
        size="5xl"
      >
        <FormFields />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title={`${t('editItem')}: ${selectedItem?.name}`}
        onSubmit={handleEdit}
        isLoading={updateMutation.isPending}
        submitLabel={tCommon('save')}
        size="5xl"
      >
        <FormFields />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleDelete}
        title={t('deleteItem')}
        description={`${t('deleteConfirm')} "${selectedItem?.name}"?`}
        confirmLabel={tCommon('delete')}
        confirmColor="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
