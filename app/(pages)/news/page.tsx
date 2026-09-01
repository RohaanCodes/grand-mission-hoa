'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllNews } from '@/lib/airtable'
import { NewsCard } from '@/components/news-card'
import type { News } from '@/lib/types'
import { Search, Calendar, User, Clock, MessageSquare, ArrowUpRight, X, Sparkles, AlertCircle } from 'lucide-react'

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedArticle, setSelectedArticle] = useState<News | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getAllNews()
        setNews(newsData)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Extract separate categories from news items for filter pills
  const categories = ['All', ...Array.from(new Set(news.map(item => item.category).filter(Boolean) as string[]))]

  // Filter based on active tab pill choice and live keyword searches
  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800 pb-16 animate-fade-in">
      
      {/* Header Panel - Perfect visual symmetry with gallery and documents section */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block mb-3.5">
            Community Gazette
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            News & Notifications
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Stay completely up-to-date with active development projects, safety modifications, seasonal amenities announcements, and general HOA newsletters.
          </p>

          {/* Interactive Actions - Live keyword search inputs and category filters */}
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
                placeholder="Search updates by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-450 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 font-medium shadow-2xs transition-all min-h-[44px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium text-sm">Loading community press releases...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-150 p-8 max-w-2xl mx-auto shadow-2xs">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">No articles found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                We couldn't locate any announcements matching "{searchQuery}" under "{selectedCategory}". Try widening your search keywords.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-bold rounded-lg transition-all min-h-[40px] shadow-sm select-none touch-manipulation"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div>
              {/* Responsive columns grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredNews.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NewsCard 
                      news={article} 
                      onClick={() => setSelectedArticle(article)} 
                    />
                  </motion.div>
                ))}
              </div>

               
            </div>
          )}
        </div>
      </div>

      {/* Modern Read-article Drawer/Modal Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark fuzzy backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-100 max-h-[85vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-2xs z-10 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer border border-slate-100"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Dynamic decorative banner image */}
              {selectedArticle.image && (
                <div className="aspect-video w-full relative overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {selectedArticle.category && (
                    <span className="absolute bottom-4 left-4 bg-slate-900/95 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                      {selectedArticle.category}
                    </span>
                  )}
                </div>
              )}

              {/* Text contents container (scrollable for longer text) */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                {!selectedArticle.image && selectedArticle.category && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {selectedArticle.category}
                  </span>
                )}

                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                {/* Meta details bar */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 pt-2 pb-4 border-b border-slate-100 text-slate-400 text-xs font-semibold">
                  {selectedArticle.published_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedArticle.published_date}
                    </span>
                  )}
                  {selectedArticle.read_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedArticle.read_time}
                    </span>
                  )}
                  {selectedArticle.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedArticle.author}
                    </span>
                  )}
                </div>

                {/* Styled paragraph lines */}
                <div className="text-slate-650 text-sm sm:text-base leading-relaxed whitespace-pre-line text-justify pt-1">
                  {selectedArticle.content || selectedArticle.summary}
                </div>
              </div>

              {/* Footer action bar */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all active:scale-98 select-none touch-manipulation min-h-[40px] cursor-pointer"
                >
                  Dismiss Reader
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  )
}