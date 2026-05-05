'use client'

import { use } from 'react'
import Overview        from '@/components/sections/Overview'
import ProfilesList    from '@/components/sections/ProfilesList'
import PlatformProfiles from '@/components/sections/PlatformProfiles'
import Members         from '@/components/sections/Members'
import Payments        from '@/components/sections/Payments'
import MediaLibrary    from '@/components/sections/MediaLibrary'
import Settings        from '@/components/sections/Settings'
import Verification    from '@/components/sections/Verification'
import Affiliates      from '@/components/sections/Affiliates'
import { NavSection } from '@/lib/types'

function ChatPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(255,27,141,0.1)', color: '#FF1B8D' }}>
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <p className="font-semibold text-white/60 text-sm">Chat Coming Soon</p>
      <p className="text-xs text-white/30 mt-1">Member chat management will be available in a future update</p>
    </div>
  )
}

function SectionRenderer({ section }: { section: string }) {
  switch (section) {
    case 'overview':     return <Overview />
    case 'models':       return <ProfilesList />
    case 'snapchat':     return <PlatformProfiles platform="snapchat" />
    case 'telegram':     return <PlatformProfiles platform="telegram" />
    case 'whatsapp':     return <PlatformProfiles platform="whatsapp" />
    case 'onlyfans':     return <PlatformProfiles platform="onlyfans" />
    case 'members':      return <Members />
    case 'payments':     return <Payments />
    case 'media':        return <MediaLibrary />
    case 'verification': return <Verification />
    case 'affiliates':   return <Affiliates />
    case 'settings':     return <Settings />
    default:             return <ChatPlaceholder />
  }
}

export default function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params)
  return <SectionRenderer section={section} />
}
