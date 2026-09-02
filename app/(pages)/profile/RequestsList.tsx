// app/(pages)/profile/RequestsList.tsx
'use client'
import { HelpCircle } from 'lucide-react'
import ResidentRequestCard from './ResidentRequestCard'
import type { ServiceRequest } from '@/lib/types'

export default function RequestsList({ requests }: { requests: ServiceRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm p-12 text-center">
        <HelpCircle className="w-8 h-8 text-foreground/20 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-foreground/60">No requests to show.</p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {requests.map((req, i) => (
        <ResidentRequestCard key={req.id} req={req} index={i} />
      ))}
    </div>
  )
}