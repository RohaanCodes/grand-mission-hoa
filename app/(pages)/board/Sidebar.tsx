// app/(pages)/board/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
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
  Building2,
  MoreHorizontal,
  ChevronDown,
  LucideIcon,
} from 'lucide-react'

const PRIMARY_ITEMS: { label: string; icon: LucideIcon; path: string }[] = [
  { label: 'Overview', icon: Home, path: '' },
  { label: 'Requests', icon: ListChecks, path: '/requests' },
  { label: 'Votes', icon: Gavel, path: '/votes' },
]

const MORE_ITEMS: { label: string; icon: LucideIcon; path: string }[] = [
  { label: 'Map', icon: MapPin, path: '/map' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Assets', icon: LayoutGrid, path: '/assets' },
]

const PROFILE_ITEM: { label: string; icon: LucideIcon; path: string } = {
  label: 'Profile', icon: UserCircle, path: '/profile',
}

export default function Sidebar({ basePath }: { basePath: '/board' | '/management' }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isMoreActive = MORE_ITEMS.some((item) => pathname === `${basePath}${item.path}`)
  const [moreOpen, setMoreOpen] = useState(isMoreActive)

  function navClass(isActive: boolean) {
    return `flex items-center gap-3 rounded-lg text-sm font-medium transition-all ${
      collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
    } ${
      isActive
        ? 'bg-white text-blue-700 shadow-md'
        : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
    }`
  }

  return (
    <aside
      className={`hidden lg:flex flex-col flex-shrink-0 relative overflow-hidden bg-[#233C5A] sticky top-0 h-screen transition-all duration-200 ${
        collapsed ? 'w-[68px]' : 'w-56'
      }`}
    >
      {/* Product name + collapse button */}
      <div
        className={`relative flex items-center h-16 flex-shrink-0 border-b border-white/10 ${
          collapsed ? 'justify-center px-0' : 'justify-between px-4'
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-blue-200" strokeWidth={2} />
            </span>
            <span className="text-white font-bold text-lg tracking-tight leading-none">
              GM HOA
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-100 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="w-5 h-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Navigation — scrolls independently if it ever gets long enough,
          Profile stays pinned below regardless */}
      <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {PRIMARY_ITEMS.map((item) => {
          const href = `${basePath}${item.path}`
          const isActive = pathname === href
          const Icon = item.icon

          return (
            <Link key={item.label} href={href} title={collapsed ? item.label : undefined} className={navClass(isActive)}>
              <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
              {!collapsed && item.label}
            </Link>
          )
        })}

        {/* More toggle — reveals Map / Analytics / Assets inline */}
        <button
          onClick={() => setMoreOpen((v) => !v)}
          title={collapsed ? 'More' : undefined}
          className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all ${
            collapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'
          } ${
            isMoreActive
              ? 'text-white bg-white/10'
              : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-3">
            <MoreHorizontal className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={isMoreActive ? 2.25 : 1.75} />
            {!collapsed && 'More'}
          </span>
          {!collapsed && (
            <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${moreOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {(moreOpen || collapsed) && (
            <motion.div
              initial={collapsed ? false : { height: 0, opacity: 0 }}
              animate={collapsed ? {} : { height: 'auto', opacity: 1 }}
              exit={collapsed ? {} : { height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden space-y-1"
            >
              {MORE_ITEMS.map((item) => {
                const href = `${basePath}${item.path}`
                const isActive = pathname === href
                const Icon = item.icon

                return (
                  <Link key={item.label} href={href} title={collapsed ? item.label : undefined} className={navClass(isActive)}>
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
                    {!collapsed && item.label}
                  </Link>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Profile — always visible, pinned to the bottom regardless of More state */}
      <div className="relative px-3 py-3 border-t border-white/10 flex-shrink-0">
        <Link
          href={`${basePath}${PROFILE_ITEM.path}`}
          title={collapsed ? PROFILE_ITEM.label : undefined}
          className={navClass(pathname === `${basePath}${PROFILE_ITEM.path}`)}
        >
          <PROFILE_ITEM.icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={pathname === `${basePath}${PROFILE_ITEM.path}` ? 2.25 : 1.75} />
          {!collapsed && PROFILE_ITEM.label}
        </Link>
      </div>
    </aside>
  )
}