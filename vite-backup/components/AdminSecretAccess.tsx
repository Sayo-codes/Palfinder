import React, { useState, useEffect, useRef } from 'react'
import { ShieldCheckIcon } from 'lucide-react'

const ADMIN_PASSWORD = '1234555'
const STORAGE_KEY = 'pf_admin_access'
const ADMIN_URL = '/admin' // Admin panel path via Vercel rewrite

interface AdminSecretAccessProps {
  children: React.ReactNode
}

export function AdminSecretAccess({ children }: AdminSecretAccessProps) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [clickCount, setClickCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if already authenticated
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      // Already verified — clicking footer will go straight to admin
    }
  }, [])

  const handleTriggerClick = () => {
    const alreadyVerified = localStorage.getItem(STORAGE_KEY) === 'true'
    if (alreadyVerified) {
      window.location.href = ADMIN_URL
      return
    }
    setOpen(true)
    setPassword('')
    setStatus('idle')
  }

  const handleClose = () => {
    setOpen(false)
    setPassword('')
    setStatus('idle')
  }

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setStatus('success')
      localStorage.setItem(STORAGE_KEY, 'true')
      setTimeout(() => {
        window.location.href = ADMIN_URL
      }, 1000)
    } else {
      setStatus('error')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUnlock()
    if (e.key === 'Escape') handleClose()
  }

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  return (
    <>
      {/* Trigger — wraps the copyright text */}
      <span
        onClick={handleTriggerClick}
        className="cursor-pointer select-none hover:text-white/60 transition-colors duration-200"
        title=""
      >
        {children}
      </span>

      {/* Modal Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={handleClose}
        >
          {/* Modal Card */}
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background: 'linear-gradient(145deg, #0f0f1a, #14141f)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 60px rgba(176,38,255,0.15), 0 24px 64px rgba(0,0,0,0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex flex-col items-center gap-3 mb-1">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,27,141,0.15), rgba(176,38,255,0.15))',
                  border: '1px solid rgba(255,27,141,0.2)',
                  boxShadow: '0 0 24px rgba(176,38,255,0.2)',
                }}
              >
                <ShieldCheckIcon className="w-7 h-7 text-[#B026FF]" />
              </div>
              <div className="text-center">
                <h2 className="text-white font-bold text-lg tracking-tight">Admin Access</h2>
                <p className="text-white/40 text-sm mt-0.5">Enter your password to continue</p>
              </div>
            </div>

            {/* Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Password
              </label>
              <input
                ref={inputRef}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: status === 'error'
                    ? '1px solid rgba(255,80,80,0.5)'
                    : status === 'success'
                    ? '1px solid rgba(0,255,127,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: status === 'error'
                    ? '0 0 12px rgba(255,80,80,0.15)'
                    : undefined,
                }}
              />

              {/* Status messages */}
              {status === 'error' && (
                <p className="text-xs font-medium" style={{ color: '#ff5050' }}>
                  Incorrect password. Try again.
                </p>
              )}
              {status === 'success' && (
                <p className="text-xs font-medium" style={{ color: '#00ff7f' }}>
                  ✓ Access granted. Redirecting…
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
                disabled={status === 'success'}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #FF1B8D, #B026FF)',
                  boxShadow: '0 0 20px rgba(176,38,255,0.35)',
                }}
              >
                Unlock Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminSecretAccess
