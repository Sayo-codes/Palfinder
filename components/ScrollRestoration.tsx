'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ScrollRestoration() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const scrollPositions = useRef<{ [key: string]: number }>({})
  const isRestoring = useRef(false)
  const cancelRestoration = useRef(false)

  // Prevent browser's automatic scroll restoration to avoid conflicts
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Load saved scroll positions from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('scroll-positions')
      if (saved) {
        scrollPositions.current = JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load scroll positions:', e)
    }
  }, [])

  // Listen to scroll events to save position (debounced)
  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleScroll = () => {
      if (isRestoring.current) return

      const key = window.location.pathname + window.location.search
      const currentScroll = window.scrollY

      clearTimeout(timer)
      timer = setTimeout(() => {
        if (isRestoring.current) return
        scrollPositions.current[key] = currentScroll
        try {
          sessionStorage.setItem('scroll-positions', JSON.stringify(scrollPositions.current))
        } catch (e) {}
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [pathname, searchParams])

  // Cancel restoration loop if the user starts interacting manually
  useEffect(() => {
    const handleUserInteraction = () => {
      if (isRestoring.current) {
        cancelRestoration.current = true
      }
    }

    const events = ['wheel', 'touchmove', 'keydown', 'mousedown']
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true })
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [])

  // Restore scroll position when route changes
  useEffect(() => {
    const key = window.location.pathname + window.location.search
    const targetY = scrollPositions.current[key]

    if (targetY !== undefined && targetY > 0) {
      isRestoring.current = true
      cancelRestoration.current = false

      let attempts = 0
      const maxAttempts = 40 // Try for up to 2 seconds (40 * 50ms)

      const performScroll = () => {
        if (cancelRestoration.current) {
          isRestoring.current = false
          return
        }

        const html = document.documentElement
        const prevScrollBehavior = html.style.scrollBehavior
        
        // Temporarily set scroll behavior to auto to force instant jump
        html.style.scrollBehavior = 'auto'
        window.scrollTo(0, targetY)

        // Restore previous scroll-behavior (e.g. smooth) on next animation frame
        requestAnimationFrame(() => {
          html.style.scrollBehavior = prevScrollBehavior
        })

        const currentY = window.scrollY
        const maxScrollable = html.scrollHeight - window.innerHeight

        const reachedTarget = Math.abs(currentY - targetY) < 10
        const cannotScrollFurther = currentY >= maxScrollable && targetY > maxScrollable + 10

        // If we haven't reached target scroll and page height is currently clamping us,
        // it means page content is still loading or rendering. Keep trying.
        if (!reachedTarget && cannotScrollFurther && attempts < maxAttempts) {
          attempts++
          setTimeout(performScroll, 50)
        } else {
          isRestoring.current = false
        }
      }

      // Small initial delay to align with Next.js navigation transition
      const timer = setTimeout(performScroll, 50)
      return () => {
        clearTimeout(timer)
        isRestoring.current = false
      }
    } else {
      isRestoring.current = false
    }
  }, [pathname, searchParams])

  return null
}
