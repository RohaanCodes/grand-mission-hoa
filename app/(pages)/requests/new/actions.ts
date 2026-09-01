'use server'

import { submitServiceRequest } from '@/lib/airtable'
import type { ServiceRequestInput } from '@/lib/types'

export async function submitRequestAction(
  data: ServiceRequestInput
): Promise<{ success: boolean }> {
  const success = await submitServiceRequest(data)
  return { success }
}