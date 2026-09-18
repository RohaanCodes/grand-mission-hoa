// app/(pages)/management/requests/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAllServiceRequests, getManagementById, getThreadSummaries } from '@/lib/airtable'
import RequestsSection from '../../board/RequestsSection'
import Sidebar from '../../board/Sidebar'
import BottomNav from '../../board/BottomNav'

export const metadata = { title: 'Requests | Grand Mission HOA' }

export default async function ManagementRequestsPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('mgmt_token')?.value
  if (!id) redirect('/management/login')

  const mgmt = await getManagementById(id)
  if (!mgmt) redirect('/management/login')

  const requests = await getAllServiceRequests(true)

  // Bulk-fetched once, not per-card — see getThreadSummaries in lib/airtable.ts
  const threadSummariesMap = await getThreadSummaries()
  const threadSummaries = Object.fromEntries(threadSummariesMap)

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/management" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          <RequestsSection
            requests={requests}
            currentEmail={mgmt.email}
            currentName={mgmt.name}
            viewerRole="management"
            backHref="/management"
            threadSummaries={threadSummaries}
          />
        </section>
      </main>

      <BottomNav basePath="/management" />
    </div>
  )
}