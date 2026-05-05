import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Profile, Member, Payment, MediaItem, Platform, NavSection } from './types'
import {
  SEED_MEMBERS,
  SEED_PAYMENTS,
  SEED_MEDIA,
} from './fakeData'

// ─── Admin Store ───────────────────────────────────────────────────────────────

interface AdminStore {
  // Navigation
  activeSection: NavSection
  sidebarOpen: boolean
  setActiveSection: (s: NavSection) => void
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void

  // Profiles — always loaded fresh from DB, never persisted
  profiles: Profile[]
  setProfiles: (profiles: Profile[]) => void
  addProfile: (p: Profile) => void
  updateProfile: (id: string, data: Partial<Profile>) => void
  deleteProfile: (id: string) => void

  // Modal state
  editingProfile: Profile | null
  showProfileModal: boolean
  openCreateModal: () => void
  openEditModal: (p: Profile) => void
  closeProfileModal: () => void

  // Delete confirmation
  deletingProfileId: string | null
  openDeleteConfirm: (id: string) => void
  closeDeleteConfirm: () => void
  confirmDelete: () => void

  // Members, Payments, Media
  members: Member[]
  payments: Payment[]
  media: MediaItem[]
  addMedia: (item: MediaItem) => void
  deleteMedia: (id: string) => void

  // Filters
  searchQuery: string
  platformFilter: Platform | 'all'
  setSearchQuery: (q: string) => void
  setPlatformFilter: (p: Platform | 'all') => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
  // ── Navigation ────────────────────────────────────────────────────────────
  activeSection: 'overview',
  sidebarOpen: false,
  setActiveSection: (s) => set({ activeSection: s, sidebarOpen: false }),
  toggleSidebar: () => set((st) => ({ sidebarOpen: !st.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  // ── Profiles — DB is source of truth ──────────────────────────────────────
  profiles: [],
  setProfiles: (profiles) => set({ profiles }),
  addProfile: (p) => set((st) => ({ profiles: [p, ...st.profiles] })),
  updateProfile: (id, data) =>
    set((st) => ({
      profiles: st.profiles.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deleteProfile: (id) =>
    set((st) => ({ profiles: st.profiles.filter((p) => p.id !== id) })),

  // ── Modal ─────────────────────────────────────────────────────────────────
  editingProfile: null,
  showProfileModal: false,
  openCreateModal: () => set({ editingProfile: null, showProfileModal: true }),
  openEditModal: (p) => set({ editingProfile: p, showProfileModal: true }),
  closeProfileModal: () => set({ showProfileModal: false, editingProfile: null }),

  // ── Delete Confirm ────────────────────────────────────────────────────────
  deletingProfileId: null,
  openDeleteConfirm: (id) => set({ deletingProfileId: id }),
  closeDeleteConfirm: () => set({ deletingProfileId: null }),
  confirmDelete: () => {
    const { deletingProfileId, deleteProfile } = get()
    if (deletingProfileId) {
      deleteProfile(deletingProfileId)
      set({ deletingProfileId: null })
    }
  },

  // ── Members / Payments / Media ────────────────────────────────────────────
  members: [],
  payments: [],
  media: [],
  addMedia: (item) => set((st) => ({ media: [item, ...st.media] })),
  deleteMedia: (id) =>
    set((st) => ({ media: st.media.filter((m) => m.id !== id) })),

  // ── Filters ───────────────────────────────────────────────────────────────
  searchQuery: '',
  platformFilter: 'all',
  setSearchQuery: (q) => set({ searchQuery: q }),
  setPlatformFilter: (p) => set({ platformFilter: p }),
}), {
  name: 'palfinder-admin-storage',
  // Only persist UI state — never profiles (DB is the source of truth)
  partialize: (state) => ({
    activeSection: state.activeSection,
    platformFilter: state.platformFilter,
  }),
}))
