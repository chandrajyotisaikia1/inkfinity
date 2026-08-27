import React, { useRef, useState } from 'react';
import { Upload, Maximize2, Eye, EyeOff } from 'lucide-react';

interface TryOnState {
  skinImageUrl: string | null;
  tattooImageUrl: string | null;
  offsetX: number;
  offsetY: number;
  scale: number;
  showOverlay: boolean;
}

export const TryOn: React.FC = () => {
  const skinInputRef = useRef<HTMLInputElement>(null);
  const tattooInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<TryOnState>({
    skinImageUrl: null,
    tattooImageUrl: null,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    showOverlay: true,
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'skin' | 'tattoo'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setState((prev) => ({
        ...prev,
        [type === 'skin' ? 'skinImageUrl' : 'tattooImageUrl']: imageUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOffsetChange = (axis: 'X' | 'Y', value: number) => {
    setState((prev) => ({
      ...prev,
      [axis === 'X' ? 'offsetX' : 'offsetY']: value,
    }));
  };

  const handleScaleChange = (value: number) => {
    setState((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, value)),
    }));
  };

  const resetSettings = () => {
    setState((prev) => ({
      ...prev,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    }));
  };

  const downloadComposite = () => {
    const canvas = document.getElementById(
      'try-on-canvas'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'tattoo-preview.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-ink-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-gold mb-3 tracking-widest">
            TRY-ON VISUALIZER
          </h1>
          <p className="text-ink-200 text-lg">
            Upload your skin and tattoo design to see how it looks
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Skin Upload */}
          <div className="flex flex-col">
            <label className="block text-gold font-semibold mb-4 uppercase text-sm tracking-wider">
              Step 1: Your Skin
            </label>
            <button
              onClick={() => skinInputRef.current?.click()}
              className="relative group overflow-hidden rounded-lg border-2 border-gold bg-ink-850 hover:bg-ink-800 transition-all h-48 flex items-center justify-center"
            >
              {state.skinImageUrl ? (
                <img
                  src={state.skinImageUrl}
                  alt="Skin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-gold" />
                  <span className="text-gold text-sm">Click to upload skin tone</span>
                </div>
              )}
            </button>
            <input
              ref={skinInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleImageUpload(e, 'skin')}
            />
          </div>

          {/* Tattoo Upload */}
          <div className="flex flex-col">
            <label className="block text-gold font-semibold mb-4 uppercase text-sm tracking-wider">
              Step 2: Your Tattoo Design
            </label>
            <button
              onClick={() => tattooInputRef.current?.click()}
              className="relative group overflow-hidden rounded-lg border-2 border-gold bg-ink-850 hover:bg-ink-800 transition-all h-48 flex items-center justify-center"
            >
              {state.tattooImageUrl ? (
                <img
                  src={state.tattooImageUrl}
                  alt="Tattoo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-gold" />
                  <span className="text-gold text-sm">Click to upload design</span>
                </div>
              )}
            </button>
            <input
              ref={tattooInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleImageUpload(e, 'tattoo')}
            />
          </div>
        </div>

        {/* Preview Section */}
        {state.skinImageUrl && state.tattooImageUrl && (
          <div className="mb-12">
            <label className="block text-gold font-semibold mb-4 uppercase text-sm tracking-wider">
              Step 3: Live Preview
            </label>

            <div className="bg-ink-850 border-2 border-gold rounded-lg p-8 mb-8">
              {/* Canvas Container */}
              <div className="relative bg-ink-black rounded overflow-hidden max-w-2xl mx-auto aspect-video flex items-center justify-center">
                {/* Base Skin Image */}
                <img
                  src={state.skinImageUrl}
                  alt="Skin base"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Tattoo Overlay with Blend Mode & Filters */}
                {state.showOverlay && (
                  <img
                    src={state.tattooImageUrl}
                    alt="Tattoo overlay"
                    className="absolute object-cover"
                    style={{
                      width: `${100 * state.scale}%`,
                      height: `auto`,
                      left: `${50 - (50 * state.scale) + state.offsetX}%`,
                      top: `${50 - (50 * state.scale) + state.offsetY}%`,
                      transform: 'translate(-50%, -50%)',
                      mixBlendMode: 'multiply',
                      filter: 'contrast(125%) saturate(125%)',
                    }}
                  />
                )}

                {/* Canvas for download */}
                <canvas
                  id="try-on-canvas"
                  className="hidden"
                  width={800}
                  height={600}
                />
              </div>

              {/* Toggle Overlay Visibility */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, showOverlay: !prev.showOverlay }))
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-ink-black font-semibold rounded hover:bg-gold-500 transition-all"
                >
                  {state.showOverlay ? (
                    <>
                      <Eye className="w-4 h-4" /> Hide Tattoo
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" /> Show Tattoo
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Controls Section */}
            <div className="bg-ink-850 border-2 border-gold rounded-lg p-8">
              <h3 className="text-gold font-semibold mb-6 uppercase text-sm tracking-wider">
                Adjust Placement
              </h3>

              {/* Scale Control */}
              <div className="mb-6">
                <label className="text-ink-200 text-sm font-medium mb-2 block">
                  Scale: {state.scale.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={state.scale}
                  onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>

              {/* X Offset Control */}
              <div className="mb-6">
                <label className="text-ink-200 text-sm font-medium mb-2 block">
                  Horizontal Position: {state.offsetX.toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={state.offsetX}
                  onChange={(e) =>
                    handleOffsetChange('X', parseFloat(e.target.value))
                  }
                  className="w-full accent-gold"
                />
              </div>

              {/* Y Offset Control */}
              <div className="mb-8">
                <label className="text-ink-200 text-sm font-medium mb-2 block">
                  Vertical Position: {state.offsetY.toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={state.offsetY}
                  onChange={(e) =>
                    handleOffsetChange('Y', parseFloat(e.target.value))
                  }
                  className="w-full accent-gold"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={resetSettings}
                  className="flex-1 px-6 py-3 bg-ink-700 text-gold border border-gold rounded font-semibold hover:bg-ink-600 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={downloadComposite}
                  className="flex-1 px-6 py-3 bg-gold text-ink-black rounded font-semibold hover:bg-gold-500 transition-all flex items-center justify-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" /> Download Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-ink-850 border-2 border-gold rounded-lg p-8">
          <h3 className="text-gold font-semibold mb-4 uppercase text-sm tracking-wider">
            How to Use
          </h3>
          <ul className="text-ink-200 space-y-2">
            <li>
              <span className="text-gold font-semibold">1.</span> Upload a clear
              photo of the skin area where you want the tattoo
            </li>
            <li>
              <span className="text-gold font-semibold">2.</span> Upload your
              tattoo design (preferably with a transparent background)
            </li>
            <li>
              <span className="text-gold font-semibold">3.</span> Adjust scale,
              horizontal, and vertical position to see the final look
            </li>
            <li>
              <span className="text-gold font-semibold">4.</span> Download the
              preview to share with your artist
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
