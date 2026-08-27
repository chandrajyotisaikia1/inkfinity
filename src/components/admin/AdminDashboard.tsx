import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Package } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '@/store/BookingContext';
import BookingsTab from './BookingsTab';
import FinancialsTab from './FinancialsTab';
import InventoryTab from './InventoryTab';

type Tab = 'bookings' | 'financials' | 'inventory';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
  { id: 'financials', label: 'Financials', icon: <DollarSign size={18} /> },
  { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const { bookings } = useBooking();

  const pendingDeposits = bookings.filter((b) => !b.depositPaid && b.status !== 'Cancelled').length;
  const lowStockCount = 4; // computed in InventoryTab

  return (
    <div className="min-h-screen bg-ink-black bg-grain">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-ink-200 transition-colors hover:text-gold"
            >
              <ArrowLeft size={16} /> Storefront
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold">
                <span className="font-serif text-sm font-bold">I</span>
              </span>
              <div>
                <h1 className="font-serif text-lg font-semibold text-white">Inkfinity CRM</h1>
                <p className="text-[10px] uppercase tracking-widest text-ink-300">Studio Manager</p>
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1.5 text-xs text-ink-200">
              <span className="h-2 w-2 rounded-full bg-success" /> System Online
            </span>
            <span className="text-xs text-ink-300">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex gap-1 border-b border-white/5 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-gold' : 'text-ink-200 hover:text-ink-100'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'bookings' && pendingDeposits > 0 && (
                <span className="ml-1 rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold text-white">
                  {pendingDeposits}
                </span>
              )}
              {tab.id === 'inventory' && (
                <span className="ml-1 rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold text-white">
                  {lowStockCount}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gold" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'financials' && <FinancialsTab />}
        {activeTab === 'inventory' && <InventoryTab />}
      </main>
    </div>
  );
}
