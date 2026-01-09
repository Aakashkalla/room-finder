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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-zinc-900/20 via-transparent to-zinc-900/20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl space-y-10">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Choose your role
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Tell us what you’re here for so we can tailor your experience
          </p>
        </div>

        {/* Role cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Finder */}
          <button
            onClick={() => selectRole('finder')}
            className="group text-left bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/30"
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Find a Room
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Browse available rooms, filter by location, price, and
              preferences, and find a place that suits you.
            </p>

            <div className="mt-4 text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Continue →
            </div>
          </button>

          {/* Owner */}
          <button
            onClick={() => selectRole('owner')}
            className="group text-left bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-900/30"
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              List Your Room
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Add your room with images, pricing, and preferences, and
              connect with people looking for a place.
            </p>

            <div className="mt-4 text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Continue →
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
