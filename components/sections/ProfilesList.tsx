'use client'

import { useAdminStore } from '@/lib/store'
import ProfileCard from '../ProfileCard'
import { Platform } from '@/lib/types'
import { Search, SlidersHorizontal, Users } from 'lucide-react'
import SnapchatIcon from '../icons/SnapchatIcon'
import TelegramIcon from '../icons/TelegramIcon'
import WhatsAppIcon from '../icons/WhatsAppIcon'
import OnlyFansIcon from '../icons/OnlyFansIcon'

const PLATFORM_FILTERS: { id: Platform | 'all'; label: string; icon?: React.ReactNode }[] = [
  { id: 'all',      label: 'All' },
  { id: 'snapchat', label: 'Snapchat', icon: <SnapchatIcon size={12} /> },
  { id: 'telegram', label: 'Telegram', icon: <TelegramIcon size={12} /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon size={12} /> },
  { id: 'onlyfans', label: 'OnlyFans', icon: <OnlyFansIcon size={12} /> },
]

const PLATFORM_COLORS: Record<string, string> = {
  snapchat: '#FFD600', telegram: '#00A8FF', whatsapp: '#00FF7F', onlyfans: '#00D4FF',
}

export default function ProfilesList() {
  const {
    profiles, searchQuery, setSearchQuery,
    platformFilter, setPlatformFilter, openCreateModal,
  } = useAdminStore()

  const filtered = profiles.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPlatform = platformFilter === 'all' || p.platforms.includes(platformFilter)
    return matchSearch && matchPlatform
  })

  return (
    <div className="space-y-4 animate-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, username, country…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-9"
          />
        </div>
        {/* Filter button hint */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition sm:flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <SlidersHorizontal size={14} /> Filter
        </button>
      </div>

      {/* Platform filter pills */}
      <div className="flex gap-2 flex-wrap">
        {PLATFORM_FILTERS.map(({ id, label, icon }) => {
          const active = platformFilter === id
          const color = id !== 'all' ? PLATFORM_COLORS[id] : '#FF1B8D'
          return (
            <button
              key={id}
              onClick={() => setPlatformFilter(id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={active
                ? { background: `${color}20`, color, border: `1px solid ${color}40`, boxShadow: `0 0 12px ${color}30` }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {icon}{label}
            </button>
          )
        })}
        <span className="ml-auto text-xs text-white/30 self-center">{filtered.length} profiles</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={40} className="text-white/10 mb-3" />
          <p className="text-white/40 font-medium">No profiles found</p>
          <p className="text-xs text-white/25 mt-1">Try adjusting your search or filters</p>
          <button onClick={openCreateModal}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)', boxShadow: '0 0 20px rgba(255,27,141,0.3)' }}>
            Add First Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  )
}
