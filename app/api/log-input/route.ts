import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/log-input
 * ════════════════════
 * Receives a single input log entry from useInputLogger and
 * saves it to the UserInputLog table.
 *
 * Body: { value, page, pageUrl, inputType }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { value, page, pageUrl, inputType } = body

    // Basic validation
    if (!value || typeof value !== 'string' || value.trim().length < 2) {
      return NextResponse.json({ ok: false, error: 'Value too short' }, { status: 400 })
    }

    await prisma.userInputLog.create({
      data: {
        value:     value.trim().slice(0, 1000), // cap at 1000 chars
        page:      (page    ?? pageUrl ?? 'unknown').slice(0, 200),
        inputType: (inputType ?? 'other').slice(0, 50),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Never surface DB errors to the client
    console.error('[log-input]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
