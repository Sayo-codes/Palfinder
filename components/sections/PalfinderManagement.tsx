'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Upload, GripVertical, Play, ImageIcon, Heart, Loader2, AlertCircle } from 'lucide-react'
import {
  getPalfinderProfiles,
  createPalfinderProfile,
  updatePalfinderProfile,
  deletePalfinderProfile,
  uploadImage,
} from '@/lib/actions'

/* ── Types ───────────────────────────────────────────────── */
interface DBProfile {
  id: string; name: string; location: string; bio: string
  price: number; rating: number; age: number; tags: string[]
  mainPhoto: string; gallery: string[]; status: string
  createdAt: Date; updatedAt: Date
}

interface GalleryItem {
  id: string; url: string; type: 'photo' | 'video'; uploading?: boolean
}

interface FormState {
  name: string; location: string; bio: string
  price: number; rating: number; age: number
  tags: string[]; mainPhoto: string
  gallery: GalleryItem[]; status: 'active' | 'inactive'
}

const BLANK: FormState = {
  name: '', location: '', bio: '', price: 0, rating: 5.0,
  age: 18, tags: [], mainPhoto: '', gallery: [], status: 'active',
}

function urlType(url: string): 'photo' | 'video' {
  return /\.(mp4|mov|webm|avi|mkv)($|\?)/i.test(url) ? 'video' : 'photo'
}

/* ── Component ───────────────────────────────────────────── */
export default function PalfinderManagement() {
  const [profiles, setProfiles]       = useState<DBProfile[]>([])
  const [loading, setLoading]         = useState(true)
  const [isOpen, setIsOpen]           = useState(false)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [form, setForm]               = useState<FormState>(BLANK)
  const [tagInput, setTagInput]       = useState('')
  const [dragIdx, setDragIdx]         = useState<number | null>(null)
  const [mainUploading, setMainUploading] = useState(false)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const mainRef    = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  /* Load from DB */
  const load = async () => {
    setLoading(true)
    try { setProfiles((await getPalfinderProfiles()) as DBProfile[]) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  /* Open modal */
  const openModal = (p?: DBProfile) => {
    setError(null)
    if (p) {
      setEditingId(p.id)
      setForm({
        name: p.name, location: p.location, bio: p.bio,
        price: p.price, rating: p.rating, age: p.age,
        tags: [...p.tags], mainPhoto: p.mainPhoto,
        gallery: p.gallery.map(url => ({ id: crypto.randomUUID(), url, type: urlType(url) })),
        status: p.status as 'active' | 'inactive',
      })
    } else {
      setEditingId(null); setForm(BLANK)
    }
    setIsOpen(true)
  }

  /* Save */
  const handleSave = async () => {
    if (!form.name.trim())        { setError('Name is required.');              return }
    if (!form.location.trim())    { setError('Location is required.');          return }
    if (form.price <= 0)          { setError('Price must be greater than 0.');  return }
    if (form.age < 18 || form.age > 80) { setError('Age must be 18–80.');      return }
    if (form.gallery.some(i => i.uploading)) { setError('Wait for uploads to finish.'); return }

    setSaving(true); setError(null)
    const payload = {
      name: form.name, location: form.location, bio: form.bio,
      price: form.price, rating: form.rating, age: form.age,
      tags: form.tags, mainPhoto: form.mainPhoto,
      gallery: form.gallery.map(i => i.url), status: form.status,
    }
    try {
      const res = editingId
        ? await updatePalfinderProfile(editingId, payload)
        : await createPalfinderProfile(payload)
      if (res.success) { await load(); setIsOpen(false) }
      else setError(res.error || 'Save failed.')
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  /* Delete */
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this profile?')) return
    const res = await deletePalfinderProfile(id)
    if (res.success) setProfiles(p => p.filter(x => x.id !== id))
    else alert(`Delete failed: ${res.error}`)
  }

  /* Tags */
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const v = tagInput.trim()
    if (v && !form.tags.includes(v)) setForm(f => ({ ...f, tags: [...f.tags, v] }))
    setTagInput('')
  }

  /* Main photo upload */
  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setForm(f => ({ ...f, mainPhoto: URL.createObjectURL(file) }))
    setMainUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const { url } = await uploadImage(fd)
      setForm(f => ({ ...f, mainPhoto: url }))
    } catch { setError('Main photo upload failed.'); setForm(f => ({ ...f, mainPhoto: '' })) }
    finally { setMainUploading(false) }
  }

  /* Gallery upload */
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); if (!files.length) return
    const placeholders: GalleryItem[] = files.map(f => ({
      id: crypto.randomUUID(), url: URL.createObjectURL(f),
      type: f.type.startsWith('video/') ? 'video' : 'photo', uploading: true,
    }))
    setForm(f => ({ ...f, gallery: [...f.gallery, ...placeholders] }))
    for (const [i, file] of files.entries()) {
      try {
        const fd = new FormData(); fd.append('file', file)
        const { url } = await uploadImage(fd)
        setForm(f => ({ ...f, gallery: f.gallery.map(g => g.id === placeholders[i].id ? { ...g, url, uploading: false } : g) }))
      } catch {
        setForm(f => ({ ...f, gallery: f.gallery.filter(g => g.id !== placeholders[i].id) }))
      }
    }
  }

  /* Drag & drop */
  const onDrop = (e: React.DragEvent, to: number) => {
    e.preventDefault(); if (dragIdx === null) return
    const g = [...form.gallery]; const [item] = g.splice(dragIdx, 1); g.splice(to, 0, item)
    setForm(f => ({ ...f, gallery: g })); setDragIdx(null)
  }

  /* ── Render ─────────────────────────────────────────────── */
  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF1B8D] transition'

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="text-[#FF1B8D]" /> PalFinder Management
          </h1>
          <p className="text-white/40 text-sm mt-1">Profiles saved here appear live on the public PalFinder page.</p>
        </div>
        <button onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:scale-105 transition"
          style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)', boxShadow: '0 0 20px rgba(255,27,141,0.3)' }}>
          <Plus size={16} /> Add New Profile
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A14] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 text-[#FF1B8D] animate-spin" />
            <span className="text-white/40 text-sm">Loading profiles…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-white/50 text-xs uppercase font-medium">
                <tr>
                  {['Profile', 'Location', 'Age', 'Price', 'Rating', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {profiles.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0 relative">
                          {p.mainPhoto
                            ? <img src={p.mainPhoto} alt={p.name} className="w-full h-full object-cover" />
                            : <ImageIcon className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30" />}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{p.name}</div>
                          <div className="text-white/30 text-xs font-mono">{p.id.slice(0, 12)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{p.location}</td>
                    <td className="px-6 py-4 text-white/70">{p.age} yrs</td>
                    <td className="px-6 py-4 font-semibold text-[#FF1B8D]">${p.price}</td>
                    <td className="px-6 py-4 text-white/70">⭐ {p.rating.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'active' ? 'bg-[#00FF7F]/10 text-[#00FF7F] border border-[#00FF7F]/20' : 'bg-white/10 text-white/50 border border-white/10'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(p)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!profiles.length && (
                  <tr><td colSpan={7} className="px-6 py-14 text-center text-white/30">No profiles yet — click &quot;Add New Profile&quot; to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
          <div className="bg-[#0A0A14] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05050A]">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Profile' : 'New PalFinder Profile'}</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition"><X size={20} /></button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left — Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/5 pb-2">Basic Info</h3>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Full Name <span className="text-[#FF1B8D]">*</span></label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Aisha Okafor" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Location <span className="text-[#FF1B8D]">*</span></label>
                    <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputCls} placeholder="e.g. Lagos, Nigeria" />
                  </div>

                  {/* Price + Age */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Price (USD) <span className="text-[#FF1B8D]">*</span></label>
                      <input type="number" min="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Age (18–80) <span className="text-[#FF1B8D]">*</span></label>
                      <input type="number" min="18" max="80" value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} className={inputCls} />
                    </div>
                  </div>

                  {/* Rating + Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Rating (1–5)</label>
                      <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                        className="w-full bg-[#0A0A14] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF1B8D] transition appearance-none">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      className={`${inputCls} h-24 resize-none`} placeholder="Tell us about this companion…" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Tags</label>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-wrap gap-2 min-h-[48px]">
                      {form.tags.map(t => (
                        <span key={t} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF1B8D]/20 text-[#FF1B8D] border border-[#FF1B8D]/30">
                          {t} <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={10} /></button>
                        </span>
                      ))}
                      <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                        className="bg-transparent text-white text-sm focus:outline-none flex-1 min-w-[100px]" placeholder="Type & Enter…" />
                    </div>
                  </div>
                </div>

                {/* Right — Media */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/5 pb-2">Media</h3>

                  {/* Main photo */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Main Profile Photo</label>
                    <div onClick={() => mainRef.current?.click()}
                      className="relative w-full h-52 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF1B8D]/50 hover:bg-white/10 transition overflow-hidden group">
                      {form.mainPhoto ? (
                        <>
                          <img src={form.mainPhoto} alt="" className="w-full h-full object-cover" />
                          {mainUploading
                            ? <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FF1B8D] animate-spin" /></div>
                            : <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><span className="text-white flex items-center gap-2 text-sm font-medium"><Upload size={16}/> Change</span></div>
                          }
                        </>
                      ) : (
                        <><Upload size={30} className="text-white/20 mb-2" /><span className="text-sm text-white/40">Click to upload</span></>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" ref={mainRef} onChange={handleMainUpload} />
                  </div>

                  {/* Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/70">Gallery</label>
                      <button onClick={() => galleryRef.current?.click()} className="text-xs font-semibold text-[#FF1B8D] hover:text-white transition flex items-center gap-1">
                        <Plus size={13}/> Add
                      </button>
                    </div>
                    <input type="file" accept="image/*,video/*" multiple className="hidden" ref={galleryRef} onChange={handleGalleryUpload} />
                    <div className="grid grid-cols-3 gap-2">
                      {form.gallery.map((item, i) => (
                        <div key={item.id} draggable={!item.uploading}
                          onDragStart={() => setDragIdx(i)} onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, i)}
                          className={`group relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border ${dragIdx === i ? 'border-[#FF1B8D] opacity-50' : 'border-white/10'} transition-all`}>
                          {item.type === 'video'
                            ? <><video src={item.url} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/20"><div className="w-7 h-7 rounded-full bg-[#FF1B8D] flex items-center justify-center pl-0.5"><Play size={12} className="text-white"/></div></div></>
                            : <img src={item.url} alt="" className="w-full h-full object-cover" />}
                          {item.uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-[#FF1B8D] animate-spin"/></div>}
                          {!item.uploading && (
                            <div className="absolute inset-x-0 top-0 p-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition bg-gradient-to-b from-black/60 to-transparent">
                              <GripVertical size={14} className="text-white/60 cursor-move"/>
                              <button onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, gallery: f.gallery.filter(g => g.id !== item.id) })) }} className="text-white hover:text-red-400 bg-black/40 rounded-full p-0.5"><X size={12}/></button>
                            </div>
                          )}
                        </div>
                      ))}
                      {!form.gallery.length && (
                        <div className="col-span-3 py-8 text-center border border-dashed border-white/10 rounded-xl text-white/30 text-sm">
                          No media — click &quot;Add&quot; to upload photos &amp; videos
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-white/25 mt-2 text-center">Drag to reorder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#05050A] flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)', boxShadow: '0 0 20px rgba(255,27,141,0.3)' }}>
                {saving && <Loader2 size={15} className="animate-spin"/>}
                {editingId ? 'Save Changes' : 'Create Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
