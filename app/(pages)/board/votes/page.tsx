// app/(pages)/board/votes/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Gavel,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'
import VotingSection from '../VotingSection'
import Sidebar from '../Sidebar'
import BottomNav from '../BottomNav'

export const metadata = { title: 'Board Votes | Grand Mission HOA' }

export default async function BoardVotesPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()
  const openVotes = requests.filter((r) => r.voting_open)
  const approved = requests.filter((r) => r.vote_outcome === 'Approved')
  const rejected = requests.filter((r) => r.vote_outcome === 'Rejected')

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/board" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link
            href="/board"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 lg:hidden transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.8} /> Dashboard
          </Link>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Gavel className="w-5 h-5" strokeWidth={2} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Board Votes
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Review and cast votes on open motions
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<Clock className="w-4.5 h-4.5" strokeWidth={2} />}
              value={openVotes.length}
              label="Currently Open"
              accent="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={<CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2} />}
              value={approved.length}
              label="Approved"
              accent="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={<XCircle className="w-4.5 h-4.5" strokeWidth={2} />}
              value={rejected.length}
              label="Rejected"
              accent="bg-red-50 text-red-600"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Open votes */}
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Open for a Vote
              </h2>

              {openVotes.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center">
                  <p className="text-slate-400 text-sm">
                    Nothing is currently open for a vote.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {openVotes.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Soft blue request summary */}
                      <div className="px-5 py-4 bg-blue-50/60 border-b border-blue-100/80">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[15px] font-semibold text-slate-900">
                              {req.final_category ||
                                req.category_resident_selected ||
                                'Other'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {req.requester_name}
                              {req.unit_address
                                ? ` · ${req.unit_address}`
                                : ''}
                            </p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                            Open for vote
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">
                          {req.description}
                        </p>
                      </div>

                      {/* White voting area */}
                      <div className="p-4">
                        <VotingSection
                          requestRecordId={req.id}
                          viewerRole="board"
                          currentEmail={boardMember.email}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resolved votes */}
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Recently Resolved
              </h2>

              {approved.length === 0 && rejected.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center">
                  <p className="text-slate-400 text-sm">
                    No votes have been resolved yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...approved, ...rejected].map((req) => {
                    const isApproved = req.vote_outcome === 'Approved'
                    return (
                      <div
                        key={req.id}
                        className="bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {req.final_category ||
                              req.category_resident_selected ||
                              'Other'}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {req.vote_outcome}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {req.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <BottomNav basePath="/board" />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode
  value: number
  label: string
  accent: string
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
            {value}
          </p>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
      </div>
    </div>
  )
}