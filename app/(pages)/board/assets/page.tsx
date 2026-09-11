// app/(pages)/board/assets/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  LayoutGrid,
  Inbox,
  CheckCircle2,
  XCircle,
  Wrench,
} from 'lucide-react'
import { getAllAssets, getBoardMemberById } from '@/lib/airtable'
import AssetCard from '../AssetCard'
import Sidebar from '../Sidebar'
import BottomNav from '../BottomNav'

export const metadata = { title: 'Assets | Grand Mission HOA' }

export default async function BoardAssetsPage() {
  const cookieStore = await cookies()
  const id = cookieStore.get('board_token')?.value
  if (!id) redirect('/board/login')

  const boardMember = await getBoardMemberById(id)
  if (!boardMember) redirect('/board/login')

  const assets = await getAllAssets()
  const openCount = assets.filter((a) => a.status === 'Open').length
  const closedCount = assets.filter((a) => a.status === 'Closed').length
  const maintenanceCount = assets.filter((a) => a.status === 'Under Maintenance').length

  return (
    <div className="dashboard flex min-h-screen bg-slate-50">
      <Sidebar basePath="/board" />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Mobile back link */}
          <Link
            href="/board"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 lg:hidden transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.8} /> Dashboard
          </Link>

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <LayoutGrid className="w-5 h-5" strokeWidth={2} />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Amenities & Assets
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Manage status of pools, gyms, and common areas
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Inbox className="w-4.5 h-4.5" />}
              value={assets.length}
              label="Total Amenities"
              accent="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={<CheckCircle2 className="w-4.5 h-4.5" />}
              value={openCount}
              label="Currently Open"
              accent="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={<XCircle className="w-4.5 h-4.5" />}
              value={closedCount}
              label="Closed"
              accent="bg-red-50 text-red-600"
            />
            <StatCard
              icon={<Wrench className="w-4.5 h-4.5" />}
              value={maintenanceCount}
              label="Under Maintenance"
              accent="bg-amber-50 text-amber-600"
            />
          </div>

          {/* Assets grid */}
          {assets.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center">
              <p className="text-slate-400 text-sm">No amenities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  currentName={boardMember.name}
                  canEdit={true}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav basePath="/board" />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode
  value: number
  label: string
  accent: string
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
            {value}
          </p>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
      </div>
    </div>
  )
}