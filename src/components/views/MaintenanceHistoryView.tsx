import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search } from 'lucide-react';

export const MaintenanceHistoryView: React.FC = () => {
  const { machines } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all historical records across machines
  const allHistory = machines.flatMap(m =>
    (m.maintenanceHistory || []).map(h => ({
      ...h,
      machineCode: m.code,
      machineName: m.name
    }))
  );

  const filteredHistory = allHistory.filter(h =>
    h.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Historical Maintenance Database</h2>
            <p className="text-xs text-slate-400">Past repair actions, technician feedback, parts replaced, and outcome tracking.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past repairs or technician..."
            className="bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Historical Repair Archives</h3>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">No historical records match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Machine</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Action Description</th>
                  <th className="pb-3">Technician</th>
                  <th className="pb-3">Parts Replaced</th>
                  <th className="pb-3">Cost</th>
                  <th className="pb-3">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map(rec => (
                  <tr key={rec.id} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="py-3 font-extrabold text-cyan-300">{rec.date}</td>
                    <td className="py-3 font-bold">{rec.machineName} ({rec.machineCode})</td>
                    <td className="py-3">{rec.type}</td>
                    <td className="py-3 max-w-xs">{rec.description}</td>
                    <td className="py-3 text-slate-200">{rec.technicianName}</td>
                    <td className="py-3 text-slate-400">{rec.partsReplaced.join(', ')}</td>
                    <td className="py-3 font-bold text-slate-100">${rec.cost}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {rec.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
