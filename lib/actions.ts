'use server'

import { db } from './db'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'

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
        profileImage: data.profileImage || '',
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

export async function updateProfileDb(id: string, data: any) {
  try {
    const profile = await db.profile.update({
      where: { id },
      data: {
        name: data.name,
        username: data.username,
        age: data.age,
        country: data.country,
        gender: data.gender,
        interestedIn: data.interestedIn,
        bio: data.bio || '',
        platforms: data.platforms || [],
        links: data.links || {},
        photo: data.photo || '',
        profileImage: data.profileImage || '',
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
    console.error('Failed to update profile', error)
    return { success: false, error: error.message }
  }
}

export async function getProfiles() {
  return await db.profile.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function getProfilesByPlatform(platform: string) {
  return await db.profile.findMany({
    where: {
      platforms: {
        has: platform
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file found in formData');
  }

  const blob = await put(`profiles/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  return { url: blob.url };
}
