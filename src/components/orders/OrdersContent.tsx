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
import { useOrders } from '@/hooks/orders'
import { useRestaurantSelection } from '@/hooks/restaurants'
import type { Order } from '@/payload-types'
import { formatCurrency } from '@/lib/currency'

const ORDER_STATUS_CONFIG = {
  pending: { label: 'قيد الانتظار', color: 'warning' as const, icon: 'solar:clock-circle-bold' },
  confirmed: { label: 'تم التأكيد', color: 'primary' as const, icon: 'solar:check-circle-bold' },
  preparing: { label: 'قيد التحضير', color: 'secondary' as const, icon: 'solar:chef-hat-bold' },
  ready: { label: 'جاهز', color: 'success' as const, icon: 'solar:box-bold' },
  served: { label: 'تم التقديم', color: 'success' as const, icon: 'solar:check-circle-bold' },
  delivering: { label: 'قيد التوصيل', color: 'primary' as const, icon: 'solar:delivery-bold' },
  completed: { label: 'مكتمل', color: 'success' as const, icon: 'solar:verified-check-bold' },
  cancelled: { label: 'ملغي', color: 'danger' as const, icon: 'solar:close-circle-bold' },
}

const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'معلق', color: 'warning' as const },
  paid: { label: 'مدفوع', color: 'success' as const },
  'partially-paid': { label: 'مدفوع جزئياً', color: 'primary' as const },
  refunded: { label: 'مسترجع', color: 'danger' as const },
}

const ORDER_TYPE_CONFIG = {
  'dine-in': { label: 'داخل المطعم', icon: 'solar:chair-2-bold' },
  takeaway: { label: 'سفري', icon: 'solar:bag-4-bold' },
  delivery: { label: 'توصيل', icon: 'solar:delivery-bold' },
}

export const OrdersContent: React.FC = () => {
  const { selectedRestaurant } = useRestaurantSelection()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

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
    { key: 'all', label: 'الكل' },
    ...Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => ({
      key,
      label: config.label,
    })),
  ]

  const typeItems = [
    { key: 'all', label: 'الكل' },
    ...Object.entries(ORDER_TYPE_CONFIG).map(([key, config]) => ({
      key,
      label: config.label,
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
              <p className="text-danger">حدث خطأ أثناء تحميل الطلبات</p>
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
            <h1 className="font-bold text-3xl">الطلبات</h1>
            <Button color="primary" startContent={<Icon icon="solar:add-circle-bold" width={20} />}>
              طلب جديد
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardBody className="gap-4">
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  placeholder="البحث برقم الطلب أو الاسم أو الهاتف..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Icon icon="solar:magnifer-bold" width={20} />}
                  isClearable
                  onClear={() => setSearchQuery('')}
                />

                <Select
                  label="حالة الطلب"
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusItems.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="نوع الطلب"
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
                  إعادة تعيين
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
                <TableColumn>رقم الطلب</TableColumn>
                <TableColumn>العميل</TableColumn>
                <TableColumn>النوع</TableColumn>
                <TableColumn>الحالة</TableColumn>
                <TableColumn>حالة الدفع</TableColumn>
                <TableColumn>المجموع</TableColumn>
                <TableColumn>التاريخ</TableColumn>
                <TableColumn>الإجراءات</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner />}
                emptyContent={<p className="py-8 text-default-400 text-center">لا توجد طلبات</p>}
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
                          {typeConfig.label}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          startContent={<Icon icon={statusConfig.icon} width={16} />}
                          color={statusConfig.color}
                          variant="flat"
                          size="sm"
                        >
                          {statusConfig.label}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip color={paymentConfig.color} variant="dot" size="sm">
                          {paymentConfig.label}
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
                      تفاصيل الطلب #{selectedOrder?.orderNumber || selectedOrder?.id.slice(-6)}
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
                              <p className="text-default-500 text-sm">العميل</p>
                              <p className="font-medium">{selectedOrder.customer.name}</p>
                              <p className="text-default-400 text-sm">
                                {selectedOrder.customer.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm">نوع الطلب</p>
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
                                {ORDER_TYPE_CONFIG[selectedOrder.orderType].label}
                              </Chip>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm">حالة الطلب</p>
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
                                {ORDER_STATUS_CONFIG[selectedOrder.status].label}
                              </Chip>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm">حالة الدفع</p>
                              <Chip
                                color={PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].color}
                                variant="dot"
                                size="sm"
                              >
                                {PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].label}
                              </Chip>
                            </div>
                          </div>

                          {selectedOrder.deliveryAddress && (
                            <div>
                              <p className="mb-1 text-default-500 text-sm">عنوان التوصيل</p>
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
                              <p className="mb-1 text-default-500 text-sm">ملاحظات</p>
                              <p className="text-sm">{selectedOrder.notes}</p>
                            </div>
                          )}
                        </CardBody>
                      </Card>

                      {/* Order Items */}
                      <div>
                        <h3 className="mb-3 font-semibold text-lg">الأصناف</h3>
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
                                      {item.kitchenStatus === 'pending' && 'معلق'}
                                      {item.kitchenStatus === 'preparing' && 'قيد التحضير'}
                                      {item.kitchenStatus === 'ready' && 'جاهز'}
                                      {item.kitchenStatus === 'served' && 'تم التقديم'}
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
                            <span>المجموع الفرعي</span>
                            <span className="font-medium">
                              {formatCurrency(selectedOrder.pricing?.subtotal || 0, {
                                currency: 'SAR',
                                locale: 'ar-SA',
                              })}
                            </span>
                          </div>
                          {selectedOrder.pricing?.tax ? (
                            <div className="flex justify-between text-sm">
                              <span>الضريبة</span>
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
                              <span>الخصم</span>
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
                            <span>المجموع الكلي</span>
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
                    إغلاق
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      // Handle print or other actions
                      window.print()
                    }}
                  >
                    طباعة
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
