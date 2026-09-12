// app/(pages)/board/requests/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'
import RequestsSection from '../RequestsSection'
import Sidebar from '../Sidebar'
import BottomNav from '../BottomNav'

export const metadata = { title: 'Requests | Grand Mission HOA' }

export default async function BoardRequestsPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/board" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link href="/board" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 lg:hidden transition-colors">
            <ArrowLeft size={16} strokeWidth={1.8} /> Dashboard
          </Link>

       

          <RequestsSection
            requests={requests}
            currentEmail={boardMember.email}
            currentName={boardMember.name}
            viewerRole="board"
          />
        </section>
      </main>

      <BottomNav basePath="/board" />
    </div>
  )
}