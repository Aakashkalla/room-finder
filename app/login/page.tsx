'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
    const [email, setEmail] = useState<string>('')

    const handleLogin = async () => {
    if (!email) {
        alert('Please enter your email')
        return
    }

    const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
    emailRedirectTo: 'http://localhost:3000/auth/callback',
    },
})

    if (error) {
        alert(error.message)
    } else {
        alert('Check your email for the login link')
    }
}

    return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="border p-6 rounded w-80">
        <h1 className="text-xl mb-4">Login</h1>

        <input
            type="email"
            placeholder="Enter email"
            className="border w-full p-2 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <button
            onClick={handleLogin}
            className="bg-black text-white w-full p-2"
        >
            Send OTP
        </button>
        </div>
    </div>
    )
}
