/**
 * ============================================================================
 * GET /api/payments/status/[paymentId]
 * ============================================================================
 * Fetches the current payment status from NOWPayments API.
 * Used by the frontend to poll for payment updates.
 * ============================================================================
 */

import { type NextRequest } from 'next/server'
import { getPaymentStatus } from '@/lib/nowpayments'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params

    if (!paymentId) {
      return Response.json(
        { success: false, error: 'Missing paymentId parameter' },
        { status: 400 }
      )
    }

    // ── Fetch status from NOWPayments ─────────────────────────
    const status = await getPaymentStatus(paymentId)

    return Response.json({
      success: true,
      payment: {
        paymentId: status.payment_id,
        status: status.payment_status,
        payAddress: status.pay_address,
        payAmount: status.pay_amount,
        payCurrency: status.pay_currency,
        priceAmount: status.price_amount,
        priceCurrency: status.price_currency,
        actuallyPaid: status.actually_paid,
        orderId: status.order_id,
        createdAt: status.created_at,
        updatedAt: status.updated_at,
      },
    })
  } catch (error: unknown) {
    console.error('[Payments] Status check error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
