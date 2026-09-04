// app/(pages)/management/page.tsx
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

  const requests = await getAllServiceRequests(true)

  return (
    <main className="min-h-screen bg-muted/40">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 className="font-serif text-2xl sm:text-3xl text-primary">Management Dashboard</h1>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="/management/map"
              className="text-sm text-primary/70 hover:text-primary underline underline-offset-2"
            >
              View Map
            </a>

            <a
              href="https://airtable.com/app3AwDclb6uHhH1J/shrnC68Kokab4V81y"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary/70 hover:text-primary underline underline-offset-2"
            >
              Share feedback
            </a>

            <a
              href="/management/submit"
              className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium text-sm text-center w-full sm:w-auto hover:opacity-90 transition-opacity"
            >
              Log an Item
            </a>
          </div>
        </div>

        <BoardDashboard requests={requests} currentEmail={mgmt.email} currentName={mgmt.name} viewerRole="management" />
      </section>
    </main>
  )
}