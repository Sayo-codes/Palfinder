'use client'

import { useState } from 'react'
import { useAdminStore } from '@/lib/store'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'
import { deleteProfileDb } from '@/lib/actions'

export default function DeleteModal() {
  const { deletingProfileId, closeDeleteConfirm, deleteProfile, profiles } = useAdminStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!deletingProfileId) return null

  const profile = profiles.find((p) => p.id === deletingProfileId)

  const handleConfirm = async () => {
    if (!deletingProfileId) return
    setLoading(true)
    setError('')
    try {
      const res = await deleteProfileDb(deletingProfileId)
      if (res.success) {
        deleteProfile(deletingProfileId)
        closeDeleteConfirm()
      } else {
        setError(res.error || 'Failed to delete profile')
      }
    } catch (e: any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={closeDeleteConfirm}>
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden animate-in"
        style={{ background: '#0f0f1a', border: '1px solid rgba(255,100,100,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,100,100,0.15)', border: '1px solid rgba(255,100,100,0.3)' }}>
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Delete Profile</h2>
              <p className="text-xs text-white/40">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={closeDeleteConfirm} className="text-white/30 hover:text-white transition-colors" disabled={loading}>
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-5">
          <div className="rounded-xl p-4 mb-5"
            style={{ background: 'rgba(255,100,100,0.07)', border: '1px solid rgba(255,100,100,0.15)' }}>
            <p className="text-sm text-white/70 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-white">{profile?.name ?? 'this profile'}</span>?
              All links, photos, and data will be removed.
            </p>
          </div>
          {error && (
            <p className="text-red-400 text-xs mb-3 text-center">{error}</p>
          )}
          <div className="flex gap-2.5">
            <button onClick={closeDeleteConfirm} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#e53e3e,#c53030)', boxShadow: '0 0 20px rgba(229,62,62,0.35)' }}>
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 size={14} /> Delete Profile</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
