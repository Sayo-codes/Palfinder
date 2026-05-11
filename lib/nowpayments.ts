/**
 * ============================================================================
 * NOWPayments API Client
 * ============================================================================
 * Centralizes all communication with the NOWPayments API.
 * The API key is read from process.env and NEVER exposed to the frontend.
 *
 * Documentation: https://documenter.getpostman.com/view/7907941/S1a32n38
 * ============================================================================
 */

// ─── Configuration ──────────────────────────────────────────────────────────

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1'

function getApiKey(): string {
  const key = process.env.NOWPAYMENTS_API_KEY
  if (!key) {
    throw new Error(
      '[NOWPayments] Missing NOWPAYMENTS_API_KEY in environment variables. ' +
      'Add it to your .env file.'
    )
  }
  return key
}

function getIpnSecret(): string {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET
  if (!secret) {
    throw new Error(
      '[NOWPayments] Missing NOWPAYMENTS_IPN_SECRET in environment variables. ' +
      'Add it to your .env file.'
    )
  }
  return secret
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CreateInvoiceParams {
  /** Amount in the price currency (e.g. USD) */
  priceAmount: number
  /** Fiat currency for the price (default: 'usd') */
  priceCurrency?: string
  /** Crypto currency the buyer pays in (default: 'usdttrc20') */
  payCurrency?: string
  /** Your internal order/reference ID */
  orderId: string
  /** Description shown to buyer */
  orderDescription?: string
  /** URL to redirect after payment */
  successUrl?: string
  /** URL to redirect on cancel */
  cancelUrl?: string
  /** Webhook notification URL */
  ipnCallbackUrl?: string
}

export interface NOWPaymentInvoice {
  id: string
  token_id: string
  order_id: string
  order_description: string
  price_amount: number
  price_currency: string
  pay_currency: string | null
  ipn_callback_url: string
  invoice_url: string
  success_url: string
  cancel_url: string
  created_at: string
  updated_at: string
  is_fee_paid_by_user: boolean
}

export interface CreatePaymentParams {
  /** Amount in the price currency (e.g. USD) */
  priceAmount: number
  /** Fiat currency for the price (default: 'usd') */
  priceCurrency?: string
  /** Crypto currency the buyer pays in (default: 'usdttrc20') */
  payCurrency?: string
  /** Your internal order/reference ID */
  orderId: string
  /** Description shown to buyer */
  orderDescription?: string
  /** Webhook notification URL */
  ipnCallbackUrl?: string
}

export interface NOWPayment {
  payment_id: number
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id: string
  order_description: string
  purchase_id: number
  created_at: string
  updated_at: string
  ipn_callback_url: string
  payin_extra_id: string | null
  /* Additional fields that may be returned */
  actually_paid?: number
  actually_paid_at_fiat?: number
  expiration_estimate_date?: string
}

export interface PaymentStatus {
  payment_id: number
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id: string
  order_description: string
  actually_paid: number
  actually_paid_at_fiat: number
  created_at: string
  updated_at: string
}

export type NOWPaymentStatus =
  | 'waiting'
  | 'confirming'
  | 'confirmed'
  | 'sending'
  | 'partially_paid'
  | 'finished'
  | 'failed'
  | 'refunded'
  | 'expired'

// ─── Available Currencies ───────────────────────────────────────────────────

/** Popular crypto currencies supported by NOWPayments */
export const SUPPORTED_CURRENCIES = [
  { symbol: 'usdttrc20', name: 'USDT (TRC-20)', icon: '💵' },
  { symbol: 'usdterc20', name: 'USDT (ERC-20)', icon: '💵' },
  { symbol: 'btc',       name: 'Bitcoin',       icon: '₿' },
  { symbol: 'eth',       name: 'Ethereum',      icon: 'Ξ' },
  { symbol: 'ltc',       name: 'Litecoin',      icon: 'Ł' },
  { symbol: 'trx',       name: 'TRON',          icon: '◎' },
  { symbol: 'bnbbsc',    name: 'BNB (BSC)',      icon: '🔶' },
  { symbol: 'sol',       name: 'Solana',        icon: '◉' },
  { symbol: 'doge',      name: 'Dogecoin',      icon: '🐕' },
  { symbol: 'xrp',       name: 'XRP',           icon: '✕' },
] as const

// ─── API Methods ────────────────────────────────────────────────────────────

/**
 * Check API status / availability
 */
export async function getApiStatus(): Promise<{ message: string }> {
  const res = await fetch(`${NOWPAYMENTS_API_URL}/status`, {
    method: 'GET',
    headers: { 'x-api-key': getApiKey() },
  })
  if (!res.ok) {
    throw new Error(`NOWPayments status check failed: ${res.statusText}`)
  }
  return res.json()
}

/**
 * Get estimated price for a crypto payment
 */
export async function getEstimatedPrice(
  amount: number,
  currencyFrom: string = 'usd',
  currencyTo: string = 'usdttrc20'
): Promise<{ estimated_amount: number; currency_from: string; currency_to: string }> {
  const url = `${NOWPAYMENTS_API_URL}/estimate?amount=${amount}&currency_from=${currencyFrom}&currency_to=${currencyTo}`
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'x-api-key': getApiKey() },
  })
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`NOWPayments estimate failed: ${res.status} - ${errorBody}`)
  }
  return res.json()
}

/**
 * Create a new payment directly (no invoice page redirect)
 * Returns pay_address, pay_amount, etc. for displaying in our own modal
 */
export async function createPayment(params: CreatePaymentParams): Promise<NOWPayment> {
  const body = {
    price_amount: params.priceAmount,
    price_currency: params.priceCurrency || 'usd',
    pay_currency: params.payCurrency || 'usdttrc20',
    order_id: params.orderId,
    order_description: params.orderDescription || `PalFinder Purchase - ${params.orderId}`,
    ipn_callback_url: params.ipnCallbackUrl || process.env.NOWPAYMENTS_IPN_CALLBACK_URL || '',
  }

  const res = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
    method: 'POST',
    headers: {
      'x-api-key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`NOWPayments create payment failed: ${res.status} - ${errorBody}`)
  }

  return res.json()
}

/**
 * Create an invoice (redirects user to NOWPayments hosted page)
 * Use this if you prefer the NOWPayments-hosted checkout UI
 */
export async function createInvoice(params: CreateInvoiceParams): Promise<NOWPaymentInvoice> {
  const body = {
    price_amount: params.priceAmount,
    price_currency: params.priceCurrency || 'usd',
    pay_currency: params.payCurrency || 'usdttrc20',
    order_id: params.orderId,
    order_description: params.orderDescription || `PalFinder Purchase - ${params.orderId}`,
    success_url: params.successUrl || '',
    cancel_url: params.cancelUrl || '',
    ipn_callback_url: params.ipnCallbackUrl || process.env.NOWPAYMENTS_IPN_CALLBACK_URL || '',
  }

  const res = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`NOWPayments create invoice failed: ${res.status} - ${errorBody}`)
  }

  return res.json()
}

/**
 * Get payment status by payment ID
 */
export async function getPaymentStatus(paymentId: string | number): Promise<PaymentStatus> {
  const res = await fetch(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
    method: 'GET',
    headers: { 'x-api-key': getApiKey() },
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`NOWPayments get status failed: ${res.status} - ${errorBody}`)
  }

  return res.json()
}

/**
 * Get minimum payment amount for a currency pair
 */
export async function getMinimumAmount(
  currencyFrom: string = 'usd',
  currencyTo: string = 'usdttrc20'
): Promise<{ min_amount: number; currency_from: string; currency_to: string }> {
  const url = `${NOWPAYMENTS_API_URL}/min-amount?currency_from=${currencyFrom}&currency_to=${currencyTo}`
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'x-api-key': getApiKey() },
  })
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`NOWPayments min-amount failed: ${res.status} - ${errorBody}`)
  }
  return res.json()
}

/**
 * Verify IPN webhook signature
 * NOWPayments signs webhook payloads with HMAC-SHA512 using your IPN Secret
 */
export async function verifyWebhookSignature(
  payload: Record<string, unknown>,
  receivedSignature: string
): Promise<boolean> {
  const secret = getIpnSecret()

  // NOWPayments sorts the keys alphabetically, then HMACs the JSON
  const sortedPayload = sortObject(payload)
  const payloadString = JSON.stringify(sortedPayload)

  // Use Web Crypto API for HMAC-SHA512 (works in Edge runtime too)
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const msgData = encoder.encode(payloadString)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  const computedHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return computedHex === receivedSignature
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Recursively sort object keys alphabetically (required for HMAC verification) */
function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce((sorted: Record<string, unknown>, key: string) => {
      const value = obj[key]
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sorted[key] = sortObject(value as Record<string, unknown>)
      } else {
        sorted[key] = value
      }
      return sorted
    }, {})
}
