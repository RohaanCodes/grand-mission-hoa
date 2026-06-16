'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Home, 
  Newspaper, 
  Calendar, 
  Building2, 
  Image as ImageIcon, 
  FileText, 
  Phone, 
  HelpCircle, 
  ArrowRight, 
  MapPin 
} from 'lucide-react'

interface SiteSection {
  name: string
  icon: React.ElementType
  slug: string
  description: string
  whatYouCanFind: string[]
}

export default function SitemapPage() {
  const sections: SiteSection[] = [
    {
      name: 'Home',
      icon: Home,
      slug: '/',
      description: 'The welcoming heart of the Grand Mission HOA resident portal.',
      whatYouCanFind: [
        'Beautiful hero showcase with community highlights',
        'Featured news and upcoming events',
        'Quick navigation to all major sections'
      ]
    },
    {
      name: 'News & Updates',
      icon: Newspaper,
      slug: '/news',
      description: 'Official announcements, board updates, and important community news.',
      whatYouCanFind: [
        'Latest news with images and details',
        'Search and category filters',
        'Copy and bookmark functionality'
      ]
    },
    {
      name: 'Events & Calendar',
      icon: Calendar,
      slug: '/events',
      description: 'Discover and participate in community events and social gatherings.',
      whatYouCanFind: [
        'Categorized event listings',
        'Detailed event information with dates and locations',
        'HOA Sponsorship opportunities'
      ]
    },
    {
      name: 'Amenities',
      icon: Building2,
      slug: '/amenities',
      description: 'Explore all facilities and services available to residents.',
      whatYouCanFind: [
        'Detailed facility descriptions and photos',
        'Button to Contact Mangement for bookings',

      ]
    },
    {
      name: 'Photo Gallery',
      icon: ImageIcon,
      slug: '/gallery',
      description: 'Visual showcase of our beautiful community, events, and amenities.',
      whatYouCanFind: [
        'High-quality categorized photo collections',
        'Full-screen image viewer',
        'Community memories and seasonal highlights'
      ]
    },
    {
      name: 'Documents',
      icon: FileText,
      slug: '/documents',
      description: 'Access important HOA documents, forms, and official resources.',
      whatYouCanFind: [
        'Bylaws, financial reports, and official forms',
        'Easy one-click downloads'
      ]
    },
    {
      name: 'Meeting Minutes',
      icon: FileText,
      slug: '/meeting-minutes',
      description: 'Official records of HOA board meetings and decisions.',
      whatYouCanFind: [
        'Approved meeting minutes and agendas',
        'Key decisions and action items',
        
      ]
    },
    {
      name: 'Contacts',
      icon: Phone,
      slug: '/contacts',
      description: 'Important phone numbers, emails, and management contacts.',
      whatYouCanFind: [
        'Clubhouse, management, and emergency numbers',
        'Click-to-call and copy functionality',
        'After-hours and utility contacts'
      ]
    },
    {
      name: 'Frequently Asked Questions',
      icon: HelpCircle,
      slug: '/faqs',
      description: 'Quick answers to common resident questions.',
      whatYouCanFind: [
        'Searchable knowledge base',
        'Categorized questions and answers',
        
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-slate-50/40 pb-20 pt-6 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 text-center space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            WEBSITE DIRECTORY MAP
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Grand Mission HOA Site Map
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to our complete website directory. This sitemap helps you quickly understand and navigate every section of the Grand Mission HOA resident portal.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((sect, idx) => {
            const IconComponent = sect.icon
            return (
              <motion.div
                key={sect.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h2 className="font-serif text-lg font-bold text-slate-900">
                      {sect.name}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                    {sect.description}
                  </p>

                  {/* What You Can Find */}
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block mb-2">
                      WHAT YOU CAN FIND HERE
                    </span>
                    <ul className="space-y-1.5">
                      {sect.whatYouCanFind.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="text-amber-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Explore Button */}
                <div className="mt-8">
                  <Link
                    href={sect.slug}
                    className="w-full inline-flex items-center justify-between px-5 py-3 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
                  >
                    <span>Explore {sect.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          Need help finding something specific? 
          <Link href="/contacts" className="text-amber-600 hover:underline ml-1 font-medium">
            Visit our Contacts page
          </Link>
        </div>
      </div>
    </main>
  )
}