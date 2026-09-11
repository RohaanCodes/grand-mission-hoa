// app/(pages)/board/submit/actions.ts
'use server'
import { cookies } from 'next/headers'
import { getBoardMemberById, submitServiceRequest, toggleStar } from '@/lib/airtable'

export async function submitBoardRequestAction(data: {
  category: string
  description: string
  locationLink?: string
  votingOpen?: boolean
  starThis?: boolean
}) {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) return { success: false }

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) return { success: false }

  const result = await submitServiceRequest(
    {
      requesterName: boardMember.name,
      requesterEmail: boardMember.email,
      unitAddress: '',
      phone: boardMember.phone || '',
      category: data.category,
      description: data.description,
      locationLink: data.locationLink,
      votingOpen: data.votingOpen,
    },
    'Board Member'
  )

  if (result.success && result.recordId && data.starThis) {
    await toggleStar(result.recordId, boardMember.email, boardMember.name)
  }

  return { success: result.success }
}