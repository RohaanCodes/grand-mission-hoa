// app/(pages)/board/NoticeBoard.tsx
'use client'
import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { getNoticesAction, createNoticeAction, deleteNoticeAction } from './noticeActions'
import type { Notice } from '@/lib/types'

const NOTE_STYLE: Record<Notice['color'], { paper: string; fold: string; pinColor: string }> = {
  Yellow: { paper: '#fef3c7', fold: '#fcd34d', pinColor: '#dc2626' },
  Blue: { paper: '#dbeafe', fold: '#93c5fd', pinColor: '#2563eb' },
  Green: { paper: '#d1fae5', fold: '#6ee7b7', pinColor: '#16a34a' },
  Pink: { paper: '#fce7f3', fold: '#f9a8d4', pinColor: '#db2777' },
}

// Deterministic small tilt per note so they read as hand-pinned, not a grid,
// but don't jump around on re-render.
function tiltForId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return (Math.abs(hash) % 7) - 3 // -3deg to +3deg
}

function Pushpin({ color }: { color: string }) {
  const gradientId = `pin-${color.replace('#', '')}`
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 drop-shadow-md"
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <ellipse cx="13" cy="20" rx="3" ry="1.5" fill="rgba(0,0,0,0.25)" />
      <circle cx="13" cy="11" r="8.5" fill={`url(#${gradientId})`} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      <circle cx="10" cy="8" r="2" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}

export default function NoticeBoard({
  currentName,
  currentEmail,
  viewerRole,
}: {
  currentName: string
  currentEmail: string
  viewerRole: 'board' | 'management'
}) {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [color, setColor] = useState<Notice['color']>('Yellow')
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const data = await getNoticesAction()
    setNotices(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!noteText.trim() || submitting) return
    setSubmitting(true)
    await createNoticeAction({
      noteText,
      authorName: currentName,
      authorEmail: currentEmail,
      authorRole: viewerRole === 'management' ? 'Management' : 'Board',
      color,
    })
    setSubmitting(false)
    setNoteText('')
    setComposing(false)
    await load()
  }

  async function handleDelete(id: string) {
    setNotices((prev) => prev.filter((n) => n.id !== id))
    await deleteNoticeAction(id)
  }

  if (loading) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">Shared notes from the board and management, visible to everyone here.</p>
        <button
          onClick={() => setComposing((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-full px-3 py-1.5 transition-colors flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Add Note
        </button>
      </div>

      {composing && (
        <form onSubmit={handlePost} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 space-y-3">
          <textarea
            autoFocus
            required
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note for the board and management to see…"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {(Object.keys(NOTE_STYLE) as Notice['color'][]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  title={c}
                  style={{ backgroundColor: NOTE_STYLE[c].paper }}
                  className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-slate-500' : 'border-transparent'} transition-colors`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setComposing(false)} className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
              >
                {submitting ? 'Posting…' : 'Post Note'}
              </button>
            </div>
          </div>
        </form>
      )}

      {notices.length === 0 ? (
        <div
          className="rounded-xl p-10 text-center"
          style={{
            background: 'radial-gradient(circle at 20% 20%, #2f6b45 0%, #244f34 45%, #1c3d28 100%)',
            border: '10px solid #6b4a2f',
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          <p className="text-sm text-green-100/70">No notes yet, be the first to pin one up.</p>
        </div>
      ) : (
        <div
          className="rounded-xl p-8 sm:p-10"
          style={{
            background: 'radial-gradient(circle at 20% 20%, #2f6b45 0%, #244f34 45%, #1c3d28 100%)',
            border: '10px solid #6b4a2f',
            borderImage: 'linear-gradient(135deg, #8a6440, #5c3f22, #8a6440) 1',
            boxShadow: 'inset 0 2px 16px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
            {notices.map((note) => {
              const style = NOTE_STYLE[note.color]
              const isMine = note.authorEmail.toLowerCase() === currentEmail.toLowerCase()
              const tilt = tiltForId(note.id)
              const foldSize = 22

              return (
                <div
                  key={note.id}
                  className="group relative pt-3"
                  style={{ transform: `rotate(${tilt}deg)` }}
                >
                  <Pushpin color={style.pinColor} />

                  {isMine && (
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-black/10 hover:bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      title="Remove note"
                    >
                      <X className="w-3 h-3 text-black/60" strokeWidth={2.5} />
                    </button>
                  )}

                  <div
                    className="relative p-4 pt-5"
                    style={{
                      backgroundColor: style.paper,
                      clipPath: `polygon(0 0, calc(100% - ${foldSize}px) 0, 100% ${foldSize}px, 100% 100%, 0 100%)`,
                      boxShadow: '0 6px 14px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2)',
                      minHeight: 140,
                    }}
                  >
                    {/* The folded corner flap */}
                    <div
                      className="absolute top-0 right-0"
                      style={{
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: `0 ${foldSize}px ${foldSize}px 0`,
                        borderColor: `transparent ${style.fold} transparent transparent`,
                        filter: 'brightness(0.85)',
                        boxShadow: '-2px 2px 3px rgba(0,0,0,0.2)',
                      }}
                    />

                    <p className="text-sm text-slate-800 leading-relaxed mb-3 whitespace-pre-wrap" style={{ fontFamily: 'inherit' }}>
                      {note.noteText}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      {note.authorName}
                      <span className="font-normal text-slate-500"> &middot; {note.authorRole}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}