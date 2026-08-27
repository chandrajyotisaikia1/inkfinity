import { useState } from 'react';
import { gallery, artists } from '@/data';
import type { Style } from '@/types';
import { useReveal } from '@/hooks/useReveal';
import { Clock, User } from 'lucide-react';

const filters: (Style | 'All')[] = ['All', 'Blackwork', 'Realism', 'Fine Line', 'Japanese', 'Traditional', 'Geometric', 'Portrait'];

export default function Gallery() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<Style | 'All'>('All');

  const filtered = active === 'All' ? gallery : gallery.filter((g) => g.style === active);
  const artistName = (id: string) => artists.find((a) => a.id === id)?.name ?? '';

  return (
    <section id="gallery" className="relative bg-ink-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center">
            <span className="section-eyebrow">Portfolio</span>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
              The <span className="gold-text italic">Gallery</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-100">
              A curated selection of finished work from our artists. Every piece is original,
              drawn for the skin it lives on.
            </p>
          </div>

          {/* Filter pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  active === f
                    ? 'bg-gold text-ink-black'
                    : 'border border-white/10 text-ink-100 hover:border-gold/40 hover:text-gold'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/5"
                style={{ breakInside: 'avoid' }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ aspectRatio: i % 3 === 0 ? '3/4' : '4/3' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
                    {item.style}
                  </div>
                  <h3 className="mt-1 font-serif text-xl font-semibold text-white">{item.title}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-ink-100">
                    <span className="flex items-center gap-1.5">
                      <User size={12} /> {artistName(item.artistId)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} /> {item.hours}h
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-gold/0 transition-all duration-300 group-hover:border-gold/30 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
