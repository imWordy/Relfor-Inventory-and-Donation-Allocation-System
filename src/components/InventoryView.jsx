import React, { useState } from 'react';
import { Package, Search, Filter, Plus, CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function InventoryView({ resources, setResources, onOpenGuide }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Resource Form
  const [newRes, setNewRes] = useState({
    name: '',
    category: 'Food & Groceries',
    unit: 'kits',
    currentStock: 100,
    minStock: 20
  });

  const categories = ['ALL', ...new Set(resources.map(r => r.category))];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || res.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || res.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newRes.name) return;

    let status = 'AVAILABLE';
    if (Number(newRes.currentStock) === 0) status = 'OUT_OF_STOCK';
    else if (Number(newRes.currentStock) <= Number(newRes.minStock)) status = 'LOW_STOCK';

    const created = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      name: newRes.name,
      category: newRes.category,
      unit: newRes.unit,
      currentStock: Number(newRes.currentStock),
      minStock: Number(newRes.minStock),
      status: status,
      updated: new Date().toISOString().split('T')[0]
    };

    setResources([created, ...resources]);
    setShowAddModal(false);
    setNewRes({ name: '', category: 'Food & Groceries', unit: 'kits', currentStock: 100, minStock: 20 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Warehouse Inventory</h2>
            <span className="badge badge-success">Database Synchronized</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time stock balance tracking, alert thresholds, and resource classification.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onOpenGuide} className="btn btn-outline btn-sm">
            <HelpCircle size={15} /> View Guidance
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={16} /> Add New Resource Type
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-panel" style={{ padding: '18px 24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Search */}
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search resource name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '40px' }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="form-select"
        >
          <option value="ALL">All Stock Statuses</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="LOW_STOCK">LOW STOCK</option>
          <option value="OUT_OF_STOCK">OUT OF STOCK</option>
        </select>

      </div>

      {/* Inventory Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Resource Category & Name</th>
                <th>Category</th>
                <th>Available Quantity</th>
                <th>Min Alert Threshold</th>
                <th>Stock Status</th>
                <th>Last Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => {
                  let badgeClass = 'badge-success';
                  let Icon = CheckCircle;
                  if (res.status === 'LOW_STOCK') { badgeClass = 'badge-warning'; Icon = AlertTriangle; }
                  if (res.status === 'OUT_OF_STOCK') { badgeClass = 'badge-danger'; Icon = XCircle; }

                  return (
                    <tr key={res.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{res.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{res.id}</div>
                      </td>
                      <td>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                          {res.category}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1.05rem', color: res.currentStock === 0 ? '#f43f5e' : '#34d399' }}>
                          {res.currentStock.toLocaleString()} {res.unit}
                        </strong>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {res.minStock} {res.unit}
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`} style={{ gap: '5px' }}>
                          <Icon size={13} /> {res.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {res.updated}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '18px' }}>Add New Resource Category</h3>
            
            <form onSubmit={handleAddResource}>
              <div className="form-group">
                <label className="form-label">Resource Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oxygen Concentrators, Rice Bags (50kg)..."
                  value={newRes.name}
                  onChange={(e) => setNewRes({ ...newRes, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newRes.category}
                  onChange={(e) => setNewRes({ ...newRes, category: e.target.value })}
                  className="form-select"
                >
                  <option value="Food & Groceries">Food & Groceries</option>
                  <option value="Shelter & Bedding">Shelter & Bedding</option>
                  <option value="Medical & Hygiene">Medical & Hygiene</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Equipment & Supplies">Equipment & Supplies</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    placeholder="kits, pieces, kg, boxes..."
                    value={newRes.unit}
                    onChange={(e) => setNewRes({ ...newRes, unit: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newRes.currentStock}
                    onChange={(e) => setNewRes({ ...newRes, currentStock: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Stock Alert Threshold</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newRes.minStock}
                  onChange={(e) => setNewRes({ ...newRes, minStock: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
