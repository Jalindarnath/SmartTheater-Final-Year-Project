const bookingService = require('../services/bookingService');
const db = require('../database/db');

exports.getShowSeats = (req, res) => {
  try {
    const { showId } = req.params;

    const showStmt = db.prepare(`
      SELECT s.*, m.title as movie_title, m.poster_url
      FROM shows s
      JOIN movies m ON s.movie_id = m.id
      WHERE s.id = ?
    `);
    const show = showStmt.get(showId);

    if (!show) {
      return res.status(404).json({ error: 'Show not found.' });
    }

    const seats = bookingService.getSeatsForShow(showId);

    res.json({
      show,
      movie: {
        id: show.movie_id,
        title: show.movie_title,
        poster_url: show.poster_url,
      },
      seats,
    });
  } catch (error) {
    console.error('Error fetching show seats:', error);
    res.status(500).json({ error: 'Failed to retrieve show seating map.' });
  }
};
