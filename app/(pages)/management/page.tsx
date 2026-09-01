import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAllServiceRequests, getManagementById } from '@/lib/airtable'
import BoardDashboard from '../board/BoardDashboard'

export const metadata = { title: 'Management Dashboard | Grand Mission HOA' }

export default async function ManagementDashboardPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('mgmt_token')?.value
  if (!id) redirect('/management/login')

  const mgmt = await getManagementById(id)
  if (!mgmt) redirect('/management/login')

  const requests = await getAllServiceRequests()

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 lg:py-24">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary mb-8">
          Management Dashboard
        </h1>
        <BoardDashboard
  requests={requests}
  currentEmail={mgmt.email}
  currentName={mgmt.name}
  enableQueries
  viewerRole="management"
/>
      </section>
    </main>
  )
}