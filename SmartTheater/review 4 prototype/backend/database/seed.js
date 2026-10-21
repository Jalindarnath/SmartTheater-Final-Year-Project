const db = require('./db');

function seedDatabase() {
  console.log('🌱 Seeding SmartTheater Review 4 database...');

  // 1. Seed Movies
  const movies = [
    {
      id: 'movie-the-last-orbit',
      title: 'The Last Orbit',
      genre: 'Sci-fi',
      language: 'English',
      certification: 'U/A 13+',
      duration_minutes: 138,
      rating: 9.1,
      tag: 'IMAX EXCLUSIVE',
      poster_url: '/images/last_orbit.jpg',
      description: 'One final mission. An infinite unknown. A breathtaking journey beyond the edge of our world.',
    },
    {
      id: 'movie-velocity',
      title: 'Velocity',
      genre: 'Action',
      language: 'English',
      certification: 'U/A 16+',
      duration_minutes: 115,
      rating: 8.4,
      tag: 'Dolby Atmos',
      poster_url: '/images/velocity.jpg',
      description: 'A covert pursuit through neon-lit mountain passes tests loyalty, speed and survival.',
    },
    {
      id: 'movie-midnight-in-kyoto',
      title: 'Midnight in Kyoto',
      genre: 'Drama',
      language: 'Japanese',
      certification: 'U/A 13+',
      duration_minutes: 98,
      rating: 8.6,
      tag: "Critics' choice",
      poster_url: '/images/midnight_kyoto.jpg',
      description: 'A rain-soaked chance encounter through the historic alleyways of Kyoto turns into an unforgettable bond.',
    },
    {
      id: 'movie-the-wild-within',
      title: 'The Wild Within',
      genre: 'Adventure',
      language: 'English',
      certification: 'U',
      duration_minutes: 106,
      rating: 8.8,
      tag: 'Family favorite',
      poster_url: '/images/wild_within.jpg',
      description: 'A breathtaking journey of discovery through untamed Nordic wilderness alongside a faithful wolfhound companion.',
    },
  ];

  const insertMovie = db.prepare(`
    INSERT OR REPLACE INTO movies (id, title, genre, language, certification, duration_minutes, rating, tag, poster_url, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  movies.forEach((m) => {
    insertMovie.run(
      m.id,
      m.title,
      m.genre,
      m.language,
      m.certification,
      m.duration_minutes,
      m.rating,
      m.tag,
      m.poster_url,
      m.description
    );
  });

  // 2. Seed Shows
  const shows = [
    {
      id: 'show-orbit-cinepolis-730',
      movie_id: 'movie-the-last-orbit',
      theater_name: 'Cinepolis · Nexus Shantiniketan',
      location: 'Whitefield · 3.2 km away · Screen 03',
      screen_name: '03 · IMAX',
      show_datetime: 'Fri, 16 Oct 2026 · 7:30 PM',
      format: 'IMAX 2D · English',
      standard_price: 220.0,
      premium_price: 320.0,
    },
    {
      id: 'show-orbit-cinepolis-1045',
      movie_id: 'movie-the-last-orbit',
      theater_name: 'Cinepolis · Nexus Shantiniketan',
      location: 'Whitefield · 3.2 km away · Screen 03',
      screen_name: '03 · IMAX',
      show_datetime: 'Fri, 16 Oct 2026 · 10:45 AM',
      format: 'IMAX 2D · English',
      standard_price: 220.0,
      premium_price: 320.0,
    },
    {
      id: 'show-orbit-pvr-815',
      movie_id: 'movie-the-last-orbit',
      theater_name: 'PVR · Phoenix Marketcity',
      location: 'Mahadevapura · 5.8 km away · Screen 01',
      screen_name: '01 · IMAX',
      show_datetime: 'Fri, 16 Oct 2026 · 8:15 PM',
      format: 'IMAX 2D · English',
      standard_price: 220.0,
      premium_price: 320.0,
    },
    {
      id: 'show-velocity-cinepolis-400',
      movie_id: 'movie-velocity',
      theater_name: 'Cinepolis · Nexus Shantiniketan',
      location: 'Whitefield · Screen 02',
      screen_name: '02 · Dolby Atmos',
      show_datetime: 'Fri, 16 Oct 2026 · 4:00 PM',
      format: 'Dolby Atmos · English',
      standard_price: 200.0,
      premium_price: 300.0,
    },
    {
      id: 'show-kyoto-pvr-600',
      movie_id: 'movie-midnight-in-kyoto',
      theater_name: 'PVR · Phoenix Marketcity',
      location: 'Mahadevapura · Screen 04',
      screen_name: '04 · Standard',
      show_datetime: 'Fri, 16 Oct 2026 · 6:00 PM',
      format: '2D · Japanese',
      standard_price: 180.0,
      premium_price: 260.0,
    },
    {
      id: 'show-wild-cinepolis-215',
      movie_id: 'movie-the-wild-within',
      theater_name: 'Cinepolis · Nexus Shantiniketan',
      location: 'Whitefield · Screen 01',
      screen_name: '01 · Standard',
      show_datetime: 'Fri, 16 Oct 2026 · 2:15 PM',
      format: '2D · English',
      standard_price: 180.0,
      premium_price: 260.0,
    },
  ];

  const insertShow = db.prepare(`
    INSERT OR REPLACE INTO shows (id, movie_id, theater_name, location, screen_name, show_datetime, format, standard_price, premium_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  shows.forEach((s) => {
    insertShow.run(
      s.id,
      s.movie_id,
      s.theater_name,
      s.location,
      s.screen_name,
      s.show_datetime,
      s.format,
      s.standard_price,
      s.premium_price
    );
  });

  // 3. Seed Seats for each show
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const insertSeat = db.prepare(`
    INSERT OR REPLACE INTO seats (id, show_id, row_label, seat_number, seat_label, seat_type, price, is_booked)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Default pre-booked seats to demonstrate booking collision prevention
  const bookedSeatCodes = new Set([
    'A1', 'A2', 'A6', 'A11',
    'B3', 'B4', 'B12',
    'C1', 'C5', 'C6', 'C7', 'C10', 'C12',
    'D3', 'D8', 'D9', 'D12',
    'E1', 'E5', 'E6', 'E9', 'E10',
    'F3', 'F7', 'F8', 'F11', 'F12',
    'G1', 'G2', 'G3', 'G4', 'G8', 'G9', 'G10',
    'H2', 'H3', 'H4', 'H10', 'H11',
    'J3', 'J4', 'J5', 'J9', 'J10',
    'K1', 'K2', 'K7', 'K11', 'K12',
  ]);

  shows.forEach((show) => {
    rows.forEach((rowLetter) => {
      const isPremium = ['E', 'F', 'G', 'H', 'J', 'K'].includes(rowLetter);
      const price = isPremium ? show.premium_price : show.standard_price;
      const seatType = isPremium ? 'premium' : 'standard';

      for (let col = 1; col <= 12; col++) {
        const seatLabel = `${rowLetter}${col}`;
        const seatId = `${show.id}-${seatLabel}`;
        const isBooked = bookedSeatCodes.has(seatLabel) ? 1 : 0;

        insertSeat.run(seatId, show.id, rowLetter, col, seatLabel, seatType, price, isBooked);
      }
    });
  });

  // 4. Seed Initial Sample Bookings (matching prototype PDF)
  const insertBooking = db.prepare(`
    INSERT OR REPLACE INTO bookings (id, booking_ref, show_id, movie_title, theater_name, screen_name, show_datetime, seats_summary, seats_json, total_amount, customer_name, customer_email, customer_mobile, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(
    'booking-demo-0842',
    'ST-261016-0842',
    'show-orbit-cinepolis-730',
    'The Last Orbit',
    'Cinepolis · Nexus Shantiniketan',
    '03 · IMAX',
    'Fri, 16 Oct 2026 · 7:30 PM',
    'H7, H8 · 2 Premium seats',
    JSON.stringify([
      { seat_label: 'H7', seat_type: 'premium', price: 320 },
      { seat_label: 'H8', seat_type: 'premium', price: 320 },
    ]),
    687.20,
    'Arjun Shah',
    'arjun.shah@gmail.com',
    '+91 98765 43210',
    'Confirmed',
    '2026-10-16 10:40:00'
  );

  // 5. Seed Support Tickets (matching exact prototype triage rows from PDF)
  const insertTicket = db.prepare(`
    INSERT OR REPLACE INTO tickets (id, reference, booking_ref, customer_name, customer_email, subject, description, category, priority, assigned_team, status, confidence, explanation, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialTickets = [
    {
      id: 'ticket-1048',
      reference: 'ST-1048',
      booking_ref: 'ST-261016-0842',
      customer_name: 'Arjun Shah',
      customer_email: 'arjun.shah@gmail.com',
      subject: 'Duplicate debit',
      description: 'My UPI account was debited ₹687.20 twice, but I only booked two seats. Please check and refund the duplicate payment.',
      category: 'Payment',
      priority: 'High',
      assigned_team: 'Billing Team',
      status: 'In Progress',
      confidence: 0.984,
      explanation: "Keywords 'debited twice' and 'refund' detected — financial payment transaction issue.",
      created_at: '2026-10-16 10:42:00',
      updated_at: '2026-10-16 11:05:00',
    },
    {
      id: 'ticket-1047',
      reference: 'ST-1047',
      booking_ref: 'ST-261016-0790',
      customer_name: 'Riya Patel',
      customer_email: 'riya.patel@gmail.com',
      subject: 'Seats not confirmed',
      description: 'Payment succeeded but seats are missing from the confirmation email.',
      category: 'Booking',
      priority: 'High',
      assigned_team: 'Booking Support',
      status: 'Open',
      confidence: 0.962,
      explanation: "Keywords 'seats missing' and 'confirmation' detected — reservation synchronization issue.",
      created_at: '2026-10-16 10:36:00',
      updated_at: '2026-10-16 10:36:00',
    },
    {
      id: 'ticket-1046',
      reference: 'ST-1046',
      booking_ref: null,
      customer_name: 'Dev Menon',
      customer_email: 'dev.menon@gmail.com',
      subject: 'Wheelchair access',
      description: 'Needs wheelchair access and a companion seat for the evening show.',
      category: 'General',
      priority: 'Medium',
      assigned_team: 'Customer Support',
      status: 'Open',
      confidence: 0.962,
      explanation: "Keywords 'wheelchair' and 'companion seat' detected — accessibility inquiry.",
      created_at: '2026-10-16 10:21:00',
      updated_at: '2026-10-16 10:21:00',
    },
    {
      id: 'ticket-1045',
      reference: 'ST-1045',
      booking_ref: 'ST-261015-0994',
      customer_name: 'Anika Rao',
      customer_email: 'anika.rao@gmail.com',
      subject: 'Excellent sound',
      description: 'Praises IMAX sound quality and helpful staff at yesterday’s screening.',
      category: 'General',
      priority: 'Low',
      assigned_team: 'Customer Support',
      status: 'Resolved',
      confidence: 0.962,
      explanation: "Positive sentiment and praise for theater audio quality and hospitality.",
      created_at: '2026-10-16 10:08:00',
      updated_at: '2026-10-16 10:15:00',
    },
  ];

  initialTickets.forEach((t) => {
    insertTicket.run(
      t.id,
      t.reference,
      t.booking_ref,
      t.customer_name,
      t.customer_email,
      t.subject,
      t.description,
      t.category,
      t.priority,
      t.assigned_team,
      t.status,
      t.confidence,
      t.explanation,
      t.created_at,
      t.updated_at
    );
  });

  console.log('✅ Database seeded successfully with movies, shows, seats, bookings, and tickets.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
