import React from 'react'
import SnapchatIcon from '../components/icons/SnapchatIcon'
import { PlatformPage } from '../components/PlatformPage'

export default function Snapchat() {
  return (
    <PlatformPage
      platformName="snapchat"
      title="Snapchat Girls"
      color="#E6C100"
      textOnColor="#1a1a1a"
      icon={<SnapchatIcon className="w-5 h-5" />}
      buttonLabel="Add Snapchat"
    />
  )
}
