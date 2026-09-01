import { cookies } from 'next/headers'
import { getRequestCategories, getResidentByAccessToken } from '@/lib/airtable'
import RequestForm from './RequestForm'
import RequestInfoPanel from './RequestInfoPanel'

export const metadata = {
  title: 'Submit a Request | Grand Mission HOA',
}

export default async function NewRequestPage() {
  const categories = await getRequestCategories()

  const cookieStore = await cookies()
  const token = cookieStore.get('resident_token')?.value
  const resident = token ? await getResidentByAccessToken(token) : null

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="md:grid md:grid-cols-5 md:gap-16">
          {/* Left column: info (desktop) / Learn More button (mobile) */}
          <div className="md:col-span-2 mb-10 md:mb-0">
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
              Submit a Request
            </h1>
            <p className="text-foreground/80 text-lg mb-8 md:mb-12 leading-relaxed">
              Let us know what's going on and we'll take it from there.
            </p>

            <RequestInfoPanel />
          </div>

          {/* Right column: the form */}
          <div className="md:col-span-3">
            <RequestForm
              categories={categories}
              prefill={
                resident
                  ? {
                      requesterName: resident.resident_name,
                      requesterEmail: resident.email,
                      unitAddress: resident.unit_address || '',
                      phone: resident.phone || '',
                    }
                  : null
              }
            />
          </div>
        </div>
      </section>
    </main>
  )
}