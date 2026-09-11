import React from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, Target } from 'lucide-react';

export const AIMemoryView: React.FC = () => {
  const { learningRecords } = useApp();

  const avgAccuracy = Math.round(
    learningRecords.reduce((sum, r) => sum + r.accuracyScore, 0) / (learningRecords.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">AI Knowledge Memory & Continuous Learning</h2>
            <p className="text-xs text-slate-400">Post-repair feedback loop auditing AI predictions against technician ground truth.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Average Diagnostic Accuracy:</span>
          <span className="text-sm font-black text-cyan-300 flex items-center gap-1">
            <Target className="w-4 h-4 text-cyan-400" /> {avgAccuracy}%
          </span>
        </div>
      </div>

      {/* Workflow Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-cyan-300 font-extrabold tracking-wider uppercase">
        <span>DETECT</span> <span>→</span>
        <span>DIAGNOSE</span> <span>→</span>
        <span>ACT</span> <span>→</span>
        <span className="text-emerald-400 underline">LEARN & RECALIBRATE</span>
      </div>

      {/* Learning Memory Records Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Learning Audit History</h3>
        {learningRecords.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">No learning memory records logged yet.</div>
        ) : (
          learningRecords.map(record => (
            <div
              key={record.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-cyan-400">{record.machineName}</span>
                  <span className="text-[10px] text-slate-500">{record.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {record.accuracyScore}% ACCURACY ({record.outcome})
                </span>
              </div>

              {/* Comparison Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-extrabold text-cyan-400 text-[10px] uppercase">AI Diagnostic Prediction</span>
                  <p className="text-slate-200 font-medium">{record.aiPredictedIssue}</p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-extrabold text-emerald-400 text-[10px] uppercase">Technician Actual Discovery</span>
                  <p className="text-slate-200 font-medium">{record.actualIssueFound}</p>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div>Technician Feedback: <span className="text-slate-400">{record.technicianFeedback}</span></div>
                <div>Model Recalibration Adjustment: <strong className="text-cyan-300">{record.modelAdjustmentMade}</strong></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
