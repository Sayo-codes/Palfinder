/**
 * ============================================================================
 * POST /api/payments/init-direct
 * ============================================================================
 * Called by the frontend when the user lands on the payment page.
 * Creates a DirectPayment record in the database so we can track polling.
 *
 * Request body:
 *   { profileId, profileName, priceUsd, coinId, walletAddress, paymentRef }
 *
 * Response:
 *   { success: true, paymentRef, expiresAt }
 * ============================================================================
 */

import { type NextRequest } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, profileName, priceUsd, coinId, walletAddress, paymentRef } = body

    if (!profileId || !priceUsd || !coinId || !walletAddress || !paymentRef) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    // Upsert — if the same paymentRef already exists (e.g. duplicate init), just return it
    const payment = await db.directPayment.upsert({
      where: { paymentRef },
      create: {
        paymentRef,
        profileId,
        profileName,
        priceUsd,
        coinId,
        walletAddress,
        expiresAt,
        status: 'waiting',
      },
      update: {}, // Don't overwrite if already exists
    })

    console.log(`[InitDirect] Created DirectPayment: ${paymentRef} for profile ${profileId}`)

    return Response.json({
      success: true,
      paymentRef: payment.paymentRef,
      expiresAt: payment.expiresAt.toISOString(),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[InitDirect] Error:', message)
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
