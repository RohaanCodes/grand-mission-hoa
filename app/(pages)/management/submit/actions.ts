// app/(pages)/management/submit/actions.ts
'use server'
import { cookies } from 'next/headers'
import { getManagementById, submitManagementRequest, toggleStar } from '@/lib/airtable'

export async function submitManagementRequestAction(data: {
  category: string
  description: string
  proposedSolution?: string
  dueDate?: string
  estimatedCost?: string
  locationLink?: string
  votingOpen?: boolean
  starThis?: boolean
}) {
  const cookieStore = await cookies()
  const mgmtId = cookieStore.get('mgmt_token')?.value
  if (!mgmtId) return { success: false }

  const mgmt = await getManagementById(mgmtId)
  if (!mgmt) return { success: false }

  const result = await submitManagementRequest({
    requesterName: mgmt.name,
    requesterEmail: mgmt.email,
    category: data.category,
    description: data.description,
    proposedSolution: data.proposedSolution,
    dueDate: data.dueDate,
    estimatedCost: data.estimatedCost,
    locationLink: data.locationLink,
    votingOpen: data.votingOpen,
  })

  if (result.success && result.recordId && data.starThis) {
    await toggleStar(result.recordId, mgmt.email, mgmt.name)
  }

  return { success: result.success }
}