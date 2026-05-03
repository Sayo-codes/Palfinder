import React from 'react'
import OnlyFansIcon from '../components/icons/OnlyFansIcon'
import { PlatformPage } from '../components/PlatformPage'

export function OnlyFans() {
  return (
    <PlatformPage
      platformName="onlyfans"
      title="OnlyFans Creators"
      color="#00A3C4"
      textOnColor="#001a26"
      icon={<OnlyFansIcon className="w-5 h-5" />}
      buttonLabel="View Profile"
    />
  )
}
