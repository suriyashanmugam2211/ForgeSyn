import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DemoControlBar } from './components/layout/DemoControlBar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

import { OverviewView } from './components/views/OverviewView';
import { LiveMonitoringView } from './components/views/LiveMonitoringView';
import { MachineListView } from './components/views/MachineListView';
import { IncidentCenterView } from './components/views/IncidentCenterView';
import { AgentCommandCenterView } from './components/views/AgentCommandCenterView';
import { DiagnosisView } from './components/views/DiagnosisView';
import { InventoryView } from './components/views/InventoryView';
import { WorkforceView } from './components/views/WorkforceView';
import { SchedulerView } from './components/views/SchedulerView';
import { WhatIfSimulatorView } from './components/views/WhatIfSimulatorView';
import { DecisionCenterView } from './components/views/DecisionCenterView';
import { MaintenanceTicketsView } from './components/views/MaintenanceTicketsView';
import { MaintenanceHistoryView } from './components/views/MaintenanceHistoryView';
import { AIMemoryView } from './components/views/AIMemoryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'monitoring': return <LiveMonitoringView />;
      case 'machines': return <MachineListView />;
      case 'incidents': return <IncidentCenterView />;
      case 'agents': return <AgentCommandCenterView />;
      case 'diagnosis': return <DiagnosisView />;
      case 'inventory': return <InventoryView />;
      case 'workforce': return <WorkforceView />;
      case 'scheduler': return <SchedulerView />;
      case 'simulator': return <WhatIfSimulatorView />;
      case 'decision': return <DecisionCenterView />;
      case 'tickets': return <MaintenanceTicketsView />;
      case 'history': return <MaintenanceHistoryView />;
      case 'memory': return <AIMemoryView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar />

        {/* View Scroll Container */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 bg-radar-grid">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderView()}
          </div>
        </main>

        {/* Floating Demo Steps Bar */}
        <DemoControlBar />

        {/* Global Search Overlay */}
        <GlobalSearchModal />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
