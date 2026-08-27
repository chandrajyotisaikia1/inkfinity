/**
 * Inkfinity Phase 3 CRM - Unified Data Models
 * All types are designed for frontend-only state management with React Context
 */

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  artistId: string;
  consultationDetails: string;
  design: string;
  designLocation: string;
  estimatedSizeInches: number;
  estimatedTimeHours: number;
  estimatedCostRupees: number;
  bookedDate: string; // ISO 8601
  bookedTime: string; // HH:MM format
  depositPaid: number; // in rupees, default 2000
  totalPaid: number; // cumulative payment
  status: 'pending' | 'approved' | 'checked_in' | 'completed' | 'cancelled';
  createdAt: string; // ISO 8601
  checkedInAt?: string; // ISO 8601, set when client checks in
  itemsUsed: InventoryDeduction[]; // tracked during check-in
  commissionSplit?: number; // % of final cost paid to artist
  artistRevenue?: number; // calculated from commission split
  needlesSizeUsed?: string; // e.g., "1RL, 3RL, 5RL"
  inkColorsUsed?: string[]; // e.g., ["Black", "Red", "Gold"]
}

export interface Artist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string; // e.g., "Japanese", "Realism", "Geometric"
  yearsExperience: number;
  commissionPercentage: number; // % of booking cost (typically 50-70)
  totalRevenueEarned: number; // sum of all commissions
  totalBookingsCompleted: number;
  status: 'active' | 'inactive';
  joinedAt: string; // ISO 8601
  bankAccountNumber?: string;
  upiHandle?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'needle' | 'ink' | 'supplies'; // e.g., needle size, ink color, disinfectant
  quantity: number;
  unit: string; // e.g., "packs", "ml", "boxes"
  reorderLevel: number; // alert when stock drops below this
  costPerUnit: number; // in rupees
  lastRestockedAt: string; // ISO 8601
  expiryDate?: string; // ISO 8601, for inks/disinfectants
}

export interface InventoryDeduction {
  itemId: string;
  itemName: string;
  quantityUsed: number;
  unit: string;
  costDeducted: number; // calculated as quantityUsed * costPerUnit
}

export interface Waiver {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  bookingId: string;
  waiverType: 'health' | 'allergen' | 'aftercare' | 'liability';
  signatureBase64?: string; // optional: base64-encoded digital signature
  submittedAt: string; // ISO 8601
  acknowledged: boolean;
  waiverText: string;
}

export interface MarketingContact {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lastBookingDate: string; // ISO 8601
  nextTouchUpDate: string; // ISO 8601, calculated based on design type (14 days or 6 months)
  touchUpType: '14-day' | '6-month' | 'custom';
  status: 'pending' | 'contacted' | 'converted';
  notes: string;
  createdAt: string; // ISO 8601
}

export interface StudioFinancials {
  totalRevenue: number; // sum of all completed bookings' cost
  totalExpenses: number; // sum of all inventory deductions
  totalArtistPayouts: number; // sum of all artist commission splits
  netProfit: number; // totalRevenue - totalExpenses - totalArtistPayouts
  currency: string; // "INR"
}
