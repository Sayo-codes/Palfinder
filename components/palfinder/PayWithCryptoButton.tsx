'use client'

/**
 * PayWithCryptoButton — Reusable crypto payment trigger
 * Styled to match the existing maroon "BUY" button design.
 * Opens the PaymentModal when clicked.
 */

import React, { useState } from 'react'
import { WalletIcon } from 'lucide-react'
import PaymentModal from './PaymentModal'

interface PayWithCryptoButtonProps {
  /** USD amount to charge */
  amount: number
  /** Profile name (shown in modal) */
  profileName: string
  /** Button label override */
  label?: string
  /** Additional CSS classes */
  className?: string
  /** Called when payment is successfully completed */
  onSuccess?: (paymentId: number, orderId: string) => void
}

export default function PayWithCryptoButton({
  amount,
  profileName,
  label,
  className = '',
  onSuccess,
}: PayWithCryptoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
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

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={amount}
        profileName={profileName}
        onPaymentSuccess={(paymentId, orderId) => {
          onSuccess?.(paymentId, orderId)
          // Modal handles its own success UI, then user clicks "Continue" to close
        }}
      />
    </>
  )
}
