import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Factory,
  Search,
  Bell,
  Play,
  User,
  CheckCircle2
} from 'lucide-react';
import { NotificationsDrawer } from './NotificationsDrawer';

export const Topbar: React.FC = () => {
  const {
    settings,
    updateSettings,
    notifications,
    setIsSearchOpen,
    runMachine07Demo,
    isDemoRunning,
    demoStepIndex
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const factories = [
    'Factory Alpha - Detroit',
    'Factory Beta - Stuttgart',
    'Factory Gamma - Tokyo'
  ];

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      {/* Left Context: Factory Selector & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-200">
          <Factory className="w-4 h-4 text-cyan-400" />
          <select
            value={settings.factoryName}
            onChange={(e) => updateSettings({ factoryName: e.target.value })}
            className="bg-transparent border-none text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            {factories.map(f => (
              <option key={f} value={f} className="bg-slate-900 text-slate-200">
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>SYSTEM ONLINE • 10/10 MONITORED</span>
        </div>
      </div>

      {/* Center Action: MACHINE #07 KILLER DEMO TRIGGER */}
      <div className="flex items-center gap-3">
        <button
          onClick={runMachine07Demo}
          disabled={isDemoRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg ${
            isDemoRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isDemoRunning ? `Demo Running (Step ${demoStepIndex}/21)` : 'Run Machine #07 Demo'}</span>
        </button>
      </div>

      {/* Right Controls: Search, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden lg:inline text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">Ctrl+K</kbd>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && <NotificationsDrawer onClose={() => setIsNotifOpen(false)} />}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-200">Alex Vance</div>
            <div className="text-[10px] text-cyan-400 font-medium">Ops Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
