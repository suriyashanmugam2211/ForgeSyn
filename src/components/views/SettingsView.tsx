import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, RotateCcw, Save, ShieldAlert, Sliders, Cpu } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useApp();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">System Preferences & Orchestration Parameters</h2>
            <p className="text-xs text-slate-400">Configure sensor alert thresholds, simulation speeds, and demo mode settings.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      {/* Main Settings Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulation & Threshold Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" /> Sensor Stream & Simulation Engine
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Simulation Speed Multiplier:</label>
              <div className="flex items-center gap-2">
                {[1, 2, 5, 10].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setLocalSettings({ ...localSettings, simulationSpeedMultiplier: speed })}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      localSettings.simulationSpeedMultiplier === speed
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-300">Vibration Thresholds (mm/s):</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-[11px]">Warning Level:</label>
                  <input
                    type="number"
                    value={localSettings.vibrationWarningThreshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, vibrationWarningThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Critical Level:</label>
                  <input
                    type="number"
                    value={localSettings.vibrationCriticalThreshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, vibrationCriticalThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-300">Temperature Thresholds (°C):</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-[11px]">Warning Level:</label>
                  <input
                    type="number"
                    value={localSettings.tempWarningThreshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, tempWarningThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Critical Level:</label>
                  <input
                    type="number"
                    value={localSettings.tempCriticalThreshold}
                    onChange={(e) => setLocalSettings({ ...localSettings, tempCriticalThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-200 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Info & Data Reset */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Platform Info & Hard Reset
          </h3>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
            <div>ForgeSyn Core Version: <strong className="text-cyan-300">v2.4.0-Orchestrator</strong></div>
            <div>Storage Mode: <strong className="text-emerald-300">Browser LocalStorage Sync</strong></div>
            <div>Active Plant Context: <strong className="text-slate-100">{settings.factoryName}</strong></div>
            <div>Multi-Agent Mesh: <strong className="text-indigo-300">11 Active Agents</strong></div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Danger Zone</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resetting state will wipe local storage cache and restore all 10 machines, spare parts, technicians, and agent memory to default initial plant baseline.
            </p>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset All Data & Restore Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl w-full max-w-md p-6 glass-panel space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
              <ShieldAlert className="w-5 h-5" /> Confirm Complete Data Reset
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to reset all ForgeSyn application data? This action will clear local storage and restore default factory demo state.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  resetAllData();
                  setIsResetModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-500/20"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
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
