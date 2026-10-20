import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Search, Star, Play, Sparkles, SlidersHorizontal, ArrowRight, ArrowUpRight, Headphones } from 'lucide-react';

const FALLBACK_MOVIES = [
  {
    id: '3d84797a-4668-4795-93fe-5cd3c8a701ef',
    title: 'The Last Orbit',
    genre: 'Sci-fi',
    language: 'English',
    certification: 'U/A 13+',
    duration_minutes: 138,
    rating: 9.1,
    tag: 'IMAX',
    poster_url: '/images/last_orbit.jpg',
    description: 'One final mission. An infinite unknown. A breathtaking journey beyond the edge of our world.',
  },
  {
    id: '0d046d4c-69e9-4d72-b368-4a74d2756f53',
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
    id: 'a689c094-66b6-44f6-93bd-24d058bb2908',
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
    id: '9901cad8-4eac-4f2f-8fb4-3842a5628568',
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

export default function HomePage() {
  const [movies, setMovies] = useState(FALLBACK_MOVIES);
  const [filteredMovies, setFilteredMovies] = useState(FALLBACK_MOVIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All movies');
  const navigate = useNavigate();

  const genres = ['All movies', 'Sci-fi', 'Action', 'Drama', 'Adventure'];

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await api.getMovies();
        if (data && data.length > 0) {
          // Merge with fallback visual metadata if needed
          const merged = data.map((item) => {
            const fallback = FALLBACK_MOVIES.find((f) => f.title === item.title) || {};
            return {
              ...fallback,
              ...item,
              poster_url: item.poster_url || fallback.poster_url,
              tag: fallback.tag || 'Now Showing',
              certification: fallback.certification || 'U/A 13+',
            };
          });
          setMovies(merged);
          setFilteredMovies(merged);
        }
      } catch (err) {
        console.warn('Backend movies offline, rendering verified prototype data:', err);
      }
    }
    fetchMovies();
  }, []);

  // Filter handler
  useEffect(() => {
    let result = movies;
    if (selectedGenre !== 'All movies') {
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

  const heroMovie = movies.find((m) => m.title.includes('Last Orbit')) || movies[0];

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* ── 01 BOOKING JOURNEY HERO BANNER (Exact Figma match) ── */}
      <div className="container" style={{ marginTop: '24px' }}>
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'var(--bg-hero)',
          backgroundImage: `linear-gradient(to right, rgba(14, 23, 42, 0.96) 35%, rgba(14, 23, 42, 0.75) 65%, rgba(14, 23, 42, 0.45) 100%), url(${heroMovie?.poster_url || '/images/last_orbit.jpg'})`,
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          padding: '50px 48px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ maxWidth: '620px', position: 'relative', zIndex: 2 }}>
            {/* Top Tag Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{
                background: '#134e4a',
                color: '#5eead4',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
              }}>
                NOW SHOWING · IMAX EXCLUSIVE
              </span>
            </div>

            {/* Movie Title */}
            <h1 style={{
              fontSize: '3.6rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: 1.08,
            }}>
              {heroMovie?.title || 'The Last Orbit'}
            </h1>

            {/* Subtitle */}
            <p style={{
              color: '#cbd5e1',
              fontSize: '1.05rem',
              lineHeight: 1.55,
              marginBottom: '22px',
            }}>
              {heroMovie?.description ||
                'One final mission. An infinite unknown. A breathtaking journey beyond the edge of our world.'}
            </p>

            {/* Meta Row: Rating, Format, Cert */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffffff' }}>
                <Star size={16} fill="#ffffff" color="#ffffff" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>9.1 / 10</span>
              </div>
              <span style={{ color: '#64748b' }}>·</span>
              <span style={{ color: '#e2e8f0', fontSize: '0.92rem' }}>
                {heroMovie?.genre} · 2h 18m · {heroMovie?.language}
              </span>
              <span style={{
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
              }}>
                U/A 13+
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => navigate(`/movie/${heroMovie?.id}`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1.5px solid rgba(255, 255, 255, 0.45)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 24px',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#ffffff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ArrowRight size={16} />
                <span>Book tickets</span>
              </button>

              <button
                onClick={() => window.open('https://www.youtube.com', '_blank')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#0f172a',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 22px',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <Play size={15} fill="#0f172a" />
                <span>Watch trailer</span>
              </button>
            </div>
          </div>

          {/* Carousel dots in bottom right */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ width: '22px', height: '6px', borderRadius: '4px', background: 'var(--teal-primary)' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.6)' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.6)' }} />
          </div>
        </div>
      </div>

      {/* ── SEARCH & GENRE FILTER BAR (Exact PDF Card) ── */}
      <div className="container" style={{ marginTop: '28px' }}>
        <div className="card" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '12px 16px',
        }}>
          {/* Search Input Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: '1 1 280px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
          }}>
            <Search size={17} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search movies, genres or languages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.9rem',
                width: '100%',
                color: 'var(--text-main)',
              }}
            />
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              border: '1px solid var(--border-medium)',
              borderRadius: '4px',
              padding: '2px 5px',
              fontWeight: 500,
            }}>
              ⌘ K
            </span>
          </div>

          {/* Genre Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {genres.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.86rem',
                    fontWeight: active ? 600 : 500,
                    background: active ? 'var(--btn-navy-bg)' : 'transparent',
                    color: active ? 'var(--btn-navy-text)' : 'var(--text-muted)',
                    border: active ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s',
                  }}
                >
                  {genre}
                </button>
              );
            })}

            {/* Filter icon button */}
            <button
              title="Advanced Filters"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              <SlidersHorizontal size={16} />
            </button>

            {/* Navy Search Button */}
            <button
              onClick={() => {}}
              className="btn-navy"
              style={{ padding: '8px 18px', fontSize: '0.88rem' }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── NOW SHOWING SECTION (4 Column Grid from PDF) ── */}
      <div className="container" style={{ marginTop: '36px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Now showing</h2>
            <span style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
            }}>
              {filteredMovies.length} movies
            </span>
          </div>

          <button
            onClick={() => {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--teal-primary)',
            }}
          >
            <span>View all movies</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {/* Poster Container */}
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                aspectRatio: '1 / 1.05',
                background: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '12px',
              }}>
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Top-Left Tag Pill (e.g. IMAX, Critics' choice, Dolby Atmos, Family favorite) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                }}>
                  {movie.tag}
                </div>

                {/* Top-Right Rating Pill (e.g. ★ 9.1) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Star size={12} fill="#eab308" color="#eab308" />
                  <span>{movie.rating}</span>
                </div>
              </div>

              {/* Title & Subtitle below card */}
              <h3 style={{
                fontSize: '1.08rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '4px',
              }}>
                {movie.title}
              </h3>
              <p style={{
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
              }}>
                {movie.genre} · {movie.language} · {movie.certification}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PICKED FOR YOUR NEXT MOVIE NIGHT (Exact Prototype Layout) ── */}
      <div className="container" style={{ marginTop: '54px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--teal-primary)" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              Picked for your next movie night
            </h2>
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Inspired by your love of sci-fi & adventure
          </span>
        </div>

        {/* 2 Wide Recommendation Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '24px',
        }}>
          {/* Recommendation 1: The Last Orbit */}
          <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
          }}>
            <img
              src="/images/last_orbit.jpg"
              alt="The Last Orbit"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                color: 'var(--teal-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '4px',
              }}>
                98% MATCH · FOR THE BIG SCREEN
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '4px' }}>
                The Last Orbit
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                A spectacular new world worth getting lost in.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => navigate('/movie/3d84797a-4668-4795-93fe-5cd3c8a701ef')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Explore showtimes</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/movie/3d84797a-4668-4795-93fe-5cd3c8a701ef')}
                  className="btn-navy"
                  style={{ padding: '7px 16px', fontSize: '0.84rem' }}
                >
                  Book now · From ₹220
                </button>
              </div>
            </div>
          </div>

          {/* Recommendation 2: The Wild Within */}
          <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
          }}>
            <img
              src="/images/wild_within.jpg"
              alt="The Wild Within"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                color: 'var(--teal-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '4px',
              }}>
                94% MATCH · YOUR WEEKEND ESCAPE
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '4px' }}>
                The Wild Within
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Find your next adventure, one frame at a time.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => navigate('/movie/9901cad8-4eac-4f2f-8fb4-3842a5628568')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Explore showtimes</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/movie/9901cad8-4eac-4f2f-8fb4-3842a5628568')}
                  className="btn-outline"
                  style={{ padding: '7px 16px', fontSize: '0.84rem' }}
                >
                  View details · From ₹200
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUPPORT PROMO BANNER (Exact PDF banner at bottom) ── */}
      <div className="container" style={{ marginTop: '36px' }}>
        <div className="card" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--teal-soft)',
              color: 'var(--teal-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Headphones size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '3px' }}>
                A great experience doesn't end at checkout.
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Our intelligent support team is here for bookings, payments and everything in between.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/support')}
            className="btn-navy"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            <ArrowUpRight size={16} />
            <span>Get support</span>
          </button>
        </div>
      </div>
    </div>
  );
}
