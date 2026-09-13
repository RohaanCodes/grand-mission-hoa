// app/(pages)/board/triageActions.ts
'use server'
import { submitManagementTriage } from '@/lib/airtable'
import { askQueryAction } from './queryActions'
import { revalidatePath } from 'next/cache'

export async function submitTriageAction(data: {
  requestIdNumber: number
  updateType: 'In Progress' | 'Resolved' | 'Need More Info From Resident'
  proposedSolution?: string
  dueDate?: string
  additionalNotes?: string
  askedByName?: string
  askedByEmail?: string
}) {
  const success = await submitManagementTriage({
    requestIdNumber: data.requestIdNumber,
    updateType: data.updateType,
    proposedSolution: data.proposedSolution,
    dueDate: data.dueDate,
    additionalNotes: data.additionalNotes,
  })

  // When management needs more info, also post it as a real trackable
  // question in-app, not just an email the resident answers into a form
  // that never surfaces here.
  if (success && data.updateType === 'Need More Info From Resident' && data.additionalNotes && data.askedByName && data.askedByEmail) {
    await askQueryAction({
      requestIdNumber: data.requestIdNumber,
      queryText: data.additionalNotes,
      askedByName: data.askedByName,
      askedByEmail: data.askedByEmail,
    })
  }

  revalidatePath('/management')
  revalidatePath('/management/requests')
  revalidatePath('/board')
  revalidatePath('/board/requests')
  return { success }
}