'use server'

import { createLoginRequest } from '@/lib/airtable'

export async function requestLoginLinkAction(
  email: string
): Promise<{ success: boolean }> {
  const success = await createLoginRequest(email)
  return { success }
}