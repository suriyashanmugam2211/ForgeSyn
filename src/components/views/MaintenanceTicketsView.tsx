import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MaintenanceTicket } from '../../types';
import { Wrench, CheckCircle2, Play, Plus } from 'lucide-react';

export const MaintenanceTicketsView: React.FC = () => {
  const {
    tickets,
    updateTicketStatus,
    createTicket
  } = useApp();

  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(tickets[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  // Technician Form State
  const [techNotes, setTechNotes] = useState('');
  const [actualIssueFound, setActualIssueFound] = useState('Bearing B-204 Inner Race Micro-Spalling & Thermal Lubricant Breakdown');
  const [partsUsedText, setPartsUsedText] = useState('Bearing B-204, Viton Shaft Seal S-102');

  const activeTicket = selectedTicket || tickets[0];

  const filteredTickets = tickets.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Maintenance Work Order Tickets</h2>
            <p className="text-xs text-slate-400">Manage work order lifecycles and technician repair execution.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Ticket Statuses ({tickets.length})</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={() => {
              createTicket({
                machineId: 'm-07',
                machineName: 'Turbine Generator T-700',
                machineCode: 'M-07',
                title: 'Preventive Bearing Inspection'
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>
      </div>

      {/* Main Grid: Kanban / Ticket Table + Selected Ticket Detail / Technician Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tickets Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Dispatched Tickets</h3>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No tickets found. Trigger Machine #07 Demo or create a new ticket above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3">Ticket ID</th>
                    <th className="pb-3">Machine</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Technician</th>
                    <th className="pb-3">Scheduled Time</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTickets.map(t => {
                    const isSelected = t.id === activeTicket?.id;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-500/10 text-indigo-200' : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-3 font-extrabold text-indigo-400">{t.id}</td>
                        <td className="py-3 font-bold">{t.machineName} ({t.machineCode})</td>
                        <td className="py-3 max-w-xs truncate">{t.title}</td>
                        <td className="py-3 text-slate-300">{t.assignedTechnicianName}</td>
                        <td className="py-3 text-slate-400">{t.scheduledTime}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.priority === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            t.priority === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            t.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: Technician Workflow Console */}
        <div className="space-y-4">
          {!activeTicket ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 glass-panel text-center text-xs text-slate-500">
              Select a ticket to launch the technician execution console.
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-400">{activeTicket.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    activeTicket.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    activeTicket.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {activeTicket.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">{activeTicket.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeTicket.machineName}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div>Assigned Tech: <strong className="text-cyan-300">{activeTicket.assignedTechnicianName}</strong></div>
                <div>Required Part: <strong className="text-slate-200">{activeTicket.requiredPartName}</strong></div>
                <div>Scheduled: <strong className="text-slate-200">{activeTicket.scheduledTime}</strong></div>
                <div>Est. Downtime: <strong className="text-amber-300">{activeTicket.estimatedDowntimeHours} Hours</strong></div>
              </div>

              {/* TECHNICIAN WORKFLOW CONTROLS */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technician Work Controls</h4>
                
                {activeTicket.status === 'Open' || activeTicket.status === 'Approved' ? (
                  <button
                    onClick={() => updateTicketStatus(activeTicket.id, 'In Progress')}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <Play className="w-4 h-4 fill-current" /> Accept & Start Repair Work
                  </button>
                ) : activeTicket.status === 'In Progress' ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setIsTechModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Repair & Submit Report
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> REPAIR COMPLETED & LOGGED TO MEMORY
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technician Repair Completion Modal */}
      {isTechModalOpen && activeTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Submit Technician Repair Report ({activeTicket.id})</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Actual Issue Discovered:</label>
                <input
                  type="text"
                  value={actualIssueFound}
                  onChange={(e) => setActualIssueFound(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Actual Parts Used (comma separated):</label>
                <input
                  type="text"
                  value={partsUsedText}
                  onChange={(e) => setPartsUsedText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Technician Notes:</label>
                <textarea
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  rows={3}
                  placeholder="Enter repair details, shaft alignment verification, oil flush notes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const parts = partsUsedText.split(',').map(s => s.trim());
                  updateTicketStatus(
                    activeTicket.id,
                    'Completed',
                    techNotes || 'Bearing B-204 replaced, housing flushed, alignment verified.',
                    actualIssueFound,
                    parts
                  );
                  setIsTechModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20"
              >
                Complete Ticket & Update System Memory
              </button>
              <button
                onClick={() => setIsTechModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
