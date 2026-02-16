'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { useOrders } from '@/hooks/orders'
import { useRestaurantSelection } from '@/hooks/restaurants'
import type { Order } from '@/payload-types'
import { formatCurrency } from '@/lib/currency'

const ORDER_STATUS_CONFIG = {
  pending: { key: 'pending' as const, color: 'warning' as const, icon: 'solar:clock-circle-bold' },
  confirmed: {
    key: 'confirmed' as const,
    color: 'primary' as const,
    icon: 'solar:check-circle-bold',
  },
  preparing: {
    key: 'preparing' as const,
    color: 'secondary' as const,
    icon: 'solar:chef-hat-bold',
  },
  ready: { key: 'ready' as const, color: 'success' as const, icon: 'solar:box-bold' },
  served: { key: 'served' as const, color: 'success' as const, icon: 'solar:check-circle-bold' },
  delivering: {
    key: 'delivering' as const,
    color: 'primary' as const,
    icon: 'solar:delivery-bold',
  },
  completed: {
    key: 'completed' as const,
    color: 'success' as const,
    icon: 'solar:verified-check-bold',
  },
  cancelled: {
    key: 'cancelled' as const,
    color: 'danger' as const,
    icon: 'solar:close-circle-bold',
  },
}

const PAYMENT_STATUS_CONFIG = {
  pending: { key: 'paymentPending' as const, color: 'warning' as const },
  paid: { key: 'paid' as const, color: 'success' as const },
  'partially-paid': { key: 'partiallyPaid' as const, color: 'primary' as const },
  refunded: { key: 'refunded' as const, color: 'danger' as const },
}

const ORDER_TYPE_CONFIG = {
  'dine-in': { key: 'dineIn' as const, icon: 'solar:chair-2-bold' },
  takeaway: { key: 'takeaway' as const, icon: 'solar:bag-4-bold' },
  delivery: { key: 'delivery' as const, icon: 'solar:delivery-bold' },
}

export const OrdersContent: React.FC = () => {
  const { selectedRestaurant } = useRestaurantSelection()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const t = useTranslations('ordersPage')
  const limit = 10

  const { data, isLoading, error } = useOrders({
    limit,
    page,
    where: {
      ...(selectedRestaurant && {
        restaurant: {
          equals: selectedRestaurant,
        },
      }),
      ...(statusFilter !== 'all' && {
        status: {
          equals: statusFilter,
        },
      }),
      ...(typeFilter !== 'all' && {
        orderType: {
          equals: typeFilter,
        },
      }),
      ...(searchQuery && {
        or: [
          {
            orderNumber: {
              contains: searchQuery,
            },
          },
          {
            'customer.name': {
              contains: searchQuery,
            },
          },
          {
            'customer.phone': {
              contains: searchQuery,
            },
          },
        ],
      }),
    },
    sort: '-createdAt',
  })

  const orders = data?.docs || []
  const totalPages = data?.totalPages || 1

  const statusItems = [
    { key: 'all', label: t('all') },
    ...Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => ({
      key,
      label: t(config.key),
    })),
  ]

  const typeItems = [
    { key: 'all', label: t('all') },
    ...Object.entries(ORDER_TYPE_CONFIG).map(([key, config]) => ({
      key,
      label: t(config.key),
    })),
  ]

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    onOpen()
  }

  if (error) {
    return (
      <div className="h-full">
        <div className="mx-auto px-4 lg:px-0 pt-10 w-full max-w-[90rem]">
          <Card>
            <CardBody className="p-8 text-center">
              <Icon
                icon="solar:danger-circle-bold"
                className="mx-auto mb-4 text-danger"
                width={48}
              />
              <p className="text-danger">{t('loadError')}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="mx-auto px-4 lg:px-0 pt-3 sm:pt-10 w-full max-w-[90rem]">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
            <h1 className="font-bold text-3xl">{t('title')}</h1>
            <Button color="primary" startContent={<Icon icon="solar:add-circle-bold" width={20} />}>
              {t('newOrder')}
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardBody className="gap-4">
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Icon icon="solar:magnifer-bold" width={20} />}
                  isClearable
                  onClear={() => setSearchQuery('')}
                />

                <Select
                  label={t('orderStatus')}
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusItems.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label={t('orderType')}
                  selectedKeys={typeFilter ? [typeFilter] : []}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {typeItems.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>

                <Button
                  color="default"
                  variant="flat"
                  onPress={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setTypeFilter('all')
                    setPage(1)
                  }}
                >
                  {t('reset')}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardBody className="p-0">
            <Table
              aria-label="جدول الطلبات"
              bottomContent={
                totalPages > 1 ? (
                  <div className="flex justify-center w-full">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={totalPages}
                      onChange={setPage}
                    />
                  </div>
                ) : null
              }
            >
              <TableHeader>
                <TableColumn>{t('orderNumber')}</TableColumn>
                <TableColumn>{t('customer')}</TableColumn>
                <TableColumn>{t('type')}</TableColumn>
                <TableColumn>{t('status')}</TableColumn>
                <TableColumn>{t('paymentStatus')}</TableColumn>
                <TableColumn>{t('total')}</TableColumn>
                <TableColumn>{t('date')}</TableColumn>
                <TableColumn>{t('actions')}</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner />}
                emptyContent={<p className="py-8 text-default-400 text-center">{t('noOrders')}</p>}
              >
                {orders.map((order) => {
                  const statusConfig = ORDER_STATUS_CONFIG[order.status]
                  const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus]
                  const typeConfig = ORDER_TYPE_CONFIG[order.orderType]

                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="solar:bill-list-bold"
                            width={20}
                            className="text-default-400"
                          />
                          <span className="font-medium">
                            #{order.orderNumber || order.id.slice(-6)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-default-400 text-sm">{order.customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          startContent={<Icon icon={typeConfig.icon} width={16} />}
                          variant="flat"
                          size="sm"
                        >
                          {t(typeConfig.key)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          startContent={<Icon icon={statusConfig.icon} width={16} />}
                          color={statusConfig.color}
                          variant="flat"
                          size="sm"
                        >
                          {t(statusConfig.key)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color={paymentConfig.color} variant="dot" size="sm">
                          {t(paymentConfig.key)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {formatCurrency(order.pricing?.total || 0, {
                            currency: 'SAR',
                            locale: 'ar-SA',
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <p className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-default-400 text-xs">
                            {new Date(order.createdAt).toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleViewDetails(order)}
                        >
                          <Icon icon="solar:eye-bold" width={20} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Order Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside" dir="rtl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:bill-list-bold" width={24} />
                    <span>
                      {t('orderDetails')} #
                      {selectedOrder?.orderNumber || selectedOrder?.id.slice(-6)}
                    </span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  {selectedOrder && (
                    <div className="flex flex-col gap-4">
                      {/* Order Info */}
                      <Card>
                        <CardBody className="gap-3">
                          <div className="gap-4 grid grid-cols-2">
                            <div>
                              <p className="text-default-500 text-sm">{t('customerLabel')}</p>
                              <p className="font-medium">{selectedOrder.customer.name}</p>
                              <p className="text-default-400 text-sm">
                                {selectedOrder.customer.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm">{t('orderTypeLabel')}</p>
                              <Chip
                                startContent={
                                  <Icon
                                    icon={ORDER_TYPE_CONFIG[selectedOrder.orderType].icon}
                                    width={16}
                                  />
                                }
                                variant="flat"
                                size="sm"
                              >
                                {t(ORDER_TYPE_CONFIG[selectedOrder.orderType].key)}
                              </Chip>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm">{t('orderStatusLabel')}</p>
                              <Chip
                                startContent={
                                  <Icon
                                    icon={ORDER_STATUS_CONFIG[selectedOrder.status].icon}
                                    width={16}
                                  />
                                }
                                color={ORDER_STATUS_CONFIG[selectedOrder.status].color}
                                variant="flat"
                                size="sm"
                              >
                                {t(ORDER_STATUS_CONFIG[selectedOrder.status].key)}
                              </Chip>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm">{t('paymentStatusLabel')}</p>
                              <Chip
                                color={PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].color}
                                variant="dot"
                                size="sm"
                              >
                                {t(PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].key)}
                              </Chip>
                            </div>
                          </div>

                          {selectedOrder.deliveryAddress && (
                            <div>
                              <p className="mb-1 text-default-500 text-sm">
                                {t('deliveryAddress')}
                              </p>
                              <p className="text-sm">
                                {selectedOrder.deliveryAddress.street},{' '}
                                {selectedOrder.deliveryAddress.district},{' '}
                                {selectedOrder.deliveryAddress.city}
                              </p>
                              {selectedOrder.deliveryAddress.notes && (
                                <p className="mt-1 text-default-400 text-sm">
                                  {selectedOrder.deliveryAddress.notes}
                                </p>
                              )}
                            </div>
                          )}

                          {selectedOrder.notes && (
                            <div>
                              <p className="mb-1 text-default-500 text-sm">{t('notes')}</p>
                              <p className="text-sm">{selectedOrder.notes}</p>
                            </div>
                          )}
                        </CardBody>
                      </Card>

                      {/* Order Items */}
                      <div>
                        <h3 className="mb-3 font-semibold text-lg">{t('items')}</h3>
                        <div className="flex flex-col gap-2">
                          {selectedOrder.items.map((item, index) => (
                            <Card key={item.id || index}>
                              <CardBody className="p-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {typeof item.menuItem === 'object'
                                        ? item.menuItem.name
                                        : item.menuItem}
                                    </p>
                                    {item.customizations && (
                                      <p className="text-default-400 text-sm">
                                        {item.customizations}
                                      </p>
                                    )}
                                    {item.specialInstructions && (
                                      <p className="text-default-500 text-sm italic">
                                        {item.specialInstructions}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium">
                                      {formatCurrency(item.subtotal || 0, {
                                        currency: 'SAR',
                                        locale: 'ar-SA',
                                      })}
                                    </p>
                                    <p className="text-default-400 text-sm">
                                      {item.quantity} ×{' '}
                                      {formatCurrency(item.price, {
                                        currency: 'SAR',
                                        locale: 'ar-SA',
                                      })}
                                    </p>
                                  </div>
                                </div>
                                {item.kitchenStatus && (
                                  <div className="mt-2">
                                    <Chip size="sm" variant="flat">
                                      {item.kitchenStatus === 'pending' && t('kitchenPending')}
                                      {item.kitchenStatus === 'preparing' && t('kitchenPreparing')}
                                      {item.kitchenStatus === 'ready' && t('kitchenReady')}
                                      {item.kitchenStatus === 'served' && t('kitchenServed')}
                                    </Chip>
                                  </div>
                                )}
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <Card>
                        <CardBody className="gap-2">
                          <div className="flex justify-between">
                            <span>{t('subtotal')}</span>
                            <span className="font-medium">
                              {formatCurrency(selectedOrder.pricing?.subtotal || 0, {
                                currency: 'SAR',
                                locale: 'ar-SA',
                              })}
                            </span>
                          </div>
                          {selectedOrder.pricing?.tax ? (
                            <div className="flex justify-between text-sm">
                              <span>{t('tax')}</span>
                              <span>
                                {formatCurrency(selectedOrder.pricing.tax, {
                                  currency: 'SAR',
                                  locale: 'ar-SA',
                                })}
                              </span>
                            </div>
                          ) : null}
                          {selectedOrder.pricing?.discount ? (
                            <div className="flex justify-between text-success text-sm">
                              <span>{t('discount')}</span>
                              <span>
                                -
                                {formatCurrency(selectedOrder.pricing.discount, {
                                  currency: 'SAR',
                                  locale: 'ar-SA',
                                })}
                              </span>
                            </div>
                          ) : null}
                          <div className="pt-2 border-default-200 border-t"></div>
                          <div className="flex justify-between font-bold text-lg">
                            <span>{t('grandTotal')}</span>
                            <span className="text-primary">
                              {formatCurrency(selectedOrder.pricing?.total || 0, {
                                currency: 'SAR',
                                locale: 'ar-SA',
                              })}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    {t('close')}
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      // Handle print or other actions
                      window.print()
                    }}
                  >
                    {t('print')}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
