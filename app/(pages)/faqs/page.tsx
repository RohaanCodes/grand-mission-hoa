'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllFAQs } from '@/lib/airtable'
import type { FAQ } from '@/lib/types'
import { Plus, Minus } from 'lucide-react'

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen">
     {/* Header - Consistent Left Alignment */}
<div className="bg-card border-b border-border py-12 px-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
      Frequently Asked Questions
    </h1>
    <p className="text-lg text-muted-foreground max-w-3xl">
      Find quick answers to common questions about Grand Mission HOA.
    </p>
  </div>
</div>

      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No FAQs available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-border rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-medium text-lg pr-8 text-left">
                      {faq.Question}
                    </h3>
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                          {faq.Answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}