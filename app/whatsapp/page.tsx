import React from 'react'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import { PlatformPage } from '@/components/PlatformPage'
import { getProfilesByPlatform } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function WhatsApp() {
  let profiles = []
  try {
    profiles = (await getProfilesByPlatform('whatsapp')) as any[]
  } catch (e) {
    console.error('Failed to fetch whatsapp profiles', e)
  }

  return (
    <PlatformPage
      platformName="whatsapp"
      title="WhatsApp Girls"
      color="#00D168"
      textOnColor="#0a2618"
      icon={<WhatsAppIcon className="w-5 h-5" />}
      buttonLabel="Add WhatsApp"
      profiles={profiles}
    />
  )
}
