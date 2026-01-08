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
    <div className="min-h-screen flex justify-center p-6">
      <div className="w-full max-w-lg border p-6 rounded space-y-4">
        <h1 className="text-xl font-bold">Add Room</h1>

        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Rent"
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Property Type (1 BHK, 2 BHK)"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Tenant Preference"
          value={tenantPreference}
          onChange={(e) => setTenantPreference(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setImages(Array.from(e.target.files || []))
          }
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white p-2 w-full"
        >
          {loading ? 'Adding...' : 'Add Room'}
        </button>
      </div>
    </div>
  )
}
