'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllDocuments } from '@/lib/airtable'
import type { Document } from '@/lib/types'
import { FileText, Download, FolderOpen } from 'lucide-react'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

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

  // Group documents by category
  const groupedDocs = documents.reduce(
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

  return (
    <main className="min-h-screen">
    {/* Header - Consistent Alignment */}
<div className="bg-card border-b border-border py-12 px-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
      Documents
    </h1>
    <p className="text-lg text-muted-foreground max-w-3xl">
      Access important documents and resources for residents.
    </p>
  </div>
</div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No documents available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedDocs).map(([category, docs], catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FolderOpen className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">
                      {category}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {docs.map((doc, i) => (
                      <motion.a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg hover:border-primary transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="w-6 h-6 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {doc.title}
                            </h3>
                            {doc.updated_date && (
                              <p className="text-sm text-muted-foreground">
                                Updated: {doc.updated_date}
                              </p>
                            )}
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
