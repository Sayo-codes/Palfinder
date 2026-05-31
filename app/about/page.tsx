'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  MessageCircleIcon,
  HeartIcon,
  ShieldCheckIcon,
  EyeOffIcon,
  CompassIcon,
  RocketIcon,
  SparklesIcon,
  AlertCircleIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
  LifeBuoyIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

/* ── Value Card Component ───────────────────────────────────── */
interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
  accentColor: string
}

function ValueCard({ icon, title, description, accentColor }: ValueCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 bg-[var(--surface)] border border-[var(--border)]"
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)`,
        borderColor: isHovered ? `${accentColor}40` : 'var(--border)',
        boxShadow: isHovered
          ? `0 12px 32px -4px rgba(0, 0, 0, 0.4), 0 0 24px -2px ${accentColor}18`
          : `0 4px 20px -2px rgba(0, 0, 0, 0.15)`,
      }}
    >
      {/* Accent glow orb */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-5 transition-all duration-500 group-hover:opacity-15 group-hover:scale-125 blur-2xl pointer-events-none"
        style={{ background: accentColor }}
      />

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{
          background: `${accentColor}12`,
          color: accentColor,
          boxShadow: isHovered ? `0 0 20px ${accentColor}30` : `0 0 12px ${accentColor}10`,
          border: `1px solid ${accentColor}20`,
        }}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-lg font-bold text-[var(--text)] mb-2 group-hover:text-[var(--text)] transition-colors">
          {title}
        </h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

/* ── About Us Page Component ────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[var(--bg)] text-[var(--text)] font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-[#D41A75]/8 to-[#8E20D1]/4 filter blur-[130px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#00A3C4]/6 to-[#8E20D1]/4 filter blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#8E20D1]/6 to-[#D41A75]/6 filter blur-[130px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">

        {/* ── Top Nav ────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-12">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)] text-xs font-bold uppercase tracking-wider transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/50 px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] hover:border-[#D41A75]/25"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3.5 py-1.5 rounded-full">
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-[#D41A75]">
                <HeartIcon className="w-3.5 h-3.5 fill-[#D41A75]" />
              </span>
              <span className="text-xs font-bold text-[var(--text)] tracking-tight">Our Philosophy</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* ── Hero ───────────────────────────────────────────── */}
        <div className="text-center mb-16 sm:mb-20">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5 shadow-sm"
            style={{
              background: 'rgba(212,26,117,0.1)',
              color: '#FF1B8D',
              border: '1px solid rgba(212,26,117,0.25)',
            }}
          >
            <SparklesIcon className="w-3 h-3" /> Uncensored · Unfiltered · Unapologetic
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5 max-w-3xl mx-auto">
            <span className="text-[var(--text)]">Strip Away the Persona. </span>
            <span className="text-gradient-pink font-extrabold">Find Real Connection.</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            In a world obsessed with visual performance, polished feeds, and permanent digital footprints, 
            PalFinder is a sanctuary for your authentic, uncensored desires. No judgment. No expectations. 
            Just you and a stranger, sharing a moment in the dark.
          </p>
        </div>

        {/* ── Our Story ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 sm:mb-20 items-stretch">
          <div className="md:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D41A75] mb-2.5 block">
              Born in the Shadows
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5 text-[var(--text)]">
              Born in the Breakdown
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              <p>
                A summer midnight. A deserted state highway miles from anywhere. A sudden hiss of steam and a dead engine. 
                That’s how PalFinder began. Our founders found themselves stranded under a canopy of stars, waiting for a 
                tow truck that was hours away.
              </p>
              <p>
                With nothing to do and nowhere to go, they struck up a conversation with a local stranger who had stopped to help. 
                No names were exchanged. No social handles were traded. But for two hours, sitting on the warm hood of a broken-down car, 
                they talked about everything—their deepest fears, their unvoiced dreams, their most guarded adult thoughts.
              </p>
              <p>
                When the tow truck arrived, they parted ways with a nod, never to meet again. But they carried away a massive realization: 
                the most genuine, liberating human connections happen when there is absolutely nothing to lose, no online reputation to protect, 
                and zero identity to perform. PalFinder was built to capture that exact magic.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-5 flex items-center justify-center relative min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D41A75]/15 to-[#8E20D1]/10 rounded-3xl -z-10" />
            <div className="w-full h-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#D41A75]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#8E20D1]/8 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-6xl text-[#D41A75]/35 font-serif select-none leading-none">&ldquo;</div>
              <p className="text-base sm:text-lg text-[var(--text)] font-semibold italic leading-relaxed relative z-10">
                Anonymity isn&rsquo;t about hiding who you are. It is about having the courage to show who you actually are when the masks are off.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D41A75] to-[#8E20D1] flex items-center justify-center flex-shrink-0">
                  <MessageCircleIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text)]">The Founders</h4>
                  <p className="text-xs text-[var(--text-muted)]">PalFinder Origin, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── The Problem We're Solving ──────────────────────── */}
        <div className="mb-16 sm:mb-20 rounded-3xl p-6 sm:p-10 border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D41A75]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#8E20D1]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-6">
              <AlertCircleIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-500 mb-2 block">
              The Curated Prison of the Modern Web
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-[var(--text)]">
              Curate Yourself, Smooth the Edges, Fit the Algorithm.
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-4">
              We are living in an era of hyper-performance. Every modern platform demands your face, your real name, your professional credentials, and a permanent archive of your past. We are forced to curate ourselves, smoothing out the interesting rough edges to fit a polite, sterile algorithm.
            </p>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              But humans aren&rsquo;t sterile. We are complicated, open-minded, passionate, and full of hidden desires. The modern internet has built a gilded cage for our identities, leaving no room for raw, real, anonymous play. That is the exact cage we are unlocking.
            </p>
          </div>
        </div>

        {/* ── Mission & Vision ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 sm:mb-20">
          {/* Mission */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D41A75]/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#D41A75]/10 border border-[#D41A75]/25 text-[#D41A75] flex items-center justify-center mb-6">
                <CompassIcon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-[var(--text)] mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                To create a secure, respectful, and completely anonymous sanctuary for open-minded adults. We want to tear down the artificial walls of curation, visual expectation, and permanent digital footprints—giving you back the pure, raw thrill of connection.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8E20D1]/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#8E20D1]/10 border border-[#8E20D1]/25 text-[#8E20D1] flex items-center justify-center mb-6">
                <RocketIcon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-[var(--text)] mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                To establish PalFinder as the premier global platform for adult human expression. We believe you should be able to explore your fantasies, share deep adult conversations, and discover compatible partners across Snapchat, Telegram, and WhatsApp without ever compromising your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* ── What We Stand For ──────────────────────────────── */}
        <div className="mb-16 sm:mb-20">
          <div className="flex items-center gap-2 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D41A75]/20" />
            <span className="text-xs font-extrabold tracking-widest text-[var(--text-muted)] uppercase flex items-center gap-1.5">
              <SparklesIcon className="w-3.5 h-3.5 text-[#D41A75]" /> Our Core Pillars
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D41A75]/20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ValueCard
              icon={<EyeOffIcon className="w-5 h-5" />}
              title="Privacy Above All"
              description="We do not sell your data, we do not inspect your messages, and we never ask for your identity. What happens here remains firmly in the shadows."
              accentColor="#D41A75"
            />
            <ValueCard
              icon={<ShieldCheckIcon className="w-5 h-5" />}
              title="Uncompromising Safety"
              description="Anonymity should be liberating, not hostile. With 24/7 moderation, automated filters, and one-click reporting, your safety is locked into our foundation."
              accentColor="#8E20D1"
            />
            <ValueCard
              icon={<HeartIcon className="w-5 h-5" />}
              title="Authentic Connection"
              description="When you strip away the pressure of names and permanent digital footprints, conversation changes. It becomes bold. Seductive. True."
              accentColor="#00A3C4"
            />
          </div>
        </div>

        {/* ── What's Next ────────────────────────────────────── */}
        <div className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto rounded-3xl p-6 sm:p-10 border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00A3C4]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00A3C4] mb-2.5 block">
              The Road Ahead
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-[var(--text)]">
              Into the Horizon
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-8">
              We are just getting started. While we will always remain fiercely loyal to anonymity, we are building new ways to bring you closer to the strangers who excite you. In the coming months, expect secure voice note exchanges, private verified video rooms, and advanced interest-based matching algorithms designed to align your deepest desires.
            </p>
            
            <div className="flex justify-center">
              <Link
                href="/"
                className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/60"
                style={{
                  background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
                  boxShadow: '0 6px 28px rgba(212,26,117,0.35)',
                }}
              >
                {/* shimmer sweep */}
                <span
                  className="pointer-events-none absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                  }}
                />
                Start Anonymous Chat
              </Link>
            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer className="border-t pt-10 border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #D41A75, #8E20D1)',
                    boxShadow: '0 0 12px rgba(212,26,117,0.35)',
                  }}
                >
                  <MessageCircleIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">
                  <span className="text-[var(--text)]">Pal</span>
                  <span className="text-gradient-pink"> Finder</span>
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
                The premier destination to find open-minded adults for Snapchat, Telegram, and
                WhatsApp. 18+ only.
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { icon: TwitterIcon, href: '#' },
                { icon: InstagramIcon, href: '#' },
                { icon: MailIcon, href: 'mailto:support@palfinder.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] transition-all hover:text-[#D41A75] hover:bg-[#D41A75]/10 hover:border-[#D41A75]/25 bg-[var(--surface)] border border-[var(--border)]"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm mb-10">
            <div>
              <h4 className="font-bold text-[var(--text)] mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'Home' },
                  { href: '#', label: 'Start Chatting' },
                  { href: '#', label: 'Blogs' },
                  { href: '/about', label: 'About Us' },
                  { href: '/support', label: 'Support' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Service' },
                  { href: '/community-guidelines', label: 'Guidelines' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Discover
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'All Models' },
                  { href: '/snapchat', label: 'Snapchat Models' },
                  { href: '/telegram', label: 'Telegram Models' },
                  { href: '/whatsapp', label: 'WhatsApp Models' },
                  { href: '/onlyfans', label: 'OnlyFans Models' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
            <div className="text-xs text-[var(--text-subtle)]">© 2026 Pal Finder. All rights reserved.</div>
            <p className="text-xs text-[var(--text-subtle)]">18+ Adults Only</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
