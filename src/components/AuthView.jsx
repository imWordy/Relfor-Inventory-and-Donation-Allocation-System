import React, { useState } from 'react';
import { Lock, ShieldCheck, UserCheck, Key, CheckCircle, Sparkles, Building2, Shield, User } from 'lucide-react';
import { SYSTEM_USERS } from '../data/mockData';

export default function AuthView({ currentUser, setCurrentUser }) {
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleLoginSim = (e) => {
    e.preventDefault();
    const matched = SYSTEM_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      setAuthSuccess(true);
      setTimeout(() => setAuthSuccess(false), 4000);
    } else {
      setAuthSuccess(true);
      setTimeout(() => setAuthSuccess(false), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Authentication & User Permissions Portal</h2>
            <span className="badge badge-success">JWT Auth Active</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Role-gated authorization & persona switcher for Admins, Operations Staff, and Beneficiary NGOs.
          </p>
        </div>
      </div>

      {/* Quick Persona Switcher Cards */}
      <div className="glass-panel glow-card-indigo" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="#818cf8" /> One-Click Quick User Persona Switcher
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Click any persona below to immediately switch the entire UI layout and test user-segmented views:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {SYSTEM_USERS.map((user) => {
            const isSelected = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  setCurrentUser(user);
                  setEmail(user.email);
                }}
                style={{
                  background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(11, 16, 26, 0.7)',
                  border: isSelected ? `2px solid ${user.color}` : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <span style={{ position: 'absolute', top: '10px', right: '10px', color: user.color }}>
                    <CheckCircle size={18} />
                  </span>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: user.color,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {user.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{user.name}</div>
                    <span className="badge" style={{ background: `${user.color}22`, color: user.color, fontSize: '0.65rem', padding: '1px 6px' }}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{user.title}</div>
                {user.organizationName && (
                  <div style={{ fontSize: '0.74rem', color: '#a78bfa', marginTop: '4px', fontWeight: 600 }}>
                    Org: {user.organizationName}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid-cols-2">
        
        {/* Active Session & Login Card */}
        <div className="glass-panel glow-card-emerald" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={22} color="#34d399" /> Current Session Profile
          </h3>

          {authSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #34d399', color: '#34d399', padding: '14px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.88rem' }}>
              ✓ Authenticated successfully as <strong>{currentUser.name} ({currentUser.role})</strong>! JWT Session updated.
            </div>
          )}

          <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: currentUser.color,
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {currentUser.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{currentUser.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div>Role Authorization: <strong style={{ color: currentUser.color }}>{currentUser.role}</strong></div>
              <div>Designation: <span style={{ color: '#fff' }}>{currentUser.title}</span></div>
              {currentUser.organizationName && (
                <div>Assigned Beneficiary Org: <span style={{ color: '#a78bfa', fontWeight: 700 }}>{currentUser.organizationName} ({currentUser.organizationId})</span></div>
              )}
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                JWT Token: <code style={{ color: '#34d399' }}>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code>
              </div>
            </div>
          </div>

          <form onSubmit={handleLoginSim}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              Authenticate Credentials
            </button>
          </form>
        </div>

        {/* Matrix */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#34d399" /> Role Access Control Matrix
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
            
            <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>ADMIN ROLE</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Full system governance, database audit inspection, user credentials management, and reporting exports.</div>
            </div>

            <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>STAFF ROLE</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Authorized to record donations, edit inventory balances, run transactional allocation solver, and sign dispatch handovers.</div>
            </div>

            <div style={{ background: 'rgba(11, 16, 26, 0.7)', padding: '14px 18px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ fontWeight: 700, color: '#fff' }}>NGO ROLE</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Segmented view. Can submit resource requirement requests for their organization and track fulfillment dispatches. Cannot alter stock directly.</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
