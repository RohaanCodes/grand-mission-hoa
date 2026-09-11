// app/(pages)/board/VotingSection.tsx
'use client'
import { useState, useEffect } from 'react'
import { Check, X, Gavel } from 'lucide-react'
import { getVotingDataAction, castVoteAction, resolveVoteAction } from './votingActions'

interface BoardMemberInfo { id: string; name: string; email: string; photoUrl?: string }
interface VoteInfo { boardMemberId: string; vote: 'Approve' | 'Disapprove' }

const AVATAR_COLORS = ['#2563eb', '#0891b2', '#16a34a', '#9333ea', '#d97706']

function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function VotingSection({
  requestRecordId,
  viewerRole,
  currentEmail,
}: {
  requestRecordId: string
  viewerRole: 'board' | 'management'
  currentEmail: string
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
    if (!myMember || submitting) return
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
    if (loading) return
    if (outcome === 'passed') resolveVoteAction(requestRecordId, 'Approved')
    else if (outcome === 'rejected') resolveVoteAction(requestRecordId, 'Rejected')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, loading])

  if (loading) {
    return <div className="py-6 text-center text-sm text-slate-400">Loading votes…</div>
  }

  const outcomeConfig = {
    passed: { border: 'border-l-green-500', badgeBg: 'bg-green-50', badgeText: 'text-green-700', label: 'Motion Approved' },
    rejected: { border: 'border-l-red-500', badgeBg: 'bg-red-50', badgeText: 'text-red-700', label: 'Motion Rejected' },
    pending: { border: 'border-l-amber-400', badgeBg: 'bg-amber-50', badgeText: 'text-amber-700', label: 'Voting in Progress' },
  }[outcome]

  const progressPct = boardMembers.length > 0 ? Math.round((totalVoted / boardMembers.length) * 100) : 0

  return (
    <div className={`bg-white border border-slate-200/80 border-l-4 ${outcomeConfig.border} rounded-2xl shadow-sm overflow-hidden`}>
      <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${outcomeConfig.badgeBg} ${outcomeConfig.badgeText}`}>
            <Gavel className="w-4 h-4" strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{outcomeConfig.label}</p>
            <p className="text-xs text-slate-400">{totalVoted} of {boardMembers.length} board members voted</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${outcomeConfig.badgeBg} ${outcomeConfig.badgeText} flex-shrink-0`}>
          {approveCount} for · {disapproveCount} against
        </span>
      </div>

      <div className="h-1 bg-slate-100">
        <div
          className={`h-full transition-all ${outcome === 'passed' ? 'bg-green-500' : outcome === 'rejected' ? 'bg-red-500' : 'bg-amber-400'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="divide-y divide-slate-100">
        {boardMembers.map((member) => {
          const memberVote = votes.find((v) => v.boardMemberId === member.id)
          const isMe = member.id === myMember?.id
          const avatarColor = colorForName(member.name || member.email)
          const initial = (member.name || member.email || '?').charAt(0).toUpperCase()

          return (
            <div key={member.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
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
                  {isMe && <span className="text-slate-400 font-normal"> (you)</span>}
                </span>
              </div>

              {isMe && viewerRole === 'board' ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleVote('Approve')}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      memberVote?.vote === 'Approve'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-green-100'
                    }`}
                  >
                    <Check className="w-3 h-3" strokeWidth={2.5} /> Approve
                  </button>
                  <button
                    onClick={() => handleVote('Disapprove')}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      memberVote?.vote === 'Disapprove'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-red-100'
                    }`}
                  >
                    <X className="w-3 h-3" strokeWidth={2.5} /> Disapprove
                  </button>
                </div>
              ) : memberVote ? (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
                    memberVote.vote === 'Approve' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {memberVote.vote}
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