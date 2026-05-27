'use client'

import { useAdminStore } from '@/lib/store'
import { Menu, Bell, Plus, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

const SECTION_TITLES: Record<string, string> = {
  overview:     'Overview Dashboard',
  models:       'All Profiles',
  snapchat:     'Snapchat Profiles',
  telegram:     'Telegram Profiles',
  whatsapp:     'WhatsApp Profiles',
  onlyfans:     'OnlyFans Profiles',
  payments:     'Payments',
  members:      'Members',
  verification: 'Verification',
  affiliates:   'Affiliates',
  media:        'Media Library',
  settings:     'Settings',
}

export default function Topbar() {
  const { toggleSidebar, openCreateModal, setSearchQuery, searchQuery } = useAdminStore()
  const pathname = usePathname()
  const section = pathname.split('/').pop() || 'overview'

  const showAddButton = ['models', 'snapchat', 'telegram', 'whatsapp', 'onlyfans'].includes(section)

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-border"
      style={{
        background: 'var(--header-bg)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-foreground/60 hover:text-foreground transition-colors p-1 -ml-1 flex-shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Title */}
      <h1 className="font-bold text-foreground text-base sm:text-lg flex-shrink-0">
        {SECTION_TITLES[section] ?? 'Admin'}
      </h1>

      {/* Search bar – hidden on smallest mobile */}
      <div className="relative flex-1 hidden sm:block max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
        />
        <input
          type="text"
          placeholder="Search profiles…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-base pl-9 py-2 text-xs"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notification bell */}
        <button className="relative text-foreground/50 hover:text-foreground transition-colors p-2 rounded-xl bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/15 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50">
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--pink)', boxShadow: '0 0 8px var(--pink)' }}
          />
        </button>

        {/* Add profile CTA */}
        {showAddButton && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{
              background: 'linear-gradient(135deg, var(--pink), var(--purple))',
              boxShadow: '0 0 20px rgba(224,51,107,0.4)',
            }}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Profile</span>
          </button>
        )}
      </div>
    </header>
  )
}
