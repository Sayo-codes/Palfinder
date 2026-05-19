'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  ShieldCheckIcon,
  LockIcon,
  CreditCardIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  Loader2Icon,
  StarIcon,
  HeartIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DBProfile {
  id: string
  name: string
  location: string
  bio: string
  price: number
  rating: number
  age: number
  tags: string[]
  mainPhoto: string
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .transform(v => v.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\d{13,19}$/, 'Enter a valid card number')),
  cardHolder: z
    .string()
    .min(2, 'Cardholder name is required')
    .max(60, 'Name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name may only contain letters'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format')
    .refine(val => {
      const [mm, yy] = val.split('/')
      const exp = new Date(2000 + parseInt(yy), parseInt(mm) - 1, 1)
      return exp >= new Date()
    }, 'Card has expired'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
})

type CardFormValues = z.input<typeof cardSchema>

// ─── Card-network detection ───────────────────────────────────────────────────

type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'discover' | null

function detectNetwork(raw: string): CardNetwork {
  const n = raw.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^5[1-5]|^2[2-7]/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^6(?:011|5)/.test(n)) return 'discover'
  return null
}

// ─── Card network SVG logos ───────────────────────────────────────────────────

function VisaLogo({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 16" className={`h-5 transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`} aria-label="Visa">
      <text x="0" y="14" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="#1A1F71">VISA</text>
    </svg>
  )
}

function MastercardLogo({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 38 24" className={`h-6 transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`} aria-label="Mastercard">
      <circle cx="14" cy="12" r="10" fill="#EB001B" />
      <circle cx="24" cy="12" r="10" fill="#F79E1B" />
      <path d="M19 5.27A10 10 0 0 1 23.73 12 10 10 0 0 1 19 18.73 10 10 0 0 1 14.27 12 10 10 0 0 1 19 5.27z" fill="#FF5F00" />
    </svg>
  )
}

function AmexLogo({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 16" className={`h-5 transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`} aria-label="American Express">
      <rect x="0" y="0" width="48" height="16" rx="3" fill="#2E77BC" />
      <text x="5" y="12" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="white">AMEX</text>
    </svg>
  )
}

// ─── Input formatting helpers ─────────────────────────────────────────────────

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400">
          <AlertCircleIcon className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardPaymentClient({ profile }: { profile: DBProfile }) {
  const [network, setNetwork]         = useState<CardNetwork>(null)
  const [isLoading, setIsLoading]     = useState(false)
  const [succeeded, setSucceeded]     = useState(false)
  const [cardNumDisplay, setCardNumDisplay] = useState('')
  const [expiryDisplay, setExpiryDisplay]   = useState('')
  const [cvvFocused, setCvvFocused]         = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CardFormValues>({ resolver: zodResolver(cardSchema) })

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumDisplay(formatted)
    setValue('cardNumber', formatted, { shouldValidate: true })
    setNetwork(detectNetwork(formatted))
  }, [setValue])

  const handleExpiryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setExpiryDisplay(formatted)
    setValue('expiry', formatted, { shouldValidate: true })
  }, [setValue])

  const onSubmit = async (_data: CardFormValues) => {
    setIsLoading(true)
    // Simulate gateway latency — replace with real Stripe call
    await new Promise(r => setTimeout(r, 2200))
    setIsLoading(false)
    setSucceeded(true)
  }

  // ── Success screen ────────────────────────────────────────────────────────

  if (succeeded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(160deg,#08080F 0%,#0D0A14 60%,#0A0510 100%)' }}
      >
        <div
          className="max-w-sm w-full rounded-2xl p-8 text-center space-y-6"
          style={{
            background: '#0F0F1E',
            border: '1px solid #00D168',
            boxShadow: '0 0 60px rgba(0,209,104,0.12)',
          }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(0,209,104,0.15)' }}>
            <CheckCircle2Icon className="w-10 h-10 text-[#00D168]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-sm text-white/55 leading-relaxed">
              Your card payment for <span className="text-white font-semibold">{profile.name}</span> was processed. Access will be granted shortly.
            </p>
          </div>
          <div className="rounded-xl p-4 text-left space-y-2"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Amount</span>
              <span className="font-bold text-white">${profile.price.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Profile</span>
              <span className="font-semibold text-white">{profile.name}</span>
            </div>
          </div>
          <Link
            href="/palfinder"
            className="inline-block text-sm text-white/40 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
          >
            Return to Palfinder
          </Link>
        </div>
      </div>
    )
  }

  // ── Payment form ──────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg,#08080F 0%,#0D0A14 60%,#0A0510 100%)' }}
    >
      {/* Ambient top glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{
          position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(107,31,42,0.18) 0%,transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Back link */}
        <Link
          href={`/palfinder/checkout/${profile.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back to payment options
        </Link>

        <div className="grid lg:grid-cols-[1fr_440px] gap-8 items-start">

          {/* ── LEFT: Profile summary ─────────────────────────────── */}
          <div className="space-y-5">

            {/* Profile card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                {profile.mainPhoto
                  ? <img src={profile.mainPhoto} alt={profile.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6B1F2A,#E8B547)' }}>
                      <HeartIcon className="w-16 h-16 text-white/30" />
                    </div>
                }
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(8,8,16,0.9) 0%,transparent 50%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
                  <p className="text-xs text-white/50 mt-0.5">{profile.location} · {profile.age} yrs</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <StarIcon key={s} className={`w-4 h-4 ${s <= profile.rating ? 'fill-[#E8B547] text-[#E8B547]' : 'fill-white/10 text-white/10'}`} />
                  ))}
                  <span className="text-xs text-white/40 ml-1">{profile.rating.toFixed(1)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(107,31,42,0.15)', color: '#E8B547', border: '1px solid rgba(107,31,42,0.25)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Order Summary</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{profile.name} — One-time access</span>
                <span className="text-sm font-bold text-white">${profile.price.toFixed(2)}</span>
              </div>
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/80">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-white">${profile.price.toFixed(2)}</span>
                  <span className="text-xs text-white/30 ml-1.5">USD</span>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="rounded-2xl p-4 flex flex-wrap items-center gap-4"
              style={{ background: 'rgba(0,209,104,0.04)', border: '1px solid rgba(0,209,104,0.12)' }}>
              <div className="flex items-center gap-2 text-[#00D168]">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="text-xs font-semibold">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-[#00D168]">
                <LockIcon className="w-4 h-4" />
                <span className="text-xs font-semibold">Secure Payment</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Card form ──────────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden sticky top-8"
            style={{
              background: 'linear-gradient(180deg,#0D0D1A 0%,#0A0A14 100%)',
              border: '1px solid rgba(232,181,71,0.2)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(107,31,42,0.1)',
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6B1F2A,#E8B547)', boxShadow: '0 0 16px rgba(107,31,42,0.5)' }}>
                  <CreditCardIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Pay with Card</h2>
                  <p className="text-[10px] text-white/40">Visa · Mastercard · Amex</p>
                </div>
              </div>
              {/* Network logos */}
              <div className="flex items-center gap-2">
                <VisaLogo active={network === 'visa' || network === null} />
                <MastercardLogo active={network === 'mastercard' || network === null} />
                <AmexLogo active={network === 'amex' || network === null} />
              </div>
            </div>

            {/* Visual card preview */}
            <div className="px-5 pt-5">
              <div
                className="relative rounded-2xl p-5 h-40 overflow-hidden select-none"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                {/* Card shine */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
                }} />
                {/* Chip */}
                <div className="w-10 h-7 rounded-md mb-4" style={{ background: 'linear-gradient(135deg,#E8B547,#c9972f)' }} />
                {/* Card number */}
                <p className="font-mono text-base font-bold text-white tracking-[0.2em]">
                  {cardNumDisplay || '•••• •••• •••• ••••'}
                </p>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-wider">Card Holder</p>
                    <p className="text-xs font-semibold text-white truncate max-w-[160px]">
                      {/* We can't easily watch from here; form watch would add re-renders */}
                      YOUR NAME
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/40 uppercase tracking-wider">Expires</p>
                    <p className="text-xs font-semibold text-white">{expiryDisplay || 'MM/YY'}</p>
                  </div>
                </div>
                {/* CVV flip indicator */}
                {cvvFocused && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(4px)' }}>
                    <div className="text-center">
                      <div className="w-full h-10 mx-auto mb-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                      <p className="text-xs text-white/50">Enter the {network === 'amex' ? '4-digit' : '3-digit'} code on the {network === 'amex' ? 'front' : 'back'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-4" noValidate>

              {/* Card number */}
              <Field label="Card Number" error={errors.cardNumber?.message}>
                <input
                  id="card-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumDisplay}
                  maxLength={23}
                  onChange={handleCardNumberChange}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono placeholder:text-white/25 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.cardNumber ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(232,181,71,0.5)')}
                  onBlur={e => (e.target.style.border = errors.cardNumber ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)')}
                />
              </Field>

              {/* Cardholder */}
              <Field label="Cardholder Name" error={errors.cardHolder?.message}>
                <input
                  id="card-holder"
                  type="text"
                  autoComplete="cc-name"
                  placeholder="Jane Smith"
                  {...register('cardHolder')}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.cardHolder ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(232,181,71,0.5)')}
                  onBlur={e => (e.target.style.border = errors.cardHolder ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)')}
                />
              </Field>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry (MM/YY)" error={errors.expiry?.message}>
                  <input
                    id="card-expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={expiryDisplay}
                    maxLength={5}
                    onChange={handleExpiryChange}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono placeholder:text-white/25 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: errors.expiry ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => (e.target.style.border = '1px solid rgba(232,181,71,0.5)')}
                    onBlur={e => (e.target.style.border = errors.expiry ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)')}
                  />
                </Field>

                <Field label="CVV" error={errors.cvv?.message}>
                  <input
                    id="card-cvv"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder={network === 'amex' ? '4 digits' : '3 digits'}
                    maxLength={network === 'amex' ? 4 : 3}
                    {...register('cvv', {
                      onBlur: () => setCvvFocused(false),
                    })}
                    onFocus={(e) => {
                      setCvvFocused(true)
                      e.target.style.border = '1px solid rgba(232,181,71,0.5)'
                    }}
                    onBlur={(e) => {
                      setCvvFocused(false)
                      e.target.style.border = errors.cvv
                        ? '1px solid rgba(248,113,113,0.6)'
                        : '1px solid rgba(255,255,255,0.1)'
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono placeholder:text-white/25 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: errors.cvv ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </Field>
              </div>

              {/* Amount row */}
              <div className="rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: 'rgba(107,31,42,0.1)', border: '1px solid rgba(107,31,42,0.25)' }}>
                <span className="text-xs text-white/50 font-medium">Total charge</span>
                <span className="text-xl font-extrabold text-white">
                  ${profile.price.toFixed(2)} <span className="text-xs font-medium text-white/40">USD</span>
                </span>
              </div>

              {/* Submit */}
              <button
                id="pay-now-btn"
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 rounded-xl font-bold text-white text-sm transition-all duration-200 overflow-hidden"
                style={{
                  background: isLoading
                    ? 'rgba(107,31,42,0.5)'
                    : 'linear-gradient(135deg, #D9272E 0%, #6B1F2A 100%)',
                  boxShadow: isLoading ? 'none' : '0 8px 30px rgba(217,39,46,0.35)',
                  transform: isLoading ? 'none' : undefined,
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    Processing Payment…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LockIcon className="w-4 h-4" />
                    Pay ${profile.price.toFixed(2)} Now
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="px-5 py-3 flex items-center justify-center gap-1.5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <ShieldCheckIcon className="w-3 h-3 text-white/20" />
              <span className="text-[10px] text-white/20">Secure · 256-bit encrypted · PCI DSS compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
