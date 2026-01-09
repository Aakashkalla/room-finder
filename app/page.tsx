'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const decideRoute = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace('/landing')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        router.replace('/select-role')
        return
      }

      if (profile.role === 'owner') {
        router.replace('/owner/dashboard')
      } else {
        router.replace('/rooms')
      }
    }

    decideRoute()
  }, [router])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        <p className="text-zinc-400 text-sm">
          Checking your session…
        </p>
      </div>
    </div>
  )
}
