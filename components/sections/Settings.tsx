'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Save, Bell, Shield, Globe, Palette, User } from 'lucide-react'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`toggle-track flex-shrink-0 ${on ? 'on' : ''}`}>
      <div className="toggle-thumb" />
    </button>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-border flex items-center gap-2.5">
        <span style={{ color: '#FF1B8D' }}>{icon}</span>
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      </div>
      <div className="px-4 sm:px-5 py-4 space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground/80">{label}</div>
        {desc && <div className="text-xs text-foreground/35 mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const [siteName, setSiteName] = useState('PalFinder')
  const [siteUrl, setSiteUrl]   = useState('https://palfinder.com')
  const [email, setEmail]       = useState('admin@palfinder.com')
  const [notifNew, setNotifNew] = useState(true)
  const [notifPay, setNotifPay] = useState(true)
  const [notifMsg, setNotifMsg] = useState(false)
  const [moderation, setModeration] = useState(true)
  const [ageGate, setAgeGate]       = useState(true)
  const [maintenance, setMaintenance] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4 animate-in max-w-2xl">
      {/* Site settings */}
      <SectionCard title="Site Settings" icon={<Globe size={16} />}>
        <div>
          <label className="block text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-1.5">Site Name</label>
          <input className="input-base" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-1.5">Site URL</label>
          <input className="input-base" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
        </div>
        <SettingRow label="Maintenance Mode" desc="Temporarily take the site offline for visitors">
          <Toggle on={maintenance} onToggle={() => setMaintenance((v) => !v)} />
        </SettingRow>
      </SectionCard>

      {/* Admin account */}
      <SectionCard title="Admin Account" icon={<User size={16} />}>
        <div>
          <label className="block text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-1.5">Admin Email</label>
          <input className="input-base" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-1.5">New Password</label>
          <input className="input-base" type="password" placeholder="Leave blank to keep current" />
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" icon={<Bell size={16} />}>
        <SettingRow label="New profile added" desc="Alert when a new model profile is created">
          <Toggle on={notifNew} onToggle={() => setNotifNew((v) => !v)} />
        </SettingRow>
        <SettingRow label="Payment received" desc="Alert on successful payments">
          <Toggle on={notifPay} onToggle={() => setNotifPay((v) => !v)} />
        </SettingRow>
        <SettingRow label="New member message" desc="Alert on new support messages">
          <Toggle on={notifMsg} onToggle={() => setNotifMsg((v) => !v)} />
        </SettingRow>
      </SectionCard>

      {/* Moderation */}
      <SectionCard title="Moderation & Safety" icon={<Shield size={16} />}>
        <SettingRow label="Auto-moderation" desc="Flag potentially violating content automatically">
          <Toggle on={moderation} onToggle={() => setModeration((v) => !v)} />
        </SettingRow>
        <SettingRow label="Age verification gate" desc="Require visitors to confirm 18+ before entering">
          <Toggle on={ageGate} onToggle={() => setAgeGate((v) => !v)} />
        </SettingRow>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Appearance" icon={<Palette size={16} />}>
        <div className="flex gap-3 flex-wrap">
          {['#FF1B8D', '#B026FF', '#00D4FF', '#00FF7F', '#FFD600'].map((c) => (
            <button key={c} className="w-9 h-9 rounded-xl transition hover:scale-110 ring-offset-2 ring-offset-background"
              style={{ background: c, boxShadow: `0 0 0 2px ${c}` }} />
          ))}
        </div>
        <p className="text-xs text-foreground/30">Choose primary accent colour for the admin panel</p>
      </SectionCard>

      {/* Save button */}
      <button onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition hover:scale-105 active:scale-95"
        style={{
          background: saved ? 'rgba(0,255,127,0.2)' : 'linear-gradient(135deg,#FF1B8D,#B026FF)',
          boxShadow: saved ? '0 0 20px rgba(0,255,127,0.3)' : '0 0 24px rgba(255,27,141,0.4)',
          color: saved ? '#00FF7F' : '#fff',
          border: saved ? '1px solid rgba(0,255,127,0.4)' : 'none',
        }}
      >
        <Save size={15} />
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
