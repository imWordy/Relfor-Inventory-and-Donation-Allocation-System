import React, { useState } from 'react';
import { Gift, Plus, CheckCircle, ArrowRight, Calendar, User, ShieldCheck } from 'lucide-react';

export default function DonationView({ donations, setDonations, resources, setResources }) {
  const [showForm, setShowForm] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  const [formData, setFormData] = useState({
    donorName: '',
    resourceId: resources[0]?.id || '',
    quantity: 50,
    condition: 'NEW / SEALED',
    expiryDate: '',
    notes: ''
  });

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    if (!formData.donorName || !formData.resourceId || formData.quantity <= 0) return;

    const targetRes = resources.find(r => r.id === formData.resourceId);
    if (!targetRes) return;

    const addedQty = Number(formData.quantity);
    const prevStock = targetRes.currentStock;
    const newStock = prevStock + addedQty;

    // 1. Transactionally update inventory
    const updatedResources = resources.map(res => {
      if (res.id === formData.resourceId) {
        let newStatus = 'AVAILABLE';
        if (newStock <= res.minStock) newStatus = 'LOW_STOCK';
        return {
          ...res,
          currentStock: newStock,
          status: newStatus,
          updated: new Date().toISOString().split('T')[0]
        };
      }
      return res;
    });

    setResources(updatedResources);

    // 2. Add donation record
    const newDonation = {
      id: `DON-${Math.floor(500 + Math.random() * 500)}`,
      donorName: formData.donorName,
      resourceId: targetRes.id,
      resourceName: targetRes.name,
      quantity: addedQty,
      condition: formData.condition,
      date: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || 'N/A',
      notes: formData.notes || 'Recorded via Foundation Portal'
    };

    setDonations([newDonation, ...donations]);

    // Transactional notice
    setSuccessNotice({
      resName: targetRes.name,
      prevStock: prevStock,
      addedQty: addedQty,
      newStock: newStock
    });

    setShowForm(false);
    setFormData({
      donorName: '',
      resourceId: resources[0]?.id || '',
      quantity: 50,
      condition: 'NEW / SEALED',
      expiryDate: '',
      notes: ''
    });

    setTimeout(() => setSuccessNotice(null), 8000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Donation Management</h2>
            <span className="badge badge-success">Inventory Integrated</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Record incoming contributions from donors and automatically update live warehouse stock.
          </p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> {showForm ? 'Close Form' : '+ Record Incoming Donation'}
        </button>
      </div>

      {/* Transactional Verification Banner */}
      {successNotice && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          padding: '18px 24px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle size={30} color="#34d399" />
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
              Donation Recorded & Inventory Updated!
            </div>
            <div style={{ fontSize: '0.88rem', color: '#a7f3d0' }}>
              Resource: <strong>{successNotice.resName}</strong> &bull; Previous Stock: <strong>{successNotice.prevStock}</strong> &rarr; Added: <strong style={{ color: '#34d399' }}>+{successNotice.addedQty}</strong> &rarr; New Total Stock: <strong style={{ color: '#fff' }}>{successNotice.newStock}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Donation Form Drawer */}
      {showForm && (
        <div className="glass-panel glow-card-indigo" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift size={22} color="#818cf8" /> Record Incoming Donation
          </h3>

          <form onSubmit={handleSubmitDonation}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Donor Name / Corporate CSR Partner</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Cross India, Tata Trust, Rotary Club..."
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Resource Category</label>
                <select
                  value={formData.resourceId}
                  onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                  className="form-select"
                >
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Current Stock: {r.currentStock} {r.unit})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Donation Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Item Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="form-select"
                >
                  <option value="NEW / SEALED">NEW / SEALED</option>
                  <option value="LIKE NEW">LIKE NEW</option>
                  <option value="GOOD">GOOD</option>
                  <option value="REPAIRED">REPAIRED</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Batch Reference / Delivery Notes</label>
              <input
                type="text"
                placeholder="e.g. Pallet #B-12, Invoice #991, Direct factory dispatch..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm & Add to Inventory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Donation Audit History</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{donations.length} records logged</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Donation ID</th>
                <th>Donor Name</th>
                <th>Resource Contributed</th>
                <th>Quantity Added</th>
                <th>Condition</th>
                <th>Date Received</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((don) => (
                <tr key={don.id}>
                  <td style={{ fontFamily: 'monospace', color: '#818cf8', fontWeight: 700 }}>{don.id}</td>
                  <td style={{ fontWeight: 700, color: '#fff' }}>{don.donorName}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>{don.resourceName}</td>
                  <td>
                    <span className="badge badge-success">+{don.quantity}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{don.condition}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{don.date}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{don.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
