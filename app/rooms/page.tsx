'use client'

import { useAuthGuard } from '@/lib/useAuthGuard'

export default function RoomsPage() {
  useAuthGuard('finder')

  return <h1 className="p-6 text-xl">Room Listings</h1>
}
