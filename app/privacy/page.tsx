'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  EyeOffIcon,
  DatabaseIcon,
  TrashIcon,
  LockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  HeartIcon,
  SparklesIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

/* ── Section Component ───────────────────────────────────────── */
interface SectionProps {
  icon: React.ReactNode
  accentColor: string
  eyebrow: string
  title: string
  children: React.ReactNode
}

function Section({ icon, accentColor, eyebrow, title, children }: SectionProps) {
  return (
    <div className="mb-10 rounded-3xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
      <div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: accentColor }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
              border: `1px solid ${accentColor}25`,
            }}
          >
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: accentColor }}>
              {eyebrow}
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)] leading-tight">{title}</h2>
          </div>
        </div>
        <div className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed space-y-3">{children}</div>
      </div>
    </div>
  )
}

/* ── List rows with check/cross icon ────────────────────────── */
function ListItem({ type, children }: { type: 'yes' | 'no'; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      {type === 'yes' ? (
        <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00C98D]" />
      ) : (
        <XCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#D41A75]" />
      )}
      <span>{children}</span>
    </li>
  )
}

/* ── Privacy Policy Page ─────────────────────────────────────── */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[var(--bg)] text-[var(--text)] font-sans">

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-[#D41A75]/6 to-[#8E20D1]/3 filter blur-[130px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#00A3C4]/5 to-[#8E20D1]/3 filter blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-1/5 w-[600px] h-[600px] bg-gradient-to-tr from-[#8E20D1]/5 to-[#D41A75]/5 filter blur-[130px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">

        {/* ── Top Nav ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-12">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)] text-xs font-bold uppercase tracking-wider transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/50 px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] hover:border-[#D41A75]/25"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3.5 py-1.5 rounded-full">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-[#D41A75]" />
              <span className="text-xs font-bold text-[var(--text)] tracking-tight">Your Privacy</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* ── Hero ────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5 shadow-sm"
            style={{
              background: 'rgba(212,26,117,0.1)',
              color: '#FF1B8D',
              border: '1px solid rgba(212,26,117,0.25)',
            }}
          >
            <SparklesIcon className="w-3 h-3" /> Last updated: May 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5 max-w-2xl mx-auto">
            <span className="text-[var(--text)]">We Guard Your </span>
            <span className="text-gradient-pink">Privacy Like Our Own.</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            PalFinder was built on one non-negotiable principle: your anonymity is sacred. This policy explains,
            in plain language, exactly what we collect, what we don&rsquo;t, and why.
          </p>
        </div>

        {/* ── Quick Summary Banner ─────────────────────────────── */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,26,117,0.08) 0%, rgba(142,32,209,0.06) 100%)',
            border: '1px solid rgba(212,26,117,0.2)',
          }}
        >
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#8E20D1]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <LockIcon className="w-5 h-5 text-[#D41A75]" />
              <h2 className="text-base font-extrabold text-[var(--text)]">The Short Version</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { emoji: '🚫', label: 'We never read your chats' },
                { emoji: '👤', label: 'We never know who you are' },
                { emoji: '🗑️', label: 'We never hold onto your data' },
              ].map(({ emoji, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <span className="font-semibold text-[var(--text)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 1. Our Commitment ───────────────────────────────── */}
        <Section
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          accentColor="#D41A75"
          eyebrow="Section 1"
          title="Our Commitment to You"
        >
          <p>
            At PalFinder, privacy is not a legal checkbox — it is the entire foundation of what we built. Every
            engineering and product decision starts with the same question: <em>does this protect our users?</em>
          </p>
          <p>
            We operate under a strict data-minimisation philosophy. We only handle information that is
            technically necessary to run a safe, stable platform. Nothing more, nothing less.
          </p>
          <p>
            We will never sell, rent, barter, or otherwise transfer your information to any third party for
            commercial purposes. Your experience here is entirely between you and the platform.
          </p>
        </Section>

        {/* ── 2. What We Collect ──────────────────────────────── */}
        <Section
          icon={<DatabaseIcon className="w-5 h-5" />}
          accentColor="#8E20D1"
          eyebrow="Section 2"
          title="What We Actually Collect"
        >
          <p>
            We keep our data footprint as small as humanly possible. Here is the complete list of information
            that may be handled when you use PalFinder:
          </p>
          <ul className="space-y-2.5 mt-2">
            <ListItem type="yes">
              <strong>Session tokens</strong> — a temporary, randomly generated ID that links your browser tab
              to a chat session. It expires the moment you close the tab or disconnect.
            </ListItem>
            <ListItem type="yes">
              <strong>IP address</strong> — collected transiently for abuse prevention, bot detection, and legal
              compliance. Not stored beyond the active session.
            </ListItem>
            <ListItem type="yes">
              <strong>Anonymous usage analytics</strong> — aggregate, non-identifiable metrics such as page load
              times and feature interaction rates. This helps us improve performance.
            </ListItem>
            <ListItem type="yes">
              <strong>Safety reports</strong> — if you submit a report against another user, a minimal record of
              that report is retained solely for the purpose of moderation review.
            </ListItem>
          </ul>
        </Section>

        {/* ── 3. What We Do NOT Collect ───────────────────────── */}
        <Section
          icon={<EyeOffIcon className="w-5 h-5" />}
          accentColor="#00A3C4"
          eyebrow="Section 3"
          title="What We Will Never Collect"
        >
          <p>
            This list is just as important as what we do collect — probably more so. The following is
            information we have deliberately engineered our platform to <strong>never</strong> touch:
          </p>
          <ul className="space-y-2.5 mt-2">
            <ListItem type="no">Your real name, username, or any personal identifier</ListItem>
            <ListItem type="no">Your email address or phone number</ListItem>
            <ListItem type="no">The content of any message you send or receive</ListItem>
            <ListItem type="no">Photos, videos, or media shared during a chat session</ListItem>
            <ListItem type="no">Your device&rsquo;s location or GPS coordinates</ListItem>
            <ListItem type="no">Browsing history or behaviour outside of PalFinder</ListItem>
            <ListItem type="no">Social media profiles or connected accounts</ListItem>
            <ListItem type="no">Payment information of any kind</ListItem>
          </ul>
        </Section>

        {/* ── 4. Chat Messages ────────────────────────────────── */}
        <Section
          icon={<LockIcon className="w-5 h-5" />}
          accentColor="#D41A75"
          eyebrow="Section 4"
          title="Your Conversations Stay Yours"
        >
          <p>
            Let us be unambiguous about this: <strong>PalFinder does not store your chat messages.</strong>
          </p>
          <p>
            All conversations are relayed in real-time through our servers and immediately discarded. Once a
            session ends, the exchange ceases to exist anywhere on our infrastructure. We have no archive,
            no backup, and no log of what was said between two users.
          </p>
          <p>
            Not even our own team can retrieve or read a past conversation — because it simply does not
            exist after you leave. This is not a policy choice; it is an architectural one.
          </p>
        </Section>

        {/* ── 5. How We Use Data ──────────────────────────────── */}
        <Section
          icon={<FileTextIcon className="w-5 h-5" />}
          accentColor="#8E20D1"
          eyebrow="Section 5"
          title="How the Data We Hold Is Used"
        >
          <p>The limited data we do handle is used for two purposes only:</p>
          <ul className="space-y-2.5 mt-2">
            <ListItem type="yes">
              <strong>Platform stability &amp; performance</strong> — to diagnose technical issues, reduce
              latency, and maintain a reliable experience for all users.
            </ListItem>
            <ListItem type="yes">
              <strong>Safety &amp; legal compliance</strong> — to enforce our community guidelines, detect
              automated bots, and respond to lawful requests from authorities where legally required.
            </ListItem>
          </ul>
          <p className="mt-3">
            We do not use any data for advertising, profiling, targeting, or any form of commercial
            analysis beyond the two points above.
          </p>
        </Section>

        {/* ── 6. Data Retention ───────────────────────────────── */}
        <Section
          icon={<TrashIcon className="w-5 h-5" />}
          accentColor="#00A3C4"
          eyebrow="Section 6"
          title="How Long We Keep It"
        >
          <p>Our default stance is to retain data for the shortest technically viable window:</p>
          <div className="mt-3 space-y-3">
            {[
              { label: 'Session tokens', value: 'Deleted on disconnect or tab close' },
              { label: 'IP address logs', value: 'Purged within 24 hours of session end' },
              { label: 'Analytics data', value: 'Aggregated and anonymised within 7 days; individual signals discarded' },
              { label: 'Moderation reports', value: 'Retained for up to 90 days, then permanently deleted' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-4 py-3 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]"
              >
                <span className="font-semibold text-[var(--text)] text-sm">{label}</span>
                <span className="text-[var(--text-muted)] text-sm">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 7. Your Rights ──────────────────────────────────── */}
        <Section
          icon={<AlertTriangleIcon className="w-5 h-5" />}
          accentColor="#D41A75"
          eyebrow="Section 7"
          title="Your Rights"
        >
          <p>
            Because PalFinder is designed to be fully anonymous, we hold no personal data that can be
            linked back to you. However, we still respect the following user rights:
          </p>
          <ul className="space-y-2.5 mt-2">
            <ListItem type="yes">
              <strong>Right to access</strong> — you may request a summary of any data tied to a specific
              session if you can provide the relevant session token.
            </ListItem>
            <ListItem type="yes">
              <strong>Right to deletion</strong> — you may request that any session-linked data be
              purged ahead of our standard retention schedule.
            </ListItem>
            <ListItem type="yes">
              <strong>Right to object</strong> — you may object to any processing activity you believe
              falls outside the scope of this policy.
            </ListItem>
            <ListItem type="yes">
              <strong>Right to complain</strong> — you may lodge a complaint with the relevant data
              protection authority in your jurisdiction at any time.
            </ListItem>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, reach out to us at{' '}
            <a
              href="mailto:privacy@palfinder.com"
              className="font-semibold hover:underline"
              style={{ color: '#D41A75' }}
            >
              privacy@palfinder.com
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        {/* ── 8. Policy Changes ───────────────────────────────── */}
        <Section
          icon={<SparklesIcon className="w-5 h-5" />}
          accentColor="#8E20D1"
          eyebrow="Section 8"
          title="Changes to This Policy"
        >
          <p>
            If we ever make material changes to this Privacy Policy, we will post a clear notice on our
            homepage at least 14 days before any change takes effect. Continued use of PalFinder after
            the effective date constitutes your acceptance of the revised terms.
          </p>
          <p>
            Our core commitment — minimal data collection, no message storage, and no identity capture —
            will never change. Any revision will only serve to strengthen, not weaken, these protections.
          </p>
        </Section>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="border-t pt-10 border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #D41A75, #8E20D1)',
                    boxShadow: '0 0 12px rgba(212,26,117,0.35)',
                  }}
                >
                  <MessageCircleIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">
                  <span className="text-[var(--text)]">Pal</span>
                  <span className="text-gradient-pink"> Finder</span>
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
                The premier destination to find open-minded adults for Snapchat, Telegram, and WhatsApp. 18+ only.
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { icon: TwitterIcon, href: '#' },
                { icon: InstagramIcon, href: '#' },
                { icon: MailIcon, href: 'mailto:support@palfinder.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] transition-all hover:text-[#D41A75] hover:bg-[#D41A75]/10 hover:border-[#D41A75]/25 bg-[var(--surface)] border border-[var(--border)]"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm mb-10">
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Platform</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'About Us' },
                  { href: '/support', label: 'Support' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Service' },
                  { href: '#', label: 'Community Guidelines' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">Discover</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/snapchat', label: 'Snapchat Models' },
                  { href: '/telegram', label: 'Telegram Models' },
                  { href: '/whatsapp', label: 'WhatsApp Models' },
                  { href: '/onlyfans', label: 'OnlyFans Models' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
            <div className="text-xs text-[var(--text-subtle)]">© 2026 Pal Finder. All rights reserved.</div>
            <p className="text-xs text-[var(--text-subtle)]">18+ Adults Only</p>
          </div>
        </footer>

      </div>
    </div>
  )
}
