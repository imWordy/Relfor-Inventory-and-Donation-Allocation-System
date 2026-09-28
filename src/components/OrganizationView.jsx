import React, { useState } from 'react';
import { Building2, Plus, Search, Mail, Phone, MapPin, User, CheckCircle } from 'lucide-react';

export default function OrganizationView({ organizations, setOrganizations }) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newOrg, setNewOrg] = useState({
    name: '',
    type: 'NGO',
    contactPerson: '',
    phone: '',
    email: '',
    city: ''
  });

  const filtered = organizations.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (!newOrg.name || !newOrg.contactPerson) return;

    const created = {
      id: `ORG-0${organizations.length + 1}`,
      name: newOrg.name,
      type: newOrg.type,
      contactPerson: newOrg.contactPerson,
      phone: newOrg.phone || '+91 90000 00000',
      email: newOrg.email || 'contact@org.org',
      city: newOrg.city || 'Mumbai',
      activeRequests: 0
    };

    setOrganizations([created, ...organizations]);
    setShowAddModal(false);
    setNewOrg({ name: '', type: 'NGO', contactPerson: '', phone: '', email: '', city: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Partner Organizations</h2>
            <span className="badge badge-info">{organizations.length} Active Partners</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Verified beneficiary NGOs, community welfare trusts, and relief alliance centers.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Register New Organization
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Filter organizations by name, contact person, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ width: '100%' }}
        />
      </div>

      {/* Grid */}
      <div className="grid-cols-2">
        {filtered.map((org) => (
          <div key={org.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>{org.name}</h3>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#818cf8', fontWeight: 600 }}>{org.id}</span>
                </div>
                <span className="badge badge-info">{org.type}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={15} color="#34d399" /> <span>Representative: <strong style={{ color: '#fff' }}>{org.contactPerson}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={15} color="var(--text-muted)" /> <span>{org.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={15} color="var(--text-muted)" /> <span>{org.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={15} color="var(--text-muted)" /> <span>City: {org.city}</span>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Active Needs: <strong style={{ color: org.activeRequests > 0 ? '#fbbf24' : '#94a3b8' }}>{org.activeRequests} Requests</strong>
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>VERIFIED PARTNER</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Org Modal */}
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '18px' }}>Register Partner Organization</h3>

            <form onSubmit={handleCreateOrg}>
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Life Care Welfare Foundation..."
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organization Type</label>
                <select
                  value={newOrg.type}
                  onChange={(e) => setNewOrg({ ...newOrg, type: e.target.value })}
                  className="form-select"
                >
                  <option value="NGO">Registered NGO</option>
                  <option value="FIELD_PARTNER">Field Partner / Relief Alliance</option>
                  <option value="COMMUNITY_CENTER">Community Welfare Center</option>
                  <option value="GOVT_SHELTER">Government Relief Shelter</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="Full name of representative"
                  value={newOrg.contactPerson}
                  onChange={(e) => setNewOrg({ ...newOrg, contactPerson: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newOrg.phone}
                    onChange={(e) => setNewOrg({ ...newOrg, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={newOrg.city}
                    onChange={(e) => setNewOrg({ ...newOrg, city: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="contact@orgname.org"
                  value={newOrg.email}
                  onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
