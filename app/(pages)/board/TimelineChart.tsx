// app/(pages)/board/TimelineChart.tsx
'use client'
import { useMemo } from 'react'
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { ServiceRequest } from '@/lib/types'

// Uses local date components (getFullYear/getMonth/getDate) rather than
// toISOString(), which forces UTC and shifts evening submissions into the
// next calendar day for any timezone behind UTC.
function localDayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function TimelineChart({ requests }: { requests: ServiceRequest[] }) {
  const days = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const list: Date[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      list.push(d)
    }
    return list
  }, [])

  const chartData = useMemo(() => {
    const dayKeys = days.map(localDayKey)
    const submittedByDay: Record<string, number> = {}
    const closedByDay: Record<string, number> = {}
    dayKeys.forEach((k) => {
      submittedByDay[k] = 0
      closedByDay[k] = 0
    })

    requests.forEach((r) => {
      if (r.submitted_date) {
        const k = localDayKey(new Date(r.submitted_date))
        if (k in submittedByDay) submittedByDay[k] += 1
      }
      if (r.closed_date) {
        const k = localDayKey(new Date(r.closed_date))
        if (k in closedByDay) closedByDay[k] += 1
      }
    })

    let cumSubmitted = 0
    let cumClosed = 0
    return dayKeys.map((k, i) => {
      cumSubmitted += submittedByDay[k]
      cumClosed += closedByDay[k]
      return {
        label: days[i].getDate().toString(),
        submitted: cumSubmitted,
        closed: cumClosed,
        backlog: Math.max(cumSubmitted - cumClosed, 0),
      }
    })
  }, [requests, days])

  const stats = useMemo(() => {
    const last = chartData[chartData.length - 1]
    const submitted = last?.submitted || 0
    const closed = last?.closed || 0
    const open = last?.backlog || 0
    const closeRate = submitted > 0 ? Math.round((closed / submitted) * 100) : 0
    return { submitted, closed, open, closeRate }
  }, [chartData])

  return (
    <div>
      <p className="text-sm text-foreground/60 mb-4">Requests submitted vs. closed, last 30 days</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatBox label="Submitted" value={stats.submitted} />
        <StatBox label="Closed" value={stats.closed} />
        <StatBox label="Open Now" value={stats.open} />
        <StatBox label="Close Rate" value={`${stats.closeRate}%`} />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="closed" stackId="backlog" stroke="none" fill="transparent" legendType="none" />
          <Area type="monotone" dataKey="backlog" stackId="backlog" stroke="none" fill="#c9c5b8" fillOpacity={0.5} name="Still Open" />
          <Line type="monotone" dataKey="submitted" name="Submitted" stroke="#1a3a52" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="closed" name="Closed" stroke="#4a7a7a" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-background border border-border rounded-lg p-3">
      <p className="text-xs text-foreground/50 mb-1">{label}</p>
      <p className="font-serif text-xl text-primary">{value}</p>
    </div>
  )
}