import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Clock, Play } from 'lucide-react';

export const AgentCommandCenterView: React.FC = () => {
  const { agents, agentLogs, runMachine07Demo, isDemoRunning } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">COMPLETED</span>;
      case 'working': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">WORKING</span>;
      case 'warning': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">WARNING</span>;
      case 'failed': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">FAILED</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">IDLE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Multi-Agent Collaboration Mesh</h2>
            <p className="text-xs text-slate-400">11 Specialized AI Agents coordinating industrial incident resolution end-to-end.</p>
          </div>
        </div>

        <button
          onClick={runMachine07Demo}
          disabled={isDemoRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 hover:from-cyan-400 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Trigger Agent Collaboration Demo
        </button>
      </div>

      {/* Agents Status Grid (All 11 Agents) */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Agent Orchestration Roster</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all glass-panel space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" /> {agent.name}
                </span>
                {getStatusBadge(agent.status)}
              </div>
              <p className="text-xs text-slate-300 font-medium line-clamp-1">{agent.role}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{agent.description}</p>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span>Active: <strong>{agent.lastActive}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Activity Timeline Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" /> Live Agent Inter-Communication Log
        </h3>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {agentLogs.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No agent events logged yet. Click "Trigger Agent Collaboration Demo" above to watch agent signals flow.
            </div>
          ) : (
            agentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4 text-xs group hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-cyan-300">{log.agentName}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                      log.type === 'error' ? 'bg-rose-500/20 text-rose-300' :
                      log.type === 'decision' ? 'bg-indigo-500/20 text-indigo-300' :
                      log.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{log.message}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">{log.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
