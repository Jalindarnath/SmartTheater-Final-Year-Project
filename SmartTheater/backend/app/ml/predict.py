"""
ML inference module for ticket category prediction.

Loads the trained TF-IDF + Logistic Regression pipeline and provides a
predict() function used by the ticket submission API.

Key design decisions:
- The pipeline is loaded once at startup (module-level singleton).
- predict() returns the category string, confidence, and model metadata.
- If the model file is missing, a ModelNotLoadedError is raised rather than
  silently returning a random or hardcoded category.
- predict_proba() is used for confidence scores. Because Logistic Regression
  with the default solver does NOT produce perfectly calibrated probabilities,
  we label them as "model confidence" rather than "probability".
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional
from pathlib import Path

import joblib
import numpy as np

from app.ml.preprocessing import preprocess_text
from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Model state ───────────────────────────────────────────────────────────────
_pipeline = None          # sklearn Pipeline (tfidf + clf)
_label_encoder = None     # LabelEncoder for category names
_model_loaded = False
_load_error: Optional[str] = None


class ModelNotLoadedError(RuntimeError):
    """Raised when the ML model has not been trained or cannot be found."""
    pass


def load_model() -> bool:
    """
    Load the trained pipeline and label encoder from the artifacts directory.

    Returns True if loading succeeded, False otherwise.
    Call this once at application startup.
    """
    global _pipeline, _label_encoder, _model_loaded, _load_error

    pipeline_path = settings.ML_MODEL_DIR / "ticket_classifier_pipeline.joblib"
    le_path = settings.ML_MODEL_DIR / "label_encoder.joblib"

    if not pipeline_path.exists():
        _load_error = (
            f"Model file not found: {pipeline_path}. "
            "Run 'python -m app.ml.train' to train the model first."
        )
        logger.warning(_load_error)
        _model_loaded = False
        return False

    if not le_path.exists():
        _load_error = f"Label encoder not found: {le_path}."
        logger.warning(_load_error)
        _model_loaded = False
        return False

    try:
        _pipeline = joblib.load(pipeline_path)
        _label_encoder = joblib.load(le_path)
        _model_loaded = True
        _load_error = None
        logger.info("ML model loaded successfully from %s", pipeline_path)
        return True
    except Exception as exc:
        _load_error = f"Failed to load model: {exc}"
        logger.error(_load_error)
        _model_loaded = False
        return False


@dataclass
class PredictionResult:
    category: str           # e.g., "Payment"
    confidence: float       # 0.0 – 1.0 (model confidence, not calibrated probability)
    all_scores: dict        # {category: score} for all categories
    model_loaded: bool      # whether a real model was used
    fallback_used: bool     # True if model was unavailable and rule-based fallback was used


def predict(text: str) -> PredictionResult:
    """
    Predict the category for a support ticket description.

    Args:
        text: Raw ticket description (preprocessing applied internally).

    Returns:
        PredictionResult with category, confidence, and metadata.

    Raises:
        ModelNotLoadedError: If the model is not loaded and no fallback applies.
    """
    if not _model_loaded:
        if _load_error:
            raise ModelNotLoadedError(_load_error)
        raise ModelNotLoadedError("ML model not loaded. Call load_model() at startup.")

    # Preprocess consistently with training
    clean_text = preprocess_text(text)

    if not clean_text:
        # Empty text after preprocessing — return lowest confidence prediction
        return PredictionResult(
            category="Technical Issues",
            confidence=0.0,
            all_scores={},
            model_loaded=True,
            fallback_used=True,
        )

    # Run pipeline (vectorize + predict)
    proba = _pipeline.predict_proba([clean_text])[0]
    predicted_index = int(np.argmax(proba))
    category = _label_encoder.inverse_transform([predicted_index])[0]
    confidence = float(proba[predicted_index])

    # Build scores dict for all categories
    all_scores = {
        _label_encoder.inverse_transform([i])[0]: float(p)
        for i, p in enumerate(proba)
    }

    return PredictionResult(
        category=category,
        confidence=round(confidence, 4),
        all_scores=all_scores,
        model_loaded=True,
        fallback_used=False,
    )


def is_model_loaded() -> bool:
    return _model_loaded


def get_load_error() -> Optional[str]:
    return _load_error
