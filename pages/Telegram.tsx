import React from 'react'
import TelegramIcon from '../components/icons/TelegramIcon'
import { PlatformPage } from '../components/PlatformPage'

export function Telegram() {
  return (
    <PlatformPage
      platformName="telegram"
      title="Telegram Girls"
      color="#00A8FF"
      textOnColor="#001a33"
      icon={<TelegramIcon className="w-5 h-5" />}
      buttonLabel="Add Telegram"
    />
  )
}
