// app/(pages)/board/votingActions.ts
'use server'
import { getAllBoardMembers, getVotesForRequest, castVote, toggleVotingOpen, resolveVote } from '@/lib/airtable'
import { revalidatePath } from 'next/cache'

export async function getVotingDataAction(requestRecordId: string) {
  const [boardMembers, votes] = await Promise.all([
    getAllBoardMembers(),
    getVotesForRequest(requestRecordId),
  ])
  return { boardMembers, votes }
}

export async function castVoteAction(
  requestRecordId: string,
  boardMemberRecordId: string,
  boardMemberName: string,
  vote: 'Approve' | 'Disapprove'
) {
  const success = await castVote(requestRecordId, boardMemberRecordId, boardMemberName, vote)
  revalidatePath('/board')
  revalidatePath('/management')
  revalidatePath('/board/votes')
  revalidatePath('/management/votes')
  return { success }
}
export async function toggleVotingAction(requestRecordId: string, open: boolean) {
  const success = await toggleVotingOpen(requestRecordId, open)
  revalidatePath('/board')
  revalidatePath('/management')
  return { success }
}

export async function resolveVoteAction(requestRecordId: string, outcome: 'Approved' | 'Rejected') {
  const success = await resolveVote(requestRecordId, outcome)
  revalidatePath('/board')
  revalidatePath('/management')
  revalidatePath('/board/votes')
  revalidatePath('/management/votes')
  return { success }
}