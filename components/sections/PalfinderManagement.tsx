'use client'

import React, { useState, useRef } from 'react'
import { Plus, Edit2, Trash2, X, Upload, GripVertical, Play, ImageIcon, Heart } from 'lucide-react'
import Image from 'next/image'

interface GalleryItem {
  id: string
  url: string
  type: 'photo' | 'video'
  file?: File
}

interface PalfinderProfile {
  id: string
  name: string
  location: string
  bio: string
  price: number
  rating: number
  tags: string[]
  mainPhoto: string | null
  gallery: GalleryItem[]
  status: 'active' | 'inactive'
}

const MOCK_PROFILES: PalfinderProfile[] = [
  {
    id: 'PF-001',
    name: 'Sarah Jenkins',
    location: 'Lagos, Nigeria',
    bio: 'Fun, outgoing, and ready to explore the city! I love finding new cafes and attending live music events.',
    price: 150,
    rating: 4.8,
    tags: ['Coffee', 'Music', 'Travel'],
    mainPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    gallery: [],
    status: 'active',
  },
  {
    id: 'PF-002',
    name: 'David Okafor',
    location: 'Abuja, Nigeria',
    bio: 'Fitness enthusiast. Always up for a gym session or an outdoor hike. Let\'s get active!',
    price: 100,
    rating: 4.5,
    tags: ['Fitness', 'Outdoors'],
    mainPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    gallery: [],
    status: 'active',
  }
]

export default function PalfinderManagement() {
  const [profiles, setProfiles] = useState<PalfinderProfile[]>(MOCK_PROFILES)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<PalfinderProfile, 'id'>>({
    name: '',
    location: '',
    bio: '',
    price: 0,
    rating: 5.0,
    tags: [],
    mainPhoto: null,
    gallery: [],
    status: 'active'
  })

  const [tagInput, setTagInput] = useState('')
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)

  const mainPhotoInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleOpenModal = (profile?: PalfinderProfile) => {
    if (profile) {
      setEditingId(profile.id)
      setFormData({
        name: profile.name,
        location: profile.location,
        bio: profile.bio,
        price: profile.price,
        rating: profile.rating,
        tags: [...profile.tags],
        mainPhoto: profile.mainPhoto,
        gallery: [...profile.gallery],
        status: profile.status
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        location: '',
        bio: '',
        price: 0,
        rating: 5.0,
        tags: [],
        mainPhoto: null,
        gallery: [],
        status: 'active'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      setProfiles(profiles.filter(p => p.id !== id))
    }
  }

  const handleSave = () => {
    if (editingId) {
      setProfiles(profiles.map(p => p.id === editingId ? { ...formData, id: editingId } : p))
    } else {
      const newProfile: PalfinderProfile = {
        ...formData,
        id: `PF-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      }
      setProfiles([newProfile, ...profiles])
    }
    handleCloseModal()
  }

  // Tags Logic
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = tagInput.trim()
      if (val && !formData.tags.includes(val)) {
        setFormData({ ...formData, tags: [...formData.tags, val] })
      }
      setTagInput('')
    }
  }
  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  // File Upload Logic
  const handleMainPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setFormData({ ...formData, mainPhoto: url })
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newItems: GalleryItem[] = files.map(file => ({
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'photo',
        file
      }))
      setFormData({ ...formData, gallery: [...formData.gallery, ...newItems] })
    }
  }

  const removeGalleryItem = (id: string) => {
    setFormData({ ...formData, gallery: formData.gallery.filter(item => item.id !== id) })
  }

  // Drag and Drop Logic
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    // Could implement live visual feedback here
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItemIndex === null) return

    const newGallery = [...formData.gallery]
    const draggedItem = newGallery[draggedItemIndex]
    newGallery.splice(draggedItemIndex, 1)
    newGallery.splice(index, 0, draggedItem)

    setFormData({ ...formData, gallery: newGallery })
    setDraggedItemIndex(null)
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="text-[#FF1B8D]" /> PalFinder Management
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage all PalFinder companion profiles.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:scale-105"
          style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)', boxShadow: '0 0 20px rgba(255,27,141,0.3)' }}
        >
          <Plus size={16} /> Add New PalFinder Profile
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A14] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-white/50 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Profile</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profiles.map(profile => (
                <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 relative flex-shrink-0">
                        {profile.mainPhoto ? (
                          <img src={profile.mainPhoto} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{profile.name}</div>
                        <div className="text-white/40 text-xs">{profile.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/70">{profile.location}</td>
                  <td className="px-6 py-4 font-medium text-[#FF1B8D]">${profile.price}</td>
                  <td className="px-6 py-4 text-white/70">⭐ {profile.rating.toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${profile.status === 'active'
                      ? 'bg-[#00FF7F]/10 text-[#00FF7F] border border-[#00FF7F]/20'
                      : 'bg-white/10 text-white/50 border border-white/10'
                      }`}>
                      {profile.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(profile)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No PalFinder profiles found. Click "Add New" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60">
          {/* Modal Container */}
          <div className="bg-[#0A0A14] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05050A]">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit PalFinder Profile' : 'Add New PalFinder Profile'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Column: Basic Info */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Basic Info</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF1B8D] transition"
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF1B8D] transition"
                        placeholder="e.g. Lagos, Nigeria"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Price (USD)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF1B8D] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Rating (1.0 - 5.0)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={formData.rating}
                          onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF1B8D] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF1B8D] transition appearance-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Bio / Description</label>
                      <textarea
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF1B8D] transition h-24 resize-none"
                        placeholder="Tell us about the Pal..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Tags / Interests</label>
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF1B8D]/20 text-[#FF1B8D] border border-[#FF1B8D]/30">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-white transition"><X size={12} /></button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          className="bg-transparent text-white text-sm focus:outline-none flex-1 min-w-[120px]"
                          placeholder="Type & press Enter..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Media */}
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Media</h3>
                  </div>

                  {/* Main Photo */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Main Profile Photo (Portrait)</label>
                    <div
                      onClick={() => mainPhotoInputRef.current?.click()}
                      className="relative w-full h-64 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF1B8D]/50 hover:bg-white/10 transition overflow-hidden group"
                    >
                      {formData.mainPhoto ? (
                        <>
                          <img src={formData.mainPhoto} alt="Main" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium flex items-center gap-2"><Upload size={16} /> Change Photo</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload size={32} className="text-white/20 mb-3" />
                          <span className="text-sm text-white/40">Click to upload main photo</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={mainPhotoInputRef}
                      onChange={handleMainPhotoUpload}
                    />
                  </div>

                  {/* Gallery */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white/70">Gallery Media (Photos & Videos)</label>
                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-xs font-semibold text-[#FF1B8D] hover:text-white transition flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Media
                      </button>
                    </div>

                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      ref={galleryInputRef}
                      onChange={handleGalleryUpload}
                    />

                    <div className="grid grid-cols-3 gap-3">
                      {formData.gallery.map((item, index) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`group relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border ${draggedItemIndex === index ? 'border-[#FF1B8D] opacity-50' : 'border-white/10'} cursor-grab active:cursor-grabbing transition-all`}
                        >
                          {item.type === 'video' ? (
                            <div className="w-full h-full relative">
                              <video src={item.url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-[#FF1B8D] flex items-center justify-center pl-0.5">
                                  <Play size={14} className="text-white" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img src={item.url} alt="Gallery" className="w-full h-full object-cover" />
                          )}

                          {/* Overlays */}
                          <div className="absolute inset-x-0 top-0 p-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-black/60 to-transparent">
                            <div className="text-white/70 cursor-move">
                              <GripVertical size={16} />
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeGalleryItem(item.id); }}
                              className="text-white hover:text-red-400 bg-black/40 rounded-full p-1 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {formData.gallery.length === 0 && (
                        <div className="col-span-3 py-8 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                          <p className="text-sm text-white/30">No gallery media added yet.<br />Click "Add Media" to upload photos and videos.</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-white/30 mt-3 text-center">Drag and drop items to reorder them.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#05050A] flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#FF1B8D,#B026FF)', boxShadow: '0 0 20px rgba(255,27,141,0.3)' }}
              >
                {editingId ? 'Save Changes' : 'Create Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
