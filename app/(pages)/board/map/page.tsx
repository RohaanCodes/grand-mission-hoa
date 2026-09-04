// app/(pages)/board/map/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
 import MapView from '../MapLoader'
import { getAllServiceRequests, getBoardMemberById } from '@/lib/airtable'


export const metadata = { title: 'Request Map | Grand Mission HOA' }

export default async function BoardMapPage() {
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
            <h1 className="font-serif text-2xl sm:text-3xl text-primary mb-1">Request Map</h1>
            <p className="text-foreground/60 text-sm">Signed in as {boardMember.name}</p>
          </div>
          <a
            href="/board"
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