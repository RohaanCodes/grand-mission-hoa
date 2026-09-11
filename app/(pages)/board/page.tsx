// app/(pages)/board/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'
import BoardDashboard from './BoardDashboard'
import BoardAIAssistant from './BoardAIAssistant'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export const metadata = { title: 'Board Dashboard | Grand Mission HOA' }

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function BoardDashboardPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()
  const firstName = boardMember.name.split(' ')[0]

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/board" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {greeting()}, {firstName}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Here's what needs your attention today.</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <a
                href="https://airtable.com/app3AwDclb6uHhH1J/shrnC68Kokab4V81y"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-2"
              >
                Share feedback
              </a>

              <a
                href="/board/submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm text-center w-full sm:w-auto transition-colors"
              >
                Submit a Request
              </a>
            </div>
          </div>

          <BoardDashboard requests={requests} currentEmail={boardMember.email} currentName={boardMember.name} viewerRole="board" />
          <BoardAIAssistant currentEmail={boardMember.email} />
        </section>
      </main>

      <BottomNav basePath="/board" />
    </div>
  )
}