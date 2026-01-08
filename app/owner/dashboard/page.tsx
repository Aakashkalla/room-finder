'use client'

import { useAuthGuard } from '@/lib/useAuthGuard'

export default function OwnerDashboard() {
  useAuthGuard('owner')

  return <h1 className="p-6 text-xl">Owner Dashboard</h1>
}
