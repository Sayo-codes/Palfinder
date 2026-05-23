import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Lazy singleton — the Pool is NOT created at import time.
// This prevents pg from trying to parse DATABASE_URL during Next.js build
// when the env var is not yet available.
let _db: PrismaClient | undefined

function getDb(): PrismaClient {
  if (_db) return _db

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  _db = new PrismaClient({ adapter })
  return _db
}

// Re-use the same instance in dev to avoid exhausting connections on hot reload
declare global {
  var prismaGlobal: PrismaClient | undefined
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = globalThis.prismaGlobal ?? (globalThis.prismaGlobal = getDb())
    return (client as any)[prop]
  },
})

export const prisma = db

