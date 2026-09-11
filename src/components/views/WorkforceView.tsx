import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Technician } from '../../types';
import { Users, MapPin, UserCheck, ShieldCheck } from 'lucide-react';

export const WorkforceView: React.FC = () => {
  const {
    technicians,
    machines,
    assignTechnicianToMachine,
    setSelectedMachineId,
    setActiveView
  } = useApp();

  const [selectedTech, setSelectedTech] = useState<Technician>(technicians[0]);
  const [targetMachineId, setTargetMachineId] = useState<string>('m-07');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Workforce Dispatch & Skill Matching</h2>
            <p className="text-xs text-slate-400">AI-driven ISO certification matching, shift workload balancing, and technician dispatch.</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Technician Roster Cards + Selected Tech Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Technician Roster Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Certified Specialist Roster</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {technicians.map((tech) => {
              const isSelected = tech.id === selectedTech.id;
              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all glass-panel space-y-3 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{tech.name}</h4>
                      <p className="text-[11px] text-cyan-400 font-medium">{tech.role}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      tech.availability === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      tech.availability === 'On Shift' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {tech.availability}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> {tech.skill}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {tech.location}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Match Score: <strong className="text-cyan-300">{tech.matchScore}%</strong></span>
                    <span className="text-slate-400">Rating: <strong className="text-amber-300">★ {tech.rating}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Technician Dispatch Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
            <div>
              <span className="text-xs font-extrabold text-cyan-400">{selectedTech.id}</span>
              <h3 className="text-base font-bold text-slate-100 mt-0.5">{selectedTech.name}</h3>
              <p className="text-xs text-indigo-400 font-medium">{selectedTech.role}</p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Certifications & Credentials</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedTech.certifications.map((cert, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Current Workload</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{selectedTech.currentWorkload} Active Tasks</div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Est. Repair Duration</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{selectedTech.estimatedRepairTimeHours} Hours</div>
              </div>
            </div>

            {/* DISPATCH ACTION FORM */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dispatch Assignment</h4>
              
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Select Target Machine:</label>
                <select
                  value={targetMachineId}
                  onChange={(e) => setTargetMachineId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.name} ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  assignTechnicianToMachine(targetMachineId, selectedTech.id);
                  setSelectedMachineId(targetMachineId);
                  setActiveView('machines');
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
              >
                <UserCheck className="w-4 h-4" /> Assign {selectedTech.name} to Machine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
