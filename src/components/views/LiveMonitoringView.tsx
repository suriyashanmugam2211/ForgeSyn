import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Cpu,
  Thermometer,
  Zap,
  Volume2
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

export const LiveMonitoringView: React.FC = () => {
  const {
    machines,
    setSelectedMachineId,
    selectedMachineId,
    setActiveView,
    isSimulating,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    injectAnomaly,
    runMachine07Demo
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMachines = machines.filter(m => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Simulation Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" /> Live Telemetry Sensor Feed
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time physical stream scanning 7 sensor dimensions across plant machinery.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {isSimulating ? (
            <button
              onClick={pauseSimulation}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors hover:bg-amber-500/30"
            >
              <Pause className="w-4 h-4 fill-current" /> Pause Feed
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" /> Start Live Feed
            </button>
          )}

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Baseline
          </button>

          <button
            onClick={() => injectAnomaly('m-07')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Inject Anomaly (#07)
          </button>

          <button
            onClick={runMachine07Demo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Demo Flow
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Stream Chart & Fleet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Telemetry Line Chart for Selected Machine */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-cyan-400">{selectedMachine.code}</span>
                  <h3 className="text-sm font-bold text-slate-100">{selectedMachine.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    selectedMachine.status === 'critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                    selectedMachine.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {selectedMachine.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Real-time Vibration (mm/s) & Bearing Temperature (°C) Streams</p>
              </div>

              <button
                onClick={() => {
                  setSelectedMachineId(selectedMachine.id);
                  setActiveView('machines');
                }}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                Full Details View →
              </button>
            </div>

            {/* Recharts Live Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedMachine.telemetryHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" stroke="#38bdf8" tick={{ fontSize: 10 }} domain={[0, 15]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" tick={{ fontSize: 10 }} domain={[40, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="vibration" stroke="#38bdf8" name="Vibration (mm/s)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f43f5e" name="Temp (°C)" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Current Gauge Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> Vibration
                </div>
                <div className={`text-base font-extrabold mt-1 ${selectedMachine.sensors.vibration > 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {selectedMachine.sensors.vibration} <span className="text-xs text-slate-400 font-normal">mm/s</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temp
                </div>
                <div className={`text-base font-extrabold mt-1 ${selectedMachine.sensors.temperature > 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {selectedMachine.sensors.temperature} <span className="text-xs text-slate-400 font-normal">°C</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Current
                </div>
                <div className="text-base font-extrabold text-slate-200 mt-1">
                  {selectedMachine.sensors.current} <span className="text-xs text-slate-400 font-normal">A</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Acoustic
                </div>
                <div className="text-base font-extrabold text-slate-200 mt-1">
                  {selectedMachine.sensors.acousticLevel} <span className="text-xs text-slate-400 font-normal">dB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Machine Selection Grid & Filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Sensor Stream Selector
            </h3>
            
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${filterStatus === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              >
                All ({machines.length})
              </button>
              <button
                onClick={() => setFilterStatus('warning')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${filterStatus === 'warning' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
              >
                Warn
              </button>
              <button
                onClick={() => setFilterStatus('critical')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${filterStatus === 'critical' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
              >
                Crit
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredMachines.map(m => {
              const isSelected = m.id === selectedMachine.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMachineId(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-cyan-400">{m.code}</span>
                      <h4 className="text-xs font-bold text-slate-200">{m.name}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      m.status === 'critical' ? 'bg-rose-500/20 text-rose-300' :
                      m.status === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] mt-2 pt-2 border-t border-slate-800/80 text-slate-400">
                    <div>Vib: <span className="font-bold text-slate-200">{m.sensors.vibration}</span></div>
                    <div>Temp: <span className="font-bold text-slate-200">{m.sensors.temperature}°C</span></div>
                    <div>Anom: <span className="font-bold text-cyan-300">{m.anomalyScore}%</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
