// app/(pages)/board/TimelineChart.tsx
'use client'

import { useMemo } from 'react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { ServiceRequest } from '@/lib/types'

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
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5">
      <p className="text-sm font-medium text-slate-700 mb-5">
        Requests submitted vs. closed, last 30 days
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatBox label="Submitted" value={stats.submitted} color="text-blue-600" />
        <StatBox label="Closed" value={stats.closed} color="text-emerald-600" />
        <StatBox label="Open Now" value={stats.open} color="text-amber-600" />
        <StatBox label="Close Rate" value={`${stats.closeRate}%`} color="text-violet-600" />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ left: -10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          
          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              fontSize: '12px',
              color: '#1e293b', // dark text so everything is readable
            }}
            itemStyle={{ color: '#1e293b' }}
            labelStyle={{ color: '#64748b', marginBottom: 4 }}
          />

          <Legend
            wrapperStyle={{ fontSize: 12, color: '#334155' }}
            formatter={(value) => (
              <span style={{ color: '#334155' }}>{value}</span>
            )}
          />

          <Area
            type="monotone"
            dataKey="closed"
            stackId="backlog"
            stroke="none"
            fill="transparent"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="backlog"
            stackId="backlog"
            stroke="none"
            fill="#94a3b8"
            fillOpacity={0.35}
            name="Still Open"
          />
          <Line
            type="monotone"
            dataKey="submitted"
            name="Submitted"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="closed"
            name="Closed"
            stroke="#16a34a"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5">
      <p className="text-xs text-slate-500 mb-1.5">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  )
}