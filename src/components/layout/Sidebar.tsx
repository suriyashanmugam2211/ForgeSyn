import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ActiveView } from '../../types';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  AlertTriangle,
  Bot,
  Stethoscope,
  Package,
  Users,
  Calendar,
  Sliders,
  GitMerge,
  Wrench,
  History,
  Brain,
  BarChart3,
  Settings,
  ShieldAlert
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, incidents, tickets, inventory } = useApp();

  const pendingApprovalsCount = incidents.filter(i => i.approvalStatus === 'pending').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled').length;
  const lowStockCount = inventory.filter(p => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'machines', label: 'Machines Fleet', icon: Cpu },
    { id: 'incidents', label: 'Incident Center', icon: AlertTriangle, badge: pendingApprovalsCount, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'agents', label: 'Agent Command Center', icon: Bot },
    { id: 'diagnosis', label: 'AI Diagnosis', icon: Stethoscope },
    { id: 'inventory', label: 'Spare Inventory', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'workforce', label: 'Workforce Dispatch', icon: Users },
    { id: 'scheduler', label: 'Maintenance Scheduler', icon: Calendar },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'decision', label: 'Decision & Conflict', icon: GitMerge },
    { id: 'tickets', label: 'Maintenance Tickets', icon: Wrench, badge: openTicketsCount > 0 ? openTicketsCount : undefined, badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    { id: 'history', label: 'Maintenance History', icon: History },
    { id: 'memory', label: 'AI Memory / Learning', icon: Brain },
    { id: 'analytics', label: 'Analytics Suite', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30 select-none backdrop-blur-md">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-lg tracking-wider text-slate-100 uppercase">Forge<span className="text-cyan-400">Syn</span></h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight">Industrial AI Orchestrator</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-slate-800/80 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>Engine Health:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            Optimal
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[94%]"></div>
        </div>
      </div>
    </aside>
  );
};
