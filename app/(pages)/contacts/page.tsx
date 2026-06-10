'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllContacts } from '@/lib/airtable'
import type { Contact } from '@/lib/types'
import { Phone, Mail, MapPin, Clock, Copy, Check } from 'lucide-react'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getAllContacts()
        setContacts(data)
      } catch (error) {
        console.error('Error fetching contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      clubhouse: 'Clubhouse',
      management: 'Management',
      emergency: 'Emergency',
      
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      clubhouse: 'bg-blue-100 text-blue-700',
      management: 'bg-green-100 text-green-700',
      emergency: 'bg-red-100 text-red-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <main className="min-h-screen">
      {/* Header - Consistent Alignment */}
      <div className="bg-card border-b border-border py-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Contacts
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Get in touch with clubhouse management and important community contacts.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No contact information available yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {contacts.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 2) * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(contact.type)}`}
                    >
                      {getTypeLabel(contact.type)}
                    </span>
                  </div>

                  {contact.name && (
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {contact.name}
                    </h3>
                  )}

                  <div className="space-y-4">
                    {contact.phone && (
                      <div className="flex items-center justify-between group">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors flex-1"
                        >
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          <span>{contact.phone}</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(contact.phone!, `phone-${contact.id}`)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1"
                          title="Copy phone number"
                        >
                          {copiedField === `phone-${contact.id}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}

                    {contact.email && (
                      <div className="flex items-center justify-between group">
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors flex-1"
                        >
                          <Mail className="w-5 h-5 flex-shrink-0" />
                          <span>{contact.email}</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(contact.email!, `email-${contact.id}`)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1"
                          title="Copy email"
                        >
                          {copiedField === `email-${contact.id}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}

                    {contact.address && (
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{contact.address}</span>
                      </div>
                    )}

                    {contact.hours && (
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{contact.hours}</span>
                      </div>
                    )}
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