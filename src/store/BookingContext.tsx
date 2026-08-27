import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Booking,
  Artist,
  InventoryItem,
  Waiver,
  MarketingContact,
  StudioFinancials,
  InventoryDeduction,
} from '../types';

interface BookingContextType {
  // State
  bookings: Booking[];
  artists: Artist[];
  inventory: InventoryItem[];
  waivers: Waiver[];
  marketingContacts: MarketingContact[];
  financials: StudioFinancials;

  // Booking Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => string;
  approveBooking: (bookingId: string) => void;
  checkInClient: (
    bookingId: string,
    itemsUsed: InventoryDeduction[]
  ) => void;
  completeBooking: (bookingId: string, finalCost: number) => void;
  cancelBooking: (bookingId: string) => void;

  // Artist Actions
  enrollArtist: (artist: Omit<Artist, 'id'>) => string;
  updateArtist: (artistId: string, updates: Partial<Artist>) => void;

  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => string;
  updateInventoryQuantity: (itemId: string, newQuantity: number) => void;
  restockInventory: (itemId: string, quantityAdded: number) => void;

  // Waiver Actions
  submitWaiver: (waiver: Omit<Waiver, 'id' | 'submittedAt'>) => string;

  // Marketing Actions
  addMarketingContact: (contact: Omit<MarketingContact, 'id' | 'createdAt'>) => string;
  updateMarketingStatus: (
    contactId: string,
    status: 'pending' | 'contacted' | 'converted'
  ) => void;

  // Financials Actions
  recalculateFinancials: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Mock Data
const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist_001',
    name: 'Arjun Singh',
    email: 'arjun@inkfinity.com',
    phone: '+91-9876543210',
    specialization: 'Japanese',
    yearsExperience: 8,
    commissionPercentage: 65,
    totalRevenueEarned: 245000,
    totalBookingsCompleted: 42,
    status: 'active',
    joinedAt: '2021-03-15T10:00:00Z',
    upiHandle: 'arjun.singh@upi',
  },
  {
    id: 'artist_002',
    name: 'Priya Verma',
    email: 'priya@inkfinity.com',
    phone: '+91-9876543211',
    specialization: 'Realism',
    yearsExperience: 6,
    commissionPercentage: 60,
    totalRevenueEarned: 180000,
    totalBookingsCompleted: 35,
    status: 'active',
    joinedAt: '2022-01-20T10:00:00Z',
    upiHandle: 'priya.verma@upi',
  },
  {
    id: 'artist_003',
    name: 'Vikram Patel',
    email: 'vikram@inkfinity.com',
    phone: '+91-9876543212',
    specialization: 'Geometric',
    yearsExperience: 10,
    commissionPercentage: 70,
    totalRevenueEarned: 380000,
    totalBookingsCompleted: 58,
    status: 'active',
    joinedAt: '2019-06-10T10:00:00Z',
    upiHandle: 'vikram.patel@upi',
  },
];

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_001',
    name: '1RL Needles',
    category: 'needle',
    quantity: 450,
    unit: 'packs',
    reorderLevel: 100,
    costPerUnit: 80,
    lastRestockedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'inv_002',
    name: '3RL Needles',
    category: 'needle',
    quantity: 380,
    unit: 'packs',
    reorderLevel: 100,
    costPerUnit: 120,
    lastRestockedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'inv_003',
    name: '5RL Needles',
    category: 'needle',
    quantity: 320,
    unit: 'packs',
    reorderLevel: 80,
    costPerUnit: 150,
    lastRestockedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'inv_004',
    name: 'Black Ink (Pure)',
    category: 'ink',
    quantity: 125,
    unit: 'ml',
    reorderLevel: 30,
    costPerUnit: 250,
    lastRestockedAt: '2026-08-15T10:00:00Z',
    expiryDate: '2027-08-15T23:59:59Z',
  },
  {
    id: 'inv_005',
    name: 'Red Ink (Crimson)',
    category: 'ink',
    quantity: 85,
    unit: 'ml',
    reorderLevel: 20,
    costPerUnit: 280,
    lastRestockedAt: '2026-08-15T10:00:00Z',
    expiryDate: '2027-08-15T23:59:59Z',
  },
  {
    id: 'inv_006',
    name: 'Gold Ink (Premium)',
    category: 'ink',
    quantity: 45,
    unit: 'ml',
    reorderLevel: 15,
    costPerUnit: 400,
    lastRestockedAt: '2026-08-10T10:00:00Z',
    expiryDate: '2027-08-10T23:59:59Z',
  },
  {
    id: 'inv_007',
    name: 'Surgical Spirit (Disinfectant)',
    category: 'supplies',
    quantity: 5000,
    unit: 'ml',
    reorderLevel: 1000,
    costPerUnit: 8,
    lastRestockedAt: '2026-08-18T10:00:00Z',
    expiryDate: '2027-12-31T23:59:59Z',
  },
  {
    id: 'inv_008',
    name: 'Nitrile Gloves',
    category: 'supplies',
    quantity: 200,
    unit: 'boxes',
    reorderLevel: 50,
    costPerUnit: 120,
    lastRestockedAt: '2026-08-20T10:00:00Z',
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking_001',
    clientName: 'Rahul Kumar',
    clientEmail: 'rahul@example.com',
    clientPhone: '+91-9111111111',
    artistId: 'artist_001',
    consultationDetails: 'Dragon design on right shoulder, Japanese style',
    design: 'Dragon',
    designLocation: 'Right Shoulder',
    estimatedSizeInches: 6,
    estimatedTimeHours: 4,
    estimatedCostRupees: 12000,
    bookedDate: '2026-09-10',
    bookedTime: '14:00',
    depositPaid: 2000,
    totalPaid: 2000,
    status: 'pending',
    createdAt: '2026-08-27T10:00:00Z',
    itemsUsed: [],
  },
  {
    id: 'booking_002',
    clientName: 'Neha Sharma',
    clientEmail: 'neha@example.com',
    clientPhone: '+91-9222222222',
    artistId: 'artist_002',
    consultationDetails: 'Portrait of family member, realistic style',
    design: 'Portrait',
    designLocation: 'Left Forearm',
    estimatedSizeInches: 4,
    estimatedTimeHours: 6,
    estimatedCostRupees: 18000,
    bookedDate: '2026-09-15',
    bookedTime: '11:00',
    depositPaid: 2000,
    totalPaid: 2000,
    status: 'approved',
    createdAt: '2026-08-25T10:00:00Z',
    itemsUsed: [],
  },
];

const MOCK_WAIVERS: Waiver[] = [
  {
    id: 'waiver_001',
    clientName: 'Neha Sharma',
    clientEmail: 'neha@example.com',
    clientPhone: '+91-9222222222',
    bookingId: 'booking_002',
    waiverType: 'health',
    submittedAt: '2026-08-25T14:30:00Z',
    acknowledged: true,
    waiverText: 'Client confirms no existing allergies, skin conditions, or medications that contraindicate tattooing.',
  },
];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [waivers, setWaivers] = useState<Waiver[]>(MOCK_WAIVERS);
  const [marketingContacts, setMarketingContacts] = useState<MarketingContact[]>(
    []
  );
  const [financials, setFinancials] = useState<StudioFinancials>({
    totalRevenue: 0,
    totalExpenses: 0,
    totalArtistPayouts: 0,
    netProfit: 0,
    currency: 'INR',
  });

  // ============ BOOKING ACTIONS ============

  const addBooking = (
    booking: Omit<Booking, 'id' | 'createdAt'>
  ): string => {
    const id = `booking_${Date.now()}`;
    const newBooking: Booking = {
      ...booking,
      id,
      createdAt: new Date().toISOString(),
    };
    setBookings([...bookings, newBooking]);
    return id;
  };

  const approveBooking = (bookingId: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'approved' }
          : booking
      )
    );
  };

  const checkInClient = (
    bookingId: string,
    itemsUsed: InventoryDeduction[]
  ) => {
    // Update booking status and track items used
    setBookings((prevBookings) =>
      prevBookings.map((booking) => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            status: 'checked_in',
            checkedInAt: new Date().toISOString(),
            itemsUsed,
          };
        }
        return booking;
      })
    );

    // Deduct items from inventory
    setInventory((prevInventory) => {
      let updatedInventory = [...prevInventory];
      itemsUsed.forEach((deduction) => {
        updatedInventory = updatedInventory.map((item) => {
          if (item.id === deduction.itemId) {
            return {
              ...item,
              quantity: item.quantity - deduction.quantityUsed,
            };
          }
          return item;
        });
      });
      return updatedInventory;
    });

    recalculateFinancials();
  };

  const completeBooking = (bookingId: string, finalCost: number) => {
    // Find the booking to get artist ID and calculate commission
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const artist = artists.find((a) => a.id === booking.artistId);
    if (!artist) return;

    const commissionSplit = (finalCost * artist.commissionPercentage) / 100;
    const artistRevenue = commissionSplit;

    // Update booking
    setBookings((prevBookings) =>
      prevBookings.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'completed',
            totalPaid: finalCost,
            commissionSplit: artist.commissionPercentage,
            artistRevenue,
          };
        }
        return b;
      })
    );

    // Update artist revenue and booking count
    setArtists((prevArtists) =>
      prevArtists.map((a) => {
        if (a.id === artist.id) {
          return {
            ...a,
            totalRevenueEarned: a.totalRevenueEarned + artistRevenue,
            totalBookingsCompleted: a.totalBookingsCompleted + 1,
          };
        }
        return a;
      })
    );

    // Add to marketing contacts for future touch-ups
    const touchUpType = booking.designLocation.toLowerCase().includes('face')
      ? ('14-day' as const)
      : ('6-month' as const);
    const nextTouchUpDate = new Date();
    nextTouchUpDate.setDate(
      nextTouchUpDate.getDate() + (touchUpType === '14-day' ? 14 : 180)
    );

    const marketingContact: MarketingContact = {
      id: `contact_${Date.now()}`,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      lastBookingDate: new Date().toISOString(),
      nextTouchUpDate: nextTouchUpDate.toISOString(),
      touchUpType,
      status: 'pending',
      notes: `Original design: ${booking.design} on ${booking.designLocation}`,
      createdAt: new Date().toISOString(),
    };

    setMarketingContacts((prev) => [...prev, marketingContact]);

    recalculateFinancials();
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      )
    );
  };

  // ============ ARTIST ACTIONS ============

  const enrollArtist = (artist: Omit<Artist, 'id'>): string => {
    const id = `artist_${Date.now()}`;
    const newArtist: Artist = {
      ...artist,
      id,
    };
    setArtists([...artists, newArtist]);
    return id;
  };

  const updateArtist = (artistId: string, updates: Partial<Artist>) => {
    setArtists((prevArtists) =>
      prevArtists.map((artist) =>
        artist.id === artistId ? { ...artist, ...updates } : artist
      )
    );
  };

  // ============ INVENTORY ACTIONS ============

  const addInventoryItem = (
    item: Omit<InventoryItem, 'id'>
  ): string => {
    const id = `inv_${Date.now()}`;
    const newItem: InventoryItem = {
      ...item,
      id,
    };
    setInventory([...inventory, newItem]);
    return id;
  };

  const updateInventoryQuantity = (itemId: string, newQuantity: number) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const restockInventory = (itemId: string, quantityAdded: number) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + quantityAdded,
            lastRestockedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  // ============ WAIVER ACTIONS ============

  const submitWaiver = (
    waiver: Omit<Waiver, 'id' | 'submittedAt'>
  ): string => {
    const id = `waiver_${Date.now()}`;
    const newWaiver: Waiver = {
      ...waiver,
      id,
      submittedAt: new Date().toISOString(),
    };
    setWaivers([...waivers, newWaiver]);
    return id;
  };

  // ============ MARKETING ACTIONS ============

  const addMarketingContact = (
    contact: Omit<MarketingContact, 'id' | 'createdAt'>
  ): string => {
    const id = `contact_${Date.now()}`;
    const newContact: MarketingContact = {
      ...contact,
      id,
      createdAt: new Date().toISOString(),
    };
    setMarketingContacts([...marketingContacts, newContact]);
    return id;
  };

  const updateMarketingStatus = (
    contactId: string,
    status: 'pending' | 'contacted' | 'converted'
  ) => {
    setMarketingContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, status } : contact
      )
    );
  };

  // ============ FINANCIALS ACTIONS ============

  const recalculateFinancials = () => {
    const completedBookings = bookings.filter((b) => b.status === 'completed');

    const totalRevenue = completedBookings.reduce(
      (sum, b) => sum + (b.totalPaid || 0),
      0
    );

    const totalExpenses = bookings.reduce((sum, booking) => {
      const itemsCost = booking.itemsUsed.reduce(
        (itemSum, item) => itemSum + item.costDeducted,
        0
      );
      return sum + itemsCost;
    }, 0);

    const totalArtistPayouts = completedBookings.reduce(
      (sum, b) => sum + (b.artistRevenue || 0),
      0
    );

    const netProfit =
      totalRevenue - totalExpenses - totalArtistPayouts;

    setFinancials({
      totalRevenue,
      totalExpenses,
      totalArtistPayouts,
      netProfit,
      currency: 'INR',
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        artists,
        inventory,
        waivers,
        marketingContacts,
        financials,
        addBooking,
        approveBooking,
        checkInClient,
        completeBooking,
        cancelBooking,
        enrollArtist,
        updateArtist,
        addInventoryItem,
        updateInventoryQuantity,
        restockInventory,
        submitWaiver,
        addMarketingContact,
        updateMarketingStatus,
        recalculateFinancials,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
