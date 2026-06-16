'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setOpenDropdown(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false)
    setOpenDropdown(null)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-h-[44px] py-1">
            <Image
              src="/images/logo-1.jpeg"
              alt="Grand Mission Logo"
              width={40}
              height={40}
              className="h-10 w-auto group-hover:opacity-80 transition-opacity"
              priority
            />
            <span className="font-serif font-semibold text-lg text-primary hidden sm:inline">
              Grand Mission HOA
            </span>
          </Link>

          {/* Desktop Navigation - Unchanged */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>

            {/* Community Pages Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium py-2">
                Community Pages
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 top-full w-52 bg-white border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              >
                <Link href="/news" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors first:rounded-t-xl">
                  News & Updates
                </Link>
                <Link href="/events" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors">
                  Events & Calendar
                </Link>
                <Link href="/gallery" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors">
                  Gallery
                </Link>
                <Link href="/amenities" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors">
                  Amenities
                </Link>
                <Link href="/meeting-minutes" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors last:rounded-b-xl">
                  Meeting Minutes
                </Link>
              </motion.div>
            </div>

            {/* For Residents Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium py-2">
                For Residents
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 top-full w-52 bg-white border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              >
                <Link href="/documents" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors first:rounded-t-xl">
                  Documents
                </Link>
                <Link href="/contacts" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors">
                  Contacts
                </Link>
                
                <Link href="/faqs" className="block px-5 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors last:rounded-b-xl">
                  FAQs
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex">
            <a
              href="https://cai.vantaca.com/"
              className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Make a Payment
            </a>
          </div>

          {/* Mobile Hamburger - Optimized size and tap target */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 -m-2.5 hover:bg-muted/80 active:bg-muted/90 rounded-full transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden pb-6 border-t border-border bg-white overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="space-y-1 pt-2">
                <Link 
                  href="/" 
                  onClick={handleLinkClick} 
                  className="block px-4 py-3.5 text-base font-semibold text-foreground hover:bg-neutral-50 active:bg-neutral-100 transition-colors rounded-lg mx-2"
                >
                  Home
                </Link>

                {/* Mobile Community Pages */}
                <div className="mx-2">
                  <button
                    onClick={() => toggleDropdown('community')}
                    className="w-full text-left px-4 py-3.5 text-base font-semibold text-foreground hover:bg-neutral-50 active:bg-neutral-100 transition-colors flex items-center justify-between rounded-lg"
                  >
                    <span>Community Pages</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${openDropdown === 'community' ? 'rotate-180 text-primary' : 'text-neutral-500'}`} />
                  </button>
                  
                  <AnimatePresence>
                    {openDropdown === 'community' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 pr-2 mt-1 mb-2 border-l-2 border-neutral-100 ml-4 space-y-0.5 overflow-hidden"
                      >
                        <Link href="/news" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          News & Updates
                        </Link>
                        <Link href="/events" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          Events & Calendar
                        </Link>
                        <Link href="/gallery" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          Gallery
                        </Link>
                        <Link href="/amenities" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          Amenities
                        </Link>
                        <Link href="/meeting-minutes" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          Meeting Minutes
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile For Residents */}
                <div className="mx-2">
                  <button
                    onClick={() => toggleDropdown('residents')}
                    className="w-full text-left px-4 py-3.5 text-base font-semibold text-foreground hover:bg-neutral-50 active:bg-neutral-100 transition-colors flex items-center justify-between rounded-lg"
                  >
                    <span>For Residents</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-250 ${openDropdown === 'residents' ? 'rotate-180 text-primary' : 'text-neutral-500'}`} />
                  </button>
                  
                  <AnimatePresence>
                    {openDropdown === 'residents' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 pr-2 mt-1 mb-2 border-l-2 border-neutral-100 ml-4 space-y-0.5 overflow-hidden"
                      >
                        <Link href="/documents" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          Documents
                        </Link>
                        <Link href="/contacts" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          Contacts
                        </Link>
                        <Link href="/faqs" onClick={handleLinkClick} className="block px-4 py-3 text-base text-muted-foreground hover:text-primary hover:bg-neutral-50/50 rounded-md transition-colors">
                          FAQs
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile CTA - Full width screen margins with great target height */}
              <div className="px-4 mt-5">
                <a
                  href="https://cai.vantaca.com/"
                  onClick={handleLinkClick}
                  className="block w-full bg-accent text-accent-foreground px-4 py-3.5 rounded-xl text-center hover:opacity-90 active:scale-[0.98] transition-all font-bold tracking-wide shadow-sm min-h-[48px] flex items-center justify-center text-base"
                >
                  Make a Payment
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
export default Navbar;