'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, Calendar, Clock, Users } from 'lucide-react'

export default function ReservationsPage() {
  return (
    <main className="min-h-screen">
      {/* Header - Consistent Alignment */}
<div className="bg-card border-b border-border py-12 px-4">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
      Amenity Reservations
    </h1>
    <p className="text-lg text-muted-foreground max-w-3xl">
      Reserve our community amenities for your events and activities.
    </p>
  </div>
</div>

      {/* Content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Info Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12 flex gap-4"
          >
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Reservation System
              </h3>
              <p className="text-blue-800 text-sm mb-4">
                Our online reservation system is currently being set up. In the
                meantime, please contact the clubhouse directly to reserve
                amenities.
              </p>
              <a
                href="mailto:info@grandmission.com"
                className="inline-block text-blue-700 hover:text-blue-900 font-medium text-sm underline"
              >
                Contact Clubhouse
              </a>
            </div>
          </motion.div>

          {/* Available Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Available Amenities
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Clubhouse',
                  description: 'Perfect for gatherings and events',
                  icon: Users,
                },
                {
                  name: 'Tennis Courts',
                  description: 'Professional tennis facilities',
                  icon: Calendar,
                },
                {
                  name: 'Swimming Pool',
                  description: 'Olympic-sized community pool',
                  icon: Clock,
                },
                {
                  name: 'Fitness Center',
                  description: 'State-of-the-art exercise equipment',
                  icon: Users,
                },
              ].map((amenity, i) => {
                const IconComponent = amenity.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <IconComponent className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {amenity.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {amenity.description}
                    </p>
                    <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                      Learn More →
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Reservation Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Reservation Guidelines
            </h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>Residents must reserve amenities in advance</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>Maximum reservation time: 8 hours per day</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>
                  A damage deposit may be required for certain amenities
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>
                  Cancellations must be made 48 hours in advance for refunds
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold flex-shrink-0">•</span>
                <span>
                  Amenities must be left clean and in good condition
                </span>
              </li>
            </ul>
          </motion.div>

          {/* CTA */}
          <div className="mt-12 text-center">
           <Link
  href="/contact"
  className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
>
  Contact Clubhouse for Reservations
</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
