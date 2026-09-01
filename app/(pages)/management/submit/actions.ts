'use server'
import { cookies } from 'next/headers'
import { getManagementById, submitManagementRequest } from '@/lib/airtable'

export async function submitManagementRequestAction(data: {
  category: string
  description: string
  proposedSolution?: string
  dueDate?: string
  estimatedCost?: string
}) {
  const cookieStore = await cookies()
  const mgmtId = cookieStore.get('mgmt_token')?.value
  if (!mgmtId) return { success: false }

  const mgmt = await getManagementById(mgmtId)
  if (!mgmt) return { success: false }

  const success = await submitManagementRequest({
    requesterName: mgmt.name,
    requesterEmail: mgmt.email,
    ...data,
  })
  return { success }
}