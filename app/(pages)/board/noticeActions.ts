// app/(pages)/board/noticeActions.ts
'use server'
import { getAllNotices, createNotice, deleteNotice } from '@/lib/airtable'
import { revalidatePath } from 'next/cache'

export async function getNoticesAction() {
  return await getAllNotices()
}

export async function createNoticeAction(data: {
  noteText: string
  authorName: string
  authorEmail: string
  authorRole: 'Board' | 'Management'
  color: 'Yellow' | 'Blue' | 'Green' | 'Pink'
}) {
  const success = await createNotice(data)
  revalidatePath('/board')
  revalidatePath('/management')
  return { success }
}

export async function deleteNoticeAction(noticeId: string) {
  const success = await deleteNotice(noticeId)
  revalidatePath('/board')
  revalidatePath('/management')
  return { success }
}