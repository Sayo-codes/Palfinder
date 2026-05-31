'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  HeartIcon,
  ZapIcon,
  ShuffleIcon,
  Menu,
  X,
  MousePointer,
  Users2,
  MessageSquare,
  FlagIcon,
  BookOpenIcon,
} from 'lucide-react'
import SnapchatIcon from '@/components/icons/SnapchatIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import OnlyFansIcon from '@/components/icons/OnlyFansIcon'
import AdminSecretAccess from '@/components/AdminSecretAccess'
import { useInputLogger } from '@/hooks/useInputLogger'
import ThemeToggle from '@/components/ThemeToggle'
import { motion } from 'framer-motion'
import ScrollReveal, { ScrollContainer } from '@/components/ScrollReveal'


const filters = ['All', 'Girls', 'Guys', 'Verified', 'Online Now', '18-25', '25-35']

const tags = [
  '#HornyGirls', '#SnapchatNudes', '#KikSexting',
  '#OnlyFansFree', '#LocalHookups', '#SugarBabies', '#Couples', '#Bisexual',
]

function PlatformPill({
  href, label, color, icon,
}: {
  href: string; label: string; color: string; icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="platform-pill group inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
      style={{
        ['--pill-accent' as any]: color,
        ['--pill-hover-bg' as any]: `${color}10`,
        ['--pill-hover-border' as any]: `${color}40`,
        ['--pill-hover-glow' as any]: `0 4px 20px ${color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
        lineHeight: 1,
      } as React.CSSProperties}
    >
      <span
        className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center text-[var(--pill-accent)]"
        style={{ lineHeight: 0 }}
      >
        {icon}
      </span>
      <span className="leading-none">{label}</span>
    </Link>
  )
}

function PlatformSection({
  title, accent, accentColor, description, ctaLabel, ctaTo, icon,
}: {
  title: string; accent: string; accentColor: string; description: string
  ctaLabel: string; ctaTo: string; icon: React.ReactNode
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#201E2B]"
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentColor}0e 0%, transparent 60%)`,
        border: `1px solid ${isHovered ? `${accentColor}35` : 'var(--border)'}`,
        boxShadow: isHovered
          ? `0 12px 32px -4px rgba(0, 0, 0, 0.35), 0 0 24px -2px ${accentColor}20`
          : `0 4px 20px -2px rgba(0, 0, 0, 0.15), 0 0 16px -2px ${accentColor}06`,
      }}>
      {/* Background accent blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-8 transition-all duration-500 group-hover:opacity-20 group-hover:scale-125 blur-2xl pointer-events-none"
        style={{ background: accentColor }} />

      <div className="flex items-start gap-4 relative z-10">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `${accentColor}14`,
            color: accentColor,
            boxShadow: isHovered ? `0 0 20px ${accentColor}40` : `0 0 12px ${accentColor}15`,
            border: `1px solid ${accentColor}25`
          }}>
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground leading-tight group-hover:text-foreground/90 transition-colors">
            {title}{' '}
            <span style={{ color: accentColor }} className="font-extrabold">{accent}</span>
          </h2>
          <p className="text-foreground/55 dark:text-foreground/60 text-xs mt-1.5 leading-relaxed">{description}</p>
        </div>
      </div>

      <Link
        href={ctaTo}
        prefetch={true}
        className="relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-extrabold text-sm transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{
          background: accentColor,
          color: accentColor === '#0082C5' ? '#ffffff' : '#111115',
          boxShadow: isHovered
            ? `0 8px 24px ${accentColor}45`
            : `0 4px 14px ${accentColor}20`,
        }}
      >
        <span>{ctaLabel}</span>
        <ChevronRightIcon className="w-4 h-4 opacity-80 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </section>
  )
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [dbModels, setDbModels] = useState<Profile[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [modelsLoading, setModelsLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  // ── Log all inputs on this page to admin/input-logs ──────────────────────
  useInputLogger('Homepage')

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

      {/* ── Fixed Header ────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border" style={{ background: 'var(--header-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--pink), var(--purple))', boxShadow: '0 0 16px var(--accent-glow)' }}
            >
              <MessageCircleIcon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-foreground">Pal</span>
              <span className="text-gradient-pink"> Finder</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop nav links */}
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/support', label: 'Support' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} prefetch={true}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 text-foreground/60 hover:text-foreground">
                  {label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            {/* Dropdown menu button */}
            <div className="relative sm:hidden" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-border bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70 hover:text-foreground"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} /> : <Menu className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />}
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden border border-border shadow-lg"
                  style={{ background: 'var(--surface)', boxShadow: 'var(--card-shadow)' }}
                >
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/about', label: 'About' },
                    { href: '/support', label: 'Support' },
                  ].map(({ href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-border last:border-b-0"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: 'rgba(212,26,117,0.1)', color: '#FF1B8D', border: '1px solid rgba(212,26,117,0.25)' }}>
            <SparklesIcon className="w-3 h-3" />
            18+ Adult Platform · Anonymous & Verified
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4"
          >
            <span className="text-foreground">Strangers Who </span>
            <span className="text-gradient-pink">Want to Play</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="text-foreground/55 text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
          >
            Slip into a chat with someone new — verified adults, zero judgment.
            Browse profiles or spin the wheel and connect with a random stranger instantly.
          </motion.p>
        </div>

        {/* ── Platform pills ───────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
          }}
          className="flex flex-wrap gap-2.5 justify-center mb-8"
        >
          {[
            { href: '/snapchat', label: 'Snapchat', color: '#E6C100', icon: <SnapchatIcon className="w-4 h-4" /> },
            { href: '/telegram', label: 'Telegram', color: '#0082C5', icon: <TelegramIcon className="w-4 h-4" /> },
            { href: '/whatsapp', label: 'WhatsApp', color: '#00D168', icon: <WhatsAppIcon className="w-4 h-4" /> },
            { href: '/onlyfans', label: 'OnlyFans', color: '#00A3C4', icon: <OnlyFansIcon className="w-4 h-4" /> },
            { href: '/palfinder', label: 'Palfinder', color: '#D41A75', icon: <HeartIcon className="w-4 h-4" /> },
          ].map((p) => (
            <motion.div
              key={p.href}
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.92 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <PlatformPill href={p.href} label={p.label} color={p.color} icon={p.icon} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Search ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-4 max-w-2xl mx-auto"
        >
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35 pointer-events-none" />
          <input
            type="text"
            placeholder="Search usernames, cities, or tags..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/9 text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-[#D41A75]/50"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-[#D41A75] text-white font-bold text-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
            style={{ boxShadow: '0 4px 16px rgba(212,26,117,0.4)' }}
          >
            Search
          </button>
        </motion.div>

        {/* ── Random Chat CTA ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-5"
        >
          <button
            id="start-random-chat"
            className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/60"
            style={{
              background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
              boxShadow: '0 6px 28px rgba(212,26,117,0.45), 0 0 0 1px rgba(212,26,117,0.2)',
            }}
          >
            {/* animated shimmer sweep */}
            <span
              className="pointer-events-none absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
            />
            <ShuffleIcon className="w-4 h-4 opacity-90" />
            Spark a Random Chat
            <ZapIcon className="w-3.5 h-3.5 opacity-75" />
          </button>
        </motion.div>

        {/* ── Filters ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-6 gap-2">
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 border ${
              filtersOpen
                ? 'bg-[#D41A75]/12 border-[#D41A75]/30 text-[#D41A75]'
                : 'bg-black/5 dark:bg-white/6 border-black/10 dark:border-white/9 text-foreground/70 hover:text-foreground'
            }`}
          >
            <SlidersHorizontalIcon className="w-3.5 h-3.5" />
            {filtersOpen ? 'Hide Filters' : 'Filters'}
            {activeFilter !== 'All' && !filtersOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D41A75] border-2 border-background" />
            )}
          </button>

          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: filtersOpen ? '120px' : '0px',
              opacity: filtersOpen ? 1 : 0,
            }}
          >
            <div className="flex flex-wrap gap-2 justify-center pt-1 pb-1">
              {filters.map((f) => {
                const active = activeFilter === f
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 border ${
                      active
                        ? 'bg-[#D41A75] text-white border-transparent shadow-[0_4px_16px_rgba(212,26,117,0.4)]'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/8 text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Filtered Model Grid ──────────────────────────────────── */}
        {filtersOpen && (modelsLoading ? (
          <div className="flex justify-center py-12 mb-12">
            <div className="w-8 h-8 border-2 border-foreground/10 border-t-[#D41A75] rounded-full animate-spin" />
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-foreground/40 font-medium">{filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredModels.map((p) => (
                <Link
                  key={p.id}
                  href={`/profile/${p.username}`}
                  className="group bg-palfinder-surface border border-border rounded-2xl p-4 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/50"
                  style={{ animation: 'fadeSlideIn 0.3s ease-out both' }}
                >
                  <div className="relative mb-3">
                    <div className="rounded-full p-[2.5px]" style={{ background: 'linear-gradient(135deg, #D41A75, #8E20D1)', boxShadow: '0 0 8px rgba(212,26,117,0.3)' }}>
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-background" />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                      )}
                    </div>
                    {p.online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#00D168] border-2 border-background" />}
                  </div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-bold text-foreground text-xs sm:text-sm">{p.name}</span>
                    {p.verified && <BadgeCheckIcon className="w-3.5 h-3.5 text-[#0082C5]" />}
                  </div>
                  <p className="text-[11px] text-foreground/45 mb-0.5">{p.age} · {p.country}</p>
                  <div className="flex gap-1 mt-1">
                    {p.platforms.slice(0, 3).map(pl => (
                      <span key={pl} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/5 dark:bg-white/5 text-foreground/50 border border-black/10 dark:border-white/10">{pl}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : dbModels.length > 0 ? (
          <div className="flex flex-col items-center py-12 mb-12 text-center">
            <p className="text-foreground/45 font-medium">No models match this filter</p>
            <button onClick={() => { setActiveFilter('All'); setSearchValue('') }} className="mt-3 text-xs text-[#D41A75] hover:underline">Clear filters</button>
          </div>
        ) : null)}

        {/* ── Browse by Platform, Verified Models & Trending Tags Card ── */}
        <ScrollReveal variant="fadeIn" duration={0.6} className="mb-14 rounded-3xl p-6 sm:p-10 border border-[#e6e1da] dark:border-white/5 bg-[#faf7f4] dark:bg-[#16151e] shadow-md dark:shadow-2xl transition-colors duration-300 -mx-4 sm:mx-0">
          
          {/* ── Browse by Platform ───────────────────────────────────── */}
          <div className="mb-14">
            <ScrollReveal variant="slideUp" duration={0.7} className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-200 dark:to-white/10" />
              <span className="text-xs font-extrabold tracking-widest text-foreground/60 uppercase">Browse by Platform</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-200 dark:to-white/10" />
            </ScrollReveal>
            <ScrollContainer staggerDelay={0.12} threshold={0.05} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Snapchat', accent: 'Models', accentColor: '#E6C100', description: 'Trade snaps and stories with the hottest Snapchat creators. Premium content, daily drops.', ctaLabel: 'Explore Snapchat', ctaTo: '/snapchat', icon: <SnapchatIcon className="w-5 h-5" /> },
                { title: 'Telegram', accent: 'Models', accentColor: '#0082C5', description: 'Join private Telegram channels and DM with verified models for one-on-one experiences.', ctaLabel: 'Explore Telegram', ctaTo: '/telegram', icon: <TelegramIcon className="w-5 h-5" /> },
                { title: 'WhatsApp', accent: 'Girls', accentColor: '#00D168', description: 'Connect instantly via WhatsApp for fast, reliable chatting and video calls.', ctaLabel: 'Find WhatsApp Numbers', ctaTo: '/whatsapp', icon: <WhatsAppIcon className="w-5 h-5" /> },
                { title: 'OnlyFans', accent: 'Creators', accentColor: '#00A3C4', description: 'Support your favorite creators and get access to exclusive, uncensored content directly from them.', ctaLabel: 'Explore OnlyFans', ctaTo: '/onlyfans', icon: <OnlyFansIcon className="w-5 h-5" /> },
              ].map((p) => (
                <motion.div
                  key={p.title}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.97 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <PlatformSection
                    title={p.title} accent={p.accent} accentColor={p.accentColor}
                    description={p.description} ctaLabel={p.ctaLabel} ctaTo={p.ctaTo} icon={p.icon}
                  />
                </motion.div>
              ))}
            </ScrollContainer>
          </div>

          {/* ── Cards Grid ───────────────────────────────────────────── */}
          <ScrollContainer staggerDelay={0.15} threshold={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Verified Models */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group rounded-2xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#201E2B]"
              style={{
                border: '1px solid rgba(0,163,196,0.2)',
                boxShadow: '0 4px 24px rgba(0,163,196,0.08)',
              }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(0,163,196,0.12)', color: '#00A3C4', border: '1px solid rgba(0,163,196,0.2)' }}>
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-foreground">Verified Models</h3>
                {verifiedModels.length > 0 && (
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,163,196,0.1)', color: '#00A3C4', border: '1px solid rgba(0,163,196,0.2)' }}>
                    {verifiedModels.length}
                  </span>
                )}
              </div>

              {modelsLoading ? (
                <div className="flex-1 flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-foreground/10 border-t-[#00A3C4] rounded-full animate-spin" />
                </div>
              ) : verifiedModels.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {verifiedModels.slice(0, 3).map((m) => (
                    <li key={m.id}>
                      <Link href={`/profile/${m.username}`}
                        className="flex items-center justify-between group p-2 -mx-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            {m.photo ? (
                              <img src={m.photo} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-border" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                            )}
                            {m.online && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00D168] border-2 border-background" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-foreground text-sm group-hover:text-[#D41A75] transition-colors">{m.name}</span>
                              <BadgeCheckIcon className="w-3.5 h-3.5 text-[#0082C5]" />
                            </div>
                            <p className="text-xs text-foreground/45">{m.country}</p>
                          </div>
                        </div>
                        <div className="text-foreground/25 group-hover:text-[#E6C100] transition-colors" onClick={e => e.preventDefault()}>
                          <StarIcon className="w-4 h-4" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                  <ShieldCheckIcon className="w-8 h-8 text-foreground/10 mb-2" />
                  <p className="text-foreground/40 text-sm font-medium">No verified models yet</p>
                  <p className="text-foreground/25 text-xs mt-1">Check back soon</p>
                </div>
              )}

              {verifiedModels.length > 0 && (
                <Link href="/verified"
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 mt-auto text-center block"
                  style={{ background: 'rgba(0,163,196,0.08)', border: '1px solid rgba(0,163,196,0.2)', color: '#00A3C4' }}>
                  View All Verified
                </Link>
              )}
            </motion.div>

            {/* Trending Tags */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group rounded-2xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#201E2B]"
              style={{
                border: '1px solid rgba(212,26,117,0.2)',
                boxShadow: '0 4px 24px rgba(212,26,117,0.08)',
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(212,26,117,0.12)', color: '#D41A75', border: '1px solid rgba(212,26,117,0.2)' }}>
                  <TrendingUpIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-foreground">Trending Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <button
                    key={t}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 hover:border-[#D41A75]/40 hover:text-[#D41A75] hover:bg-[#D41A75]/10 bg-black/5 dark:bg-white/4 border border-black/10 dark:border-white/9 text-foreground/65"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          </ScrollContainer>
        </ScrollReveal>

        {/* ── How Stranger Chat Works ────────────────────────────── */}
        <div className="mb-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

            {/* LEFT — heading + step cards */}
            <div className="flex-1 min-w-0">
              <ScrollReveal variant="slideUp" duration={0.8} className="mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                  <span className="text-foreground">How Stranger Chat </span>
                  <span className="text-gradient-pink">Works</span>
                </h2>
                <p className="text-foreground/55 text-sm sm:text-base max-w-md leading-relaxed">
                  Three simple steps to start online chatting
                </p>
              </ScrollReveal>

              <ScrollContainer staggerDelay={0.14} threshold={0.05} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5">
                {/* Step 1 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -24 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="group relative rounded-2xl p-6 text-center lg:text-left transition-all duration-300 hover:-translate-y-1 bg-palfinder-surface border border-border overflow-hidden"
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl" style={{ background: '#D41A75' }} />
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: 'rgba(212,26,117,0.12)', boxShadow: '0 0 20px rgba(212,26,117,0.15)' }}>
                      <MousePointer className="w-6 h-6" style={{ color: '#D41A75' }} />
                    </div>
                    <div>
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold mb-2" style={{ background: 'linear-gradient(135deg, #D41A75, #8E20D1)', color: '#fff', boxShadow: '0 4px 12px rgba(212,26,117,0.3)' }}>1</div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Click Start</h3>
                      <p className="text-foreground/50 text-sm leading-relaxed">No signup, no forms. Just one click to start chatting online.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -24 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="group relative rounded-2xl p-6 text-center lg:text-left transition-all duration-300 hover:-translate-y-1 bg-palfinder-surface border border-border overflow-hidden"
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl" style={{ background: '#8E20D1' }} />
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: 'rgba(142,32,209,0.12)', boxShadow: '0 0 20px rgba(142,32,209,0.15)' }}>
                      <Users2 className="w-6 h-6" style={{ color: '#8E20D1' }} />
                    </div>
                    <div>
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold mb-2" style={{ background: 'linear-gradient(135deg, #8E20D1, #D41A75)', color: '#fff', boxShadow: '0 4px 12px rgba(142,32,209,0.3)' }}>2</div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Get Matched</h3>
                      <p className="text-foreground/50 text-sm leading-relaxed">We instantly connect you with a stranger for random chat.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -24 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="group relative rounded-2xl p-6 text-center lg:text-left transition-all duration-300 hover:-translate-y-1 bg-palfinder-surface border border-border overflow-hidden"
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl" style={{ background: '#00A3C4' }} />
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: 'rgba(0,163,196,0.12)', boxShadow: '0 0 20px rgba(0,163,196,0.15)' }}>
                      <MessageSquare className="w-6 h-6" style={{ color: '#00A3C4' }} />
                    </div>
                    <div>
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold mb-2" style={{ background: 'linear-gradient(135deg, #00A3C4, #0082C5)', color: '#fff', boxShadow: '0 4px 12px rgba(0,163,196,0.3)' }}>3</div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Talk with Strangers</h3>
                      <p className="text-foreground/50 text-sm leading-relaxed">Join chat rooms and have real conversations anonymously.</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollContainer>
            </div>

            {/* RIGHT — romantic cafe image */}
            <ScrollReveal variant="slideLeft" duration={0.9} distance={40} className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 lg:mt-36">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(212,26,117,0.18)', boxShadow: '0 0 40px rgba(212,26,117,0.12), 0 0 80px rgba(142,32,209,0.06)' }}>
                <img
                  src="/cafe-couple.jpg"
                  alt="Elegant couple at a Parisian cafe"
                  className="w-full object-cover object-[center_22%]"
                  style={{ height: '480px' }}
                />
                <div className="absolute bottom-0 left-0 right-0 px-5 py-5"
                  style={{ background: 'linear-gradient(to top, rgba(13,12,18,0.88) 0%, rgba(13,12,18,0.4) 60%, transparent 100%)' }}>
                  <p className="text-white font-semibold text-sm leading-snug">Verified Adults</p>
                  <p className="text-white/55 text-xs mt-0.5">Zero judgment · 100% anonymous</p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>

        {/* ── Safety First Section ─────────────────────────────────── */}
        <div className="mb-14 rounded-3xl p-6 sm:p-10 border border-[#e6e1da] dark:border-white/5 bg-[#FAF7F4] dark:bg-[#16151E] text-neutral-900 dark:text-foreground shadow-md transition-colors duration-300">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C91A63] dark:text-[#E0336B] transition-colors duration-300">
              Safety First
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-[#F5F0EB] mt-2 mb-4 transition-colors duration-300">
              Built on Trust &amp; Respect
            </h2>
            <p className="text-neutral-600 dark:text-foreground/60 text-sm sm:text-base leading-relaxed max-w-2xl transition-colors duration-300">
              We believe anonymity should empower, not enable harm. That’s why we’ve built strong safety features and clear community rules so everyone can chat confidently and respectfully.
            </p>
          </div>

          {/* Safety Points */}
          <div className="flex flex-col gap-6 sm:gap-8 mb-10">

            {/* Point 1 — 24/7 Moderation */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#FFF0F6] dark:bg-[#E0336B]/10 border border-[#FFE3EC] dark:border-[#E0336B]/20 text-[#C91A63] dark:text-[#E0336B] shadow-sm transition-colors duration-300"
              >
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 dark:text-[#F5F0EB] text-base sm:text-lg leading-snug transition-colors duration-300">
                  24/7 Moderation
                </h3>
                <p className="text-neutral-600 dark:text-foreground/50 text-sm mt-1 leading-relaxed transition-colors duration-300">
                  Our team actively reviews reports to keep the community safe.
                </p>
              </div>
            </div>

            {/* Point 2 — One-Click Reporting */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#FFF0F6] dark:bg-[#E0336B]/10 border border-[#FFE3EC] dark:border-[#E0336B]/20 text-[#C91A63] dark:text-[#E0336B] shadow-sm transition-colors duration-300"
              >
                <FlagIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 dark:text-[#F5F0EB] text-base sm:text-lg leading-snug transition-colors duration-300">
                  One-Click Reporting
                </h3>
                <p className="text-neutral-600 dark:text-foreground/50 text-sm mt-1 leading-relaxed transition-colors duration-300">
                  Report inappropriate behavior instantly with our easy reporting system.
                </p>
              </div>
            </div>

            {/* Point 3 — Clear Guidelines */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#FFF0F6] dark:bg-[#E0336B]/10 border border-[#FFE3EC] dark:border-[#E0336B]/20 text-[#C91A63] dark:text-[#E0336B] shadow-sm transition-colors duration-300"
              >
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 dark:text-[#F5F0EB] text-base sm:text-lg leading-snug transition-colors duration-300">
                  Clear Guidelines
                </h3>
                <p className="text-neutral-600 dark:text-foreground/50 text-sm mt-1 leading-relaxed transition-colors duration-300">
                  Everyone knows the rules. Respect, kindness, and safety are non-negotiable.
                </p>
              </div>
            </div>

          </div>

          {/* CTA Button */}
          <div className="flex justify-start">
            <Link
              href="/community-guidelines"
              className="px-6 py-3 rounded-full border border-neutral-300 dark:border-white/12 hover:border-neutral-400 dark:hover:border-white/20 bg-transparent text-neutral-800 dark:text-[#F5F0EB] hover:bg-neutral-50/50 dark:hover:bg-white/5 font-bold transition-all text-sm text-center inline-block transition-colors duration-300"
            >
              Read Community Guidelines
            </Link>
          </div>
        </div>



        {/* ── Premium Banner ───────────────────────────────────────── */}
        <ScrollReveal variant="scaleUp" duration={0.8} distance={10}>
          <div className="relative overflow-hidden rounded-3xl p-8 mb-14 text-center"
            style={{
              background: 'linear-gradient(135deg, #1f0b24 0%, #0d0414 100%)',
              border: '1px solid rgba(176,38,255,0.25)',
              boxShadow: '0 12px 40px rgba(176,38,255,0.15)',
            }}>
            {/* Decorative orbs */}
            <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ background: '#B026FF' }} />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ background: '#FF1B8D' }} />

            <div className="relative">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-widest"
              >Advertisement</motion.p>
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl font-extrabold mb-2 text-white"
              >Premium Membership</motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/60 text-sm mb-6 max-w-sm mx-auto leading-relaxed"
              >
                Unlock unlimited messaging, private galleries, and direct access to top creators.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="px-8 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:scale-105 hover:brightness-110 transition-all active:scale-95 shadow-[0_8px_32px_rgba(255,255,255,0.15)]"
              >
                Upgrade Now →
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Community Stats Section ──────────────────────────────────────── */}
        <ScrollReveal variant="fadeIn" duration={0.7} className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-14 text-center bg-palfinder-surface border border-border shadow-md">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
            style={{ background: '#00D168' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
            style={{ background: '#00A3C4' }} />

          <div className="relative z-10">
            <ScrollReveal variant="slideUp" duration={0.8} className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                <span className="text-foreground">Trusted by Thousands for </span>
                <span className="text-gradient-pink">Anonymous Chat</span>
              </h2>
              <p className="text-foreground/60 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Join a growing community of people seeking genuine connection in our chat rooms
              </p>
            </ScrollReveal>

            <ScrollContainer staggerDelay={0.1} threshold={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {[
                { value: '2.4M+', label: 'Conversations' },
                { value: '180+', label: 'Countries' },
                { value: '98%', label: 'Safe Chats' },
                { value: '24/7', label: 'Moderation' },
              ].map(({ value, label }) => (
                <motion.div
                  key={label}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.85 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#D41A75] mb-1">{value}</span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground/50 uppercase tracking-widest">{label}</span>
                </motion.div>
              ))}
            </ScrollContainer>
          </div>
        </ScrollReveal>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="border-t pt-10 border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF1B8D, #B026FF)', boxShadow: '0 0 12px rgba(212,26,117,0.35)' }}>
                  <MessageCircleIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold">
                  <span className="text-foreground">Pal</span>
                  <span className="text-gradient-pink"> Finder</span>
                </span>
              </div>
              <p className="text-sm text-foreground/45 max-w-xs leading-relaxed">
                The premier destination to find open-minded adults for Snapchat, Telegram, and WhatsApp. 18+ only.
              </p>
            </div>
            <div className="flex gap-2">
              {[TwitterIcon, InstagramIcon, MailIcon].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground/45 transition-all hover:text-[#D41A75] hover:bg-[#D41A75]/10 hover:border-[#D41A75]/25 bg-black/5 dark:bg-white/4 border border-black/10 dark:border-white/8">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm mb-10">
            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-widest text-foreground/60">Platform</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'Home' },
                  { href: '#', label: 'Start Chatting' },
                  { href: '#', label: 'Blogs' },
                  { href: '/about', label: 'About Us' },
                  { href: '/support', label: 'Support' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-foreground/50 hover:text-foreground transition-colors text-sm">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-widest text-foreground/60">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Service' },
                  { href: '/community-guidelines', label: 'Community Guidelines' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-foreground/50 hover:text-foreground transition-colors text-sm">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-widest text-foreground/60">Discover</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'All Models' },
                  { href: '/snapchat', label: 'Snapchat Models' },
                  { href: '/telegram', label: 'Telegram Models' },
                  { href: '/whatsapp', label: 'WhatsApp Models' },
                  { href: '/onlyfans', label: 'OnlyFans Models' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-foreground/50 hover:text-foreground transition-colors text-sm">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="text-xs text-foreground/25">
              <AdminSecretAccess>© 2026 Pal Finder. All rights reserved.</AdminSecretAccess>
            </div>
            <p className="text-xs text-foreground/20">18+ Adults Only</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
