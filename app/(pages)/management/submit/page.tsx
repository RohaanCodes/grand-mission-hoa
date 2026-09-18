import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRequestCategories } from '@/lib/airtable'
import ManagementRequestForm from './ManagementRequestForm'

export default async function ManagementSubmitPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('mgmt_token')?.value
  if (!id) redirect('/management/login')

  const categories = await getRequestCategories()

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">Log an Item</h1>
        <p className="text-slate-500 text-sm mb-6">
          Submit something directly, include a solution and timeline if you already have one.
        </p>
        <ManagementRequestForm categories={categories} />
      </section>
    </main>
  )
}