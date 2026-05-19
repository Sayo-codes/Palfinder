/**
 * ============================================================================
 * Blockchain Transaction Monitor
 * ============================================================================
 * Uses FREE public APIs — no API key required to get started.
 *
 * USDT TRC-20  →  Tronscan API  (https://apilist.tronscanapi.com)
 * TON          →  TON Center API (https://toncenter.com/api/v2)
 *
 * HOW PAYMENT MATCHING WORKS:
 *  1. Buyer arrives at /palfinder/pay/[profileId]
 *  2. A unique `paymentRef` is generated (PAL-XXXXX-YYYY-ZZZZ)
 *  3. Buyer is instructed to include that ref in the memo/comment
 *  4. The frontend polls /api/payments/check-direct every 15 s
 *  5. This file checks the last N transactions on the wallet
 *  6. If amount >= expected AND (memo matches OR amount is unique enough)
 *     → payment is confirmed, content unlocked
 *
 * ADDING MORE COINS:
 *  1. Add the wallet to lib/config/crypto.ts
 *  2. Add a new `check*Transactions()` function below
 *  3. Add a new case in `checkIncomingTransactions()`
 * ============================================================================
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IncomingTransaction {
  /** Blockchain transaction hash */
  txHash: string
  /** Amount received in the native token (e.g. USDT, TON) */
  amount: number
  /** Unix timestamp in seconds */
  timestamp: number
  /** Sender address */
  from: string
  /** Memo / comment left by the sender (may be empty) */
  memo: string
  /** Which coin/network this tx is on */
  coin: 'usdt_trc20' | 'ton'
}

export interface CheckResult {
  found: boolean
  transaction?: IncomingTransaction
  /** Raw error message if the API call failed */
  error?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Only look at transactions from the last N seconds (avoid matching old txs) */
const LOOKBACK_WINDOW_SECONDS = 60 * 60 // 1 hour

/** Amount tolerance: accept payment if it is within this % of expected */
const AMOUNT_TOLERANCE_PERCENT = 2 // 2%

// ─── Main Entry Point ─────────────────────────────────────────────────────────

/**
 * Check if a matching payment has arrived for a given coin.
 *
 * @param coinId        - wallet id from crypto.ts  ('usdt_trc20' | 'ton')
 * @param address       - wallet address to monitor
 * @param expectedUsd   - price in USD (used for USDT direct; TON needs conversion)
 * @param paymentRef    - the memo string the buyer was told to include
 * @param createdAtMs   - when the payment session started (ms epoch)
 */
export async function checkIncomingTransactions(
  coinId: string,
  address: string,
  expectedUsd: number,
  paymentRef: string,
  createdAtMs: number,
): Promise<CheckResult> {
  const sinceTs = Math.floor(createdAtMs / 1000) // convert to seconds

  try {
    switch (coinId) {
      case 'usdt_trc20':
        return await checkTrc20UsdtTransactions(address, expectedUsd, paymentRef, sinceTs)
      case 'ton':
        return await checkTonTransactions(address, expectedUsd, paymentRef, sinceTs)
      default:
        return { found: false, error: `Unknown coin id: ${coinId}` }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[Blockchain] checkIncomingTransactions failed for ${coinId}:`, msg)
    return { found: false, error: msg }
  }
}

// ─── USDT TRC-20 via Tronscan ─────────────────────────────────────────────────

/**
 * Fetch TRC-20 USDT transfers to `address` since `sinceTs`.
 * Tronscan public API — no key needed, rate-limited to ~5 req/s.
 *
 * Docs: https://github.com/tronscan/tronscan-frontend/blob/master/document/api.md
 */
async function checkTrc20UsdtTransactions(
  address: string,
  expectedUsdt: number,
  paymentRef: string,
  sinceTs: number,
): Promise<CheckResult> {
  // USDT TRC-20 contract address on mainnet
  const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'

  const url = new URL('https://apilist.tronscanapi.com/api/token_trc20/transfers')
  url.searchParams.set('toAddress', address)
  url.searchParams.set('tokenAddress', USDT_CONTRACT)
  url.searchParams.set('limit', '20')
  url.searchParams.set('start', '0')
  url.searchParams.set('sort', '-timestamp')

  console.log(`[Blockchain][TRC20] Polling: ${url.toString()}`)

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 }, // never cache
  })

  if (!res.ok) {
    throw new Error(`Tronscan API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const transfers: TronscanTransfer[] = data?.token_transfers ?? []

  console.log(`[Blockchain][TRC20] Got ${transfers.length} recent transfers`)

  for (const tx of transfers) {
    const txTimeSec = Math.floor(tx.block_ts / 1000) // block_ts is in ms

    // Skip transactions before the payment session started (with 2-min grace)
    if (txTimeSec < sinceTs - 120) continue

    // Skip transactions older than the lookback window
    if (Date.now() / 1000 - txTimeSec > LOOKBACK_WINDOW_SECONDS) continue

    // USDT TRC-20 has 6 decimals
    const amountReceived = Number(tx.quant) / 1_000_000

    console.log(`[Blockchain][TRC20] tx ${tx.transaction_id}: amount=${amountReceived} USDT`)

    if (isAmountMatch(amountReceived, expectedUsdt)) {
      return {
        found: true,
        transaction: {
          txHash: tx.transaction_id,
          amount: amountReceived,
          timestamp: txTimeSec,
          from: tx.from_address,
          memo: '', // TRC-20 transfers don't have a memo field
          coin: 'usdt_trc20',
        },
      }
    }
  }

  return { found: false }
}

interface TronscanTransfer {
  transaction_id: string
  from_address: string
  to_address: string
  quant: string     // amount as string integer (6 decimals for USDT)
  block_ts: number  // timestamp in ms
}

// ─── TON via TON Center API ───────────────────────────────────────────────────

/**
 * Fetch incoming TON transactions to `address`.
 * Uses the free TON Center API (https://toncenter.com/api/v2).
 *
 * For TON → USD conversion we use the CoinGecko simple price API.
 * In production, cache the price to avoid rate limiting.
 *
 * Docs: https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get
 */
async function checkTonTransactions(
  address: string,
  expectedUsd: number,
  paymentRef: string,
  sinceTs: number,
): Promise<CheckResult> {
  // ── Step 1: Get current TON price in USD ─────────────────────────────────
  let tonPriceUsd = 0
  try {
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd',
      { next: { revalidate: 60 } } // cache price for 60 s
    )
    const priceData = await priceRes.json()
    tonPriceUsd = priceData?.['the-open-network']?.usd ?? 0
  } catch {
    console.warn('[Blockchain][TON] CoinGecko price fetch failed, falling back to 0')
  }

  if (!tonPriceUsd) {
    return { found: false, error: 'Could not fetch TON/USD price from CoinGecko' }
  }

  const expectedTon = expectedUsd / tonPriceUsd
  console.log(`[Blockchain][TON] Expected ${expectedTon.toFixed(4)} TON (@ $${tonPriceUsd}/TON)`)

  // ── Step 2: Fetch recent transactions ────────────────────────────────────
  const apiKey = process.env.TON_CENTER_API_KEY ?? '' // optional: add key for higher rate limits
  const url = new URL('https://toncenter.com/api/v2/getTransactions')
  url.searchParams.set('address', address)
  url.searchParams.set('limit', '20')
  url.searchParams.set('archival', 'false')
  if (apiKey) url.searchParams.set('api_key', apiKey)

  console.log(`[Blockchain][TON] Polling: ${url.toString()}`)

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`TON Center API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  if (!data.ok) {
    throw new Error(`TON Center API returned ok=false: ${JSON.stringify(data)}`)
  }

  const txs: TonTransaction[] = data?.result ?? []
  console.log(`[Blockchain][TON] Got ${txs.length} recent transactions`)

  for (const tx of txs) {
    const txTimeSec = tx.utime

    if (txTimeSec < sinceTs - 120) continue
    if (Date.now() / 1000 - txTimeSec > LOOKBACK_WINDOW_SECONDS) continue

    // Only look at incoming messages (in_msg)
    const inMsg = tx.in_msg
    if (!inMsg || !inMsg.value) continue

    // TON uses nanotons (1 TON = 1e9 nanotons)
    const amountReceived = Number(inMsg.value) / 1_000_000_000
    const memo = inMsg.message ?? ''

    console.log(
      `[Blockchain][TON] tx ${tx.transaction_id}: amount=${amountReceived} TON, memo="${memo}"`
    )

    // Match by amount OR by memo containing the payment reference
    const memoMatch   = paymentRef && memo.toLowerCase().includes(paymentRef.toLowerCase())
    const amountMatch = isAmountMatch(amountReceived, expectedTon)

    if (memoMatch || amountMatch) {
      return {
        found: true,
        transaction: {
          txHash: tx.transaction_id,
          amount: amountReceived,
          timestamp: txTimeSec,
          from: inMsg.source ?? 'unknown',
          memo,
          coin: 'ton',
        },
      }
    }
  }

  return { found: false }
}

interface TonTransaction {
  transaction_id: string
  utime: number
  in_msg: {
    source?: string
    value?: string
    message?: string
  } | null
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Returns true if `received` is within AMOUNT_TOLERANCE_PERCENT of `expected`.
 * This handles minor rounding differences from exchange fee deductions.
 */
function isAmountMatch(received: number, expected: number): boolean {
  if (expected <= 0) return false
  const diff = Math.abs(received - expected) / expected
  return diff <= AMOUNT_TOLERANCE_PERCENT / 100
}
