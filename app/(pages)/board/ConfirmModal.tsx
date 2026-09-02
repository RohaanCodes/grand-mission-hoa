// app/(pages)/board/ConfirmModal.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  loading = false,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="w-9 h-9 rounded-full bg-accent/15 text-[#b8985a] flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" strokeWidth={2} />
              </span>
              <div>
                <h3 className="font-serif text-lg text-primary mb-1">{title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{description}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-md text-sm font-medium text-foreground/60 hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground disabled:opacity-60"
              >
                {loading ? 'Working…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}