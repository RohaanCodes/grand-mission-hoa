// app/(pages)/board/NoticeBoardShutter.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pin, ChevronUp, ChevronDown } from 'lucide-react'
import NoticeBoard from './NoticeBoard'

export default function NoticeBoardShutter({
  currentName,
  currentEmail,
  viewerRole,
}: {
  currentName: string
  currentEmail: string
  viewerRole: 'board' | 'management'
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-4">
      <AnimatePresence>
        {open && (
          <motion.div
            key="shutter"
            initial={{ height: 0, opacity: 0, y: -24 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              <NoticeBoard currentName={currentName} currentEmail={currentEmail} viewerRole={viewerRole} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A small, left-aligned pull tab, not a full-width box, so it reads
          as an intentional control rather than an empty floating bar. */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-700 text-xs font-semibold rounded-full pl-3 pr-2.5 py-1.5 transition-colors shadow-sm"
      >
        <Pin className="w-3 h-3 text-blue-600" strokeWidth={2} fill="currentColor" />
        Notice Board
        {open ? <ChevronUp className="w-3.5 h-3.5" strokeWidth={2.5} /> : <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />}
      </button>
    </div>
  )
}