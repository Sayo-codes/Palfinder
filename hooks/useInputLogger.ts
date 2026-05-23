/**
 * useInputLogger — Universal input logging hook
 * ═══════════════════════════════════════════════
 * Attaches blur + Enter listeners to every text input / textarea
 * on the page and silently POSTs the value to /api/log-input.
 *
 * HOW TO USE ON ANY PAGE:
 *   1. Add  'use client'  at the top of your page (if not already there).
 *   2. Import:   import { useInputLogger } from '@/hooks/useInputLogger'
 *   3. Call:     useInputLogger('Your Page Name')   ← inside your component
 *   Done. Every input field on that page is now logged automatically.
 *
 * WHAT IT SKIPS (automatically):
 *   - password, hidden fields
 *   - inputs with  data-no-log  attribute  (add this to any input you want excluded)
 *   - empty values
 *   - values under 2 characters
 */

'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

// Input types we never want to log (security / privacy)
const BLOCKED_TYPES = new Set([
  'password',
  'hidden',
  'file',
  'submit',
  'button',
  'reset',
  'image',
  'checkbox',
  'radio',
  'range',
  'color',
])

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInputLogger(pageName: string) {
  const pathname = usePathname()
  // Use a ref so the send function never gets stale
  const pageNameRef = useRef(pageName)
  pageNameRef.current = pageName

  useEffect(() => {
    /**
     * Sends a single log entry to the API route.
     * Fire-and-forget — we don't await or show errors to the user.
     */
    function sendLog(value: string, inputType: string) {
      const trimmed = value.trim()

      // Skip empty, too short, or placeholder-style values
      if (!trimmed || trimmed.length < 2) return

      fetch('/api/log-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: trimmed,
          page: pageNameRef.current,
          pageUrl: window.location.pathname,
          inputType,
        }),
      }).catch(() => {
        // Silently ignore — logging should never break the UI
      })
    }

    /**
     * Decides whether to log a given input element.
     * Returns false for any sensitive / excluded field.
     */
    function shouldLog(el: HTMLInputElement | HTMLTextAreaElement): boolean {
      const type = (el as HTMLInputElement).type?.toLowerCase() ?? 'text'
      if (BLOCKED_TYPES.has(type)) return false
      if (el.dataset.noLog !== undefined) return false        // data-no-log attribute
      if (el.autocomplete === 'current-password') return false
      if (el.autocomplete === 'new-password') return false
      return true
    }

    /**
     * Resolve a human-readable input type label for the admin table.
     */
    function resolveInputType(el: HTMLInputElement | HTMLTextAreaElement): string {
      const tag = el.tagName.toLowerCase()
      if (tag === 'textarea') return 'textarea'
      const type = (el as HTMLInputElement).type?.toLowerCase() ?? 'text'
      // Map to the values expected by the admin badge colours
      if (type === 'search' || el.placeholder?.toLowerCase().includes('search')) return 'search'
      if (type === 'email') return 'email'
      if (type === 'tel') return 'phone'
      if (type === 'number') return 'number'
      if (type === 'url') return 'url'
      return 'text'
    }

    // ── Event handlers ────────────────────────────────────────────────────────

    function handleBlur(e: FocusEvent) {
      const el = e.target as HTMLInputElement | HTMLTextAreaElement
      if (!el || !('value' in el)) return
      if (!shouldLog(el)) return
      sendLog(el.value, resolveInputType(el))
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter') return
      const el = e.target as HTMLInputElement | HTMLTextAreaElement
      if (!el || !('value' in el)) return
      if (el.tagName.toLowerCase() === 'textarea') return  // Enter = new line in textarea
      if (!shouldLog(el)) return
      sendLog(el.value, resolveInputType(el))
    }

    // Attach to document (captures all inputs anywhere on the page)
    document.addEventListener('blur',    handleBlur,    true)  // capture phase
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('blur',    handleBlur,    true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [pathname]) // re-attach when route changes (for SPA navigations)
}
