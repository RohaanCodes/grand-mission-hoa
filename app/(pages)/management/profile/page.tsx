// app/(pages)/management/profile/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserCircle } from 'lucide-react'
import { getManagementById } from '@/lib/airtable'
import ProfileForm from '../../board/ProfileForm'
import Sidebar from '../../board/Sidebar'
import BottomNav from '../../board/BottomNav'

export const metadata = { title: 'Profile | Grand Mission HOA' }

export default async function ManagementProfilePage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('mgmt_token')?.value
  if (!id) redirect('/management/login')

  const mgmt = await getManagementById(id)
  if (!mgmt) redirect('/management/login')

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/management" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link href="/management" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 lg:hidden transition-colors">
            <ArrowLeft size={16} strokeWidth={1.8} /> Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-4.5 h-4.5" strokeWidth={2} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
          </div>

          <ProfileForm
            role="management"
            recordId={mgmt.id}
            name={mgmt.name}
            email={mgmt.email}
            photoUrl={mgmt.photoUrl}
          />
        </section>
      </main>

      <BottomNav basePath="/management" />
    </div>
  )
}