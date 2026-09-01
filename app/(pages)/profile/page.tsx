import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getResidentByAccessToken, getRequestsByResidentEmail } from '@/lib/airtable'
import RequestsList from './RequestsList'

export const metadata = {
  title: 'My Requests | Grand Mission HOA',
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('resident_token')?.value

  if (!token) {
    redirect('/profile/login')
  }

  const resident = await getResidentByAccessToken(token)

  if (!resident) {
    redirect('/profile/login?error=invalid')
  }

  const requests = await getRequestsByResidentEmail(resident.email)

  const activeCount = requests.filter(
    (r) => r.status && !['Resolved', 'Closed'].includes(r.status)
  ).length
  const resolvedCount = requests.filter((r) => r.status === 'Resolved').length

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
          <h1 className="font-serif text-4xl text-primary">
            Welcome, {resident.resident_name.split(' ')[0]}
          </h1>
          <form action="/profile/sign-out" method="POST">
            <button
              type="submit"
              className="text-sm text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
            >
              Sign out
            </button>
          </form>
        </div>
        <p className="text-foreground/70 mb-8">
          {resident.unit_address ? `${resident.unit_address} · ` : ''}
          {resident.email}
        </p>

        {requests.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <p className="font-serif text-3xl text-primary mb-1">{requests.length}</p>
              <p className="text-xs uppercase tracking-wide text-foreground/50">Total</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <p className="font-serif text-3xl text-[#b8985a] mb-1">{activeCount}</p>
              <p className="text-xs uppercase tracking-wide text-foreground/50">Active</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <p className="font-serif text-3xl text-secondary mb-1">{resolvedCount}</p>
              <p className="text-xs uppercase tracking-wide text-foreground/50">Resolved</p>
            </div>
          </div>
        )}

        <RequestsList requests={requests} />
      </section>
    </main>
  )
}