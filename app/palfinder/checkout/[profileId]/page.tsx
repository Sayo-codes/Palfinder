import { getPalfinderProfileById } from '@/lib/actions'
import CheckoutClient from './CheckoutClient'
import Link from 'next/link'
import { AlertTriangleIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params
  const profile = await getPalfinderProfileById(profileId)

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertTriangleIcon className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-foreground font-semibold">Profile not found.</p>
          <Link href="/palfinder" className="text-sm text-foreground/50 hover:text-foreground underline">← Back to Palfinder</Link>
        </div>
      </div>
    )
  }

  const serializedProfile = {
    ...profile,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  }

  return <CheckoutClient profile={serializedProfile as any} />
}
