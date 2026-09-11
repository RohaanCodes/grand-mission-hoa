// app/(pages)/board/profileActions.ts
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { uploadProfilePhoto, updatePersonEmail } from '@/lib/airtable'

export async function uploadProfilePhotoAction(
  table: 'Board Members' | 'Management Companies',
  recordId: string,
  base64Content: string,
  filename: string,
  contentType: string
) {
  const success = await uploadProfilePhoto(table, recordId, base64Content, filename, contentType)
  revalidatePath('/board/profile')
  revalidatePath('/management/profile')
  return { success }
}

export async function updateEmailAction(
  table: 'Board Members' | 'Management Companies',
  recordId: string,
  newEmail: string
) {
  const success = await updatePersonEmail(table, recordId, newEmail)
  revalidatePath('/board/profile')
  revalidatePath('/management/profile')
  return { success }
}

export async function logoutAction(role: 'board' | 'management') {
  const cookieStore = await cookies()
  cookieStore.delete(role === 'board' ? 'board_token' : 'mgmt_token')
  redirect(role === 'board' ? '/board/login' : '/management/login')
}