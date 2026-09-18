'use server'
import { submitServiceRequest } from '@/lib/airtable'

export async function submitRequestAction(data: {
  requesterName: string
  requesterEmail: string
  unitAddress: string
  phone?: string
  category?: string
  description: string
  locationLink?: string
}) {
  const result = await submitServiceRequest(data)
  return { success: result.success, recordId: result.recordId }
}