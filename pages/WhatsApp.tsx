import React from 'react'
import WhatsAppIcon from '../components/icons/WhatsAppIcon'
import { PlatformPage } from '../components/PlatformPage'

export function WhatsApp() {
  return (
    <PlatformPage
      platformName="whatsapp"
      title="WhatsApp Girls"
      color="#00FF7F"
      textOnColor="#0a2618"
      icon={<WhatsAppIcon className="w-5 h-5" />}
      buttonLabel="Add WhatsApp"
    />
  )
}
