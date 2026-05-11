'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { XIcon, CopyIcon, CheckIcon, ClockIcon, Loader2Icon, AlertTriangleIcon, CheckCircle2Icon, ChevronDownIcon, ShieldCheckIcon, WalletIcon, QrCodeIcon } from 'lucide-react'

interface PaymentData {
  paymentId: number; payAddress: string; payAmount: number; payCurrency: string
  priceAmount: number; priceCurrency: string; orderId: string; status: string
  estimatedAmount: number; expiresAt: string; createdAt: string
}

type PStatus = 'loading'|'waiting'|'confirming'|'confirmed'|'finished'|'expired'|'failed'|'error'

interface CurrencyOption { symbol: string; name: string; icon: string }

const CURRENCIES: CurrencyOption[] = [
  { symbol: 'usdttrc20', name: 'USDT (TRC-20)', icon: '💵' },
  { symbol: 'usdterc20', name: 'USDT (ERC-20)', icon: '💵' },
  { symbol: 'btc', name: 'Bitcoin', icon: '₿' },
  { symbol: 'eth', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'ltc', name: 'Litecoin', icon: 'Ł' },
  { symbol: 'trx', name: 'TRON', icon: '◎' },
  { symbol: 'bnbbsc', name: 'BNB (BSC)', icon: '🔶' },
  { symbol: 'sol', name: 'Solana', icon: '◉' },
  { symbol: 'doge', name: 'Dogecoin', icon: '🐕' },
  { symbol: 'xrp', name: 'XRP', icon: '✕' },
]

interface PaymentModalProps {
  isOpen: boolean; onClose: () => void; amount: number; profileName: string
  onPaymentSuccess?: (paymentId: number, orderId: string) => void
}

export default function PaymentModal({ isOpen, onClose, amount, profileName, onPaymentSuccess }: PaymentModalProps) {
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [status, setStatus] = useState<PStatus>('loading')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(3600)
  const pollRef = useRef<ReturnType<typeof setInterval>|null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const created = useRef(false)

  useEffect(() => { if (isOpen) document.body.style.overflow='hidden'; return ()=>{document.body.style.overflow=''} }, [isOpen])

  const createPayment = useCallback(async () => {
    if (created.current) return; created.current = true
    setStatus('loading'); setError(null)
    try {
      const res = await fetch('/api/payments/create-invoice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: currency.symbol, profileName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to create payment')
      setPayment(data.payment); setStatus('waiting')
      if (data.payment.expiresAt) {
        const diff = Math.max(0, Math.floor((new Date(data.payment.expiresAt).getTime() - Date.now()) / 1000))
        setTimeLeft(diff > 0 ? diff : 3600)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error'); setStatus('error'); created.current = false
    }
  }, [amount, currency.symbol, profileName])

  useEffect(() => { if (isOpen) createPayment(); return ()=>{ created.current = false } }, [isOpen, createPayment])

  // Poll status every 15s
  useEffect(() => {
    if (!payment || !isOpen || ['finished','confirmed','expired','failed'].includes(status)) return
    const poll = async () => {
      try {
        const res = await fetch(`/api/payments/status/${payment.paymentId}`)
        const data = await res.json()
        if (data.success && data.payment) {
          setStatus(data.payment.status as PStatus)
          if (data.payment.status === 'finished' || data.payment.status === 'confirmed')
            onPaymentSuccess?.(payment.paymentId, payment.orderId)
        }
      } catch {}
    }
    pollRef.current = setInterval(poll, 15000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [payment, status, isOpen, onPaymentSuccess])

  // Countdown
  useEffect(() => {
    if (status !== 'waiting' && status !== 'confirming') return
    timerRef.current = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { setStatus('expired'); return 0 } return p - 1 })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [status])

  const handleClose = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    setPayment(null); setStatus('loading'); setError(null); setCopied(false); created.current = false; onClose()
  }

  const handleCopy = async () => {
    if (!payment?.payAddress) return
    try { await navigator.clipboard.writeText(payment.payAddress) } catch { /* fallback */ }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  const qrUrl = payment ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payment.payAddress)}&bgcolor=FFFFFF&color=000000&margin=8` : ''

  const handleCurrencyChange = (c: CurrencyOption) => {
    setCurrency(c); setShowDropdown(false); setPayment(null); setStatus('loading'); setError(null)
    created.current = false; setTimeout(() => createPayment(), 100)
  }

  if (!isOpen) return null

  const SC: Record<string,{l:string;c:string;bg:string;i:React.ReactNode}> = {
    loading:{l:'Creating Payment…',c:'#E8B547',bg:'rgba(232,181,71,0.1)',i:<Loader2Icon className="w-4 h-4 animate-spin"/>},
    waiting:{l:'Awaiting Payment',c:'#E8B547',bg:'rgba(232,181,71,0.1)',i:<ClockIcon className="w-4 h-4"/>},
    confirming:{l:'Confirming…',c:'#00A3C4',bg:'rgba(0,163,196,0.1)',i:<Loader2Icon className="w-4 h-4 animate-spin"/>},
    confirmed:{l:'Confirmed ✓',c:'#00D168',bg:'rgba(0,209,104,0.1)',i:<CheckCircle2Icon className="w-4 h-4"/>},
    finished:{l:'Payment Complete!',c:'#00D168',bg:'rgba(0,209,104,0.1)',i:<CheckCircle2Icon className="w-4 h-4"/>},
    expired:{l:'Payment Expired',c:'#FF4444',bg:'rgba(255,68,68,0.1)',i:<AlertTriangleIcon className="w-4 h-4"/>},
    failed:{l:'Payment Failed',c:'#FF4444',bg:'rgba(255,68,68,0.1)',i:<AlertTriangleIcon className="w-4 h-4"/>},
    error:{l:'Error',c:'#FF4444',bg:'rgba(255,68,68,0.1)',i:<AlertTriangleIcon className="w-4 h-4"/>},
  }
  const cs = SC[status] || SC.loading

  return (
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.85)', backdropFilter:'blur(12px)' }}
      onClick={e => e.target === backdropRef.current && handleClose()}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden flex flex-col animate-in"
        style={{ background:'linear-gradient(180deg,#0D0D1A 0%,#0A0A14 100%)', border:'1px solid rgba(255,255,255,0.08)',
          boxShadow:'0 24px 80px rgba(0,0,0,0.8),0 0 40px rgba(107,31,42,0.15)', maxHeight:'90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#6B1F2A,#E8B547)', boxShadow:'0 0 12px rgba(107,31,42,0.4)' }}>
              <WalletIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Pay with Crypto</h2>
              <p className="text-[10px] text-white/40">Powered by NOWPayments</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Amount */}
          <div className="text-center">
            <p className="text-xs text-white/40 mb-1">Total Amount</p>
            <p className="text-3xl font-extrabold text-white">${amount.toFixed(2)} <span className="text-base font-medium text-white/40">USD</span></p>
            <p className="text-[11px] text-white/30 mt-1">Unlock access to {profileName}</p>
          </div>

          {/* Status badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background:cs.bg, color:cs.c, border:`1px solid ${cs.c}22` }}>{cs.i}{cs.l}</div>
          </div>

          {/* Currency selector */}
          <div className="relative">
            <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Pay with</label>
            <button onClick={() => setShowDropdown(!showDropdown)}
              disabled={status !== 'loading' && status !== 'error'}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm text-white disabled:opacity-60"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <span className="flex items-center gap-2"><span className="text-base">{currency.icon}</span><span className="font-medium">{currency.name}</span></span>
              <ChevronDownIcon className="w-4 h-4 text-white/40" />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-10 max-h-48 overflow-y-auto"
                style={{ background:'#111122', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
                {CURRENCIES.map(c => (
                  <button key={c.symbol} onClick={() => handleCurrencyChange(c)}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-white/80 hover:bg-white/5 transition text-left"
                    style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', ...(c.symbol===currency.symbol?{background:'rgba(107,31,42,0.15)',color:'#E8B547'}:{}) }}>
                    <span className="text-base">{c.icon}</span><span className="font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading */}
          {status === 'loading' && <div className="flex flex-col items-center py-8 gap-3"><Loader2Icon className="w-8 h-8 text-[#E8B547] animate-spin"/><p className="text-sm text-white/50">Generating payment address…</p></div>}

          {/* Error */}
          {status === 'error' && <div className="text-center py-6 space-y-3"><AlertTriangleIcon className="w-10 h-10 text-red-400 mx-auto"/><p className="text-sm text-red-400">{error}</p>
            <button onClick={()=>{created.current=false;createPayment()}} className="text-xs text-white/60 hover:text-white underline">Try Again</button></div>}

          {/* Active payment */}
          {payment && (status==='waiting'||status==='confirming') && <>
            <div className="rounded-xl p-3.5" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <p className="text-[11px] text-white/40 mb-1">Send exactly</p>
              <p className="text-xl font-bold text-white">{payment.payAmount} <span className="text-sm font-medium text-white/50 uppercase">{payment.payCurrency}</span></p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-xl p-3 inline-block" style={{background:'#fff',boxShadow:'0 0 20px rgba(232,181,71,0.15)'}}>
                <img src={qrUrl} alt="QR Code" className="w-40 h-40" style={{imageRendering:'pixelated'}}/>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/30"><QrCodeIcon className="w-3 h-3"/>Scan with your wallet</div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Wallet Address</label>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                <p className="flex-1 text-xs text-white/80 font-mono break-all leading-relaxed select-all">{payment.payAddress}</p>
                <button onClick={handleCopy} className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{background:copied?'rgba(0,209,104,0.15)':'rgba(255,255,255,0.06)'}}>
                  {copied?<CheckIcon className="w-3.5 h-3.5 text-[#00D168]"/>:<CopyIcon className="w-3.5 h-3.5 text-white/50"/>}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ClockIcon className="w-3.5 h-3.5 text-white/40"/>
              <span className="text-sm font-mono font-bold" style={{color:timeLeft<300?'#FF4444':timeLeft<600?'#E8B547':'rgba(255,255,255,0.6)'}}>{fmt(timeLeft)}</span>
              <span className="text-[11px] text-white/30">remaining</span>
            </div>
          </>}

          {/* Success */}
          {(status==='confirmed'||status==='finished') && <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background:'rgba(0,209,104,0.12)',border:'2px solid rgba(0,209,104,0.3)',boxShadow:'0 0 30px rgba(0,209,104,0.2)'}}>
              <CheckCircle2Icon className="w-8 h-8 text-[#00D168]"/></div>
            <div className="text-center"><h3 className="text-lg font-bold text-white mb-1">Payment Successful!</h3><p className="text-sm text-white/50">Access to {profileName} unlocked.</p></div>
            <button onClick={handleClose} className="mt-2 px-8 py-2.5 rounded-full text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all"
              style={{background:'#6B1F2A',boxShadow:'0 4px 20px rgba(107,31,42,0.5)'}}>Continue</button>
          </div>}

          {/* Expired */}
          {status==='expired' && <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background:'rgba(255,68,68,0.1)',border:'2px solid rgba(255,68,68,0.25)'}}>
              <AlertTriangleIcon className="w-8 h-8 text-red-400"/></div>
            <div className="text-center"><h3 className="text-lg font-bold text-white mb-1">Payment Expired</h3><p className="text-sm text-white/50">Please try again.</p></div>
            <button onClick={()=>{setPayment(null);setStatus('loading');setError(null);setTimeLeft(3600);created.current=false;setTimeout(()=>createPayment(),100)}}
              className="mt-2 px-8 py-2.5 rounded-full text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all"
              style={{background:'#6B1F2A',boxShadow:'0 4px 20px rgba(107,31,42,0.5)'}}>Try Again</button>
          </div>}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-center gap-1.5 flex-shrink-0" style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <ShieldCheckIcon className="w-3 h-3 text-white/20"/><span className="text-[10px] text-white/20">Secure payment · Crypto transactions are final</span>
        </div>
      </div>
    </div>
  )
}
