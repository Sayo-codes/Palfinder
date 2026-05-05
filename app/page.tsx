'use client'

import React, { useState, useEffect } from 'react'
import { getProfiles } from '@/lib/actions'
import { Profile } from '@/lib/types'
import Link from 'next/link'
import {
  MessageCircleIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  BadgeCheckIcon,
  StarIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
  ChevronRightIcon,
  SparklesIcon,
} from 'lucide-react'
import SnapchatIcon from '@/components/icons/SnapchatIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import OnlyFansIcon from '@/components/icons/OnlyFansIcon'
import AdminSecretAccess from '@/components/AdminSecretAccess'

const filters = ['All', 'Girls', 'Guys', 'Verified', 'Online Now', '18-25', '25-35']

const tags = [
  '#HornyGirls', '#SnapchatNudes', '#KikSexting',
  '#OnlyFansFree', '#LocalHookups', '#SugarBabies', '#Couples', '#Bisexual',
]

function PlatformPill({
  href, label, color, textColor, icon,
}: {
  href: string; label: string; color: string; textColor: string; icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-200 hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
      style={{
        backgroundColor: color,
        color: textColor,
        boxShadow: `0 4px 24px ${color}60, 0 0 0 1px ${color}30`,
      }}
    >
      {icon}
      {label}
    </Link>
  )
}

function PlatformSection({
  title, accent, accentColor, description, ctaLabel, ctaTo, icon,
}: {
  title: string; accent: string; accentColor: string; description: string
  ctaLabel: string; ctaTo: string; icon: React.ReactNode
}) {
  return (
    <section className="group relative overflow-hidden rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(135deg, ${accentColor}0a 0%, transparent 60%)`,
        border: `1px solid ${accentColor}18`,
        boxShadow: `0 0 40px ${accentColor}08`,
      }}>
      {/* Background accent blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 transition-opacity group-hover:opacity-20 blur-xl"
        style={{ background: accentColor }} />

      <div className="flex items-start gap-3 relative">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{ background: `${accentColor}18`, color: accentColor, boxShadow: `0 0 16px ${accentColor}30` }}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">
            {title}{' '}
            <span style={{ color: accentColor }}>{accent}</span>
          </h2>
          <p className="text-white/55 text-xs mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>

      <Link
        href={ctaTo}
        prefetch={true}
        className="relative flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
        style={{
          background: accentColor,
          color: accentColor === '#E6C100' ? '#1a1a1a' : '#050508',
          boxShadow: `0 4px 20px ${accentColor}40`,
        }}
      >
        {ctaLabel}
        <ChevronRightIcon className="w-4 h-4 opacity-70" />
      </Link>
    </section>
  )
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [dbModels, setDbModels] = useState<Profile[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [modelsLoading, setModelsLoading] = useState(true)

  useEffect(() => {
    setModelsLoading(true)
    getProfiles()
      .then(data => setDbModels(data as any[]))
      .catch(() => setDbModels([]))
      .finally(() => setModelsLoading(false))
  }, [])

  // Only show verified models
  const verifiedModels = dbModels.filter(m => m.verified && m.active)

  // Filter logic for model grid
  const filteredModels = dbModels.filter(m => {
    if (!m.active) return false
    // search filter
    if (searchValue) {
      const q = searchValue.toLowerCase()
      if (!m.name.toLowerCase().includes(q) && !m.username.toLowerCase().includes(q) && !m.country.toLowerCase().includes(q)) return false
    }
    switch (activeFilter) {
      case 'Girls': return m.gender === 'Female'
      case 'Guys': return m.gender === 'Male'
      case 'Verified': return m.verified
      case 'Online Now': return m.online
      case '18-25': return m.age >= 18 && m.age <= 25
      case '25-35': return m.age >= 25 && m.age <= 35
      default: return true
    }
  })

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">

        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D41A75, #8E20D1)', boxShadow: '0 0 16px rgba(212,26,117,0.45)' }}
            >
              <MessageCircleIcon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-white">Pal</span>
              <span className="text-gradient-pink"> Finder</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {[
              { href: '/snapchat', label: 'Snapchat', color: '#E6C100' },
              { href: '/telegram', label: 'Telegram', color: '#0082C5' },
              { href: '/whatsapp', label: 'WhatsApp', color: '#00D168' },
              { href: '/onlyfans', label: 'OnlyFans', color: '#00A3C4' },
            ].map(({ href, label, color }) => (
              <Link key={href} href={href} prefetch={true}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors hover:bg-white/5">
                {label}
              </Link>
            ))}
          </nav>
        </header>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: 'rgba(212,26,117,0.1)', color: '#FF1B8D', border: '1px solid rgba(212,26,117,0.25)' }}>
            <SparklesIcon className="w-3 h-3" />
            18+ Adult Platform · Verified Creators
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4">
            <span className="text-white">Find Horny </span>
            <span className="text-gradient-pink">Kik Girls</span>
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Open-minded adults ready to chat, sext, and exchange content. Connect
            instantly with verified profiles.
          </p>
        </div>

        {/* ── Platform pills ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-8">
          <PlatformPill href="/snapchat" label="Snapchat" color="#E6C100" textColor="#1a1a1a"
            icon={<SnapchatIcon className="w-4 h-4" />} />
          <PlatformPill href="/telegram" label="Telegram" color="#0082C5" textColor="#fff"
            icon={<TelegramIcon className="w-4 h-4" />} />
          <PlatformPill href="/whatsapp" label="WhatsApp" color="#00D168" textColor="#0a2618"
            icon={<WhatsAppIcon className="w-4 h-4" />} />
          <PlatformPill href="/onlyfans" label="OnlyFans" color="#00A3C4" textColor="#001a26"
            icon={<OnlyFansIcon className="w-4 h-4" />} />
        </div>

        {/* ── Search ───────────────────────────────────────────────── */}
        <div className="relative mb-5 max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
          <input
            type="text"
            placeholder="Search usernames, cities, or tags..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-sm text-white placeholder:text-white/35 outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(12px)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(212,26,117,0.45)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-[#D41A75] text-white font-bold text-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
            style={{ boxShadow: '0 4px 16px rgba(212,26,117,0.4)' }}
          >
            Search
          </button>
        </div>

        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all hover:bg-white/8"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.7)' }}>
            <SlidersHorizontalIcon className="w-3.5 h-3.5" /> Filters
          </button>
          {filters.map((f) => {
            const active = activeFilter === f
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={active
                  ? { background: '#D41A75', color: '#fff', boxShadow: '0 4px 16px rgba(212,26,117,0.4)' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }
                }
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* ── Filtered Model Grid ──────────────────────────────────── */}
        {modelsLoading ? (
          <div className="flex justify-center py-12 mb-12">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#D41A75] rounded-full animate-spin" />
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/40 font-medium">{filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredModels.map((p) => (
                <Link
                  key={p.id}
                  href={`/profile/${p.username}`}
                  className="group bg-black/60 rounded-2xl p-4 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/50"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeSlideIn 0.3s ease-out both' }}
                >
                  <div className="relative mb-3">
                    <div className="rounded-full p-[2.5px]" style={{ background: 'linear-gradient(135deg, #D41A75, #8E20D1)', boxShadow: '0 0 8px rgba(212,26,117,0.3)' }}>
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-black" />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                      )}
                    </div>
                    {p.online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#00D168] border-2 border-black" />}
                  </div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-bold text-white text-xs sm:text-sm">{p.name}</span>
                    {p.verified && <BadgeCheckIcon className="w-3.5 h-3.5 text-[#0082C5]" />}
                  </div>
                  <p className="text-[11px] text-white/40 mb-0.5">{p.age} · {p.country}</p>
                  <div className="flex gap-1 mt-1">
                    {p.platforms.slice(0, 3).map(pl => (
                      <span key={pl} className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{pl}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : dbModels.length > 0 ? (
          <div className="flex flex-col items-center py-12 mb-12 text-center">
            <p className="text-white/40 font-medium">No models match this filter</p>
            <button onClick={() => { setActiveFilter('All'); setSearchValue('') }} className="mt-3 text-xs text-[#D41A75] hover:underline">Clear filters</button>
          </div>
        ) : null}

        {/* ── Platform sections ────────────────────────────────────── */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08))' }} />
            <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">Browse by Platform</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.08))' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlatformSection
              title="Snapchat" accent="Models" accentColor="#E6C100"
              description="Trade snaps and stories with the hottest Snapchat creators. Premium content, daily drops."
              ctaLabel="Explore Snapchat" ctaTo="/snapchat"
              icon={<SnapchatIcon className="w-5 h-5" />}
            />
            <PlatformSection
              title="Telegram" accent="Models" accentColor="#0082C5"
              description="Join private Telegram channels and DM with verified models for one-on-one experiences."
              ctaLabel="Explore Telegram" ctaTo="/telegram"
              icon={<TelegramIcon className="w-5 h-5" />}
            />
            <PlatformSection
              title="WhatsApp" accent="Girls" accentColor="#00D168"
              description="Connect instantly via WhatsApp for fast, reliable chatting and video calls."
              ctaLabel="Find WhatsApp Numbers" ctaTo="/whatsapp"
              icon={<WhatsAppIcon className="w-5 h-5" />}
            />
            <PlatformSection
              title="OnlyFans" accent="Creators" accentColor="#00A3C4"
              description="Support your favorite creators and get access to exclusive, uncensored content directly from them."
              ctaLabel="Explore OnlyFans" ctaTo="/onlyfans"
              icon={<OnlyFansIcon className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* ── Cards Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

          {/* Verified Models */}
          <div className="rounded-2xl p-5 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 30px rgba(0,163,196,0.06)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,163,196,0.12)', color: '#00A3C4' }}>
                <ShieldCheckIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white">Verified Models</h3>
              {verifiedModels.length > 0 && (
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,163,196,0.1)', color: '#00A3C4', border: '1px solid rgba(0,163,196,0.2)' }}>
                  {verifiedModels.length}
                </span>
              )}
            </div>

            {modelsLoading ? (
              <div className="flex-1 flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-white/10 border-t-[#00A3C4] rounded-full animate-spin" />
              </div>
            ) : verifiedModels.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {verifiedModels.slice(0, 3).map((m) => (
                  <li key={m.id}>
                    <Link href={`/profile/${m.username}`}
                      className="flex items-center justify-between group p-2 -mx-2 rounded-xl transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {m.photo ? (
                            <img src={m.photo} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-white/15" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                          )}
                          {m.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00D168] border-2 border-[#050508]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-white text-sm group-hover:text-[#D41A75] transition-colors">{m.name}</span>
                            <BadgeCheckIcon className="w-3.5 h-3.5 text-[#0082C5]" />
                          </div>
                          <p className="text-xs text-white/45">{m.country}</p>
                        </div>
                      </div>
                      <div className="text-white/25 group-hover:text-[#E6C100] transition-colors" onClick={e => e.preventDefault()}>
                        <StarIcon className="w-4 h-4" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <ShieldCheckIcon className="w-8 h-8 text-white/10 mb-2" />
                <p className="text-white/40 text-sm font-medium">No verified models yet</p>
                <p className="text-white/25 text-xs mt-1">Check back soon</p>
              </div>
            )}

            {verifiedModels.length > 0 && (
              <Link href="/verified"
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-[#00A3C4]/15 mt-auto text-center block"
                style={{ background: 'rgba(0,163,196,0.08)', border: '1px solid rgba(0,163,196,0.18)', color: '#00A3C4' }}>
                View All Verified
              </Link>
            )}
          </div>

          {/* Trending Tags */}
          <div className="rounded-2xl p-5 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 30px rgba(212,26,117,0.06)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(212,26,117,0.12)', color: '#D41A75' }}>
                <TrendingUpIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white">Trending Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 hover:border-[#D41A75]/40 hover:text-[#D41A75] hover:bg-[#D41A75]/08"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.65)' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Premium Banner ───────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl p-8 mb-14 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(176,38,255,0.2) 0%, rgba(255,27,141,0.15) 100%)',
            border: '1px solid rgba(176,38,255,0.3)',
            boxShadow: '0 0 40px rgba(176,38,255,0.15), inset 0 0 80px rgba(212,26,117,0.05)',
          }}>
          {/* Decorative orbs */}
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20 blur-3xl"
            style={{ background: '#B026FF' }} />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-20 blur-3xl"
            style={{ background: '#FF1B8D' }} />

          <div className="relative">
            <p className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-widest">Advertisement</p>
            <h3 className="text-3xl font-extrabold mb-2 text-white">Premium Membership</h3>
            <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Unlock unlimited messaging, private galleries, and direct access to top creators.
            </p>
            <button className="px-8 py-3 rounded-2xl bg-white text-[#0a0a14] font-bold text-sm hover:scale-105 hover:brightness-110 transition-all active:scale-95"
              style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.2)' }}>
              Upgrade Now →
            </button>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="border-t pt-10" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF1B8D, #B026FF)', boxShadow: '0 0 12px rgba(212,26,117,0.35)' }}>
                  <MessageCircleIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold">
                  <span className="text-white">Pal</span>
                  <span className="text-gradient-pink"> Finder</span>
                </span>
              </div>
              <p className="text-sm text-white/45 max-w-xs leading-relaxed">
                The premier destination to find open-minded adults for Snapchat, Telegram, and WhatsApp. 18+ only.
              </p>
            </div>
            <div className="flex gap-2">
              {[TwitterIcon, InstagramIcon, MailIcon].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/45 transition-all hover:text-[#D41A75] hover:bg-[#D41A75]/10 hover:border-[#D41A75]/25"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm mb-10">
            <div>
              <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-widest text-white/60">Discover</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'All Models' },
                  { href: '/snapchat', label: 'Snapchat Models' },
                  { href: '/telegram', label: 'Telegram Models' },
                  { href: '/whatsapp', label: 'WhatsApp Models' },
                  { href: '/onlyfans', label: 'OnlyFans Models' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-white/50 hover:text-white transition-colors text-sm">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-widest text-white/60">Categories</h4>
              <ul className="space-y-2.5">
                {['Verified Models', 'Local Hookups', 'Couples', 'Sugar Babies', 'New Users'].map((label) => (
                  <li key={label}>
                    <Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-widest text-white/60">Legal</h4>
              <ul className="space-y-2.5">
                {['Terms of Service', 'Privacy Policy', '2257 Exemption', 'DMCA', 'Contact Us'].map((label) => (
                  <li key={label}>
                    <Link href="#" className="text-white/50 hover:text-white transition-colors text-sm">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-white/25">
              <AdminSecretAccess>© 2026 Pal Finder. All rights reserved.</AdminSecretAccess>
            </p>
            <p className="text-xs text-white/20">18+ Adults Only</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
