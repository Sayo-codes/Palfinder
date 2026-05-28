import React from 'react'
import Link from 'next/link'
import { BadgeCheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
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

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 pt-5 pb-16 max-w-6xl mx-auto">
      {/* Compact top bar with back link + inline platform title */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-foreground/45 hover:text-foreground text-xs font-semibold uppercase tracking-wider transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5 text-foreground/35" />
          Back to Home
        </Link>

        <div className="flex items-center gap-2 bg-foreground/[0.03] dark:bg-white/[0.02] border border-border/50 px-3 py-1 rounded-full">
          <span
            className="w-4 h-4 flex items-center justify-center flex-shrink-0"
            style={{ color }}
          >
            {icon}
          </span>
          <span className="text-xs font-bold text-foreground/80 tracking-tight">{title}</span>
        </div>
      </div>

      {/* Profile grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
        {profiles.length > 0 ? (
          profiles.map((p) => (
            <Link
              key={p.id}
              href={`/profile/${p.username}`}
              className="bg-palfinder-surface border border-border rounded-2xl p-4 flex flex-col items-center group transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1B8D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="relative mb-3">
                <div
                  className="rounded-full p-[2.5px]"
                  style={{
                    background:
                      'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
                    boxShadow: '0 0 8px rgba(212, 26, 117, 0.3)',
                  }}
                >
                  {p.photo ? (
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-background"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                  )}
                </div>
                {p.online && (
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#00D168] border-2 border-background" />
                )}
              </div>
              <div className="flex items-center gap-1 mb-3">
                <span className="font-bold text-foreground text-sm">{p.name}</span>
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
                className="w-full py-2 rounded-full font-bold text-sm transition-all duration-200 group-hover:brightness-110 text-center"
                style={colorStyle}
              >
                {buttonLabel}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-foreground/40">
            No models found for this platform.
          </div>
        )}
      </div>

      {/* See more — clean minimal button */}
      {profiles.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold border border-border/60 text-foreground/60 bg-transparent hover:text-foreground hover:bg-foreground/[0.03] hover:border-foreground/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
          >
            See More
            <ChevronRightIcon className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      )}
    </div>
  )
}
