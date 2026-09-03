// app/(pages)/board/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'
import BoardDashboard from './BoardDashboard'
import BoardAIAssistant from './BoardAIAssistant'

export const metadata = { title: 'Board Dashboard | Grand Mission HOA' }

export default async function BoardDashboardPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()

  return (
    <main className="min-h-screen bg-muted/40">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-primary mb-0.5">Board Dashboard</h1>
            <p className="text-foreground/50 text-sm">Signed in as {boardMember.name}</p>
          </div>

          <a  href="https://airtable.com/app3AwDclb6uHhH1J/shrnC68Kokab4V81y"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-primary/70 hover:text-primary underline underline-offset-2"
  >
    Share feedback
  </a>
          <a
           href="/board/submit"
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium text-sm text-center w-full sm:w-auto hover:opacity-90 transition-opacity"
          >
  
          Submit a Request
          </a>
        </div>

        <BoardDashboard requests={requests} currentEmail={boardMember.email} currentName={boardMember.name} viewerRole="board" />
       <BoardAIAssistant currentEmail={boardMember.email} />
      </section>
    </main>
  )
}