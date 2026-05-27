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
      <div className="w-10 h-10 rounded-xl bg-black/8 dark:bg-white/5 border border-black/15 dark:border-white/10 opacity-40 animate-pulse flex-shrink-0" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-black/8 dark:bg-white/8 border border-black/15 dark:border-white/12 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/15 dark:hover:bg-white/15 hover:border-black/25 dark:hover:border-white/20 transition-all duration-300 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent flex-shrink-0"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out transform ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        >
          <Sun className="w-5 h-5 text-amber-500 dark:text-[#FFD600] fill-amber-400/20 dark:fill-[#FFD600]/20" />
        </div>
        {/* Moon Icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out transform ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        >
          <Moon className="w-5 h-5 text-[#D41A75] dark:text-[#E0336B] fill-[#D41A75]/15 dark:fill-[#E0336B]/15" />
        </div>
      </div>
    </button>
  )
}
