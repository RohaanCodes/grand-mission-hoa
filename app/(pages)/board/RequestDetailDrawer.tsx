// app/(pages)/board/RequestDetailDrawer.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import InternalRequestCard from './InternalRequestCard'
import type { ServiceRequest } from '@/lib/types'

export default function RequestDetailDrawer({
  request,
  onClose,
  viewerRole,
  currentName,
  currentEmail,
}: {
  request: ServiceRequest | null
  onClose: () => void
  viewerRole: 'board' | 'management'
  currentName: string
  currentEmail: string
}) {
  return (
    <AnimatePresence>
      {request && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-muted/40 z-50 overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between z-10">
              <h2 className="font-serif text-base text-primary">Request Detail</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-foreground/60" strokeWidth={2} />
              </button>
            </div>
            <div className="p-4">
              <InternalRequestCard
                req={request}
                index={0}
                viewerRole={viewerRole}
                currentName={currentName}
                currentEmail={currentEmail}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}