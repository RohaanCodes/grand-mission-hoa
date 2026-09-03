// app/(pages)/profile/ResidentRequestCard.tsx
'use client'
import { motion } from 'framer-motion'
import { Wrench, Volume2, Palette, Receipt, Trees, Dumbbell, HelpCircle, MapPin, LucideIcon } from 'lucide-react'
import RequestStatusBadge from './RequestStatusBadge'
import type { ServiceRequest } from '@/lib/types'

const categoryIcons: Record<string, LucideIcon> = {
  Maintenance: Wrench,
  'Noise Complaint': Volume2,
  'Architectural Change': Palette,
  Billing: Receipt,
  'Common Area': Trees,
  Amenity: Dumbbell,
  Other: HelpCircle,
}

const CLOSED_STATUSES = ['Resolved', 'Closed', 'Closed (AI)']

export default function ResidentRequestCard({ req, index }: { req: ServiceRequest; index: number }) {
  const categoryName = req.final_category || req.category_resident_selected || 'Other'
  const Icon = categoryIcons[categoryName] || HelpCircle
  const isClosed = CLOSED_STATUSES.includes(req.status || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 ${
        isClosed ? 'border-l-secondary/50' : 'border-l-accent'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <span className="font-serif text-lg text-primary">{categoryName}</span>
            <RequestStatusBadge status={req.status || 'New'} />
          </div>
          <p className="text-foreground/75 text-sm leading-relaxed">{req.description}</p>

          {req.location_link && (
            <a
              href={req.location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary/70 hover:text-primary mt-2"
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
              View location
            </a>
          )}

          {req.submitted_date && (
            <p className="text-foreground/40 text-xs mt-3">
              Submitted {new Date(req.submitted_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}