'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      await supabase.auth.getSession()
      router.replace('/')
    }

    handleAuth()
  }, [router])

  return <p className="p-6 text-white">Signing you in...</p>
}
