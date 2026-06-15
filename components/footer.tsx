import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white mt-12 md:mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Column 1: About */}
          <div className="border-b border-white/10 md:border-b-0 pb-8 md:pb-0">
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              About Grand Mission
            </h3>
            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              Grand Mission Homeowners Association is dedicated to maintaining
              our community's quality of life through excellent amenities,
              community events, and resident services.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="border-b border-white/10 md:border-b-0 pb-8 md:pb-0">
            <h3 className="font-serif font-bold text-lg mb-4 text-white">
              Quick Links
            </h3>
            {/* Optimized for mobile display with a 2-column compact grid on mobile so links are touch-friendly but content is space-efficient */}
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-1">
              <li>
                <Link
                  href="/news"
                  className="text-white/70 hover:text-accent transition-all text-sm flex items-center min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
                >
                  News & Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-white/70 hover:text-accent transition-all text-sm flex items-center min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/amenities"
                  className="text-white/70 hover:text-accent transition-all text-sm flex items-center min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
                >
                  Amenities
                </Link>
              </li>
              <li>
                <Link
                  href="/documents"
                  className="text-white/70 hover:text-accent transition-all text-sm flex items-center min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
                >
                  Documents
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-white/70 hover:text-accent transition-all text-sm flex items-center min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/meeting-minutes"
                  className="text-white/70 hover:text-accent transition-all text-sm flex items-center min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
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
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://maps.google.com/?q=7302+Grand+Mission+Blvd,+Richmond,+TX+77407" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex gap-3 items-start text-white/80 hover:text-accent transition-all min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
                >
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-tight">
                    Grand Mission HOA
                    <br />
                    <span className="text-white/60 text-xs md:text-sm">7302 Grand Mission Blvd, Richmond, TX 77407</span>
                  </span>
                </a>
              </li>
              <li>
                <div className="flex gap-3 items-start min-h-[44px] py-1 px-1">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div className="flex flex-col gap-1 w-full text-white/80 text-sm">
                    <a 
                      href="tel:2812326621" 
                      className="hover:text-accent active:text-accent/80 transition-all font-medium py-1 flex justify-between items-center bg-white/5 hover:bg-white/10 rounded px-2 w-full max-w-xs md:bg-transparent md:hover:bg-transparent md:p-0"
                    >
                      <span>(O) 281-232-6621</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded md:hidden">Office</span>
                    </a>
                    <a 
                      href="tel:2817724655" 
                      className="hover:text-accent active:text-accent/80 transition-all font-medium py-1 flex justify-between items-center bg-white/5 hover:bg-white/10 rounded px-2 w-full max-w-xs md:bg-transparent md:hover:bg-transparent md:p-0"
                    >
                      <span>(M) 281-772-4655</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded md:hidden">Mobile</span>
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <a 
                  href="https://www.inframark.com/community-management" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex gap-3 items-center text-white/80 hover:text-accent transition-all min-h-[44px] py-2 px-1 hover:bg-white/5 active:bg-white/10 rounded-md select-none touch-manipulation group"
                >
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm break-all">
                    inframark.com/community-management
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-white/60 text-xs sm:text-sm">
            &copy; {currentYear} Grand Mission HOA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
