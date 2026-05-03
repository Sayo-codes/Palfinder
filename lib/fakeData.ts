import { Profile, Member, Payment, MediaItem } from './types'

// ─── Country list ──────────────────────────────────────────────────────────────
export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Brazil', 'Mexico', 'Argentina', 'Colombia',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Poland', 'Romania',
  'Philippines', 'Thailand', 'India', 'Japan', 'South Korea', 'Nigeria',
  'South Africa', 'Ghana', 'Kenya', 'Egypt', 'UAE', 'Saudi Arabia',
]

// ─── Unsplash portrait photos ──────────────────────────────────────────────────
const PHOTOS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1521566652839-697aa473761a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
]

// ─── Seed profiles ─────────────────────────────────────────────────────────────
export const SEED_PROFILES: Profile[] = [
  {
    id: 'p1', name: 'Lana Rose', username: 'lana_rose', age: 24,
    country: 'United States', gender: 'Female', interestedIn: 'Men',
    bio: 'Miami-based model. DM for exclusive content 🌴🔥',
    platforms: ['snapchat', 'telegram', 'onlyfans'],
    links: {
      snapchat: 'https://snapchat.com/add/lana_rose',
      telegram: 'https://t.me/lana_rose',
      onlyfans: 'https://onlyfans.com/lana_rose',
    },
    photo: PHOTOS[0], media: [PHOTOS[1], PHOTOS[2]],
    online: true, verified: true, active: true,
    createdAt: '2026-04-10T12:00:00Z',
  },
  {
    id: 'p2', name: 'Sophia X', username: 'sophia.x', age: 22,
    country: 'United Kingdom', gender: 'Female', interestedIn: 'Everyone',
    bio: 'London babe. Snap me 👻',
    platforms: ['snapchat', 'whatsapp'],
    links: {
      snapchat: 'https://snapchat.com/add/sophia.x',
      whatsapp: 'https://wa.me/447911123456',
    },
    photo: PHOTOS[1], media: [PHOTOS[3]],
    online: true, verified: false, active: true,
    createdAt: '2026-04-12T09:30:00Z',
  },
  {
    id: 'p3', name: 'Mia Kitten', username: 'mia_kitten', age: 26,
    country: 'Canada', gender: 'Female', interestedIn: 'Men',
    bio: 'Toronto model 🇨🇦 OnlyFans top 1% creator.',
    platforms: ['telegram', 'onlyfans'],
    links: {
      telegram: 'https://t.me/mia_kitten',
      onlyfans: 'https://onlyfans.com/mia_kitten',
    },
    photo: PHOTOS[2], media: [PHOTOS[4], PHOTOS[5]],
    online: false, verified: true, active: true,
    createdAt: '2026-04-14T15:00:00Z',
  },
  {
    id: 'p4', name: 'Zoey Baby', username: 'zoey_baby', age: 21,
    country: 'Australia', gender: 'Female', interestedIn: 'Everyone',
    bio: 'Sydney sunshine 🌞 Add me everywhere!',
    platforms: ['snapchat', 'telegram', 'whatsapp', 'onlyfans'],
    links: {
      snapchat: 'https://snapchat.com/add/zoey_baby',
      telegram: 'https://t.me/zoey_baby',
      whatsapp: 'https://wa.me/61412345678',
      onlyfans: 'https://onlyfans.com/zoey_baby',
    },
    photo: PHOTOS[3], media: [],
    online: true, verified: false, active: true,
    createdAt: '2026-04-15T08:00:00Z',
  },
  {
    id: 'p5', name: 'Ava Luxe', username: 'ava.luxe', age: 29,
    country: 'France', gender: 'Female', interestedIn: 'Men',
    bio: 'Paris lingerie model. Premium content only 💎',
    platforms: ['telegram', 'onlyfans'],
    links: {
      telegram: 'https://t.me/ava_luxe',
      onlyfans: 'https://onlyfans.com/avaluxe',
    },
    photo: PHOTOS[4], media: [PHOTOS[6]],
    online: true, verified: true, active: true,
    createdAt: '2026-04-16T11:00:00Z',
  },
  {
    id: 'p6', name: 'Ruby Red', username: 'ruby_red', age: 23,
    country: 'Germany', gender: 'Female', interestedIn: 'Everyone',
    bio: 'Berlin girl 🌹 Send me a message!',
    platforms: ['snapchat', 'whatsapp'],
    links: {
      snapchat: 'https://snapchat.com/add/ruby_red',
      whatsapp: 'https://wa.me/4917612345678',
    },
    photo: PHOTOS[5], media: [],
    online: false, verified: false, active: false,
    createdAt: '2026-04-17T14:00:00Z',
  },
  {
    id: 'p7', name: 'Emma Fox', username: 'emma_fox', age: 25,
    country: 'Spain', gender: 'Female', interestedIn: 'Men',
    bio: 'Barcelona content creator 🦊 OF link in bio.',
    platforms: ['snapchat', 'onlyfans'],
    links: {
      snapchat: 'https://snapchat.com/add/emma_fox',
      onlyfans: 'https://onlyfans.com/emma_fox',
    },
    photo: PHOTOS[6], media: [PHOTOS[7], PHOTOS[8]],
    online: true, verified: true, active: true,
    createdAt: '2026-04-18T10:00:00Z',
  },
  {
    id: 'p8', name: 'Kiki Doll', username: 'kiki.doll', age: 20,
    country: 'Philippines', gender: 'Female', interestedIn: 'Everyone',
    bio: 'Manila cutie 🌸 Telegram only!',
    platforms: ['telegram'],
    links: { telegram: 'https://t.me/kiki_doll' },
    photo: PHOTOS[7], media: [],
    online: true, verified: false, active: true,
    createdAt: '2026-04-19T07:00:00Z',
  },
  {
    id: 'p9', name: 'Bella V', username: 'bella_v', age: 28,
    country: 'Brazil', gender: 'Female', interestedIn: 'Men',
    bio: 'São Paulo model 🇧🇷 WhatsApp premium.',
    platforms: ['whatsapp', 'onlyfans'],
    links: {
      whatsapp: 'https://wa.me/5511912345678',
      onlyfans: 'https://onlyfans.com/bella_v',
    },
    photo: PHOTOS[8], media: [PHOTOS[9]],
    online: false, verified: true, active: true,
    createdAt: '2026-04-20T09:00:00Z',
  },
  {
    id: 'p10', name: 'Jade XO', username: 'jadexo', age: 27,
    country: 'Netherlands', gender: 'Female', interestedIn: 'Everyone',
    bio: 'Amsterdam vibe 🌷 All platforms active.',
    platforms: ['snapchat', 'telegram', 'whatsapp', 'onlyfans'],
    links: {
      snapchat: 'https://snapchat.com/add/jadexo',
      telegram: 'https://t.me/jadexo',
      whatsapp: 'https://wa.me/31612345678',
      onlyfans: 'https://onlyfans.com/jadexo',
    },
    photo: PHOTOS[9], media: [PHOTOS[10], PHOTOS[11]],
    online: true, verified: true, active: true,
    createdAt: '2026-04-21T13:00:00Z',
  },
  {
    id: 'p11', name: 'Nina Blue', username: 'nina_blue', age: 23,
    country: 'Sweden', gender: 'Female', interestedIn: 'Men',
    bio: 'Stockholm model 🇸🇪 Snap & Telegram active.',
    platforms: ['snapchat', 'telegram'],
    links: {
      snapchat: 'https://snapchat.com/add/nina_blue',
      telegram: 'https://t.me/nina_blue',
    },
    photo: PHOTOS[10], media: [],
    online: false, verified: false, active: true,
    createdAt: '2026-04-22T11:00:00Z',
  },
  {
    id: 'p12', name: 'Chloe Star', username: 'chloe_star', age: 31,
    country: 'Italy', gender: 'Female', interestedIn: 'Everyone',
    bio: 'Milano fashionista ⭐ OF & Telegram.',
    platforms: ['telegram', 'onlyfans'],
    links: {
      telegram: 'https://t.me/chloe_star',
      onlyfans: 'https://onlyfans.com/chloe_star',
    },
    photo: PHOTOS[11], media: [PHOTOS[0]],
    online: true, verified: true, active: true,
    createdAt: '2026-04-23T16:00:00Z',
  },
]

// ─── Seed members ──────────────────────────────────────────────────────────────
export const SEED_MEMBERS: Member[] = [
  { id: 'm1', email: 'john@example.com', plan: 'premium', joinedAt: '2026-03-01', lastSeen: '2026-05-01' },
  { id: 'm2', email: 'sarah@example.com', plan: 'vip', joinedAt: '2026-02-14', lastSeen: '2026-05-02' },
  { id: 'm3', email: 'mike@example.com', plan: 'free', joinedAt: '2026-04-20', lastSeen: '2026-04-30' },
  { id: 'm4', email: 'lisa@example.com', plan: 'premium', joinedAt: '2026-01-10', lastSeen: '2026-05-01' },
  { id: 'm5', email: 'david@example.com', plan: 'free', joinedAt: '2026-04-28', lastSeen: '2026-04-29' },
]

// ─── Seed payments ─────────────────────────────────────────────────────────────
export const SEED_PAYMENTS: Payment[] = [
  { id: 'pay1', memberId: 'm1', amount: 19.99, plan: 'Premium Monthly', status: 'paid', date: '2026-05-01' },
  { id: 'pay2', memberId: 'm2', amount: 49.99, plan: 'VIP Monthly', status: 'paid', date: '2026-05-01' },
  { id: 'pay3', memberId: 'm4', amount: 19.99, plan: 'Premium Monthly', status: 'paid', date: '2026-04-30' },
  { id: 'pay4', memberId: 'm3', amount: 19.99, plan: 'Premium Monthly', status: 'failed', date: '2026-04-28' },
  { id: 'pay5', memberId: 'm5', amount: 49.99, plan: 'VIP Monthly', status: 'pending', date: '2026-04-29' },
]

// ─── Seed media ────────────────────────────────────────────────────────────────
export const SEED_MEDIA: MediaItem[] = PHOTOS.map((url, i) => ({
  id: `media${i + 1}`,
  profileId: `p${(i % 12) + 1}`,
  url,
  type: 'photo',
  uploadedAt: `2026-04-${10 + i}T10:00:00Z`,
}))
