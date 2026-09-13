// app/(pages)/board/requesterActions.ts
'use server'
import { submitResidentInfo, submitResidentConfirmation } from '@/lib/airtable'
import { revalidatePath } from 'next/cache'

export async function submitInfoResponseAction(requestIdNumber: number, additionalInformation: string) {
  const success = await submitResidentInfo({ requestIdNumber, additionalInformation })
  revalidatePath('/board')
  revalidatePath('/board/requests')
  revalidatePath('/management')
  revalidatePath('/management/requests')
  revalidatePath('/profile')
  return { success }
}

export async function submitConfirmationAction(
  requestIdNumber: number,
  confirmation: 'Confirmed - Issue is Fixed' | 'Disputed - Not Actually Fixed',
  notes?: string
) {
  const success = await submitResidentConfirmation({ requestIdNumber, confirmation, notes })
  revalidatePath('/board')
  revalidatePath('/board/requests')
  revalidatePath('/management')
  revalidatePath('/management/requests')
  revalidatePath('/profile')
  return { success }
}