import React, { useState } from 'react';
import { BookingProvider } from './store/BookingContext';
import { TryOn } from './components/TryOn';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { LogOut } from 'lucide-react';

type ViewMode = 'storefront' | 'admin';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('storefront');
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <BookingProvider>
      <div className="min-h-screen bg-ink-black">
        {/* Navigation Bar */}
        <nav className="bg-ink-850 border-b-2 border-gold sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold text-gold tracking-widest">
              INKFINITY
            </h1>
            
            <div className="flex items-center gap-4">
              {viewMode === 'storefront' && (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="px-6 py-2 bg-gold text-ink-black font-semibold rounded hover:bg-gold-500 transition-all"
                >
                  Book Now
                </button>
              )}
              
              <button
                onClick={() => setViewMode(viewMode === 'storefront' ? 'admin' : 'storefront')}
                className="flex items-center gap-2 px-4 py-2 bg-ink-700 text-gold border border-gold rounded hover:bg-ink-600 transition-all"
              >
                {viewMode === 'storefront' ? '🔐 Admin' : <LogOut className="w-4 h-4" />}
                {viewMode === 'storefront' ? 'Admin' : 'Exit'}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {viewMode === 'storefront' ? (
          <>
            <TryOn />
            <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
          </>
        ) : (
          <AdminDashboard />
        )}
      </div>
    </BookingProvider>
  );
}

export default App;
