import { useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Upload, X, Sparkles, RotateCcw, Image as ImageIcon } from 'lucide-react';

export default function TryOn() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const skinRef = useRef<HTMLInputElement>(null);
  const designRef = useRef<HTMLInputElement>(null);

  const [skinImg, setSkinImg] = useState<string | null>(null);
  const [designImg, setDesignImg] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(75);
  const [scale, setScale] = useState(100);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | undefined, setter: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setSkinImg(null);
    setDesignImg(null);
    setOpacity(75);
    setScale(100);
    setPos({ x: 50, y: 50 });
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !designImg) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
  };

  return (
    <section id="tryon" className="relative bg-ink-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center">
            <span className="section-eyebrow">Smart Preview</span>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Tattoo <span className="gold-text italic">Try-On</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-100">
              Upload a photo of your skin and a design. Our CSS blend engine composites the
              ink onto your skin in real time — no AI, no upload to any server.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Upload panel */}
            <div className="panel p-6">
              <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-white">
                <Sparkles size={18} className="text-gold" /> Upload Your Assets
              </h3>

              {/* Skin upload */}
              <label className="group block cursor-pointer">
                <div
                  className={`relative flex h-40 items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                    skinImg ? 'border-gold/30' : 'border-white/10 hover:border-gold/40'
                  }`}
                >
                  {skinImg ? (
                    <>
                      <img src={skinImg} alt="Skin" className="h-full w-full rounded-xl object-cover" />
                      <button
                        onClick={(e) => { e.preventDefault(); setSkinImg(null); }}
                        className="absolute top-2 right-2 rounded-full bg-ink-black/80 p-1.5 text-white hover:bg-danger"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="mx-auto text-gold/50" />
                      <p className="mt-2 text-sm text-ink-100">Upload photo of your skin</p>
                      <p className="text-xs text-ink-300">JPG or PNG</p>
                    </div>
                  )}
                </div>
                <input
                  ref={skinRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0], setSkinImg)}
                />
              </label>

              {/* Design upload */}
              <label className="group mt-4 block cursor-pointer">
                <div
                  className={`relative flex h-40 items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                    designImg ? 'border-gold/30' : 'border-white/10 hover:border-gold/40'
                  }`}
                >
                  {designImg ? (
                    <>
                      <img src={designImg} alt="Design" className="h-full w-full rounded-xl object-contain" />
                      <button
                        onClick={(e) => { e.preventDefault(); setDesignImg(null); }}
                        className="absolute top-2 right-2 rounded-full bg-ink-black/80 p-1.5 text-white hover:bg-danger"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={24} className="mx-auto text-gold/50" />
                      <p className="mt-2 text-sm text-ink-100">Upload tattoo design</p>
                      <p className="text-xs text-ink-300">Transparent PNG works best</p>
                    </div>
                  )}
                </div>
                <input
                  ref={designRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0], setDesignImg)}
                />
              </label>

              {/* Controls */}
              {designImg && (
                <div className="mt-6 space-y-4 border-t border-white/5 pt-5">
                  <div>
                    <label className="mb-1.5 flex items-center justify-between text-xs uppercase tracking-wider text-ink-200">
                      <span>Opacity</span>
                      <span className="text-gold">{opacity}%</span>
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full accent-gold"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center justify-between text-xs uppercase tracking-wider text-ink-200">
                      <span>Scale</span>
                      <span className="text-gold">{scale}%</span>
                    </label>
                    <input
                      type="range"
                      min={30}
                      max={200}
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full accent-gold"
                    />
                  </div>
                  <p className="text-xs text-ink-300">
                    Tip: Drag the design on the preview to reposition it.
                  </p>
                  <button onClick={reset} className="btn-ghost w-full border border-white/10 hover:border-gold/30">
                    <RotateCcw size={14} /> Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Preview canvas */}
            <div className="panel flex flex-col p-6">
              <h3 className="mb-4 font-serif text-lg font-semibold text-white">Live Preview</h3>
              <div
                className="relative flex-1 items-center justify-center overflow-hidden rounded-xl bg-ink-900"
                onMouseMove={handleDrag}
                onMouseUp={() => setDragging(false)}
                onMouseLeave={() => setDragging(false)}
              >
                {skinImg ? (
                  <div className="relative h-full min-h-[400px] w-full">
                    <img src={skinImg} alt="Skin preview" className="h-full w-full object-cover" />
                    {designImg && (
                      <img
                        src={designImg}
                        alt="Tattoo overlay"
                        draggable={false}
                        onMouseDown={() => setDragging(true)}
                        className="absolute select-none"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          width: `${scale}%`,
                          opacity: opacity / 100,
                          transform: 'translate(-50%, -50%)',
                          mixBlendMode: 'multiply',
                          filter: 'contrast(110%)',
                          cursor: dragging ? 'grabbing' : 'grab',
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                    <Sparkles size={32} className="text-gold/20" />
                    <p className="mt-3 text-sm text-ink-200">
                      Upload a skin photo to begin
                    </p>
                  </div>
                )}

                {skinImg && !designImg && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink-black/80 px-4 py-2 text-xs text-ink-100 backdrop-blur-sm">
                    Now upload a design to see the blend
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-300">
                <span className="h-2 w-2 rounded-full bg-success" />
                Blending with mix-blend-mode: multiply + contrast(110%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
