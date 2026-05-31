'use client'

import React from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon,
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
  CheckCircleIcon,
  XCircleIcon,
  UserCheckIcon,
  ShieldAlertIcon,
  ScaleIcon,
  BadgeAlertIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

/* ─── Shared card wrapper ──────────────────────────────────────── */
function Section({
  icon,
  accentColor,
  tag,
  title,
  children,
}: {
  icon: React.ReactNode
  accentColor: string
  tag: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
      style={{ boxShadow: '0 4px 24px -4px rgba(0,0,0,0.18)' }}
    >
      {/* Header strip */}
      <div
        className="flex items-center gap-4 px-6 sm:px-8 py-6 border-b border-[var(--border)]"
        style={{ background: `${accentColor}08` }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${accentColor}14`,
            color: accentColor,
            border: `1px solid ${accentColor}28`,
            boxShadow: `0 0 16px ${accentColor}18`,
          }}
        >
          {icon}
        </div>
        <div>
          <p
            className="text-[10px] font-extrabold uppercase tracking-widest mb-0.5"
            style={{ color: accentColor }}
          >
            {tag}
          </p>
          <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)] leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 sm:px-8 py-6 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
        {children}
      </div>
    </div>
  )
}

/* ─── Do / Don't row ──────────────────────────────────────────── */
function RuleRow({
  allowed,
  children,
}: {
  allowed: boolean
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      {allowed ? (
        <CheckCircleIcon
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          style={{ color: '#00C98D' }}
        />
      ) : (
        <XCircleIcon
          className="w-4 h-4 mt-0.5 flex-shrink-0"
          style={{ color: '#D41A75' }}
        />
      )}
      <span>{children}</span>
    </li>
  )
}

/* ─── Enforcement step pill ───────────────────────────────────── */
function EnforcementStep({
  step,
  color,
  desc,
}: {
  step: string
  color: string
  desc: string
}) {
  return (
    <div
      className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]"
    >
      <div
        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
        style={{ background: color }}
      />
      <div>
        <span className="font-bold text-[var(--text)] text-sm block mb-0.5">
          {step}
        </span>
        <span className="text-[var(--text-muted)] text-sm">{desc}</span>
      </div>
    </div>
  )
}

/* ─── Prohibited content card ─────────────────────────────────── */
function ProhibitedCard({
  label,
  desc,
}: {
  label: string
  desc: string
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
      <span className="font-semibold text-[var(--text)] text-sm flex items-center gap-2">
        <XCircleIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#D41A75' }} />
        {label}
      </span>
      <span className="text-[var(--text-muted)] text-sm pl-6">{desc}</span>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[var(--bg)] text-[var(--text)] font-sans">

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-[#D41A75]/6 to-[#8E20D1]/3 filter blur-[130px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#00A3C4]/5 to-[#8E20D1]/3 filter blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-1/5 w-[600px] h-[600px] bg-gradient-to-tr from-[#8E20D1]/5 to-[#D41A75]/5 filter blur-[130px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative z-10">

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

        {/* ── Hero ─────────────────────────────────────────────── */}
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
            These guidelines apply to all users, at all times.
          </p>
        </div>

        {/* ── Core Principles Banner ───────────────────────────── */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,26,117,0.07) 0%, rgba(142,32,209,0.05) 100%)',
            border: '1px solid rgba(212,26,117,0.18)',
          }}
        >
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#8E20D1]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <HeartHandshakeIcon className="w-5 h-5 text-[#D41A75]" />
              <h2 className="text-base font-extrabold text-[var(--text)]">Our Core Principles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <UserCheckIcon className="w-4 h-4" />, label: 'Treat everyone with dignity' },
                { icon: <ShieldCheckIcon className="w-4 h-4" />, label: 'Keep each other safe' },
                { icon: <BanIcon className="w-4 h-4" />, label: 'Zero tolerance for abuse' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
                >
                  <span className="text-[#D41A75] flex-shrink-0">{icon}</span>
                  <span className="font-semibold text-[var(--text)] text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sections ─────────────────────────────────────────── */}
        <div className="space-y-5 mb-16">

          {/* 1 — Be Respectful */}
          <Section
            icon={<HeartHandshakeIcon className="w-5 h-5" />}
            accentColor="#D41A75"
            tag="Guideline 01"
            title="Be Respectful & Kind"
          >
            <p className="mb-5">
              Every person on PalFinder deserves to be treated with basic human decency — regardless of
              their background, identity, orientation, or reason for being here. Respectful interaction is
              the foundation of everything we stand for.
            </p>
            <ul className="space-y-3">
              <RuleRow allowed>Engage with empathy. Remember there is a real person behind every profile.</RuleRow>
              <RuleRow allowed>Respect boundaries. If someone says no or asks you to stop, honour that immediately.</RuleRow>
              <RuleRow allowed>Be the kind of person who makes others feel welcome.</RuleRow>
              <RuleRow allowed={false}>Harassment, hate speech, bullying, or any language designed to intimidate or belittle.</RuleRow>
              <RuleRow allowed={false}>
                Discrimination based on race, ethnicity, gender, sexual orientation, religion, or disability.
              </RuleRow>
            </ul>
          </Section>

          {/* 2 — Keep it Safe */}
          <Section
            icon={<LockIcon className="w-5 h-5" />}
            accentColor="#8E20D1"
            tag="Guideline 02"
            title="Keep It Safe"
          >
            <p className="mb-5">
              Your safety and the safety of others is our highest priority. Freedom on this platform
              requires responsibility. Non-negotiable safety rules:
            </p>
            <ul className="space-y-3">
              <RuleRow allowed={false}>
                <strong>No sharing personal information.</strong> Never post or request real names, home addresses,
                phone numbers, or financial details about yourself or others.
              </RuleRow>
              <RuleRow allowed={false}>
                <strong>No doxxing or threats.</strong> Any attempt to reveal someone's identity or threaten them
                results in immediate removal.
              </RuleRow>
              <RuleRow allowed={false}>
                <strong>No scams or fraud.</strong> Do not solicit money, promote fraudulent services, or deceive
                users for personal gain.
              </RuleRow>
              <RuleRow allowed>
                <strong>Protect yourself.</strong> Never share passwords, send money, or click suspicious links
                from strangers. Trust your instincts.
              </RuleRow>
            </ul>
          </Section>

          {/* 3 — Prohibited Content */}
          <Section
            icon={<BanIcon className="w-5 h-5" />}
            accentColor="#00A3C4"
            tag="Guideline 03"
            title="Prohibited Content"
          >
            <p className="mb-5">
              While PalFinder is an adults-only platform that embraces open expression, certain content
              is strictly forbidden with zero tolerance:
            </p>
            <div className="space-y-3">
              <ProhibitedCard
                label="Content involving minors"
                desc="Any sexual, suggestive, or exploitative content involving anyone under 18. This is reported to authorities immediately."
              />
              <ProhibitedCard
                label="Non-consensual intimate media"
                desc="Sharing or threatening to share intimate images or recordings without explicit consent."
              />
              <ProhibitedCard
                label="Violence & self-harm promotion"
                desc="Content that glorifies, encourages, or instructs real-world violence, terrorism, or self-harm."
              />
              <ProhibitedCard
                label="Illegal activity"
                desc="Solicitation or promotion of drug trafficking, weapons sales, human trafficking, or any other criminal conduct."
              />
              <ProhibitedCard
                label="Spam & commercial exploitation"
                desc="Unsolicited advertising, bot-driven mass messaging, or using the platform solely for commercial promotion."
              />
            </div>
            <p className="mt-5 text-sm">
              This list is not exhaustive. Our team reserves the right to remove any content that undermines
              the safety or integrity of the community.
            </p>
          </Section>

          {/* 4 — Reporting */}
          <Section
            icon={<FlagIcon className="w-5 h-5" />}
            accentColor="#D41A75"
            tag="Guideline 04"
            title="Reporting Violations"
          >
            <p className="mb-5">
              We rely on our community to help keep PalFinder safe. If you encounter behaviour that violates
              these guidelines, please report it. You will never face retaliation for filing a good-faith report.
            </p>

            <div className="space-y-3 mb-5">
              {[
                { num: '1', text: 'Use the Report button on any profile or within any chat session.' },
                { num: '2', text: 'Select the category that best describes the issue (harassment, inappropriate content, scam, etc.).' },
                { num: '3', text: 'Add any additional context that would help our team investigate quickly.' },
              ].map(({ num, text }) => (
                <div key={num} className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-[var(--surface2)] border border-[var(--border)]">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(212,26,117,0.15)', color: '#D41A75', border: '1px solid rgba(212,26,117,0.25)' }}
                  >
                    {num}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{text}</span>
                </div>
              ))}
            </div>

            <div
              className="flex items-start gap-3 px-4 py-3.5 rounded-2xl text-sm"
              style={{ background: 'rgba(212,26,117,0.06)', border: '1px solid rgba(212,26,117,0.15)' }}
            >
              <ShieldAlertIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#D41A75]" />
              <span className="text-[var(--text-muted)]">
                All reports are reviewed by a human moderator within <strong className="text-[var(--text)]">24 hours</strong>. Critical
                safety reports (threats, CSAM, self-harm) are escalated immediately. You can also email{' '}
                <a href="mailto:safety@palfinder.com" className="font-semibold hover:underline" style={{ color: '#D41A75' }}>
                  safety@palfinder.com
                </a>
                {' '}for urgent matters.
              </span>
            </div>
          </Section>

          {/* 5 — Consequences */}
          <Section
            icon={<GavelIcon className="w-5 h-5" />}
            accentColor="#8E20D1"
            tag="Guideline 05"
            title="Enforcement & Consequences"
          >
            <p className="mb-5">
              Violations are handled proportionally. Minor infractions receive warnings; severe or repeated
              offences lead to permanent action. We do not issue bans lightly — the safety of our community
              will always take precedence over any individual account.
            </p>
            <div className="space-y-3">
              <EnforcementStep
                step="Warning"
                color="#E8B547"
                desc="For first-time or minor infractions. You will receive a clear notice explaining which guideline was violated."
              />
              <EnforcementStep
                step="Temporary Suspension"
                color="#D41A75"
                desc="For repeated violations or moderate offences. Access is restricted for a set period depending on severity."
              />
              <EnforcementStep
                step="Permanent Ban"
                color="#8E20D1"
                desc="For serious violations such as threats, exploitation, or any abuse involving minors. Permanent and irreversible."
              />
              <EnforcementStep
                step="Legal Referral"
                color="#FF1B8D"
                desc="For criminal behaviour. We cooperate fully with law enforcement and report illegal activity to appropriate authorities."
              />
            </div>
          </Section>

        </div>

        {/* ── Contact CTA ──────────────────────────────────────── */}
        <div
          className="text-center max-w-2xl mx-auto mb-16 rounded-3xl p-6 sm:p-10 border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden"
        >
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
              If anything in these guidelines is unclear, or if you've experienced something on PalFinder
              that made you feel unsafe, we want to hear from you.
            </p>
            <a
              href="mailto:support@palfinder.com"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/60"
              style={{
                background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
                boxShadow: '0 6px 28px rgba(212,26,117,0.35)',
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
              />
              <MailIcon className="w-4 h-4" />
              Contact support@palfinder.com
            </a>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="border-t pt-10 border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #D41A75, #8E20D1)', boxShadow: '0 0 12px rgba(212,26,117,0.35)' }}
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
