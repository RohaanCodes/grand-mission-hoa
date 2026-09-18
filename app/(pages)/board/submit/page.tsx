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
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">Submit a Request</h1>
        <p className="text-slate-500 text-sm mb-6">
          Submitting as <span className="font-medium text-slate-700">{boardMember.name}</span>
        </p>
        <BoardRequestForm categories={categories} />
      </section>
    </main>
  )
}