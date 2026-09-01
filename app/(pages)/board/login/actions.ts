'use server'
import { generateBoardMagicLink } from '@/lib/airtable'

export async function requestBoardLinkAction(email: string) {
  const result = await generateBoardMagicLink(email)
  if (result) {
    console.log(`Board magic link for ${result.name}: /board/set-session?token=${result.token}`)
  }
  return { success: true }
}