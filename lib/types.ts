// ─── Core Types ───────────────────────────────────────────────────────────────

export type Platform = 'snapchat' | 'telegram' | 'whatsapp' | 'onlyfans'

export type Gender = 'Female' | 'Male' | 'Non-binary' | 'Couple' | 'Trans'

export type InterestedIn = 'Men' | 'Women' | 'Everyone' | 'Couples'

export interface Profile {
  id: string
  name: string
  username: string
  age: number
  country: string
  gender: Gender
  interestedIn: InterestedIn
  bio: string
  platforms: Platform[]
  links: Partial<Record<Platform, string>>
  photo: string
  media: string[]
  online: boolean
  verified: boolean
  active: boolean
  createdAt: string
}

export interface Member {
  id: string
  email: string
  plan: 'free' | 'premium' | 'vip'
  joinedAt: string
  lastSeen: string
}

export interface Payment {
  id: string
  memberId: string
  amount: number
  plan: string
  status: 'paid' | 'pending' | 'failed'
  date: string
}

export interface MediaItem {
  id: string
  profileId: string
  url: string
  type: 'photo' | 'video'
  uploadedAt: string
}

export type NavSection =
  | 'overview'
  | 'models'
  | 'palfinder'
  | 'snapchat'
  | 'telegram'
  | 'whatsapp'
  | 'onlyfans'
  | 'payments'
  | 'members'
  | 'media'
  | 'verification'
  | 'affiliates'
  | 'settings'
