'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuthGuard } from '@/lib/useAuthGuard'
import { uploadRoomImages } from '@/lib/uploadRoomImages'
import { useRouter } from 'next/navigation'

export default function AddRoomPage() {
  useAuthGuard('owner')
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [rent, setRent] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [tenantPreference, setTenantPreference] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !location.trim() ||
      !rent ||
      !propertyType.trim() ||
      !tenantPreference.trim() ||
      !contactNumber.trim() ||
      images.length === 0
    ) {
      alert('Please fill all fields and add at least one image')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Not authenticated')
      setLoading(false)
      return
    }

    try {
      const imageUrls = await uploadRoomImages(images, user.id)

      const { error } = await supabase.from('rooms').insert({
        owner_id: user.id,
        title,
        location,
        rent: Number(rent),
        property_type: propertyType,
        tenant_preference: tenantPreference,
        contact_number: contactNumber,
        images: imageUrls,
      })

      if (error) throw error

      router.push('/owner/dashboard')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 flex justify-center">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Add a new room
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Fill in the details below to list your room
          </p>
        </div>

        {/* Form card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="grid gap-4">
            <input
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Room title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Monthly rent"
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Property type (1 BHK, 2 BHK, 1 Bed)"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Tenant preference"
              value={tenantPreference}
              onChange={(e) => setTenantPreference(e.target.value)}
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />

            {/* Image upload */}
            <div className="border border-dashed border-zinc-700 rounded-xl p-4 text-sm text-zinc-400">
              <p className="mb-2">
                Upload room images (at least one)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImages(Array.from(e.target.files || []))
                }
                className="text-zinc-300"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/40"
          >
            {loading ? 'Adding room…' : 'Add room'}
          </button>
        </div>
      </div>
    </div>
  )
}
