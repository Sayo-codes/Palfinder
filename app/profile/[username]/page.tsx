import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'
import { use } from 'react'

export default function ProfilePlaceholder({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  
  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 pt-6 pb-16 max-w-6xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full flex justify-between items-center mb-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-foreground/70 hover:text-foreground text-sm rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="bg-palfinder-surface border border-border rounded-3xl p-10 max-w-md w-full text-center flex flex-col items-center shadow-[0_0_40px_rgba(212,26,117,0.06)]">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1] mb-6 flex items-center justify-center text-3xl font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold mb-2 text-foreground">@{username}</h1>
        <p className="text-foreground/50 mb-8">Profile details coming soon.</p>
        
        <Link href="/" className="px-8 py-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-foreground font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50">
          Return Home
        </Link>
      </div>
    </div>
  )
}
