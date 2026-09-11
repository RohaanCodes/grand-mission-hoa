// app/(pages)/board/AssetCard.tsx
'use client'

import { useState } from 'react'
import {
  Waves,
  Droplets,
  CircleDot,
  Landmark,
  Dumbbell,
  Trees,
  Flame,
  MapPin,
  LucideIcon,
  Eye,
} from 'lucide-react'
import { updateAssetStatusAction } from './assetActions'
import type { Asset } from '@/lib/types'

const NAME_KEYWORD_ICON: [string, LucideIcon][] = [
  ['pool', Waves],
  ['splash', Droplets],
  ['fountain', Droplets],
  ['fire', Flame],
  ['gym', Dumbbell],
  ['fitness', Dumbbell],
  ['clubhouse', Landmark],
  ['court', CircleDot],
  ['park', Trees],
  ['playground', Trees],
]

function iconForAsset(name: string): LucideIcon {
  const lower = name.toLowerCase()
  const match = NAME_KEYWORD_ICON.find(([keyword]) => lower.includes(keyword))
  return match ? match[1] : MapPin
}

const STATUS_CONFIG = {
  Open: {
    label: 'Open',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600',
    activeBtn: 'bg-emerald-600 text-white shadow-sm',
  },
  Closed: {
    label: 'Closed',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    iconBg: 'bg-red-50 text-red-600',
    activeBtn: 'bg-red-600 text-white shadow-sm',
  },
  'Under Maintenance': {
    label: 'Maintenance',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
    activeBtn: 'bg-amber-500 text-white shadow-sm',
  },
} as const

export default function AssetCard({
  asset,
  currentName,
  canEdit,
}: {
  asset: Asset
  currentName: string
  canEdit: boolean
}) {
  const [status, setStatus] = useState(asset.status)
  const [statusNote, setStatusNote] = useState(asset.statusNote || '')
  const [noteDraft, setNoteDraft] = useState(asset.statusNote || '')
  const [updating, setUpdating] = useState(false)
  const [savingNote, setSavingNote] = useState(false)

  const Icon = iconForAsset(asset.name)
  const config = STATUS_CONFIG[status]
  const needsNote = status !== 'Open'

  async function handleChange(newStatus: 'Open' | 'Closed' | 'Under Maintenance') {
    if (updating || newStatus === status) return
    setUpdating(true)
    setStatus(newStatus)
    // Clear the note when returning to Open, since a leftover "reopens Friday"
    // note would be stale and confusing once it's already open again.
    const nextNote = newStatus === 'Open' ? '' : statusNote
    setNoteDraft(nextNote)
    setStatusNote(nextNote)
    await updateAssetStatusAction(asset.id, newStatus, currentName, nextNote)
    setUpdating(false)
  }

  async function handleSaveNote() {
    if (savingNote || noteDraft === statusNote) return
    setSavingNote(true)
    setStatusNote(noteDraft)
    await updateAssetStatusAction(asset.id, status, currentName, noteDraft)
    setSavingNote(false)
  }

  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200 overflow-hidden">
      {/* Top section */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-[15px] leading-snug truncate">
                {asset.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{asset.category}</p>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </div>

        {/* Visibility note */}
        {asset.visibility === 'Board & Residents' && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400">
            <Eye className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Visible to residents</span>
          </div>
        )}

        {/* Status note, when not Open, e.g. "Reopens Friday 3pm" or "Replacing pump motor" */}
        {needsNote && !canEdit && statusNote && (
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">{statusNote}</p>
        )}

        {needsNote && canEdit && (
          <div className="mt-3">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1 block">
              {status === 'Closed' ? 'When will it reopen?' : 'What kind of maintenance?'}
            </label>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onBlur={handleSaveNote}
              placeholder={status === 'Closed' ? 'e.g. Reopens Friday at 3pm' : 'e.g. Replacing the pump motor'}
              rows={2}
              className="w-full text-xs text-slate-700 placeholder:text-slate-400 border border-slate-200 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {savingNote && <p className="text-[10px] text-slate-400 mt-1">Saving…</p>}
          </div>
        )}
      </div>

      {/* Action bar */}
      {canEdit && (
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100">
          <div className="flex gap-1.5">
            {(['Open', 'Closed', 'Under Maintenance'] as const).map((s) => {
              const isActive = status === s
              const sConfig = STATUS_CONFIG[s]

              return (
                <button
                  key={s}
                  onClick={() => handleChange(s)}
                  disabled={updating}
                  className={`
                    flex-1 text-[11px] font-medium py-2 rounded-lg transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      isActive
                        ? sConfig.activeBtn
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                    }
                  `}
                >
                  {s === 'Under Maintenance' ? 'Maint.' : s}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}