'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllFAQs } from '@/lib/airtable'
import type { FAQ } from '@/lib/types'
import { Plus, Minus, Search, HelpCircle, ArrowRight } from 'lucide-react'

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await getAllFAQs()
        setFaqs(data)
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFAQs()
  }, [])

  // Get unique categories dynamically from Airtable data
  const categories = useMemo(() => {
    const cats = new Set(faqs.map(faq => faq.Category || 'General'))
    return ['All', ...Array.from(cats).sort()]
  }, [faqs])

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = 
        faq.Question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.Answer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = 
        activeCategory === 'All' || 
        (faq.Category || 'General') === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [faqs, searchQuery, activeCategory])

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id)
  }

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800 pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded inline-block mb-3.5">
            Self-Service Hub
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Find quick, accurate answers to common questions about Grand Mission HOA.
          </p>

          {/* Filter Controls */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-full border transition-all whitespace-nowrap select-none touch-manipulation min-h-[44px] flex items-center ${
                    activeCategory === cat
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 active:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500">Loading FAQs...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8">
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No matches found</h3>
              <p className="text-slate-500 mt-2">Try different keywords or clear the filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === faq.id
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border rounded-2xl overflow-hidden bg-white transition-all ${
                      isOpen ? 'border-amber-200 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-start justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <span className="text-xs font-medium text-amber-600 uppercase tracking-widest">
                          {faq.Category || 'General'}
                        </span>
                        <h3 className="mt-2 font-medium text-slate-900 leading-snug text-[17px]">
                          {faq.Question}
                        </h3>
                      </div>

                      <div className={`p-2 rounded-full shrink-0 transition-all ${isOpen ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-slate-100"
                        >
                          <div className="p-6 text-slate-600 leading-relaxed whitespace-pre-line">
                            {faq.Answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
              
            </div>

          )}
        </div>
      </div>
    </main>
  )
}