'use client'

import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ProfileModal from './ProfileModal'
import DeleteModal from './DeleteModal'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
      {/* Global modals */}
      <ProfileModal />
      <DeleteModal />
    </div>
  )
}
