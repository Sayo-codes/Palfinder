'use client'

/**
 * PayWithCryptoButton — Navigates to the dedicated full-page payment flow.
 * No longer opens a modal; uses next/navigation to push to /palfinder/pay/[profileId].
 */

import { useRouter } from 'next/navigation'
import { WalletIcon } from 'lucide-react'

interface PayWithCryptoButtonProps {
  /** Index of the profile in PALFINDER_PROFILES (used as the route param) */
  profileId: number
  /** USD amount to charge — kept for display purposes */
  amount: number
  /** Button label override */
  label?: string
  /** Additional CSS classes */
  className?: string
}

export default function PayWithCryptoButton({
  profileId,
  amount,
  label,
  className = '',
}: PayWithCryptoButtonProps) {
  const router = useRouter()

  return (
    <button
      id={`pay-btn-${profileId}`}
      onClick={() => router.push(`/palfinder/pay/${profileId}`)}
      className={`w-full font-bold text-sm py-2.5 rounded-full text-center transition-all duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 ${className}`}
      style={{
        background: '#6B1F2A',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(107,31,42,0.4)',
      }}
    >
      <WalletIcon className="w-3.5 h-3.5" />
      {label || `BUY — $${amount}`}
    </button>
  )
}
