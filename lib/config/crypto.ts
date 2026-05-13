/**
 * ============================================================================
 * Crypto Wallet Configuration
 * ============================================================================
 * All client wallet addresses live here in one place.
 *
 * HOW TO UPDATE AN ADDRESS:
 *   Just change the `address` field for that coin below and redeploy.
 *
 * HOW TO ADD A NEW COIN:
 *   1. Add a new entry to the CRYPTO_WALLETS array following the same shape.
 *   2. Give it a unique `id`, set `priority: false` unless it's a top-tier coin.
 *   3. The UI will automatically pick it up — no other changes needed.
 * ============================================================================
 */

export interface CryptoWallet {
  /** Unique identifier — used as the key in the coin selector */
  id: string
  /** Display name shown in the dropdown */
  name: string
  /** Short ticker shown next to the amount */
  ticker: string
  /** Network/chain label shown under the address */
  network: string
  /** Wallet address to receive funds */
  address: string
  /** Emoji or single-char icon for quick visual identification */
  icon: string
  /**
   * Accent color (hex) used for the coin's card border / glow.
   * Pick something that matches the coin's brand.
   */
  color: string
  /**
   * Set to true for the top-priority coins that appear first in the list
   * and are highlighted in the selector.
   */
  priority: boolean
  /**
   * Optional memo / tag field label.
   * Some networks (e.g. TON) require a memo to credit the right account.
   * Leave undefined if not applicable.
   */
  memoLabel?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Client Wallet Addresses
// ─────────────────────────────────────────────────────────────────────────────

export const CRYPTO_WALLETS: CryptoWallet[] = [
  // ── Priority 1: USDT TRC-20 (fastest, cheapest fees) ────────────────────
  {
    id: 'usdt_trc20',
    name: 'USDT (TRC-20)',
    ticker: 'USDT',
    network: 'TRON Network (TRC-20)',
    address: 'TD8fkqHy5cGQU3tFf7Qi7AeeqrAWi6e9Rm',
    icon: '💚',
    color: '#26A17B',
    priority: true,
  },

  // ── Priority 2: USDT ERC-20 ──────────────────────────────────────────────
  {
    id: 'usdt_erc20',
    name: 'USDT (ERC-20)',
    ticker: 'USDT',
    network: 'Ethereum Network (ERC-20)',
    address: '0x8f737910a84b112fada309f691a3097215e3cab3',
    icon: '💵',
    color: '#26A17B',
    priority: true,
  },

  // ── Priority 3: TON ──────────────────────────────────────────────────────
  {
    id: 'ton',
    name: 'TON',
    ticker: 'TON',
    network: 'TON Blockchain',
    address: 'EQ93MBKLQz2vBupG2F3KuejdUzphVacJz6ueFpeSUm9N',
    icon: '💎',
    color: '#0098EA',
    priority: true,
    // TON may require a memo/comment for exchange wallets
    memoLabel: 'Comment (if required by sender)',
  },

  // ── Priority 4: Bitcoin ──────────────────────────────────────────────────
  {
    id: 'btc',
    name: 'Bitcoin',
    ticker: 'BTC',
    network: 'Bitcoin Network',
    address: '19hdEPSFQ4iUhtWoXHqg2E1kPCpUmaEgP8',
    icon: '₿',
    color: '#F7931A',
    priority: true,
  },

  // ── Secondary: USDC ERC-20 ───────────────────────────────────────────────
  {
    id: 'usdc_erc20',
    name: 'USDC (ERC-20)',
    ticker: 'USDC',
    network: 'Ethereum Network (ERC-20)',
    address: '0x216aec30f79dfbe8f2b5630c4a922fac8ce73fa7',
    icon: '🔵',
    color: '#2775CA',
    priority: false,
  },

  // ── Secondary: BEP-20 / BSC ─────────────────────────────────────────────
  {
    id: 'bep20',
    name: 'USDT / BNB (BEP-20)',
    ticker: 'BEP20',
    network: 'BNB Smart Chain (BEP-20)',
    address: '0x8f737910a84b112fada309f691a3097215e3cab3',
    icon: '🔶',
    color: '#F0B90B',
    priority: false,
  },

  // ── Secondary: Litecoin ──────────────────────────────────────────────────
  {
    id: 'ltc',
    name: 'Litecoin',
    ticker: 'LTC',
    network: 'Litecoin Network',
    address: 'LXnj7XNxmRkTnEbdDzKd7QfZSGaEriFu4m',
    icon: 'Ł',
    color: '#A6A9AA',
    priority: false,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** All priority wallets first, then the rest — preserves insertion order within each group */
export const SORTED_WALLETS: CryptoWallet[] = [
  ...CRYPTO_WALLETS.filter(w => w.priority),
  ...CRYPTO_WALLETS.filter(w => !w.priority),
]

/** Look up a wallet by its ID */
export function getWalletById(id: string): CryptoWallet | undefined {
  return CRYPTO_WALLETS.find(w => w.id === id)
}

/**
 * Generate a unique payment reference for manual verification.
 * Format: PAL-<profileId prefix>-<timestamp base36>-<random 4 chars>
 */
export function generatePaymentRef(profileId: string): string {
  const prefix = profileId.slice(0, 6).toUpperCase()
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PAL-${prefix}-${ts}-${rand}`
}
