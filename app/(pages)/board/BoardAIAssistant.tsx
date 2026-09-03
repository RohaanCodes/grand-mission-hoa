// app/(pages)/board/BoardAIAssistant.tsx
//
// ============================================================
// PREMIUM FEATURE — Board AI Agent
// ============================================================
// This entire component is self-contained. It depends on:
//   - lib/airtable.ts: submitAgentQuery(), getAgentSession()
//   - app/(pages)/board/aiAgentActions.ts
//   - Airtable table "AI Agent Sessions"
//   - Airtable automation "Board AI Agent"
//
// TO DISABLE for a client build: set AI_AGENT_ENABLED to false below.
// The launcher button will not render and nothing else in the app
// is affected.
//
// TO REMOVE entirely: delete this file, delete aiAgentActions.ts,
// remove the two functions from lib/airtable.ts noted above, remove
// the <BoardAIAssistant /> import and render from board/page.tsx,
// delete the "AI Agent Sessions" table and "Board AI Agent"
// automation in Airtable. Nothing else references any of this.
//
// Memory model: intentionally NOT persistent. Each board member has
// exactly one row in AI Agent Sessions, overwritten on every new
// question. Conversation history shown in this window lives only in
// local React state and is cleared when the panel is closed.
// ============================================================

'use client'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Landmark, X, Send } from 'lucide-react'
import { submitAgentQueryAction, pollAgentSessionAction } from './aiAgentActions'

const AI_AGENT_ENABLED = true

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const POLL_INTERVAL_MS = 1500
const POLL_TIMEOUT_MS = 30000

export default function BoardAIAssistant({ currentEmail }: { currentEmail: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  if (!AI_AGENT_ENABLED) return null

  function handleClose() {
    setOpen(false)
    setMessages([])
    setInput('')
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || typing) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const submitted = await submitAgentQueryAction(currentEmail, userMsg.text)
    if (!submitted.success) {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: 'Something went wrong submitting that question. Please try again.' },
      ])
      return
    }

    const startedAt = Date.now()
    const poll = setInterval(async () => {
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        clearInterval(poll)
        setTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', text: 'This is taking longer than expected. Please try again in a moment.' },
        ])
        return
      }

      const session = await pollAgentSessionAction(currentEmail)
      if (session?.status === 'Complete') {
        clearInterval(poll)
        setTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', text: session.response || 'No response was generated.' },
        ])
      } else if (session?.status === 'Error') {
        clearInterval(poll)
        setTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', text: 'There was an error generating a response. Please try again.' },
        ])
      }
    }, POLL_INTERVAL_MS)
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        } transition-opacity`}
      >
        <Landmark className="w-5.5 h-5.5" strokeWidth={1.75} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-40 w-[90vw] max-w-sm h-[70vh] max-h-[560px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary text-primary-foreground">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Landmark className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-serif text-base leading-none">Board Assistant -  Beta Version</p>
                  <p className="text-[11px] text-white/60 mt-0.5">AI powered, Airtable</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Landmark className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Ask about requests, residents, or categories across the dashboard.
                  </p>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground/80 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-foreground/30"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-border">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something"
                disabled={typing}
                className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
              >
                <Send className="w-4 h-4" strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}