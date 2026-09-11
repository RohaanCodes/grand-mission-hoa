// app/(pages)/management/votes/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Gavel, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { getAllServiceRequests, getManagementById } from '@/lib/airtable'
import VotingSection from '../../board/VotingSection'
import Sidebar from '../../board/Sidebar'
import BottomNav from '../../board/BottomNav'

export const metadata = { title: 'Board Votes | Grand Mission HOA' }

export default async function ManagementVotesPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('mgmt_token')?.value
  if (!id) redirect('/management/login')

  const mgmt = await getManagementById(id)
  if (!mgmt) redirect('/management/login')

  const requests = await getAllServiceRequests()
  const openVotes = requests.filter((r) => r.voting_open)
  const approved = requests.filter((r) => r.vote_outcome === 'Approved')
  const rejected = requests.filter((r) => r.vote_outcome === 'Rejected')

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/management" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link href="/management" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 lg:hidden transition-colors">
            <ArrowLeft size={16} strokeWidth={1.8} /> Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Gavel className="w-4.5 h-4.5" strokeWidth={2} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Board Votes</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<Clock className="w-4.5 h-4.5" strokeWidth={2} />} value={openVotes.length} label="Currently Open" accent="bg-blue-50 text-blue-600" />
            <StatCard icon={<CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2} />} value={approved.length} label="Approved" accent="bg-emerald-50 text-emerald-600" />
            <StatCard icon={<XCircle className="w-4.5 h-4.5" strokeWidth={2} />} value={rejected.length} label="Rejected" accent="bg-red-50 text-red-600" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Open for a Vote</h2>
              {openVotes.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                  <p className="text-slate-400 text-sm">Nothing is currently open for a vote.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {openVotes.map((req) => (
                    <div key={req.id} className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_6px_-1px_rgba(148,163,184,0.1),0_2px_4px_-1px_rgba(148,163,184,0.06)] p-5">
                      <div className="mb-3">
                        <span className="text-base font-semibold text-slate-900">
                          {req.final_category || req.category_resident_selected || 'Other'}
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {req.requester_name}{req.unit_address ? ` · ${req.unit_address}` : ''}
                        </p>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{req.description}</p>
                      </div>
                      <VotingSection
                        requestRecordId={req.id}
                        viewerRole="management"
                        currentEmail={mgmt.email}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Recently Resolved</h2>
              {approved.length === 0 && rejected.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                  <p className="text-slate-400 text-sm">No votes have been resolved yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {[...approved, ...rejected].map((req) => {
                    const isApproved = req.vote_outcome === 'Approved'
                    return (
                      <div
                        key={req.id}
                        className={`rounded-xl border px-4 py-3 ${
                          isApproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">
                            {req.final_category || req.category_resident_selected || 'Other'}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {req.vote_outcome}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{req.description}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <BottomNav basePath="/management" />
    </div>
  )
}

function StatCard({ icon, value, label, accent }: { icon: React.ReactNode; value: number; label: string; accent: string }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
      </div>
    </div>
  )
}