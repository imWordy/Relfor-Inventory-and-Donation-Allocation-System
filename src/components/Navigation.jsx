import React from 'react';
import { LayoutDashboard, Package, Gift, Building2, ClipboardList, Cpu, Truck, FileText, Lock, BookOpen, Shield, ChevronDown, UserCheck } from 'lucide-react';
import { SYSTEM_USERS } from '../data/mockData';

export default function Navigation({ activeTab, setActiveTab, currentUser, setCurrentUser, onOpenGuide }) {
  
  // Dynamic Tab Filtering based on User Role (NGO vs STAFF vs ADMIN)
  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF', 'NGO'] },
    { id: 'inventory', label: 'Relief Inventory', icon: Package, roles: ['ADMIN', 'STAFF', 'NGO'] },
    { id: 'requests', label: currentUser.role === 'NGO' ? 'My Needs & Requests' : 'NGO Requests', icon: ClipboardList, roles: ['ADMIN', 'STAFF', 'NGO'] },
    { id: 'donations', label: 'Donations Intake', icon: Gift, roles: ['ADMIN', 'STAFF'] },
    { id: 'organizations', label: 'NGO Partners', icon: Building2, roles: ['ADMIN', 'STAFF', 'NGO'] },
    { id: 'allocations', label: 'Allocation Engine', icon: Cpu, roles: ['ADMIN', 'STAFF'] },
    { id: 'distributions', label: currentUser.role === 'NGO' ? 'Received Handovers' : 'Distributions', icon: Truck, roles: ['ADMIN', 'STAFF', 'NGO'] },
    { id: 'reports', label: 'Reports & CSV', icon: FileText, roles: ['ADMIN', 'STAFF'] },
    { id: 'auth', label: 'Auth & Session', icon: Lock, roles: ['ADMIN', 'STAFF', 'NGO'] }
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.includes(currentUser.role));

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ADMIN': return { bg: 'rgba(239, 68, 68, 0.2)', border: '#f87171', color: '#f87171', label: 'ADMIN' };
      case 'STAFF': return { bg: 'rgba(16, 185, 129, 0.2)', border: '#34d399', color: '#34d399', label: 'STAFF' };
      case 'NGO': return { bg: 'rgba(139, 92, 246, 0.2)', border: '#a78bfa', color: '#a78bfa', label: 'NGO PARTNER' };
      default: return { bg: 'rgba(255,255,255,0.1)', border: '#ccc', color: '#fff', label: role };
    }
  };

  const badgeStyle = getRoleBadgeStyle(currentUser.role);

  return (
    <div className="glass-panel" style={{ padding: '14px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      
      {/* Brand & System Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
        }}>
          <Package size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.2', display: 'flex', alignItems: 'center', gap: '8px' }}>
            RELFOR <span style={{ color: '#34d399', fontWeight: 400 }}>System</span>
            <span className="live-indicator" title="Live Dynamic Mode"></span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Inventory & Donation Allocation System
          </div>
        </div>
      </div>

      {/* Dynamic Segmented Navigation Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'transparent',
                color: isActive ? '#34d399' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              <Icon size={17} color={isActive ? '#34d399' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Persona & Role Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* System Operator Guide Button */}
        <button 
          onClick={onOpenGuide}
          className="btn btn-guide btn-sm"
          style={{ gap: '6px' }}
        >
          <BookOpen size={16} /> Operator Guide
        </button>

        {/* User Persona Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '6px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Avatar Bubble */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: currentUser.color || '#10b981',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 10px ${currentUser.color}66`
          }}>
            {currentUser.avatar}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', lineHeight: '1.2' }}>
              {currentUser.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '4px',
                background: badgeStyle.bg,
                border: `1px solid ${badgeStyle.border}`,
                color: badgeStyle.color
              }}>
                {badgeStyle.label}
              </span>
              {currentUser.organizationName && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.organizationName}
                </span>
              )}
            </div>
          </div>

          {/* Selector Dropdown */}
          <select 
            value={currentUser.id} 
            onChange={(e) => {
              const selected = SYSTEM_USERS.find(u => u.id === e.target.value);
              if (selected) {
                setCurrentUser(selected);
                // Reset active tab if current tab not allowed
                const allowed = allTabs.filter(t => t.roles.includes(selected.role)).map(t => t.id);
                if (!allowed.includes(activeTab)) {
                  setActiveTab('dashboard');
                }
              }
            }}
            className="form-select"
            style={{ padding: '4px 8px', fontSize: '0.78rem', height: '30px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)' }}
            title="Switch User Role Persona"
          >
            {SYSTEM_USERS.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
}

// Responsive header refinement verified
