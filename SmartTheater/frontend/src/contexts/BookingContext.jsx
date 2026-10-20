import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holdSecondsRemaining, setHoldSecondsRemaining] = useState(600); // 10 minutes hold
  const [isHoldActive, setIsHoldActive] = useState(false);

  // Seat hold countdown effect
  useEffect(() => {
    let timer = null;
    if (isHoldActive && holdSecondsRemaining > 0) {
      timer = setInterval(() => {
        setHoldSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsHoldActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isHoldActive, holdSecondsRemaining]);

  const startHoldTimer = () => {
    setHoldSecondsRemaining(600);
    setIsHoldActive(true);
  };

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        if (!isHoldActive) {
          startHoldTimer();
        }
        return [...prev, seat];
      }
    });
  };

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setIsHoldActive(false);
    setHoldSecondsRemaining(600);
  };

  // Pricing calculations
  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const convenienceFee = selectedSeats.length > 0 ? 40.0 : 0.0;
  const gstOnFee = convenienceFee > 0 ? +(convenienceFee * 0.18).toFixed(2) : 0.0;
  const totalAmount = +(ticketSubtotal + convenienceFee + gstOnFee).toFixed(2);

  const formattedTimer = () => {
    const mins = Math.floor(holdSecondsRemaining / 60);
    const secs = holdSecondsRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedShow,
        setSelectedShow,
        selectedSeats,
        setSelectedSeats,
        toggleSeat,
        clearBooking,
        holdSecondsRemaining,
        formattedTimer,
        isHoldActive,
        ticketSubtotal,
        convenienceFee,
        gstOnFee,
        totalAmount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
}
