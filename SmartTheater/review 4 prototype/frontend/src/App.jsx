import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MovieListingPage from './pages/MovieListingPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import SupportTicketPage from './pages/SupportTicketPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MovieListingPage />} />
          <Route path="/seats/:showId" element={<SeatSelectionPage />} />
          <Route path="/confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/support" element={<SupportTicketPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
