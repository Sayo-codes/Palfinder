import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#05050A] flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, #D41A75, #8E20D1)',
          boxShadow: '0 0 20px rgba(212,26,117,0.4)',
        }}>
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <p className="text-white/60 font-semibold tracking-widest text-sm animate-pulse">
        LOADING...
      </p>
    </div>
  )
}
