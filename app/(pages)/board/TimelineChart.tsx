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
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { FileText, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import type { ServiceRequest } from '@/lib/types'

function localDayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function TimelineChart({
  requests,
  periodDays = 30,
}: {
  requests: ServiceRequest[]
  periodDays?: number
}) {
  // Daily points for shorter windows, weekly/monthly buckets for longer ones
  // so a 365-day view doesn't try to cram 365 points onto one chart.
  const bucketUnit: 'day' | 'week' | 'month' = periodDays <= 31 ? 'day' : periodDays <= 120 ? 'week' : 'month'

  const buckets = useMemo(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const list: { start: Date; end: Date; label: string }[] = []

    if (bucketUnit === 'day') {
      for (let i = periodDays - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const start = new Date(d)
        start.setHours(0, 0, 0, 0)
        list.push({ start, end: d, label: String(d.getDate()) })
      }
    } else if (bucketUnit === 'week') {
      const weeks = Math.ceil(periodDays / 7)
      for (let i = weeks - 1; i >= 0; i--) {
        const end = new Date(today)
        end.setDate(end.getDate() - i * 7)
        const start = new Date(end)
        start.setDate(start.getDate() - 6)
        start.setHours(0, 0, 0, 0)
        list.push({ start, end, label: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })
      }
    } else {
      const months = Math.ceil(periodDays / 30)
      for (let i = months - 1; i >= 0; i--) {
        const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0)
        const start = new Date(today.getFullYear(), today.getMonth() - i, 1)
        list.push({ start, end, label: start.toLocaleDateString(undefined, { month: 'short' }) })
      }
    }
    return list
  }, [periodDays, bucketUnit])

  const chartData = useMemo(() => {
    let cumSubmitted = 0
    let cumClosed = 0
    return buckets.map((b) => {
      const submittedInBucket = requests.filter((r) => {
        if (!r.submitted_date) return false
        const d = new Date(r.submitted_date)
        return d >= b.start && d <= b.end
      }).length
      const closedInBucket = requests.filter((r) => {
        if (!r.closed_date) return false
        const d = new Date(r.closed_date)
        return d >= b.start && d <= b.end
      }).length
      cumSubmitted += submittedInBucket
      cumClosed += closedInBucket
      return {
        label: b.label,
        submitted: cumSubmitted,
        closed: cumClosed,
        backlog: Math.max(cumSubmitted - cumClosed, 0),
      }
    })
  }, [buckets, requests])

  const stats = useMemo(() => {
    const last = chartData[chartData.length - 1]
    const submitted = last?.submitted || 0
    const closed = last?.closed || 0
    const open = last?.backlog || 0
    const closeRate = submitted > 0 ? Math.round((closed / submitted) * 100) : 0
    return { submitted, closed, open, closeRate }
  }, [chartData])

  const lastIndex = chartData.length - 1

  // End-of-line value badge — a small pill drawn at the final data point of
  // each series, matching the floating callouts in the reference design.
  function makeEndDot(bg: string, textColor = '#fff') {
    return (props: any) => {
      const { cx, cy, index, value } = props
      if (index !== lastIndex || cx == null || cy == null) return <g key={`d-${index}`} />
      const text = String(value)
      const w = Math.max(26, text.length * 9 + 14)
      return (
        <g key="end-badge">
          <circle cx={cx} cy={cy} r={4} fill={bg} stroke="#fff" strokeWidth={2} />
          <rect x={cx + 8} y={cy - 11} width={w} height={22} rx={11} fill={bg} />
          <text x={cx + 8 + w / 2} y={cy + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={textColor}>
            {text}
          </text>
        </g>
      )
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Requests submitted vs. closed</p>
          <p className="text-xs text-slate-400 mt-0.5">Last {periodDays} days</p>
        </div>
      </div>

      {/* Neutral stat cards — deliberately not the same saturated palette as
          the KPI row above, since these are secondary detail nested inside
          one card, not primary page-level metrics competing for attention. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<FileText className="w-4 h-4" />} label="Submitted" value={stats.submitted} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="Closed" value={stats.closed} iconColor="text-emerald-600" iconBg="bg-emerald-100" />
        <StatCard icon={<Clock className="w-4 h-4" />} label="Open Now" value={stats.open} iconColor="text-amber-600" iconBg="bg-amber-100" />
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Close Rate" value={`${stats.closeRate}%`} iconColor="text-violet-600" iconBg="bg-violet-100" />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 46, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="submittedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />

          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              fontSize: '12px',
              color: '#1e293b',
            }}
            itemStyle={{ color: '#1e293b' }}
            labelStyle={{ color: '#64748b', marginBottom: 4 }}
          />

          <Area type="monotone" dataKey="submitted" stroke="none" fill="url(#submittedFill)" isAnimationActive={false} />

          <Line
            type="monotone"
            dataKey="backlog"
            name="Still Open"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="2 4"
            dot={makeEndDot('#94a3b8', '#fff')}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="closed"
            name="Closed"
            stroke="#10b981"
            strokeWidth={2.5}
            strokeDasharray="7 5"
            dot={makeEndDot('#10b981', '#fff')}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="submitted"
            name="Submitted"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={makeEndDot('#3b82f6', '#fff')}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 flex-wrap justify-center">
        <LegendItem color="#3b82f6" label="Submitted" dash={false} />
        <LegendItem color="#10b981" label="Closed" dash="7 5" />
        <LegendItem color="#94a3b8" label="Still Open" dash="2 4" />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  iconColor,
  iconBg,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
      <span className={`w-8 h-8 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mb-2.5`}>
        {icon}
      </span>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold tabular-nums text-slate-800">{value}</p>
    </div>
  )
}

function LegendItem({ color, label, dash }: { color: string; label: string; dash: string | false }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="20" height="8">
        <line x1="0" y1="4" x2="20" y2="4" stroke={color} strokeWidth={2.5} strokeDasharray={dash || undefined} strokeLinecap="round" />
      </svg>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  )
}