import { useState, useEffect } from 'react';
import { useBooking } from '@/store/BookingContext';
import { artists, timeSlots, sizeOptions, styleOptions } from '@/data';
import type { Placement, TattooSize, Style, Booking } from '@/types';
import {
  X, Check, ChevronRight, ChevronLeft, Calendar, User, CreditCard,
  CheckCircle2, AlertCircle, Shield,
} from 'lucide-react';

const placements: Placement[] = ['Forearm', 'Upper Arm', 'Back', 'Chest', 'Calf', 'Thigh', 'Ribs', 'Neck', 'Hand', 'Full Sleeve'];

const steps = ['Design', 'Schedule', 'Details', 'Deposit'] as const;

export default function BookingModal() {
  const { isBookingOpen, closeBooking, addBooking } = useBooking();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Form state
  const [placement, setPlacement] = useState<Placement | ''>('');
  const [size, setSize] = useState<TattooSize | ''>('');
  const [style, setStyle] = useState<Style | ''>('');
  const [artistId, setArtistId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [depositProcessing, setDepositProcessing] = useState(false);

  useEffect(() => {
    if (isBookingOpen) {
      setStep(0);
      setCompleted(false);
    }
  }, [isBookingOpen]);

  useEffect(() => {
    document.body.style.overflow = isBookingOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isBookingOpen]);

  if (!isBookingOpen) return null;

  const selectedArtist = artists.find((a) => a.id === artistId);

  const estimateCost = (): number => {
    const sizeMap: Record<TattooSize, number> = {
      'Small (< 3")': 5000,
      'Medium (3"-6")': 12000,
      'Large (6"-12")': 25000,
      'Full Piece (12"+)': 50000,
    };
    return size ? sizeMap[size] : 0;
  };

  const canProceed = (): boolean => {
    if (step === 0) return Boolean(placement && size && style);
    if (step === 1) return Boolean(artistId && date && time);
    if (step === 2) return Boolean(name && email && phone);
    return true;
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handlePayDeposit = () => {
    setDepositProcessing(true);
    setTimeout(() => {
      setDepositProcessing(false);
      const newBooking: Booking = {
        id: `BK-${2400 + Math.floor(Math.random() * 600)}`,
        clientName: name,
        email,
        phone,
        artistId,
        artistName: selectedArtist?.name ?? '',
        date,
        time,
        placement: placement as Placement,
        size: size as TattooSize,
        style: style as Style,
        description,
        depositPaid: true,
        depositAmount: 2000,
        estimatedCost: estimateCost(),
        status: 'Confirmed',
        createdAt: new Date().toISOString().split('T')[0],
      };
      addBooking(newBooking);
      setCompleted(true);
    }, 2000);
  };

  const handleClose = () => {
    closeBooking();
    // Reset after close animation
    setTimeout(() => {
      setStep(0);
      setCompleted(false);
      setPlacement('');
      setSize('');
      setStyle('');
      setArtistId('');
      setDate('');
      setTime('');
      setName('');
      setEmail('');
      setPhone('');
      setDescription('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl border border-white/10 bg-ink-850 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-ink-850/95 px-6 py-4 backdrop-blur-xl">
          <div>
            <h2 className="font-serif text-xl font-semibold text-white">
              {completed ? 'Booking Confirmed' : 'Book a Consultation'}
            </h2>
            {!completed && (
              <p className="text-xs text-ink-300">Step {step + 1} of {steps.length} — {steps[step]}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        {!completed && (
          <div className="px-6 pt-4">
            <div className="flex gap-2">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i <= step ? 'bg-gold' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {completed ? (
            <ConfirmationScreen
              name={name}
              artistName={selectedArtist?.name ?? ''}
              date={date}
              time={time}
              placement={placement}
              style={style}
              cost={estimateCost()}
              onClose={handleClose}
            />
          ) : (
            <>
              {/* Step 0: Design */}
              {step === 0 && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
                      Placement
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {placements.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlacement(p)}
                          className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                            placement === p
                              ? 'bg-gold text-ink-black font-medium'
                              : 'border border-white/10 text-ink-100 hover:border-gold/40'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
                      Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {sizeOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                            size === s
                              ? 'bg-gold/15 border border-gold/50 text-gold'
                              : 'border border-white/10 text-ink-100 hover:border-gold/30'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
                      Style
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {styleOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setStyle(s)}
                          className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                            style === s
                              ? 'bg-gold text-ink-black font-medium'
                              : 'border border-white/10 text-ink-100 hover:border-gold/40'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Schedule */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-gold">
                      Choose Your Artist
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {artists.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setArtistId(a.id)}
                          className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                            artistId === a.id
                              ? 'border-gold/50 bg-gold/10'
                              : 'border-white/10 hover:border-gold/30'
                          }`}
                        >
                          <div className="aspect-square overflow-hidden">
                            <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="p-2 text-center">
                            <p className="text-xs font-medium text-white">{a.name}</p>
                            <p className="text-[10px] text-ink-300">{a.specialty}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                        Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-dark"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                        Time
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`rounded-lg px-3 py-2 text-sm transition-all ${
                              time === t
                                ? 'bg-gold text-ink-black font-medium'
                                : 'border border-white/10 text-ink-100 hover:border-gold/30'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-up">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="input-dark"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 ..."
                        className="input-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                      Design Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your vision — subject, references, mood..."
                      rows={3}
                      className="input-dark resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Deposit */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-up">
                  {/* Summary */}
                  <div className="rounded-2xl border border-white/10 bg-ink-900 p-5">
                    <h3 className="mb-4 font-serif text-lg font-semibold text-white">Booking Summary</h3>
                    <div className="space-y-2.5 text-sm">
                      <SummaryRow icon={<User size={14} />} label="Client" value={name} />
                      <SummaryRow icon={<Calendar size={14} />} label="Date & Time" value={`${date} at ${time}`} />
                      <SummaryRow icon={<User size={14} />} label="Artist" value={selectedArtist?.name ?? ''} />
                      <SummaryRow icon={<Shield size={14} />} label="Placement" value={placement} />
                      <SummaryRow icon={<Shield size={14} />} label="Size" value={size} />
                      <SummaryRow icon={<Shield size={14} />} label="Style" value={style} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-sm text-ink-200">Estimated Session Cost</span>
                      <span className="font-serif text-xl font-semibold text-white">₹{estimateCost().toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Deposit notice */}
                  <div className="flex gap-3 rounded-xl border border-gold/20 bg-gold/5 p-4">
                    <AlertCircle size={20} className="flex-shrink-0 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-gold">₹2,000 Non-Refundable Security Deposit</p>
                      <p className="mt-1 text-xs text-ink-100">
                        This deposit locks your slot and covers artist preparation. It is adjusted
                        against your final session cost. Simulated UPI payment — no real charge.
                      </p>
                    </div>
                  </div>

                  {/* Mock UPI */}
                  <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
                    <div className="flex items-center gap-2 text-sm text-ink-100">
                      <CreditCard size={16} className="text-gold" />
                      <span>UPI ID: <span className="text-white">inkfinity@upi</span></span>
                    </div>
                    <button
                      onClick={handlePayDeposit}
                      disabled={depositProcessing}
                      className="btn-gold mt-4 w-full text-base"
                    >
                      {depositProcessing ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-black/30 border-t-ink-black" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Shield size={18} /> Pay ₹2,000 Deposit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {step < 3 && (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      step === 0 ? 'text-ink-300/50' : 'text-ink-100 hover:text-gold'
                    }`}
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center gap-1 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                      canProceed()
                        ? 'bg-gold text-ink-black hover:bg-gold-300'
                        : 'bg-white/5 text-ink-300 cursor-not-allowed'
                    }`}
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-200">
        <span className="text-gold/60">{icon}</span>
        {label}
      </span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function ConfirmationScreen({
  name, artistName, date, time, placement, style, cost, onClose,
}: {
  name: string; artistName: string; date: string; time: string;
  placement: string; style: string; cost: number; onClose: () => void;
}) {
  return (
    <div className="py-8 text-center animate-fade-up">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-pulse-gold">
        <CheckCircle2 size={40} className="text-success" />
      </div>
      <h3 className="mt-6 font-serif text-2xl font-semibold text-white">
        You're booked, {name.split(' ')[0]}!
      </h3>
      <p className="mt-2 text-ink-100">
        Deposit received. Your slot with {artistName} is locked.
      </p>

      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 bg-ink-900 p-5 text-left">
        <div className="space-y-2.5 text-sm">
          <SummaryRow icon={<Calendar size={14} />} label="When" value={`${date} at ${time}`} />
          <SummaryRow icon={<User size={14} />} label="Artist" value={artistName} />
          <SummaryRow icon={<Shield size={14} />} label="Placement" value={placement} />
          <SummaryRow icon={<Shield size={14} />} label="Style" value={style} />
          <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
            <span className="flex items-center gap-2 text-ink-200">
              <Check size={14} className="text-success" /> Deposit Paid
            </span>
            <span className="font-medium text-success">₹2,000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-200">Est. Session</span>
            <span className="font-medium text-white">₹{cost.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-300">
        A confirmation has been sent to your email. See you soon.
      </p>
      <button onClick={onClose} className="btn-outline-gold mt-6">
        Close
      </button>
    </div>
  );
}
