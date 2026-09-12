// app/(pages)/management/requests/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllServiceRequests, getManagementById } from '@/lib/airtable'
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

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/management" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link href="/management" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 lg:hidden transition-colors">
            <ArrowLeft size={16} strokeWidth={1.8} /> Dashboard
          </Link>

          

          <RequestsSection
            requests={requests}
            currentEmail={mgmt.email}
            currentName={mgmt.name}
            viewerRole="management"
          />
        </section>
      </main>

      <BottomNav basePath="/management" />
    </div>
  )
}