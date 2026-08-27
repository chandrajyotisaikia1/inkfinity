import { testimonials } from '@/data';
import { useReveal } from '@/hooks/useReveal';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="reviews" className="relative bg-ink-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center">
            <span className="section-eyebrow">Client Stories</span>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Words From <span className="gold-text italic">The Inked</span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="panel group relative overflow-hidden p-7 transition-all duration-500 hover:border-gold/20"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Quote className="absolute -top-2 -right-2 text-gold/5" size={80} />
                <div className="relative">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} size={16} fill="#D4AF37" className="text-gold" />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-ink-100">"{t.text}"</p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <p className="font-serif text-lg font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-ink-300">{t.date}</p>
                    </div>
                    <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gold">
                      {t.tattoo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
