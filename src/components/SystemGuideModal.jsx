import React from 'react';
import { BookOpen, X, CheckCircle, ArrowRight, ShieldCheck, Gift, Package, ClipboardList, Cpu, Truck, FileText, HelpCircle } from 'lucide-react';

export default function SystemGuideModal({ isOpen, onClose, setActiveTab }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.2)'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '10px', borderRadius: '12px', color: '#38bdf8' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Relfor System Operator & User Guide</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Complete operational manual for Foundation Staff, Beneficiary NGOs, and Admins
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Lifecycle Workflow Map */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔄 End-to-End NGO Relief Workflow
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            
            <div 
              onClick={() => { setActiveTab('donations'); onClose(); }}
              style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center' }}
            >
              <Gift size={20} color="#818cf8" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>1. Record Donation</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stock increases</div>
            </div>

            <div 
              onClick={() => { setActiveTab('inventory'); onClose(); }}
              style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center' }}
            >
              <Package size={20} color="#34d399" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>2. Live Inventory</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Alert thresholds</div>
            </div>

            <div 
              onClick={() => { setActiveTab('requests'); onClose(); }}
              style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center' }}
            >
              <ClipboardList size={20} color="#fbbf24" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>3. NGO Request</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Urgency priority</div>
            </div>

            <div 
              onClick={() => { setActiveTab('allocations'); onClose(); }}
              style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center' }}
            >
              <Cpu size={20} color="#38bdf8" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>4. Allocation Engine</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>min(req, avail)</div>
            </div>

            <div 
              onClick={() => { setActiveTab('distributions'); onClose(); }}
              style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center' }}
            >
              <Truck size={20} color="#f43f5e" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>5. Distribution</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Handover receipts</div>
            </div>

          </div>
        </div>

        {/* Detailed Modules Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>How to Record Incoming Donations (Step 18)</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Navigate to <strong>Donations</strong> &rarr; Click <strong>+ Record Incoming Donation</strong>. Enter donor name, item, and quantity. Stock is updated transactionally in the inventory.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>How to Process NGO Requests & Allocation (Steps 20 & 21)</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              NGOs submit multi-item needs in <strong>Requests</strong>. Authorized staff then open <strong>Allocation Engine</strong> and click <strong>Trigger Transactional Allocation Engine</strong> to safely deduct inventory without ever dropping below 0.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Generating Reports & CSV Audits (Step 25)</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Open <strong>Reports</strong> &rarr; Choose between Inventory, Donations, Requests, or Distributions &rarr; Click <strong>Export Current Report as CSV</strong> to download raw data files.
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary">
            Got it, return to System
          </button>
        </div>

      </div>
    </div>
  );
}
