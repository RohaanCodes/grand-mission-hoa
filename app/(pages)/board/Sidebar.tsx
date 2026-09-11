// app/(pages)/board/Sidebar.tsx
'use client'

import { useState } from 'react'
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
  PanelLeftClose,
  PanelLeftOpen,
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

export default function Sidebar({ basePath }: { basePath: '/board' | '/management' }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
  className={`hidden lg:flex flex-col flex-shrink-0 bg-[#041869] sticky top-0 h-screen transition-all duration-200 ${
    collapsed ? 'w-[68px]' : 'w-56'
  }`}
>
      {/* Product name + collapse button */}
      <div
        className={`flex items-center h-16 flex-shrink-0 ${
          collapsed ? 'justify-center px-0' : 'justify-between px-4'
        }`}
      >
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight leading-none">
            GM HOA
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-100 hover:bg-blue-500 hover:text-white transition-colors flex-shrink-0"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="w-5 h-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const href = `${basePath}${item.path}`
          const isActive = pathname === href
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-blue-50 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <Icon
                className="w-4.5 h-4.5 flex-shrink-0"
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              {!collapsed && item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}