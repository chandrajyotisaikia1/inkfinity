import { useState } from 'react';
import { useBooking } from '@/store/BookingContext';
import type { Booking } from '@/types';
import { Search, CheckCircle2, Clock, XCircle, Loader, Filter } from 'lucide-react';

const statusConfig: Record<Booking['status'], { color: string; bg: string; icon: React.ReactNode }> = {
  Confirmed: { color: 'text-success', bg: 'bg-success/10 border-success/30', icon: <CheckCircle2 size={14} /> },
  'In Progress': { color: 'text-warning', bg: 'bg-warning/10 border-warning/30', icon: <Loader size={14} /> },
  Completed: { color: 'text-ink-100', bg: 'bg-white/5 border-white/20', icon: <CheckCircle2 size={14} /> },
  Cancelled: { color: 'text-danger', bg: 'bg-danger/10 border-danger/30', icon: <XCircle size={14} /> },
};

export default function BookingsTab() {
  const { bookings } = useBooking();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Booking['status'] | 'All'>('All');

  const filtered = bookings.filter((b) => {
    const matchesSearch = b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.artistName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings
    .filter((b) => b.depositPaid)
    .reduce((sum, b) => sum + b.estimatedCost, 0);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={bookings.length.toString()} sub="All time" />
        <StatCard label="Deposit Paid" value={bookings.filter((b) => b.depositPaid).length.toString()} sub="₹2,000 each" accent="success" />
        <StatCard label="Pending Deposits" value={bookings.filter((b) => !b.depositPaid && b.status !== 'Cancelled').length.toString()} sub="Awaiting payment" accent="warning" />
        <StatCard label="Pipeline Value" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} sub="Estimated revenue" accent="gold" />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            placeholder="Search client, ID, or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-ink-300" />
          {(['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-gold text-ink-black'
                  : 'border border-white/10 text-ink-200 hover:border-gold/30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-ink-900 text-xs uppercase tracking-wider text-ink-300">
                <th className="px-4 py-3 font-medium">Booking ID</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Artist</th>
                <th className="px-4 py-3 font-medium">Date & Time</th>
                <th className="px-4 py-3 font-medium">Placement</th>
                <th className="px-4 py-3 font-medium">Style</th>
                <th className="px-4 py-3 font-medium">Est. Cost</th>
                <th className="px-4 py-3 font-medium">Deposit</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((b) => {
                const st = statusConfig[b.status];
                return (
                  <tr key={b.id} className="bg-ink-850 transition-colors hover:bg-ink-800">
                    <td className="px-4 py-3 font-mono text-xs text-gold">{b.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{b.clientName}</div>
                      <div className="text-xs text-ink-300">{b.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-ink-100">{b.artistName}</td>
                    <td className="px-4 py-3 text-ink-100">
                      <div>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      <div className="text-xs text-ink-300">{b.time}</div>
                    </td>
                    <td className="px-4 py-3 text-ink-100">{b.placement}</td>
                    <td className="px-4 py-3 text-ink-100">{b.style}</td>
                    <td className="px-4 py-3 font-medium text-white">₹{b.estimatedCost.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {b.depositPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${st.bg} ${st.color}`}>
                        {st.icon} {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-ink-300">No bookings match your search.</div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: 'success' | 'warning' | 'gold' }) {
  const accentColor = accent === 'success' ? 'text-success' : accent === 'warning' ? 'text-warning' : accent === 'gold' ? 'text-gold' : 'text-white';
  return (
    <div className="panel p-5">
      <p className="text-xs uppercase tracking-widest text-ink-300">{label}</p>
      <p className={`mt-2 font-serif text-3xl font-semibold ${accentColor}`}>{value}</p>
      <p className="mt-1 text-xs text-ink-300">{sub}</p>
    </div>
  );
}
