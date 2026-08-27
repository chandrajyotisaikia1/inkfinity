import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useBooking } from '../store/BookingContext';
import { Booking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { artists, addBooking } = useBooking();
  const [step, setStep] = useState<Step>(1);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    consultationDetails: '',
    design: '',
    designLocation: '',
    estimatedSizeInches: 4,
    estimatedTimeHours: 3,
    estimatedCostRupees: 10000,
    artistId: '',
    bookedDate: '',
    bookedTime: '14:00',
    depositPaid: 2000,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estimatedSizeInches' || name === 'estimatedTimeHours' || name === 'estimatedCostRupees' || name === 'depositPaid'
        ? parseFloat(value)
        : value,
    }));
  };

  const handleNext = () => {
    if (step === 1 && formData.clientName && formData.clientEmail && formData.consultationDetails) {
      setStep(2);
    } else if (step === 2 && formData.artistId && formData.bookedDate && formData.bookedTime) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    const newBooking: Omit<Booking, 'id' | 'createdAt'> = {
      ...formData,
      depositPaid: 2000,
      totalPaid: 2000,
      status: 'pending',
      itemsUsed: [],
    };
    addBooking(newBooking);
    onClose();
    setStep(1);
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      consultationDetails: '',
      design: '',
      designLocation: '',
      estimatedSizeInches: 4,
      estimatedTimeHours: 3,
      estimatedCostRupees: 10000,
      artistId: '',
      bookedDate: '',
      bookedTime: '14:00',
      depositPaid: 2000,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-ink-850 border-2 border-gold rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-ink-850 border-b border-gold px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gold tracking-widest">
            BOOK YOUR TATTOO
          </h2>
          <button
            onClick={onClose}
            className="text-gold hover:text-gold-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-ink-900">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-gold text-ink-black'
                      : 'bg-ink-700 text-ink-200'
                  }`}
                >
                  {step > s ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    s
                  )}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-gold' : 'bg-ink-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-ink-200">
            <span>Consultation</span>
            <span>Date & Artist</span>
            <span>Payment</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
          {/* Step 1: Consultation Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold mb-4">Step 1: Tell Us About Your Vision</h3>

              <div>
                <label className="block text-ink-200 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 placeholder-ink-400 focus:border-gold focus:outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-200 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 placeholder-ink-400 focus:border-gold focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-ink-200 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 placeholder-ink-400 focus:border-gold focus:outline-none"
                    placeholder="+91-9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-200 text-sm font-medium mb-2">
                  Design Concept *
                </label>
                <input
                  type="text"
                  name="design"
                  value={formData.design}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 placeholder-ink-400 focus:border-gold focus:outline-none"
                  placeholder="e.g., Dragon, Phoenix, Portrait"
                />
              </div>

              <div>
                <label className="block text-ink-200 text-sm font-medium mb-2">
                  Design Location
                </label>
                <input
                  type="text"
                  name="designLocation"
                  value={formData.designLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 placeholder-ink-400 focus:border-gold focus:outline-none"
                  placeholder="e.g., Right Shoulder, Left Forearm"
                />
              </div>

              <div>
                <label className="block text-ink-200 text-sm font-medium mb-2">
                  Consultation Details *
                </label>
                <textarea
                  name="consultationDetails"
                  value={formData.consultationDetails}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 placeholder-ink-400 focus:border-gold focus:outline-none"
                  placeholder="Describe your vision, style preferences, and any specific requirements"
                />
              </div>
            </div>
          )}

          {/* Step 2: Date & Artist Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold mb-4">Step 2: Choose Artist & Schedule</h3>

              <div>
                <label className="block text-ink-200 text-sm font-medium mb-2">
                  Select Artist *
                </label>
                <select
                  name="artistId"
                  value={formData.artistId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 focus:border-gold focus:outline-none"
                >
                  <option value="">Choose an artist...</option>
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name} - {artist.specialization} ({artist.yearsExperience} yrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-200 text-sm font-medium mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="bookedDate"
                    value={formData.bookedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-200 text-sm font-medium mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="bookedTime"
                    value={formData.bookedTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink-200 text-sm font-medium mb-2">
                    Est. Size (inches)
                  </label>
                  <input
                    type="number"
                    name="estimatedSizeInches"
                    value={formData.estimatedSizeInches}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-200 text-sm font-medium mb-2">
                    Est. Time (hours)
                  </label>
                  <input
                    type="number"
                    name="estimatedTimeHours"
                    value={formData.estimatedTimeHours}
                    onChange={handleInputChange}
                    min="1"
                    max="12"
                    className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-200 text-sm font-medium mb-2">
                  Est. Cost (₹)
                </label>
                <input
                  type="number"
                  name="estimatedCostRupees"
                  value={formData.estimatedCostRupees}
                  onChange={handleInputChange}
                  min="5000"
                  className="w-full px-4 py-2 bg-ink-700 border border-ink-600 rounded text-ink-100 focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gold mb-4">Step 3: Secure Booking with UPI</h3>

              <div className="bg-ink-700 border border-gold rounded-lg p-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-ink-200">Client Name:</span>
                    <span className="text-gold font-semibold">{formData.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-200">Design:</span>
                    <span className="text-gold font-semibold">{formData.design}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-200">Booking Date:</span>
                    <span className="text-gold font-semibold">{formData.bookedDate} @ {formData.bookedTime}</span>
                  </div>
                  <div className="border-t border-ink-600 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-ink-100">Est. Cost:</span>
                      <span className="text-gold font-semibold">₹{formData.estimatedCostRupees}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-warning-soft border border-warning rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="text-warning text-2xl">⚠️</div>
                  <div>
                    <h4 className="text-warning font-semibold mb-2">Security Deposit</h4>
                    <p className="text-ink-200 text-sm">
                      A mandatory security deposit of <span className="text-gold font-bold">₹2,000</span> is required to lock in your booking date. This will be deducted from the final payment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-ink-700 border border-gold rounded-lg p-6">
                <h4 className="text-gold font-semibold mb-4">UPI Payment Details</h4>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-ink-200 text-sm mb-2">Send ₹2,000 to:</p>
                    <p className="text-gold text-lg font-mono font-bold">inkfinity@upi</p>
                  </div>
                  <div className="text-center text-ink-200 text-sm">
                    <p>Once payment is confirmed, you'll receive a booking confirmation email.</p>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-gold"
                  defaultChecked
                />
                <span className="text-ink-200 text-sm">
                  I agree to the terms and confirm payment of ₹2,000 security deposit
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-ink-900 border-t border-gold px-6 py-4 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 bg-ink-700 text-gold border border-gold rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-600 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-gold text-ink-black font-semibold rounded hover:bg-gold-500 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-success text-ink-black font-semibold rounded hover:bg-success-dark transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
