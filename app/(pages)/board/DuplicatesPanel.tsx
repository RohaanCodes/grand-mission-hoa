// app/(pages)/board/DuplicatesPanel.tsx
'use client'
import type { ServiceRequest } from '@/lib/types'

export default function DuplicatesPanel({ requests }: { requests: ServiceRequest[] }) {
  const duplicates = requests.filter((r) => r.possible_duplicate)

  if (duplicates.length === 0) return null

  return (
    <div className="divide-y divide-slate-200">
      {duplicates.map((r) => (
        <div key={r.id} className="py-3 first:pt-0 last:pb-0">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-sm font-semibold text-slate-900">
              {r.final_category || r.category_resident_selected || 'Other'}
            </span>
            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
              Possible duplicate
            </span>
          </div>
          <p className="text-sm text-slate-800 mb-1.5 leading-relaxed">{r.description}</p>
          {r.ai_classification_notes && (
            <p className="text-xs text-slate-600">{r.ai_classification_notes}</p>
          )}
        </div>
      ))}
    </div>
  )
}