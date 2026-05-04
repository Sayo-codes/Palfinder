import React from 'react'
import SnapchatIcon from '@/components/icons/SnapchatIcon'
import { PlatformPage } from '@/components/PlatformPage'
import { getProfilesByPlatform } from '@/lib/actions'

export default async function Snapchat() {
  let profiles = []
  try {
    profiles = (await getProfilesByPlatform('snapchat')) as any[]
  } catch (e) {
    console.error('Failed to fetch snapchat profiles', e)
  }

  return (
    <PlatformPage
      platformName="snapchat"
      title="Snapchat Girls"
      color="#E6C100"
      textOnColor="#1a1a1a"
      icon={<SnapchatIcon className="w-5 h-5" />}
      buttonLabel="Add Snapchat"
      profiles={profiles}
    />
  )
}
