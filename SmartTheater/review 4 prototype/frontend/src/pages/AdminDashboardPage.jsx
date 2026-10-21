import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, Filter, AlertCircle, CheckCircle2, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketsData, statsData] = await Promise.all([
        api.getTickets(filterStatus),
        api.getTicketStats()
      ]);
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load tickets from backend database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      const updated = await api.updateTicketStatus(ticketId, newStatus);
      // update locally
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: updated.status } : t));
      // refresh stats
      api.getTicketStats().then(s => setStats(s)).catch(() => {});
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'payment': return 'badge-payment';
      case 'booking': return 'badge-booking';
      case 'technical': return 'badge-technical';
      default: return 'badge-general';
    }
  };

  const getPriorityPillClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const getStatusSelectClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'open';
      case 'in progress': return 'in-progress';
      case 'resolved': return 'resolved';
      default: return '';
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Admin Support Ticket Dashboard</h1>
          <p className="page-subtitle">
            Centralized queue of customer tickets triage-routed by the rule-based classification backend.
          </p>
        </div>

        <button 
          onClick={loadData} 
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <RefreshCw size={15} className={loading ? 'loading-spinner' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div className="dashboard-stats-grid">
          <div className="stat-card">
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tickets</div>
            </div>
            <div style={{ color: 'var(--accent-primary)' }}><Shield size={28} /></div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#60a5fa' }}>{stats.by_status.open || 0}</div>
              <div className="stat-label">Open (Needs Attention)</div>
            </div>
            <div style={{ color: '#60a5fa' }}><Clock size={28} /></div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#fcd34d' }}>{stats.by_status['in progress'] || 0}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div style={{ color: '#fcd34d' }}><RefreshCw size={28} /></div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#86efac' }}>{stats.by_status.resolved || 0}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div style={{ color: '#86efac' }}><CheckCircle2 size={28} /></div>
          </div>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          <button 
            type="button"
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Tickets
          </button>
          <button 
            type="button"
            className={`filter-tab ${filterStatus === 'Open' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Open')}
          >
            Open
          </button>
          <button 
            type="button"
            className={`filter-tab ${filterStatus === 'In Progress' ? 'active' : ''}`}
            onClick={() => setFilterStatus('In Progress')}
          >
            In Progress
          </button>
          <button 
            type="button"
            className={`filter-tab ${filterStatus === 'Resolved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Resolved')}
          >
            Resolved
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing {tickets.length} tickets
        </div>
      </div>

      {error && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Tickets Table */}
      <div className="tickets-table-container">
        {loading && tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ marginBottom: '0.5rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading SQLite ticket records...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No tickets found for filter "{filterStatus}".
          </div>
        ) : (
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject & Customer</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Assigned Team</th>
                <th>Status (Editable)</th>
                <th>Created</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => {
                const isExpanded = expandedId === ticket.id;
                const isUpdating = updatingId === ticket.id;

                return (
                  <React.Fragment key={ticket.id}>
                    <tr>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#c7d2fe' }}>
                        {ticket.ticket_reference}
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>
                          {ticket.subject}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {ticket.customer_name} • {ticket.customer_email}
                          {ticket.booking_reference && (
                            <span style={{ marginLeft: '0.4rem', color: '#a5b4fc', fontFamily: 'monospace' }}>
                              [{ticket.booking_reference}]
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={`triage-badge ${getCategoryBadgeClass(ticket.category)}`}>
                          {ticket.category}
                        </span>
                      </td>

                      <td>
                        <span className={`priority-pill ${getPriorityPillClass(ticket.priority)}`}>
                          ● {ticket.priority}
                        </span>
                      </td>

                      <td style={{ fontWeight: 600, color: '#cbd5e1' }}>
                        {ticket.assigned_team}
                      </td>

                      <td>
                        <select
                          value={ticket.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className={`status-select ${getStatusSelectClass(ticket.status)}`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {ticket.created_at ? ticket.created_at.replace('T', ' ').substring(0, 16) : 'Just now'}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                          style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}
                          title="View description & triage reasoning"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible Details Drawer */}
                    {isExpanded && (
                      <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                        <td colSpan={8} style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                            <div>
                              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>
                                Full Issue Description
                              </div>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                {ticket.description}
                              </p>
                            </div>

                            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#a5b4fc', fontWeight: 700, marginBottom: '0.3rem' }}>
                                Explainable Classification Audit
                              </div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                {ticket.triage_reason || 'Classified by keyword token engine.'}
                              </div>
                              {ticket.matched_keywords && (
                                <div style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                                  Matched Tokens: <code style={{ color: '#fcd34d' }}>{ticket.matched_keywords}</code>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Status modifications update the local SQLite database in real time. Changes persist across server restarts.
      </div>
    </div>
  );
}
