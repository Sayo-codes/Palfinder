'use client'

import { useAdminStore } from '@/lib/store'
import {
  Users, TrendingUp,
  UserCheck, CreditCard, BadgeCheck, Activity,
} from 'lucide-react'
import SnapchatIcon from '../icons/SnapchatIcon'
import TelegramIcon from '../icons/TelegramIcon'
import WhatsAppIcon from '../icons/WhatsAppIcon'
import OnlyFansIcon from '../icons/OnlyFansIcon'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
  sub?: string
}

function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  return (
    <div className="stat-card" style={{ background: 'var(--surface)' }}>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${color}18`, color }}>
            {icon}
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white">{value}</div>
        {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
      </div>
    </div>
  )
}

interface RecentRowProps {
  photo: string
  name: string
  username: string
  platforms: string[]
  createdAt: string
}

function RecentRow({ photo, name, username, platforms, createdAt }: RecentRowProps) {
  const date = new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo} alt={name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-white truncate">{name}</div>
        <div className="text-xs text-white/40">@{username} · {platforms.join(', ')}</div>
      </div>
      <span className="text-xs text-white/30 flex-shrink-0">{date}</span>
    </div>
  )
}

export default function Overview() {
  const { profiles, members, payments } = useAdminStore()

  const total = profiles.length
  const snapCount = profiles.filter((p) => p.platforms.includes('snapchat')).length
  const tgCount   = profiles.filter((p) => p.platforms.includes('telegram')).length
  const waCount   = profiles.filter((p) => p.platforms.includes('whatsapp')).length
  const ofCount   = profiles.filter((p) => p.platforms.includes('onlyfans')).length
  const verified  = profiles.filter((p) => p.verified).length
  const online    = profiles.filter((p) => p.online).length
  const revenue   = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  const recent = [...profiles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Good morning, <span className="text-gradient">Admin</span> 👋
        </h2>
        <p className="text-sm text-white/40 mt-1">Here&apos;s what&apos;s happening with PalFinder today.</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Profiles" value={total} icon={<Users size={18} />} color="#FF1B8D" sub={`${online} online now`} />
        <StatCard label="Members" value={members.length} icon={<UserCheck size={18} />} color="#B026FF" sub="registered users" />
        <StatCard label="Revenue" value={`$${revenue.toFixed(2)}`} icon={<CreditCard size={18} />} color="#00D4FF" sub="this month" />
        <StatCard label="Verified" value={verified} icon={<BadgeCheck size={18} />} color="#00FF7F" sub="verified profiles" />
      </div>

      {/* Platform breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Platform Breakdown</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Snapchat', count: snapCount, icon: <SnapchatIcon size={16} />, color: '#FFD600' },
            { label: 'Telegram', count: tgCount,   icon: <TelegramIcon size={16} />,  color: '#00A8FF' },
            { label: 'WhatsApp', count: waCount,   icon: <WhatsAppIcon size={16} />, color: '#00FF7F' },
            { label: 'OnlyFans', count: ofCount,   icon: <OnlyFansIcon size={16} />,   color: '#00D4FF' },
          ].map(({ label, count, icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, color }}>
                {icon}
              </div>
              <div>
                <div className="text-lg font-bold text-white">{count}</div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity indicator */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} style={{ color: '#FF1B8D' }} />
            <h3 className="font-semibold text-white text-sm">Platform Activity</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Snapchat', count: snapCount, total, color: '#FFD600' },
              { label: 'Telegram', count: tgCount,   total, color: '#00A8FF' },
              { label: 'WhatsApp', count: waCount,   total, color: '#00FF7F' },
              { label: 'OnlyFans', count: ofCount,   total, color: '#00D4FF' },
            ].map(({ label, count, color }) => {
              const pct = total ? Math.round((count / total) * 100) : 0
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{label}</span>
                    <span style={{ color }}>{count} profiles</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
            <TrendingUp size={12} style={{ color: '#00FF7F' }} />
            <span style={{ color: '#00FF7F' }}>+12%</span> growth this month
          </div>
        </div>

        {/* Recent additions */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} style={{ color: '#B026FF' }} />
            <h3 className="font-semibold text-white text-sm">Recent Additions</h3>
          </div>
          <div>
            {recent.map((p) => (
              <RecentRow key={p.id} photo={p.photo} name={p.name}
                username={p.username} platforms={p.platforms} createdAt={p.createdAt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
