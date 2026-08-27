import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from '@/store/BookingContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Artists from '@/components/Artists';
import TryOn from '@/components/TryOn';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import AdminDashboard from '@/components/admin/AdminDashboard';

function Storefront() {
  return (
    <div className="min-h-screen bg-ink-black">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <Artists />
        <TryOn />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <BookingModal />
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}
