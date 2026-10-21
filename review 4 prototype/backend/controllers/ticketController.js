const db = require('../database/db');
const triageService = require('../services/triageService');

// Generate unique reference e.g. ST-1049, ST-1050, etc.
function generateTicketReference() {
  const stmt = db.prepare('SELECT reference FROM tickets');
  const all = stmt.all();
  let maxNum = 1048;
  all.forEach((r) => {
    if (r.reference && r.reference.startsWith('ST-')) {
      const n = parseInt(r.reference.replace('ST-', ''), 10);
      if (!isNaN(n) && n > maxNum) {
        maxNum = n;
      }
    }
  });
  return `ST-${maxNum + 1}`;
}

exports.createTicket = (req, res) => {
  try {
    const { subject, description, booking_ref, customer_name, customer_email } = req.body;

    // Field validation
    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: 'Ticket subject is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Issue description is required.' });
    }

    // Automated Triage & Routing
    const triageResult = triageService.classifyTicket(subject, description);

    const ticketId = `ticket-${Date.now()}`;
    const reference = generateTicketReference();
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const insertStmt = db.prepare(`
      INSERT INTO tickets (
        id, reference, booking_ref, customer_name, customer_email,
        subject, description, category, priority, assigned_team,
        status, confidence, explanation, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      ticketId,
      reference,
      booking_ref ? booking_ref.trim() : null,
      customer_name ? customer_name.trim() : 'Arjun Shah',
      customer_email ? customer_email.trim() : 'arjun.shah@gmail.com',
      subject.trim(),
      description.trim(),
      triageResult.category,
      triageResult.priority,
      triageResult.assigned_team,
      'Open',
      triageResult.confidence,
      triageResult.explanation,
      nowStr,
      nowStr
    );

    const createdTicket = {
      id: ticketId,
      reference,
      ticket_reference: reference,
      booking_ref: booking_ref ? booking_ref.trim() : null,
      booking_reference: booking_ref ? booking_ref.trim() : null,
      customer_name: customer_name ? customer_name.trim() : 'Arjun Shah',
      customer_email: customer_email ? customer_email.trim() : 'arjun.shah@gmail.com',
      subject: subject.trim(),
      description: description.trim(),
      category: triageResult.category,
      priority: triageResult.priority,
      assigned_team: triageResult.assigned_team,
      status: 'Open',
      confidence: triageResult.confidence,
      confidence_score: triageResult.confidence,
      explanation: triageResult.explanation,
      triage_reason: triageResult.explanation,
      created_at: nowStr,
      updated_at: nowStr,
    };

    res.status(201).json({
      message: 'Ticket triaged and routed successfully.',
      ticket: createdTicket,
      ...createdTicket
    });
  } catch (error) {
    console.error('Error submitting support ticket:', error);
    res.status(500).json({ error: 'Failed to submit and triage ticket.' });
  }
};

exports.getAllTickets = (req, res) => {
  try {
    const { status, category, priority } = req.query;

    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND LOWER(status) = LOWER(?)';
      params.push(status);
    }
    if (category && category !== 'all') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }
    if (priority && priority !== 'all') {
      query += ' AND LOWER(priority) = LOWER(?)';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const tickets = stmt.all(...params).map(t => ({
      ...t,
      ticket_reference: t.reference,
      booking_reference: t.booking_ref,
      confidence_score: t.confidence,
      triage_reason: t.explanation,
    }));

    res.json(tickets);
  } catch (error) {
    console.error('Error retrieving tickets:', error);
    res.status(500).json({ error: 'Failed to retrieve tickets.' });
  }
};

exports.updateTicketStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Open', 'In Progress', 'Resolved'];
    const matched = validStatuses.find((s) => s.toLowerCase() === (status || '').toLowerCase());

    if (!matched) {
      return res.status(400).json({
        error: `Invalid status. Permitted values: ${validStatuses.join(', ')}`,
      });
    }

    const checkStmt = db.prepare('SELECT * FROM tickets WHERE id = ? OR reference = ?');
    const existing = checkStmt.get(id, id);

    if (!existing) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const updateStmt = db.prepare(`
      UPDATE tickets
      SET status = ?, updated_at = ?
      WHERE id = ? OR reference = ?
    `);
    updateStmt.run(matched, nowStr, id, id);

    const updatedStmt = db.prepare('SELECT * FROM tickets WHERE id = ? OR reference = ?');
    const rawUpdated = updatedStmt.get(id, id);
    const updated = {
      ...rawUpdated,
      ticket_reference: rawUpdated.reference,
      booking_reference: rawUpdated.booking_ref,
      confidence_score: rawUpdated.confidence,
      triage_reason: rawUpdated.explanation,
    };

    res.json(updated);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status.' });
  }
};

exports.getTicketStats = (req, res) => {
  try {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM tickets');
    const total = totalStmt.get().count;

    const statusStmt = db.prepare('SELECT status, COUNT(*) as count FROM tickets GROUP BY status');
    const statusRows = statusStmt.all();
    const by_status = { open: 0, 'in progress': 0, resolved: 0 };
    statusRows.forEach((r) => {
      by_status[r.status.toLowerCase()] = r.count;
    });

    const categoryStmt = db.prepare('SELECT category, COUNT(*) as count FROM tickets GROUP BY category');
    const categoryRows = categoryStmt.all();
    const by_category = {};
    categoryRows.forEach((r) => {
      by_category[r.category.toLowerCase()] = r.count;
    });

    res.json({
      total,
      by_status,
      by_category,
    });
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    res.status(500).json({ error: 'Failed to retrieve ticket statistics.' });
  }
};

