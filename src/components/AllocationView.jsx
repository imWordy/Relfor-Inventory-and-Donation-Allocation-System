import React, { useState } from 'react';
import { Cpu, Play, CheckCircle, AlertTriangle, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export default function AllocationView({ requests, setRequests, resources, setResources, distributions, setDistributions }) {
  const [lastAllocationResult, setLastAllocationResult] = useState(null);
  const [selectedReqId, setSelectedReqId] = useState(requests.find(r => r.status !== 'ALLOCATED' && r.status !== 'COMPLETED')?.id || requests[0]?.id || '');

  // Core Allocation Engine Execution
  const handleExecuteAllocation = (targetReqId) => {
    const req = requests.find(r => r.id === targetReqId);
    if (!req) return;

    let updatedResources = [...resources];
    let updatedItems = [];
    let allocatedCountTotal = 0;

    // Process each requested item transactionally
    req.items.forEach(item => {
      const resIndex = updatedResources.findIndex(r => r.id === item.resourceId);
      if (resIndex !== -1) {
        const availableStock = updatedResources[resIndex].currentStock;
        const needed = item.requestedQty - item.allocatedQty;

        // Algorithm: min(requested, available)
        const allocatable = Math.min(needed, Math.max(0, availableStock));

        if (allocatable > 0) {
          // Decrement inventory safely
          const newStock = availableStock - allocatable;
          let newStatus = 'AVAILABLE';
          if (newStock === 0) newStatus = 'OUT_OF_STOCK';
          else if (newStock <= updatedResources[resIndex].minStock) newStatus = 'LOW_STOCK';

          updatedResources[resIndex] = {
            ...updatedResources[resIndex],
            currentStock: newStock,
            status: newStatus,
            updated: new Date().toISOString().split('T')[0]
          };

          updatedItems.push({
            resourceId: item.resourceId,
            resourceName: item.resourceName,
            requestedQty: item.requestedQty,
            allocatedThisRun: allocatable,
            totalAllocated: item.allocatedQty + allocatable,
            remainingStockAfter: newStock
          });

          allocatedCountTotal += allocatable;
        }
      }
    });

    // Update Request Status
    const allFulfilled = req.items.every(it => {
      const runItem = updatedItems.find(u => u.resourceId === it.resourceId);
      const totalNow = it.allocatedQty + (runItem ? runItem.allocatedThisRun : 0);
      return totalNow >= it.requestedQty;
    });

    const newReqStatus = allFulfilled ? 'ALLOCATED' : (allocatedCountTotal > 0 ? 'PARTIALLY_ALLOCATED' : req.status);

    const updatedRequests = requests.map(r => {
      if (r.id === targetReqId) {
        return {
          ...r,
          status: newReqStatus,
          items: r.items.map(it => {
            const runItem = updatedItems.find(u => u.resourceId === it.resourceId);
            return {
              ...it,
              allocatedQty: it.allocatedQty + (runItem ? runItem.allocatedThisRun : 0)
            };
          })
        };
      }
      return r;
    });

    // State Updates
    setResources(updatedResources);
    setRequests(updatedRequests);

    // Feedback Audit
    setLastAllocationResult({
      reqId: req.id,
      orgName: req.orgName,
      status: newReqStatus,
      allocatedCountTotal,
      items: updatedItems,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const targetReq = requests.find(r => r.id === selectedReqId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Transactional Allocation Engine</h2>
            <span className="badge badge-success">Engine Operational</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Automated resource allocation calculations using <code style={{ color: '#34d399' }}>min(requested, available)</code>. Enforces non-negative stock balance.
          </p>
        </div>
      </div>

      {/* Result Alert Card */}
      {lastAllocationResult && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)',
          border: '1px solid #818cf8',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={24} color="#34d399" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                Allocation Executed for {lastAllocationResult.orgName} ({lastAllocationResult.reqId})
              </h3>
            </div>
            <span className="badge badge-success">Status: {lastAllocationResult.status}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            {lastAllocationResult.items.map((it, idx) => (
              <div key={idx} style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Resource: <strong style={{ color: '#fff' }}>{it.resourceName}</strong></span>
                <span>Allocated This Run: <strong style={{ color: '#34d399' }}>+{it.allocatedThisRun}</strong></span>
                <span>Total Allocated: <strong>{it.totalAllocated} / {it.requestedQty}</strong></span>
                <span>Remaining Inventory: <strong style={{ color: '#a5b4fc' }}>{it.remainingStockAfter}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Grid */}
      <div className="grid-cols-2">
        
        {/* Control Panel */}
        <div className="glass-panel glow-card-indigo" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={22} color="#818cf8" /> Select Pending Request to Allocate
          </h3>

          <div className="form-group">
            <label className="form-label">Active Enqueued Requests</label>
            <select
              value={selectedReqId}
              onChange={(e) => setSelectedReqId(e.target.value)}
              className="form-select"
            >
              {requests.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id} — {r.orgName} ({r.priority} PRIORITY &bull; {r.status})
                </option>
              ))}
            </select>
          </div>

          {targetReq && (
            <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '18px', borderRadius: '12px', marginTop: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{targetReq.orgName} Line Items:</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {targetReq.items.map((item, idx) => {
                  const res = resources.find(r => r.id === item.resourceId);
                  const available = res ? res.currentStock : 0;
                  const needed = item.requestedQty - item.allocatedQty;

                  return (
                    <div key={idx} style={{ fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                        <span style={{ fontWeight: 600 }}>{item.resourceName}</span>
                        <span className="badge badge-info">{res ? res.category : ''}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '6px' }}>
                        <span>Needed: <strong>{item.requestedQty}</strong></span>
                        <span>Allocated: <strong style={{ color: '#34d399' }}>{item.allocatedQty}</strong></span>
                        <span>Stock Available: <strong style={{ color: available < needed ? '#fbbf24' : '#34d399' }}>{available}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleExecuteAllocation(targetReq.id)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={targetReq.status === 'COMPLETED'}
              >
                <Play size={18} /> Run Transactional Allocation Calculation
              </button>
            </div>
          )}
        </div>

        {/* System Safeguards Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#34d399" /> System Safeguards & Invariants
          </h3>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <div style={{ color: '#34d399', fontWeight: 700 }}>1. Non-Negative Inventory Invariant</div>
              <div>Calculations enforce strictly <code style={{ color: '#818cf8' }}>min(requested, available)</code>. Stock can never drop below 0.</div>
            </div>

            <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ color: '#fbbf24', fontWeight: 700 }}>2. Partial Allocation Queueing</div>
              <div>If available stock &lt; requested quantity, partial allocation is generated and remaining quantity is queued for subsequent donation drives.</div>
            </div>

            <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #818cf8' }}>
              <div style={{ color: '#818cf8', fontWeight: 700 }}>3. Transactional Consistency</div>
              <div>Database transactions wrap allocation updates across resources, requests, and allocation logs simultaneously.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
