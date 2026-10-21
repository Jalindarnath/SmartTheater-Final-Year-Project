import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Clock, Star, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import BookingStepper from '../components/BookingStepper';

export default function MovieListingPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShow, setSelectedShow] = useState({});

  useEffect(() => {
    let mounted = true;
    api.getMovies()
      .then(data => {
        if (mounted) {
          setMovies(data);
          // Set default selected show for each movie (the first one)
          const initialShows = {};
          data.forEach(m => {
            if (m.shows && m.shows.length > 0) {
              initialShows[m.id] = m.shows[0].id;
            }
          });
          setSelectedShow(initialShows);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || 'Failed to load movie catalogue');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const handleSelectShowtime = (movieId, showId) => {
    setSelectedShow(prev => ({ ...prev, [movieId]: showId }));
  };

  const handleBookNow = (movieId) => {
    const showId = selectedShow[movieId];
    if (showId) {
      navigate(`/seats/${showId}`);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-pill">
            <Film size={14} />
            <span>SmartTheater Project Architecture • Review 4</span>
          </div>
          <h1 className="hero-title">Intelligent Cinema Experience & Support Automation</h1>
          <p className="hero-desc">
            Seamless movie ticket booking with atomic concurrency reservation and automated customer support triage powered by explainable classification rules.
          </p>
          <div className="hero-actions">
            <a href="#movies-catalog" className="btn-book-now" style={{ width: 'auto', padding: '0.65rem 1.25rem' }}>
              Browse Current Movies
            </a>
            <button 
              onClick={() => navigate('/support')} 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1.25rem',
                fontSize: '0.92rem',
                fontWeight: 600
              }}
            >
              Test Support Triage
            </button>
          </div>
        </div>
      </section>

      {/* Booking Stepper */}
      <BookingStepper currentStep={1} />

      {/* Catalogue Header */}
      <div id="movies-catalog" className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="page-title">Now Showing</h2>
          <p className="page-subtitle">Select a movie and preferred showtime to choose your seats.</p>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="loading-spinner" style={{ width: '32px', height: '32px', marginBottom: '1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading verified movie catalogue from SQLite...</p>
        </div>
      )}

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={20} />
          <div>
            <strong>Error connecting to catalog:</strong> {error}
          </div>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && !error && (
        <div className="movies-grid">
          {movies.map(movie => {
            const currentSelectedShowId = selectedShow[movie.id];
            const activeShow = movie.shows?.find(s => s.id === currentSelectedShowId);

            return (
              <div key={movie.id} className="movie-card">
                <div className="movie-poster-wrap">
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="movie-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="movie-rating-badge">
                    <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{movie.rating}</span>
                  </div>
                </div>

                <div className="movie-card-body">
                  <div className="movie-meta-row">
                    <span className="movie-genre-tag">{movie.genre}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {movie.duration}
                    </span>
                    <span>•</span>
                    <span>{movie.language}</span>
                  </div>

                  <h3 className="movie-card-title">{movie.title}</h3>
                  <p className="movie-description">{movie.description}</p>

                  <div className="showtimes-section">
                    <div className="showtimes-label">
                      Available Showtimes ({movie.shows?.length || 0})
                    </div>
                    
                    <div className="showtime-chips">
                      {movie.shows && movie.shows.map(show => {
                        const isSelected = show.id === currentSelectedShowId;
                        return (
                          <button
                            key={show.id}
                            type="button"
                            className={`showtime-chip ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSelectShowtime(movie.id, show.id)}
                            title={`${show.theater_name} — ${show.screen_name}`}
                          >
                            <span style={{ display: 'block', fontSize: '0.85rem' }}>{show.show_time}</span>
                            <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.75 }}>{show.show_date}</span>
                          </button>
                        );
                      })}
                    </div>

                    {activeShow && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={12} />
                        <span>{activeShow.theater_name} ({activeShow.screen_name})</span>
                      </div>
                    )}

                    <button 
                      className="btn-book-now"
                      onClick={() => handleBookNow(movie.id)}
                    >
                      <Film size={16} />
                      <span>Book Tickets</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
