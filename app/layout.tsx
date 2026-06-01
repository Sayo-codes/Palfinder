import type { Metadata } from 'next'
import './globals.css'
import { Suspense } from 'react'
import ThemeProvider from '@/components/ThemeProvider'
import ScrollRestoration from '@/components/ScrollRestoration'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PalFinder Admin',
  description: 'Admin panel for PalFinder – manage profiles, platforms & members.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!sessionStorage.getItem('theme-session-started')) {
                  sessionStorage.setItem('theme-session-started', 'true');
                  localStorage.removeItem('theme');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen transition-colors duration-300 font-sans overflow-x-hidden max-w-full bg-[var(--bg)]">
        <ThemeProvider>
          <Suspense fallback={null}>
            <ScrollRestoration />
          </Suspense>
          <main className="relative w-full max-w-full overflow-x-hidden min-h-screen flex flex-col items-center justify-start">
            <div className="w-full flex-grow flex flex-col">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
