'use client'

import { useState } from 'react'
import { Network, Copy, TrendingUp, Link, Plus, Trash2 } from 'lucide-react'

interface Affiliate {
  id: string
  name: string
  code: string
  clicks: number
  signups: number
  revenue: number
  status: 'active' | 'inactive'
}

const SEED: Affiliate[] = [
  { id: 'a1', name: 'John Doe',    code: 'JOHN20',  clicks: 1240, signups: 87,  revenue: 1305, status: 'active' },
  { id: 'a2', name: 'Sarah K.',    code: 'SARK15',  clicks: 890,  signups: 52,  revenue: 780,  status: 'active' },
  { id: 'a3', name: 'Mike T.',     code: 'MIKE10',  clicks: 430,  signups: 21,  revenue: 315,  status: 'inactive' },
  { id: 'a4', name: 'Luna Fox',    code: 'LUNA25',  clicks: 2100, signups: 134, revenue: 2010, status: 'active' },
]

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(SEED)
  const [copied, setCopied] = useState<string | null>(null)

  const totalRev = affiliates.reduce((s, a) => s + a.revenue, 0)
  const totalClicks = affiliates.reduce((s, a) => s + a.clicks, 0)
  const totalSignups = affiliates.reduce((s, a) => s + a.signups, 0)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(`https://palfinder.com?ref=${code}`)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  const remove = (id: string) => setAffiliates((a) => a.filter((x) => x.id !== id))

  const toggle = (id: string) =>
    setAffiliates((a) => a.map((x) => x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x))

  return (
    <div className="space-y-5 animate-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Revenue', value: `$${totalRev.toLocaleString()}`, color: '#00D4FF', icon: <TrendingUp size={16} /> },
          { label: 'Total Clicks',  value: totalClicks.toLocaleString(),    color: '#B026FF', icon: <Link size={16} /> },
          { label: 'Total Signups', value: totalSignups.toLocaleString(),   color: '#00FF7F', icon: <Network size={16} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-1.5 mb-2" style={{ color }}>
              {icon}<span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">{label}</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground/60 text-sm uppercase tracking-wider">Affiliate Partners</h3>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition hover:scale-105"
          style={{ background: 'rgba(255,27,141,0.15)', color: '#FF1B8D', border: '1px solid rgba(255,27,141,0.3)' }}>
          <Plus size={13} /> Add Affiliate
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {['Partner', 'Code', 'Clicks', 'Signups', 'Revenue', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-foreground/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-foreground">{a.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs text-foreground/50 font-mono">{a.code}</code>
                      <button onClick={() => copyCode(a.code)} className="text-foreground/30 hover:text-foreground transition">
                        <Copy size={11} />
                      </button>
                      {copied === a.code && <span className="text-xs text-green-400">Copied!</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground/60">{a.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground/60">{a.signups}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">${a.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(a.id)}
                      className="badge cursor-pointer"
                      style={a.status === 'active'
                        ? { background:'rgba(0,255,127,0.12)', color:'#00FF7F', border:'1px solid rgba(0,255,127,0.3)' }
                        : { background:'rgba(200,200,200,0.08)', color:'#888', border:'1px solid rgba(200,200,200,0.15)' }}>
                      {a.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(a.id)} className="text-red-400/50 hover:text-red-400 transition">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-border">
          {affiliates.map((a) => (
            <div key={a.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground text-sm">{a.name}</span>
                <span className="badge text-[10px]"
                  style={a.status === 'active'
                    ? { background:'rgba(0,255,127,0.12)', color:'#00FF7F', border:'1px solid rgba(0,255,127,0.3)' }
                    : { background:'rgba(200,200,200,0.08)', color:'#888', border:'1px solid rgba(200,200,200,0.15)' }}>
                  {a.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['Clicks',`${a.clicks}`],['Signups',`${a.signups}`],['Revenue',`$${a.revenue}`]].map(([l,v])=>(
                  <div key={l} className="rounded-lg p-2 bg-black/5 dark:bg-white/5">
                    <div className="text-sm font-bold text-foreground">{v}</div>
                    <div className="text-[10px] text-foreground/30">{l}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-xs text-foreground/40 font-mono">{a.code}</code>
                <button onClick={() => copyCode(a.code)} className="text-foreground/30 hover:text-foreground transition"><Copy size={11}/></button>
                {copied === a.code && <span className="text-xs text-green-400">Copied!</span>}
                <button onClick={() => remove(a.id)} className="ml-auto text-red-400/50 hover:text-red-400 transition"><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
