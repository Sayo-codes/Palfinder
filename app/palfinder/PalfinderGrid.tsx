'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon, HeartIcon, SearchIcon, ChevronDownIcon,
  StarIcon, SparklesIcon, XIcon, PlayIcon, ImageIcon, FilmIcon,
} from 'lucide-react'

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === backdropRef.current && onClose()}>
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <XIcon className="w-4 h-4" />
        </button>

        {/* Main viewer */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/10] relative bg-black flex-shrink-0 overflow-hidden">
          {type === 'video'
            ? <video key={current} src={current} controls autoPlay className="w-full h-full object-contain" />
            : <img key={current} src={current} alt={profile.name} className="w-full h-full object-cover transition-opacity duration-300" />}
          {/* counter */}
          <div className="absolute bottom-3 left-3 badge"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '11px', backdropFilter: 'blur(6px)' }}>
            {type === 'video' ? <FilmIcon className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            {activeIdx + 1} / {allMedia.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        {allMedia.length > 1 && (
          <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto no-scrollbar flex-shrink-0" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {allMedia.map((url, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200"
                style={{ border: activeIdx === i ? '2px solid #E8B547' : '2px solid transparent', opacity: activeIdx === i ? 1 : 0.5 }}>
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
        <div className="px-5 py-4 overflow-y-auto flex-1" style={{ maxHeight: '35vh' }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-xs text-foreground/45 mt-0.5">{profile.location} · {profile.age} years old</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-0.5 justify-end mb-1">
                {[1,2,3,4,5].map(s => (
                  <StarIcon key={s} className={`w-3.5 h-3.5 ${s <= profile.rating ? 'fill-palfinder-gold text-palfinder-gold' : 'fill-foreground/10 text-foreground/10'}`} />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">${profile.price}</span>
            </div>
          </div>

          <p className="text-sm text-foreground/55 italic leading-relaxed mb-4">&ldquo;{profile.bio}&rdquo;</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {profile.tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', border: '1px solid var(--tag-border)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Buy button → checkout / payment selection page */}
          <a href={`/palfinder/checkout/${profile.id}`}
            className="flex w-full items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-white transition-all hover:brightness-110 hover:scale-[1.01] active:scale-95"
            style={{ background: '#6B1F2A', boxShadow: '0 4px 16px rgba(107,31,42,0.4)' }}>
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
  return (
    <div className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer bg-palfinder-surface border border-border"
      onClick={onClick}>
      {/* Image */}
      <div className="w-full aspect-[4/5] relative overflow-hidden">
        {profile.mainPhoto
          ? <img src={profile.mainPhoto} alt={profile.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="w-full h-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><ImageIcon className="w-10 h-10 text-foreground/20" /></div>}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.85) 0%, transparent 50%)' }} />
        {/* Gallery count */}
        {profile.gallery.length > 0 && (
          <div className="absolute top-2.5 right-2.5 badge"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '10px', backdropFilter: 'blur(6px)' }}>
            <ImageIcon className="w-3 h-3" />
            {profile.gallery.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow">
        <div className="mb-1">
          <h2 className="text-base font-bold text-foreground leading-tight">{profile.name}</h2>
          {/* Location + Age */}
          <p className="text-[11px] text-foreground/45 mt-0.5">{profile.location} · <span className="text-foreground/50">{profile.age} yrs</span></p>
        </div>

        <p className="text-[11px] text-foreground/50 italic leading-snug mb-2.5 line-clamp-2">&ldquo;{profile.bio}&rdquo;</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {profile.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[9px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', border: '1px solid var(--tag-border)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-center gap-0.5 mb-2">
            {[1,2,3,4,5].map(s => (
              <StarIcon key={s} className={`w-3.5 h-3.5 ${s <= profile.rating ? 'fill-palfinder-gold text-palfinder-gold' : 'fill-foreground/10 text-foreground/10'}`} />
            ))}
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-3">
            <span className="text-xs font-medium text-foreground/50">price:</span>
            <span className="text-xl font-bold text-foreground">${profile.price}</span>
          </div>
          <div className="w-full font-bold text-sm py-2.5 rounded-full text-center text-white flex items-center justify-center gap-2"
            style={{ background: '#6B1F2A', boxShadow: '0 4px 16px rgba(107,31,42,0.4)' }}>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">

        {/* Top nav */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-1 text-foreground/70 hover:text-foreground text-sm rounded-md transition-colors">
            <ChevronLeftIcon className="w-4 h-4" /> Back
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', border: '1px solid var(--tag-border)' }}>
            <HeartIcon className="w-3.5 h-3.5" /> Premium Companions · Verified Profiles
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4">
            <span className="text-foreground">Find Your </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, var(--hero-grad-start), var(--hero-grad-end))' }}>
              Perfect Match
            </span>
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
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/9 text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-[#6B1F2A]/50" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl text-white font-bold text-sm transition-all hover:brightness-110"
            style={{ background: '#6B1F2A', boxShadow: '0 4px 16px rgba(107,31,42,0.4)' }}>
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 mb-8 justify-center">
          {['Prices ($)', 'Age Range'].map(label => (
            <button key={label} className="flex items-center gap-1.5 rounded-full py-1.5 px-4 text-sm font-medium whitespace-nowrap shrink-0 transition-all hover:scale-105 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/9 text-foreground/60 hover:text-foreground">
              {label} <ChevronDownIcon className="w-3.5 h-3.5 text-foreground/40" strokeWidth={2} />
            </button>
          ))}
        </div>

        {/* Section heading */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6B1F2A]/20" />
          <span className="text-xs font-semibold tracking-widest text-foreground/30 uppercase flex items-center gap-1.5">
            <SparklesIcon className="w-3 h-3" /> Featured Profiles
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6B1F2A]/20" />
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--hero-grad-start), var(--hero-grad-end))', boxShadow: '0 0 12px rgba(107,31,42,0.35)' }}>
                <HeartIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold">
                <span className="text-foreground">Pal</span><span style={{ color: '#6B1F2A' }}>finder</span>
              </span>
            </div>
            <p className="text-xs text-foreground/25">18+ Adults Only</p>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {selected && <ProfileModal profile={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
