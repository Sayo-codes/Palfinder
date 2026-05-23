import { prisma } from '@/lib/prisma'
import { ClipboardListIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

// ─── Relative-time helper ─────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 10)  return 'Just now'
  if (seconds < 60)  return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)  return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)    return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

// ─── Input-type badge ─────────────────────────────────────────────────────────

const TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  card_payment: { bg: 'rgba(232,181,71,0.12)', color: '#E8B547',  label: 'Card Payment' },
  search:       { bg: 'rgba(99,179,237,0.12)', color: '#63B3ED',  label: 'Search'       },
  contact:      { bg: 'rgba(104,211,145,0.12)',color: '#68D391',  label: 'Contact'      },
  other:        { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', label: 'Other' },
}

function TypeBadge({ type }: { type: string }) {
  const s = TYPE_STYLES[type] ?? TYPE_STYLES.other
  return (
    <span
      className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function InputLogsPage() {
  const logs = await prisma.userInputLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(232,181,71,0.1)', color: '#E8B547' }}
        >
          <ClipboardListIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Input Logs</h1>
          <p className="text-xs text-white/40 mt-0.5">
            {logs.length} entr{logs.length === 1 ? 'y' : 'ies'} · newest first
          </p>
        </div>
      </div>

      {/* Table card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {logs.length === 0 ? (

          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <ClipboardListIcon className="w-7 h-7 text-white/20" />
            </div>
            <p className="text-sm font-semibold text-white/40">No inputs yet</p>
            <p className="text-xs text-white/25">
              Logs will appear here once users submit forms.
            </p>
          </div>

        ) : (

          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Time', 'Value', 'Page', 'Type'].map(h => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom:
                        i < logs.length - 1
                          ? '1px solid rgba(255,255,255,0.04)'
                          : 'none',
                    }}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Time */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-white/50 text-xs font-mono">
                        {timeAgo(log.createdAt)}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <span
                        className="block text-white/80 truncate"
                        title={log.value}
                      >
                        {log.value}
                      </span>
                    </td>

                    {/* Page */}
                    <td className="px-5 py-3.5">
                      <span className="text-white/40 font-mono text-xs truncate block max-w-[200px]" title={log.page}>
                        {log.page}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-3.5">
                      <TypeBadge type={log.inputType} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )}
      </div>
    </div>
  )
}
