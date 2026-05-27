'use client'

import Image from 'next/image'
import { Profile, Platform } from '@/lib/types'
import { useAdminStore } from '@/lib/store'
import {
  BadgeCheck, Edit2, Trash2, ExternalLink, Copy, MoreVertical,
} from 'lucide-react'
import SnapchatIcon from './icons/SnapchatIcon'
import TelegramIcon from './icons/TelegramIcon'
import WhatsAppIcon from './icons/WhatsAppIcon'
import OnlyFansIcon from './icons/OnlyFansIcon'
import { useState } from 'react'

const PLATFORM_META: Record<Platform, { label: string; icon: React.ReactNode; color: string; css: string }> = {
  snapchat: { label: 'Snap',     icon: <SnapchatIcon size={11} />,  color: '#FFD600', css: 'badge-snapchat' },
  telegram: { label: 'TG',       icon: <TelegramIcon size={11} />,   color: '#00A8FF', css: 'badge-telegram' },
  whatsapp: { label: 'WA',       icon: <WhatsAppIcon size={11} />,  color: '#00FF7F', css: 'badge-whatsapp' },
  onlyfans: { label: 'OF',       icon: <OnlyFansIcon size={11} />,    color: '#00D4FF', css: 'badge-onlyfans' },
}

interface Props {
  profile: Profile
}

export default function ProfileCard({ profile }: Props) {
  const { openEditModal, openDeleteConfirm } = useAdminStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    const link = Object.values(profile.links)[0] ?? ''
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    setMenuOpen(false)
  }

  return (
    <div className="card card-hover rounded-2xl overflow-hidden flex flex-col animate-in">
      {/* Photo */}
      <div className="relative h-44 sm:h-52 bg-black/5 dark:bg-white/5 flex-shrink-0">
        {profile.photo ? (
          <Image
            src={profile.photo}
            alt={profile.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 300px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.85) 0%, transparent 50%)' }} />

        {/* Status badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {profile.online && (
            <span className="badge" style={{ background:'rgba(0,255,127,0.15)', color:'#00FF7F', border:'1px solid rgba(0,255,127,0.3)', fontSize:'10px' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF7F] inline-block" />
              Online
            </span>
          )}
          {!profile.active && (
            <span className="badge" style={{ background:'rgba(255,100,100,0.15)', color:'#FF6464', border:'1px solid rgba(255,100,100,0.3)', fontSize:'10px' }}>
              Hidden
            </span>
          )}
        </div>

        {/* Verified badge */}
        {profile.verified && (
          <div className="absolute top-2.5 right-2.5">
            <BadgeCheck size={18} style={{ color: '#00A8FF', filter: 'drop-shadow(0 0 6px #00A8FF)' }} />
          </div>
        )}

        {/* Overflow menu */}
        <div className="absolute bottom-2.5 right-2.5">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white transition"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <MoreVertical size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 bottom-9 z-20 w-36 rounded-xl overflow-hidden py-1 bg-palfinder-surface2 border border-border shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                >
                  <button onClick={() => { openEditModal(profile); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={copyLink}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <Copy size={12} /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={() => { openDeleteConfirm(profile.id); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground text-sm truncate">{profile.name}</span>
              {profile.verified && <BadgeCheck size={13} style={{ color: '#00A8FF', flexShrink: 0 }} />}
            </div>
            <div className="text-[11px] text-foreground/45">@{profile.username} · {profile.age} · {profile.country}</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-foreground/50 leading-relaxed line-clamp-2">{profile.bio}</p>

        {/* Platform badges */}
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {profile.platforms.map((p) => (
            <span key={p} className={`badge text-[10px] ${PLATFORM_META[p].css}`}>
              {PLATFORM_META[p].icon}
              {PLATFORM_META[p].label}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex gap-1.5 pt-1">
          <button
            onClick={() => openEditModal(profile)}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/8 transition"
          >
            <Edit2 size={12} /> Edit
          </button>
          <a
            href={Object.values(profile.links)[0] ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/8 transition"
          >
            <ExternalLink size={12} /> View
          </a>
          <button
            onClick={() => openDeleteConfirm(profile.id)}
            className="flex items-center justify-center px-2.5 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
