'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

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
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo.png"
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

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6 border-t border-border bg-white"
          >
            <Link href="/" onClick={handleLinkClick} className="block px-4 py-3 text-foreground hover:bg-muted transition-colors">
              Home
            </Link>

            {/* Mobile Community Pages */}
            <button
              onClick={() => toggleDropdown('community')}
              className="w-full text-left px-4 py-3 text-foreground hover:bg-muted transition-colors flex items-center justify-between"
            >
              Community Pages
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'community' && (
              <div className="pl-8 space-y-1">
                <Link href="/news" onClick={handleLinkClick} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                  News & Updates
                </Link>
                <Link href="/events" onClick={handleLinkClick} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                  Events & Calendar
                </Link>
                <Link href="/gallery" onClick={handleLinkClick} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                  Photo Gallery
                </Link>
                <Link href="/amenities" onClick={handleLinkClick} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                  Amenities
                </Link>
              </div>
            )}

            {/* Mobile For Residents */}
            <button
              onClick={() => toggleDropdown('residents')}
              className="w-full text-left px-4 py-3 text-foreground hover:bg-muted transition-colors flex items-center justify-between"
            >
              For Residents
              <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'residents' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'residents' && (
              <div className="pl-8 space-y-1">
                <Link href="/documents" onClick={handleLinkClick} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                  Documents & Forms
                </Link>
                <Link href="/contacts" onClick={handleLinkClick} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                  Contacts
                </Link>
                 
                <Link href="/faqs" onClick={handleLinkClick} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                  FAQs
                </Link>
              </div>
            )}

            {/* Mobile CTA */}
            <a
              href="https://cai.vantaca.com/"
              onClick={handleLinkClick}
              className="block mx-4 mt-4 bg-accent text-accent-foreground px-4 py-3 rounded-lg text-center hover:opacity-90 transition-opacity font-medium"
            >
              Make a Payment
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  )
}