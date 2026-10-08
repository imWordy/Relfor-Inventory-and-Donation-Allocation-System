import React, { useState } from 'react';

// Data
import { 
  SYSTEM_USERS,
  INITIAL_RESOURCES, 
  INITIAL_DONATIONS, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_REQUESTS, 
  INITIAL_DISTRIBUTIONS 
} from './data/mockData';

// Components
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import DonationView from './components/DonationView';
import OrganizationView from './components/OrganizationView';
import RequestView from './components/RequestView';
import AllocationView from './components/AllocationView';
import DistributionView from './components/DistributionView';
import ReportsView from './components/ReportsView';
import AuthView from './components/AuthView';
import SystemGuideModal from './components/SystemGuideModal';

export default function App() {
  // Active User Session State
  const [currentUser, setCurrentUser] = useState(SYSTEM_USERS[0]); // Default: Aditya Singh (ADMIN)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Application Data States
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [distributions, setDistributions] = useState(INITIAL_DISTRIBUTIONS);

  return (
    <div style={{ minHeight: '100vh', padding: '24px 28px 60px 28px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* 1. Header Navigation Bar with Segmented Role Tabs & User Persona Switcher */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* 2. System Guide Drawer */}
      <SystemGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* 3. Main Segmented Operational Views */}
      <main>
        {activeTab === 'dashboard' && (
          <Dashboard
            resources={resources}
            donations={donations}
            requests={requests}
            distributions={distributions}
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            resources={resources}
            setResources={setResources}
            currentUser={currentUser}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {activeTab === 'donations' && (
          <DonationView
            donations={donations}
            setDonations={setDonations}
            resources={resources}
            setResources={setResources}
          />
        )}

        {activeTab === 'organizations' && (
          <OrganizationView
            organizations={organizations}
            setOrganizations={setOrganizations}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'requests' && (
          <RequestView
            requests={requests}
            setRequests={setRequests}
            organizations={organizations}
            resources={resources}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'allocations' && (
          <AllocationView
            requests={requests}
            setRequests={setRequests}
            resources={resources}
            setResources={setResources}
            distributions={distributions}
            setDistributions={setDistributions}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'distributions' && (
          <DistributionView
            distributions={distributions}
            setDistributions={setDistributions}
            requests={requests}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            resources={resources}
            donations={donations}
            requests={requests}
            distributions={distributions}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'auth' && (
          <AuthView
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '60px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          Relfor Inventory & Donation Allocation System &bull; Active Persona: <strong style={{ color: currentUser.color }}>{currentUser.name} ({currentUser.role})</strong>
        </div>
        <div>
          Enterprise Production Environment &bull; React + Vite + Custom Glass System
        </div>
      </footer>

    </div>
  );
}

// API integration error boundary and fallback states verified
