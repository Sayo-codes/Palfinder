'use client'

import { useAdminStore } from '@/lib/store'
import { NavSection } from '@/lib/types'
import {
  LayoutDashboard, Users, Send, Phone, Key,
  CreditCard, UserCheck, Shield, Network, Image, Settings,
  X, MessageCircle,
} from 'lucide-react'
import SnapchatIcon from './icons/SnapchatIcon'
import TelegramIcon from './icons/TelegramIcon'
import WhatsAppIcon from './icons/WhatsAppIcon'
import OnlyFansIcon from './icons/OnlyFansIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ─── Nav item definition ───────────────────────────────────────────────────────
interface NavItem {
  id: NavSection
  label: string
  icon: React.ReactNode
  accent?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',      label: 'Overview',      icon: <LayoutDashboard size={18} /> },
  { id: 'models',        label: 'All Profiles',  icon: <Users size={18} /> },
  { id: 'snapchat',      label: 'Snapchat',       icon: <SnapchatIcon size={18} />,   accent: '#E6C100' },
  { id: 'telegram',      label: 'Telegram',       icon: <TelegramIcon size={18} />,    accent: '#0082C5' },
  { id: 'whatsapp',      label: 'WhatsApp',       icon: <WhatsAppIcon size={18} />,   accent: '#00D168' },
  { id: 'onlyfans',      label: 'OnlyFans',       icon: <OnlyFansIcon size={18} />,     accent: '#00A3C4' },
  { id: 'payments',      label: 'Payments',       icon: <CreditCard size={18} /> },
  { id: 'members',       label: 'Members',        icon: <UserCheck size={18} /> },
  { id: 'verification',  label: 'Verification',   icon: <Shield size={18} /> },
  { id: 'affiliates',    label: 'Affiliates',     icon: <Network size={18} /> },
  { id: 'media',         label: 'Media Library',  icon: <Image size={18} /> },
  { id: 'settings',      label: 'Settings',       icon: <Settings size={18} /> },
]

const NAV_GROUPS = [
  { label: 'MAIN',      items: NAV_ITEMS.slice(0, 2) },
  { label: 'PLATFORMS', items: NAV_ITEMS.slice(2, 6) },
  { label: 'MANAGE',    items: NAV_ITEMS.slice(6) },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAdminStore()
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          flex flex-col sidebar-container
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(180deg, #0A0A14 0%, #05050A 100%)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #D41A75, #8E20D1)',
                boxShadow: '0 0 12px rgba(212,26,117,0.3)',
              }}
            >
              <MessageCircle size={16} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="font-extrabold text-white text-sm">Pal</span>
              <span className="font-extrabold text-sm" style={{ color: '#D41A75' }}>Finder</span>
              <div className="text-[10px] text-white/40 font-medium tracking-widest mt-0.5">ADMIN</div>
            </div>
          </div>
          {/* Close on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* External Link to Home */}
        <div className="px-3 py-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all group border border-white/5"
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-[#FF1B8D]/20 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </div>
            View Website
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest text-white/25">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === `/admin/${item.id}`
                  return (
                    <Link
                      key={item.id}
                      href={`/admin/${item.id}`}
                      prefetch={true}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-150 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                        ${isActive
                          ? 'text-white'
                          : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                        }
                      `}
                      style={isActive ? {
                        background: item.accent
                          ? `${item.accent}12`
                          : 'rgba(212,26,117,0.08)',
                        color: item.accent || '#D41A75',
                        boxShadow: item.accent
                          ? `inset 0 0 0 1px ${item.accent}20`
                          : 'inset 0 0 0 1px rgba(212,26,117,0.15)',
                      } : undefined}
                    >
                      <span style={isActive ? { color: item.accent || '#FF1B8D' } : undefined}>
                        {item.icon}
                      </span>
                      {item.label}
                      {/* Active dot */}
                      {isActive && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: item.accent || '#FF1B8D' }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#D41A75,#8E20D1)' }}
            >
              A
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">Admin</div>
              <div className="text-xs text-white/40 truncate">admin@palfinder.com</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
