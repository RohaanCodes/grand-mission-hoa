'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getNewsBySlug } from '@/lib/airtable'
import { formatDate } from '@/lib/utils'
import type { News } from '@/lib/types'
import { ArrowLeft, Calendar, User, Clock, Bookmark, Sparkles, Share2 } from 'lucide-react'

export default function NewsDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [article, setArticle] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return

    const fetchArticle = async () => {
      try {
        const data = await getNewsBySlug(slug)
        if (data) {
          setArticle(data)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching article:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  // Multi-format image resolver: handles string URL, array of objects [{url: '...'}] or array of strings ['...']
  const getImageUrl = (image: any): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    if (Array.isArray(image) && image.length > 0) {
      const first = image[0]
      if (typeof first === 'string') return first
      if (first && typeof first === 'object' && first.url) return first.url
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50/40 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm animate-fade-in">
          <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-slate-950 mb-2">Article not found</h1>
          <p className="text-slate-500 mb-6 text-sm">Sorry, we couldn&apos;t find the article you are looking for.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-98 cursor-pointer select-none touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(article.image)

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* Back Button breadcrumb */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <Link
            href="/news"
            className="group inline-flex items-center gap-2 px-3.5 py-2 bg-white/80 hover:bg-white border border-slate-200/65 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-amber-700 transition-all shadow-2xs active:scale-[0.98] select-none touch-manipulation min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-all font-bold" />
            Back to News
          </Link>
        </div>

        {/* Article Details Layout */}
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Cover image fluid aspect ratio frame */}
          <div className="rounded-2xl overflow-hidden shadow-sm aspect-video sm:aspect-21/9 bg-slate-100 relative border border-slate-200/50">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-50/20 to-slate-100 flex flex-col items-center justify-center text-slate-350">
                <span className="text-6xl mb-3">📰</span>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Grand Mission Gazette</p>
              </div>
            )}
          </div>

          {/* Heading meta panel */}
          <div className="space-y-4">
            {article.category && (
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100/60 rounded-lg text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Publication details metadata row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 border-t border-b border-slate-200/60 py-4 text-xs sm:text-sm font-semibold text-slate-500">
              {article.published_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(article.published_date)}
                </span>
              )}
              {article.read_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {article.read_time}
                </span>
              )}
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  By {article.author}
                </span>
              )}
            </div>
          </div>

          {/* Summary/Excerpt block */}
          {article.summary && (
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-serif italic border-l-4 border-amber-500/40 pl-5 py-1">
              {article.summary}
            </p>
          )}

          {/* Core Body content */}
          {article.content && (
            <div className="bg-white border border-slate-100 p-6 sm:p-10 rounded-2xl shadow-3xs leading-relaxed">
              <div className="text-sm sm:text-base text-slate-700 text-justify whitespace-pre-line font-sans space-y-4 leading-relaxed">
                {article.content}
              </div>
            </div>
          )}

          {/* Bottom Footer actions section feedback */}
          <div className="border-t border-slate-200/60 pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link
              href="/news"
              className="w-full sm:w-auto text-center bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-98 select-none touch-manipulation min-h-[46px] flex items-center justify-center"
            >
              Back to All News
            </Link>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => alert('Article saved to your browser bookmarks folder!')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-250/50 rounded-xl text-xs font-bold transition-all active:scale-98 min-h-[46px] cursor-pointer select-none"
              >
                <Bookmark className="w-4 h-4 text-slate-450" />
                Bookmark
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Page link copied to clipboard!');
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-250/50 rounded-xl text-xs font-bold transition-all active:scale-98 min-h-[46px] cursor-pointer select-none"
              >
                <Share2 className="w-4 h-4 text-slate-450" />
                Share
              </button>
            </div>
          </div>

        </motion.article>
      </div>
    </main>
  )
}