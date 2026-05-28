'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  MailIcon,
  TicketIcon,
  SparklesIcon,
  TwitterIcon,
  InstagramIcon,
  SendIcon,
  ShieldCheckIcon,
  HelpCircleIcon,
  LifeBuoyIcon,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

/* ── FAQ Data ──────────────────────────────────────────────── */
const faqs = [
  {
    q: 'Is this anonymous chat platform completely private?',
    a: 'Yes. Your identity is never shared with other users. We use end-to-end privacy practices so that your conversations remain confidential. No personal information is disclosed unless you choose to share it yourself.',
  },
  {
    q: 'How do I report inappropriate behavior?',
    a: 'You can report any user directly from the chat interface using the one-click report button. Our moderation team reviews every report within 24 hours and takes swift action, including permanent bans for serious violations.',
  },
  {
    q: 'Are my conversations monitored?',
    a: 'We do not read or store the content of your private conversations. Automated safety filters scan for harmful content patterns (such as CSAM or spam), but human moderators never access your chat history unless a report is filed.',
  },
  {
    q: 'Do you offer video chat?',
    a: 'Currently, PalFinder focuses on text-based chat and profile browsing. Video chat is on our roadmap and will be introduced in a future update with full moderation and safety features built in.',
  },
  {
    q: 'Can I reconnect with someone I chatted with?',
    a: 'If both users have added each other\'s profile details, you can reconnect through the platform pages (Snapchat, Telegram, WhatsApp, etc.). Random chat sessions are anonymous by design and cannot be replayed.',
  },
  {
    q: 'What happens if I violate community guidelines?',
    a: 'Depending on the severity, violations may result in a warning, temporary suspension, or permanent ban. We take harassment, spam, and underage impersonation extremely seriously. Repeated offenses lead to an immediate and irreversible account termination.',
  },
]

/* ── Accordion Item ────────────────────────────────────────── */
interface AccordionItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  return (
    <div
      className="group rounded-2xl transition-all duration-300 bg-[var(--surface)] border border-[var(--border)] overflow-hidden hover:border-[#D41A75]/25"
      style={{
        boxShadow: isOpen
          ? '0 12px 30px -4px rgba(0,0,0,0.3), 0 0 20px -2px rgba(212,26,117,0.06)'
          : '0 2px 12px -2px rgba(0,0,0,0.1)',
      }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/40 rounded-2xl transition-colors"
      >
        <span className="text-sm sm:text-base font-bold text-[var(--text)] leading-snug pr-2 transition-colors duration-200 group-hover:text-[var(--text)]">
          {question}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: isOpen ? 'rgba(212,26,117,0.12)' : 'rgba(255,255,255,0.03)',
            border: isOpen ? '1px solid rgba(212,26,117,0.25)' : '1px solid var(--border)',
          }}
        >
          <ChevronDownIcon
            className="w-4 h-4 transition-transform duration-300"
            style={{
              color: isOpen ? '#D41A75' : 'var(--text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-5 pt-0">
            <div className="h-px w-full mb-4 bg-[var(--border)]" />
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Support Card ──────────────────────────────────────────── */
interface SupportCardProps {
  icon: React.ReactNode
  title: string
  description: string
  accentColor: string
  cta: string
  ctaHref: string
}

function SupportCard({
  icon,
  title,
  description,
  accentColor,
  cta,
  ctaHref,
}: SupportCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:-translate-y-1 bg-[var(--surface)] border border-[var(--border)]"
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)`,
        borderColor: isHovered ? `${accentColor}40` : 'var(--border)',
        boxShadow: isHovered
          ? `0 12px 32px -4px rgba(0, 0, 0, 0.4), 0 0 24px -2px ${accentColor}18`
          : `0 4px 20px -2px rgba(0, 0, 0, 0.15)`,
      }}
    >
      {/* Background accent blob */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 transition-all duration-500 group-hover:opacity-15 group-hover:scale-125 blur-2xl pointer-events-none"
        style={{ background: accentColor }}
      />

      <div className="flex items-start gap-4 relative z-10">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `${accentColor}12`,
            color: accentColor,
            boxShadow: isHovered ? `0 0 20px ${accentColor}30` : `0 0 12px ${accentColor}10`,
            border: `1px solid ${accentColor}20`,
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[var(--text)] leading-tight group-hover:text-[var(--text)] transition-colors">
            {title}
          </h3>
          <p className="text-[var(--text-muted)] text-xs mt-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <a
        href={ctaHref}
        className="relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.01] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-white"
        style={{
          background: `linear-gradient(135deg, ${accentColor}dd 0%, ${accentColor}ff 100%)`,
          boxShadow: isHovered
            ? `0 6px 20px ${accentColor}35`
            : `0 4px 12px ${accentColor}15`,
        }}
      >
        <span>{cta}</span>
      </a>
    </div>
  )
}

/* ── Main Support Page ─────────────────────────────────────── */
export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    issueType: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would POST to an API endpoint
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormState({ name: '', email: '', issueType: '', message: '' })
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[var(--bg)] text-[var(--text)] font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#D41A75]/10 to-[#8E20D1]/5 filter blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#00A3C4]/8 to-[#8E20D1]/5 filter blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-[#8E20D1]/8 to-[#D41A75]/8 filter blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10">

        {/* ── Top Nav ────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-10">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)] text-xs font-bold uppercase tracking-wider transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/50 px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] hover:border-[#D41A75]/25"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3.5 py-1.5 rounded-full">
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-[#D41A75]">
                <LifeBuoyIcon className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-[var(--text)] tracking-tight">Support Center</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* ── Hero ───────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-5 shadow-sm"
            style={{
              background: 'rgba(212,26,117,0.1)',
              color: '#FF1B8D',
              border: '1px solid rgba(212,26,117,0.25)',
            }}
          >
            <SparklesIcon className="w-3 h-3" /> Help Center · 24/7 Support
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-4">
            <span className="text-[var(--text)]">We&rsquo;re Here to </span>
            <span className="text-gradient-pink font-extrabold">Help</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Got a question about your anonymous chat experience? Browse our FAQs, reach out through
            our support channels, or submit a ticket — we&rsquo;ll get back to you fast.
          </p>
        </div>

        {/* ── Support Channels ──────────────────────────────── */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D41A75]/20" />
            <span className="text-xs font-extrabold tracking-widest text-[var(--text-muted)] uppercase flex items-center gap-1.5">
              <HelpCircleIcon className="w-3.5 h-3.5 text-[#D41A75]" /> Support Channels
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D41A75]/20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SupportCard
              icon={<MailIcon className="w-5 h-5" />}
              title="Email Support"
              description="Send us a detailed message and our dedicated team will respond within 24 hours."
              accentColor="#D41A75"
              cta="Send Email"
              ctaHref="mailto:support@palfinder.com"
            />
            <SupportCard
              icon={<TicketIcon className="w-5 h-5" />}
              title="Raise a Ticket"
              description="Submit a support ticket below and our automated queue will assign a representative."
              accentColor="#8E20D1"
              cta="Open Ticket ↓"
              ctaHref="#contact-form"
            />
            <SupportCard
              icon={<MessageCircleIcon className="w-5 h-5" />}
              title="Social Support"
              description="Reach us on Twitter or Instagram for community help, news, and live updates."
              accentColor="#00A3C4"
              cta="Follow Us"
              ctaHref="#"
            />
          </div>
        </div>

        {/* ── FAQ Section ───────────────────────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              <span className="text-[var(--text)]">Frequently Asked </span>
              <span className="text-gradient-pink">Questions</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Everything you need to know about using PalFinder safely and privately.
            </p>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* ── Contact Form ──────────────────────────────────── */}
        <div className="mb-16 scroll-mt-24" id="contact-form">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              <span className="text-[var(--text)]">Submit a </span>
              <span className="text-gradient-pink">Support Ticket</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Describe your issue in detail and our support agents will respond as quickly as possible.
            </p>
          </div>

          <div
            className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--border)] transition-colors relative"
            style={{
              boxShadow: '0 8px 32px -4px rgba(0,0,0,0.2), 0 0 20px -4px rgba(212,26,117,0.04)',
            }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{
                    background: 'linear-gradient(135deg, #D41A75, #8E20D1)',
                    boxShadow: '0 8px 28px rgba(212,26,117,0.3)',
                  }}
                >
                  <ShieldCheckIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">Ticket Submitted!</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
                  Thank you for reaching out. Our support team will review your ticket and respond
                  within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none transition-all focus:border-[#D41A75]/50 focus:ring-2 focus:ring-[#D41A75]/10"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none transition-all focus:border-[#D41A75]/50 focus:ring-2 focus:ring-[#D41A75]/10"
                    />
                  </div>
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Issue Type
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formState.issueType}
                      onChange={(e) => setFormState({ ...formState, issueType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] outline-none transition-all focus:border-[#D41A75]/50 focus:ring-2 focus:ring-[#D41A75]/10 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[var(--surface2)]">
                        Select an issue type…
                      </option>
                      <option value="account" className="bg-[var(--surface2)]">Account Issue</option>
                      <option value="safety" className="bg-[var(--surface2)]">Safety / Report Abuse</option>
                      <option value="billing" className="bg-[var(--surface2)]">Billing / Payment</option>
                      <option value="technical" className="bg-[var(--surface2)]">Technical / Bug</option>
                      <option value="feedback" className="bg-[var(--surface2)]">Feedback / Suggestion</option>
                      <option value="other" className="bg-[var(--surface2)]">Other</option>
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)] pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe your issue in detail…"
                    className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none transition-all focus:border-[#D41A75]/50 focus:ring-2 focus:ring-[#D41A75]/10 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-bold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41A75]/60"
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
                  <SendIcon className="w-4 h-4" />
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer className="border-t pt-10 border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
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
                The premier destination to find open-minded adults for Snapchat, Telegram, and
                WhatsApp. 18+ only.
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
              <h4 className="font-bold text-[var(--text)] mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'Home' },
                  { href: '#', label: 'Start Chatting' },
                  { href: '#', label: 'Blogs' },
                  { href: '/about', label: 'About Us' },
                  { href: '/support', label: 'Support' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '#', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Service' },
                  { href: '#', label: 'Guidelines' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] mb-3 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Discover
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/', label: 'All Models' },
                  { href: '/snapchat', label: 'Snapchat Models' },
                  { href: '/telegram', label: 'Telegram Models' },
                  { href: '/whatsapp', label: 'WhatsApp Models' },
                  { href: '/onlyfans', label: 'OnlyFans Models' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm"
                    >
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
