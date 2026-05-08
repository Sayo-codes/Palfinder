export interface PalfinderProfile {
  name: string
  location: string
  bio: string
  tags: string[]
  rating: number
  price: number
  imageUrl: string
  media: { type: 'image' | 'video'; url: string; thumbnail?: string }[]
}

export const PALFINDER_PROFILES: PalfinderProfile[] = [
  {
    name: 'David',
    location: 'Lagos',
    bio: 'Weekend hiker, coffee enthusiast, dog dad',
    tags: ['Fitness', 'Coffee', 'Dogs'],
    rating: 4,
    price: 130,
    imageUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop' },
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    name: 'Aisha',
    location: 'Benin City',
    bio: 'Love cooking, dancing & deep conversations ❤️',
    tags: ['Travel', 'Music', 'Foodie'],
    rating: 5,
    price: 180,
    imageUrl:
      'https://images.unsplash.com/photo-1531123897727-8f129e1bfa8ea?q=80&w=800&auto=format&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa8ea?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop' },
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    name: 'Cynthia',
    location: 'Lagos',
    bio: 'Creative soul, sunset chaser, wine lover 🍷',
    tags: ['Fitness', 'Coffee', 'Dogs'],
    rating: 5,
    price: 210,
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop' },
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    name: 'Joel',
    location: 'Lagos',
    bio: 'Gym bro, love good vibes and great food 💪',
    tags: ['Fitness', 'Coffee', 'Dogs'],
    rating: 4,
    price: 150,
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop' },
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop' },
    ],
  },
]
