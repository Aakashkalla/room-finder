'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Role = 'owner' | 'finder'

export function useAuthGuard(
  requiredRole?: Role,
  redirectIfProfileExists: boolean = false
) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        if (!redirectIfProfileExists) return
        router.replace('/select-role')
        return
      }

      if (redirectIfProfileExists) {
        router.replace('/')
        return
      }

      if (requiredRole && profile.role !== requiredRole) {
        router.replace('/')
      }
    }

    checkAuth()
  }, [router, requiredRole, redirectIfProfileExists])
}
