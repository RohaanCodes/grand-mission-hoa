// app/(pages)/board/starActions.ts
'use server'
import { getStarredRequestIds, toggleStar } from '@/lib/airtable'
import { revalidatePath } from 'next/cache'

export async function getStarredIdsAction(userEmail: string) {
  return await getStarredRequestIds(userEmail)
}

export async function toggleStarAction(requestRecordId: string, userEmail: string, userName: string) {
  const success = await toggleStar(requestRecordId, userEmail, userName)
  revalidatePath('/board')
  revalidatePath('/management')
  revalidatePath('/board/requests')
  revalidatePath('/management/requests')
  return { success }
}