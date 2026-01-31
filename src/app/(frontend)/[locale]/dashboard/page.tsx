'use client'

import { Content } from '@/components/client-dashboard/home/content'

export default function DashboardPage() {
  // Auth check is handled by middleware (proxy.ts)
  // If user reaches here, they are authenticated

  return <Content />
}
