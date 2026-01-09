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

  // filters
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

    // Location (highest priority)
    if (location.trim()) {
      result = result.filter((room) =>
        room.location
          .toLowerCase()
          .includes(location.toLowerCase())
      )
    }

    // Price range
    if (minRent) {
      result = result.filter(
        (room) => room.rent >= Number(minRent)
      )
    }

    if (maxRent) {
      result = result.filter(
        (room) => room.rent <= Number(maxRent)
      )
    }

    // Property type
    if (propertyType) {
      result = result.filter(
        (room) => room.property_type === propertyType
      )
    }

    // Tenant preference
    if (tenantPreference) {
      result = result.filter(
        (room) =>
          room.tenant_preference === tenantPreference
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
    return <p className="p-6">Loading rooms...</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Available Rooms</h1>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-5">
        <input
          className="border p-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Min Rent"
          type="number"
          value={minRent}
          onChange={(e) => setMinRent(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Max Rent"
          type="number"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
        />

        <select
          className="border p-2"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Property Type</option>
          <option value="1 BHK">1 BHK</option>
          <option value="2 BHK">2 BHK</option>
          <option value="1 Bed">1 Bed</option>
        </select>

        <select
          className="border p-2"
          value={tenantPreference}
          onChange={(e) =>
            setTenantPreference(e.target.value)
          }
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
        <p>No rooms match your filters.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
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
                {room.property_type} •{' '}
                {room.tenant_preference}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
