"""
Application configuration loaded from environment variables.
Uses SQLite for local development (easy to set up, no extra server needed).
"""

import os
from pathlib import Path

# Base directory of the backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    # App
    APP_NAME: str = "SmartTheater API"
    VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    # Security – change SECRET_KEY in production
    SECRET_KEY: str = os.getenv("SECRET_KEY", "smarttheater-dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24h

    # Database – SQLite for local prototype
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/smarttheater.db")

    # ML model paths
    ML_MODEL_DIR: Path = BASE_DIR / "app" / "ml" / "artifacts"
    ML_MODEL_PATH: Path = ML_MODEL_DIR / "ticket_classifier.joblib"
    ML_VECTORIZER_PATH: Path = ML_MODEL_DIR / "tfidf_vectorizer.joblib"

    # CORS – allow frontend dev server
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    # Gemini API (optional enrichment)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Simulated payment mode (always True for academic prototype)
    SIMULATED_PAYMENT: bool = True

settings = Settings()
