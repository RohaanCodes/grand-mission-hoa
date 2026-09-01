// app/(pages)/board/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'
import BoardDashboard from './BoardDashboard'

export const metadata = { title: 'Board Dashboard | Grand Mission HOA' }

export default async function BoardDashboardPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const requests = await getAllServiceRequests()

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: '#eef1ef',
        backgroundImage:
          'radial-gradient(circle, rgba(26,58,82,0.08) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 lg:py-24">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-primary mb-1">Board Dashboard</h1>
            <p className="text-foreground/60 text-sm">Signed in as {boardMember.name}</p>
          </div>
          <a
            href="/board/submit"
            className="bg-accent text-accent-foreground px-4 py-2.5 rounded-md font-medium text-sm text-center w-full sm:w-auto"
          >
            Submit a Request
          </a>
        </div>

        {/* Outer glass sheet */}
        <div className="bg-white/25 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-2xl p-4 sm:p-6 lg:p-8">
          <BoardDashboard
  requests={requests}
  currentEmail={boardMember.email}
  currentName={boardMember.name}
  enableQueries
  viewerRole="board"
/>
        </div>
      </section>
    </main>
  )
}