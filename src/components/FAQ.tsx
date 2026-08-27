import { useState } from 'react';
import { faqs } from '@/data';
import { useReveal } from '@/hooks/useReveal';
import { Plus, Minus } from 'lucide-react';

export default function FAQ() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState<string | null>(faqs[0].id);

  return (
    <section id="faq" className="relative bg-ink-black py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center">
            <span className="section-eyebrow">Good To Know</span>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Frequently <span className="gold-text italic">Asked</span>
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq) => {
              const isOpen = open === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`panel overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-gold/20' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-serif text-lg font-medium text-white">{faq.question}</span>
                    <span className="flex-shrink-0 rounded-full border border-white/10 p-1.5 text-gold">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink-100">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
