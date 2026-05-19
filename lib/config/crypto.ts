/**
 * ============================================================================
 * Crypto Wallet Configuration — Direct Wallet Payments
 * ============================================================================
 * Edit wallet addresses HERE only. The UI and blockchain monitor pick them
 * up automatically — no other files need changing.
 *
 * HOW TO ADD A NEW COIN:
 *  1. Add an entry to CRYPTO_WALLETS below (copy the shape of an existing one).
 *  2. Implement a checker in lib/blockchain.ts  → checkIncomingTransactions().
 *  3. The coin selector will appear automatically.
 * ============================================================================
 */

export interface CryptoWallet {
  /** Unique key — used throughout the app as a stable identifier */
  id: string
  /** Full display name, e.g. "Tether (USDT)" */
  name: string
  /** Short ticker shown in the UI and amount display */
  ticker: string
  /** Network label, e.g. "TRON (TRC20)" */
  network: string
  /** Destination wallet address for this coin/network */
  address: string
  /**
   * Official logo URL.
   * Prefer: https://cryptologos.cc  or  https://assets.coingecko.com
   * Use SVG when available for crispness at any size.
   */
  logo: string
  /** Hex brand color — used for glows, borders, and gradients */
  color: string
  /** Show this coin first and badge it as "Recommended" */
  priority: boolean
  /**
   * Optional memo / comment label.
   * Set this for networks that require a destination tag (e.g. TON).
   */
  memoLabel?: string
  /**
   * Blockchain explorer used to verify incoming transactions.
   * Used by the monitoring service in lib/blockchain.ts.
   */
  explorer: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Active Coins
// ─────────────────────────────────────────────────────────────────────────────

export const CRYPTO_WALLETS: CryptoWallet[] = [
  // ── 1. USDT TRC-20 (recommended — low fees, fast) ───────────────────────
  {
    id: 'usdt_trc20',
    name: 'Tether (USDT)',
    ticker: 'USDT',
    network: 'TRON (TRC20)',
    address: 'TD8fkqHy5cGQU3tFf7Qi7AeeqrAWi6e9Rm',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
    color: '#26A17B',
    priority: true,
    explorer: 'https://tronscan.org/#/address/TD8fkqHy5cGQU3tFf7Qi7AeeqrAWi6e9Rm',
  },

  // ── 2. TON ───────────────────────────────────────────────────────────────
  {
    id: 'ton',
    name: 'Toncoin',
    ticker: 'TON',
    network: 'TON Network',
    address: 'EQ93MBKLQz2vBupG2F3KuejdUzphVacJz6ueFpeSUm9N',
    logo: 'https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=040',
    color: '#0098EA',
    priority: false,
    memoLabel: 'Comment / Memo (add if sending from an exchange)',
    explorer: 'https://tonscan.org/address/EQ93MBKLQz2vBupG2F3KuejdUzphVacJz6ueFpeSUm9N',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Priority coins first, then the rest. Insertion order is preserved. */
export const SORTED_WALLETS: CryptoWallet[] = [
  ...CRYPTO_WALLETS.filter(w => w.priority),
  ...CRYPTO_WALLETS.filter(w => !w.priority),
]

/** Look up a wallet by its id — returns undefined if not found */
export function getWalletById(id: string): CryptoWallet | undefined {
  return CRYPTO_WALLETS.find(w => w.id === id)
}

/**
 * Generate a unique, human-readable payment reference.
 * Format: PAL-<PROFILE_PREFIX>-<BASE36_TIMESTAMP>-<RANDOM_4>
 * Example: PAL-CM9A1B-M5X3K9-F7Z2
 *
 * Buyers include this in the memo / note field so we can match payments.
 */
export function generatePaymentRef(profileId: string): string {
  const prefix = profileId.slice(0, 6).toUpperCase()
  const ts     = Date.now().toString(36).toUpperCase()
  const rand   = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PAL-${prefix}-${ts}-${rand}`
}
