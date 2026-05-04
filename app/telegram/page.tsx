import React from 'react'
import TelegramIcon from '@/components/icons/TelegramIcon'
import { PlatformPage } from '@/components/PlatformPage'
import { getProfilesByPlatform } from '@/lib/actions'

export default async function Telegram() {
  let profiles = []
  try {
    profiles = (await getProfilesByPlatform('telegram')) as any[]
  } catch (e) {
    console.error('Failed to fetch telegram profiles', e)
  }

  return (
    <PlatformPage
      platformName="telegram"
      title="Telegram Girls"
      color="#0082C5"
      textOnColor="#001a33"
      icon={<TelegramIcon className="w-5 h-5" />}
      buttonLabel="Add Telegram"
      profiles={profiles}
    />
  )
}
