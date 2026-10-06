import React, { useState } from 'react';
import { Truck, Plus, CheckCircle2, UserCheck, Calendar, FileText } from 'lucide-react';

export default function DistributionView({ distributions, setDistributions, requests }) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    reqId: requests[0]?.id || '',
    receivedBy: '',
    distDate: new Date().toISOString().split('T')[0],
    notes: 'Handed over at foundation hub'
  });

  const handleRecordDistribution = (e) => {
    e.preventDefault();
    const targetReq = requests.find(r => r.id === formData.reqId);
    if (!targetReq || !formData.receivedBy) return;

    const firstItem = targetReq.items[0];

    const newDist = {
      id: `DIST-${Math.floor(300 + Math.random() * 500)}`,
      allocationId: `ALLOC-${Math.floor(800 + Math.random() * 100)}`,
      reqId: targetReq.id,
      orgName: targetReq.orgName,
      resourceName: firstItem ? firstItem.resourceName : 'Relief Resources',
      quantity: firstItem ? firstItem.allocatedQty || firstItem.requestedQty : 50,
      distDate: formData.distDate,
      receivedBy: formData.receivedBy,
      status: 'COMPLETED'
    };

    setDistributions([newDist, ...distributions]);
    setShowForm(false);
    setFormData({ reqId: requests[0]?.id || '', receivedBy: '', distDate: new Date().toISOString().split('T')[0], notes: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Distribution Management</h2>
            <span className="badge badge-success">{distributions.length} Handovers Completed</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Record physical handover of allocated resources with NGO representative signature receipts.
          </p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> {showForm ? 'Close Form' : '+ Record Resource Handover'}
        </button>
      </div>

      {/* Handover Form */}
      {showForm && (
        <div className="glass-panel glow-card-cyan" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck size={22} color="#06b6d4" /> Record Distribution Handover
          </h3>

          <form onSubmit={handleRecordDistribution}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Allocated Request</label>
                <select
                  value={formData.reqId}
                  onChange={(e) => setFormData({ ...formData, reqId: e.target.value })}
                  className="form-select"
                >
                  {requests.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.id} — {r.orgName} ({r.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Received By (NGO Representative Signature Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma (Director)"
                  value={formData.receivedBy}
                  onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Handover Date</label>
                <input
                  type="date"
                  required
                  value={formData.distDate}
                  onChange={(e) => setFormData({ ...formData, distDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dispatch Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Truck #MH-12-AB-9901, Receipt Verification Signed"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Distribution Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Distribution Log Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Completed Distribution Log</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{distributions.length} handovers logged</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Distribution ID</th>
                <th>Request & Organization</th>
                <th>Distributed Resource</th>
                <th>Quantity</th>
                <th>Received By</th>
                <th>Handover Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'monospace', color: '#06b6d4', fontWeight: 700 }}>{d.id}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{d.orgName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.reqId}</div>
                  </td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>{d.resourceName}</td>
                  <td><strong style={{ color: '#fff' }}>{d.quantity}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.receivedBy}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{d.distDate}</td>
                  <td>
                    <span className="badge badge-success">{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
