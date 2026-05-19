/**
 * ============================================================================
 * GET /api/payments/check-direct/[paymentId]
 * ============================================================================
 * Poll this endpoint to check if a direct crypto payment has been received.
 * Returns the current status and unlocks content if confirmed.
 * ============================================================================
 */

import { type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { checkIncomingTransactions } from '@/lib/blockchain'
import { confirmAndUnlockPayment } from '@/lib/payments'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params

    const payment = await db.directPayment.findUnique({
      where: { paymentRef: paymentId },
    })

    if (!payment) {
      return Response.json({ success: false, error: 'Payment not found' }, { status: 404 })
    }

    // Already confirmed? Return success
    if (payment.status === 'confirmed') {
      const profile = await db.palfinderProfile.findUnique({
        where: { id: payment.profileId },
        select: { megaLink: true, unlockLink: true }
      })
      return Response.json({ 
        success: true, 
        status: 'confirmed',
        megaLink: profile?.megaLink || '',
        unlockLink: profile?.unlockLink || ''
      })
    }

    // Check expiration
    if (payment.status === 'expired' || payment.expiresAt.getTime() < Date.now()) {
      if (payment.status !== 'expired') {
        await db.directPayment.update({
          where: { id: payment.id },
          data: { status: 'expired' },
        })
      }
      return Response.json({ success: true, status: 'expired' })
    }

    // Check blockchain
    const checkResult = await checkIncomingTransactions(
      payment.coinId,
      payment.walletAddress,
      payment.priceUsd,
      payment.paymentRef,
      payment.createdAt.getTime()
    )

    if (checkResult.found && checkResult.transaction) {
      // Payment found -> Confirm and grant access
      const unlockResult = await confirmAndUnlockPayment(
        payment.paymentRef,
        checkResult.transaction.txHash,
        checkResult.transaction.amount
      )

      if (unlockResult.success) {
        return Response.json({ 
          success: true, 
          status: 'confirmed',
          megaLink: unlockResult.megaLink,
          unlockLink: unlockResult.unlockLink
        })
      } else {
        throw new Error(unlockResult.error)
      }
    }

    // Still waiting
    return Response.json({ success: true, status: payment.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[CheckDirect] Error:', message)
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
