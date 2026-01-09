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
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading your rooms…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            My Rooms
          </h1>
          <p className="text-zinc-400 text-sm">
            Manage the rooms you’ve listed
          </p>
        </div>

        <button
          onClick={() => router.push('/owner/add')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-900/40"
        >
          + Add Room
        </button>
      </div>

      {/* Empty state */}
      {rooms.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-400">
          You haven’t added any rooms yet.
        </div>
      )}

      {/* Rooms list */}
      <div className="grid gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">
                {room.title}
              </h2>
              <p className="text-sm text-zinc-400">
                {room.location} • ₹{room.rent}
              </p>
            </div>

            <button
              onClick={async () => {
                const confirmDelete = confirm(
                  'Are you sure you want to delete this room?'
                )
                if (!confirmDelete) return

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

                if (roomData?.images?.length) {
                  await deleteRoomImages(roomData.images)
                }

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
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
