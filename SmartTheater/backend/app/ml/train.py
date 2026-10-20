"""
Training script for the SmartTheater ticket category classifier.

Model: TF-IDF vectorizer + Logistic Regression pipeline (scikit-learn).
Dataset: Synthetic labelled examples in app/ml/data/ticket_dataset.py.

Usage (from backend/ directory):
    python -m app.ml.train

Or from scripts/:
    python scripts/train_model.py

Outputs (saved to app/ml/artifacts/):
    ticket_classifier.joblib   – trained Logistic Regression model
    tfidf_vectorizer.joblib    – fitted TF-IDF vectorizer
    label_encoder.joblib       – label encoder for category strings
    training_report.txt        – classification report from held-out test set
"""

import sys
import os
from pathlib import Path

# Allow running as a script from any directory
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.pipeline import Pipeline

from app.ml.data.ticket_dataset import DATASET
from app.ml.preprocessing import preprocess_text
from app.core.config import settings


def train():
    """
    Train the ticket category classifier.

    Steps:
    1. Load and preprocess the labelled dataset.
    2. Split into stratified train/test sets.
    3. Fit TF-IDF vectorizer on training text.
    4. Fit Logistic Regression on TF-IDF features.
    5. Evaluate on held-out test set.
    6. Save vectorizer, model, and label encoder to artifacts/.
    7. Write classification report to training_report.txt.
    """
    print("=" * 60)
    print("SmartTheater — Ticket Category Classifier Training")
    print("=" * 60)
    print(f"Dataset size: {len(DATASET)} examples")

    # ── 1. Prepare data ──────────────────────────────────────────
    texts = [preprocess_text(d["text"]) for d in DATASET]
    labels = [d["label"] for d in DATASET]

    # Label encoding
    le = LabelEncoder()
    y = le.fit_transform(labels)

    print(f"Categories ({len(le.classes_)}): {list(le.classes_)}")
    for cls in le.classes_:
        count = labels.count(cls)
        print(f"  {cls}: {count} examples")

    # ── 2. Train/test split (stratified, reproducible) ───────────
    # Note: With 90 examples (15 per class) this is a small dataset.
    # Reported metrics should be interpreted with this limitation in mind.
    X_train, X_test, y_train, y_test = train_test_split(
        texts, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\nTrain: {len(X_train)} | Test: {len(X_test)}")

    # ── 3. Build scikit-learn pipeline ───────────────────────────
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),          # unigrams + bigrams
            max_features=5000,
            sublinear_tf=True,           # log scaling of term frequencies
            min_df=1,                    # keep rare terms (small dataset)
        )),
        ("clf", LogisticRegression(
            max_iter=1000,
            random_state=42,
            class_weight="balanced",     # handle any class imbalance
            C=1.0,
        )),
    ])

    # ── 4. Cross-validation (gives a more reliable estimate for small datasets) ──
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(pipeline, texts, y, cv=skf, scoring="accuracy")
    print(f"\n5-Fold CV Accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
    print(f"Fold scores: {[f'{s:.3f}' for s in cv_scores]}")

    # ── 5. Fit on full training set, evaluate on test set ────────
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    test_accuracy = accuracy_score(y_test, y_pred)
    print(f"\nHeld-out test accuracy: {test_accuracy:.3f}")
    print("\nClassification Report:")
    report = classification_report(y_test, y_pred, target_names=le.classes_)
    print(report)

    print("Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)

    # ── 6. Save artifacts ────────────────────────────────────────
    artifacts_dir = settings.ML_MODEL_DIR
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    # Save the full pipeline (vectorizer + model together)
    pipeline_path = artifacts_dir / "ticket_classifier_pipeline.joblib"
    joblib.dump(pipeline, pipeline_path)

    # Also save vectorizer and model separately for inspection
    vectorizer_path = artifacts_dir / "tfidf_vectorizer.joblib"
    model_path = artifacts_dir / "ticket_classifier.joblib"
    le_path = artifacts_dir / "label_encoder.joblib"

    joblib.dump(pipeline.named_steps["tfidf"], vectorizer_path)
    joblib.dump(pipeline.named_steps["clf"], model_path)
    joblib.dump(le, le_path)

    print(f"\nArtifacts saved to: {artifacts_dir}")
    print(f"  Pipeline: {pipeline_path.name}")
    print(f"  Vectorizer: {vectorizer_path.name}")
    print(f"  Model: {model_path.name}")
    print(f"  Label encoder: {le_path.name}")

    # ── 7. Write training report ──────────────────────────────────
    report_path = artifacts_dir / "training_report.txt"
    with open(report_path, "w") as f:
        f.write("SmartTheater — Ticket Category Classifier — Training Report\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Dataset: Synthetic demonstration data\n")
        f.write(f"Total examples: {len(DATASET)}\n")
        f.write(f"Categories: {list(le.classes_)}\n\n")
        f.write(f"Split: 80% train ({len(X_train)}), 20% test ({len(X_test)})\n")
        f.write(f"Random seed: 42 (reproducible)\n\n")
        f.write(f"5-Fold CV Accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}\n")
        f.write(f"Held-out Test Accuracy: {test_accuracy:.3f}\n\n")
        f.write("Classification Report (Test Set):\n")
        f.write(report + "\n")
        f.write("Confusion Matrix (Test Set):\n")
        f.write(str(cm) + "\n\n")
        f.write("LIMITATION NOTE:\n")
        f.write("This model was trained on a small synthetic dataset (90 examples).\n")
        f.write("Reported metrics should be interpreted with this limitation in mind.\n")
        f.write("Performance on real, diverse customer tickets may differ.\n")

    print(f"\nTraining report: {report_path}")
    print("\nTraining complete.")
    return test_accuracy


if __name__ == "__main__":
    train()
