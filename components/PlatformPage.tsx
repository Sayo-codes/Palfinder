import React from 'react'
import Link from 'next/link'
import { BadgeCheckIcon, ChevronLeftIcon } from 'lucide-react'
import { Profile } from '@/lib/types'

type PlatformConfig = {
  platformName: string
  title: string
  color: string // hex
  textOnColor: string // text color on platform background
  icon: React.ReactNode
  buttonLabel: string
  profiles: Profile[]
}

export function PlatformPage({
  platformName,
  title,
  color,
  textOnColor,
  icon,
  buttonLabel,
  profiles,
}: PlatformConfig) {
  const colorStyle = {
    backgroundColor: color,
    color: textOnColor,
  }

  const glowStyle = {
    boxShadow: `0 0 16px ${color}66`,
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 pt-6 pb-16 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-white/70 hover:text-white text-sm rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </Link>
      </div>

      {/* Header pill */}
      <div className="flex justify-center mb-4">
        <div
          className="flex items-center gap-3 px-6 py-3 rounded-full font-bold text-2xl w-full justify-center"
          style={{
            ...colorStyle,
            ...glowStyle,
          }}
        >
          <span
            className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center"
            style={{
              color,
            }}
          >
            {icon}
          </span>
          <span>{title}</span>
        </div>
      </div>

      <p className="text-center text-white/70 mb-8 text-sm">
        Ready to chat, sext, and have fun 🔥
      </p>

      {/* Profile grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {profiles.length > 0 ? (
          profiles.map((p) => (
            <Link
              key={p.id}
              href={`/profile/${p.username}`}
              className="bg-black/60 rounded-2xl p-4 flex flex-col items-center group transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1B8D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{
                boxShadow: `0 0 18px ${color}33, inset 0 0 0 1px rgba(255,255,255,0.05)`,
              }}
            >
              <div className="relative mb-3">
                <div
                  className="rounded-full p-[3px]"
                  style={{
                    background:
                      'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
                    boxShadow: '0 0 10px rgba(212, 26, 117, 0.4)',
                  }}
                >
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="w-24 h-24 rounded-full object-cover bg-black"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                  )}
                </div>
                {p.online && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#00D168] border-2 border-black" />
                )}
              </div>
              <div className="flex items-center gap-1 mb-3">
                <span className="font-bold text-white text-sm">{p.name}</span>
                {p.verified && (
                  <BadgeCheckIcon
                    className="w-4 h-4 text-[#0082C5] fill-[#0082C5]"
                    style={{
                      color: '#fff',
                    }}
                  />
                )}
              </div>
              <div
                className="w-full py-2 rounded-full font-bold text-sm transition-transform group-hover:scale-[1.03] text-center"
                style={{
                  ...colorStyle,
                  ...glowStyle,
                }}
              >
                {buttonLabel}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-white/40">
            No models found for this platform.
          </div>
        )}
      </div>

      {/* See more */}
      {profiles.length > 0 && (
        <div className="flex justify-center">
          <button
            className="px-12 py-3 rounded-full font-bold text-base transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{
              ...colorStyle,
              ...glowStyle,
            }}
          >
            See More &gt;&gt;
          </button>
        </div>
      )}
    </div>
  )
}

