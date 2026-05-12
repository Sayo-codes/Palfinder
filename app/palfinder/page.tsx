import { getActivePalfinderProfiles } from '@/lib/actions'
import PalfinderGrid from './PalfinderGrid'

// Ensure we always get the freshest data from the DB
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PalfinderPage() {
  const profiles = await getActivePalfinderProfiles()

  // Map DB profiles to the expected interface if necessary, 
  // or pass directly if types align.
  const serializedProfiles = profiles.map(p => ({
    ...p,
    // Ensure dates are serialized if passed to client components
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return <PalfinderGrid profiles={serializedProfiles as any} />
}
