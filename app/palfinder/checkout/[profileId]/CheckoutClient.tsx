'use client'

import React from 'react'
import Link from 'next/link'
import CryptoPayButton from '@/components/palfinder/CryptoPayButton'
import {
  ChevronLeftIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  LockIcon,
  StarIcon,
  ChevronRightIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface Profile {
  id: string
  name: string
  price: number
  rating: number
  age: number
  mainPhoto: string
  location: string
  bio: string
  tags: string[]
}

/**
 * CheckoutClient — Payment selection page.
 *
 * Shows the profile summary + payment method options:
 *   • Pay with Crypto  → navigates to /palfinder/pay/[profileId]
 *   • Pay with Card    → placeholder (future Stripe integration)
 *   • PayPal           → placeholder (future PayPal integration)
 */
export default function CheckoutClient({ profile }: { profile: Profile }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-background"
    >
      <div className="w-full max-w-md space-y-6">

        {/* Back link & Theme toggle */}
        <div className="flex justify-between items-center">
          <Link
            href="/palfinder"
            className="inline-flex items-center gap-1 text-foreground/50 hover:text-foreground text-sm transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back to Palfinder
          </Link>
          <ThemeToggle />
        </div>

        {/* ── Profile Summary Card ───────────────────────────── */}
        <div className="rounded-2xl overflow-hidden bg-palfinder-surface border border-border shadow-[0_16px_64px_rgba(0,0,0,0.1)]">
          {/* Profile header */}
          <div className="flex items-center gap-4 p-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-palfinder-gold/30 shadow-[0_0_16px_rgba(107,31,42,0.1)]">
              {profile.mainPhoto ? (
                <img
                  src={profile.mainPhoto}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--hero-grad-start), var(--hero-grad-end))' }}
                >
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground truncate">{profile.name}</h2>
              <p className="text-xs text-foreground/45 mt-0.5">{profile.location} · {profile.age} yrs</p>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <StarIcon
                    key={s}
                    className={`w-3 h-3 ${
                      s <= profile.rating
                        ? 'fill-palfinder-gold text-palfinder-gold'
                        : 'fill-foreground/10 text-foreground/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-extrabold text-foreground">${profile.price}</span>
              <p className="text-[10px] text-foreground/30 uppercase tracking-wider mt-0.5">One-time</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px border-t border-border" />

          {/* Order summary */}
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-foreground/45 font-medium">Total</span>
            <span className="text-sm font-bold text-foreground">${profile.price.toFixed(2)} USD</span>
          </div>
        </div>

        {/* ── Payment Methods ────────────────────────────────── */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-foreground/30 uppercase tracking-widest px-1">
            Select Payment Method
          </h3>

          {/* 1. Pay with Crypto — LIVE ✅ */}
          <CryptoPayButton profileId={profile.id} />

          {/* 2. Pay with Card — LIVE ✅ */}
          <Link
            id="pay-with-card-btn"
            href={`/palfinder/pay/${profile.id}/card`}
            className="group relative flex w-full items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] bg-palfinder-surface border border-palfinder-gold/30 hover:border-palfinder-gold/60 hover:bg-palfinder-gold/5 hover:shadow-[0_0_24px_rgba(232,181,71,0.08)]"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border border-palfinder-gold/20"
              style={{
                background: 'linear-gradient(135deg, rgba(107,31,42,0.6), var(--gold))',
              }}
            >
              <CreditCardIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="block text-sm font-bold text-foreground">Pay with Card</span>
              <span className="block text-[10px] text-foreground/45 font-medium uppercase tracking-wider mt-0.5">
                Visa · Mastercard · Amex
              </span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-foreground/30 group-hover:text-palfinder-gold transition-colors" />
          </Link>

          {/* 3. PayPal — Coming Soon */}
          <button
            disabled
            className="group relative flex w-full items-center gap-4 p-4 rounded-2xl transition-all duration-200 opacity-50 cursor-not-allowed bg-black/5 dark:bg-white/5 border border-border"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-black/10 dark:bg-white/10"
            >
              {/* PayPal "P" icon */}
              <span className="text-lg font-extrabold text-foreground/50">P</span>
            </div>
            <div className="flex-1 text-left">
              <span className="block text-sm font-bold text-foreground/60">PayPal</span>
              <span className="block text-[10px] text-foreground/30 font-medium uppercase tracking-wider mt-0.5">
                PayPal Balance · Cards · Bank
              </span>
            </div>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide flex-shrink-0 bg-black/5 dark:bg-white/5 text-foreground/30 border border-border"
            >
              Soon
            </span>
          </button>
        </div>

        {/* ── Trust badges ───────────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-foreground/20">
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">Secure Payment</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground/20">
            <LockIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
