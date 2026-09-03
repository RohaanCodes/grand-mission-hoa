// app/(pages)/board/InsightsPanel.tsx
'use client'
import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import type { ServiceRequest } from '@/lib/types'

const BAR_COLORS = ['#c9a961', '#8a9a6f', '#4a7a7a', '#b8724a', '#8a6fb0', '#5a8ab0']

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
    let autoClosed = 0, resolved = 0, open = 0
    requests.forEach((r) => {
      if (r.status === 'Closed (AI)') autoClosed++
      else if (r.status === 'Resolved' || r.status === 'Closed') resolved++
      else open++
    })
    return [
      { name: 'Auto-Closed (AI)', value: autoClosed, color: '#c9a961' },
      { name: 'Resolved', value: resolved, color: '#8a9a6f' },
      { name: 'Still Open', value: open, color: '#4a7a7a' },
    ].filter((d) => d.value > 0)
  }, [requests])

  return (
    <div className="bg-primary rounded-2xl p-5 sm:p-6 mb-10 shadow-inner">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="By Category">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={byCategory} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 10.5, fill: 'rgba(255,255,255,0.85)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#c9a961" radius={[0, 3, 3, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="By Resolution Path">
          <DonutWithTotal data={byResolution} />
        </ChartCard>

        <ChartCard title="By Submitted Via">
          <BarList data={bySubmittedVia} />
        </ChartCard>
      </div>
    </div>
  )
}

function BarList({ data }: { data: [string, number][] }) {
  if (data.length === 0) {
    return <p className="text-white/40 text-sm py-6 text-center">No data yet</p>
  }
  const max = Math.max(...data.map(([, count]) => count))
  return (
    <div className="space-y-3">
      {data.map(([name, count], i) => (
        <div key={name}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-white/85">{name}</span>
            <span className="text-sm font-medium text-white">{count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(count / max) * 100}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutWithTotal({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return <p className="text-white/40 text-sm py-6 text-center">No data yet</p>
  }

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={3} strokeWidth={0}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ height: 220 }}>
          <span className="font-serif text-2xl text-white">{total}</span>
          <span className="text-[10px] uppercase tracking-wide text-white/50">Total</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-white/70">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/8 border border-white/10 rounded-2xl p-5">
      <h3 className="font-serif text-base text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}