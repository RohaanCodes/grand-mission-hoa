// app/(pages)/board/RequestThread.tsx
'use client'
import { useState } from 'react'
import { MessageCircle, ChevronDown } from 'lucide-react'
import { getQueriesAction, askQueryAction, respondToQueryAction } from './queryActions'
import type { RequestQuery } from '@/lib/types'

// Fixed 4-color palette, one per person. Same name always resolves to
// the same color via a deterministic hash, no lookup table needed.
const PERSON_COLORS = ['#c9a961', '#4a7a7a', '#8a9a6f', '#b8724a']

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PERSON_COLORS[Math.abs(hash) % PERSON_COLORS.length]
}

export default function RequestThread({
  requestIdNumber,
  currentName,
  currentEmail,
  viewerRole = 'board',
}: {
  requestIdNumber: number
  currentName: string
  currentEmail: string
  viewerRole?: 'board' | 'management'
}) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [queries, setQueries] = useState<RequestQuery[]>([])
  const [newQuery, setNewQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [replying, setReplying] = useState<string | null>(null)

  async function refresh() {
    const data = await getQueriesAction(requestIdNumber)
    setQueries(data)
  }

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next && !loaded) {
      await refresh()
      setLoaded(true)
    }
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!newQuery.trim()) return
    setSubmitting(true)
    await askQueryAction({ requestIdNumber, queryText: newQuery, askedByName: currentName, askedByEmail: currentEmail })
    setSubmitting(false)
    setNewQuery('')
    await refresh()
  }

  async function handleRespond(queryId: string) {
    const text = replyDrafts[queryId]
    if (!text?.trim()) return
    setReplying(queryId)
    await respondToQueryAction(queryId, text)
    setReplying(null)
    setReplyDrafts((prev) => ({ ...prev, [queryId]: '' }))
    await refresh()
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button onClick={toggle} className="flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary">
        <MessageCircle className="w-3.5 h-3.5" />
        {queries.length > 0 ? `${queries.length} question${queries.length > 1 ? 's' : ''}` : 'Ask a question'}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {queries.map((q) => {
            const color = colorForName(q.askedByName)
            const initial = q.askedByName.charAt(0).toUpperCase()
            return (
              <div
                key={q.id}
                className="rounded-xl p-3.5"
                style={{ backgroundColor: `${color}1a`, border: `1px solid ${color}40` }}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: color }}
                  >
                    {initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-semibold" style={{ color }}>{q.askedByName}</span>
                      <span className="text-foreground/80"> {q.queryText}</span>
                    </p>

                    {q.answered ? (
                      <div className="mt-2.5 bg-white/70 rounded-lg px-3 py-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-foreground/40 mb-0.5">Response</p>
                        <p className="text-sm text-foreground/85">{q.responseText}</p>
                      </div>
                    ) : viewerRole === 'management' ? (
                      <div className="mt-2.5 flex gap-2">
                        <input
                          value={replyDrafts[q.id] || ''}
                          onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Type your response"
                          className="flex-1 border border-border rounded-md px-3 py-1.5 text-sm bg-white"
                        />
                        <button
                          onClick={() => handleRespond(q.id)}
                          disabled={replying === q.id}
                          className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-60 flex-shrink-0"
                        >
                          {replying === q.id ? 'Sending' : 'Respond'}
                        </button>
                      </div>
                    ) : (
                      <p className="text-[#8a6d2f] text-xs font-medium mt-2">Awaiting response</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              placeholder="Ask a question"
              className="flex-1 border border-border rounded-md px-3 py-1.5 text-sm bg-background"
            />
            <button type="submit" disabled={submitting} className="bg-accent text-accent-foreground px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-60">
              {submitting ? 'Asking' : 'Ask'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}