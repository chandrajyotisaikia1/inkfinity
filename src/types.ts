export type Placement = 'Forearm' | 'Upper Arm' | 'Back' | 'Chest' | 'Calf' | 'Thigh' | 'Ribs' | 'Neck' | 'Hand' | 'Full Sleeve';
export type TattooSize = 'Small (< 3")' | 'Medium (3"-6")' | 'Large (6"-12")' | 'Full Piece (12"+)';
export type Style = 'Blackwork' | 'Realism' | 'Traditional' | 'Fine Line' | 'Geometric' | 'Japanese' | 'Portrait' | 'Custom';

export interface Artist {
  id: string;
  name: string;
  title: string;
  specialty: Style;
  bio: string;
  image: string;
  experienceYears: number;
  instagram: string;
  rating: number;
  sessionsCompleted: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  artistId: string;
  style: Style;
  image: string;
  placement: Placement;
  hours: number;
}

export interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  artistId: string;
  artistName: string;
  date: string;
  time: string;
  placement: Placement;
  size: TattooSize;
  style: Style;
  description: string;
  depositPaid: boolean;
  depositAmount: number;
  estimatedCost: number;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Needle' | 'Ink' | 'Glove' | 'Aftercare' | 'Equipment';
  stock: number;
  minStock: number;
  unit: string;
  supplier: string;
  unitCost: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Revenue' | 'Expense';
  amount: number;
  bookingId?: string;
}

export interface ArtistPayout {
  id: string;
  artistId: string;
  artistName: string;
  period: string;
  grossRevenue: number;
  studioShare: number;
  artistShare: number;
  status: 'Pending' | 'Paid';
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  tattoo: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
