// app/(pages)/board/BottomNav.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ListChecks,
  Gavel,
  MapPin,
  BarChart3,
  LayoutGrid,
  UserCircle,
  LucideIcon,
} from 'lucide-react'

const NAV_ITEMS: { label: string; icon: LucideIcon; path: string }[] = [
  { label: 'Overview', icon: Home, path: '' },
  { label: 'Requests', icon: ListChecks, path: '/requests' },
  { label: 'Votes', icon: Gavel, path: '/votes' },
  { label: 'Map', icon: MapPin, path: '/map' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Assets', icon: LayoutGrid, path: '/assets' },
  { label: 'Profile', icon: UserCircle, path: '/profile' },
]

export default function BottomNav({
  basePath,
}: {
  basePath: '/board' | '/management'
}) {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch overflow-x-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const href = `${basePath}${item.path}`
          const isActive = pathname === href
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={href}
              className={`
                flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5
                text-[10px] font-medium transition-colors min-w-[58px]
                ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <div
                className={`
                  flex items-center justify-center w-10 h-8 rounded-xl transition-colors
                  ${isActive ? 'bg-blue-50' : ''}
                `}
              >
                <Icon
                  className="w-[18px] h-[18px]"
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </div>
              <span className="leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}