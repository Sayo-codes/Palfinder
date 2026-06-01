'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles } from 'lucide-react'

type Phase = 'idle' | 'loading' | 'terms' | 'chat'
type Message = { id: number; text: string; sender: 'me' | 'stranger'; time: string }

const STRANGER_RESPONSES = [
  'Hey there! 👋 How are you doing today?',
  'Nice to meet you! Where are you from?',
  'That sounds cool! What do you do for fun?',
  'Haha, I love that! Tell me more 😄',
  'I totally agree with you on that!',
  'Wow, that\'s really interesting! I\'ve never thought of it that way.',
  'Same here! We have a lot in common 🎉',
  'You seem really chill, I like talking to you!',
]

function getTimeString() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function SparkRandomChat() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [responseIndex, setResponseIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    if (phase !== 'loading') return

    setProgress(0)
    const duration = 2500 + Math.random() * 1000
    const interval = 30
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += interval
      const t = elapsed / duration
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setProgress(Math.min(eased * 100, 100))

      if (elapsed >= duration) {
        clearInterval(timer)
        setProgress(100)
        setTimeout(() => setPhase('terms'), 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase === 'chat' && messages.length === 0) {
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages([{
            id: 1,
            text: 'Hey! Nice to meet you 👋',
            sender: 'stranger',
            time: getTimeString(),
          }])
        }, 1500)
      }, 800)
    }
  }, [phase, messages.length])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    const myMsg: Message = {
      id: Date.now(),
      text,
      sender: 'me',
      time: getTimeString(),
    }
    setMessages(prev => [...prev, myMsg])
    setInput('')

    setTimeout(() => {
      setIsTyping(true)
      const delay = 1200 + Math.random() * 1800
      setTimeout(() => {
        setIsTyping(false)
        const strangerMsg: Message = {
          id: Date.now() + 1,
          text: STRANGER_RESPONSES[responseIndex % STRANGER_RESPONSES.length],
          sender: 'stranger',
          time: getTimeString(),
        }
        setMessages(prev => [...prev, strangerMsg])
        setResponseIndex(i => i + 1)
      }, delay)
    }, 400)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDisconnect = () => {
    setPhase('idle')
    setMessages([])
    setInput('')
    setTermsAccepted(false)
    setResponseIndex(0)
    setIsTyping(false)
  }

  const handleStartChat = () => {
    setPhase('loading')
  }

  const handleAcceptTerms = () => {
    if (termsAccepted) setPhase('chat')
  }

  if (phase === 'idle') {
    return (
      <button
        id="spark-random-chat-btn"
        onClick={handleStartChat}
        className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #D41A75 0%, #8E20D1 100%)',
          boxShadow: '0 4px 18px rgba(212, 26, 117, 0.35)',
        }}
      >
        <Sparkles className="w-4 h-4 opacity-90 transition-transform duration-300 group-hover:rotate-12" />
        <span>Spark a Random Chat</span>
      </button>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="flex flex-col items-center gap-8 px-6 max-w-sm w-full animate-in">
          <div className="relative w-20 h-20">
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, #E0336B 30%, #9B3ED6 60%, #00B4D8 90%, transparent 100%)',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px))',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px))',
                animationDuration: '1.2s',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(224,51,107,0.15), rgba(155,62,214,0.15))',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                ⚡
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white">Connecting to server...</h2>
            <p className="text-sm" style={{ color: 'rgba(245,240,235,0.5)' }}>Finding a secure channel for you</p>
          </div>

          <div className="w-full space-y-2">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #E0336B, #9B3ED6, #00B4D8)',
                  boxShadow: '0 0 12px rgba(224,51,107,0.5)',
                }}
              />
            </div>
            <p className="text-center text-xs font-medium" style={{ color: 'rgba(245,240,235,0.35)' }}>
              {progress < 30 ? 'Initializing...' : progress < 70 ? 'Establishing connection...' : progress < 95 ? 'Almost there...' : 'Connected!'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'terms') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden animate-in"
          style={{ background: '#16151E', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, rgba(224,51,107,0.2), rgba(155,62,214,0.2))' }}
              >
                🛡️
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Terms & Conditions</h2>
                <p className="text-xs" style={{ color: 'rgba(245,240,235,0.45)' }}>Please review before continuing</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="rounded-xl p-4 space-y-3 text-sm leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(245,240,235,0.6)' }}>
              <p>By using Spark Random Chat, you agree to:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span>Be respectful and kind to other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Not share explicit, harmful, or illegal content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Not harass, bully, or threaten other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Report any inappropriate behavior immediately</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="px-6 pb-4">
            <label className="flex items-start gap-3 cursor-pointer group" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div
                className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-200"
                style={termsAccepted
                  ? { background: 'linear-gradient(135deg, #E0336B, #9B3ED6)', boxShadow: '0 0 12px rgba(224,51,107,0.4)' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)' }
                }
              >
                {termsAccepted && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm leading-snug" style={{ color: 'rgba(245,240,235,0.7)' }}>
                I confirm I am <strong className="text-white">18+</strong> and agree to the{' '}
                <span className="text-pink-400 font-medium">Community Guidelines</span> and{' '}
                <span className="text-purple-400 font-medium">Terms of Service</span>
              </span>
            </label>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={handleDisconnect}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,240,235,0.6)' }}
            >
              Cancel
            </button>
            <button
              id="spark-terms-continue-btn"
              onClick={handleAcceptTerms}
              disabled={!termsAccepted}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: termsAccepted
                  ? 'linear-gradient(135deg, #E0336B, #9B3ED6)'
                  : 'rgba(255,255,255,0.08)',
                boxShadow: termsAccepted ? '0 0 24px rgba(224,51,107,0.35)' : 'none',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: '#0D0C12' }}>
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0"
        style={{ background: '#16151E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, rgba(224,51,107,0.25), rgba(155,62,214,0.25))', color: '#E0336B' }}
            >
              S
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2" style={{ borderColor: '#16151E', background: '#00E676' }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Stranger</h3>
            <p className="text-[11px]" style={{ color: 'rgba(245,240,235,0.4)' }}>
              {isTyping ? 'typing...' : 'Online'}
            </p>
          </div>
        </div>
        <button
          id="spark-disconnect-btn"
          onClick={handleDisconnect}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(239,68,68,0.12)',
            color: '#EF4444',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          Disconnect
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1" id="spark-chat-messages">
        <div className="flex justify-center mb-6">
          <div
            className="px-4 py-2 rounded-full text-xs font-medium text-center"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,240,235,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            🔒 You are now connected with a stranger. Say hi! 👋
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className="max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={msg.sender === 'me'
                ? {
                    background: 'linear-gradient(135deg, #E0336B, #9B3ED6)',
                    color: '#fff',
                    borderBottomRightRadius: '6px',
                    boxShadow: '0 2px 12px rgba(224,51,107,0.25)',
                  }
                : {
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(245,240,235,0.9)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderBottomLeftRadius: '6px',
                  }
              }
            >
              {msg.text}
              <span
                className="block text-[10px] mt-1 text-right"
                style={{ opacity: 0.5 }}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-2">
            <div
              className="px-4 py-3 rounded-2xl flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderBottomLeftRadius: '6px' }}
            >
              <span className="w-2 h-2 rounded-full bg-white/40" style={{ animation: 'typingDot 1.4s ease-in-out infinite' }} />
              <span className="w-2 h-2 rounded-full bg-white/40" style={{ animation: 'typingDot 1.4s ease-in-out 0.2s infinite' }} />
              <span className="w-2 h-2 rounded-full bg-white/40" style={{ animation: 'typingDot 1.4s ease-in-out 0.4s infinite' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="flex-shrink-0 px-4 sm:px-6 py-3"
        style={{ background: '#16151E', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            id="spark-chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200 focus:ring-1"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              caretColor: '#E0336B',
            }}
            autoComplete="off"
          />
          <button
            id="spark-send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, #E0336B, #9B3ED6)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: input.trim() ? '0 0 16px rgba(224,51,107,0.3)' : 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        input:focus {
          border-color: rgba(224, 51, 107, 0.4) !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(224, 51, 107, 0.2) !important;
        }
      `}} />
    </div>
  )
}
