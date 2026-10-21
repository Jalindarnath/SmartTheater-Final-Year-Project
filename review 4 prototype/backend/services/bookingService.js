const db = require('../database/db');

/**
 * SmartTheater Booking Service
 * Handles seat availability retrieval and transactional booking validation.
 */

// Generate human-friendly reference e.g. ST-261021-0842
function generateBookingReference() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ST-${yy}${mm}${dd}-${rand}`;
}

/**
 * Retrieves all seats for a given show ID.
 */
function getSeatsForShow(showId) {
  const stmt = db.prepare(`
    SELECT id, show_id, row_label, seat_number, seat_label, seat_type, price, is_booked
    FROM seats
    WHERE show_id = ?
    ORDER BY row_label ASC, seat_number ASC
  `);
  return stmt.all(showId);
}

/**
 * Validates availability and commits booking transaction.
 */
function createBooking({ show_id, seat_labels, seat_ids, customer_name, customer_email, customer_mobile }) {
  if (!show_id) throw new Error('Show ID is required.');
  const inputs = (seat_labels && seat_labels.length > 0) ? seat_labels : (seat_ids || []);
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new Error('At least one seat must be selected.');
  }

  // 1. Verify show exists
  const showStmt = db.prepare(`
    SELECT s.*, m.title as movie_title
    FROM shows s
    JOIN movies m ON s.movie_id = m.id
    WHERE s.id = ?
  `);
  const show = showStmt.get(show_id);
  if (!show) {
    const err = new Error('Specified show not found.');
    err.statusCode = 404;
    throw err;
  }

  // 2. Fetch selected seats and recheck availability
  const seatPlaceholders = inputs.map(() => '?').join(', ');
  const seatCheckStmt = db.prepare(`
    SELECT id, seat_label, seat_type, price, is_booked
    FROM seats
    WHERE show_id = ? AND (seat_label IN (${seatPlaceholders}) OR id IN (${seatPlaceholders}))
  `);
  const existingSeats = seatCheckStmt.all(show_id, ...inputs, ...inputs);

  if (existingSeats.length !== inputs.length) {
    const err = new Error('One or more selected seats do not exist for this show.');
    err.statusCode = 400;
    throw err;
  }

  const alreadyBooked = existingSeats.filter((s) => s.is_booked === 1);
  if (alreadyBooked.length > 0) {
    const conflictingLabels = alreadyBooked.map((s) => s.seat_label).join(', ');
    const err = new Error(`Seat(s) ${conflictingLabels} are already booked. Please choose available seats.`);
    err.statusCode = 409; // Conflict
    throw err;
  }

  // 3. Calculate pricing (subtotal + convenience fee ₹40 + GST 18%)
  const subtotal = existingSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = 40.0;
  const gst = +(convenienceFee * 0.18).toFixed(2);
  const totalAmount = +(subtotal + convenienceFee + gst).toFixed(2);

  const bookingRef = generateBookingReference();
  const bookingId = `booking-${Date.now()}`;
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // 4. Atomic transaction: mark seats as booked and record booking
  db.exec('BEGIN TRANSACTION;');
  try {
    const updateSeatStmt = db.prepare(`
      UPDATE seats
      SET is_booked = 1
      WHERE show_id = ? AND seat_label = ?
    `);

    for (const seat of existingSeats) {
      updateSeatStmt.run(show_id, seat.seat_label);
    }

    const insertBookingStmt = db.prepare(`
      INSERT INTO bookings (
        id, booking_ref, show_id, movie_title, theater_name, screen_name,
        show_datetime, seats_summary, seats_json, total_amount,
        customer_name, customer_email, customer_mobile, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seatsSummary = `${seat_labels.join(', ')} · ${seat_labels.length} ${existingSeats[0]?.seat_type === 'premium' ? 'Premium' : 'Standard'} seats`;

    insertBookingStmt.run(
      bookingId,
      bookingRef,
      show_id,
      show.movie_title,
      show.theater_name,
      show.screen_name,
      show.show_datetime,
      seatsSummary,
      JSON.stringify(existingSeats),
      totalAmount,
      customer_name || 'Arjun Shah',
      customer_email || 'arjun.shah@gmail.com',
      customer_mobile || '+91 98765 43210',
      'Confirmed',
      nowStr
    );

    db.exec('COMMIT;');

    return {
      id: bookingId,
      booking_ref: bookingRef,
      booking_reference: bookingRef,
      movie_title: show.movie_title,
      theater_name: show.theater_name,
      screen_name: show.screen_name,
      show_datetime: show.show_datetime,
      format: show.format,
      seats: existingSeats,
      seats_summary: seatsSummary,
      total_amount: totalAmount,
      customer_name: customer_name || 'Arjun Shah',
      customer_email: customer_email || 'arjun.shah@gmail.com',
      status: 'Confirmed',
      created_at: nowStr,
      movie: {
        title: show.movie_title,
      },
      show: {
        theater_name: show.theater_name,
        screen_name: show.screen_name,
        show_time: show.show_datetime,
        show_date: show.show_datetime ? show.show_datetime.split('·')[0].trim() : '',
      }
    };
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

/**
 * Retrieves booking details by ID or reference.
 */
function getBooking(idOrRef) {
  const stmt = db.prepare(`
    SELECT * FROM bookings
    WHERE id = ? OR booking_ref = ?
  `);
  const booking = stmt.get(idOrRef, idOrRef);
  if (booking) {
    booking.booking_reference = booking.booking_ref;
    booking.movie = { title: booking.movie_title };
    booking.show = {
      theater_name: booking.theater_name,
      screen_name: booking.screen_name,
      show_time: booking.show_datetime,
      show_date: booking.show_datetime ? booking.show_datetime.split('·')[0].trim() : '',
    };
    if (booking.seats_json) {
      try {
        booking.seats = JSON.parse(booking.seats_json);
      } catch {
        booking.seats = [];
      }
    }
  }
  return booking;
}

module.exports = {
  getSeatsForShow,
  createBooking,
  getBooking,
};
