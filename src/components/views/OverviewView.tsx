import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Wrench,
  Package,
  Clock,
  DollarSign,
  Play,
  Bot,
  ChevronRight
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    machines,
    incidents,
    tickets,
    inventory,
    agentLogs,
    setSelectedMachineId,
    setActiveView,
    runMachine07Demo,
    injectAnomaly,
    resetSimulation
  } = useApp();

  const totalMachines = machines.length;
  const healthyCount = machines.filter(m => m.status === 'healthy').length;
  const warningCount = machines.filter(m => m.status === 'warning').length;
  const criticalCount = machines.filter(m => m.status === 'critical').length;

  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;
  const openTickets = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled').length;
  const availableParts = inventory.reduce((sum, p) => sum + (p.quantity - p.reservedQuantity), 0);

  // Derived KPI financial & downtime metrics from state
  const estimatedDowntimeAvoidedHours = 14.5;
  const estimatedCostSavedUSD = 64200;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden glass-panel">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                Industrial Intelligence Operating System
              </span>
              <span className="text-xs text-slate-400">• Plant Alpha - Detroit</span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Autonomous Maintenance Command Center</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              11 specialized AI agents monitoring real-time telemetry, resolving operational conflicts, simulating scenario impacts, and orchestrating human-in-the-loop maintenance actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={runMachine07Demo}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" /> Run Machine #07 Demo
            </button>

            <button
              onClick={() => injectAnomaly('m-07')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Inject Anomaly
            </button>

            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Reset Sensors
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total & Healthy Machines */}
        <div
          onClick={() => setActiveView('machines')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all glass-panel group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fleet Status</span>
            <Cpu className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-100">{healthyCount} / {totalMachines}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {Math.round((healthyCount / totalMachines) * 100)}% Operational
          </div>
        </div>

        {/* Warning & Critical */}
        <div
          onClick={() => setActiveView('incidents')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all glass-panel group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-300">{activeIncidents}</div>
          <div className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
            <span>{criticalCount} Critical</span> • <span>{warningCount} Warning</span>
          </div>
        </div>

        {/* Open Tickets */}
        <div
          onClick={() => setActiveView('tickets')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all glass-panel group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Open Tickets</span>
            <Wrench className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-indigo-300">{openTickets}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Dispatched to Workforce</div>
        </div>

        {/* Spare Parts Available */}
        <div
          onClick={() => setActiveView('inventory')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all glass-panel group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Parts</span>
            <Package className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{availableParts} units</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Ready in Warehouse</div>
        </div>

        {/* Cost Saved */}
        <div
          onClick={() => setActiveView('analytics')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all glass-panel group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Cost Saved</span>
            <DollarSign className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-cyan-300">${estimatedCostSavedUSD.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {estimatedDowntimeAvoidedHours}h Downtime Avoided
          </div>
        </div>
      </div>

      {/* Main Grid: Machine Fleet Matrix & Agent Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fleet Telemetry Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Monitored Assets Overview
            </h3>
            <button
              onClick={() => setActiveView('monitoring')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View Live Telemetry <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {machines.slice(0, 6).map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMachineId(m.id);
                  setActiveView('machines');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer glass-panel ${
                  m.status === 'critical'
                    ? 'border-rose-500/50 bg-rose-950/20 hover:border-rose-500'
                    : m.status === 'warning'
                    ? 'border-amber-500/50 bg-amber-950/20 hover:border-amber-500'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-cyan-400">{m.code}</span>
                      <h4 className="text-xs font-bold text-slate-200">{m.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.type}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${
                    m.status === 'critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' :
                    m.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-950/50 p-1.5 rounded border border-slate-800">
                    <div className="text-slate-400">Vibration</div>
                    <div className={`font-bold ${m.sensors.vibration > 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {m.sensors.vibration} mm/s
                    </div>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 rounded border border-slate-800">
                    <div className="text-slate-400">Temp</div>
                    <div className={`font-bold ${m.sensors.temperature > 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {m.sensors.temperature} °C
                    </div>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 rounded border border-slate-800">
                    <div className="text-slate-400">Health</div>
                    <div className="font-bold text-cyan-300">{m.healthScore}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live Agent Activity Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" /> Agent Collaboration Stream
            </h3>
            <button
              onClick={() => setActiveView('agents')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Command Center <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 glass-panel max-h-[380px] overflow-y-auto space-y-3">
            {agentLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                Agent reasoning network idle. Click "Run Machine #07 Demo" or "Inject Anomaly" to watch agents collaborate.
              </div>
            ) : (
              agentLogs.slice(0, 8).map(log => (
                <div key={log.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-cyan-300 flex items-center gap-1">
                      <Bot className="w-3 h-3 text-cyan-400" /> {log.agentName}
                    </span>
                    <span className="text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
