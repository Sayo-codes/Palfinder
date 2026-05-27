'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 opacity-40 animate-pulse" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5 text-black/50 dark:text-white/55 hover:text-black dark:hover:text-white hover:bg-black/15 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/10 transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Sun Icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out transform ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        >
          <Sun className="w-4 h-4 text-yellow-600 dark:text-[#FFD600] fill-yellow-500/10 dark:fill-[#FFD600]/20" />
        </div>
        {/* Moon Icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out transform ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        >
          <Moon className="w-4 h-4 text-[#C91A63] dark:text-[#E0336B] fill-[#C91A63]/10 dark:fill-[#E0336B]/15" />
        </div>
      </div>
    </button>
  )
}
