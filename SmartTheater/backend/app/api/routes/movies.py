"""Movie and show browsing routes (public, no auth required)."""

from typing import Optional, List
from datetime import datetime, date, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.db.session import get_db
from app.models.movie import Movie
from app.models.theater import Show, ShowSeat, ShowSeatStatus, Screen, Theater
from app.schemas import MovieResponse, ShowResponse, SeatResponse

router = APIRouter(prefix="/movies", tags=["Movies & Shows"])


@router.get("", response_model=List[MovieResponse])
def list_movies(
    genre: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List active movies. Supports search, genre, and language filters."""
    q = db.query(Movie).filter(Movie.is_active == True)
    if search:
        q = q.filter(Movie.title.ilike(f"%{search}%"))
    if genre:
        q = q.filter(Movie.genre.ilike(f"%{genre}%"))
    if language:
        q = q.filter(Movie.language.ilike(f"%{language}%"))
    return q.order_by(Movie.title).all()


@router.get("/{movie_id}", response_model=MovieResponse)
def get_movie(movie_id: str, db: Session = Depends(get_db)):
    """Get a single movie by ID."""
    movie = db.query(Movie).filter(Movie.id == movie_id, Movie.is_active == True).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found.")
    return movie


@router.get("/{movie_id}/shows", response_model=List[ShowResponse])
def get_shows_for_movie(
    movie_id: str,
    show_date: Optional[date] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    """
    List upcoming shows for a movie, grouped by theater.
    Optionally filter by a specific date.
    Each show includes screen + theater details.
    """
    movie = db.query(Movie).filter(Movie.id == movie_id, Movie.is_active == True).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found.")

    now = datetime.now(timezone.utc)
    q = (
        db.query(Show)
        .options(
            joinedload(Show.screen).joinedload(Screen.theater),
        )
        .filter(Show.movie_id == movie_id, Show.is_active == True, Show.show_datetime > now)
    )

    if show_date:
        from sqlalchemy import cast, Date
        q = q.filter(func.date(Show.show_datetime) == show_date)

    shows = q.order_by(Show.show_datetime).all()

    # Attach available seat count to each show
    results = []
    for show in shows:
        available_count = (
            db.query(func.count(ShowSeat.id))
            .filter(ShowSeat.show_id == show.id, ShowSeat.status == ShowSeatStatus.available)
            .scalar()
        )
        show_data = ShowResponse.model_validate(show)
        show_data.available_seats = available_count
        results.append(show_data)

    return results
