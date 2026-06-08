import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Grand Mission HOA',
  description:
    'Welcome to Grand Mission Homeowners Association. Your community portal for amenities, events, documents, and resident information.',
  generator: 'v0.app',
  keywords: [
    'Grand Mission',
    'HOA',
    'Homeowners Association',
    'Community',
    'Amenities',
    'Events',
  ],
  openGraph: {
    title: 'Grand Mission HOA',
    description:
      'Welcome to Grand Mission Homeowners Association. Your community portal for amenities, events, documents, and resident information.',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: '/images/logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1a3a52',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-foreground flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}