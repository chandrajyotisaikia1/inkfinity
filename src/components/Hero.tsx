import { useBooking } from '@/store/BookingContext';
import { ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  const { openBooking } = useBooking();

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-black bg-grain"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gold/[0.04] blur-[100px]" />
      </div>

      {/* Subtle grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="mx-auto h-full max-w-7xl border-x border-white" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <span className="section-eyebrow">Mumbai · Est. 2014</span>
        </div>

        <h1
          className="animate-fade-up mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-white text-balance sm:text-7xl lg:text-8xl"
          style={{ animationDelay: '0.25s', opacity: 0 }}
        >
          Art That
          <br />
          <span className="gold-shimmer italic">Outlives You</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-100 text-balance"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          Inkfinity is a collective of four obsessive artists crafting permanent
          marks in true black and gold. Every piece is a covenant between skin and story.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: '0.55s', opacity: 0 }}
        >
          <button onClick={openBooking} className="btn-gold group text-base">
            Book Consultation
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <a href="#gallery" className="btn-outline-gold text-base">
            View Gallery
          </a>
        </div>

        <div
          className="animate-fade-up mt-16 flex items-center justify-center gap-8"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          <Stat value="4" label="Master Artists" />
          <Divider />
          <Stat value="3,770+" label="Pieces Inked" />
          <Divider />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="mt-1 text-xs uppercase tracking-widest text-ink-200">4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2">
          <div className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-3xl font-semibold text-white">{value}</span>
      <span className="mt-1 text-xs uppercase tracking-widest text-ink-200">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-10 w-px bg-white/10" />;
}
