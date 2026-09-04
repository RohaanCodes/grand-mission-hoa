// app/(pages)/management/map/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
 
import { getAllServiceRequests, getManagementById } from '@/lib/airtable'
import MapView from '../../board/MapLoader'
 

export const metadata = { title: 'Request Map | Grand Mission HOA' }

export default async function ManagementMapPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('mgmt_token')?.value
  if (!id) redirect('/management/login')

  const mgmt = await getManagementById(id)
  if (!mgmt) redirect('/management/login')

  const requests = await getAllServiceRequests()

  return (
    <main className="min-h-screen bg-muted/40">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 className="font-serif text-2xl sm:text-3xl text-primary">Request Map</h1>
          <a
            href="/management"
            className="text-sm text-primary/70 hover:text-primary underline underline-offset-2"
          >
            Back to Dashboard
          </a>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6">
          <MapView requests={requests} />
        </div>
      </section>
    </main>
  )
}