// app/(pages)/board/votes/archive/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Archive } from 'lucide-react'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'
import VotingSection from '../../VotingSection'
import Sidebar from '../../Sidebar'
import BottomNav from '../../BottomNav'

export const metadata = { title: 'Vote Archive | Grand Mission HOA' }

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

export default async function BoardVotesArchivePage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()
  const resolved = requests.filter((r) => r.vote_outcome === 'Approved' || r.vote_outcome === 'Rejected')

  const now = Date.now()
  const archived = resolved
    .filter((r) => r.vote_resolved_date && now - new Date(r.vote_resolved_date).getTime() > TWO_DAYS_MS)
    .sort((a, b) => new Date(b.vote_resolved_date!).getTime() - new Date(a.vote_resolved_date!).getTime())

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/board" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link
            href="/board/votes"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.8} /> Votes
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
              <Archive className="w-5 h-5" strokeWidth={2} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Vote Archive
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Votes resolved more than 2 days ago
              </p>
            </div>
          </div>

          {archived.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center">
              <p className="text-slate-400 text-sm">Nothing has aged into the archive yet.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {archived.map((req) => {
                const isApproved = req.vote_outcome === 'Approved'
                return (
                  <div key={req.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">
                          {req.final_category || req.category_resident_selected || 'Other'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {req.requester_name}
                          {req.unit_address ? ` · ${req.unit_address}` : ''}
                          {req.vote_resolved_date &&
                            ` · Resolved ${new Date(req.vote_resolved_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </p>
                      </div>
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

                    <div className="pt-4 border-t border-slate-100">
                      <VotingSection
                        requestRecordId={req.id}
                        viewerRole="board"
                        currentEmail={boardMember.email}
                        readOnly
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav basePath="/board" />
    </div>
  )
}