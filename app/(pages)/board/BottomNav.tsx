// app/(pages)/board/BottomNav.tsx
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
  MoreHorizontal,
  X,
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
  { label: 'Profile', icon: UserCircle, path: '/profile' },
]

export default function BottomNav({
  basePath,
}: {
  basePath: '/board' | '/management'
}) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isMoreActive = MORE_ITEMS.some((item) => pathname === `${basePath}${item.path}`)

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 rounded-t-2xl shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.15)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch">
          {PRIMARY_ITEMS.map((item) => {
            const href = `${basePath}${item.path}`
            const isActive = pathname === href
            const Icon = item.icon

            return (
              <Link
                key={item.label}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-8 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                  <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.25 : 1.75} />
                </div>
                <span className="leading-none">{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 text-[10px] font-medium transition-colors ${
              isMoreActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-8 rounded-xl transition-colors ${isMoreActive ? 'bg-blue-50' : ''}`}>
              <MoreHorizontal className="w-[18px] h-[18px]" strokeWidth={isMoreActive ? 2.25 : 1.75} />
            </div>
            <span className="leading-none">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl shadow-2xl pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">More</h2>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" strokeWidth={2} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 p-5">
                {MORE_ITEMS.map((item) => {
                  const href = `${basePath}${item.path}`
                  const isActive = pathname === href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.label}
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col items-center gap-2 py-2"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.25 : 1.75} />
                      </div>
                      <span className={`text-xs font-medium text-center leading-tight ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}