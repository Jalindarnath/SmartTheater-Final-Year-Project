"""
SmartTheater FastAPI application entry point.

Startup sequence:
1. Create all database tables (SQLite auto-creates the file).
2. Load the ML model from artifacts/.
3. Register all API routers.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
import os

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base  # noqa – imports all models so metadata is populated
from app.api.routes import auth, movies, shows, bookings, support_tickets, analytics
from app.ml import predict as ml_predict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Create FastAPI app ────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description=(
        "SmartTheater: Intelligent Movie Booking and Automated Support Ticket "
        "Triage and Routing System. Final-year Computer Engineering project."
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Startup: DB + ML ──────────────────────────────────────────────────────────
@app.on_event("startup")
def startup():
    # Create all tables (SQLite creates the file on first run)
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database ready.")

    # Load ML model
    loaded = ml_predict.load_model()
    if loaded:
        logger.info("ML model loaded successfully.")
    else:
        logger.warning(
            "ML model not found. Run 'python -m app.ml.train' to train the model. "
            "Ticket submission will work but predictions will be unavailable."
        )


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api")
app.include_router(movies.router, prefix="/api")
app.include_router(shows.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(support_tickets.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "ml_model_loaded": ml_predict.is_model_loaded(),
        "simulated_payment": settings.SIMULATED_PAYMENT,
    }
