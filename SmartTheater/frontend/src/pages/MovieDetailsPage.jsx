import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useBooking } from '../contexts/BookingContext';
import {
  Star,
  Play,
  Bookmark,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  Ticket,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';

const FALLBACK_MOVIE = {
  id: '3d84797a-4668-4795-93fe-5cd3c8a701ef',
  title: 'The Last Orbit',
  genre: 'Sci-fi / Adventure',
  language: 'English',
  certification: 'U/A 13+',
  duration_minutes: 138,
  rating: 9.1,
  rating_count: '2.4K audience ratings',
  poster_url: '/images/last_orbit.jpg',
  synopsis:
    'When a distress signal arrives from the edge of the solar system, a lone astronaut must choose between returning home and uncovering a secret that could change humanity forever.',
  credits: 'Directed by Maya Reynolds · With Ethan Cole, Naomi Park & Idris Vale',
};

const DATES = [
  { day: 'FRI', date: '16', month: 'OCT', full: 'Fri, 16 Oct 2026' },
  { day: 'SAT', date: '17', month: 'OCT', full: 'Sat, 17 Oct 2026' },
  { day: 'SUN', date: '18', month: 'OCT', full: 'Sun, 18 Oct 2026' },
  { day: 'MON', date: '19', month: 'OCT', full: 'Mon, 19 Oct 2026' },
  { day: 'TUE', date: '20', month: 'OCT', full: 'Tue, 20 Oct 2026' },
  { day: 'WED', date: '21', month: 'OCT', full: 'Wed, 21 Oct 2026' },
];

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedShow } = useBooking();

  const [movie, setMovie] = useState(FALLBACK_MOVIE);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedCinema, setSelectedCinema] = useState('cinepolis');
  const [selectedShowtime, setSelectedShowtime] = useState('7:30 PM');

  useEffect(() => {
    async function loadMovie() {
      try {
        if (id) {
          const data = await api.getMovieDetail(id);
          if (data && data.title) {
            setMovie({
              ...FALLBACK_MOVIE,
              ...data,
              poster_url: data.poster_url || FALLBACK_MOVIE.poster_url,
            });
          }
        }
      } catch (err) {
        console.warn('Backend movie detail fallback to prototype:', err);
      }
    }
    loadMovie();
  }, [id]);

  const handleSelectSeats = () => {
    setSelectedMovie(movie);
    setSelectedShow({
      id: 'demo-show-cinepolis-730',
      theater_name: 'Cinepolis · Nexus Shantiniketan',
      location: 'Whitefield · 3.2 km away · Screen 03',
      show_datetime: `${DATES[selectedDateIdx].full} · ${selectedShowtime}`,
      format: 'IMAX 2D · English',
      standard_price: 220,
      premium_price: 320,
    });
    navigate('/booking/seats/demo-show-cinepolis-730');
  };

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* ── BREADCRUMBS (Movies > The Last Orbit) ── */}
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.86rem',
          color: 'var(--text-muted)',
        }}>
          <Link to="/movies" style={{ color: 'var(--text-muted)' }}>
            Movies
          </Link>
          <span>›</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{movie.title}</span>
        </div>
      </div>

      {/* ── HERO BANNER (Exact match to crop_movie_details.png) ── */}
      <div className="container">
        <div style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'var(--bg-hero)',
          backgroundImage: `linear-gradient(to right, rgba(17, 28, 52, 0.98) 40%, rgba(17, 28, 52, 0.85) 65%, rgba(17, 28, 52, 0.5) 100%), url(${movie.poster_url})`,
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
          boxShadow: 'var(--shadow-md)',
        }}>
          {/* Movie Poster Card */}
          <div style={{
            width: '200px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}>
            <img
              src={movie.poster_url}
              alt={movie.title}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>

          {/* Details Content */}
          <div style={{ flex: 1, color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{
                background: '#1b2a47',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
              }}>
                NOW SHOWING
              </span>
              <span style={{
                background: '#134e4a',
                color: '#5eead4',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
              }}>
                IMAX 2D
              </span>
            </div>

            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '10px',
              lineHeight: 1.1,
              color: '#ffffff',
            }}>
              {movie.title}
            </h1>

            <div style={{
              fontSize: '0.94rem',
              color: '#cbd5e1',
              marginBottom: '16px',
            }}>
              {movie.genre} · {movie.language} · {Math.floor(movie.duration_minutes / 60)}h{' '}
              {movie.duration_minutes % 60}m · {movie.certification}
            </div>

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Star size={18} fill="#eab308" color="#eab308" />
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                {movie.rating} / 10
              </span>
              <span style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
                {movie.rating_count}
              </span>
            </div>

            {/* Synopsis */}
            <p style={{
              fontSize: '0.94rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              maxWidth: '680px',
              marginBottom: '16px',
            }}>
              {movie.synopsis}
            </p>

            <p style={{
              fontSize: '0.84rem',
              color: '#94a3b8',
              marginBottom: '26px',
            }}>
              {movie.credits}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => window.open('https://www.youtube.com', '_blank')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Play size={15} fill="#0f172a" />
                <span>Watch trailer</span>
              </button>

              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Bookmark size={15} color="#0f172a" />
                <span>Add to watchlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SHOWTIMES & BOOKING WORKSPACE (2 Column Layout) ── */}
      <div className="container" style={{ marginTop: '36px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column: Find Your Show */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Find your show</h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                color: 'var(--text-main)',
                fontWeight: 500,
              }}>
                <MapPin size={16} color="var(--teal-primary)" />
                <span>Bengaluru</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>
            </div>

            {/* Date Selectors & Filter Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {DATES.map((d, idx) => {
                  const active = selectedDateIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDateIdx(idx)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '68px',
                        height: '74px',
                        borderRadius: 'var(--radius-md)',
                        background: active ? 'var(--teal-primary)' : 'var(--bg-card)',
                        color: active ? '#ffffff' : 'var(--text-main)',
                        border: active ? 'none' : '1px solid var(--border-subtle)',
                        boxShadow: active ? '0 4px 12px rgba(15, 118, 110, 0.25)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, opacity: active ? 0.9 : 0.6 }}>
                        {d.day}
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.15 }}>
                        {d.date}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, opacity: active ? 0.9 : 0.6 }}>
                        {d.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Format Filter Button */}
              <button
                className="btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.84rem', gap: '6px' }}
              >
                <SlidersHorizontal size={14} />
                <span>English · IMAX 2D</span>
              </button>
            </div>

            {/* Theater Card 1: Cinepolis */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, marginBottom: '2px' }}>
                    Cinepolis · Nexus Shantiniketan
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Whitefield · 3.2 km away · Screen 03
                  </p>
                </div>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--teal-soft)',
                  color: 'var(--teal-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <Ticket size={13} />
                  <span>M-ticket</span>
                </span>
              </div>

              {/* Showtimes Pills */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <button
                  onClick={() => {
                    setSelectedCinema('cinepolis');
                    setSelectedShowtime('10:45 AM');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background:
                      selectedCinema === 'cinepolis' && selectedShowtime === '10:45 AM'
                        ? 'var(--teal-primary)'
                        : 'var(--bg-card)',
                    color:
                      selectedCinema === 'cinepolis' && selectedShowtime === '10:45 AM'
                        ? '#ffffff'
                        : 'var(--text-main)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>10:45 AM</div>
                  <div style={{ fontSize: '0.68rem', color: selectedCinema === 'cinepolis' && selectedShowtime === '10:45 AM' ? '#e2e8f0' : 'var(--teal-primary)', fontWeight: 600 }}>
                    Available
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedCinema('cinepolis');
                    setSelectedShowtime('2:15 PM');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background:
                      selectedCinema === 'cinepolis' && selectedShowtime === '2:15 PM'
                        ? 'var(--teal-primary)'
                        : 'var(--bg-card)',
                    color:
                      selectedCinema === 'cinepolis' && selectedShowtime === '2:15 PM'
                        ? '#ffffff'
                        : 'var(--text-main)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>2:15 PM</div>
                  <div style={{ fontSize: '0.68rem', color: selectedCinema === 'cinepolis' && selectedShowtime === '2:15 PM' ? '#e2e8f0' : 'var(--warning)', fontWeight: 600 }}>
                    Filling fast
                  </div>
                </button>

                {/* Selected showtime matching prototype: 7:30 PM */}
                <button
                  onClick={() => {
                    setSelectedCinema('cinepolis');
                    setSelectedShowtime('7:30 PM');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--teal-primary)',
                    background:
                      selectedCinema === 'cinepolis' && selectedShowtime === '7:30 PM'
                        ? 'var(--teal-primary)'
                        : 'var(--bg-card)',
                    color:
                      selectedCinema === 'cinepolis' && selectedShowtime === '7:30 PM'
                        ? '#ffffff'
                        : 'var(--text-main)',
                    textAlign: 'center',
                    boxShadow: selectedCinema === 'cinepolis' && selectedShowtime === '7:30 PM' ? '0 2px 8px rgba(15, 118, 110, 0.3)' : 'none',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>7:30 PM</div>
                  <div style={{ fontSize: '0.68rem', color: selectedCinema === 'cinepolis' && selectedShowtime === '7:30 PM' ? '#ffffff' : 'var(--teal-primary)', fontWeight: 600 }}>
                    Available
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedCinema('cinepolis');
                    setSelectedShowtime('10:45 PM');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background:
                      selectedCinema === 'cinepolis' && selectedShowtime === '10:45 PM'
                        ? 'var(--teal-primary)'
                        : 'var(--bg-card)',
                    color:
                      selectedCinema === 'cinepolis' && selectedShowtime === '10:45 PM'
                        ? '#ffffff'
                        : 'var(--text-main)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>10:45 PM</div>
                  <div style={{ fontSize: '0.68rem', color: selectedCinema === 'cinepolis' && selectedShowtime === '10:45 PM' ? '#e2e8f0' : 'var(--teal-primary)', fontWeight: 600 }}>
                    Available
                  </div>
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                IMAX 2D · English · Cancellation available up to 2 hours before show
              </div>
            </div>

            {/* Theater Card 2: PVR Phoenix */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 700, marginBottom: '2px' }}>
                    PVR · Phoenix Marketcity
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Mahadevapura · 5.8 km away · Screen 01
                  </p>
                </div>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--teal-soft)',
                  color: 'var(--teal-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <Ticket size={13} />
                  <span>M-ticket</span>
                </span>
              </div>

              {/* Showtimes Pills */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <button
                  onClick={() => {
                    setSelectedCinema('pvr');
                    setSelectedShowtime('11:30 AM');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background:
                      selectedCinema === 'pvr' && selectedShowtime === '11:30 AM'
                        ? 'var(--teal-primary)'
                        : 'var(--bg-card)',
                    color:
                      selectedCinema === 'pvr' && selectedShowtime === '11:30 AM'
                        ? '#ffffff'
                        : 'var(--text-main)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>11:30 AM</div>
                  <div style={{ fontSize: '0.68rem', color: selectedCinema === 'pvr' && selectedShowtime === '11:30 AM' ? '#e2e8f0' : 'var(--teal-primary)', fontWeight: 600 }}>
                    Available
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedCinema('pvr');
                    setSelectedShowtime('4:00 PM');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background:
                      selectedCinema === 'pvr' && selectedShowtime === '4:00 PM'
                        ? 'var(--teal-primary)'
                        : 'var(--bg-card)',
                    color:
                      selectedCinema === 'pvr' && selectedShowtime === '4:00 PM'
                        ? '#ffffff'
                        : 'var(--text-main)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>4:00 PM</div>
                  <div style={{ fontSize: '0.68rem', color: selectedCinema === 'pvr' && selectedShowtime === '4:00 PM' ? '#e2e8f0' : 'var(--warning)', fontWeight: 600 }}>
                    Filling fast
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedCinema('pvr');
                    setSelectedShowtime('8:15 PM');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    background:
                      selectedCinema === 'pvr' && selectedShowtime === '8:15 PM'
                        ? 'var(--teal-primary)'
                        : 'var(--bg-card)',
                    color:
                      selectedCinema === 'pvr' && selectedShowtime === '8:15 PM'
                        ? '#ffffff'
                        : 'var(--text-main)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>8:15 PM</div>
                  <div style={{ fontSize: '0.68rem', color: selectedCinema === 'pvr' && selectedShowtime === '8:15 PM' ? '#e2e8f0' : 'var(--teal-primary)', fontWeight: 600 }}>
                    Available
                  </div>
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                IMAX 2D · English · Cancellation available up to 2 hours before show
              </div>
            </div>
          </div>

          {/* Right Column: YOUR SELECTED SHOW (Sticky Card) */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'inline-block',
                background: 'var(--btn-navy-bg)',
                color: 'var(--btn-navy-text)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
              }}>
                YOUR SELECTED SHOW
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>
                Make it a movie night.
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Experience {movie.title} on the biggest screen, with immersive sound.
              </p>

              {/* Theater snippet card */}
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Ticket size={16} color="var(--teal-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {selectedCinema === 'cinepolis'
                        ? 'Cinepolis · Nexus Shantiniketan'
                        : 'PVR · Phoenix Marketcity'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {selectedCinema === 'cinepolis'
                        ? 'Whitefield · 3.2 km away · Screen 03'
                        : 'Mahadevapura · 5.8 km away · Screen 01'}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.84rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}>
                  <Calendar size={14} color="var(--text-muted)" />
                  <span>
                    {DATES[selectedDateIdx].full} · {selectedShowtime}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                }}>
                  <SlidersHorizontal size={14} />
                  <span>IMAX 2D · English</span>
                </div>
              </div>

              {/* Price summary row */}
              <div style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>Tickets from</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>₹220</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>Premium</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>₹320</span>
                </div>
              </div>

              {/* Primary Select Seats Button */}
              <button
                onClick={handleSelectSeats}
                className="btn-navy"
                style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}
              >
                <ArrowRight size={16} />
                <span>Select seats</span>
              </button>

              <div style={{
                textAlign: 'center',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '12px',
              }}>
                Choose your seats before completing payment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
