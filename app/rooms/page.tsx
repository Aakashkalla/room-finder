'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuthGuard } from '@/lib/useAuthGuard'

type Room = {
  id: string
  title: string
  location: string
  rent: number
  property_type: string
  tenant_preference: string
  images: string[] | null
}

export default function RoomsPage() {
  useAuthGuard('finder')

  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select(
          'id, title, location, rent, property_type, tenant_preference, images'
        )
        .order('created_at', { ascending: false })

      if (!error && data) {
        setRooms(data)
      }

      setLoading(false)
    }

    fetchRooms()
  }, [])

  if (loading) {
    return <p className="p-6">Loading rooms...</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Available Rooms</h1>

      {rooms.length === 0 && <p>No rooms available.</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded overflow-hidden"
          >
            {room.images?.[0] && (
              <img
                src={room.images[0]}
                alt={room.title}
                className="h-40 w-full object-cover"
              />
            )}

            <div className="p-4 space-y-1">
              <h2 className="font-semibold">{room.title}</h2>
              <p className="text-sm text-gray-600">
                {room.location}
              </p>

              <p className="font-medium">
                ₹{room.rent}
              </p>

              <p className="text-sm">
                {room.property_type} • {room.tenant_preference}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
