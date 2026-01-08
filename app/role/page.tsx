'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useAuthGuard } from '@/lib/useAuthGuard'

export default function SelectRolePage() {
    useAuthGuard(undefined, true)
    const router = useRouter()

  const selectRole = async (role: 'finder' | 'owner') => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Not logged in')
      return
    }

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      role,
    })

    if (error) {
      alert(error.message)
    } else {
      router.replace('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded w-96">
        <h1 className="text-xl font-bold mb-4">
          Choose your role
        </h1>

        <div className="space-y-3">
          <button
            onClick={() => selectRole('finder')}
            className="w-full border p-3 rounded hover:bg-gray-100"
          >
            I am looking for a room
          </button>

          <button
            onClick={() => selectRole('owner')}
            className="w-full border p-3 rounded hover:bg-gray-100"
          >
            I want to list my room
          </button>
        </div>
      </div>
    </div>
  )
}
