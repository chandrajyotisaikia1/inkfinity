import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useBooking } from '@/store/BookingContext';

export default function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer className="relative border-t border-white/5 bg-ink-black">
      {/* CTA band */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            Ready to make it <span className="gold-text italic">permanent?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-100">
            Book a consultation. A ₹2,000 deposit locks your slot and your artist's focus.
          </p>
          <button onClick={openBooking} className="btn-gold mt-6">
            Book Consultation
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold">
                <span className="font-serif text-lg font-bold">I</span>
              </span>
              <span className="font-serif text-xl font-semibold text-white">Inkfinity</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-200">
              Art that outlives you. Mumbai's premier tattoo collective since 2014.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-100">
              <li><a href="#gallery" className="hover:text-gold transition-colors">Gallery</a></li>
              <li><a href="#artists" className="hover:text-gold transition-colors">Artists</a></li>
              <li><a href="#tryon" className="hover:text-gold transition-colors">Try-On Tool</a></li>
              <li><a href="#faq" className="hover:text-gold transition-colors">FAQ</a></li>
              <li><Link to="/admin" className="hover:text-gold transition-colors">Studio Manager</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-100">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gold/60" />
                Bandra West, Mumbai 400050
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="flex-shrink-0 text-gold/60" />
                +91 98200 00000
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="flex-shrink-0 text-gold/60" />
                hello@inkfinity.studio
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram size={16} className="flex-shrink-0 text-gold/60" />
                @inkfinity.studio
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-100">
              <li className="flex justify-between"><span>Mon – Fri</span><span className="text-ink-200">11am – 8pm</span></li>
              <li className="flex justify-between"><span>Saturday</span><span className="text-ink-200">10am – 6pm</span></li>
              <li className="flex justify-between"><span>Sunday</span><span className="text-ink-200">Closed</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-ink-300">© 2026 Inkfinity Studio. All rights reserved.</p>
          <p className="text-xs text-ink-300">Crafted in true black & gold.</p>
        </div>
      </div>
    </footer>
  );
}
