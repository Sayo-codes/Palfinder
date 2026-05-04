import React from 'react'
import OnlyFansIcon from '@/components/icons/OnlyFansIcon'
import { PlatformPage } from '@/components/PlatformPage'
import { getProfilesByPlatform } from '@/lib/actions'

export default async function OnlyFans() {
  let profiles = []
  try {
    profiles = (await getProfilesByPlatform('onlyfans')) as any[]
  } catch (e) {
    console.error('Failed to fetch onlyfans profiles', e)
  }

  return (
    <PlatformPage
      platformName="onlyfans"
      title="OnlyFans Creators"
      color="#00A3C4"
      textOnColor="#001a26"
      icon={<OnlyFansIcon className="w-5 h-5" />}
      buttonLabel="View Profile"
      profiles={profiles}
    />
  )
}
