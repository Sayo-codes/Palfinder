'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdminStore } from '@/lib/store'
import { Profile, Platform, Gender, InterestedIn } from '@/lib/types'
import { COUNTRIES } from '@/lib/fakeData'
import { X, Upload, ChevronDown } from 'lucide-react'
import SnapchatIcon from './icons/SnapchatIcon'
import TelegramIcon from './icons/TelegramIcon'
import WhatsAppIcon from './icons/WhatsAppIcon'
import OnlyFansIcon from './icons/OnlyFansIcon'

const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode; color: string; placeholder: string }[] = [
  { id: 'snapchat', label: 'Snapchat', icon: <SnapchatIcon size={14} />, color: '#FFD600', placeholder: 'https://snapchat.com/add/username' },
  { id: 'telegram', label: 'Telegram', icon: <TelegramIcon size={14} />, color: '#00A8FF', placeholder: 'https://t.me/username' },
  { id: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon size={14} />, color: '#00FF7F', placeholder: 'https://wa.me/1234567890' },
  { id: 'onlyfans', label: 'OnlyFans', icon: <OnlyFansIcon size={14} />, color: '#00D4FF', placeholder: 'https://onlyfans.com/username' },
]

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-white/70">{label}</span>
      <button onClick={onToggle} className={`toggle-track ${on ? 'on' : ''}`}>
        <div className="toggle-thumb" />
      </button>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const BLANK: Omit<Profile, 'id' | 'createdAt'> = {
  name: '', username: '', age: 18, country: 'United States',
  gender: 'Female', interestedIn: 'Men', bio: '',
  platforms: [], links: {}, photo: '', media: [],
  online: false, verified: false, active: true,
}

export default function ProfileModal() {
  const { showProfileModal, editingProfile, closeProfileModal, addProfile, updateProfile } = useAdminStore()
  const [form, setForm] = useState<Omit<Profile, 'id' | 'createdAt'>>(BLANK)
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryList, setShowCountryList] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editingProfile) {
      const { id, createdAt, ...rest } = editingProfile
      setForm(rest)
      setPhotoPreview(editingProfile.photo)
    } else {
      setForm(BLANK)
      setPhotoPreview('')
    }
    setCountrySearch('')
  }, [editingProfile, showProfileModal])

  if (!showProfileModal) return null

  const set = (key: keyof typeof form, val: unknown) => setForm((f) => ({ ...f, [key]: val }))

  const togglePlatform = (p: Platform) => {
    const has = form.platforms.includes(p)
    const next = has ? form.platforms.filter((x) => x !== p) : [...form.platforms, p]
    set('platforms', next)
  }

  const setLink = (p: Platform, val: string) => set('links', { ...form.links, [p]: val })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
    set('photo', url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
    set('photo', url)
  }

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingProfile) {
      updateProfile(editingProfile.id, form)
    } else {
      addProfile({
        ...form,
        id: `p${Date.now()}`,
        createdAt: new Date().toISOString(),
      })
    }
    closeProfileModal()
  }

  return (
    <div className="modal-backdrop items-start sm:items-center" onClick={closeProfileModal}>
      <div
        className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl overflow-hidden animate-in"
        style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="font-bold text-white text-base">
              {editingProfile ? 'Edit Profile' : 'Create Profile'}
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              {editingProfile ? `Editing @${editingProfile.username}` : 'Add a new model profile'}
            </p>
          </div>
          <button onClick={closeProfileModal} className="text-white/30 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Photo upload */}
          <Field label="Profile Photo">
            <div
              className="relative h-36 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed border-white/10 hover:border-pink-500/40 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload size={24} className="mx-auto text-white/20 mb-2" />
                  <p className="text-xs text-white/30">Drag & drop or tap to upload</p>
                </div>
              )}
              {photoPreview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload size={20} className="text-white" />
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </Field>

          {/* Name & Username */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name">
              <input className="input-base" placeholder="Lana Rose" value={form.name}
                onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Username">
              <input className="input-base" placeholder="lana_rose" value={form.username}
                onChange={(e) => set('username', e.target.value)} />
            </Field>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age">
              <input type="number" min={18} max={60} className="input-base" value={form.age}
                onChange={(e) => set('age', Number(e.target.value))} />
            </Field>
            <Field label="Gender">
              <div className="relative">
                <select className="input-base appearance-none pr-8" value={form.gender}
                  onChange={(e) => set('gender', e.target.value as Gender)}>
                  {['Female','Male','Non-binary','Couple','Trans'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
            </Field>
          </div>

          {/* Country searchable */}
          <Field label="Country">
            <div className="relative" ref={countryRef}>
              <input
                className="input-base"
                placeholder="Search country…"
                value={showCountryList ? countrySearch : form.country}
                onFocus={() => { setShowCountryList(true); setCountrySearch('') }}
                onChange={(e) => setCountrySearch(e.target.value)}
                onBlur={() => setTimeout(() => setShowCountryList(false), 150)}
              />
              {showCountryList && filteredCountries.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-44 overflow-y-auto rounded-xl py-1"
                  style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.7)' }}>
                  {filteredCountries.map((c) => (
                    <button key={c} onMouseDown={() => { set('country', c); setShowCountryList(false) }}
                      className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition">
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {/* Interested in */}
          <Field label="Interested In">
            <div className="flex flex-wrap gap-2">
              {(['Men','Women','Everyone','Couples'] as InterestedIn[]).map((opt) => (
                <button key={opt} onClick={() => set('interestedIn', opt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  style={form.interestedIn === opt
                    ? { background: 'rgba(255,27,141,0.2)', color: '#FF1B8D', border: '1px solid rgba(255,27,141,0.4)' }
                    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {opt}
                </button>
              ))}
            </div>
          </Field>

          {/* Bio */}
          <Field label="Bio">
            <textarea rows={3} className="input-base resize-none" placeholder="Short bio…"
              value={form.bio} onChange={(e) => set('bio', e.target.value)} />
          </Field>

          {/* Platforms & Links */}
          <Field label="Platforms & Links">
            <div className="space-y-2">
              {PLATFORMS.map(({ id, label, icon, color, placeholder }) => (
                <div key={id}>
                  <button onClick={() => togglePlatform(id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition"
                    style={form.platforms.includes(id)
                      ? { background: `${color}18`, color, border: `1px solid ${color}40` }
                      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span>{icon}</span> {label}
                    <span className="ml-auto text-xs opacity-60">
                      {form.platforms.includes(id) ? '✓ Active' : 'Add'}
                    </span>
                  </button>
                  {form.platforms.includes(id) && (
                    <input className="input-base mt-1.5 text-xs" placeholder={placeholder}
                      value={(form.links as Record<string, string>)[id] ?? ''}
                      onChange={(e) => setLink(id, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </Field>

          {/* Toggles */}
          <Field label="Settings">
            <div className="rounded-xl divide-y divide-white/5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-3"><Toggle label="Show as Online" on={form.online} onToggle={() => set('online', !form.online)} /></div>
              <div className="px-3"><Toggle label="Verified Badge" on={form.verified} onToggle={() => set('verified', !form.verified)} /></div>
              <div className="px-3"><Toggle label="Profile Active" on={form.active} onToggle={() => set('active', !form.active)} /></div>
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5 flex gap-2.5 flex-shrink-0">
          <button onClick={closeProfileModal}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)', boxShadow: '0 0 24px rgba(255,27,141,0.4)' }}>
            {editingProfile ? 'Save Changes' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
