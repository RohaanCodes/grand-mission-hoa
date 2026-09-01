// app/(pages)/board/InsightsPanel.tsx
'use client'
import { useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ServiceRequest } from '@/lib/types'

const COLORS = ['#c9a961', '#8a9a6f', '#4a7a7a', '#b8724a', '#8a6fb0']
const LIGHT_TICK = 'rgba(255,255,255,0.85)'

export default function InsightsPanel({ requests }: { requests: ServiceRequest[] }) {
  const byCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      const c = r.final_category || r.category_resident_selected || 'Other'
      counts[c] = (counts[c] || 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [requests])

  const bySubmittedVia = useMemo(() => {
    const counts: Record<string, number> = {}
    requests.forEach((r) => {
      const v = r.submitted_via || 'Unknown'
      counts[v] = (counts[v] || 0) + 1
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [requests])

  const byResolution = useMemo(() => {
    let autoClosed = 0, resolved = 0, open = 0
    requests.forEach((r) => {
      if (r.status === 'Closed (AI)') autoClosed++
      else if (r.status === 'Resolved' || r.status === 'Closed') resolved++
      else open++
    })
    return [
      { name: 'Auto-Closed (AI)', value: autoClosed },
      { name: 'Resolved', value: resolved },
      { name: 'Still Open', value: open },
    ].filter((d) => d.value > 0)
  }, [requests])

  return (
    <div className="bg-primary rounded-2xl p-5 sm:p-6 mb-10 shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ChartCard title="By Category" tint="neutral">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byCategory} margin={{ left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: LIGHT_TICK }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: LIGHT_TICK }} />
              <Tooltip />
              <Bar dataKey="count" fill="#c9a961" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="By Resolution Path" tint="sage">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byResolution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                {byResolution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12, color: LIGHT_TICK }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="By Submitted Via" tint="gold">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bySubmittedVia} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: LIGHT_TICK }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: LIGHT_TICK }} width={110} />
              <Tooltip />
              <Bar dataKey="count" fill="#c9a961" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

function ChartCard({
  title,
  tint,
  children,
}: {
  title: string
  tint: 'neutral' | 'sage' | 'gold'
  children: React.ReactNode
}) {
  const tintClasses = {
    neutral: 'bg-white/10 border-white/15',
    sage: 'bg-secondary/25 border-secondary/30',
    gold: 'bg-accent/20 border-accent/25',
  }[tint]

  return (
    <div className={`backdrop-blur-md border rounded-2xl p-5 ${tintClasses}`}>
      <h3 className="font-serif text-base text-white mb-2">{title}</h3>
      {children}
    </div>
  )
}