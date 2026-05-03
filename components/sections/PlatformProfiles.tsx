'use client'

import { Platform } from '@/lib/types'
import { useAdminStore } from '@/lib/store'
import ProfileCard from '../ProfileCard'
import { Search, Plus } from 'lucide-react'
import SnapchatIcon from '../icons/SnapchatIcon'
import TelegramIcon from '../icons/TelegramIcon'
import WhatsAppIcon from '../icons/WhatsAppIcon'
import OnlyFansIcon from '../icons/OnlyFansIcon'

interface Props { platform: Platform }

const META: Record<Platform, { label: string; color: string; icon: React.ReactNode; desc: string }> = {
  snapchat: { label: 'Snapchat', color: '#FFD600', icon: <SnapchatIcon size={20} />, desc: 'Profiles with a Snapchat add link' },
  telegram: { label: 'Telegram', color: '#00A8FF', icon: <TelegramIcon size={20} />,  desc: 'Profiles with a Telegram t.me link' },
  whatsapp: { label: 'WhatsApp', color: '#00FF7F', icon: <WhatsAppIcon size={20} />, desc: 'Profiles with a WhatsApp wa.me link' },
  onlyfans: { label: 'OnlyFans', color: '#00D4FF', icon: <OnlyFansIcon size={20} />,   desc: 'Profiles with an OnlyFans link' },
}

export default function PlatformProfiles({ platform }: Props) {
  const { profiles, searchQuery, setSearchQuery, openCreateModal } = useAdminStore()
  const { label, color, icon, desc } = META[platform]

  const filtered = profiles
    .filter((p) => p.platforms.includes(platform))
    .filter((p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="space-y-4 animate-in">
      {/* Platform header banner */}
      <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-4"
        style={{ background: `${color}0f`, border: `1px solid ${color}25` }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, color, boxShadow: `0 0 20px ${color}40` }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-white text-lg">{label} Profiles</h2>
          <p className="text-sm mt-0.5" style={{ color: `${color}99` }}>{desc}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-extrabold" style={{ color }}>{filtered.length}</div>
          <div className="text-xs text-white/30">profiles</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" placeholder={`Search ${label} profiles…`}
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-9" />
        </div>
        <button onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition hover:scale-105 active:scale-95"
          style={{ background: `${color}20`, color, border: `1px solid ${color}35` }}>
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: `${color}12`, color }}>
            {icon}
          </div>
          <p className="text-white/40 font-medium">No {label} profiles yet</p>
          <p className="text-xs text-white/25 mt-1">Add the first profile for this platform</p>
          <button onClick={openCreateModal}
            className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:scale-105"
            style={{ background: `${color}20`, color, border: `1px solid ${color}35` }}>
            Add {label} Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((p) => <ProfileCard key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  )
}
