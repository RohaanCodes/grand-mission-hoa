// app/(pages)/board/BoardAIAssistant.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Landmark, X, Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export default function BoardAIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function handleClose() {
    setOpen(false)
    setMessages([])
    setInput('')
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: "This feature is coming soon — I'll soon be able to answer questions about requests, residents, and categories directly.",
        },
      ])
    }, 900)
  }

  return (
    <>
      {/* Launcher */}
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

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-40 w-[90vw] max-w-sm h-[70vh] max-h-[560px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary text-primary-foreground">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Landmark className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-serif text-base leading-none">Board Assistant</p>
                  <p className="text-[11px] text-white/60 mt-0.5">AI-powered · Airtable</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Landmark className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Ask about requests, residents, categories, or anything across the dashboard.
                  </p>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-border">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something…"
                className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
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