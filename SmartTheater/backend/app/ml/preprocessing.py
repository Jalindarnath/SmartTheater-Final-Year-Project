"""
Text preprocessing for support ticket classification.

Normalizes ticket descriptions before TF-IDF vectorization.
Keeps preprocessing consistent between training and inference.
"""

import re
import string


def preprocess_text(text: str) -> str:
    """
    Normalize a support ticket description.

    Steps:
    1. Lowercase.
    2. Remove ticket/booking reference codes (e.g., ST-261016-0842) to avoid
       the model overfitting to reference numbers.
    3. Remove punctuation (preserve spaces).
    4. Collapse multiple whitespace into single space.
    5. Strip leading/trailing whitespace.

    Returns:
        Cleaned string ready for TF-IDF vectorization.
    """
    if not text:
        return ""

    # Lowercase
    text = text.lower()

    # Remove booking/ticket references (e.g., ST-261016-0842, TR-48291)
    text = re.sub(r'\b[a-z]{1,3}-\d{4,}\b', '', text)
    text = re.sub(r'\b[a-z]{1,3}-\d{2,}-\d{2,}\b', '', text)

    # Remove currency symbols and amounts (₹640, ₹687.20)
    text = re.sub(r'[₹$€£]\s*\d+[\d.,]*', 'amount', text)

    # Remove URLs
    text = re.sub(r'https?://\S+', '', text)

    # Remove punctuation except apostrophes (keeps "don't", "I'm")
    text = text.translate(str.maketrans(string.punctuation.replace("'", ""), ' ' * (len(string.punctuation) - 1)))

    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    return text
