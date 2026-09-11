// app/(pages)/board/OverviewActivityChart.tsx
'use client'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { ServiceRequest } from '@/lib/types'

function localDayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function OverviewActivityChart({ requests }: { requests: ServiceRequest[] }) {
  const data = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const days: Date[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      days.push(d)
    }
    const dayKeys = days.map(localDayKey)
    const submitted: Record<string, number> = {}
    const closed: Record<string, number> = {}
    dayKeys.forEach((k) => { submitted[k] = 0; closed[k] = 0 })

    requests.forEach((r) => {
      if (r.submitted_date) {
        const k = localDayKey(new Date(r.submitted_date))
        if (k in submitted) submitted[k] += 1
      }
      if (r.closed_date) {
        const k = localDayKey(new Date(r.closed_date))
        if (k in closed) closed[k] += 1
      }
    })

    return dayKeys.map((k, i) => ({
      label: days[i].toLocaleDateString(undefined, { weekday: 'narrow' }),
      submitted: submitted[k],
      closed: closed[k],
    }))
  }, [requests])

  const weekSubmitted = data.reduce((sum, d) => sum + d.submitted, 0)
  const weekClosed = data.reduce((sum, d) => sum + d.closed, 0)

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm font-medium text-slate-500">Last 7 days</p>
        <p className="text-xs text-slate-700">
          <span className="text-blue-600 font-medium">{weekSubmitted} submitted</span>
          {' · '}
          <span className="text-emerald-600 font-medium">{weekClosed} closed</span>
        </p>
      </div>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={data} barGap={3} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="submitted" fill="#2563eb" radius={[2, 2, 0, 0]} barSize={8} />
          <Bar dataKey="closed" fill="#16a34a" radius={[2, 2, 0, 0]} barSize={8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}