'use server'

import { db } from './db'
import { revalidatePath } from 'next/cache'

export async function createProfile(data: any) {
  try {
    const profile = await db.profile.create({
      data: {
        name: data.name,
        username: data.username || data.name.toLowerCase().replace(/\s+/g, '_'),
        age: data.age,
        country: data.country,
        gender: data.gender,
        interestedIn: data.interestedIn,
        bio: data.bio || '',
        platforms: data.platforms || [],
        links: data.links || {},
        photo: data.photo || '',
        media: data.media || [],
        online: data.online || false,
        verified: data.verified || false,
        active: data.active !== false,
      }
    })
    
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, profile }
  } catch (error: any) {
    console.error('Failed to create profile', error)
    return { success: false, error: error.message }
  }
}

export async function getProfiles() {
  return await db.profile.findMany({
    orderBy: { createdAt: 'desc' }
  })
}
