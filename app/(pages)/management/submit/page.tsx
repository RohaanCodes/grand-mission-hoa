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
    <main className="min-h-screen bg-background">
      <section className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-serif text-4xl text-primary mb-2">Log an Item</h1>
        <p className="text-foreground/70 mb-8">
          Submit something directly — include a solution and timeline if you already have one.
        </p>
        <ManagementRequestForm categories={categories} />
      </section>
    </main>
  )
}