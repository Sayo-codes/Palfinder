import React from 'react'
import SnapchatIcon from '../components/icons/SnapchatIcon'
import { PlatformPage } from '../components/PlatformPage'

export function Snapchat() {
  return (
    <PlatformPage
      platformName="snapchat"
      title="Snapchat Girls"
      color="#FFD600"
      textOnColor="#1a1a1a"
      icon={<SnapchatIcon className="w-5 h-5" />}
      buttonLabel="Add Snapchat"
    />
  )
}
