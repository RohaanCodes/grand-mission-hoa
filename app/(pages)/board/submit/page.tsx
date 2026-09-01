import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getBoardMemberById, getRequestCategories } from '@/lib/airtable'
import BoardRequestForm from './BoardRequestForm'

export default async function BoardSubmitPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const categories = await getRequestCategories()

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-serif text-4xl text-primary mb-2">Submit a Request</h1>
        <p className="text-foreground/70 mb-8">
          Submitting as <span className="font-medium">{boardMember.name}</span>
        </p>
        <BoardRequestForm categories={categories} />
      </section>
    </main>
  )
}