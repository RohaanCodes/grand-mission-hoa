// components/conditional-chrome.tsx
'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/board') || pathname?.startsWith('/management')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  )
}