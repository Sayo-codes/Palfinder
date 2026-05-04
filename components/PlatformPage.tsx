import React from 'react'
import Link from 'next/link'
import { BadgeCheckIcon, ChevronLeftIcon } from 'lucide-react'
import { PROFILES } from './data'

type PlatformConfig = {
  platformName: string
  title: string
  color: string // hex
  textOnColor: string // text color on platform background
  icon: React.ReactNode
  buttonLabel: string
}

export function PlatformPage({
  platformName,
  title,
  color,
  textOnColor,
  icon,
  buttonLabel,
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
          className="flex items-center gap-1 text-white/70 hover:text-white text-sm"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </Link>
        <button
          className="px-5 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105"
          style={{
            ...colorStyle,
            ...glowStyle,
          }}
        >
          Join Now
        </button>
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
        {PROFILES.map((p) => (
          <div
            key={p.username}
            className="bg-black/60 rounded-2xl p-4 flex flex-col items-center"
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
                <img
                  src={p.photo}
                  alt={p.username}
                  className="w-24 h-24 rounded-full object-cover bg-black"
                />
              </div>
              {p.online && (
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#00D168] border-2 border-black" />
              )}
            </div>
            <div className="flex items-center gap-1 mb-3">
              <span className="font-bold text-white text-sm">{p.username}</span>
              {p.verified && (
                <BadgeCheckIcon
                  className="w-4 h-4 text-[#0082C5] fill-[#0082C5]"
                  style={{
                    color: '#fff',
                  }}
                />
              )}
            </div>
            <button
              className="w-full py-2 rounded-full font-bold text-sm transition-transform hover:scale-[1.03]"
              style={{
                ...colorStyle,
                ...glowStyle,
              }}
            >
              {buttonLabel}
            </button>
          </div>
        ))}
      </div>

      {/* See more */}
      <div className="flex justify-center">
        <button
          className="px-12 py-3 rounded-full font-bold text-base transition-transform hover:scale-105"
          style={{
            ...colorStyle,
            ...glowStyle,
          }}
        >
          See More &gt;&gt;
        </button>
      </div>
    </div>
  )
}
