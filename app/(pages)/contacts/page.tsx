'use client'
import React, { useEffect, useState, useMemo } from 'react'
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
      clubhouse: 'bg-blue-100 text-blue-750 font-semibold',
      management: 'bg-emerald-100 text-emerald-800 font-semibold',
      emergency: 'bg-red-100 text-red-750 font-semibold',
      utility: 'bg-amber-100 text-amber-800 font-semibold',
      vendor: 'bg-purple-100 text-purple-700 font-semibold',
      police: 'bg-rose-100 text-rose-750 font-semibold',
    }
    return colors[type] || 'bg-slate-100 text-slate-705'
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

  const uniqueTypes = ['All', ...Array.from(new Set(contacts.map(c => c.type as string)))] as string[]

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-800 pb-16 overflow-x-hidden animate-fade-in">
      {/* Mobile-optimized Header Spacer */}
      <div className="bg-white border-b border-slate-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto px-1 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block mb-3.5">
            Community Registry
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            Contacts & Directory
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Quick reference guide for vital contacts, police, emergency dispatch, utility services, and building managements for Grand Mission.
          </p>
        </div>
      </div>

      <div className="py-6 sm:py-8 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Type Filter Dropdown - Full width on narrow devices, inline-flex on wider */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 w-full sm:w-auto justify-between sm:justify-start shadow-2xs">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-450 flex-shrink-0">Filter Directory:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent border-0 focus:ring-0 text-slate-900 font-serif font-bold py-1 pr-8 cursor-pointer text-base md:text-lg outline-none min-h-[44px] flex-1 sm:flex-initial"
              >
                {uniqueTypes.map(type => (
                  <option key={type} value={type} className="text-sm text-slate-800 bg-white font-sans font-medium">
                    {type === 'All' ? 'All Contacts' : getTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-900 border-t-transparent mb-4"></div>
              <p className="text-slate-500 font-medium text-sm">Loading community contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-150 p-8 shadow-2xs">
              <p className="text-slate-500 font-medium text-sm">No contacts found in this selection.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {filteredContacts.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 2) * 0.05, duration: 0.35 }}
                  viewport={{ once: true, margin: '-20px' }}
                  className={`bg-white border rounded-2xl p-4 sm:p-6 shadow-2xs hover:shadow-xs transition-all duration-300 relative ${
                    contact.is_important 
                      ? 'border-amber-300 ring-1 ring-amber-300/30' 
                      : 'border-slate-200/60'
                  }`}
                >
                  <div className="mb-3.5 sm:mb-4 flex justify-between items-start flex-wrap gap-2">
                    <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-md text-[11px] uppercase tracking-wider font-semibold ${getTypeColor(contact.type)}`}>
                      {getTypeLabel(contact.type)}
                    </span>
                    {contact.is_important && (
                      <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase flex items-center gap-1">
                        ★ Priority
                      </span>
                    )}
                  </div>

                  {contact.name && (
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mb-1 leading-snug">
                      {contact.name}
                    </h3>
                  )}
                  {contact.role && (
                    <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-450 mb-3.5 sm:mb-4 uppercase">{contact.role}</p>
                  )}

                  <div className="space-y-3.5 sm:space-y-4">
                    {contact.phone && (
                      <div className="flex items-center justify-between group min-h-[44px]">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-amber-800 transition-colors flex-1 min-h-[44px] py-1.5 font-medium text-xs sm:text-sm">
                          <Phone className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span className="break-all font-mono font-bold">{contact.phone}</span>
                        </a>
                        <button 
                          onClick={() => copyToClipboard(contact.phone!, `phone-${contact.id}`)} 
                          className="text-slate-400 hover:text-slate-700 p-2.5 -mr-2 sm:p-1.5 sm:mr-0 flex-shrink-0 transition-all rounded-lg hover:bg-slate-50 cursor-pointer"
                          aria-label="Copy phone number"
                        >
                          {copiedField === `phone-${contact.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {contact.secondary_phone && (
                      <div className="flex items-center justify-between group min-h-[44px]">
                        <a href={`tel:${contact.secondary_phone}`} className="flex items-center gap-3 text-slate-600 hover:text-amber-800 transition-colors flex-1 min-h-[44px] py-1.5 font-medium text-xs sm:text-sm">
                          <Phone className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span className="break-all font-sans">Secondary: <strong className="font-mono font-bold">{contact.secondary_phone}</strong></span>
                        </a>
                        <button 
                          onClick={() => copyToClipboard(contact.secondary_phone!, `sec-phone-${contact.id}`)} 
                          className="text-slate-400 hover:text-slate-700 p-2.5 -mr-2 sm:p-1.5 sm:mr-0 flex-shrink-0 transition-all rounded-lg hover:bg-slate-50 cursor-pointer"
                          aria-label="Copy secondary phone number"
                        >
                          {copiedField === `sec-phone-${contact.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {contact.after_hours_phone && (
                      <div className="flex items-center justify-between group bg-red-50/40 border border-red-100 rounded-xl p-3 sm:p-3.5 min-h-[44px]">
                        <a href={`tel:${contact.after_hours_phone}`} className="flex items-center gap-3 text-red-700 hover:text-red-900 transition-colors flex-1 min-h-[44px] py-1 text-xs sm:text-sm font-semibold">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-500" />
                          <span className="break-all font-sans">After Hours: <strong className="font-mono font-bold">{contact.after_hours_phone}</strong></span>
                        </a>
                        <button 
                          onClick={() => copyToClipboard(contact.after_hours_phone!, `after-${contact.id}`)} 
                          className="text-red-500 hover:text-red-800 p-2.5 -mr-2 sm:p-1.5 sm:mr-0 flex-shrink-0 transition-all rounded-lg hover:bg-red-105/50 cursor-pointer"
                          aria-label="Copy after hours phone number"
                        >
                          {copiedField === `after-${contact.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {contact.email && (
                      <div className="flex items-center justify-between group min-h-[44px]">
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-slate-600 hover:text-amber-800 transition-colors flex-1 min-h-[44px] py-1.5 text-xs sm:text-sm font-medium">
                          <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span className="break-all">{contact.email}</span>
                        </a>
                        <button 
                          onClick={() => copyToClipboard(contact.email!, `email-${contact.id}`)} 
                          className="text-slate-400 hover:text-slate-700 p-2.5 -mr-2 sm:p-1.5 sm:mr-0 flex-shrink-0 transition-all rounded-lg hover:bg-slate-50 cursor-pointer"
                          aria-label="Copy email address"
                        >
                          {copiedField === `email-${contact.id}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {contact.address && (
                      <div className="flex items-start gap-3 text-slate-550 py-1 text-xs sm:text-sm font-medium leading-relaxed">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                        <span className="text-slate-600">{contact.address}</span>
                      </div>
                    )}

                    {contact.hours && (
                      <div className="flex items-start gap-3 text-slate-550 py-1 text-xs sm:text-sm font-medium leading-relaxed">
                        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                        <span className="text-slate-600">{contact.hours}</span>
                      </div>
                    )}

                    {contact.note && (
                      <div className="mt-4 p-3.5 bg-amber-50/30 border border-amber-100/65 rounded-xl text-xs text-amber-900 leading-relaxed font-semibold">
                        {contact.note}
                      </div>
                    )}

                    {contact.website && (
  <div className="pt-2">
    <a 
      href={
        contact.website.startsWith('http://') || contact.website.startsWith('https://')
          ? contact.website
          : `https://${contact.website}`
      }
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 text-xs font-bold uppercase tracking-wider py-1 hover:underline"
    >
      Visit Website 
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
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