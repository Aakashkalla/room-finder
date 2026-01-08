'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DebugPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      setUser(session.user)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.log('profile error:', error.message)
      } else {
        setProfile(data)
      }
    }
  }

  getSession()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      setUser(session.user)
    }
  })

  return () => {
    subscription.unsubscribe()
  }
}, [])


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Debug Page</h1>

      <pre className="bg-gray-100 p-4 rounded mb-4">
        USER:
        {JSON.stringify(user, null, 2)}
      </pre>

      <pre className="bg-gray-100 p-4 rounded">
        PROFILE:
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  )
}
