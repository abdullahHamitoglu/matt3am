import type { LucideIcon } from 'lucide-react'

export type TabType = 'dashboard' | 'floor-plan' | 'menu' | 'kitchen' | 'orders'
export type ModalType =
  | 'tableDetails'
  | 'editFloorPlan'
  | 'newOrder'
  | 'reservation'
  | 'orderDetails'
  | null
export type TableStatus = 'free' | 'ordering' | 'payment'
export type OrderStatus = 'new' | 'cooking' | 'ready'
export type ThemeColor = 'slate' | 'emerald' | 'blue' | 'amber' | 'rose'

export interface TableData {
  id: string
  zoneName: string
  themeColor?: ThemeColor
  status: TableStatus
  guests?: number
  capacity?: number
  time?: string
  bill?: string
}

export interface SidebarItemProps {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export interface StatCardProps {
  title: string
  value: string
  subtext: string
  icon: LucideIcon
  trend: 'up' | 'down'
  trendValue: string
}

export interface ActivityItemProps {
  orderId: string
  table: string
  items: string
  time: string
  status: OrderStatus
  onClick: () => void
}

export interface PopularItemProps {
  name: string
  count: string
  price: string
  rank: number
}

export interface TableCardProps {
  data: TableData
  onClick: (data: TableData) => void
}

export interface DashboardViewProps {
  onOpenModal: (modal: ModalType) => void
  onOpenOrder: (id: string) => void
}

export interface FloorPlanViewProps {
  tablesData: TableData[]
  onTableClick: (table: TableData) => void
  onAddTable: () => void
}
