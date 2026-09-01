import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import QueryResponseForm from './QueryResponseForm'

export default async function QueryPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  if (!cookieStore.get('mgmt_token')?.value) redirect('/management/login')

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-lg mx-auto px-6 py-16">
        <h1 className="font-serif text-2xl text-primary mb-6">Respond to Question</h1>
        <QueryResponseForm queryId={params.id} />
      </section>
    </main>
  )
}