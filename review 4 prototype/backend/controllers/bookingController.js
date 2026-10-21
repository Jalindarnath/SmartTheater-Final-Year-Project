const bookingService = require('../services/bookingService');

exports.createBooking = (req, res) => {
  try {
    const { show_id, seat_labels, seat_ids, customer_name, customer_email, customer_mobile } = req.body;
    const selectedSeats = (seat_labels && seat_labels.length > 0) ? seat_labels : seat_ids;

    if (!show_id) {
      return res.status(400).json({ error: 'show_id is required.' });
    }

    if (!selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ error: 'At least one seat must be selected.' });
    }

    const booking = bookingService.createBooking({
      show_id,
      seat_labels: selectedSeats,
      seat_ids: selectedSeats,
      customer_name,
      customer_email,
      customer_mobile,
    });

    res.status(201).json({
      message: 'Booking confirmed successfully.',
      booking,
      id: booking.id,
      booking_reference: booking.booking_reference,
      total_amount: booking.total_amount
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message || 'Booking reservation failed.' });
  }
};

exports.getBooking = (req, res) => {
  try {
    const { id } = req.params;
    const booking = bookingService.getBooking(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found.' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error retrieving booking:', error);
    res.status(500).json({ error: 'Failed to retrieve booking.' });
  }
};
