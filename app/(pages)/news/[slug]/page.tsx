'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getNewsBySlug } from '@/lib/airtable'
import { formatDate } from '@/lib/utils'
import type { News } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Article not found
            </h1>
            <p className="text-muted-foreground">
              Sorry, we couldn&apos;t find the article you&apos;re looking for.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Get image from attachment field
  const imageUrl = article.image && article.image.length > 0 ? article.image[0].url : null

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Glassmorphism Back Button */}
   <Link
    href="/news"
    className="inline-flex items-center gap-2 px-6 py-3 
               bg-white border-2 border-border 
               hover:bg-primary hover:text-white hover:border-primary 
               rounded-xl text-foreground font-medium 
               transition-all duration-300 shadow-sm hover:shadow-md"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to News
  </Link>
      </div>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {/* Hero Image with Placeholder */}
        <div className="rounded-lg overflow-hidden mb-8 h-[400px] bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-4 opacity-40">📰</div>
                 
              </div>
            </div>
          )}
        </div>

        {/* Title and Meta */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {article.title}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
            <span>{formatDate(article.published_date)}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xl text-muted-foreground mb-8 italic">
          {article.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-8">
          <Link
            href="/news"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all font-medium"
          >
            Back to All News
          </Link>
        </div>
      </motion.article>
    </main>
  )
}