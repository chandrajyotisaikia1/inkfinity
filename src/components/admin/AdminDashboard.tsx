import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Package,
  FileText,
  Mail,
  Plus,
  Check,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { useBooking } from '../store/BookingContext';

type AdminTab = 'bookings' | 'financials' | 'inventory' | 'legal' | 'marketing';

export const AdminDashboard: React.FC = () => {
  const {
    bookings,
    artists,
    inventory,
    waivers,
    marketingContacts,
    financials,
    approveBooking,
    completeBooking,
    checkInClient,
    recalculateFinancials,
  } = useBooking();

  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [checkInItems, setCheckInItems] = useState<
    Array<{ itemId: string; quantity: number }>
  >([]);

  const lowStockItems = inventory.filter((item) => item.quantity < item.reorderLevel);

  const handleCheckIn = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCheckInItems([]);
    setShowCheckInModal(true);
  };

  const handleConfirmCheckIn = () => {
    if (!selectedBookingId) return;

    const itemsUsed = checkInItems.map((item) => {
      const invItem = inventory.find((i) => i.id === item.itemId);
      if (!invItem) return null;

      return {
        itemId: item.itemId,
        itemName: invItem.name,
        quantityUsed: item.quantity,
        unit: invItem.unit,
        costDeducted: item.quantity * invItem.costPerUnit,
      };
    }).filter(Boolean) as any[];

    checkInClient(selectedBookingId, itemsUsed);
    setShowCheckInModal(false);
    recalculateFinancials();
  };

  return (
    <div className="min-h-screen bg-ink-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gold mb-2 tracking-widest">
            ADMIN DASHBOARD
          </h1>
          <p className="text-ink-200">Manage bookings, artists, inventory, and finances</p>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="mb-6 bg-danger-soft border-l-4 border-danger p-4 rounded">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-danger" />
              <div>
                <h3 className="text-danger font-semibold">Low Stock Alert</h3>
                <p className="text-ink-200 text-sm">
                  {lowStockItems.map((item) => item.name).join(', ')} need restocking
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-ink-850 border border-gold rounded-lg mb-6 overflow-hidden">
          <div className="flex flex-wrap">
            {[
              { id: 'bookings' as const, label: 'Bookings & Check-In', icon: Users },
              { id: 'financials' as const, label: 'Financials & Splits', icon: DollarSign },
              { id: 'inventory' as const, label: 'Inventory Burn', icon: Package },
              { id: 'legal' as const, label: 'Legal Vault', icon: FileText },
              { id: 'marketing' as const, label: 'Marketing Automations', icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 border-r border-gold last:border-r-0 transition-all ${
                  activeTab === id
                    ? 'bg-gold text-ink-black font-semibold'
                    : 'bg-ink-850 text-gold hover:bg-ink-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-ink-850 border border-gold rounded-lg p-6">
          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-gold mb-6">Bookings & Check-In</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold">
                      <th className="text-left py-3 px-4 text-gold">Client</th>
                      <th className="text-left py-3 px-4 text-gold">Design</th>
                      <th className="text-left py-3 px-4 text-gold">Date</th>
                      <th className="text-left py-3 px-4 text-gold">Artist</th>
                      <th className="text-left py-3 px-4 text-gold">Status</th>
                      <th className="text-left py-3 px-4 text-gold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-ink-700 hover:bg-ink-700">
                        <td className="py-3 px-4 text-ink-100">{booking.clientName}</td>
                        <td className="py-3 px-4 text-ink-200">{booking.design}</td>
                        <td className="py-3 px-4 text-ink-200">{booking.bookedDate}</td>
                        <td className="py-3 px-4 text-ink-200">
                          {artists.find((a) => a.id === booking.artistId)?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              booking.status === 'completed'
                                ? 'bg-success-soft text-success'
                                : booking.status === 'approved'
                                ? 'bg-blue-900 text-blue-300'
                                : booking.status === 'checked_in'
                                ? 'bg-gold-900 text-gold-200'
                                : 'bg-ink-600 text-ink-200'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => approveBooking(booking.id)}
                              className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs hover:bg-blue-800"
                            >
                              Approve
                            </button>
                          )}
                          {booking.status === 'approved' && (
                            <button
                              onClick={() => handleCheckIn(booking.id)}
                              className="px-2 py-1 bg-gold-700 text-gold-100 rounded text-xs hover:bg-gold-600"
                            >
                              Check-In
                            </button>
                          )}
                          {booking.status === 'checked_in' && (
                            <button
                              onClick={() => completeBooking(booking.id, booking.estimatedCostRupees)}
                              className="px-2 py-1 bg-success-soft text-success rounded text-xs hover:bg-success-dark"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FINANCIALS TAB */}
          {activeTab === 'financials' && (
            <div>
              <h2 className="text-2xl font-bold text-gold mb-6">Financials & Artist Splits</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: 'Total Revenue',
                    value: `₹${financials.totalRevenue.toLocaleString()}`,
                    color: 'text-success',
                  },
                  {
                    label: 'Total Expenses',
                    value: `₹${financials.totalExpenses.toLocaleString()}`,
                    color: 'text-danger',
                  },
                  {
                    label: 'Artist Payouts',
                    value: `₹${financials.totalArtistPayouts.toLocaleString()}`,
                    color: 'text-warning',
                  },
                  {
                    label: 'Net Profit',
                    value: `₹${financials.netProfit.toLocaleString()}`,
                    color: financials.netProfit >= 0 ? 'text-success' : 'text-danger',
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-ink-700 border border-gold rounded p-4"
                  >
                    <p className="text-ink-200 text-sm mb-2">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Artist Roster */}
              <h3 className="text-xl font-semibold text-gold mb-4">Artist Roster & Revenue</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold">
                      <th className="text-left py-3 px-4 text-gold">Artist</th>
                      <th className="text-left py-3 px-4 text-gold">Specialization</th>
                      <th className="text-left py-3 px-4 text-gold">Commission %</th>
                      <th className="text-left py-3 px-4 text-gold">Total Revenue</th>
                      <th className="text-left py-3 px-4 text-gold">Bookings</th>
                      <th className="text-left py-3 px-4 text-gold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artists.map((artist) => (
                      <tr key={artist.id} className="border-b border-ink-700 hover:bg-ink-700">
                        <td className="py-3 px-4 text-ink-100 font-semibold">{artist.name}</td>
                        <td className="py-3 px-4 text-ink-200">{artist.specialization}</td>
                        <td className="py-3 px-4 text-gold">{artist.commissionPercentage}%</td>
                        <td className="py-3 px-4 text-success font-semibold">
                          ₹{artist.totalRevenueEarned.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-ink-200">{artist.totalBookingsCompleted}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              artist.status === 'active'
                                ? 'bg-success-soft text-success'
                                : 'bg-ink-600 text-ink-200'
                            }`}
                          >
                            {artist.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div>
              <h2 className="text-2xl font-bold text-gold mb-6">Inventory Burn Rate</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold">
                      <th className="text-left py-3 px-4 text-gold">Item</th>
                      <th className="text-left py-3 px-4 text-gold">Category</th>
                      <th className="text-left py-3 px-4 text-gold">Quantity</th>
                      <th className="text-left py-3 px-4 text-gold">Reorder Level</th>
                      <th className="text-left py-3 px-4 text-gold">Cost/Unit</th>
                      <th className="text-left py-3 px-4 text-gold">Total Value</th>
                      <th className="text-left py-3 px-4 text-gold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b border-ink-700 hover:bg-ink-700">
                        <td className="py-3 px-4 text-ink-100 font-semibold">{item.name}</td>
                        <td className="py-3 px-4 text-ink-200 text-xs">
                          <span className="bg-ink-700 px-2 py-1 rounded">{item.category}</span>
                        </td>
                        <td className="py-3 px-4 text-ink-200">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-ink-200">{item.reorderLevel}</td>
                        <td className="py-3 px-4 text-gold">₹{item.costPerUnit}</td>
                        <td className="py-3 px-4 text-ink-100 font-semibold">
                          ₹{(item.quantity * item.costPerUnit).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.quantity < item.reorderLevel
                                ? 'bg-danger-soft text-danger'
                                : 'bg-success-soft text-success'
                            }`}
                          >
                            {item.quantity < item.reorderLevel ? 'LOW' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LEGAL TAB */}
          {activeTab === 'legal' && (
            <div>
              <h2 className="text-2xl font-bold text-gold mb-6">Legal Vault - Waivers</h2>
              <div className="space-y-4">
                {waivers.length === 0 ? (
                  <p className="text-ink-200">No waivers submitted yet.</p>
                ) : (
                  waivers.map((waiver) => (
                    <div key={waiver.id} className="bg-ink-700 border border-gold rounded p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-gold font-semibold">{waiver.clientName}</h4>
                          <p className="text-ink-200 text-sm">{waiver.clientEmail}</p>
                        </div>
                        <span className="px-2 py-1 bg-success-soft text-success rounded text-xs font-semibold">
                          {waiver.waiverType}
                        </span>
                      </div>
                      <p className="text-ink-200 text-sm mb-2">{waiver.waiverText}</p>
                      <p className="text-ink-300 text-xs">
                        Submitted: {new Date(waiver.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* MARKETING TAB */}
          {activeTab === 'marketing' && (
            <div>
              <h2 className="text-2xl font-bold text-gold mb-6">Marketing Automations</h2>
              <div className="space-y-4">
                {marketingContacts.length === 0 ? (
                  <p className="text-ink-200">No marketing contacts yet.</p>
                ) : (
                  marketingContacts.map((contact) => (
                    <div key={contact.id} className="bg-ink-700 border border-gold rounded p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-gold font-semibold">{contact.clientName}</h4>
                          <p className="text-ink-200 text-sm">{contact.clientEmail}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          contact.touchUpType === '14-day'
                            ? 'bg-danger-soft text-danger'
                            : 'bg-warning text-ink-black'
                        }`}>
                          {contact.touchUpType}
                        </span>
                      </div>
                      <p className="text-ink-200 text-sm mb-2">Next Touch-Up: {new Date(contact.nextTouchUpDate).toLocaleDateString()}</p>
                      <p className="text-ink-300 text-xs mb-2">{contact.notes}</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        contact.status === 'converted'
                          ? 'bg-success-soft text-success'
                          : contact.status === 'contacted'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-ink-600 text-ink-200'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && selectedBookingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-ink-850 border-2 border-gold rounded-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gold flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gold">Client Check-In</h3>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-gold hover:text-gold-500"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
              <p className="text-ink-200">Select items used during the session:</p>
              {inventory.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-ink-700 p-3 rounded">
                  <label className="flex-1">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCheckInItems((prev) => [
                            ...prev,
                            { itemId: item.id, quantity: 1 },
                          ]);
                        } else {
                          setCheckInItems((prev) =>
                            prev.filter((i) => i.itemId !== item.id)
                          );
                        }
                      }}
                      className="mr-2 accent-gold"
                    />
                    <span className="text-ink-100">{item.name}</span>
                  </label>
                  {checkInItems.find((i) => i.itemId === item.id) && (
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={
                        checkInItems.find((i) => i.itemId === item.id)?.quantity || 1
                      }
                      onChange={(e) => {
                        setCheckInItems((prev) =>
                          prev.map((i) =>
                            i.itemId === item.id
                              ? { ...i, quantity: parseInt(e.target.value) }
                              : i
                          )
                        );
                      }}
                      className="w-16 px-2 py-1 bg-ink-600 border border-gold rounded text-ink-100 text-center"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gold flex justify-end gap-3">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="px-4 py-2 bg-ink-700 text-gold rounded hover:bg-ink-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckIn}
                className="px-4 py-2 bg-gold text-ink-black rounded font-semibold hover:bg-gold-500"
              >
                Confirm Check-In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
