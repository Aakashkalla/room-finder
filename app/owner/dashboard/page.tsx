'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuthGuard } from '@/lib/useAuthGuard'
import { useRouter } from 'next/navigation'
import { deleteRoomImages } from '@/lib/deleteRoomImages'

type Room = {
  id: string
  title: string
  location: string
  rent: number
}

export default function OwnerDashboard() {
  useAuthGuard('owner')
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('rooms')
        .select('id, title, location, rent')
        .eq('owner_id', user.id)
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
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Rooms</h1>
        <button
          onClick={() => router.push('/owner/add')}
          className="bg-black text-white px-4 py-2"
        >
          Add Room
        </button>
      </div>

      {rooms.length === 0 && <p>No rooms added yet.</p>}

      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{room.title}</h2>
              <p className="text-sm text-gray-600">
                {room.location} • ₹{room.rent}
              </p>
            </div>

            <button
              onClick={async () => {
                const confirmDelete = confirm(
                  'Are you sure you want to delete this room?'
                )
                if (!confirmDelete) return

                // 1️⃣ Fetch images for this room
                const { data: roomData, error: fetchError } =
                  await supabase
                    .from('rooms')
                    .select('images')
                    .eq('id', room.id)
                    .single()

                if (fetchError) {
                  alert(fetchError.message)
                  return
                }

                // 2️⃣ Delete images from storage
                if (roomData?.images?.length) {
                  await deleteRoomImages(roomData.images)
                }

                // 3️⃣ Delete room row
                const { error: deleteError } = await supabase
                  .from('rooms')
                  .delete()
                  .eq('id', room.id)

                if (!deleteError) {
                  setRooms((prev) =>
                    prev.filter((r) => r.id !== room.id)
                  )
                } else {
                  alert(deleteError.message)
                }
              }}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
