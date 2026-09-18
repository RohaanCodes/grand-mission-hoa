// app/(pages)/board/VotingSection.tsx
'use client'
import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { getVotingDataAction, castVoteAction, resolveVoteAction } from './votingActions'

interface BoardMemberInfo { id: string; name: string; email: string; photoUrl?: string }
interface VoteInfo { boardMemberId: string; vote: 'Approve' | 'Disapprove' }

// Display label only — the underlying value stored in Airtable stays
// 'Disapprove' to match the actual configured select option there.
const VOTE_LABEL: Record<'Approve' | 'Disapprove', string> = {
  Approve: 'Approve',
  Disapprove: 'Reject',
}

const AVATAR_COLORS = ['#2563eb', '#0891b2', '#16a34a', '#9333ea', '#d97706']

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// Renders as inline content only — no outer card, border, or shadow of its
// own. This is meant to sit directly inside whatever card the caller has
// already built for the request, not form a second nested card.
export default function VotingSection({
  requestRecordId,
  viewerRole,
  currentEmail,
  readOnly = false,
}: {
  requestRecordId: string
  viewerRole: 'board' | 'management'
  currentEmail: string
  // When true, this always renders as a results snapshot — nobody gets
  // vote buttons, even the viewer themself. Used for resolved votes,
  // where casting a new vote no longer means anything.
  readOnly?: boolean
}) {
  const [boardMembers, setBoardMembers] = useState<BoardMemberInfo[]>([])
  const [votes, setVotes] = useState<VoteInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const data = await getVotingDataAction(requestRecordId)
    setBoardMembers(data.boardMembers)
    setVotes(data.votes.map((v) => ({ boardMemberId: v.boardMemberId, vote: v.vote })))
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestRecordId])

  const myMember = boardMembers.find((m) => m.email.toLowerCase() === currentEmail.toLowerCase())

  async function handleVote(vote: 'Approve' | 'Disapprove') {
    if (!myMember || submitting || readOnly) return
    setSubmitting(true)
    setVotes((prev) => {
      const rest = prev.filter((v) => v.boardMemberId !== myMember.id)
      return [...rest, { boardMemberId: myMember.id, vote }]
    })
    await castVoteAction(requestRecordId, myMember.id, myMember.name, vote)
    setSubmitting(false)
  }

  const approveCount = votes.filter((v) => v.vote === 'Approve').length
  const disapproveCount = votes.filter((v) => v.vote === 'Disapprove').length
  const totalVoted = approveCount + disapproveCount
  const majorityNeeded = Math.floor(boardMembers.length / 2) + 1

  let outcome: 'passed' | 'rejected' | 'pending' = 'pending'
  if (approveCount >= majorityNeeded) outcome = 'passed'
  else if (disapproveCount >= majorityNeeded) outcome = 'rejected'

  useEffect(() => {
    if (loading || readOnly) return
    if (outcome === 'passed') resolveVoteAction(requestRecordId, 'Approved')
    else if (outcome === 'rejected') resolveVoteAction(requestRecordId, 'Rejected')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, loading])

  if (loading) {
    return <div className="py-4 text-center text-sm text-slate-400">Loading votes…</div>
  }

  const outcomeColor = outcome === 'passed' ? '#16a34a' : outcome === 'rejected' ? '#dc2626' : '#d97706'
  const outcomeLabel = outcome === 'passed' ? 'Motion Approved' : outcome === 'rejected' ? 'Motion Rejected' : 'Voting in Progress'
  const progressPct = boardMembers.length > 0 ? Math.round((totalVoted / boardMembers.length) * 100) : 0

  return (
    <div>
      {/* Status strip — one line, one progress bar, no nested card chrome */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: outcomeColor }} />
          <p className="text-sm font-semibold text-slate-800">{outcomeLabel}</p>
        </div>
        <span className="text-xs text-slate-500 flex-shrink-0">
          {approveCount} for · {disapproveCount} against · {totalVoted}/{boardMembers.length} voted
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: outcomeColor }} />
      </div>

      <div className="space-y-1">
        {boardMembers.map((member) => {
          const memberVote = votes.find((v) => v.boardMemberId === member.id)
          const isMe = member.id === myMember?.id
          const avatarColor = colorForName(member.name || member.email)
          const initial = (member.name || member.email || '?').charAt(0).toUpperCase()

          return (
            <div key={member.id} className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initial}
                  </span>
                )}
                <span className="text-sm font-medium text-slate-700 truncate">
                  {member.name || member.email}
                  {isMe && !readOnly && <span className="text-slate-400 font-normal"> (you)</span>}
                </span>
              </div>

              {isMe && viewerRole === 'board' && !readOnly ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleVote('Approve')}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      memberVote?.vote === 'Approve'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <Check className="w-3 h-3" strokeWidth={2.5} /> {VOTE_LABEL.Approve}
                  </button>
                  <button
                    onClick={() => handleVote('Disapprove')}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      memberVote?.vote === 'Disapprove'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <X className="w-3 h-3" strokeWidth={2.5} /> {VOTE_LABEL.Disapprove}
                  </button>
                </div>
              ) : memberVote ? (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                    memberVote.vote === 'Approve' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {VOTE_LABEL[memberVote.vote]}
                </span>
              ) : (
                <span className="text-xs text-slate-300 flex-shrink-0">Not yet voted</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}