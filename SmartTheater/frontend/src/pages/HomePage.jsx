import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Search, Star, Play, Sparkles, ChevronRight, MessageSquareCheck } from 'lucide-react';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const genres = ['All', 'Sci-fi', 'Action', 'Drama', 'Adventure'];

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await api.getMovies();
        setMovies(data);
        setFilteredMovies(data);
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // Filter handler
  useEffect(() => {
    let result = movies;
    if (selectedGenre !== 'All') {
      result = result.filter((m) =>
        m.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.toLowerCase().includes(q) ||
          m.language.toLowerCase().includes(q)
      );
    }
    setFilteredMovies(result);
  }, [searchQuery, selectedGenre, movies]);

  // Featured Hero movie (The Last Orbit)
  const heroMovie = movies.find((m) => m.title.includes('Last Orbit')) || movies[0];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* ── HERO BANNER (IMAX EXCLUSIVE) ── */}
      {heroMovie && (
        <section
          style={{
            position: 'relative',
            minHeight: '480px',
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(to right, rgba(8, 11, 17, 0.95) 30%, rgba(8, 11, 17, 0.7) 65%, rgba(8, 11, 17, 0.4) 100%), url(${heroMovie.poster_url || '/images/last_orbit.jpg'}) center/cover no-repeat`,
            borderBottom: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 10, padding: '60px 24px' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span className="badge badge-gold">NOW SHOWING · IMAX EXCLUSIVE</span>
                <span className="badge badge-info">U/A 13+</span>
              </div>

              <h1 style={{
                fontSize: '3.2rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                marginBottom: '16px',
                lineHeight: 1.1,
              }}>
                {heroMovie.title}
              </h1>

              <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                marginBottom: '22px',
              }}>
                {heroMovie.description ||
                  'One final mission. An infinite unknown. A breathtaking journey beyond the edge of our world.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={18} color="var(--gold)" fill="var(--gold)" />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{heroMovie.rating || '9.1'}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>/ 10</span>
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-dim)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {heroMovie.genre} · {heroMovie.duration_minutes}m · {heroMovie.language}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={() => navigate(`/movie/${heroMovie.id}`)}
                  className="btn-primary"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                >
                  Book tickets
                </button>
                <button
                  onClick={() => window.open('https://www.youtube.com', '_blank')}
                  className="btn-secondary"
                  style={{ padding: '14px 24px' }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Watch trailer</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SEARCH & GENRE FILTER BAR ── */}
      <section className="container" style={{ marginTop: '40px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '16px 20px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-primary)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            minWidth: '320px',
            flex: '1 1 300px',
          }}>
            <Search size={18} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search movies, genres or languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.92rem',
                color: 'var(--text-main)',
              }}
            />
          </div>

          {/* Genre filter buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {genres.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: active ? 600 : 500,
                    background: active ? 'var(--gold)' : 'var(--bg-surface)',
                    color: active ? '#0f172a' : 'var(--text-muted)',
                    border: active ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s',
                  }}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MOVIE GRID (NOW SHOWING) ── */}
      <section className="container" style={{ marginTop: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Now showing</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>
              {filteredMovies.length} movies playing in Bengaluru
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading movies...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '24px',
          }}>
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="glass-panel"
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  border: '1px solid var(--border-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(245, 197, 24, 0.4)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Poster Container */}
                <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
                  <img
                    src={movie.poster_url || '/images/last_orbit.jpg'}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  {/* Top badges */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '6px',
                  }}>
                    {movie.critics_choice && (
                      <span className="badge badge-gold">Critics' Choice</span>
                    )}
                    <span className="badge badge-info">{movie.format || '2D'}</span>
                  </div>

                  {/* Rating badge bottom right of poster */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(10, 14, 23, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <Star size={14} color="var(--gold)" fill="var(--gold)" />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{movie.rating}</span>
                  </div>
                </div>

                {/* Movie info */}
                <div style={{ padding: '18px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                    {movie.title}
                  </h3>
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    marginBottom: '14px',
                  }}>
                    {movie.genre} · {movie.language} · {movie.certification}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      From ₹220
                    </span>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--gold)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      Book now <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CURATED RECOMMENDATION CARDS ── */}
      <section className="container" style={{ marginTop: '60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', marginBottom: '4px' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Picked for your next movie night
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Inspired by your love of sci-fi & adventure</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
        }}>
          {/* Feature 1 */}
          <div className="glass-panel" style={{
            padding: '24px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(24, 32, 50, 0.8), rgba(15, 23, 42, 0.9))',
          }}>
            <img
              src="/images/last_orbit.jpg"
              alt="The Last Orbit"
              style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
                98% MATCH · FOR THE BIG SCREEN
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>The Last Orbit</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                A spectacular new world worth getting lost in.
              </p>
              <Link to={`/movie/${heroMovie?.id || ''}`} style={{
                color: 'var(--gold)',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                Explore showtimes →
              </Link>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel" style={{
            padding: '24px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(24, 32, 50, 0.8), rgba(15, 23, 42, 0.9))',
          }}>
            <img
              src="/images/wild_within.jpg"
              alt="The Wild Within"
              style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
              <span className="badge badge-info" style={{ marginBottom: '8px' }}>
                94% MATCH · YOUR WEEKEND ESCAPE
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>The Wild Within</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Find your next adventure, one frame at a time.
              </p>
              <Link to="/movies" style={{
                color: 'var(--info)',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                Explore showtimes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTELLIGENT SUPPORT TEASER BANNER ── */}
      <section className="container" style={{ marginTop: '60px' }}>
        <div className="glass-panel" style={{
          padding: '36px 40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(24, 32, 50, 0.9))',
          border: '1px solid rgba(139, 92, 246, 0.25)',
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', marginBottom: '8px' }}>
              <MessageSquareCheck size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI-Powered Support
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
              A great experience doesn't end at checkout.
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Our intelligent support triage system automatically analyzes inquiries, predicts issues, and connects you to the right theater department instantly.
            </p>
          </div>
          <div>
            <Link to="/support" className="btn-ai" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              Get support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
