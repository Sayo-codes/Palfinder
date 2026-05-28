'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon, HeartIcon, SearchIcon, ChevronDownIcon,
  StarIcon, SparklesIcon, XIcon, PlayIcon, ImageIcon, FilmIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

/* ── Types from DB (mirroring Prisma PalfinderProfile) ─────── */
export interface PalfinderDBProfile {
  id: string
  name: string
  location: string
  bio: string
  price: number
  rating: number
  age: number
  tags: string[]
  mainPhoto: string
  gallery: string[]   // plain URL array
  status: string
}

function urlType(url: string): 'video' | 'image' {
  return /\.(mp4|mov|webm|avi|mkv)($|\?)/i.test(url) ? 'video' : 'image'
}

/* ── Profile Detail Modal ──────────────────────────────────── */
function ProfileModal({
  profile,
  onClose,
}: {
  profile: PalfinderDBProfile
  onClose: () => void
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const allMedia = profile.gallery.length ? profile.gallery : (profile.mainPhoto ? [profile.mainPhoto] : [])
  const current  = allMedia[activeIdx] ?? ''
  const type     = urlType(current)

  return (
    <div ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={e => e.target === backdropRef.current && onClose()}>
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col bg-white dark:bg-[#201E2B] transition-all"
        style={{ border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <XIcon className="w-5 h-5" />
        </button>

        {/* Main viewer */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/10] relative bg-black flex-shrink-0 overflow-hidden">
          {type === 'video'
            ? <video key={current} src={current} controls autoPlay className="w-full h-full object-contain" />
            : <img key={current} src={current} alt={profile.name} className="w-full h-full object-cover transition-opacity duration-300" />}
          {/* counter */}
          <div className="absolute bottom-4 left-4 badge font-bold"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '11px', backdropFilter: 'blur(6px)' }}>
            {type === 'video' ? <FilmIcon className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
            {activeIdx + 1} / {allMedia.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        {allMedia.length > 1 && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar flex-shrink-0" style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border)' }}>
            {allMedia.map((url, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-200 hover:opacity-100"
                style={{ border: activeIdx === i ? '2px solid #D41A75' : '2px solid transparent', opacity: activeIdx === i ? 1 : 0.6 }}>
                <img src={urlType(url) === 'video' ? profile.mainPhoto || url : url} alt="" className="w-full h-full object-cover" />
                {urlType(url) === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <PlayIcon className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="px-6 py-5 overflow-y-auto flex-1" style={{ maxHeight: '35vh' }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{profile.name}</h2>
              <p className="text-xs text-foreground/45 mt-1">{profile.location} · {profile.age} years old</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-0.5 justify-end mb-1">
                {[1,2,3,4,5].map(s => (
                  <StarIcon key={s} className={`w-3.5 h-3.5 ${s <= profile.rating ? 'fill-palfinder-gold text-palfinder-gold' : 'fill-foreground/10 text-foreground/10'}`} />
                ))}
              </div>
              <span className="text-3xl font-extrabold text-foreground">${profile.price}</span>
            </div>
          </div>

          <p className="text-sm text-foreground/60 italic leading-relaxed mb-5 bg-foreground/[0.02] dark:bg-white/[0.02] p-3 rounded-xl border border-border/40">&ldquo;{profile.bio}&rdquo;</p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {profile.tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-semibold px-3 py-1 rounded-full"
                style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', border: '1px solid var(--tag-border)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Buy button → checkout / payment selection page */}
          <a href={`/palfinder/checkout/${profile.id}`}
            className="flex w-full items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-extrabold text-white transition-all hover:brightness-110 hover:scale-[1.01] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
              boxShadow: '0 6px 20px rgba(212,26,117,0.4)',
            }}>
            💳 BUY — ${profile.price}
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Profile Card ──────────────────────────────────────────── */
function ProfileCard({
  profile,
  onClick,
}: {
  profile: PalfinderDBProfile
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const accentColor = '#D41A75'

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 text-left cursor-pointer bg-white dark:bg-[#201E2B]"
      style={{
        border: `1px solid ${isHovered ? `${accentColor}35` : 'var(--border)'}`,
        boxShadow: isHovered
          ? `0 12px 32px -4px rgba(0, 0, 0, 0.35), 0 0 24px -2px ${accentColor}20`
          : `0 4px 20px -2px rgba(0, 0, 0, 0.15), 0 0 16px -2px ${accentColor}06`,
        backgroundImage: isHovered ? `linear-gradient(135deg, ${accentColor}0e 0%, transparent 60%)` : 'none',
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="w-full aspect-[4/5] relative overflow-hidden">
        {profile.mainPhoto
          ? <img src={profile.mainPhoto} alt={profile.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><ImageIcon className="w-10 h-10 text-foreground/20" /></div>}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)' }} />
        {/* Gallery count */}
        {profile.gallery.length > 0 && (
          <div className="absolute top-2.5 right-2.5 badge font-bold text-xs"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)' }}>
            <ImageIcon className="w-3.5 h-3.5" />
            {profile.gallery.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow relative z-10">
        <div className="mb-1.5">
          <h2 className="text-base font-bold text-foreground leading-tight group-hover:text-[#D41A75] transition-colors">{profile.name}</h2>
          {/* Location + Age */}
          <p className="text-[11px] text-foreground/45 mt-0.5">{profile.location} · <span className="text-foreground/50">{profile.age} yrs</span></p>
        </div>

        <p className="text-[11px] text-foreground/50 italic leading-snug mb-3 line-clamp-2">&ldquo;{profile.bio}&rdquo;</p>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {profile.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', border: '1px solid var(--tag-border)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-center gap-0.5 mb-2.5">
            {[1,2,3,4,5].map(s => (
              <StarIcon key={s} className={`w-3.5 h-3.5 ${s <= profile.rating ? 'fill-palfinder-gold text-palfinder-gold' : 'fill-foreground/10 text-foreground/10'}`} />
            ))}
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-3.5">
            <span className="text-xs font-medium text-foreground/50">price:</span>
            <span className="text-xl font-bold text-foreground">${profile.price}</span>
          </div>
          <div className="w-full font-bold text-sm py-2.5 rounded-full text-center text-white flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
              boxShadow: isHovered
                ? '0 6px 20px rgba(212,26,117,0.45)'
                : '0 4px 14px rgba(212,26,117,0.2)',
            }}>
            💳 BUY
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Grid (Client Component) ──────────────────────────── */
export default function PalfinderGrid({ profiles }: { profiles: PalfinderDBProfile[] }) {
  const [selected, setSelected] = useState<PalfinderDBProfile | null>(null)
  const [query, setQuery] = useState('')

  const filtered = profiles.filter(p =>
    !query.trim() ||
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.location.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* Top nav */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-10">
          <Link href="/" className="flex items-center gap-1 text-foreground/45 hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
            <ChevronLeftIcon className="w-3.5 h-3.5 text-foreground/35" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-foreground/[0.03] dark:bg-white/[0.02] border border-border/50 px-3 py-1.5 rounded-full">
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-[#D41A75]">
                <HeartIcon className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="text-xs font-bold text-foreground/80 tracking-tight">Palfinder</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: 'rgba(212,26,117,0.1)', color: '#FF1B8D', border: '1px solid rgba(212,26,117,0.25)' }}>
            <SparklesIcon className="w-3 h-3" /> Premium Companions · Verified Profiles
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4">
            <span className="text-foreground">Find Your </span>
            <span className="text-gradient-pink">Perfect Match</span>
          </h1>
          <p className="text-foreground/55 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Browse curated profiles, connect with real people, and discover meaningful connections nearby.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35 pointer-events-none" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, location or interest…"
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/9 text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-[#D41A75]/50" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl text-white font-bold text-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
              boxShadow: '0 4px 16px rgba(212,26,117,0.4)',
            }}>
            Search
          </button>
        </div>


        {/* Section heading */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D41A75]/20" />
          <span className="text-xs font-extrabold tracking-widest text-neutral-500 dark:text-foreground/40 uppercase flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5 text-[#D41A75]" /> Featured Profiles
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D41A75]/20" />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-foreground/30">
            <HeartIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{query ? 'No profiles match your search.' : 'No profiles available yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5 mb-14">
            {filtered.map((profile, idx) => (
              <div key={profile.id} style={{ animation: `fadeSlideIn 0.35s ease-out ${idx * 0.07}s both` }}>
                <ProfileCard profile={profile} onClick={() => setSelected(profile)} />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="border-t pt-8 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #D41A75, #8E20D1)', boxShadow: '0 0 12px rgba(212,26,117,0.35)' }}>
                <HeartIcon className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                <span className="text-foreground">Pal</span>
                <span className="text-gradient-pink">finder</span>
              </span>
            </div>
            <p className="text-xs text-foreground/45 font-medium">18+ Adults Only</p>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {selected && <ProfileModal profile={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
