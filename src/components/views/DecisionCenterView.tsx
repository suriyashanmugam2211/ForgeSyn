import React from 'react';
import { useApp } from '../../context/AppContext';
import { GitMerge, CheckCircle2, ShieldAlert, Bot } from 'lucide-react';

export const DecisionCenterView: React.FC = () => {
  const {
    activeConflict,
    activeDecision,
    approveIncident,
    incidents,
    setActiveView
  } = useApp();

  const conflict = activeConflict || {
    title: 'Operational Conflict: Immediate Shutdown vs Production Line Continuity',
    description: 'Diagnosis Agent demands immediate halt; Production Operations Agent requires zero peak-hour downtime.',
    winningDecision: 'Reduce load by 30% immediately, continue operation for 45 mins, perform Bearing B-204 replacement at 2:30 PM.',
    tradeoffRationale: 'Derating load reduces vibration amplitude by ~42% below damage threshold, preventing failure while saving $11,200 in production loss.',
    recommendations: []
  };

  const decision = activeDecision || {
    recommendedAction: 'Derate Turbine Load by 30% immediately and perform Bearing B-204 replacement at 2:30 PM',
    reason: 'Derating load stabilizes mechanical vibration below damage threshold while preserving shift continuity.',
    confidence: 91,
    riskLevel: 'medium',
    expectedImpact: 'Prevents catastrophic turbine rotor failure, avoids $18,500 in downtime loss.',
    evidenceSummary: [
      'Vibration spike (+112%) matches Bearing B-204 degradation pattern.',
      'Part B-204 confirmed in stock (Shelf A-14).',
      'Technician Marcus Vance (92% match) available at 14:30.'
    ],
    alternativesRejected: [
      { option: 'Immediate Full Shutdown', reason: 'Excessive lost production cost ($23,150) when derating safely bridges to shift change.' },
      { option: 'Continue 100% Load', reason: 'Unacceptable 89% catastrophic rotor failure probability.' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Agent Conflict Resolution & Decision Engine</h2>
            <p className="text-xs text-slate-400">Synthesizing multi-agent trade-offs into an authorized action strategy.</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (incidents.length > 0) approveIncident(incidents[0].id);
            setActiveView('incidents');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" /> Send Strategy to Human Approval Queue
        </button>
      </div>

      {/* Main Grid: Conflict Resolution Panel + Decision Rationale Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Agent Conflict Resolution Box */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Multi-Agent Conflict Resolution Matrix
            </h3>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              CONFLICT RESOLVED
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {conflict.description}
          </p>

          {/* Competing Recommendations List */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Competing Agent Inputs</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {conflict.recommendations.map((rec, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-cyan-300 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" /> {rec.agentName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{rec.priority}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{rec.recommendation}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{rec.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Winning Strategy Breakdown */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/40 space-y-2">
            <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Winning Decision Strategy
            </div>
            <p className="text-sm font-bold text-slate-100">{conflict.winningDecision}</p>
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300">Why this decision won:</strong> {conflict.tradeoffRationale}
            </div>
          </div>
        </div>

        {/* Right Col: Final Decision Card & Explainability */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Decision Agent</span>
                <span className="text-xs font-extrabold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                  {decision.confidence}% CONFIDENCE
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mt-2 leading-snug">{decision.recommendedAction}</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-400 text-[10px] uppercase mb-1">Expected Impact</div>
                <p className="text-cyan-200">{decision.expectedImpact}</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-400 text-[10px] uppercase">Supporting Evidence</div>
                {decision.evidenceSummary.map((ev, idx) => (
                  <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                    <span className="text-cyan-400">•</span> <span>{ev}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-amber-300 text-[10px] uppercase">Alternatives Rejected</div>
                {decision.alternativesRejected.map((alt, idx) => (
                  <div key={idx} className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">{alt.option}:</strong> {alt.reason}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (incidents.length > 0) approveIncident(incidents[0].id);
                setActiveView('incidents');
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Strategy & Open Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
