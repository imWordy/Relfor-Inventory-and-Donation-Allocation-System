import React from 'react';
import { BookOpen, CheckCircle, ArrowRight, Layers, ShieldCheck, Heart } from 'lucide-react';

export default function UserGuideView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Relfor System User Guide & Documentation</h2>
            <span className="badge badge-info">Step 32 &bull; Aditya's Work</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            End-user manual for Relfor Foundation staff and NGO partners.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#34d399', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} /> Complete Relfor NGO Workflow Lifecycle
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>1. Recording Incoming Donations (Donation Module &bull; Step 18)</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              When a donor (corporate CSR, trust, individual) donates relief items, navigate to the <strong>Donations</strong> tab. Select the donor, resource type, and quantity. Saving the record automatically increments available warehouse stock in real-time.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>2. Monitoring Live Inventory (Inventory Module &bull; Step 17)</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Visit the <strong>Inventory</strong> tab to monitor current stock balances across food, shelter, medical, water, and equipment categories. Stock meters automatically alert staff when items fall below minimum thresholds (<span style={{ color: '#fbbf24' }}>LOW_STOCK</span> or <span style={{ color: '#f43f5e' }}>OUT_OF_STOCK</span>).
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>3. Submitting NGO Requirement Requests (Request Module &bull; Step 20)</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Beneficiary NGOs submit multi-item relief requests specifying required quantities and urgency priority (NORMAL, HIGH, CRITICAL). Requests enter <span style={{ color: '#818cf8' }}>PENDING</span> status until processed.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>4. Running the Allocation Engine (Allocation Engine &bull; Step 21)</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Staff trigger the allocation engine which calculates <code style={{ color: '#34d399' }}>allocation = min(requested, available)</code>. The engine atomically decrements stock, prevents negative balances, and marks requests as <span style={{ color: '#34d399' }}>ALLOCATED</span> or <span style={{ color: '#fbbf24' }}>PARTIALLY_ALLOCATED</span>.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>5. Distribution & Report Export (Distributions & Reports &bull; Steps 22 & 25)</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Record physical handover receipts with NGO signatures under <strong>Distributions</strong>. Audit logs and CSV exports can be generated anytime via the <strong>Reports</strong> tab.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
