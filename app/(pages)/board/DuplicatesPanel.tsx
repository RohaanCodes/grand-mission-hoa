// app/(pages)/board/DuplicatesPanel.tsx
'use client'
import { Copy } from 'lucide-react'
import type { ServiceRequest } from '@/lib/types'

export default function DuplicatesPanel({ requests }: { requests: ServiceRequest[] }) {
  const duplicates = requests.filter((r) => r.possible_duplicate)

  return (
    <div className="bg-card border border-accent/30 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-2.5 bg-accent/8">
        <span className="w-7 h-7 rounded-lg bg-accent/20 text-[#8a6d2f] flex items-center justify-center">
          <Copy className="w-4 h-4" strokeWidth={2} />
        </span>
        <h2 className="font-serif text-base text-primary">Possible Repeat Requests</h2>
        <span className="text-xs text-foreground/40">{duplicates.length} flagged</span>
      </div>

      <div className="p-5 sm:p-6">
        {duplicates.length === 0 ? (
          <div className="bg-muted/40 rounded-lg p-6 text-center">
            <p className="text-foreground/45 text-sm">No repeat requests detected right now.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {duplicates.map((r) => (
              <div key={r.id} className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="font-serif text-sm text-primary">
                    {r.final_category || r.category_resident_selected || 'Other'}
                  </span>
                  <span className="text-xs text-foreground/50">
                    {r.requester_name}{r.unit_address ? ` · ${r.unit_address}` : ''}
                  </span>
                </div>
                <p className="text-sm text-foreground/75 mb-2">{r.description}</p>
                {r.ai_classification_notes && (
                  <p className="text-xs text-[#8a6d2f] bg-accent/10 rounded px-2.5 py-1.5 inline-block">
                    {r.ai_classification_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}