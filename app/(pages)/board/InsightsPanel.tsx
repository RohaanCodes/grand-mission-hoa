// app/(pages)/board/InsightsPanel.tsx
'use client'

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'
import type { ServiceRequest } from '@/lib/types'

const CATEGORY_BAR_COLOR = '#3b82f6'

export default function InsightsPanel({ requests }: { requests: ServiceRequest[] }) {
  const byCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      const c = r.final_category || r.category_resident_selected || 'Other'
      counts[c] = (counts[c] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [requests])

  const bySubmittedVia = useMemo(() => {
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      const v = r.submitted_via || 'Unknown'
      counts[v] = (counts[v] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [requests])

  const byResolution = useMemo(() => {
    let autoClosed = 0,
      resolved = 0,
      open = 0
    requests.forEach((r) => {
      if (r.status === 'Closed (AI)') autoClosed++
      else if (r.status === 'Resolved' || r.status === 'Closed') resolved++
      else open++
    })
    return [
      { name: 'Auto-Closed (AI)', value: autoClosed, color: '#94a3b8' },
      { name: 'Resolved', value: resolved, color: '#22c55e' },
      { name: 'Still Open', value: open, color: '#f59e0b' },
    ].filter((d) => d.value > 0)
  }, [requests])

  const categoryHeight = Math.max(byCategory.length * 28, 120)

  return (
    <div className="space-y-5">
      {/* By Category */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">By Category</h3>
          <span className="text-xs text-slate-400">{byCategory.length} categories</span>
        </div>

        {byCategory.length === 0 ? (
          <p className="text-slate-400 text-sm py-10 text-center">No requests yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={categoryHeight}>
            <BarChart
              data={byCategory}
              layout="vertical"
              margin={{ left: 4, right: 12, top: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={148}
                tick={{ fontSize: 12, fill: '#475569' }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey="count"
                fill={CATEGORY_BAR_COLOR}
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom two cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Resolution Path */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-0.5">
            By Resolution Path
          </h3>
          <p className="text-xs text-slate-400 mb-4">How requests are being closed</p>
          <DonutWithTotal data={byResolution} />
        </div>

        {/* Submitted Via */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-0.5">
            By Submitted Via
          </h3>
          <p className="text-xs text-slate-400 mb-5">Where requests originate</p>
          <BarList data={bySubmittedVia} />
        </div>
      </div>
    </div>
  )
}

function BarList({ data }: { data: [string, number][] }) {
  if (data.length === 0) {
    return <p className="text-slate-400 text-sm py-8 text-center">No data yet</p>
  }

  const max = Math.max(...data.map(([, count]) => count))
  const colors = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981']

  return (
    <div className="space-y-4">
      {data.map(([name, count], i) => (
        <div key={name}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-slate-600">{name}</span>
            <span className="text-sm font-semibold text-slate-800 tabular-nums">
              {count}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(count / max) * 100}%`,
                backgroundColor: colors[i % colors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutWithTotal({
  data,
}: {
  data: { name: string; value: number; color: string }[]
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return <p className="text-slate-400 text-sm py-10 text-center">No data yet</p>
  }

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => {
                const num = Number(value) || 0
                const percent = total > 0 ? Math.round((num / total) * 100) : 0
                return [`${num} (${percent}%)`, name]
              }}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '13px',
                color: '#1e293b',
                padding: '8px 12px',
                backgroundColor: 'white',
              }}
              itemStyle={{ color: '#1e293b' }}
              labelStyle={{ display: 'none' }}
              // This helps prevent the tooltip from sitting right on top of the center text
              wrapperStyle={{ zIndex: 20 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total - lower z-index so tooltip can sit above it */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ height: 180, zIndex: 1 }}
        >
          <span className="text-3xl font-bold tracking-tight text-slate-800">
            {total}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
            Total
          </span>
        </div>
      </div>

      {/* Legend with count + percentage */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-4">
        {data.map((d) => {
          const percent = total > 0 ? Math.round((d.value / total) * 100) : 0
          return (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs text-slate-600">
                {d.name}:{' '}
                <span className="font-medium text-slate-800">{d.value}</span>
                <span className="text-slate-400 ml-1">({percent}%)</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}