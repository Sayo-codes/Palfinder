import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Snapchat } from './pages/Snapchat'
import { WhatsApp } from './pages/WhatsApp'
import { OnlyFans } from './pages/OnlyFans'
import { Telegram } from './pages/Telegram'
import { ScrollToTop } from './components/ScrollToTop'

import AgeGateProvider from './components/age-gate/AgeGateProvider'

export function App() {
  return (
    <AgeGateProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snapchat" element={<Snapchat />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="/onlyfans" element={<OnlyFans />} />
          <Route path="/telegram" element={<Telegram />} />
        </Routes>
      </BrowserRouter>
    </AgeGateProvider>
  )
}
