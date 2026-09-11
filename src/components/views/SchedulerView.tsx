import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, CheckCircle2, X } from 'lucide-react';

export const SchedulerView: React.FC = () => {
  const {
    selectedMachine,
    technicians,
    inventory,
    setActiveView
  } = useApp();

  const [selectedSlotTime, setSelectedSlotTime] = useState('14:30 PM - 16:30 PM');
  const [slotStatus, setSlotStatus] = useState<'Proposed' | 'Accepted' | 'Cancelled'>('Proposed');
  const [selectedTechId, setSelectedTechId] = useState(technicians[0].id);

  const tech = technicians.find(t => t.id === selectedTechId) || technicians[0];
  const part = inventory[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Maintenance Window Scheduler</h2>
            <p className="text-xs text-slate-400">Optimizing production throughput, technician shifts, and spare part arrival timelines.</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Slot Timeline & Slot Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Proposed Maintenance Slots */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Generated Shift Handover Slots</h3>

          <div className="space-y-3">
            {/* Slot A (Recommended) */}
            <div
              onClick={() => setSelectedSlotTime('14:30 PM - 16:30 PM')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSlotTime === '14:30 PM - 16:30 PM'
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    RECOMMENDED SLOT
                  </span>
                  <h4 className="text-xs font-bold text-slate-100">Shift Handover Window A</h4>
                </div>
                <span className="text-xs font-bold text-cyan-300">14:30 PM - 16:30 PM</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[11px] mt-3 pt-3 border-t border-slate-800 text-slate-400">
                <div>Duration: <strong className="text-slate-200">120 Mins</strong></div>
                <div>Production Loss Risk: <strong className="text-emerald-400">Low (Shift Change)</strong></div>
                <div>Spare Availability: <strong className="text-emerald-400">Reserved (Shelf A-14)</strong></div>
              </div>
            </div>

            {/* Slot B */}
            <div
              onClick={() => setSelectedSlotTime('17:00 PM - 19:00 PM')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedSlotTime === '17:00 PM - 19:00 PM'
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-100">Evening Shift Change Window B</h4>
                <span className="text-xs font-bold text-slate-300">17:00 PM - 19:00 PM</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[11px] mt-3 pt-3 border-t border-slate-800 text-slate-400">
                <div>Duration: <strong className="text-slate-200">120 Mins</strong></div>
                <div>Production Loss Risk: <strong className="text-amber-400">Medium (Line Pause)</strong></div>
                <div>Spare Availability: <strong className="text-emerald-400">Available</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Slot Actions & Confirmation */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Slot Details & Authorization</h3>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div>Selected Window: <strong className="text-cyan-300">{selectedSlotTime}</strong></div>
              <div>Target Unit: <strong className="text-slate-200">{selectedMachine?.name || 'Turbine Generator T-700'}</strong></div>
              <div>Part Reserved: <strong className="text-emerald-300">{part.name} ({part.partNumber})</strong></div>
              <div>Assigned Specialist: <strong className="text-indigo-300">{tech.name} ({tech.role})</strong></div>
              <div>Status: <span className="font-bold text-amber-300 uppercase">{slotStatus}</span></div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Assigned Technician:</label>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 focus:outline-none"
              >
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.skill})</option>
                ))}
              </select>
            </div>

            {/* ALL 4 REQUIRED ACTIONS */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setSlotStatus('Accepted');
                  setActiveView('tickets');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" /> Accept Schedule Window
              </button>

              <button
                onClick={() => {
                  setSlotStatus('Cancelled');
                }}
                className="w-full py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" /> Cancel Maintenance Slot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
