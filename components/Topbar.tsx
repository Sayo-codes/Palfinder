'use client'

import { useAdminStore } from '@/lib/store'
import { Menu, Bell, Plus, Search } from 'lucide-react'

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
  const { activeSection, toggleSidebar, openCreateModal, setSearchQuery, searchQuery } = useAdminStore()

  const showAddButton = ['models', 'snapchat', 'telegram', 'whatsapp', 'onlyfans'].includes(activeSection)

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3.5"
      style={{
        background: 'rgba(8,8,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-white/60 hover:text-white transition-colors p-1 -ml-1 flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Title */}
      <h1 className="font-bold text-white text-base sm:text-lg flex-shrink-0">
        {SECTION_TITLES[activeSection] ?? 'Admin'}
      </h1>

      {/* Search bar – hidden on smallest mobile */}
      <div className="relative flex-1 hidden sm:block max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
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
        {/* Notification bell */}
        <button className="relative text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
          <Bell size={18} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: '#FF1B8D', boxShadow: '0 0 8px rgba(255,27,141,0.8)' }}
          />
        </button>

        {/* Add profile CTA */}
        {showAddButton && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FF1B8D, #B026FF)',
              boxShadow: '0 0 20px rgba(255,27,141,0.4)',
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
