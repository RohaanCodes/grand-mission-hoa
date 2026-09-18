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
  Archive,
} from 'lucide-react'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'
import VotingSection from '../VotingSection'
import ResolvedVoteCard from '../ResolvedVoteCard'
import Sidebar from '../Sidebar'
import BottomNav from '../BottomNav'

export const metadata = { title: 'Board Votes | Grand Mission HOA' }

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

export default async function BoardVotesPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()
  const openVotes = requests.filter((r) => r.voting_open)
  const allApproved = requests.filter((r) => r.vote_outcome === 'Approved')
  const allRejected = requests.filter((r) => r.vote_outcome === 'Rejected')

  const now = Date.now()
  function isRecent(r: (typeof requests)[number]): boolean {
    if (!r.vote_resolved_date) return true // no timestamp yet — treat as recent rather than hide it
    return now - new Date(r.vote_resolved_date).getTime() <= TWO_DAYS_MS
  }

  const recentApproved = allApproved.filter(isRecent)
  const recentRejected = allRejected.filter(isRecent)
  const archivedCount = (allApproved.length - recentApproved.length) + (allRejected.length - recentRejected.length)

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
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
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

            <Link
              href="/board/votes/archive"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg px-3.5 py-2 transition-colors flex-shrink-0"
            >
              <Archive className="w-4 h-4" strokeWidth={2} />
              Archive
              {archivedCount > 0 && (
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 rounded-full px-1.5">{archivedCount}</span>
              )}
            </Link>
          </div>

          {/* Stats — same solid-light-color card language as the Overview KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <KpiCard
              icon={<Clock className="w-4.5 h-4.5" strokeWidth={2} />}
              value={openVotes.length}
              label="Currently Open"
              sub="awaiting a decision"
              gradient="from-blue-400 to-blue-600"
            />
            <KpiCard
              icon={<CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2} />}
              value={allApproved.length}
              label="Approved"
              sub="passed by the board"
              gradient="from-emerald-400 to-emerald-600"
            />
            <KpiCard
              icon={<XCircle className="w-4.5 h-4.5" strokeWidth={2} />}
              value={allRejected.length}
              label="Rejected"
              sub="did not pass"
              gradient="from-rose-400 to-rose-600"
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
                      className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
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
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                        {req.description}
                      </p>

                      <div className="pt-4 border-t border-slate-100">
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

            {/* Resolved votes — real snapshot, last 2 days only */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Recently Resolved
                </h2>
                <Link
                  href="/board/votes/archive"
                  className="sm:hidden inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  <Archive className="w-3.5 h-3.5" strokeWidth={2} />
                  Archive
                </Link>
              </div>

              {recentApproved.length === 0 && recentRejected.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center">
                  <p className="text-slate-400 text-sm">
                    No votes have resolved in the last 2 days.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...recentApproved, ...recentRejected].map((req) => (
                    <ResolvedVoteCard key={req.id} req={req} viewerRole="board" currentEmail={boardMember.email} />
                  ))}
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

function KpiCard({
  icon,
  value,
  label,
  sub,
  gradient,
}: {
  icon: React.ReactNode
  value: number
  label: string
  sub: string
  gradient: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/90 leading-tight">{label}</span>
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
      </div>
      <p className="relative text-3xl font-bold leading-none mb-1.5">{value}</p>
      <p className="relative text-xs text-white/80">{sub}</p>
    </div>
  )
}