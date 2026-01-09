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

  const [allRooms, setAllRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  const [location, setLocation] = useState('')
  const [minRent, setMinRent] = useState('')
  const [maxRent, setMaxRent] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [tenantPreference, setTenantPreference] = useState('')

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select(
          'id, title, location, rent, property_type, tenant_preference, images'
        )
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAllRooms(data)
        setFilteredRooms(data)
      }

      setLoading(false)
    }

    fetchRooms()
  }, [])

  useEffect(() => {
    let result = allRooms

    if (location.trim()) {
      result = result.filter((room) =>
        room.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (minRent) {
      result = result.filter((room) => room.rent >= Number(minRent))
    }

    if (maxRent) {
      result = result.filter((room) => room.rent <= Number(maxRent))
    }

    if (propertyType) {
      result = result.filter(
        (room) => room.property_type === propertyType
      )
    }

    if (tenantPreference) {
      result = result.filter(
        (room) => room.tenant_preference === tenantPreference
      )
    }

    setFilteredRooms(result)
  }, [
    location,
    minRent,
    maxRent,
    propertyType,
    tenantPreference,
    allRooms,
  ])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading rooms…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 space-y-8">
      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">
          Available Rooms
        </h1>
        <p className="text-zinc-400 text-sm">
          Browse rooms that match your preferences
        </p>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 grid gap-3 md:grid-cols-5">
        <input
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Min Rent"
          type="number"
          value={minRent}
          onChange={(e) => setMinRent(e.target.value)}
        />

        <input
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Max Rent"
          type="number"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
        />

        <select
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Property Type</option>
          <option value="1 BHK">1 BHK</option>
          <option value="2 BHK">2 BHK</option>
          <option value="1 Bed">1 Bed</option>
        </select>

        <select
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={tenantPreference}
          onChange={(e) => setTenantPreference(e.target.value)}
        >
          <option value="">Tenant Preference</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Family">Family</option>
          <option value="Girls">Girls</option>
          <option value="Working">Working</option>
        </select>
      </div>

      {/* Rooms */}
      {filteredRooms.length === 0 && (
        <p className="text-zinc-400">
          No rooms match your filters.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-200"
          >
            {room.images?.[0] && (
              <img
                src={room.images[0]}
                alt={room.title}
                className="h-44 w-full object-cover"
              />
            )}

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-white">
                {room.title}
              </h2>

              <p className="text-sm text-zinc-400">
                {room.location}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-emerald-400 font-semibold">
                  ₹{room.rent}
                </span>

                <span className="text-xs text-zinc-400">
                  {room.property_type} • {room.tenant_preference}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
