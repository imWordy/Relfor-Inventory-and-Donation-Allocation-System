import React, { useState } from 'react';
import { UserCheck, Code, Clock, CheckCircle2, Play, Sparkles, Layers, ChevronDown, ChevronUp, ExternalLink, Terminal } from 'lucide-react';

export default function AdityaWorkbench({ activeTab, setActiveTab, teamMembers, onSimulateAllocation }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(null);

  const adityaData = teamMembers.find(m => m.name.includes('Aditya')) || teamMembers[0];
  const completedStepsCount = adityaData.steps.filter(s => s.status === 'COMPLETED' || s.status === 'READY').length;

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Prominent Aditya Header */}
      <div className="aditya-prominent-banner" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '1.4rem'
            }}>
              AS
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0 }}>
                  Aditya Singh's Developer Execution Hub
                </h2>
                <span className="badge badge-info" style={{ gap: '4px' }}>
                  <UserCheck size={12} /> PRIMARY FRONTEND OWNER
                </span>
                <span className="live-indicator" title="Active Working Skeleton Workspace"></span>
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
                Relfor Inventory & Allocation System &bull; Planned Workload: <strong style={{ color: '#818cf8' }}>~68 Hours</strong> (49h Core UI + 19h Integration/QA)
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Allocated Steps</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>{completedStepsCount} / {adityaData.steps.length} Steps</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Team Role Split</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a5b4fc' }}>Frontend & Visual UI/UX</div>
            </div>

            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="btn btn-outline btn-sm"
              style={{ padding: '8px 12px' }}
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              {collapsed ? 'Expand Task Checklist' : 'Hide Details'}
            </button>
          </div>

        </div>

        {/* Collapsible Content */}
        {!collapsed && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            
            {/* Step Navigation Bar for Aditya */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> ADITYA'S ASSIGNED UI MODULES & STEPS (Click to launch view):
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {adityaData.steps.map((step) => {
                  const tabMap = {
                    16: 'auth',
                    17: 'inventory',
                    18: 'donations',
                    19: 'organizations',
                    20: 'requests',
                    21: 'allocations',
                    22: 'distributions',
                    23: 'dashboard',
                    25: 'reports',
                    32: 'userguide'
                  };
                  const targetTab = tabMap[step.id];
                  const isActive = activeTab === targetTab;

                  return (
                    <button
                      key={step.id}
                      onClick={() => targetTab && setActiveTab(targetTab)}
                      style={{
                        background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)' : 'rgba(15, 23, 42, 0.7)',
                        color: isActive ? '#fff' : 'var(--text-main)',
                        border: isActive ? '1px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        cursor: targetTab ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                      }}
                    >
                      <CheckCircle2 size={12} color={step.status === 'READY' ? '#34d399' : '#818cf8'} />
                      <span>{step.name}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>({step.hours}h)</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Team Load Comparison Summary */}
            <div style={{ background: 'rgba(11, 15, 23, 0.6)', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Team Hours Balance:</span>
                
                {teamMembers.map(m => (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: m.isCurrentUser ? '#34d399' : '#a5b4fc' }}>
                      {m.name} {m.isCurrentUser ? '(You)' : ''}:
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                      ~{m.hours} hrs
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={onSimulateAllocation}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Play size={14} /> Run End-to-End Workflow Test (Phase 24)
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
