'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  HeartIcon,
  SearchIcon,
  ChevronDownIcon,
  StarIcon,
  SparklesIcon,
  XIcon,
  PlayIcon,
  ImageIcon,
  FilmIcon,
} from 'lucide-react'
import { PALFINDER_PROFILES, PalfinderProfile } from '@/components/palfinder/palfinderData'
import PayWithCryptoButton from '@/components/palfinder/PayWithCryptoButton'

/* ─── Profile Detail Modal ──────────────────────────────────────────────────── */
function ProfileModal({
  profile,
  profileId,
  onClose,
}: {
  profile: PalfinderProfile
  profileId: number
  onClose: () => void
}) {
  const [activeMedia, setActiveMedia] = useState(0)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const current = profile.media[activeMedia]

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === backdropRef.current && onClose()}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col animate-in"
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <XIcon className="w-4 h-4" />
        </button>

        {/* Main media viewer */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/10] relative bg-black flex-shrink-0 overflow-hidden">
          {current?.type === 'video' ? (
            <video
              key={current.url}
              src={current.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              key={current?.url}
              src={current?.url}
              alt={profile.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          )}
          {/* Media counter */}
          <div
            className="absolute bottom-3 left-3 badge"
            style={{
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '11px',
              backdropFilter: 'blur(6px)',
            }}
          >
            {current?.type === 'video' ? <FilmIcon className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            {activeMedia + 1} / {profile.media.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto no-scrollbar flex-shrink-0" style={{ background: 'rgba(0,0,0,0.3)' }}>
          {profile.media.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveMedia(i)}
              className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200"
              style={{
                border: activeMedia === i ? '2px solid #E8B547' : '2px solid transparent',
                opacity: activeMedia === i ? 1 : 0.5,
              }}
            >
              <img
                src={item.type === 'video' ? (item.thumbnail || item.url) : item.url}
                alt=""
                className="w-full h-full object-cover"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <PlayIcon className="w-4 h-4 text-white fill-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Profile info */}
        <div className="px-5 py-4 overflow-y-auto flex-1" style={{ maxHeight: '35vh' }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <p className="text-xs text-white/40 mt-0.5">{profile.location}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-0.5 justify-end mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= profile.rating
                        ? 'fill-palfinder-gold text-palfinder-gold'
                        : 'fill-white/10 text-white/10'
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-white">${profile.price}</span>
            </div>
          </div>

          <p className="text-sm text-white/55 italic leading-relaxed mb-4">
            &ldquo;{profile.bio}&rdquo;
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {profile.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(107,31,42,0.15)',
                  color: '#E8B547',
                  border: '1px solid rgba(107,31,42,0.25)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <PayWithCryptoButton
            profileId={profileId}
            amount={profile.price}
            label={`BUY — $${profile.price}`}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function PalfinderPage() {
  const [selectedProfile, setSelectedProfile] = useState<{ profile: PalfinderProfile; idx: number } | null>(null)

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">

        {/* ── Top nav ────────────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/"
            className="flex items-center gap-1 text-white/70 hover:text-white text-sm rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <ChevronLeftIcon className="w-4 h-4" /> Back
          </Link>
        </div>

        {/* ── Hero header ────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold mb-5"
            style={{
              background: 'rgba(107,31,42,0.12)',
              color: '#E8B547',
              border: '1px solid rgba(107,31,42,0.3)',
            }}
          >
            <HeartIcon className="w-3.5 h-3.5" />
            Premium Companions · Verified Profiles
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4">
            <span className="text-white">Find Your </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #6B1F2A, #E8B547)' }}
            >
              Perfect Match
            </span>
          </h1>
          <p className="text-white/55 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Browse curated profiles, connect with real people, and discover
            meaningful connections nearby.
          </p>
        </div>

        {/* ── Search bar ─────────────────────────────────────────── */}
        <div className="relative mb-6 max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
          <input
            type="text"
            placeholder="Find your perfect match..."
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-sm text-white placeholder:text-white/35 outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(12px)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(107,31,42,0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl text-white font-bold text-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
            style={{ background: '#6B1F2A', boxShadow: '0 4px 16px rgba(107,31,42,0.4)' }}
          >
            Search
          </button>
        </div>

        {/* ── Filters ────────────────────────────────────────────── */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 mb-8 justify-center">
          {['Prices ($)', 'Age Range'].map((label) => (
            <button
              key={label}
              className="flex items-center gap-1.5 rounded-full py-1.5 px-4 text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {label}
              <ChevronDownIcon className="w-3.5 h-3.5 text-white/40" strokeWidth={2} />
            </button>
          ))}
        </div>

        {/* ── Section divider ────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(107,31,42,0.2))' }} />
          <span className="text-xs font-semibold tracking-widest text-white/30 uppercase flex items-center gap-1.5">
            <SparklesIcon className="w-3 h-3" />
            Featured Profiles
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(107,31,42,0.2))' }} />
        </div>

        {/* ── Profile grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5 mb-14">
          {PALFINDER_PROFILES.map((profile, index) => (
            <div
              key={index}
              className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 text-left"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                animation: `fadeSlideIn 0.35s ease-out ${index * 0.08}s both`,
              }}
            >
              {/* Image */}
              <div 
                className="w-full aspect-[4/5] relative overflow-hidden cursor-pointer"
                onClick={() => setSelectedProfile({ profile, idx: index })}
              >
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.85) 0%, transparent 50%)' }}
                />
                {/* Media count indicator */}
                <div
                  className="absolute top-2.5 right-2.5 badge"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '10px',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <ImageIcon className="w-3 h-3" />
                  {profile.media.length}
                </div>
              </div>

              {/* Content */}
              <div className="p-3.5 flex flex-col flex-grow">
                <div className="mb-2">
                  <h2 className="text-base font-bold text-white leading-tight">
                    {profile.name}
                  </h2>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    {profile.location}
                  </p>
                </div>

                <p className="text-[11px] text-white/50 italic leading-snug mb-3 line-clamp-2">
                  &ldquo;{profile.bio}&rdquo;
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(107,31,42,0.15)',
                        color: '#E8B547',
                        border: '1px solid rgba(107,31,42,0.25)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= profile.rating
                            ? 'fill-palfinder-gold text-palfinder-gold'
                            : 'fill-white/10 text-white/10'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline justify-center gap-1.5 mb-3">
                    <span className="text-xs font-medium text-white/50">price:</span>
                    <span className="text-xl font-bold text-white">${profile.price}</span>
                  </div>

                  {/* CTA — Pay with Crypto */}
                  <PayWithCryptoButton
                    profileId={index}
                    amount={profile.price}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6B1F2A, #E8B547)', boxShadow: '0 0 12px rgba(107,31,42,0.35)' }}
              >
                <HeartIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold">
                <span className="text-white">Pal</span>
                <span style={{ color: '#6B1F2A' }}>finder</span>
              </span>
            </div>
            <p className="text-xs text-white/25">18+ Adults Only</p>
          </div>
        </footer>

      </div>

      {/* ── Profile Modal ─────────────────────────────────────── */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile.profile}
          profileId={selectedProfile.idx}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  )
}
