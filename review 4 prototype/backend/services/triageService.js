/**
 * SmartTheater Automated Ticket Triage & Routing Service
 *
 * Provides an explainable, rule-based classification and triage engine
 * that evaluates incoming customer support tickets based on normalized
 * text features, intent keywords, and priority heuristics.
 *
 * Architecture Note:
 * This service is designed with a modular interface so that a trained
 * machine-learning classifier (e.g. Scikit-learn / PyTorch / Transformers)
 * can seamlessly replace or augment these rule-based heuristics in future releases.
 */

// Normalized keyword dictionaries for category matching
const CLASSIFICATION_RULES = [
  {
    category: 'Payment',
    assigned_team: 'Billing Team',
    priority: 'High',
    keywords: [
      'payment', 'upi', 'deduct', 'deducted', 'charged', 'debit', 'debited',
      'refund', 'money', 'twice', 'double', 'failed transaction', 'card',
      'netbanking', 'wallet', 'razorpay', 'bank', 'overcharged', 'receipt'
    ],
    confidenceScore: 0.984,
    explanationPattern: "Financial transaction impact detected (keywords: {matches}). Routed to Billing Team with High priority.",
  },
  {
    category: 'Booking',
    assigned_team: 'Booking Support',
    priority: 'High',
    keywords: [
      'ticket', 'tickets', 'seat', 'seats', 'booking', 'reservation',
      'not confirmed', 'missing', 'showtime', 'screen', 'theatre', 'theater',
      'timing', 'cancelled', 'reschedule', 'qr code', 'm-ticket'
    ],
    confidenceScore: 0.962,
    explanationPattern: "Reservation and seat fulfillment impact detected (keywords: {matches}). Routed to Booking Support.",
  },
  {
    category: 'Technical',
    assigned_team: 'Technical Support',
    priority: 'Medium',
    keywords: [
      'loading', 'crash', 'crashing', 'error', 'bug', 'website', 'app',
      'stuck', 'blank', 'glitch', 'slow', 'login', 'password', 'otp',
      'button', 'page', 'not working', 'server', 'timeout', 'freeze',
      'freezing', 'hangs', 'exception', 'javascript', 'browser', 'white screen'
    ],
    confidenceScore: 0.915,
    explanationPattern: "Platform or system technical difficulty detected (keywords: {matches}). Routed to Technical Support.",
  },
  {
    category: 'General',
    assigned_team: 'Customer Support',
    priority: 'Low',
    keywords: [
      'wheelchair', 'ramp', 'accessibility', 'sound', 'imax', 'popcorn',
      'snack', 'parking', 'clean', 'staff', 'help', 'question', 'info',
      'inquiry', 'feedback', 'great', 'good', 'experience'
    ],
    confidenceScore: 0.890,
    explanationPattern: "Customer hospitality or general inquiry detected (keywords: {matches}). Routed to Customer Support.",
  },
];

/**
 * Normalizes input text: lowercase, remove special characters, trim whitespace.
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Classifies ticket text and produces category, priority, assigned team, and explanation.
 *
 * @param {string} subject - The customer's ticket subject
 * @param {string} description - The detailed issue description
 * @returns {Object} Triage result with category, priority, assigned_team, confidence, explanation
 */
function classifyTicket(subject = '', description = '') {
  const combinedText = normalizeText(`${subject} ${description}`);
  const words = combinedText.split(' ');

  let bestMatch = null;
  let highestMatchCount = 0;
  let matchedKeywords = [];

  for (const rule of CLASSIFICATION_RULES) {
    const matches = [];
    for (const kw of rule.keywords) {
      if (kw.includes(' ')) {
        // Multi-word phrase check
        if (combinedText.includes(kw)) {
          matches.push(kw);
        }
      } else {
        // Single word token check
        if (words.includes(kw)) {
          matches.push(kw);
        }
      }
    }

    if (matches.length > highestMatchCount) {
      highestMatchCount = matches.length;
      bestMatch = rule;
      matchedKeywords = matches;
    }
  }

  // Priority adjustment heuristic: If urgent keywords are found, escalate priority
  const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'show starts in', 'tonight'];
  const hasUrgent = urgentKeywords.some((u) => combinedText.includes(u));

  if (bestMatch && highestMatchCount > 0) {
    let finalPriority = bestMatch.priority;
    if (hasUrgent && finalPriority !== 'High') {
      finalPriority = 'High';
    }

    const explanation = bestMatch.explanationPattern.replace(
      '{matches}',
      matchedKeywords.slice(0, 3).join(', ')
    );

    return {
      category: bestMatch.category,
      priority: finalPriority,
      assigned_team: bestMatch.assigned_team,
      confidence: bestMatch.confidenceScore,
      explanation: explanation,
    };
  }

  // Fallback for unrecognized issues
  return {
    category: 'General',
    priority: hasUrgent ? 'Medium' : 'Low',
    assigned_team: 'Customer Support',
    confidence: 0.750,
    explanation: 'No specific domain keywords identified. Routed to Customer Support general queue for manual evaluation.',
  };
}

module.exports = {
  classifyTicket,
  normalizeText,
  CLASSIFICATION_RULES,
};
