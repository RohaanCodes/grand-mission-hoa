'use client'
import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getAllContacts } from '@/lib/airtable'
import type { Contact } from '@/lib/types'
import { Phone, Mail, MapPin, Clock, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('All')

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
      utility: 'Utility',
      vendor: 'Service Provider',
      police: 'Law Enforcement',
      general: 'General'
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      clubhouse: 'bg-blue-100 text-blue-700',
      management: 'bg-green-100 text-green-700',
      emergency: 'bg-red-100 text-red-700',
      utility: 'bg-amber-100 text-amber-700',
      vendor: 'bg-purple-100 text-purple-700',
      police: 'bg-rose-100 text-rose-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  // Filtered + Sorted Contacts (Emergency & Police always on top)
  const filteredContacts = useMemo(() => {
    let result = [...contacts]

    // Filter by selected type
    if (selectedType !== 'All') {
      result = result.filter(c => c.type === selectedType)
    }

    // Sort: Emergency & Police first, then by order field
    result.sort((a, b) => {
      const isPriorityA = a.type === 'emergency' || a.type === 'police'
      const isPriorityB = b.type === 'emergency' || b.type === 'police'

      if (isPriorityA && !isPriorityB) return -1
      if (!isPriorityA && isPriorityB) return 1

      return (a.order || 999) - (b.order || 999)
    })

    return result
  }, [contacts, selectedType])

  const uniqueTypes = ['All', ...new Set(contacts.map(c => c.type))]

  return (
    <main className="min-h-screen">
      <div className="bg-card border-b border-border py-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Contacts
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Important contacts for the Grand Mission HOA community
          </p>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Type Filter Dropdown */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white border border-border rounded-xl px-5 py-3">
              <span className="text-sm font-medium text-muted-foreground">Show:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent border-0 focus:ring-0 text-foreground font-medium py-1 pr-8 cursor-pointer"
              >
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Contacts' : getTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No contacts found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredContacts.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 2) * 0.1 }}
                  className={`bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all ${contact.is_important ? 'ring-2 ring-amber-400' : ''}`}
                >
                  <div className="mb-4 flex justify-between items-start">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(contact.type)}`}>
                      {getTypeLabel(contact.type)}
                    </span>
                    {contact.is_important && (
                      <span className="text-amber-500 text-xs font-medium">★ Important</span>
                    )}
                  </div>

                  {contact.name && (
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {contact.name}
                    </h3>
                  )}
                  {contact.role && (
                    <p className="text-muted-foreground mb-4">{contact.role}</p>
                  )}

                  <div className="space-y-4">
                    {contact.phone && (
                      <div className="flex items-center justify-between group">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors flex-1">
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          <span>{contact.phone}</span>
                        </a>
                        <button onClick={() => copyToClipboard(contact.phone!, `phone-${contact.id}`)} className="text-muted-foreground hover:text-primary p-1">
                          {copiedField === `phone-${contact.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {contact.secondary_phone && (
                      <div className="flex items-center justify-between group">
                        <a href={`tel:${contact.secondary_phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors flex-1">
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          <span>Secondary: {contact.secondary_phone}</span>
                        </a>
                        <button onClick={() => copyToClipboard(contact.secondary_phone!, `sec-phone-${contact.id}`)} className="text-muted-foreground hover:text-primary p-1">
                          {copiedField === `sec-phone-${contact.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {contact.after_hours_phone && (
                      <div className="flex items-center justify-between group bg-red-50 border border-red-100 rounded-lg p-3">
                        <a href={`tel:${contact.after_hours_phone}`} className="flex items-center gap-3 text-red-700 hover:text-red-800 transition-colors flex-1">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                          <span>After Hours: {contact.after_hours_phone}</span>
                        </a>
                        <button onClick={() => copyToClipboard(contact.after_hours_phone!, `after-${contact.id}`)} className="text-red-600 hover:text-red-700 p-1">
                          {copiedField === `after-${contact.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {contact.email && (
                      <div className="flex items-center justify-between group">
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors flex-1">
                          <Mail className="w-5 h-5 flex-shrink-0" />
                          <span>{contact.email}</span>
                        </a>
                        <button onClick={() => copyToClipboard(contact.email!, `email-${contact.id}`)} className="text-muted-foreground hover:text-primary p-1">
                          {copiedField === `email-${contact.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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

                    {contact.note && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 leading-relaxed">
                        {contact.note}
                      </div>
                    )}

                    {contact.website && (
                      <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2 text-sm">
                        Visit Website <ExternalLink className="w-4 h-4" />
                      </a>
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