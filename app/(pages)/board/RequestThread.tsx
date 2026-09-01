'use client'
import { useState } from 'react'
import { MessageCircle, ChevronDown } from 'lucide-react'
import { getQueriesAction, askQueryAction, respondToQueryAction } from './queryActions'
import type { RequestQuery } from '@/lib/types'

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
          {queries.map((q) => (
            <div key={q.id} className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="text-foreground/80"><span className="font-medium">{q.askedByName}:</span> {q.queryText}</p>

              {q.answered ? (
                <p className="text-foreground/60 mt-1.5 pl-3 border-l-2 border-secondary/40">{q.responseText}</p>
              ) : viewerRole === 'management' ? (
                <div className="mt-2 flex gap-2">
                  <input
                    value={replyDrafts[q.id] || ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Type your response…"
                    className="flex-1 border border-border rounded-md px-3 py-1.5 text-sm bg-background"
                  />
                  <button
                    onClick={() => handleRespond(q.id)}
                    disabled={replying === q.id}
                    className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-60"
                  >
                    {replying === q.id ? '…' : 'Respond'}
                  </button>
                </div>
              ) : (
                <p className="text-[#b8985a] text-xs mt-1.5">Awaiting response</p>
              )}
            </div>
          ))}

          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 border border-border rounded-md px-3 py-1.5 text-sm bg-background"
            />
            <button type="submit" disabled={submitting} className="bg-accent text-accent-foreground px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-60">
              {submitting ? '…' : 'Ask'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}