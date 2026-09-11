import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Filter } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { machines } = useApp();

  const [selectedMachineFilter, setSelectedMachineFilter] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Chart dataset
  const healthTrendsData = [
    { day: 'Day 1', 'Average Health': 94, 'Anomaly Rate': 6 },
    { day: 'Day 5', 'Average Health': 93, 'Anomaly Rate': 7 },
    { day: 'Day 10', 'Average Health': 95, 'Anomaly Rate': 5 },
    { day: 'Day 15', 'Average Health': 91, 'Anomaly Rate': 9 },
    { day: 'Day 20', 'Average Health': 88, 'Anomaly Rate': 12 },
    { day: 'Day 25', 'Average Health': 94, 'Anomaly Rate': 6 },
    { day: 'Day 30', 'Average Health': 96, 'Anomaly Rate': 4 }
  ];

  const financialData = [
    { month: 'May', 'Cost Saved ($)': 45000, 'Maint Expense ($)': 8200 },
    { month: 'Jun', 'Cost Saved ($)': 52000, 'Maint Expense ($)': 9100 },
    { month: 'Jul', 'Cost Saved ($)': 48000, 'Maint Expense ($)': 7400 },
    { month: 'Aug', 'Cost Saved ($)': 64200, 'Maint Expense ($)': 11950 }
  ];

  const failureTypeData = [
    { category: 'Bearing Wear', count: 12 },
    { category: 'Seal Leakage', count: 7 },
    { category: 'Valve Sticking', count: 5 },
    { category: 'Coupling Slip', count: 3 },
    { category: 'Electrical Ripple', count: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 glass-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">Industrial Operations Analytics</h2>
            <p className="text-xs text-slate-400">Multi-chart suite tracking asset reliability, financial savings, and failure trends.</p>
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMachineFilter}
              onChange={(e) => setSelectedMachineFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Machines (10 Units)</option>
              {machines.map(m => (
                <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
              ))}
            </select>
          </div>

          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Health & Anomaly Rate Trend */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Fleet Health & Anomaly Frequency Trend</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Average Health" stroke="#38bdf8" strokeWidth={2} />
                <Line type="monotone" dataKey="Anomaly Rate" stroke="#f43f5e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cost Avoided vs Expense */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Financial ROI: Catastrophic Loss Avoided vs Maint Expense</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Cost Saved ($)" fill="#10b981" stroke="#10b981" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Maint Expense ($)" fill="#38bdf8" stroke="#38bdf8" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Failure Type Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-panel space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Failure Mode Frequency Distribution</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} name="Incidents Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
