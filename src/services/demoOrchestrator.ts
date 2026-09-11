import type { AgentId, ActiveView } from '../types';

export interface DemoStepInfo {
  stepIndex: number;
  title: string;
  agentId?: AgentId;
  description: string;
  targetView: ActiveView;
  autoDelayMs: number;
}

export const DEMO_STEPS: DemoStepInfo[] = [
  {
    stepIndex: 1,
    title: 'Machine #07 Telemetry Degradation',
    agentId: 'monitoring',
    description: 'Sensor values begin increasing: Vibration rising to 8.4 mm/s, Bearing Temp rising to 78.5°C.',
    targetView: 'monitoring',
    autoDelayMs: 2500
  },
  {
    stepIndex: 2,
    title: 'Monitoring Agent Anomaly Alert',
    agentId: 'monitoring',
    description: 'Monitoring Agent triggers Anomaly Alert (Anomaly Score 91%, Critical threshold exceeded).',
    targetView: 'monitoring',
    autoDelayMs: 2500
  },
  {
    stepIndex: 3,
    title: 'Diagnosis Agent Analysis',
    agentId: 'diagnosis',
    description: 'Diagnosis Agent correlates multi-sensor signals and identifies Bearing B-204 degradation (87% confidence).',
    targetView: 'diagnosis',
    autoDelayMs: 3000
  },
  {
    stepIndex: 4,
    title: 'History Agent Case Match',
    agentId: 'history',
    description: 'History Agent searches past archives and retrieves 2 similar historical bearing failure records.',
    targetView: 'history',
    autoDelayMs: 2500
  },
  {
    stepIndex: 5,
    title: 'Inventory Agent Stock Verification',
    agentId: 'inventory',
    description: 'Inventory Agent checks shelf stock for Bearing B-204 (Quantity: 3 available in Shelf A-14).',
    targetView: 'inventory',
    autoDelayMs: 2500
  },
  {
    stepIndex: 6,
    title: 'Cost & Impact Financial Calculation',
    agentId: 'cost',
    description: 'Cost Agent calculates maintenance cost ($11,950) vs catastrophic failure risk ($109,500).',
    targetView: 'decision',
    autoDelayMs: 2500
  },
  {
    stepIndex: 7,
    title: 'Workforce Agent Skill Match',
    agentId: 'workforce',
    description: 'Workforce Agent matches Technician Marcus Vance (92% skill match, ISO Vibration Level III).',
    targetView: 'workforce',
    autoDelayMs: 2500
  },
  {
    stepIndex: 8,
    title: 'Scheduler Maintenance Slot Assignment',
    agentId: 'scheduler',
    description: 'Scheduler Agent proposes 2:30 PM - 4:30 PM shift changeover maintenance slot.',
    targetView: 'scheduler',
    autoDelayMs: 2500
  },
  {
    stepIndex: 9,
    title: 'Multi-Agent Recommendation Synthesis',
    agentId: 'decision',
    description: 'All 11 agents produce individual operational recommendations.',
    targetView: 'agents',
    autoDelayMs: 2500
  },
  {
    stepIndex: 10,
    title: 'Agent Conflict Detection',
    agentId: 'decision',
    description: 'Conflict detected between Diagnosis Agent (Immediate Halt) vs Production Operations (Continuous Output).',
    targetView: 'decision',
    autoDelayMs: 3000
  },
  {
    stepIndex: 11,
    title: 'What-If Simulation Comparison',
    agentId: 'decision',
    description: 'What-If Simulator compares 4 operational scenarios (A, B, C, D) across risk, downtime, and cost.',
    targetView: 'simulator',
    autoDelayMs: 3500
  },
  {
    stepIndex: 12,
    title: 'Decision Agent Optimal Strategy Selection',
    agentId: 'decision',
    description: 'Decision Agent selects Scenario C: "Derate Load 30% -> Repair at 14:30" (91% confidence).',
    targetView: 'decision',
    autoDelayMs: 3000
  },
  {
    stepIndex: 13,
    title: 'Risk Agent Tier Evaluation',
    agentId: 'risk',
    description: 'Risk Agent classifies action as MEDIUM RISK -> Escalates to Human Approval Queue.',
    targetView: 'decision',
    autoDelayMs: 2500
  },
  {
    stepIndex: 14,
    title: 'Human Authorization Requirement',
    agentId: 'risk',
    description: 'System awaits Human Operator approval for scheduled load reduction & ticket dispatch.',
    targetView: 'incidents',
    autoDelayMs: 3500
  },
  {
    stepIndex: 15,
    title: 'Human Operator Approval Authorized',
    agentId: 'action',
    description: 'Operator approves recommended maintenance action.',
    targetView: 'incidents',
    autoDelayMs: 2000
  },
  {
    stepIndex: 16,
    title: 'Action Agent Work Order Generation',
    agentId: 'action',
    description: 'Maintenance Ticket #TCK-700 created automatically and dispatched to Marcus Vance.',
    targetView: 'tickets',
    autoDelayMs: 2500
  },
  {
    stepIndex: 17,
    title: 'Technician Work Execution Started',
    agentId: 'action',
    description: 'Technician Marcus Vance accepts task and initiates Bearing B-204 replacement.',
    targetView: 'tickets',
    autoDelayMs: 2500
  },
  {
    stepIndex: 18,
    title: 'Technician Repair Completed',
    agentId: 'action',
    description: 'Repair completed, shaft aligned, and machine sensor baseline re-verified.',
    targetView: 'tickets',
    autoDelayMs: 2500
  },
  {
    stepIndex: 19,
    title: 'Inventory Stock Deduction & Part Reservation',
    agentId: 'inventory',
    description: 'Inventory updated: Bearing B-204 stock decremented from 3 to 2.',
    targetView: 'inventory',
    autoDelayMs: 2500
  },
  {
    stepIndex: 20,
    title: 'Machine Telemetry Restoration & History Logged',
    agentId: 'monitoring',
    description: 'Machine #07 status restored to HEALTHY (Health Score 98%). History record appended.',
    targetView: 'machines',
    autoDelayMs: 2500
  },
  {
    stepIndex: 21,
    title: 'Learning Agent Feedback Loop & Model Update',
    agentId: 'learning',
    description: 'Learning Agent records 94% diagnostic accuracy and updates model rule parameters.',
    targetView: 'memory',
    autoDelayMs: 3000
  }
];
