'use client'

import { motion } from 'framer-motion'
import { Bot, Circle, CheckCircle2, MessageCircleQuestion, Archive } from 'lucide-react'

interface StatusConfig {
  label: string
  bg: string
  text: string
  icon?: React.ReactNode
}

const statusConfig: Record<string, StatusConfig> = {
  New: {
    label: 'New',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    icon: <Circle className="w-3 h-3" fill="currentColor" />,
  },
  'Guidance Sent': {
    label: 'Guidance Sent',
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  'Board Notified': {
    label: 'Board Notified',
    bg: 'bg-secondary/10',
    text: 'text-secondary',
  },
  'Agent In Progress': {
    label: 'Agent Working On This',
    bg: 'bg-accent/15',
    text: 'text-[#b8985a]',
  },
  'Awaiting Management Response': {
    label: 'Awaiting Management',
    bg: 'bg-accent/15',
    text: 'text-[#b8985a]',
  },
  'Awaiting Resident Info': {
    label: 'Action Needed',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    icon: <MessageCircleQuestion className="w-3.5 h-3.5" />,
  },
  Resolved: {
    label: 'Resolved',
    bg: 'bg-secondary/15',
    text: 'text-secondary',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  Closed: {
    label: 'Closed',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    icon: <Archive className="w-3.5 h-3.5" />,
  },
}

export default function RequestStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig['New']
  const isAgentActive = status === 'Agent In Progress'

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${config.bg} ${config.text}`}
    >
      {isAgentActive ? (
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex"
        >
          <Bot className="w-3.5 h-3.5" />
        </motion.span>
      ) : (
        config.icon
      )}
      {config.label}
      {isAgentActive && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-current"
        />
      )}
    </span>
  )
}