'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  HeartHandshakeIcon,
  LockIcon,
  AlertTriangleIcon,
  BanIcon,
  FlagIcon,
  GavelIcon,
  SparklesIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

/* ── Accordion Item ──────────────────────────────────────────── */
interface AccordionItemProps {
  icon: React.ReactNode
  accentColor: string
  number: string
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({
  icon,
  accentColor,
  number,
  title,
  children,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div
      className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden transition-all duration-300"
      style={{
        borderColor: isOpen ? `${accentColor}30` : 'var(--border)',
        boxShadow: isOpen
          ? `0 8px 32px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px ${accentColor}10`
          : 'none',
      }}
    >
      {/* Accent glow — visible when open */}
      <div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
        style={{
          background: accentColor,
          opacity: isOpen ? 0.08 : 0,
        }}
      />

      {/* Header / Toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-6 sm:p-8 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/50 focus-visible:ring-inset rounded-3xl"
        aria-expanded={isOpen}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `${accentColor}12`,
            color: accentColor,
            border: `1px solid ${accentColor}25`,
            boxShadow: isOpen ? `0 0 18px ${accentColor}20` : 'none',
          }}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5"
            style={{ color: accentColor }}
          >
            {number}
          </p>
          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)] leading-tight truncate">
            {title}
          </h2>
        </div>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-[var(--surface2)] border border-[var(--border)] group-hover:border-[var(--card-hover-border)]"
        >
          <ChevronDownIcon
            className="w-4 h-4 text-[var(--text-muted)] transition-transform duration-300"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {/* Content */}
      <div
        className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          maxHeight: isOpen ? '600px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
          <div className="h-px bg-[var(--border)] mb-6" />
          <div className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed space-y-3 relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Community Guidelines Page ───────────────────────────────── */
export default function CommunityGuidelinesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
              <span className="text-xs font-bold text-[var(--text)] tracking-tight">Community</span>
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
            <SparklesIcon className="w-3 h-3" /> Building a Safe Community
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5 max-w-2xl mx-auto">
            <span className="text-[var(--text)]">Our </span>
            <span className="text-gradient-pink">Community Guidelines.</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            PalFinder thrives when every member feels safe, respected, and free to be themselves.
            These guidelines exist to protect that experience for everyone. Please read them
            carefully — they apply to all users, at all times.
          </p>
        </div>

        {/* ── Quick Principles Banner ────────────────────────── */}
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
              <HeartHandshakeIcon className="w-5 h-5 text-[#D41A75]" />
              <h2 className="text-base font-extrabold text-[var(--text)]">Our Core Principles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { emoji: '🤝', label: 'Treat everyone with dignity' },
                { emoji: '🛡️', label: 'Keep each other safe' },
                { emoji: '🚫', label: 'Zero tolerance for abuse' },
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

        {/* ── Accordion Sections ─────────────────────────────── */}
        <div className="space-y-4 mb-16">

          {/* 1 — Be Respectful */}
          <AccordionItem
            icon={<HeartHandshakeIcon className="w-5 h-5" />}
            accentColor="#D41A75"
            number="Guideline 01"
            title="Be Respectful & Kind"
            isOpen={openIndex === 0}
            onToggle={() => toggle(0)}
          >
            <p>
              Every person on PalFinder deserves to be treated with basic human decency — regardless of their
              background, identity, orientation, or reason for being here. Respectful interaction is
              the foundation of everything we stand for.
            </p>
            <p>
              <strong>What this means in practice:</strong>
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#00C98D] mt-0.5 flex-shrink-0">✓</span>
                <span>Engage with empathy. Remember there is a real person behind every profile.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#00C98D] mt-0.5 flex-shrink-0">✓</span>
                <span>Respect boundaries. If someone says no or asks you to stop, honour that immediately.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#00C98D] mt-0.5 flex-shrink-0">✓</span>
                <span>Avoid harassment, hate speech, bullying, or any language designed to intimidate or belittle.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#D41A75] mt-0.5 flex-shrink-0">✗</span>
                <span>Discrimination based on race, ethnicity, gender, sexual orientation, religion, or disability will not be tolerated under any circumstances.</span>
              </li>
            </ul>
            <p>
              We are an open-minded community, but open-mindedness never excuses cruelty. Be the kind of
              person who makes others feel welcome.
            </p>
          </AccordionItem>

          {/* 2 — Keep it Safe */}
          <AccordionItem
            icon={<LockIcon className="w-5 h-5" />}
            accentColor="#8E20D1"
            number="Guideline 02"
            title="Keep It Safe"
            isOpen={openIndex === 1}
            onToggle={() => toggle(1)}
          >
            <p>
              Your safety and the safety of others is our highest priority. PalFinder is built to be
              a space where adults can connect freely — but freedom requires responsibility.
            </p>
            <p>
              <strong>Non-negotiable safety rules:</strong>
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#D41A75] mt-0.5 flex-shrink-0">✗</span>
                <span><strong>No sharing of personal information.</strong> Never post or request real names, home addresses, phone numbers, financial details, or any identifying information about yourself or others.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#D41A75] mt-0.5 flex-shrink-0">✗</span>
                <span><strong>No doxxing or threats.</strong> Any attempt to reveal someone&rsquo;s identity, track their location, or threaten them in any way will result in immediate removal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#D41A75] mt-0.5 flex-shrink-0">✗</span>
                <span><strong>No scams or fraud.</strong> Do not attempt to solicit money, promote fraudulent services, or deceive other users for personal gain.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#00C98D] mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Protect yourself.</strong> Never share passwords, send money, or click suspicious links from strangers. Trust your instincts.</span>
              </li>
            </ul>
            <p>
              If something feels wrong, it probably is. Use the report feature immediately and our
              moderation team will investigate.
            </p>
          </AccordionItem>

          {/* 3 — No Inappropriate Content */}
          <AccordionItem
            icon={<BanIcon className="w-5 h-5" />}
            accentColor="#00A3C4"
            number="Guideline 03"
            title="Prohibited Content"
            isOpen={openIndex === 2}
            onToggle={() => toggle(2)}
          >
            <p>
              While PalFinder is an adults-only platform that embraces open expression, there are
              clear lines that must never be crossed. The following content is strictly forbidden
              and will be met with zero tolerance:
            </p>
            <div className="mt-3 space-y-3">
              {[
                {
                  label: 'Content involving minors',
                  desc: 'Any sexual, suggestive, or exploitative content involving anyone under 18. This is reported to authorities immediately.',
                },
                {
                  label: 'Non-consensual intimate media',
                  desc: 'Sharing or threatening to share intimate images or recordings of someone without their explicit consent.',
                },
                {
                  label: 'Violence & self-harm promotion',
                  desc: 'Content that glorifies, encourages, or instructs real-world violence, terrorism, or self-harm.',
                },
                {
                  label: 'Illegal activity',
                  desc: 'Solicitation or promotion of drug trafficking, weapons sales, human trafficking, or any other criminal conduct.',
                },
                {
                  label: 'Spam & commercial exploitation',
                  desc: 'Unsolicited advertising, bot-driven mass messaging, or using the platform solely for commercial promotion.',
                },
              ].map(({ label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 px-4 py-3 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]"
                >
                  <span className="font-semibold text-[var(--text)] text-sm flex items-center gap-2">
                    <span className="text-[#D41A75]">✗</span> {label}
                  </span>
                  <span className="text-[var(--text-muted)] text-sm">{desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-3">
              This list is not exhaustive. Our moderation team reserves the right to remove any
              content that undermines the safety or integrity of the community, even if it is not
              explicitly listed above.
            </p>
          </AccordionItem>

          {/* 4 — Reporting Users */}
          <AccordionItem
            icon={<FlagIcon className="w-5 h-5" />}
            accentColor="#D41A75"
            number="Guideline 04"
            title="Reporting Violations"
            isOpen={openIndex === 3}
            onToggle={() => toggle(3)}
          >
            <p>
              We rely on our community to help keep PalFinder safe. If you encounter behaviour
              that violates these guidelines, we strongly encourage you to report it. You will never
              face retaliation for filing a good-faith report.
            </p>
            <p>
              <strong>How to report:</strong>
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#D41A75] mt-0.5 flex-shrink-0 font-bold text-sm">1.</span>
                <span>Use the <strong>Report</strong> button available on every profile and within every chat session.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#D41A75] mt-0.5 flex-shrink-0 font-bold text-sm">2.</span>
                <span>Select the category that best describes the issue (harassment, inappropriate content, scam, etc.).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#D41A75] mt-0.5 flex-shrink-0 font-bold text-sm">3.</span>
                <span>Add any additional context that would help our team investigate. The more detail, the faster we can act.</span>
              </li>
            </ul>
            <div
              className="mt-4 px-4 py-3 rounded-2xl text-sm"
              style={{
                background: 'rgba(212,26,117,0.06)',
                border: '1px solid rgba(212,26,117,0.15)',
              }}
            >
              <span className="font-semibold text-[var(--text)]">⚡ Rapid response:</span>{' '}
              <span className="text-[var(--text-muted)]">
                All reports are reviewed by a human moderator, typically within 24 hours. Critical
                safety reports (threats, CSAM, self-harm) are escalated immediately.
              </span>
            </div>
            <p className="mt-3">
              You can also reach our trust &amp; safety team directly at{' '}
              <a
                href="mailto:safety@palfinder.com"
                className="font-semibold hover:underline"
                style={{ color: '#D41A75' }}
              >
                safety@palfinder.com
              </a>{' '}
              for urgent matters.
            </p>
          </AccordionItem>

          {/* 5 — Consequences */}
          <AccordionItem
            icon={<GavelIcon className="w-5 h-5" />}
            accentColor="#8E20D1"
            number="Guideline 05"
            title="Enforcement & Consequences"
            isOpen={openIndex === 4}
            onToggle={() => toggle(4)}
          >
            <p>
              Violations of these guidelines are taken seriously. Our moderation approach is
              proportional — minor infractions receive warnings, while severe or repeated offences
              lead to permanent action.
            </p>
            <p>
              <strong>Our enforcement ladder:</strong>
            </p>
            <div className="mt-3 space-y-3">
              {[
                {
                  step: 'Warning',
                  color: '#E8B547',
                  desc: 'For first-time or minor infractions. You will receive a clear notice explaining which guideline was violated and what to do differently.',
                },
                {
                  step: 'Temporary Suspension',
                  color: '#D41A75',
                  desc: 'For repeated violations or moderate offences. Your access will be restricted for a set period. The duration depends on the severity.',
                },
                {
                  step: 'Permanent Ban',
                  color: '#8E20D1',
                  desc: 'For serious violations such as threats, exploitation, or any form of abuse involving minors. Permanent bans are irreversible.',
                },
                {
                  step: 'Legal Referral',
                  color: '#D41A75',
                  desc: 'For criminal behaviour. We will cooperate fully with law enforcement and report illegal activity to the appropriate authorities.',
                },
              ].map(({ step, color, desc }) => (
                <div
                  key={step}
                  className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: color }}
                  />
                  <div>
                    <span className="font-semibold text-[var(--text)] text-sm block">{step}</span>
                    <span className="text-[var(--text-muted)] text-sm">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3">
              We do not issue bans lightly, and we strive to be fair in every decision. However,
              the safety of our community will always take precedence over any individual account.
            </p>
          </AccordionItem>
        </div>

        {/* ── Contact CTA ────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 rounded-3xl p-6 sm:p-10 border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D41A75]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(212,26,117,0.12) 0%, rgba(142,32,209,0.08) 100%)',
                border: '1px solid rgba(212,26,117,0.2)',
              }}
            >
              <AlertTriangleIcon className="w-6 h-6 text-[#D41A75]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-[var(--text)]">
              Questions or Concerns?
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-6">
              If anything in these guidelines is unclear, or if you have experienced something on PalFinder
              that made you feel unsafe, we want to hear from you. Our team is here to help.
            </p>
            <a
              href="mailto:support@palfinder.com"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/60"
              style={{
                background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
                boxShadow: '0 6px 28px rgba(212,26,117,0.35)',
              }}
            >
              {/* shimmer sweep */}
              <span
                className="pointer-events-none absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                }}
              />
              <MailIcon className="w-4 h-4" />
              Contact support@palfinder.com
            </a>
          </div>
        </div>

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
                  { href: '/community-guidelines', label: 'Community Guidelines' },
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
