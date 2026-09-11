import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_STEPS } from '../../services/demoOrchestrator';
import { Play, Pause, SkipForward, RotateCcw, Bot } from 'lucide-react';

export const DemoControlBar: React.FC = () => {
  const {
    isDemoRunning,
    demoStepIndex,
    pauseDemo,
    resumeDemo,
    nextDemoStep,
    resetDemo
  } = useApp();

  if (demoStepIndex === 0 && !isDemoRunning) return null;

  const currentStep = DEMO_STEPS.find(s => s.stepIndex === demoStepIndex) || DEMO_STEPS[0];
  const progressPercent = Math.round((demoStepIndex / DEMO_STEPS.length) * 100);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-4xl bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-4 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl transition-all duration-300">
      {/* Progress Line */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-sm shrink-0">
            {demoStepIndex}/{DEMO_STEPS.length}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wide">
                {currentStep.title}
              </span>
              {currentStep.agentId && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> {currentStep.agentId.toUpperCase()} AGENT
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{currentStep.description}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isDemoRunning ? (
            <button
              onClick={pauseDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold transition-colors"
            >
              <Pause className="w-3.5 h-3.5 fill-current" /> Pause
            </button>
          ) : (
            <button
              onClick={resumeDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-bold transition-colors shadow-md shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Resume
            </button>
          )}

          <button
            onClick={nextDemoStep}
            disabled={demoStepIndex >= DEMO_STEPS.length}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
          >
            <SkipForward className="w-3.5 h-3.5" /> Next
          </button>

          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-slate-700 transition-colors"
            title="Reset Scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
