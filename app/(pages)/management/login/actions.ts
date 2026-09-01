'use server'
import { generateManagementMagicLink } from '@/lib/airtable'

export async function requestManagementLinkAction(email: string) {
  const result = await generateManagementMagicLink(email)
  if (result) {
    console.log(`Management magic link for ${result.name}: /management/set-session?token=${result.token}`)
  }
  return { success: true }
}