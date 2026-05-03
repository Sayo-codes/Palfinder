'use client'

import { useAdminStore } from '@/lib/store'
import { UserCheck, Crown, Star, Mail, Calendar } from 'lucide-react'

const PLAN_META = {
  free:    { label: 'Free',    color: '#aaa',    bg: 'rgba(200,200,200,0.1)' },
  premium: { label: 'Premium', color: '#FFD600', bg: 'rgba(255,214,0,0.12)' },
  vip:     { label: 'VIP',     color: '#FF1B8D', bg: 'rgba(255,27,141,0.12)' },
}

const PLAN_ICON = { free: <Star size={12} />, premium: <Crown size={12} />, vip: <Crown size={12} /> }

export default function Members() {
  const { members } = useAdminStore()

  const free = members.filter((m) => m.plan === 'free').length
  const premium = members.filter((m) => m.plan === 'premium').length
  const vip = members.filter((m) => m.plan === 'vip').length

  return (
    <div className="space-y-5 animate-in">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Free',    count: free,    color: '#aaa',    icon: <Star size={16} /> },
          { label: 'Premium', count: premium, color: '#FFD600', icon: <Crown size={16} /> },
          { label: 'VIP',     count: vip,     color: '#FF1B8D', icon: <Crown size={16} /> },
        ].map(({ label, count, color, icon }) => (
          <div key={label} className="card p-4 text-center">
            <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
            <div className="text-xl font-extrabold text-white">{count}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <UserCheck size={15} style={{ color: '#B026FF' }} />
          <span className="font-semibold text-white text-sm">All Members</span>
          <span className="ml-auto text-xs text-white/30">{members.length} total</span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/5">
                {['Member', 'Plan', 'Joined', 'Last Seen'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const meta = PLAN_META[m.plan]
                return (
                  <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)' }}>
                          {m.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{m.email}</div>
                          <div className="text-xs text-white/30">{m.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}>
                        {PLAN_ICON[m.plan]} {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/50">{m.joinedAt}</td>
                    <td className="px-4 py-3 text-sm text-white/50">{m.lastSeen}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-white/5">
          {members.map((m) => {
            const meta = PLAN_META[m.plan]
            return (
              <div key={m.id} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)' }}>
                  {m.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white truncate">{m.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge text-[10px]" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-white/30 flex items-center gap-1">
                      <Calendar size={10} /> {m.joinedAt}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-white/30 flex-shrink-0 flex items-center gap-1">
                  <Mail size={10} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
