import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  Stethoscope,
  Wrench,
  ChevronRight,
  Bot
} from 'lucide-react';

export const IncidentCenterView: React.FC = () => {
  const {
    incidents,
    selectedIncidentId,
    setSelectedIncidentId,
    approveIncident,
    rejectIncident,
    modifyIncidentAction,
    setActiveView,
    triggerDiagnosisForMachine,
    createTicket
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState('all');
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [customActionText, setCustomActionText] = useState('');

  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const filteredIncidents = incidents.filter(i => {
    if (filterSeverity === 'all') return true;
    return i.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Incident Command & Human Approval Center</h2>
            <p className="text-xs text-slate-400">Manage real-time anomaly alerts, review AI recommendations, and grant human authorization.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Severities ({incidents.length})</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Incident Directory Table + Selected Incident Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Incidents Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active & Historical Incidents</h3>

          {filteredIncidents.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No incidents logged yet. Trigger Machine #07 Demo or Inject Anomaly to create an incident.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Machine</th>
                    <th className="pb-3">Detection Time</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3">Anomaly</th>
                    <th className="pb-3">Approval</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredIncidents.map(inc => {
                    const isSelected = inc.id === activeIncident?.id;
                    return (
                      <tr
                        key={inc.id}
                        onClick={() => setSelectedIncidentId(inc.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-cyan-500/10 text-cyan-200' : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-3 font-extrabold text-cyan-400">{inc.id}</td>
                        <td className="py-3 font-bold">{inc.machineName} ({inc.machineCode})</td>
                        <td className="py-3 text-slate-400">{inc.detectionTime}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inc.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            inc.severity === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-rose-400">{inc.anomalyScore}%</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inc.approvalStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                            inc.approvalStatus === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                            inc.approvalStatus === 'modified' ? 'bg-indigo-500/20 text-indigo-300' :
                            'bg-amber-500/20 text-amber-300 animate-pulse'
                          }`}>
                            {inc.approvalStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIncidentId(inc.id);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                          >
                            Inspect <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: Selected Incident Details & Human Approval Center */}
        <div className="space-y-4">
          {!activeIncident ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 glass-panel text-center text-xs text-slate-500">
              Select an incident from the table to view AI diagnostic breakdown and grant human approval.
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-cyan-400">{activeIncident.id}</span>
                  <span className="text-[10px] text-slate-500">{activeIncident.detectionTime}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-1">{activeIncident.machineName}</h3>
                <p className="text-xs text-rose-300 mt-1 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/30">
                  {activeIncident.summary}
                </p>
              </div>

              {/* AI Recommendation Box */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-cyan-400" /> AI Recommended Action Strategy
                  </span>
                  <button
                    onClick={() => {
                      setEditingActionId(activeIncident.id);
                      setCustomActionText(activeIncident.recommendedAction || '');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>

                {editingActionId === activeIncident.id ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={customActionText}
                      onChange={(e) => setCustomActionText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          modifyIncidentAction(activeIncident.id, customActionText);
                          setEditingActionId(null);
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[11px] font-bold"
                      >
                        Save Strategy
                      </button>
                      <button
                        onClick={() => setEditingActionId(null)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-cyan-200 font-medium leading-relaxed">
                    {activeIncident.recommendedAction || 'Derate load by 30% and schedule Bearing B-204 replacement for 14:30 PM shift handover.'}
                  </p>
                )}
              </div>

              {/* HUMAN APPROVAL ACTION BUTTONS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Human Authorization Queue</h4>
                
                {activeIncident.approvalStatus === 'approved' ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> APPROVED — Maintenance Ticket Dispatched
                  </div>
                ) : activeIncident.approvalStatus === 'rejected' ? (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> REJECTED — Overridden by Human Operator
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        approveIncident(activeIncident.id);
                        createTicket({
                          incidentId: activeIncident.id,
                          machineId: activeIncident.machineId,
                          machineName: activeIncident.machineName,
                          machineCode: activeIncident.machineCode,
                          recommendedAction: activeIncident.recommendedAction || 'Bearing Replacement'
                        });
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Action
                    </button>

                    <button
                      onClick={() => rejectIncident(activeIncident.id, 'High production priority shift')}
                      className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Shortcut buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => triggerDiagnosisForMachine(activeIncident.machineId)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> View Diagnosis
                </button>

                <button
                  onClick={() => setActiveView('tickets')}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" /> Open Tickets
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
