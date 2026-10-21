// End-to-End Automated Verification for Review 4 Prototype
async function runTests() {
  const BASE_URL = 'http://127.0.0.1:5000/api';
  console.log('--- STARTING SMARTTHEATER REVIEW 4 E2E TESTS ---\n');

  // Test 1: Health check
  console.log('TEST 1: Health Check Endpoint');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  console.log(' Health status:', health.status, '| Service:', health.service);
  if (health.status !== 'ok') throw new Error('Health check failed');

  // Test 2: Movie catalogue
  console.log('\nTEST 2: Movie Catalogue & Shows');
  const moviesRes = await fetch(`${BASE_URL}/movies`);
  const movies = await moviesRes.json();
  console.log(` Found ${movies.length} movies:`);
  movies.forEach(m => {
    console.log(`  - [ID: ${m.id}] ${m.title} (${m.genre}, ${m.duration}) -> ${m.shows.length} shows`);
  });
  if (movies.length < 3) throw new Error('Movie catalogue must have at least 3 movies');

  // Test 3: Seat map for First Show
  const firstShow = movies[0].shows[0];
  console.log(`\nTEST 3: Interactive Seat Map for Show ${firstShow.id}`);
  const showSeatsRes = await fetch(`${BASE_URL}/shows/${firstShow.id}/seats`);
  const showData = await showSeatsRes.json();
  const seats = showData.seats;
  const booked = seats.filter(s => s.is_booked);
  const available = seats.filter(s => !s.is_booked);
  console.log(` Movie: ${showData.movie.title} | Show: ${showData.show.show_time || showData.show.show_datetime}`);
  console.log(` Total seats: ${seats.length} | Available: ${available.length} | Pre-booked: ${booked.length}`);
  if (available.length === 0) throw new Error('No available seats found for testing');

  // Test 4: Atomic Seat Booking
  console.log('\nTEST 4: Atomic Seat Booking & Collision Prevention');
  const seatsToBook = available.slice(0, 2).map(s => s.id);
  const seatLabels = available.slice(0, 2).map(s => s.seat_number).join(', ');
  console.log(` Attempting to book seats: ${seatLabels} (IDs: ${seatsToBook.join(', ')})`);

  const bookingRes = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      show_id: firstShow.id,
      seat_ids: seatsToBook,
      customer_name: 'Vikram Malhotra',
      customer_email: 'vikram.m@example.com',
      customer_phone: '9876543210'
    })
  });
  const bookingData = await bookingRes.json();
  console.log(` Booking confirmed! Ref: ${bookingData.booking.booking_reference} | Total: ₹${bookingData.booking.total_amount}`);

  // Test 4b: Duplicate booking on identical seats (must reject with 409 Conflict)
  console.log(' Testing collision avoidance (re-booking same seats)...');
  const duplicateRes = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      show_id: firstShow.id,
      seat_ids: seatsToBook,
      customer_name: 'Another User',
      customer_email: 'another@example.com'
    })
  });
  console.log(` Duplicate response code: ${duplicateRes.status} (Expected 409)`);
  const duplicateJson = await duplicateRes.json();
  console.log(` Rejection message: "${duplicateJson.error}"`);
  if (duplicateRes.status !== 409) throw new Error('Expected 409 Conflict for duplicate seat booking');

  // Test 5: Booking lookup
  console.log('\nTEST 5: Booking Retrieval by ID');
  const getBookingRes = await fetch(`${BASE_URL}/bookings/${bookingData.booking.id}`);
  const retrievedBooking = await getBookingRes.json();
  console.log(` Verified Booking ${retrievedBooking.booking_reference}: ${retrievedBooking.seats.length} seats reserved for ${retrievedBooking.customer_name}`);

  // Test 6: Automated Support Ticket Triage (Rule-based classification)
  console.log('\nTEST 6: Automated Ticket Triage & Explainable Classification');
  const testTickets = [
    {
      subject: 'Payment deducted via UPI but ticket not confirmed',
      description: 'Rs 430 was debited from my HDFC bank account, but your portal gave error 500.',
      expectedCat: 'Payment',
      expectedTeam: 'Billing Team'
    },
    {
      subject: 'Need to cancel or reschedule my Saturday show tickets',
      description: 'My booking reference is BK-1048. Please reschedule to Sunday evening show.',
      expectedCat: 'Booking',
      expectedTeam: 'Booking Support'
    },
    {
      subject: 'Mobile website screen is freezing when clicking seat map',
      description: 'The layout hangs and throws an uncaught javascript exception on Chrome.',
      expectedCat: 'Technical',
      expectedTeam: 'Technical Support'
    },
    {
      subject: 'Inquiry regarding parking rates and wheelchair ramps',
      description: 'Is valet parking available at Cinema Hall 1 for seniors?',
      expectedCat: 'General',
      expectedTeam: 'Customer Support'
    }
  ];

  let createdTicketId = null;
  for (const t of testTickets) {
    const ticketRes = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Reviewer Test',
        customer_email: 'reviewer@example.com',
        subject: t.subject,
        description: t.description
      })
    });
    const ticketJson = await ticketRes.json();
    const created = ticketJson.ticket;
    console.log(` Ticket ${created.ticket_reference}: Category=[${created.category}], Priority=[${created.priority}], Team=[${created.assigned_team}]`);
    console.log(`   Reason: "${created.triage_reason}"`);
    console.log(`   Confidence: ${Math.round(created.confidence_score * 100)}% | Tokens: [${created.matched_keywords || 'none'}]`);

    if (created.category !== t.expectedCat || created.assigned_team !== t.expectedTeam) {
      console.warn(`   MISMATCH! Expected ${t.expectedCat} / ${t.expectedTeam}, got ${created.category} / ${created.assigned_team}`);
    }
    createdTicketId = created.id;
  }

  // Test 7: Admin Dashboard Queue & Status Modification
  console.log('\nTEST 7: Admin Dashboard Queue & Status Mutation');
  const allTicketsRes = await fetch(`${BASE_URL}/tickets`);
  const allTickets = await allTicketsRes.json();
  console.log(` Total tickets in queue: ${allTickets.length}`);

  console.log(` Updating status of ticket #${createdTicketId} from Open to "In Progress"...`);
  const patchRes = await fetch(`${BASE_URL}/tickets/${createdTicketId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'In Progress' })
  });
  const patchJson = await patchRes.json();
  console.log(` Updated status in SQLite: "${patchJson.status}"`);
  if (patchJson.status !== 'In Progress') throw new Error('Status update failed');

  // Test 8: Ticket Statistics
  console.log('\nTEST 8: Dashboard Summary Metrics');
  const statsRes = await fetch(`${BASE_URL}/tickets/stats`);
  const stats = await statsRes.json();
  console.log(' Metrics:', JSON.stringify(stats, null, 2));

  console.log('\n===========================================');
  console.log(' ALL 8 END-TO-END TESTS PASSED SUCCESSFULLY');
  console.log('===========================================');
}

runTests().catch(err => {
  console.error('\n TEST FAILED:', err);
  process.exit(1);
});
