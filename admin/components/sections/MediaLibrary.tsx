'use client'

import { useAdminStore } from '@/lib/store'
import { useState, useRef } from 'react'
import { Upload, Trash2, Image, Search } from 'lucide-react'

export default function MediaLibrary() {
  const { media, addMedia, deleteMedia, profiles } = useAdminStore()
  const [search, setSearch] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const getProfileName = (id: string) => profiles.find((p) => p.id === id)?.name ?? 'Unknown'

  const filtered = media.filter((m) =>
    !search || getProfileName(m.profileId).toLowerCase().includes(search.toLowerCase())
  )

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      addMedia({
        id: `media_${Date.now()}_${Math.random()}`,
        profileId: profiles[0]?.id ?? 'p1',
        url,
        type: 'photo',
        uploadedAt: new Date().toISOString(),
      })
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      addMedia({
        id: `media_${Date.now()}_${Math.random()}`,
        profileId: profiles[0]?.id ?? 'p1',
        url, type: 'photo',
        uploadedAt: new Date().toISOString(),
      })
    })
  }

  return (
    <div className="space-y-5 animate-in">
      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-white/10 rounded-2xl p-6 sm:p-10 text-center cursor-pointer hover:border-pink-500/30 transition-colors"
        style={{ background: 'rgba(255,255,255,0.02)' }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'rgba(255,27,141,0.12)', color: '#FF1B8D' }}>
          <Upload size={22} />
        </div>
        <p className="font-semibold text-white/70 text-sm">Drop photos here or tap to upload</p>
        <p className="text-xs text-white/30 mt-1">PNG, JPG, WEBP — multiple files supported</p>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" placeholder="Search by profile name…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 text-sm" />
        </div>
        <span className="text-xs text-white/30 flex-shrink-0">{filtered.length} items</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Image size={40} className="text-white/10 mb-3" />
          <p className="text-white/40">No media found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {filtered.map((item) => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <div className="text-xs text-white/80 text-center leading-tight truncate w-full">
                  {getProfileName(item.profileId)}
                </div>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-300 hover:text-red-200 transition"
                  style={{ background: 'rgba(229,62,62,0.2)', border: '1px solid rgba(229,62,62,0.3)' }}
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
