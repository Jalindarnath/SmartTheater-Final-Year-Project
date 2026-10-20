"""
Movie model — stores movie catalog information.
Posters stored as URL strings (local path or external URL).
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    genre = Column(String(100), nullable=True)           # e.g., "Sci-fi, Adventure"
    language = Column(String(50), nullable=False, default="English")
    duration_minutes = Column(Integer, nullable=False)   # runtime in minutes
    rating = Column(Float, nullable=True)                # audience rating out of 10
    rating_count = Column(Integer, nullable=True, default=0)
    certification = Column(String(20), nullable=True)    # e.g., "U/A 13+"
    director = Column(String(150), nullable=True)
    cast = Column(String(500), nullable=True)            # comma-separated lead actors
    format = Column(String(50), nullable=True)           # IMAX 2D | Dolby Atmos | 2D
    poster_url = Column(String(500), nullable=True)      # relative path or URL
    trailer_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    critics_choice = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    shows = relationship("Show", back_populates="movie", lazy="dynamic")
