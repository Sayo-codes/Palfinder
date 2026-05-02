'use client'

import { useAdminStore } from '@/lib/store'
import { CreditCard, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react'

const STATUS_META = {
  paid:    { label: 'Paid',    color: '#00FF7F', icon: <CheckCircle size={13} />, bg: 'rgba(0,255,127,0.12)' },
  pending: { label: 'Pending', color: '#FFD600', icon: <Clock size={13} />,       bg: 'rgba(255,214,0,0.12)' },
  failed:  { label: 'Failed',  color: '#FF6464', icon: <XCircle size={13} />,     bg: 'rgba(255,100,100,0.12)' },
}

export default function Payments() {
  const { payments, members } = useAdminStore()

  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const failed = payments.filter((p) => p.status === 'failed').length

  const getMemberEmail = (id: string) => members.find((m) => m.id === id)?.email ?? id

  return (
    <div className="space-y-5 animate-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: '#00FF7F', icon: <DollarSign size={16} /> },
          { label: 'Pending',       value: `$${pending.toFixed(2)}`,      color: '#FFD600', icon: <Clock size={16} /> },
          { label: 'Failed',        value: `${failed} txns`,             color: '#FF6464', icon: <XCircle size={16} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-1.5 mb-2" style={{ color }}>
              {icon}
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Transactions table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <CreditCard size={15} style={{ color: '#00D4FF' }} />
          <span className="font-semibold text-white text-sm">Transactions</span>
          <span className="ml-auto text-xs text-white/30">{payments.length} total</span>
        </div>

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                {['ID', 'Member', 'Plan', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const meta = STATUS_META[p.status]
                return (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-3 text-white/70">{getMemberEmail(p.memberId)}</td>
                    <td className="px-4 py-3 text-white/60">{p.plan}</td>
                    <td className="px-4 py-3 font-semibold text-white">${p.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="badge" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}>
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{p.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-white/5">
          {payments.map((p) => {
            const meta = STATUS_META[p.status]
            return (
              <div key={p.id} className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm">${p.amount.toFixed(2)}</div>
                  <div className="text-xs text-white/40 truncate mt-0.5">{getMemberEmail(p.memberId)}</div>
                  <div className="text-xs text-white/30 mt-0.5">{p.plan} · {p.date}</div>
                </div>
                <span className="badge flex-shrink-0" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}30` }}>
                  {meta.icon} {meta.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
