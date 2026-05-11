/**
 * ============================================================================
 * POST /api/payments/create-invoice
 * ============================================================================
 * Creates a NOWPayments payment and returns the pay address + amount
 * for display in the frontend PaymentModal.
 *
 * Request body:
 *   { amount: number, currency?: string, profileName: string, orderId?: string }
 *
 * Response:
 *   { success: true, payment: { paymentId, payAddress, payAmount, payCurrency, ... } }
 * ============================================================================
 */

import { type NextRequest } from 'next/server'
import { createPayment, getEstimatedPrice } from '@/lib/nowpayments'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      amount,
      currency = 'usdttrc20',
      profileName = 'Unknown',
      orderId,
    } = body

    // ── Validate input ────────────────────────────────────────
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return Response.json(
        { success: false, error: 'Invalid amount. Must be a positive number.' },
        { status: 400 }
      )
    }

    // ── Generate unique order ID if not provided ──────────────
    const finalOrderId = orderId || `PAL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // ── Get estimated crypto amount (for display in modal) ───
    const estimate = await getEstimatedPrice(amount, 'usd', currency)

    // ── Create payment via NOWPayments ───────────────────────
    const payment = await createPayment({
      priceAmount: amount,
      priceCurrency: 'usd',
      payCurrency: currency,
      orderId: finalOrderId,
      orderDescription: `PalFinder - Unlock ${profileName}`,
      // Set your webhook URL here. In production, use your domain.
      ipnCallbackUrl: process.env.NOWPAYMENTS_IPN_CALLBACK_URL || '',
    })

    // ── Store payment record in database ─────────────────────
    // Using Prisma — the CryptoPayment model should exist in schema.prisma
    // If you haven't run the migration yet, this will fail gracefully
    try {
      await db.cryptoPayment.create({
        data: {
          paymentId: String(payment.payment_id),
          orderId: finalOrderId,
          profileName,
          priceAmount: amount,
          priceCurrency: 'usd',
          payAmount: payment.pay_amount,
          payCurrency: payment.pay_currency,
          payAddress: payment.pay_address,
          status: payment.payment_status,
          expiresAt: payment.expiration_estimate_date
            ? new Date(payment.expiration_estimate_date)
            : new Date(Date.now() + 60 * 60 * 1000), // 60 min default
        },
      })
    } catch (dbError) {
      // Log but don't fail — payment was already created at NOWPayments
      console.warn('[Payments] DB write failed (migration pending?):', dbError)
    }

    // ── Return payment data to frontend ──────────────────────
    return Response.json({
      success: true,
      payment: {
        paymentId: payment.payment_id,
        payAddress: payment.pay_address,
        payAmount: payment.pay_amount,
        payCurrency: payment.pay_currency,
        priceAmount: payment.price_amount,
        priceCurrency: payment.price_currency,
        orderId: finalOrderId,
        status: payment.payment_status,
        estimatedAmount: estimate.estimated_amount,
        expiresAt: payment.expiration_estimate_date
          || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        createdAt: payment.created_at,
      },
    })
  } catch (error: unknown) {
    console.error('[Payments] Create invoice error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
