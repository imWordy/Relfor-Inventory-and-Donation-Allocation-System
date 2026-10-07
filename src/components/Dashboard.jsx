import React from 'react';
import { Package, AlertTriangle, Gift, Clock, Truck, TrendingUp, CheckCircle2, ArrowRight, Activity, ShieldCheck, Zap, BookOpen, PlusCircle, Building2, User, Sparkles } from 'lucide-react';

export default function Dashboard({ resources, donations, requests, distributions, currentUser, setActiveTab, onOpenGuide }) {
  const isNGO = currentUser.role === 'NGO';

  // Metrics for Staff / Admin
  const totalStock = resources.reduce((acc, r) => acc + r.currentStock, 0);
  const lowStockCount = resources.filter(r => r.status === 'LOW_STOCK' || r.status === 'OUT_OF_STOCK').length;
  const pendingRequestsCount = requests.filter(req => req.status === 'PENDING' || req.status === 'PARTIALLY_ALLOCATED').length;
  const completedDistributionsCount = distributions.length;

  // Metrics for NGO Persona
  const myOrgName = currentUser.organizationName || 'Hope Children Shelter';
  const myRequests = requests.filter(req => req.orgName === myOrgName || req.orgId === currentUser.organizationId);
  const myPendingCount = myRequests.filter(req => req.status === 'PENDING' || req.status === 'PARTIALLY_ALLOCATED').length;
  
  let myAllocatedItemsCount = 0;
  myRequests.forEach(r => {
    r.items?.forEach(item => {
      myAllocatedItemsCount += (item.allocatedQty || 0);
    });
  });

  const myDistributions = distributions.filter(d => d.orgName === myOrgName);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Dynamic User Welcome & Segmented Hero Header */}
      <div className={`glass-panel ${isNGO ? 'glow-card-indigo' : 'glow-card-emerald'}`} style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                background: currentUser.color || '#10b981',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} /> {currentUser.role} PERSPECTIVE
              </span>
              <span className="badge badge-success">Live Session Active</span>
            </div>

            <h1 style={{ fontSize: '1.65rem', color: '#ffffff', margin: '4px 0', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Welcome back, {currentUser.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {isNGO 
                ? `Beneficiary Partner Portal for ${myOrgName} — Track your submitted relief requests, allocation progress, and handover dispatches.` 
                : `${currentUser.title} — Real-time warehouse inventory control, donation tracking, and transactional allocation solver.`
              }
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={onOpenGuide} className="btn btn-guide">
              <BookOpen size={16} /> Operator Guide
            </button>

            {isNGO ? (
              <>
                <button onClick={() => setActiveTab('requests')} className="btn btn-primary">
                  <PlusCircle size={16} /> Submit Need Request
                </button>
                <button onClick={() => setActiveTab('distributions')} className="btn btn-secondary">
                  <Truck size={16} /> View Handover Receipts
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setActiveTab('donations')} className="btn btn-primary">
                  <PlusCircle size={16} /> Record Donation
                </button>
                <button onClick={() => setActiveTab('allocations')} className="btn btn-secondary">
                  <Zap size={16} /> Run Allocation Engine
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. User-Segmented KPI Metric Deck */}
      {isNGO ? (
        // NGO Specific Cards
        <div className="grid-cols-4">
          <div className="glass-panel glow-card-indigo" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  My Active Need Requests
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818cf8', margin: '6px 0' }}>
                  {myRequests.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {myPendingCount} pending allocation
                </div>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '14px', color: '#818cf8' }}>
                <Clock size={26} />
              </div>
            </div>
          </div>

          <div className="glass-panel glow-card-emerald" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Items Allocated to NGO
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', margin: '6px 0' }}>
                  {myAllocatedItemsCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Ready for dispatch/handover
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '14px', color: '#34d399' }}>
                <CheckCircle2 size={26} />
              </div>
            </div>
          </div>

          <div className="glass-panel glow-card-cyan" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Completed Handover Dispatches
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', margin: '6px 0' }}>
                  {myDistributions.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Signed & delivered receipts
                </div>
              </div>
              <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '12px', borderRadius: '14px', color: '#38bdf8' }}>
                <Truck size={26} />
              </div>
            </div>
          </div>

          <div className="glass-panel glow-card-amber" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Relief Stock Availability
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', margin: '6px 0' }}>
                  {resources.filter(r => r.status === 'AVAILABLE').length} / {resources.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Categories with ready stock
                </div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '14px', color: '#fbbf24' }}>
                <Package size={26} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Staff / Admin Cards
        <div className="grid-cols-4">
          <div className="glass-panel glow-card-emerald" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Total Warehouse Stock
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', margin: '6px 0', letterSpacing: '-0.03em' }}>
                  {totalStock.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Across {resources.length} resource categories
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '14px', color: '#34d399' }}>
                <Package size={26} />
              </div>
            </div>
          </div>

          <div className="glass-panel glow-card-amber" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Stock Warning Alerts
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: lowStockCount > 0 ? '#fbbf24' : '#34d399', margin: '6px 0', letterSpacing: '-0.03em' }}>
                  {lowStockCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Resources below threshold
                </div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '14px', color: '#fbbf24' }}>
                <AlertTriangle size={26} />
              </div>
            </div>
          </div>

          <div className="glass-panel glow-card-indigo" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Active NGO Requests
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818cf8', margin: '6px 0', letterSpacing: '-0.03em' }}>
                  {pendingRequestsCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Awaiting solver allocation
                </div>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '12px', borderRadius: '14px', color: '#818cf8' }}>
                <Clock size={26} />
              </div>
            </div>
          </div>

          <div className="glass-panel glow-card-cyan" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Completed Distributions
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', margin: '6px 0', letterSpacing: '-0.03em' }}>
                  {completedDistributionsCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Dispatched to partner NGOs
                </div>
              </div>
              <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '12px', borderRadius: '14px', color: '#38bdf8' }}>
                <Truck size={26} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Row: Segmented Detailed Feed */}
      <div className="grid-cols-2">
        
        {/* Warehouse Inventory Stock Status */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="#34d399" /> Relief Resources Stock Status
            </h3>
            <button onClick={() => setActiveTab('inventory')} className="btn btn-outline btn-sm">
              View Catalog <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {resources.map((res) => {
              let statusClass = 'badge-success';
              if (res.status === 'LOW_STOCK') statusClass = 'badge-warning';
              if (res.status === 'OUT_OF_STOCK') statusClass = 'badge-danger';

              const fillPct = res.minStock > 0 ? Math.min(100, Math.round((res.currentStock / (res.minStock * 2.5)) * 100)) : 100;

              return (
                <div key={res.id} style={{ background: 'rgba(11, 16, 26, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{res.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '10px' }}>({res.category})</span>
                    </div>
                    <span className={`badge ${statusClass}`}>{res.status}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span>Available Balance: <strong style={{ color: '#fff' }}>{res.currentStock.toLocaleString()} {res.unit}</strong></span>
                    <span>Alert Threshold: {res.minStock} {res.unit}</span>
                  </div>

                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${res.status === 'OUT_OF_STOCK' ? 4 : fillPct}%`,
                      background: res.status === 'OUT_OF_STOCK' ? '#f43f5e' : res.status === 'LOW_STOCK' ? '#f59e0b' : 'linear-gradient(90deg, #10b981, #34d399)',
                      transition: 'width 0.6s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Column: NGO Requests Stream or Recent System Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {isNGO ? (
            // NGO Specific Request Status Stream
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={20} color="#818cf8" /> Requests Status for {myOrgName}
                </h3>
                <button onClick={() => setActiveTab('requests')} className="btn btn-outline btn-sm">
                  Manage Requests <ArrowRight size={14} />
                </button>
              </div>

              {myRequests.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No requirement requests logged yet for {myOrgName}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {myRequests.map((req) => (
                    <div key={req.id} style={{ background: 'rgba(11, 16, 26, 0.6)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{req.id}</span>
                        <span className={`badge ${req.status === 'ALLOCATED' ? 'badge-success' : req.status === 'PARTIALLY_ALLOCATED' ? 'badge-warning' : 'badge-primary'}`}>
                          {req.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Priority: <span style={{ color: req.priority === 'CRITICAL' ? '#f43f5e' : '#fbbf24', fontWeight: 700 }}>{req.priority}</span> &bull; Submitted: {req.createdDate}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Items: {req.items.map(i => `${i.resourceName} (${i.allocatedQty}/${i.requestedQty})`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Staff / Admin Recent System Activity
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={20} color="#818cf8" /> Recent System Donations
                </h3>
                <button onClick={() => setActiveTab('donations')} className="btn btn-outline btn-sm">
                  Donation Log <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {donations.slice(0, 3).map((don) => (
                  <div key={don.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(11, 16, 26, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '10px', borderRadius: '10px', color: '#818cf8' }}>
                        <Gift size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{don.resourceName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Donor: {don.donorName}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.95rem' }}>+{don.quantity}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{don.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Transaction Rules Guarantee */}
          <div className="glass-panel glow-card-indigo" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="#818cf8" />
              <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Transactional Allocation Engine Guarantee</h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: '1.5' }}>
              Allocations strictly follow <code style={{ color: '#34d399' }}>allocation_quantity = min(requested, available)</code>. Stock balances remain atomic & non-negative.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

// Operational dashboard metric stream refinement verified
