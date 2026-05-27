'use client'

import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ProfileModal from './ProfileModal'
import DeleteModal from './DeleteModal'
import { useAdminStore } from '@/lib/store'
import { getProfiles } from '@/lib/actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const setProfiles = useAdminStore((s) => s.setProfiles)

  useEffect(() => {
    getProfiles()
      .then((data) => setProfiles(data as any[]))
      .catch((err) => console.error('Failed to load profiles', err))
  }, [setProfiles])

  useEffect(() => {
    document.documentElement.classList.add('admin-mode')
    return () => {
      document.documentElement.classList.remove('admin-mode')
    }
  }, [])

  return (
    <div
      className="flex h-screen overflow-hidden app-container"
      style={{ background: 'var(--bg)' }}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {children}
        </main>
      </div>
      {/* Global modals */}
      <ProfileModal />
      <DeleteModal />
    </div>
  )
}
