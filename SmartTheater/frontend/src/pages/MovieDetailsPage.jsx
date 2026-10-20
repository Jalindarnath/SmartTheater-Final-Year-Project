import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useBooking } from '../contexts/BookingContext';
import { Star, Clock, Calendar, MapPin, Play, Bookmark, ShieldCheck, ChevronRight } from 'lucide-react';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedShow } = useBooking();

  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-10-16');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);

  // Date selection options matching PDF (FRI 16 OCT to WED 21 OCT)
  const dates = [
    { day: 'FRI', num: '16', month: 'OCT', dateStr: '2026-10-16' },
    { day: 'SAT', num: '17', month: 'OCT', dateStr: '2026-10-17' },
    { day: 'SUN', num: '18', month: 'OCT', dateStr: '2026-10-18' },
    { day: 'MON', num: '19', month: 'OCT', dateStr: '2026-10-19' },
    { day: 'TUE', num: '20', month: 'OCT', dateStr: '2026-10-20' },
    { day: 'WED', num: '21', month: 'OCT', dateStr: '2026-10-21' },
  ];

  useEffect(() => {
    async function fetchMovie() {
      try {
        const [movieData, showsData] = await Promise.all([
          api.getMovieDetail(id),
          api.getMovieShows(id).catch(() => []),
        ]);

        const fullMovie = { ...movieData, shows: showsData || [] };
        setMovie(fullMovie);
        setSelectedMovie(fullMovie);

        // Pre-select the 7:30 PM Cinepolis show as shown in the PDF prototype
        let defaultShow = null;
        if (showsData && showsData.length > 0) {
          defaultShow =
            showsData.find((s) => s.show_datetime?.includes('19:30')) ||
            showsData[0];
        } else {
          defaultShow = {
            id: 'fcbbf90d-b7fb-40f9-a9c2-390f0a25522c',
            theater_name: 'Cinepolis · Nexus Shantiniketan',
            screen_number: 3,
            show_time: '7:30 PM',
          };
        }
        setSelectedShowtime(defaultShow);
        setSelectedShow(defaultShow);
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  const handleShowSelect = (show) => {
    setSelectedShowtime(show);
    setSelectedShow(show);
  };

  const handleProceedToSeats = () => {
    const showId = selectedShowtime?.id || 'fcbbf90d-b7fb-40f9-a9c2-390f0a25522c';
    setSelectedMovie(movie);
    setSelectedShow(selectedShowtime || { id: showId, theater_name: 'Cinepolis · Nexus Shantiniketan' });
    navigate(`/booking/seats/${showId}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Movie not found</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '20px' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Group shows by theater
  const theatersMap = {};
  if (movie.shows) {
    movie.shows.forEach((show) => {
      const tName = show.theater_name || 'Cinepolis · Nexus Shantiniketan';
      if (!theatersMap[tName]) {
        theatersMap[tName] = [];
      }
      theatersMap[tName].push(show);
    });
  }

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ── BREADCRUMB ── */}
      <div className="container" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-dim)' }}>Movies</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{movie.title}</span>
        </div>
      </div>

      {/* ── MOVIE HERO HEADER ── */}
      <section className="container" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{
          padding: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '36px',
          background: 'linear-gradient(135deg, rgba(24, 32, 50, 0.9), rgba(13, 18, 29, 0.95))',
        }}>
          {/* Movie Poster */}
          <div style={{ flex: '0 0 240px', maxWidth: '240px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img
              src={movie.poster_url || '/images/last_orbit.jpg'}
              alt={movie.title}
              style={{ width: '100%', height: '340px', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-gold">NOW SHOWING</span>
              <span className="badge badge-info">{movie.format || 'IMAX 2D'}</span>
              <span className="badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                {movie.certification || 'U/A 13+'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.02em' }}>
              {movie.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '18px' }}>
              <span>{movie.genre}</span>
              <span>·</span>
              <span>{movie.language}</span>
              <span>·</span>
              <span>{movie.duration_minutes}m</span>
            </div>

            {/* Rating pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 197, 24, 0.1)',
                border: '1px solid rgba(245, 197, 24, 0.3)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
              }}>
                <Star size={18} color="var(--gold)" fill="var(--gold)" />
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--gold)' }}>{movie.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ 10</span>
              </div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.86rem' }}>
                {movie.rating_count ? `${movie.rating_count.toLocaleString()} audience ratings` : '2.4K audience ratings'}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '18px', maxWidth: '720px' }}>
              {movie.description}
            </p>

            <div style={{ fontSize: '0.86rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
              {movie.director && <div><strong style={{ color: 'var(--text-muted)' }}>Directed by:</strong> {movie.director}</div>}
              {movie.cast && <div><strong style={{ color: 'var(--text-muted)' }}>Cast:</strong> {movie.cast}</div>}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <button
                onClick={() => window.open('https://youtube.com', '_blank')}
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <Play size={15} fill="currentColor" /> Watch trailer
              </button>
              <button className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
                <Bookmark size={15} /> Add to watchlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWTIMES & BOOKING SECTION ── */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Date Selector & Theaters */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>Find your show</h2>

            {/* Date Picker Pills */}
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '32px',
            }}>
              {dates.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    onClick={() => setSelectedDate(d.dateStr)}
                    style={{
                      flex: '0 0 76px',
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--gold)' : 'var(--bg-card)',
                      color: isSelected ? '#0f172a' : 'var(--text-main)',
                      border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: isSelected ? '0 0 16px var(--gold-glow)' : 'none',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                      {d.day}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1, margin: '2px 0' }}>
                      {d.num}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {d.month}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Theaters List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Theater 1: Cinepolis */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                      Cinepolis · Nexus Shantiniketan
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', gap: '8px' }}>
                      <span>Whitefield · 3.2 km away</span>
                      <span>·</span>
                      <span>Screen 03</span>
                      <span>·</span>
                      <span className="badge badge-info" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>M-ticket</span>
                    </div>
                  </div>
                </div>

                {/* Showtimes Pills */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {(theatersMap['Cinepolis · Nexus Shantiniketan'] || movie.shows || []).map((s, idx) => {
                    const isSelected = selectedShowtime?.id === s.id;
                    const timeLabel = s.show_time ? s.show_time.slice(0, 5) : ['10:45 AM', '2:15 PM', '7:30 PM', '10:45 PM'][idx % 4];
                    const statusTag = idx === 1 ? 'Filling fast' : 'Available';

                    return (
                      <button
                        key={s.id || idx}
                        onClick={() => handleShowSelect(s)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--gold)' : 'var(--bg-primary)',
                          color: isSelected ? '#0f172a' : 'var(--text-main)',
                          border: isSelected ? 'none' : '1px solid var(--border-medium)',
                          boxShadow: isSelected ? '0 0 14px var(--gold-glow)' : 'none',
                          textAlign: 'center',
                          minWidth: '105px',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{timeLabel}</div>
                        <div style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          color: isSelected ? '#0f172a' : statusTag === 'Filling fast' ? '#f59e0b' : '#10b981',
                        }}>
                          {statusTag}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  IMAX 2D · English · Cancellation available up to 2 hours before show
                </div>
              </div>

              {/* Theater 2: PVR Phoenix Marketcity */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                      PVR · Phoenix Marketcity
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', gap: '8px' }}>
                      <span>Mahadevapura · 5.8 km away</span>
                      <span>·</span>
                      <span>Screen 01</span>
                      <span>·</span>
                      <span className="badge badge-info" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>M-ticket</span>
                    </div>
                  </div>
                </div>

                {/* Showtimes Pills */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {['11:30 AM', '4:00 PM', '8:15 PM'].map((timeLabel, idx) => {
                    const statusTag = idx === 1 ? 'Filling fast' : 'Available';
                    return (
                      <button
                        key={timeLabel}
                        onClick={() => {
                          if (movie.shows && movie.shows[idx]) handleShowSelect(movie.shows[idx]);
                        }}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '8px',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-main)',
                          border: '1px solid var(--border-medium)',
                          textAlign: 'center',
                          minWidth: '105px',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{timeLabel}</div>
                        <div style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          color: statusTag === 'Filling fast' ? '#f59e0b' : '#10b981',
                        }}>
                          {statusTag}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  IMAX 2D · English · Cancellation available up to 2 hours before show
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Show Summary Card */}
          <div className="glass-panel" style={{
            padding: '28px',
            position: 'sticky',
            top: '90px',
            background: 'linear-gradient(135deg, rgba(24, 32, 50, 0.95), rgba(15, 23, 42, 0.95))',
            border: '1px solid rgba(245, 197, 24, 0.25)',
          }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--gold)',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}>
              Your Selected Show
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Make it a movie night.
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Experience {movie.title} on the biggest screen, with immersive sound.
            </p>

            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                {selectedShowtime?.theater_name || 'Cinepolis · Nexus Shantiniketan'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                Whitefield · Screen 03
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--gold)', fontWeight: 600 }}>
                Fri, 16 Oct 2026 · 7:30 PM
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {movie.format || 'IMAX 2D'} · English
              </div>
            </div>

            {/* Price reference */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Standard: </span>
                <span style={{ fontWeight: 700 }}>₹220</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Premium: </span>
                <span style={{ fontWeight: 700, color: 'var(--gold)' }}>₹320</span>
              </div>
            </div>

            <button
              onClick={handleProceedToSeats}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Select seats
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '10px' }}>
              Choose your seats before completing payment.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
