/**
 * ============================================================================
 * POST /api/payments/webhook
 * ============================================================================
 * Receives IPN (Instant Payment Notification) callbacks from NOWPayments.
 *
 * NOWPayments sends a POST request whenever a payment status changes.
 * The payload is signed with HMAC-SHA512 using your IPN Secret.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to NOWPayments Dashboard → Settings → IPN
 * 2. Set the IPN Callback URL to: https://yourdomain.com/api/payments/webhook
 * 3. Copy your IPN Secret and add it to .env as NOWPAYMENTS_IPN_SECRET
 *
 * Payment statuses from NOWPayments:
 *   waiting → confirming → confirmed → sending → finished
 *   Or: waiting → expired / failed / refunded
 * ============================================================================
 */

import { type NextRequest } from 'next/server'
import { verifyWebhookSignature } from '@/lib/nowpayments'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/** Statuses that mean the payment is successfully completed */
const PAID_STATUSES = ['confirmed', 'sending', 'finished']

export async function POST(request: NextRequest) {
  try {
    // ── Read the raw body ─────────────────────────────────────
    const body = await request.json()
    const signature = request.headers.get('x-nowpayments-sig') || ''

    console.log('[Webhook] Received IPN callback:', {
      payment_id: body.payment_id,
      payment_status: body.payment_status,
      order_id: body.order_id,
    })

    // ── Verify HMAC signature ─────────────────────────────────
    // Skip verification in development if no IPN secret is set
    if (process.env.NOWPAYMENTS_IPN_SECRET) {
      const isValid = await verifyWebhookSignature(body, signature)
      if (!isValid) {
        console.error('[Webhook] Invalid signature! Possible tampering attempt.')
        return Response.json(
          { success: false, error: 'Invalid signature' },
          { status: 403 }
        )
      }
      console.log('[Webhook] Signature verified ✓')
    } else {
      console.warn('[Webhook] No IPN secret set — skipping signature verification')
    }

    // ── Extract payment data from webhook payload ─────────────
    const {
      payment_id,
      payment_status,
      order_id,
      price_amount,
      price_currency,
      pay_amount,
      pay_currency,
      actually_paid,
      actually_paid_at_fiat,
    } = body

    // ── Update payment record in database ─────────────────────
    try {
      await db.cryptoPayment.updateMany({
        where: { paymentId: String(payment_id) },
        data: {
          status: payment_status,
          actuallyPaid: actually_paid || 0,
          actuallyPaidFiat: actually_paid_at_fiat || 0,
          updatedAt: new Date(),
          // Mark as completed if payment is in a "paid" status
          ...(PAID_STATUSES.includes(payment_status) ? { completedAt: new Date() } : {}),
        },
      })

      console.log(`[Webhook] Updated payment ${payment_id} → status: ${payment_status}`)
    } catch (dbError) {
      console.error('[Webhook] DB update failed:', dbError)
    }

    // ── Handle "finished" status — unlock content ─────────────
    if (payment_status === 'finished' || payment_status === 'confirmed') {
      console.log(`[Webhook] 🎉 Payment ${payment_id} COMPLETED for order ${order_id}`)

      // ────────────────────────────────────────────────────────
      // TODO: Add your content unlock logic here
      // Examples:
      //   - Update user's subscription status
      //   - Grant access to a specific profile
      //   - Send a confirmation email
      //   - Create an "access" record linking user ↔ profile
      //
      // await prisma.profileAccess.create({
      //   data: {
      //     userId: extractedUserId,
      //     profileId: extractedProfileId,
      //     paymentId: String(payment_id),
      //     expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      //   }
      // })
      // ────────────────────────────────────────────────────────
    }

    // ── Handle failed/expired statuses ────────────────────────
    if (payment_status === 'failed' || payment_status === 'expired') {
      console.log(`[Webhook] ❌ Payment ${payment_id} ${payment_status.toUpperCase()} for order ${order_id}`)
      // Optionally notify the user, clean up pending records, etc.
    }

    return Response.json({ success: true })
  } catch (error: unknown) {
    console.error('[Webhook] Error processing webhook:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
