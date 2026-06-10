import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              About Grand Mission
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Grand Mission Homeowners Association is dedicated to maintaining
              our community's quality of life through excellent amenities,
              community events, and resident services.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/news"
                  className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                >
                  News & Updates
                  
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                >
                  Events
                  
                </Link>
              </li>
              <li>
                <Link
                  href="/amenities"
                  className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                >
                  Amenities
                  
                </Link>
              </li>
              <li>
                <Link
                  href="/documents"
                  className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                >
                  Documents
                   
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                >
                  Gallery
             
                </Link>
              </li>
              <li>
                <Link
                  href="/meeting-minutes"
                  className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                >
                  Meeting Minutes
                  
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  Grand Mission HOA
                  <br />
                  7302 Grand Mission Blvd, Richmond, TX 77407

                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  (O) 281-232-6621 | 
                  (M) 281-772-4655
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                   www.inframark.com/community-management
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            &copy; {currentYear} Grand Mission HOA. All rights reserved.
          </p>
           
        </div>
      </div>
    </footer>
  )
}
