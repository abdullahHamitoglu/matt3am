import { DashboardLayout } from '@/components/client-dashboard/layout/layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
