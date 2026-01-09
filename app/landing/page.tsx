"use client"

import { useRouter } from "next/navigation"

export default function LandingPage() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-zinc-800/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            RoomFinder
        </h1>
        <button
            onClick={()=> router.push('/login')}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-zinc-900"
        >
          Login
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900/20 via-transparent to-zinc-900/20 pointer-events-none" />
        
        {/* Accent glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Find the right room.
            <br />
            <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Or list yours in minutes.
            </span>
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A simple platform to discover rental rooms or list your
            property with images, pricing, and preferences — all in one
            place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={()=> router.push('/login')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg shadow-emerald-900/50 hover:shadow-emerald-800/50 hover:scale-105">
              Find a Room
            </button>

            <button onClick={()=> router.push('/login')} className="border-2 border-zinc-700 hover:border-emerald-500/50 px-8 py-4 rounded-xl text-base font-semibold hover:bg-zinc-900 transition-all duration-200 hover:scale-105">
              List Your Room
            </button>
          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-zinc-800/50 text-center text-sm text-zinc-500">
        RoomFinder • {new Date().getFullYear()}
      </footer>
    </div>
  )
}