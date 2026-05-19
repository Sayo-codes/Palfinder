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
    revalidatePath('/snapchat')
    revalidatePath('/telegram')
    revalidatePath('/whatsapp')
    revalidatePath('/onlyfans')
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
    revalidatePath('/snapchat')
    revalidatePath('/telegram')
    revalidatePath('/whatsapp')
    revalidatePath('/onlyfans')
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

export async function deleteProfileDb(id: string) {
  try {
    await db.profile.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/snapchat')
    revalidatePath('/telegram')
    revalidatePath('/whatsapp')
    revalidatePath('/onlyfans')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete profile', error)
    return { success: false, error: error.message }
  }
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file found in formData')
  }

  const blob = await put(`profiles/${Date.now()}-${file.name}`, file, {
    access: 'public',
  })

  return { url: blob.url }
}

// ─────────────────────────────────────────────────────────────
// PalFinder Profile CRUD
// These actions manage the separate PalfinderProfile model
// (companion profiles shown on /palfinder — distinct from the
//  social-platform Profile model used by Snapchat/Telegram/etc.)
// ─────────────────────────────────────────────────────────────

/** Data shape expected when creating or updating a PalFinder profile */
interface PalfinderProfileInput {
  name: string
  location: string
  bio?: string
  price: number
  rating?: number
  age: number
  tags?: string[]
  mainPhoto?: string
  gallery?: string[]
  megaLink?: string
  unlockLink?: string
  status?: string
}

/** Fetch all PalFinder profiles, newest first */
export async function getPalfinderProfiles() {
  return await db.palfinderProfile.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

/** Fetch only active PalFinder profiles for the public page */
export async function getActivePalfinderProfiles() {
  return await db.palfinderProfile.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
  })
}

/** Fetch a single PalFinder profile by ID */
export async function getPalfinderProfileById(id: string) {
  return await db.palfinderProfile.findUnique({
    where: { id },
  })
}

/** Create a new PalFinder profile and revalidate the public page */
export async function createPalfinderProfile(data: PalfinderProfileInput) {
  try {
    const profile = await db.palfinderProfile.create({
      data: {
        name: data.name,
        location: data.location,
        bio: data.bio ?? '',
        price: data.price,
        rating: data.rating ?? 5.0,
        age: data.age,
        tags: data.tags ?? [],
        mainPhoto: data.mainPhoto ?? '',
        gallery: data.gallery ?? [],
        megaLink: data.megaLink ?? '',
        unlockLink: data.unlockLink ?? '',
        status: data.status ?? 'active',
      },
    })
    // Revalidate so the public page reflects the new profile immediately
    revalidatePath('/palfinder')
    revalidatePath('/admin')
    return { success: true, profile }
  } catch (error: any) {
    console.error('[PalFinder] Failed to create profile:', error)
    return { success: false, error: error.message }
  }
}

/** Update an existing PalFinder profile by ID */
export async function updatePalfinderProfile(id: string, data: PalfinderProfileInput) {
  try {
    const profile = await db.palfinderProfile.update({
      where: { id },
      data: {
        name: data.name,
        location: data.location,
        bio: data.bio ?? '',
        price: data.price,
        rating: data.rating ?? 5.0,
        age: data.age,
        tags: data.tags ?? [],
        mainPhoto: data.mainPhoto ?? '',
        gallery: data.gallery ?? [],
        megaLink: data.megaLink ?? '',
        unlockLink: data.unlockLink ?? '',
        status: data.status ?? 'active',
      },
    })
    revalidatePath('/palfinder')
    revalidatePath('/admin')
    return { success: true, profile }
  } catch (error: any) {
    console.error('[PalFinder] Failed to update profile:', error)
    return { success: false, error: error.message }
  }
}

/** Delete a PalFinder profile by ID */
export async function deletePalfinderProfile(id: string) {
  try {
    await db.palfinderProfile.delete({ where: { id } })
    revalidatePath('/palfinder')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('[PalFinder] Failed to delete profile:', error)
    return { success: false, error: error.message }
  }
}
