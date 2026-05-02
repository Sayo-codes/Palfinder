'use client'

import { useAdminStore } from '@/lib/store'
import { useState } from 'react'
import { Shield, BadgeCheck, Clock, CheckCircle, XCircle } from 'lucide-react'

type Status = 'pending' | 'approved' | 'rejected'

interface VerificationEntry {
  profileId: string
  submittedAt: string
  status: Status
}

const STATUS_META: Record<Status, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: 'Pending',  color: '#FFD600', bg: 'rgba(255,214,0,0.12)',    icon: <Clock size={12} /> },
  approved: { label: 'Approved', color: '#00FF7F', bg: 'rgba(0,255,127,0.12)',    icon: <CheckCircle size={12} /> },
  rejected: { label: 'Rejected', color: '#FF6464', bg: 'rgba(255,100,100,0.12)', icon: <XCircle size={12} /> },
}

export default function Verification() {
  const { profiles } = useAdminStore()

  const [entries, setEntries] = useState<VerificationEntry[]>(
    profiles.slice(0, 8).map((p, i) => ({
      profileId: p.id,
      submittedAt: `2026-04-${20 + i}`,
      status: i < 2 ? 'pending' : i < 5 ? 'approved' : 'rejected',
    }))
  )

  const setStatus = (profileId: string, status: Status) =>
    setEntries((prev) => prev.map((e) => e.profileId === profileId ? { ...e, status } : e))

  const pending  = entries.filter((e) => e.status === 'pending').length
  const approved = entries.filter((e) => e.status === 'approved').length
  const rejected = entries.filter((e) => e.status === 'rejected').length

  return (
    <div className="space-y-5 animate-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending',  count: pending,  color: '#FFD600', icon: <Clock size={16} /> },
          { label: 'Approved', count: approved, color: '#00FF7F', icon: <CheckCircle size={16} /> },
          { label: 'Rejected', count: rejected, color: '#FF6464', icon: <XCircle size={16} /> },
        ].map(({ label, count, color, icon }) => (
          <div key={label} className="card p-4 text-center">
            <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
            <div className="text-xl font-extrabold text-white">{count}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <Shield size={15} style={{ color: '#00A8FF' }} />
          <span className="font-semibold text-white text-sm">Verification Requests</span>
        </div>
        <div className="divide-y divide-white/5">
          {entries.map((entry) => {
            const profile = profiles.find((p) => p.id === entry.profileId)
            if (!profile) return null
            const meta = STATUS_META[entry.status]
            return (
              <div key={entry.profileId} className="p-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.photo} alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{profile.name}</span>
                    {profile.verified && <BadgeCheck size={13} style={{ color: '#00A8FF' }} />}
                  </div>
                  <div className="text-xs text-white/40">@{profile.username} · Submitted {entry.submittedAt}</div>
                </div>
                {/* Status badge */}
                <span className="badge flex-shrink-0 hidden sm:inline-flex"
                  style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}>
                  {meta.icon} {meta.label}
                </span>
                {/* Actions */}
                {entry.status === 'pending' && (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => setStatus(entry.profileId, 'approved')}
                      className="p-1.5 rounded-lg transition hover:scale-110"
                      style={{ background: 'rgba(0,255,127,0.15)', color: '#00FF7F' }}>
                      <CheckCircle size={15} />
                    </button>
                    <button onClick={() => setStatus(entry.profileId, 'rejected')}
                      className="p-1.5 rounded-lg transition hover:scale-110"
                      style={{ background: 'rgba(255,100,100,0.15)', color: '#FF6464' }}>
                      <XCircle size={15} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
