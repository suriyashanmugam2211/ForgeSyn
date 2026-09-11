import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  HelpCircle,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const DiagnosisView: React.FC = () => {
  const {
    activeDiagnosis,
    selectedMachine,
    setActiveView,
    triggerDiagnosisForMachine
  } = useApp();

  const machine = selectedMachine || {
    id: 'm-07',
    code: 'M-07',
    name: 'Turbine Generator T-700',
    type: 'High-Velocity Steam Turbine'
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">AI Diagnostic Reasoning Engine</h2>
            <p className="text-xs text-slate-400">Deep-dive root-cause analysis for {machine.name} ({machine.code})</p>
          </div>
        </div>

        <button
          onClick={() => triggerDiagnosisForMachine(machine.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-colors"
        >
          <Stethoscope className="w-4 h-4" /> Re-Run Diagnostic Scan
        </button>
      </div>

      {/* Main Diagnostic Dashboard */}
      {!activeDiagnosis ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center glass-panel space-y-4">
          <Stethoscope className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-slate-200">No Active Diagnosis Loaded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Re-Run Diagnostic Scan" above or trigger a machine diagnosis from the Machines directory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Main Diagnosis & Supporting Evidence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Diagnosis Banner */}
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 glass-panel space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Identified Failure Mode</span>
                  <h3 className="text-xl font-black text-slate-100 mt-1">{activeDiagnosis.probableIssue}</h3>
                  <p className="text-xs text-slate-400 mt-1">Severity Tier: <strong className="text-rose-400 uppercase">{activeDiagnosis.severity}</strong></p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                  <div className="text-3xl font-black text-cyan-300">{activeDiagnosis.confidence}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Confidence Rating</div>
                </div>
              </div>

              {/* Supporting Evidence Signals */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Supporting Sensor Evidence</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDiagnosis.supportingEvidence.map((ev, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{ev.signal}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">{ev.change}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Baseline: <strong>{ev.baseline}</strong></span>
                        <span>Current: <strong className="text-cyan-300">{ev.currentValue}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Root Cause Hypotheses Probabilities */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Root Cause Hypotheses Matrix</h4>
              <div className="space-y-3">
                {activeDiagnosis.rootCauseHypotheses.map((hyp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{hyp.cause}</span>
                      <span className="font-black text-cyan-300">{hyp.probability}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${hyp.probability}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{hyp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Explainability & Actions */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" /> Explainability & Rationale
              </h4>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-cyan-300 text-[11px] uppercase mb-1">Why this diagnosis?</div>
                  Vibration amplitude spike (+112% to 8.4 mm/s) matched inner-ring micro-spalling spectral harmonics.
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-cyan-300 text-[11px] uppercase mb-1">Data Sources Evaluated</div>
                  7 Sensor Streams • 3 Historical Incidents • Bearing Housing Vibration Spectral FFT • Lubricant Thermal Dissipation Curve.
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-amber-300 text-[11px] uppercase mb-1">Alternatives Rejected</div>
                  Stator Winding Failure (Rejected: Phase voltage balanced) • Coupling Misalignment (Rejected: Radial vibration ratio inconsistent).
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setActiveView('simulator')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Sliders className="w-4 h-4" /> Simulate What-If Scenarios
                </button>

                <button
                  onClick={() => setActiveView('decision')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  Proceed to Decision Center <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
