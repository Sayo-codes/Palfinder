'use client'

import React, { useState, useEffect } from 'react'
import { getProfiles } from '@/lib/actions'
import { Profile } from '@/lib/types'
import Link from 'next/link'
import {
  MessageCircleIcon,
  MenuIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  BadgeCheckIcon,
  StarIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
} from 'lucide-react'
import SnapchatIcon from '../components/icons/SnapchatIcon'
import TelegramIcon from '../components/icons/TelegramIcon'
import WhatsAppIcon from '../components/icons/WhatsAppIcon'
import OnlyFansIcon from '../components/icons/OnlyFansIcon'
import AdminSecretAccess from '../components/AdminSecretAccess'

const filters = [
  'All',
  'Girls',
  'Guys',
  'Verified Models',
  'Online Now',
  'Local',
  '18-25',
  '25-35',
]

const verifiedModels = [
  {
    name: 'Lexi_Love',
    location: 'Miami, FL',
    online: false,
  },
  {
    name: 'Mia_Khal',
    location: 'Los Angeles, CA',
    online: false,
  },
  {
    name: 'Jake_Fitness',
    location: 'New York, NY',
    online: true,
  },
  {
    name: 'Elena_Rose',
    location: 'Madrid, ES',
    online: false,
  },
]

const tags = [
  '#HornyGirls',
  '#SnapchatNudes',
  '#KikSexting',
  '#OnlyFansFree',
  '#LocalHookups',
  '#SugarBabies',
  '#Couples',
  '#Bisexual',
]

function PlatformPill({
  to,
  label,
  color,
  textColor,
  icon,
}: {
  to: string
  label: string
  color: string
  textColor: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={to}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-transform hover:scale-105"
      style={{
        backgroundColor: color,
        color: textColor,
        boxShadow: `0 0 22px ${color}99`,
      }}
    >
      {icon}
      {label}
    </Link>
  )
}

function Section({
  title,
  accent,
  accentColor,
  description,
  ctaLabel,
  ctaTo,
  icon,
}: {
  title: string
  accent: string
  accentColor: string
  description: string
  ctaLabel: string
  ctaTo: string
  icon: React.ReactNode
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            color: accentColor,
          }}
        >
          {icon}
        </span>
        <h2 className="text-2xl font-bold text-white">
          {title}{' '}
          <span
            style={{
              color: accentColor,
            }}
          >
            {accent}
          </span>
        </h2>
      </div>
      <p className="text-white/60 text-sm mb-4">{description}</p>
      <Link
        href={ctaTo}
        className="block w-full text-center py-3.5 rounded-xl font-bold transition-transform hover:scale-[1.01]"
        style={{
          backgroundColor: accentColor,
          color: accentColor === '#E6C100' ? '#1a1a1a' : '#0a0a0a',
          boxShadow: `0 0 16px ${accentColor}44`,
        }}
      >
        {ctaLabel}
      </Link>
    </section>
  )
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [dbModels, setDbModels] = useState<Profile[]>([])

  useEffect(() => {
    getProfiles().then(data => setDbModels(data as any[]))
  }, [])

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1] flex items-center justify-center"
            style={{
              boxShadow: '0 0 12px rgba(212,26,117,0.4)',
            }}
          >
            <MessageCircleIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold">
            <span className="text-white">Pal</span>
            <span className="text-gradient-pink"> Finder</span>
          </span>
        </Link>
        <button className="text-white/80 hover:text-white" aria-label="Menu">
          <MenuIcon className="w-7 h-7" />
        </button>
      </header>

      {/* Hero */}
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          <span className="text-white">Find Horny </span>
          <span className="text-gradient-pink">Kik Girls</span>
        </h1>
      </div>

      {/* Platform pills */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-5">
        <PlatformPill
          href="/snapchat"
          label="Snapchat"
          color="#E6C100"
          textColor="#1a1a1a"
          icon={<SnapchatIcon className="w-4 h-4" />}
        />
        <PlatformPill
          href="/telegram"
          label="Telegram"
          color="#0082C5"
          textColor="#fff"
          icon={<TelegramIcon className="w-4 h-4" />}
        />
        <PlatformPill
          href="/whatsapp"
          label="WhatsApp"
          color="#00D168"
          textColor="#0a2618"
          icon={<WhatsAppIcon className="w-4 h-4" />}
        />
        <PlatformPill
          href="/onlyfans"
          label="OnlyFans"
          color="#00A3C4"
          textColor="#001a26"
          icon={<OnlyFansIcon className="w-4 h-4" />}
        />
      </div>

      <p className="text-center text-white/70 text-sm mb-7 max-w-md mx-auto">
        Open-minded adults ready to chat, sext, and exchange nudes. Connect
        instantly with verified profiles.
      </p>

      {/* Search */}
      <div className="relative mb-5 max-w-2xl mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search usernames, cities, or tags..."
          className="w-full bg-black/60 border border-white/10 rounded-full pl-11 pr-28 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D41A75]/40"
        />
        <button
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-full bg-[#D41A75] text-white font-bold text-sm"
          style={{
            boxShadow: '0 0 14px rgba(212,26,117,0.4)',
          }}
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-white/80 text-xs font-medium">
          <SlidersHorizontalIcon className="w-3.5 h-3.5" /> Filters
        </button>
        {filters.map((f) => {
          const active = activeFilter === f
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${active ? 'bg-[#D41A75] text-white' : 'bg-black/60 border border-white/10 text-white/70 hover:text-white'}`}
              style={
                active
                  ? {
                      boxShadow: '0 0 12px rgba(212,26,117,0.35)',
                    }
                  : undefined
              }
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-2">
        <Section
          title="WhatsApp"
          accent="Girls"
          accentColor="#00D168"
          description="Connect instantly via WhatsApp for fast, reliable chatting and video calls."
          ctaLabel="Find WhatsApp Numbers"
          ctaTo="/whatsapp"
          icon={<WhatsAppIcon className="w-6 h-6" />}
        />
        <Section
          title="OnlyFans"
          accent="Creators"
          accentColor="#00A3C4"
          description="Support your favorite creators and get access to exclusive, uncensored content directly from them."
          ctaLabel="Explore All Creators"
          ctaTo="/onlyfans"
          icon={<OnlyFansIcon className="w-6 h-6" />}
        />
        <Section
          title="Snapchat"
          accent="Models"
          accentColor="#E6C100"
          description="Trade snaps and stories with the hottest Snapchat creators. Premium content, daily drops."
          ctaLabel="Explore All Creators"
          ctaTo="/snapchat"
          icon={<SnapchatIcon className="w-6 h-6" />}
        />
        <Section
          title="Telegram"
          accent="Models"
          accentColor="#0082C5"
          description="Join private Telegram channels and DM with verified models for one-on-one experiences."
          ctaLabel="Explore All Creators"
          ctaTo="/telegram"
          icon={<TelegramIcon className="w-6 h-6" />}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Verified Models card */}
        <div className="bg-black/60 rounded-2xl p-5 card-glow h-full border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheckIcon className="w-5 h-5 text-[#00A3C4]" />
            <h3 className="font-bold text-white">Verified Models</h3>
          </div>
          <ul className="space-y-3 mb-4">
            {dbModels.length > 0 ? dbModels.slice(0, 5).map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                    )}
                    {m.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00D168] border border-black" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-sm">
                        {m.name}
                      </span>
                      {m.verified && <BadgeCheckIcon className="w-3.5 h-3.5 text-[#0082C5]" />}
                    </div>
                    <p className="text-xs text-white/50">{m.country}</p>
                  </div>
                </div>
                <button className="text-white/40 hover:text-[#E6C100]">
                  <StarIcon className="w-5 h-5" />
                </button>
              </li>
            )) : (
              <li className="text-white/50 text-xs text-center py-4">No verified models yet.</li>
            )}
          </ul>
          <button className="w-full py-2.5 rounded-lg bg-[#00A3C4]/10 border border-[#00A3C4]/20 text-[#00A3C4] font-bold text-sm hover:bg-[#00A3C4]/15 mt-auto">
            View All Verified
          </button>
        </div>

        {/* Trending Tags */}
        <div className="bg-black/60 rounded-2xl p-5 card-glow h-full border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUpIcon className="w-5 h-5 text-[#D41A75]" />
            <h3 className="font-bold text-white">Trending Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:border-[#D41A75]/30 hover:text-[#D41A75]"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium banner */}
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-2xl p-6 mb-10 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(176,38,255,0.25) 0%, rgba(255,27,141,0.2) 100%)',
            boxShadow:
              '0 0 30px rgba(176, 38, 255, 0.25), inset 0 0 0 1px rgba(176,38,255,0.4)',
          }}
        >
          <p className="text-xs text-white/50 mb-1">Advertisement</p>
          <h3 className="text-2xl font-extrabold mb-1">Premium Membership</h3>
          <p className="text-sm text-white/70 mb-4">
            Unlock unlimited messaging and private galleries.
          </p>
          <button className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF1B8D] to-[#B026FF] flex items-center justify-center">
            <MessageCircleIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold">
            <span className="text-white">Pal</span>
            <span className="text-gradient-pink"> Finder</span>
          </span>
        </div>
        <p className="text-sm text-white/60 mb-5 max-w-md">
          The premier destination to find open-minded adults for Kik, Snapchat,
          Telegram, and WhatsApp chatting. 18+ only.
        </p>
        <div className="flex gap-3 mb-8">
          {[TwitterIcon, InstagramIcon, MailIcon].map((Icon, i) => (
            <button
              key={i}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#D41A75] hover:border-[#D41A75]/30"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-white mb-3">Discover</h4>
            <ul className="space-y-2 text-white/60">
              <li>Kik Girls</li>
              <li>Snapchat Nudes</li>
              <li>Telegram Groups</li>
              <li>WhatsApp Numbers</li>
              <li>OnlyFans Free</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-white/60">
              <li>Verified Models</li>
              <li>Local Hookups</li>
              <li>Couples</li>
              <li>Sugar Babies</li>
              <li>New Users</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-white/60">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>2257 Exemption</li>
              <li>DMCA</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-8">
          <AdminSecretAccess>© 2026 Pal Finder</AdminSecretAccess>
        </p>
      </footer>
    </div>
  )
}
