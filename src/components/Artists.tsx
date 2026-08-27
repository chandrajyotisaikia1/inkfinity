import { artists } from '@/data';
import { useReveal } from '@/hooks/useReveal';
import { useBooking } from '@/store/BookingContext';
import { Star, Instagram, Award } from 'lucide-react';

export default function Artists() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { openBooking } = useBooking();

  return (
    <section id="artists" className="relative bg-ink-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center">
            <span className="section-eyebrow">The Collective</span>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Meet the <span className="gold-text italic">Artists</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-100">
              Four specialists. Four obsessions. Each artist is hand-picked for mastery of their craft.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {artists.map((artist, i) => (
              <div
                key={artist.id}
                className="group panel overflow-hidden transition-all duration-500 hover:border-gold/20"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-ink-black/70 px-3 py-1.5 backdrop-blur-sm">
                    <Star size={12} fill="#D4AF37" className="text-gold" />
                    <span className="text-xs font-semibold text-white">{artist.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
                    {artist.specialty}
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-white">{artist.name}</h3>
                  <p className="mt-0.5 text-sm text-ink-200">{artist.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-100 line-clamp-3">{artist.bio}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-ink-200">
                      <Award size={13} className="text-gold/60" />
                      {artist.experienceYears} yrs
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-ink-200">
                      <Instagram size={13} className="text-gold/60" />
                      {artist.instagram}
                    </span>
                  </div>
                  <button
                    onClick={openBooking}
                    className="mt-4 w-full rounded-lg border border-white/10 py-2.5 text-xs font-medium uppercase tracking-wider text-ink-100 transition-all duration-300 hover:border-gold/40 hover:text-gold"
                  >
                    Book with {artist.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
