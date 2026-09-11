import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Search,
  AlertTriangle,
  Stethoscope,
  Wrench,
  Calendar,
  Sliders,
  History,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const MachineListView: React.FC = () => {
  const {
    machines,
    setSelectedMachineId,
    selectedMachine,
    setActiveView,
    triggerDiagnosisForMachine,
    injectAnomaly,
    createTicket
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const targetMachine = selectedMachine || machines[0];

  const filteredMachines = machines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Machine Directory & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Industrial Assets & Machinery Directory</h2>
            <p className="text-xs text-slate-400">10 Monitored Power & Precision Units in Detroit Assembly Plant</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search machine code or name..."
              className="bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({machines.length})</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Machine Selector Cards + Machine Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Machine Cards List */}
        <div className="lg:col-span-1 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {filteredMachines.map((m) => {
            const isSelected = m.id === targetMachine.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMachineId(m.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-400">{m.code}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    m.status === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    m.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-1">{m.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{m.location}</p>

                <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Health: <strong className="text-cyan-300">{m.healthScore}%</strong></span>
                  <span className="text-slate-400">Vib: <strong className={m.sensors.vibration > 5 ? 'text-rose-400' : 'text-slate-200'}>{m.sensors.vibration} mm/s</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 3 Cols: Comprehensive Machine Details View */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 glass-panel space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    {targetMachine.code}
                  </span>
                  <h2 className="text-xl font-black text-slate-100">{targetMachine.name}</h2>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    targetMachine.status === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                    targetMachine.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {targetMachine.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Type: <strong className="text-slate-200">{targetMachine.type}</strong> • Location: <strong className="text-slate-200">{targetMachine.location}</strong> • Factory: <strong className="text-slate-200">{targetMachine.factory}</strong>
                </p>
              </div>

              {/* Operating Stats */}
              <div className="flex items-center gap-4 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px]">Operating Hours</div>
                  <div className="font-extrabold text-slate-200 mt-0.5">{targetMachine.operatingHours} h</div>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px]">Last Maintenance</div>
                  <div className="font-extrabold text-cyan-300 mt-0.5">{targetMachine.lastMaintenance}</div>
                </div>
              </div>
            </div>

            {/* Health & Failure Prediction Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Index</div>
                  <div className="text-3xl font-black text-cyan-300 mt-1">{targetMachine.healthScore}%</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">Structural Integrity OK</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-cyan-400 flex items-center justify-center font-bold text-xs text-cyan-300">
                  {targetMachine.healthScore}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anomaly Rating</div>
                  <div className={`text-3xl font-black mt-1 ${targetMachine.anomalyScore > 50 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {targetMachine.anomalyScore}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Physical Drift Index</div>
                </div>
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-xs ${
                  targetMachine.anomalyScore > 50 ? 'border-rose-400 text-rose-300' : 'border-slate-600 text-slate-400'
                }`}>
                  {targetMachine.anomalyScore}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Failure Risk Model</div>
                <div className="text-xs font-bold text-rose-300 mt-1 line-clamp-1">
                  {targetMachine.predictedFailure || 'No Immediate Failure Predicted'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Confidence: <strong className="text-cyan-300">{targetMachine.failureConfidence || 5}%</strong></span>
                  <span>Est. Time: <strong className="text-amber-300">{targetMachine.timeToFailureHours || 72}h</strong></span>
                </div>
              </div>
            </div>

            {/* Current Sensor Dimensions Gauges */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live 7-Dimensional Sensor Snapshot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Vibration</div>
                  <div className={`text-sm font-extrabold mt-0.5 ${targetMachine.sensors.vibration > 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {targetMachine.sensors.vibration} <span className="text-[10px] text-slate-500 font-normal">mm/s</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Temp</div>
                  <div className={`text-sm font-extrabold mt-0.5 ${targetMachine.sensors.temperature > 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {targetMachine.sensors.temperature} <span className="text-[10px] text-slate-500 font-normal">°C</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Pressure</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-0.5">
                    {targetMachine.sensors.pressure} <span className="text-[10px] text-slate-500 font-normal">bar</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Current</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-0.5">
                    {targetMachine.sensors.current} <span className="text-[10px] text-slate-500 font-normal">A</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">RPM</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-0.5">
                    {targetMachine.sensors.rpm}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Load</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-0.5">
                    {targetMachine.sensors.load}%
                  </div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Acoustic</div>
                  <div className="text-sm font-extrabold text-slate-200 mt-0.5">
                    {targetMachine.sensors.acousticLevel} <span className="text-[10px] text-slate-500 font-normal">dB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chart */}
            <div className="h-56 w-full">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Historical Telemetry Stream</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={targetMachine.telemetryHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#38bdf8" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="vibration" stroke="#38bdf8" name="Vibration (mm/s)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="temperature" stroke="#f43f5e" name="Temp (°C)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ALL 7 REQUIRED FUNCTIONAL BUTTONS AUDIT */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Machine Orchestration Controls</h3>
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. View Incident */}
                <button
                  onClick={() => setActiveView('incidents')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> View Incident
                </button>

                {/* 2. Run Diagnosis */}
                <button
                  onClick={() => triggerDiagnosisForMachine(targetMachine.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-colors"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Run Diagnosis
                </button>

                {/* 3. Create Maintenance Ticket */}
                <button
                  onClick={() => {
                    createTicket({
                      machineId: targetMachine.id,
                      machineName: targetMachine.name,
                      machineCode: targetMachine.code
                    });
                    setActiveView('tickets');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" /> Create Ticket
                </button>

                {/* 4. Schedule Maintenance */}
                <button
                  onClick={() => setActiveView('scheduler')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule Maintenance
                </button>

                {/* 5. Simulate Response */}
                <button
                  onClick={() => setActiveView('simulator')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" /> Simulate Response
                </button>

                {/* 6. View History */}
                <button
                  onClick={() => setActiveView('history')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <History className="w-3.5 h-3.5" /> View History
                </button>

                {/* 7. Reset Machine Scenario */}
                <button
                  onClick={() => {
                    injectAnomaly(targetMachine.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Inject Machine Anomaly
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance History Table for Selected Machine */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Past Maintenance Records</h3>
            {targetMachine.maintenanceHistory.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">No previous maintenance records logged for this unit.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Technician</th>
                      <th className="pb-2">Parts Replaced</th>
                      <th className="pb-2">Cost</th>
                      <th className="pb-2">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {targetMachine.maintenanceHistory.map(rec => (
                      <tr key={rec.id} className="text-slate-300">
                        <td className="py-2.5 font-bold text-cyan-300">{rec.date}</td>
                        <td className="py-2.5">{rec.type}</td>
                        <td className="py-2.5 max-w-xs truncate">{rec.description}</td>
                        <td className="py-2.5">{rec.technicianName}</td>
                        <td className="py-2.5 text-slate-400">{rec.partsReplaced.join(', ')}</td>
                        <td className="py-2.5 font-bold text-slate-200">${rec.cost}</td>
                        <td className="py-2.5">
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
      </div>
    </div>
  );
};
