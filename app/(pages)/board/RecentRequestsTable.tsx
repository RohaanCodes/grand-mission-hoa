// app/(pages)/board/RecentRequestsTable.tsx
'use client'
import Link from 'next/link'
import type { ServiceRequest } from '@/lib/types'

const STATUS_COLOR: Record<string, string> = {
  New: '#64748b',
  'Agent In Progress': '#d97706',
  'Awaiting Management Response': '#2563eb',
  'Awaiting Resident Info': '#9333ea',
  'Board Notified': '#d97706',
  Resolved: '#16a34a',
  Closed: '#16a34a',
  'Closed (AI)': '#16a34a',
}

export default function RecentRequestsTable({
  requests,
  basePath,
}: {
  requests: ServiceRequest[]
  basePath: '/board' | '/management'
}) {
  const recent = [...requests]
    .sort((a, b) => new Date(b.submitted_date || 0).getTime() - new Date(a.submitted_date || 0).getTime())
    .slice(0, 6)

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Link href={`${basePath}/requests`} className="text-xs font-medium text-blue-600 hover:text-blue-700">
          View all →
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-600 font-medium border-b border-slate-200">
            <th className="pb-2 font-medium">Category</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium text-right">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {recent.map((r) => {
            const color = STATUS_COLOR[r.status || 'New'] || '#64748b'
            return (
              <tr key={r.id}>
                <td className="py-2.5 text-slate-700 font-medium truncate max-w-[180px]">
                  {r.final_category || r.category_resident_selected || 'Other'}
                </td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {r.status || 'New'}
                  </span>
                </td>
                <td className="py-2.5 text-right text-slate-600 text-xs">
                  {r.submitted_date
                    ? new Date(r.submitted_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}