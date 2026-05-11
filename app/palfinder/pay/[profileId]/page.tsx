'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon, WalletIcon, ClockIcon, CopyIcon, CheckIcon,
  Loader2Icon, AlertTriangleIcon, CheckCircle2Icon, ChevronDownIcon,
  ShieldCheckIcon, QrCodeIcon, StarIcon, HeartIcon,
} from 'lucide-react'
import { PALFINDER_PROFILES } from '@/components/palfinder/palfinderData'

/* ── Types ── */
interface PaymentData {
  paymentId: number; payAddress: string; payAmount: number; payCurrency: string
  priceAmount: number; priceCurrency: string; orderId: string; status: string
  expiresAt: string
}
type PStatus = 'idle'|'loading'|'waiting'|'confirming'|'confirmed'|'finished'|'expired'|'failed'|'error'
interface CurrencyOption { symbol: string; name: string; icon: string }

const CURRENCIES: CurrencyOption[] = [
  { symbol: 'usdttrc20', name: 'USDT (TRC-20)', icon: '💵' },
  { symbol: 'usdterc20', name: 'USDT (ERC-20)', icon: '💵' },
  { symbol: 'btc',       name: 'Bitcoin',        icon: '₿'  },
  { symbol: 'eth',       name: 'Ethereum',       icon: 'Ξ'  },
  { symbol: 'ltc',       name: 'Litecoin',       icon: 'Ł'  },
  { symbol: 'trx',       name: 'TRON',           icon: '◎'  },
  { symbol: 'bnbbsc',    name: 'BNB (BSC)',       icon: '🔶' },
  { symbol: 'sol',       name: 'Solana',         icon: '◉'  },
  { symbol: 'doge',      name: 'Dogecoin',       icon: '🐕' },
  { symbol: 'xrp',       name: 'XRP',            icon: '✕'  },
]

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  idle:       { label: 'Ready',              color: '#E8B547', bg: 'rgba(232,181,71,0.1)'  },
  loading:    { label: 'Creating Payment…',  color: '#E8B547', bg: 'rgba(232,181,71,0.1)'  },
  waiting:    { label: 'Awaiting Payment',   color: '#E8B547', bg: 'rgba(232,181,71,0.1)'  },
  confirming: { label: 'Confirming…',        color: '#00A3C4', bg: 'rgba(0,163,196,0.1)'   },
  confirmed:  { label: 'Confirmed ✓',        color: '#00D168', bg: 'rgba(0,209,104,0.1)'   },
  finished:   { label: 'Payment Complete!',  color: '#00D168', bg: 'rgba(0,209,104,0.1)'   },
  expired:    { label: 'Payment Expired',    color: '#FF4444', bg: 'rgba(255,68,68,0.1)'    },
  failed:     { label: 'Payment Failed',     color: '#FF4444', bg: 'rgba(255,68,68,0.1)'    },
  error:      { label: 'Error',              color: '#FF4444', bg: 'rgba(255,68,68,0.1)'    },
}

const fmt = (s: number) =>
  `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

/* ── Page ── */
export default function PayPage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = use(params)
  const router = useRouter()

  const idx = parseInt(profileId, 10)
  const profile = !isNaN(idx) ? PALFINDER_PROFILES[idx] : undefined

  const [currency, setCurrency]       = useState(CURRENCIES[0])
  const [showDrop, setShowDrop]       = useState(false)
  const [payment, setPayment]         = useState<PaymentData | null>(null)
  const [status, setStatus]           = useState<PStatus>('idle')
  const [error, setError]             = useState<string | null>(null)
  const [timeLeft, setTimeLeft]       = useState(3600)
  const [copied, setCopied]           = useState(false)
  const createdRef  = useRef(false)
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  /* Create invoice */
  const createPayment = useCallback(async (curr: CurrencyOption) => {
    if (createdRef.current || !profile) return
    createdRef.current = true
    setStatus('loading'); setError(null)
    try {
      const res = await fetch('/api/payments/create-invoice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: profile.price, currency: curr.symbol, profileName: profile.name }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to create payment')
      setPayment(data.payment); setStatus('waiting')
      const diff = Math.max(0, Math.floor((new Date(data.payment.expiresAt).getTime() - Date.now()) / 1000))
      setTimeLeft(diff > 0 ? diff : 3600)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error'); createdRef.current = false
    }
  }, [profile])

  /* Auto-create on mount */
  useEffect(() => {
    createPayment(currency)
    return () => { createdRef.current = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Poll status */
  useEffect(() => {
    if (!payment || ['finished','confirmed','expired','failed'].includes(status)) return
    const poll = async () => {
      try {
        const res = await fetch(`/api/payments/status/${payment.paymentId}`)
        const data = await res.json()
        if (data.success && data.payment) setStatus(data.payment.status as PStatus)
      } catch { /* silent */ }
    }
    pollRef.current = setInterval(poll, 15000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [payment, status])

  /* Countdown */
  useEffect(() => {
    if (status !== 'waiting' && status !== 'confirming') return
    timerRef.current = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { setStatus('expired'); return 0 } return p - 1 })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [status])

  const handleCurrencyChange = (c: CurrencyOption) => {
    setCurrency(c); setShowDrop(false)
    setPayment(null); setStatus('loading'); setError(null)
    createdRef.current = false
    setTimeout(() => createPayment(c), 50)
  }

  const handleCopy = async () => {
    if (!payment?.payAddress) return
    try { await navigator.clipboard.writeText(payment.payAddress) } catch { /* fallback */ }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const retry = () => {
    setPayment(null); setStatus('loading'); setError(null); setTimeLeft(3600)
    createdRef.current = false; setTimeout(() => createPayment(currency), 50)
  }

  const qrUrl = payment
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payment.payAddress)}&bgcolor=FFFFFF&color=000000&margin=10`
    : ''

  const sm = STATUS_META[status] ?? STATUS_META.loading
  const isActive = status === 'waiting' || status === 'confirming'
  const isDone   = status === 'confirmed' || status === 'finished'

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#08080F' }}>
        <div className="text-center space-y-4">
          <AlertTriangleIcon className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-white font-semibold">Profile not found.</p>
          <Link href="/palfinder" className="text-sm text-white/50 hover:text-white underline">← Back to Palfinder</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#08080F 0%,#0D0A14 60%,#0A0510 100%)' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div style={{ position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)',
          width:'600px', height:'600px', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(107,31,42,0.12) 0%,transparent 70%)', filter:'blur(40px)' }}/>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Back nav */}
        <Link href="/palfinder"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-8">
          <ChevronLeftIcon className="w-4 h-4" /> Back to Palfinder
        </Link>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* ── Left: Profile summary ── */}
          <div className="space-y-6">
            {/* Profile card */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
              <div className="aspect-[16/9] relative overflow-hidden">
                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(8,8,16,0.9) 0%,transparent 55%)' }}/>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
                  <p className="text-xs text-white/50 mt-0.5">{profile.location}</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <StarIcon key={s} className={`w-4 h-4 ${s <= profile.rating ? 'fill-[#E8B547] text-[#E8B547]' : 'fill-white/10 text-white/10'}`}/>
                  ))}
                  <span className="text-xs text-white/40 ml-1">{profile.rating}.0</span>
                </div>
                <p className="text-sm text-white/55 italic leading-relaxed">&ldquo;{profile.bio}&rdquo;</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                      style={{ background:'rgba(107,31,42,0.15)', color:'#E8B547', border:'1px solid rgba(107,31,42,0.25)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* What you get */}
            <div className="rounded-2xl p-5 space-y-3"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">What you unlock</p>
              {['Full media gallery access', 'Direct contact information', 'Priority messaging', 'Exclusive content'].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                  <CheckCircle2Icon className="w-4 h-4 text-[#00D168] flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* Price summary */}
            <div className="rounded-2xl p-5 flex items-center justify-between"
              style={{ background:'rgba(107,31,42,0.08)', border:'1px solid rgba(107,31,42,0.2)' }}>
              <div>
                <p className="text-xs text-white/40 mb-1">Total Amount</p>
                <p className="text-3xl font-extrabold text-white">
                  ${profile.price.toFixed(2)} <span className="text-sm font-medium text-white/40">USD</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#6B1F2A,#E8B547)', boxShadow:'0 0 20px rgba(107,31,42,0.4)' }}>
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* ── Right: Payment panel ── */}
          <div className="rounded-2xl overflow-visible"
            style={{ background:'linear-gradient(180deg,#0D0D1A 0%,#0A0A14 100%)',
              border:'1px solid rgba(255,255,255,0.08)',
              boxShadow:'0 24px 80px rgba(0,0,0,0.6),0 0 40px rgba(107,31,42,0.1)' }}>

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background:'linear-gradient(135deg,#6B1F2A,#E8B547)', boxShadow:'0 0 16px rgba(107,31,42,0.5)' }}>
                <WalletIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Pay with Crypto</h2>
                <p className="text-[10px] text-white/40">Powered by NOWPayments · Instant unlock</p>
              </div>
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* Status badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{ background: sm.bg, color: sm.color, border:`1px solid ${sm.color}22` }}>
                  {(status === 'loading' || status === 'confirming') && <Loader2Icon className="w-3.5 h-3.5 animate-spin"/>}
                  {status === 'waiting'  && <ClockIcon className="w-3.5 h-3.5"/>}
                  {isDone                && <CheckCircle2Icon className="w-3.5 h-3.5"/>}
                  {['expired','failed','error'].includes(status) && <AlertTriangleIcon className="w-3.5 h-3.5"/>}
                  {sm.label}
                </div>
              </div>

              {/* Currency selector */}
              <div className="relative">
                <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Pay with</label>
                <button
                  onClick={() => setShowDrop(v => !v)}
                  disabled={isActive || status === 'loading'}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-white disabled:opacity-50 transition"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <span className="flex items-center gap-2">
                    <span className="text-base">{currency.icon}</span>
                    <span className="font-medium">{currency.name}</span>
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-white/40" />
                </button>
                {showDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 max-h-52 overflow-y-auto"
                    style={{ background:'#111122', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }}>
                    {CURRENCIES.map(c => (
                      <button key={c.symbol} onClick={() => handleCurrencyChange(c)}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-white/80 hover:bg-white/5 transition text-left"
                        style={{ borderBottom:'1px solid rgba(255,255,255,0.04)',
                          ...(c.symbol === currency.symbol ? { background:'rgba(107,31,42,0.15)', color:'#E8B547' } : {}) }}>
                        <span className="text-base">{c.icon}</span>
                        <span className="font-medium">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Loading spinner */}
              {status === 'loading' && (
                <div className="flex flex-col items-center py-8 gap-3">
                  <Loader2Icon className="w-8 h-8 text-[#E8B547] animate-spin" />
                  <p className="text-sm text-white/50">Generating secure payment address…</p>
                </div>
              )}

              {/* Error */}
              {status === 'error' && (
                <div className="text-center py-6 space-y-4">
                  <AlertTriangleIcon className="w-10 h-10 text-red-400 mx-auto" />
                  <p className="text-sm text-red-400">{error}</p>
                  <button onClick={retry}
                    className="px-6 py-2 rounded-full text-sm font-bold text-white transition hover:brightness-110"
                    style={{ background:'#6B1F2A', boxShadow:'0 4px 20px rgba(107,31,42,0.4)' }}>
                    Try Again
                  </button>
                </div>
              )}

              {/* Active payment */}
              {payment && isActive && (
                <>
                  {/* Send amount */}
                  <div className="rounded-xl p-4" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-[11px] text-white/40 mb-1">Send exactly</p>
                    <p className="text-2xl font-bold text-white">
                      {payment.payAmount}{' '}
                      <span className="text-sm font-medium text-white/50 uppercase">{payment.payCurrency}</span>
                    </p>
                  </div>

                  {/* QR */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-2xl p-3 inline-block" style={{ background:'#fff', boxShadow:'0 0 30px rgba(232,181,71,0.2)' }}>
                      <img src={qrUrl} alt="Payment QR Code" className="w-44 h-44" style={{ imageRendering:'pixelated' }} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                      <QrCodeIcon className="w-3 h-3" /> Scan with your crypto wallet
                    </div>
                  </div>

                  {/* Wallet address */}
                  <div>
                    <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Wallet Address</label>
                    <div className="flex items-center gap-2 rounded-xl px-3 py-3"
                      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <p className="flex-1 text-xs text-white/80 font-mono break-all leading-relaxed select-all">{payment.payAddress}</p>
                      <button onClick={handleCopy}
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition"
                        style={{ background: copied ? 'rgba(0,209,104,0.15)' : 'rgba(255,255,255,0.06)' }}>
                        {copied ? <CheckIcon className="w-3.5 h-3.5 text-[#00D168]"/> : <CopyIcon className="w-3.5 h-3.5 text-white/50"/>}
                      </button>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center justify-center gap-2 py-1">
                    <ClockIcon className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-lg font-mono font-bold"
                      style={{ color: timeLeft < 300 ? '#FF4444' : timeLeft < 600 ? '#E8B547' : 'rgba(255,255,255,0.7)' }}>
                      {fmt(timeLeft)}
                    </span>
                    <span className="text-[11px] text-white/30">remaining</span>
                  </div>
                </>
              )}

              {/* Success */}
              {isDone && (
                <div className="flex flex-col items-center py-8 gap-5">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background:'rgba(0,209,104,0.1)', border:'2px solid rgba(0,209,104,0.3)', boxShadow:'0 0 40px rgba(0,209,104,0.2)' }}>
                    <CheckCircle2Icon className="w-10 h-10 text-[#00D168]" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                    <p className="text-sm text-white/50">Access to <span className="text-white font-semibold">{profile.name}</span> is now unlocked.</p>
                  </div>
                  <button onClick={() => router.push('/palfinder')}
                    className="mt-2 px-8 py-3 rounded-full text-sm font-bold text-white transition hover:brightness-110 active:scale-95"
                    style={{ background:'linear-gradient(135deg,#6B1F2A,#8B2535)', boxShadow:'0 4px 20px rgba(107,31,42,0.5)' }}>
                    Continue Browsing
                  </button>
                </div>
              )}

              {/* Expired */}
              {status === 'expired' && (
                <div className="flex flex-col items-center py-8 gap-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background:'rgba(255,68,68,0.1)', border:'2px solid rgba(255,68,68,0.25)' }}>
                    <ClockIcon className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-white">Payment Expired</h3>
                    <p className="text-sm text-white/50">The invoice has timed out. Please try again.</p>
                  </div>
                  <button onClick={retry}
                    className="px-8 py-2.5 rounded-full text-sm font-bold text-white transition hover:brightness-110"
                    style={{ background:'#6B1F2A', boxShadow:'0 4px 20px rgba(107,31,42,0.5)' }}>
                    Generate New Invoice
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 flex items-center justify-center gap-1.5"
              style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <ShieldCheckIcon className="w-3 h-3 text-white/20" />
              <span className="text-[10px] text-white/20">Secure payment · Crypto transactions are irreversible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
