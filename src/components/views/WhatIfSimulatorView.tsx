import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, CheckCircle2, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const WhatIfSimulatorView: React.FC = () => {
  const {
    activeScenarios,
    appliedScenarioId,
    applyScenario,
    setActiveView
  } = useApp();

  const [selectedScenarioId, setSelectedScenarioId] = useState<'A' | 'B' | 'C' | 'D'>(
    (appliedScenarioId as any) || 'C'
  );

  const selectedScenario = activeScenarios.find(s => s.id === selectedScenarioId) || activeScenarios[2];

  const chartData = activeScenarios.map(sc => ({
    name: `Scenario ${sc.id}`,
    'Total Impact ($)': sc.totalEstimatedImpact,
    'Prod Loss ($)': sc.productionLossCost,
    'Maint Cost ($)': sc.maintenanceCost,
    'Failure Risk (%)': sc.failureProbabilityPercent
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Multi-Scenario What-If Simulator</h2>
            <p className="text-xs text-slate-400">Evaluate financial risk, downtime exposure, and failure probabilities across operational choices.</p>
          </div>
        </div>

        <button
          onClick={() => {
            applyScenario(selectedScenarioId);
            setActiveView('decision');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" /> Apply Scenario {selectedScenarioId} to Decision Engine
        </button>
      </div>

      {/* Scenario Comparison Cards Grid (4 Scenarios: A, B, C, D) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeScenarios.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          const isApplied = sc.id === appliedScenarioId;
          return (
            <div
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all glass-panel space-y-3 relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-xl shadow-cyan-500/15'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              {sc.isRecommended && (
                <span className="absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  RECOMMENDED
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-black text-cyan-300 text-xs">
                  {sc.id}
                </span>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{sc.name}</h4>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{sc.description}</p>

              {/* Metrics Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Total Impact:</span>
                  <span className="font-extrabold text-cyan-300">${sc.totalEstimatedImpact.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Downtime:</span>
                  <span className="font-bold text-slate-200">{sc.downtimeHours} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Failure Prob:</span>
                  <span className={`font-bold ${sc.failureProbabilityPercent > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {sc.failureProbabilityPercent}%
                  </span>
                </div>
              </div>

              {isApplied && (
                <div className="pt-2 text-[10px] font-extrabold text-emerald-400 text-center uppercase tracking-wider bg-emerald-500/10 rounded py-1 border border-emerald-500/20">
                  Active Response Strategy
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparative Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Comparison */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Scenario Financial & Downtime Trade-Off Comparison
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Total Impact ($)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Prod Loss ($)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Maint Cost ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Scenario Action Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Selected Option: Scenario {selectedScenario.id}</h3>
          
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-cyan-300 text-sm">{selectedScenario.name}</h4>
            <p className="text-slate-300 leading-relaxed">{selectedScenario.action}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
              <span>Risk Tier: <strong className="text-amber-300 uppercase">{selectedScenario.riskLevel}</strong></span>
              <span>Downtime: <strong className="text-slate-200">{selectedScenario.downtimeHours}h</strong></span>
            </div>
          </div>

          <button
            onClick={() => {
              applyScenario(selectedScenario.id);
              setActiveView('decision');
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Apply Scenario {selectedScenario.id} to Workflow
          </button>
        </div>
      </div>
    </div>
  );
};
