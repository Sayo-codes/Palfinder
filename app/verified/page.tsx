import { getProfiles } from '@/lib/actions'
import { BadgeCheckIcon, ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function VerifiedPage() {
  let profiles: Profile[] = []
  try {
    const all = await getProfiles()
    profiles = (all as Profile[]).filter((p) => p.verified && p.active)
  } catch (e) {
    console.error('Failed to fetch verified profiles', e)
  }

  return (
    <div className="min-h-screen w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-foreground/60 hover:text-foreground text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'rgba(0,163,196,0.1)', color: '#00A3C4', border: '1px solid rgba(0,163,196,0.25)' }}
        >
          <BadgeCheckIcon className="w-3.5 h-3.5" />
          ID-Verified Profiles
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
          All Verified Models
        </h1>
        <p className="text-foreground/50 text-sm">
          Every profile below has been manually verified. {profiles.length > 0 && `${profiles.length} verified model${profiles.length !== 1 ? 's' : ''} available.`}
        </p>
      </div>

      {/* Grid */}
      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(0,163,196,0.1)', color: '#00A3C4' }}
          >
            <BadgeCheckIcon className="w-8 h-8" />
          </div>
          <p className="text-foreground/40 font-medium text-lg">No verified models yet</p>
          <p className="text-foreground/25 text-sm mt-1">Check back soon — profiles are being reviewed</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((p) => (
            <Link
              key={p.id}
              href={`/profile/${p.username}`}
              className="group bg-palfinder-surface rounded-2xl p-4 flex flex-col items-center transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3C4]/50"
              style={{
                border: '1px solid rgba(0,163,196,0.15)',
                boxShadow: '0 0 20px rgba(0,163,196,0.06)',
              }}
            >
              <div className="relative mb-3">
                <div
                  className="rounded-full p-[3px]"
                  style={{ background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)', boxShadow: '0 0 10px rgba(212,26,117,0.4)' }}
                >
                  {p.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photo} alt={p.name} className="w-20 h-20 rounded-full object-cover bg-background" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D41A75] to-[#8E20D1]" />
                  )}
                </div>
                {p.online && (
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#00D168] border-2 border-background" />
                )}
              </div>
              <div className="flex items-center gap-1 mb-1">
                <span className="font-bold text-foreground text-sm">{p.name}</span>
                <BadgeCheckIcon className="w-3.5 h-3.5 text-[#00A3C4]" />
              </div>
              <p className="text-xs text-foreground/45 mb-3">{p.country}</p>
              <div
                className="w-full py-2 rounded-full font-bold text-xs text-center transition-transform group-hover:scale-[1.03]"
                style={{
                  background: 'rgba(0,163,196,0.15)',
                  color: '#00A3C4',
                  border: '1px solid rgba(0,163,196,0.3)',
                }}
              >
                View Profile
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
