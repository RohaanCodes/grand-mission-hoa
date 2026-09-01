'use server'
import { cookies } from 'next/headers'
import { getBoardMemberById, submitServiceRequest } from '@/lib/airtable'

export async function submitBoardRequestAction(data: { category: string; description: string }) {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) return { success: false }

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) return { success: false }

  const success = await submitServiceRequest(
    {
      requesterName: boardMember.name,
      requesterEmail: boardMember.email,
      unitAddress: '',
      phone: boardMember.phone || '',
      category: data.category,
      description: data.description,
    },
    'Board Member'
  )
  return { success }
}