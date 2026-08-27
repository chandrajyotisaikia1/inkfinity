import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useBooking } from '@/store/BookingContext';

const links = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'Artists', href: '#artists' },
  { label: 'Try-On', href: '#tryon' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink-black/85 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-ink-black">
            <span className="font-serif text-lg font-bold">I</span>
          </span>
          <span className="font-serif text-xl font-semibold tracking-wide text-white">
            Inkfinity
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-100 transition-colors duration-200 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/admin"
            className="text-xs font-medium uppercase tracking-widest text-ink-200 transition-colors hover:text-gold/70"
            title="Studio Manager"
          >
            Studio
          </Link>
          <button onClick={openBooking} className="btn-gold !px-5 !py-2.5 text-sm">
            Book Consultation
          </button>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-ink-black/95 backdrop-blur-xl">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-100 transition-colors hover:bg-white/5 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 text-xs font-medium uppercase tracking-widest text-ink-200 hover:text-gold"
            >
              Studio Manager
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                openBooking();
              }}
              className="btn-gold mt-2 text-sm"
            >
              Book Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
