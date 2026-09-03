// ============================================================
// PREMIUM FEATURE — Board AI Agent
// This entire file is only used by BoardAIAssistant.tsx.
// Safe to delete both files together if the feature is not shipped.
// ============================================================
'use server'
import { submitAgentQuery, getAgentSession } from '@/lib/airtable'

export async function submitAgentQueryAction(email: string, prompt: string) {
  return { success: await submitAgentQuery(email, prompt) }
}

export async function pollAgentSessionAction(email: string) {
  return getAgentSession(email)
}