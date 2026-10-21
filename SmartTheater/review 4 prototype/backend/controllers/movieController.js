const db = require('../database/db');

exports.getMovies = (req, res) => {
  try {
    const moviesStmt = db.prepare('SELECT * FROM movies ORDER BY rating DESC');
    const movies = moviesStmt.all();

    const showsStmt = db.prepare('SELECT * FROM shows WHERE movie_id = ?');

    const moviesWithShows = movies.map((movie) => {
      const shows = showsStmt.all(movie.id);
      return {
        ...movie,
        shows: shows || [],
      };
    });

    res.json(moviesWithShows);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to retrieve movie catalogue.' });
  }
};

exports.getMovieById = (req, res) => {
  try {
    const { id } = req.params;
    const movieStmt = db.prepare('SELECT * FROM movies WHERE id = ?');
    const movie = movieStmt.get(id);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    const showsStmt = db.prepare('SELECT * FROM shows WHERE movie_id = ?');
    movie.shows = showsStmt.all(id);

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Failed to retrieve movie details.' });
  }
};
