'use client'

/**
 * CryptoPayButton — Premium "Pay with Crypto" button
 *
 * Navigates the user to the dedicated crypto payment page at
 * /palfinder/pay/[profileId], where the NOWPayments integration
 * handles invoice creation, QR code display, and status polling.
 *
 * Usage:
 *   <CryptoPayButton profileId="clx1abc..." />
 *   <CryptoPayButton profileId={profile.id} label="Bitcoin / USDT" />
 */

import React from 'react'
import { useRouter } from 'next/navigation'
import { WalletIcon, ChevronRightIcon } from 'lucide-react'

interface CryptoPayButtonProps {
  /** Database ID of the PalfinderProfile to purchase */
  profileId: string
  /** Override the default button label */
  label?: string
  /** Additional CSS classes */
  className?: string
}

export default function CryptoPayButton({
  profileId,
  label = 'Pay with Crypto',
  className = '',
}: CryptoPayButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (!profileId) {
      console.error('[CryptoPayButton] profileId is required')
      return
    }
    router.push(`/palfinder/pay/${profileId}`)
  }

  return (
    <button
      id={`crypto-pay-${profileId}`}
      onClick={handleClick}
      className={`
        group relative flex w-full items-center gap-4 p-4 rounded-2xl
        transition-all duration-200 cursor-pointer
        hover:scale-[1.015] hover:brightness-110 active:scale-[0.98]
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(107,31,42,0.25) 0%, rgba(232,181,71,0.08) 100%)',
        border: '1px solid rgba(232,181,71,0.2)',
        boxShadow: '0 4px 24px rgba(107,31,42,0.15)',
      }}
    >
      {/* Gradient icon circle */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(232,181,71,0.35)]"
        style={{
          background: 'linear-gradient(135deg, #6B1F2A, #E8B547)',
        }}
      >
        <WalletIcon className="w-5 h-5 text-white" />
      </div>

      {/* Label + subtitle */}
      <div className="flex-1 text-left">
        <span className="block text-sm font-bold text-white group-hover:text-[#E8B547] transition-colors">
          {label}
        </span>
        <span className="block text-[10px] text-white/40 font-medium uppercase tracking-wider mt-0.5">
          Bitcoin · USDT · ETH · 50+ coins
        </span>
      </div>

      {/* Right side: badge + chevron */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
          style={{
            background: 'rgba(0,209,104,0.1)',
            color: '#00D168',
            border: '1px solid rgba(0,209,104,0.2)',
          }}
        >
          Instant
        </span>
        <ChevronRightIcon className="w-4 h-4 text-white/30 group-hover:text-[#E8B547] transition-colors" />
      </div>
    </button>
  )
}
