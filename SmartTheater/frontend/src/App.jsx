import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import SupportPage from './pages/SupportPage';
import StaffWorkspacePage from './pages/StaffWorkspacePage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Customer Journey */}
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/booking/seats/:showId" element={<SeatSelectionPage />} />
                <Route path="/booking/checkout" element={<CheckoutPage />} />
                <Route path="/booking/confirmation/:bookingId" element={<ConfirmationPage />} />

                {/* Intelligent Support Hub */}
                <Route path="/support" element={<SupportPage />} />

                {/* Staff Ticket Queue Workspace */}
                <Route path="/staff/tickets" element={<StaffWorkspacePage />} />

                {/* Admin Platform & AI Analytics */}
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}
