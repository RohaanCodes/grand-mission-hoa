'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllDocuments } from '@/lib/airtable'
import type { Document } from '@/lib/types'
import { FileText, Download, FolderOpen, Search, Calendar, ArrowUpRight, HelpCircle } from 'lucide-react'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getAllDocuments()
        setDocuments(data)
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Categories extracted from loaded documents
  const categories = ['All', ...Array.from(new Set(documents.map(doc => doc.category).filter(Boolean) as string[]))]

  // Filter documents by tab choice and search input queries
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group filtered results by category
  const groupedDocsByOriginalCategory = filteredDocs.reduce(
    (acc, doc) => {
      const category = doc.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(doc)
      return acc
    },
    {} as Record<string, Document[]>
  )

  const sortedGroupKeys = Object.keys(groupedDocsByOriginalCategory).sort()

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800 pb-16">
      
      {/* Header - Aligned with Event Page/Gallery portfolio headers */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded inline-block mb-3.5">
            Resource Library
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            Documents & Forms
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Access official Grand Mission HOA guidelines, architectural modification request forms, community bylaws, and essential neighborhood resource handbooks.
          </p>

          {/* Interactive Actions - Real-time keyword filter input & categories */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Category selection list */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all whitespace-nowrap select-none touch-manipulation min-h-[40px] flex items-center ${
                    selectedCategory === cat
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 active:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Elastic Search Bar */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search documents by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-450 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 font-medium shadow-2xs transition-all min-h-[44px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium text-sm">Loading community document directories...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-xs">
              <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">No documents match search</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                We couldn't find any resources matching "{searchQuery}" in our {selectedCategory !== 'All' ? `${selectedCategory} category` : 'library'}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold rounded-lg transition-all min-h-[40px] shadow-sm select-none touch-manipulation"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {sortedGroupKeys.map((category, catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.05 }}
                  className="space-y-4"
                >
                  {/* Category Section Title Header */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
                    <FolderOpen className="w-5 h-5 text-amber-600 shrink-0" />
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                      {category}
                    </h2>
                    <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                      {groupedDocsByOriginalCategory[category].length}
                    </span>
                  </div>

                  {/* Document Resource Rows */}
                  <div className="grid grid-cols-1 gap-3">
                    {groupedDocsByOriginalCategory[category].map((doc, idx) => (
                      <motion.a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 border border-slate-150 rounded-xl hover:border-amber-300 active:scale-[0.99] transition-all group cursor-pointer shadow-2xs select-none touch-manipulation min-h-[44px]"
                        title={`Download ${doc.title}`}
                      >
                        <div className="flex items-start gap-3.5 mr-4 overflow-hidden">
                          <div className="p-2.5 bg-slate-50 text-amber-600 rounded-lg group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors shrink-0">
                            <FileText className="w-5 h-5 group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="font-bold text-slate-850 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors">
                              {doc.title}
                            </h3>
                            {doc.updated_date && (
                              <div className="flex items-center gap-1.5 mt-1.5 text-slate-450 text-[11px] font-semibold">
                                <Calendar className="w-3.5 h-3.5 shrink-0" />
                                <span>Updated: {doc.updated_date}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Elegant Download button indicators */}
                        <div className="flex items-center gap-2.5 shrink-0 ml-2">
                          <span className="hidden sm:inline-block text-xs font-bold text-slate-400 group-hover:text-amber-700 uppercase tracking-wider transition-colors">
                            PDF
                          </span>
                          <div className="w-9 h-9 flex items-center justify-center bg-slate-50 group-hover:bg-amber-600 group-hover:text-white rounded-full text-slate-450 transition-all shadow-2xs border border-slate-100">
                            <Download className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Informative Help Card */}
              <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-12">
                <div className="flex items-start sm:items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base">Need a document not listed here?</h4>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Please reach out to our administration office or submit a request directly.</p>
                  </div>
                </div>
                <a
                  href="contact"
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg active:scale-98 transition-all shadow-xs min-h-[40px] select-none touch-manipulation"
                >
                  Request Document
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}
        </div>
      </div>

    </main>
  )
}