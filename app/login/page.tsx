"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleLogin = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-zinc-900/20 via-transparent to-zinc-900/20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            RoomFinder
          </h1>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="text-sm text-zinc-400">
              Login with your email to continue
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-900/50"
            >
              {loading ? 'Sending link…' : 'Send login link'}
            </button>
          </div>

          {message.text && (
            <div className={`text-sm text-center p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <p className="text-xs text-center text-zinc-500">
            We'll email you a secure magic link. No password needed.
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  )
}