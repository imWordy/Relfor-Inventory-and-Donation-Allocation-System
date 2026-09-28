import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, AlertCircle, CheckCircle2, Clock, ShieldAlert, Filter, Sparkles } from 'lucide-react';

export default function RequestView({ requests, setRequests, organizations, resources, currentUser }) {
  const isNGO = currentUser.role === 'NGO';
  const myOrgId = currentUser.organizationId || 'ORG-01';
  const myOrgName = currentUser.organizationName || 'Hope Children Shelter';

  const [showForm, setShowForm] = useState(false);
  const [filterMode, setFilterMode] = useState(isNGO ? 'MY_NGO' : 'ALL');

  // Form State
  const [selectedOrgId, setSelectedOrgId] = useState(isNGO ? myOrgId : (organizations[0]?.id || ''));
  const [priority, setPriority] = useState('HIGH');
  const [notes, setNotes] = useState('');
  const [requestItems, setRequestItems] = useState([
    { resourceId: resources[0]?.id || '', requestedQty: 50 }
  ]);

  const handleAddItemRow = () => {
    setRequestItems([...requestItems, { resourceId: resources[0]?.id || '', requestedQty: 25 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (requestItems.length === 1) return;
    setRequestItems(requestItems.filter((_, i) => i !== index));
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const targetOrgId = isNGO ? myOrgId : selectedOrgId;
    const org = organizations.find(o => o.id === targetOrgId) || { id: myOrgId, name: myOrgName };
    if (requestItems.length === 0) return;

    const formattedItems = requestItems.map(item => {
      const res = resources.find(r => r.id === item.resourceId);
      return {
        resourceId: item.resourceId,
        resourceName: res ? res.name : 'Resource Item',
        requestedQty: Number(item.requestedQty),
        allocatedQty: 0
      };
    });

    const createdReq = {
      id: `REQ-${Math.floor(900 + Math.random() * 99)}`,
      orgId: org.id,
      orgName: org.name,
      priority: priority,
      status: 'PENDING',
      createdDate: new Date().toISOString().split('T')[0],
      notes: notes || 'Standard relief requirement request',
      items: formattedItems
    };

    setRequests([createdReq, ...requests]);
    setShowForm(false);
    setRequestItems([{ resourceId: resources[0]?.id || '', requestedQty: 50 }]);
    setNotes('');
  };

  const displayedRequests = requests.filter(req => {
    if (filterMode === 'MY_NGO') {
      return req.orgId === myOrgId || req.orgName === myOrgName;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>
              {isNGO ? `Need Requests for ${myOrgName}` : 'Beneficiary Requirement Requests'}
            </h2>
            <span className="badge badge-info">{displayedRequests.length} Requests Listed</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isNGO 
              ? `Submit and monitor resource requests submitted by ${myOrgName} for relief supplies.` 
              : 'Beneficiary NGO resource requirements enqueued for allocation solver runs.'
            }
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isNGO && (
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => setFilterMode('MY_NGO')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: filterMode === 'MY_NGO' ? 'var(--primary)' : 'transparent',
                  color: filterMode === 'MY_NGO' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                My NGO ({myOrgName})
              </button>
              <button
                onClick={() => setFilterMode('ALL')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: filterMode === 'ALL' ? 'var(--primary)' : 'transparent',
                  color: filterMode === 'ALL' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                All Organizations
              </button>
            </div>
          )}

          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={16} /> {showForm ? 'Cancel Request' : '+ Create Requirement Request'}
          </button>
        </div>
      </div>

      {/* Requirement Request Builder Form */}
      {showForm && (
        <div className="glass-panel glow-card-indigo" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={22} color="#818cf8" /> Build Multi-Item Requirement Request
          </h3>

          <form onSubmit={handleCreateRequest}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Beneficiary Organization</label>
                {isNGO ? (
                  <input
                    type="text"
                    disabled
                    value={`${myOrgName} (${myOrgId})`}
                    className="form-input"
                    style={{ opacity: 0.85, cursor: 'not-allowed', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700 }}
                  />
                ) : (
                  <select
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="form-select"
                  >
                    {organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.type} - {o.city})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Request Urgency / Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-select"
                >
                  <option value="NORMAL">NORMAL — Standard Relief Drive</option>
                  <option value="HIGH">HIGH — Urgent Camp Supply</option>
                  <option value="CRITICAL">CRITICAL — Emergency Response</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px', marginBottom: '12px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Requested Resource Line Items</span>
                <button type="button" onClick={handleAddItemRow} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                  + Add Item Row
                </button>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requestItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(11, 16, 26, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ flex: 1 }}>
                    <select
                      value={item.resourceId}
                      onChange={(e) => {
                        const updated = [...requestItems];
                        updated[idx].resourceId = e.target.value;
                        setRequestItems(updated);
                      }}
                      className="form-select"
                      style={{ width: '100%' }}
                    >
                      {resources.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} (Stock Available: {r.currentStock} {r.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: '130px' }}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.requestedQty}
                      onChange={(e) => {
                        const updated = [...requestItems];
                        updated[idx].requestedQty = e.target.value;
                        setRequestItems(updated);
                      }}
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  {requestItems.length > 1 && (
                    <button type="button" onClick={() => handleRemoveItemRow(idx)} style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '6px' }}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Deployment Purpose / Notes</label>
              <input
                type="text"
                placeholder="e.g. Winter relief shelter distribution in flood zone..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Requirement Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {displayedRequests.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No requirement requests found for current filter.
          </div>
        ) : (
          displayedRequests.map((req) => {
            let priorityBadge = 'badge-info';
            if (req.priority === 'HIGH') priorityBadge = 'badge-warning';
            if (req.priority === 'CRITICAL') priorityBadge = 'badge-danger';

            let statusBadge = 'badge-warning';
            if (req.status === 'ALLOCATED' || req.status === 'COMPLETED') statusBadge = 'badge-success';
            if (req.status === 'PARTIALLY_ALLOCATED') statusBadge = 'badge-warning';

            return (
              <div key={req.id} className="glass-panel" style={{ padding: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>{req.orgName}</h3>
                      <span className={`badge ${priorityBadge}`}>{req.priority} PRIORITY</span>
                      <span className={`badge ${statusBadge}`}>{req.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '4px' }}>
                      Request ID: {req.id} &bull; Created: {req.createdDate} &bull; {req.notes}
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div style={{ background: 'rgba(11, 16, 26, 0.6)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <table className="custom-table" style={{ fontSize: '0.88rem' }}>
                    <thead>
                      <tr>
                        <th>Requested Resource</th>
                        <th>Quantity Needed</th>
                        <th>Allocated Quantity</th>
                        <th>Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {req.items.map((item, i) => {
                        const isFullyAllocated = item.allocatedQty >= item.requestedQty;
                        const isPartial = item.allocatedQty > 0 && item.allocatedQty < item.requestedQty;

                        return (
                          <tr key={i}>
                            <td style={{ fontWeight: 700, color: '#fff' }}>{item.resourceName}</td>
                            <td><strong style={{ color: '#818cf8' }}>{item.requestedQty}</strong></td>
                            <td>
                              <strong style={{ color: item.allocatedQty > 0 ? '#34d399' : '#94a3b8' }}>
                                {item.allocatedQty}
                              </strong>
                            </td>
                            <td>
                              {isFullyAllocated ? (
                                <span className="badge badge-success">FULFILLED</span>
                              ) : isPartial ? (
                                <span className="badge badge-warning">PARTIAL ({item.allocatedQty}/{item.requestedQty})</span>
                              ) : (
                                <span className="badge badge-danger">UNALLOCATED</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
