'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, FileText, Sparkles, Send, Bell, LucideIcon } from 'lucide-react'

interface Stage {
  icon: LucideIcon
  title: string
  description: string
  ringClass: string
  iconClass: string
}

const stages: Stage[] = [
  {
    icon: FileText,
    title: 'You describe what\'s going on',
    description:
      "One simple form. No categories to get right, no decisions to make about who should be involved — just tell us what's happening.",
    ringClass: 'border-primary/30',
    iconClass: 'text-primary',
  },
  {
    icon: Sparkles,
    title: 'Our system reads it instantly',
    description:
      "An AI agent classifies the request, checks whether anyone else has reported the same thing, and decides the right next step — automatically.",
    ringClass: 'border-secondary/40',
    iconClass: 'text-secondary',
  },
  {
    icon: Send,
    title: 'The right people get involved',
    description:
      "Simple questions get an instant answer. Maintenance and repairs go straight to the management company. Governance questions go to the board. Anything urgent or safety-related goes to both, right away.",
    ringClass: 'border-accent/50',
    iconClass: 'text-[#b8985a]',
  },
  {
    icon: Bell,
    title: 'We keep you posted',
    description:
      "You'll get updates as your request moves forward, including the timeline whoever is handling it commits to. Sign in anytime to see where things stand.",
    ringClass: 'border-primary/30',
    iconClass: 'text-primary',
  },
]

function InfoContent() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-primary mb-3">
          How Requests Work
        </h2>
        <p className="text-foreground/70 text-sm leading-relaxed">
          You don't need to figure out who to send this to. Tell us what's
          going on, and the system takes it from there.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary via-secondary to-accent" />

        <div className="space-y-9">
          {stages.map((stage, i) => {
            const Icon = stage.icon
            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex gap-5"
              >
                <div
                  className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 ${stage.ringClass} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${stage.iconClass}`} strokeWidth={1.75} />
                </div>
                <div className="pt-1.5 min-w-0">
                  <h3 className="font-serif text-lg text-primary mb-1.5">
                    {stage.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border pt-5 mt-9">
        <p className="text-foreground/50 text-xs leading-relaxed">
          Sign in anytime to track the status of your requests.
        </p>
      </div>
    </div>
  )
}

export default function RequestInfoPanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop: always-visible info column */}
      <div className="hidden md:block">
        <InfoContent />
      </div>

      {/* Mobile: Learn More button */}
      <div className="md:hidden mb-8">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-primary border border-primary/20 rounded-full px-4 py-2 hover:bg-primary/5 transition-colors"
        >
          <Info className="w-4 h-4" />
          Learn how this works
        </button>
      </div>

      {/* Mobile: slide-in panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background z-50 md:hidden overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="mb-6 p-2 -m-2 rounded-full hover:bg-primary/5 transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
                <InfoContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}