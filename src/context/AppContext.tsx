import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type {
  Machine,
  Incident,
  AgentInfo,
  AgentActivityLog,
  AgentId,
  InventoryPart,
  Technician,
  MaintenanceTicket,
  LearningRecord,
  AppNotification,
  SystemSettings,
  ActiveView,
  TicketStatus,
  DiagnosisResult,
  DecisionResult,
  CostBreakdown,
  WhatIfScenario,
  AgentConflict
} from '../types';
import {
  INITIAL_MACHINES,
  INITIAL_INVENTORY,
  INITIAL_TECHNICIANS,
  INITIAL_AGENTS,
  INITIAL_LEARNING_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from '../services/mockData';
import {
  generateNextSensorTelemetry,
  calculateSensorAnomalyScore
} from '../services/sensorEngine';
import {
  runMonitoringAgent,
  runDiagnosisAgent,
  runInventoryAgent,
  runCostAgent,
  runWorkforceAgent,
  runSchedulerAgent,
  getWhatIfScenarios,
  generateAgentConflict,
  runDecisionAgent,
  createLearningMemoryFromRepair
} from '../services/agentEngine';
import {
  generateRandomizedMachines,
  generateDynamicIncident
} from '../services/proceduralGenerator';
import { DEMO_STEPS } from '../services/demoOrchestrator';

interface AppContextType {
  machines: Machine[];
  selectedMachineId: string;
  setSelectedMachineId: (id: string) => void;
  selectedMachine: Machine | undefined;
  
  incidents: Incident[];
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  selectedIncident: Incident | undefined;

  agents: AgentInfo[];
  agentLogs: AgentActivityLog[];
  inventory: InventoryPart[];
  technicians: Technician[];
  tickets: MaintenanceTicket[];
  learningRecords: LearningRecord[];
  notifications: AppNotification[];
  settings: SystemSettings;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Active Diagnosis & Decision cache
  activeDiagnosis: DiagnosisResult | null;
  activeCostBreakdown: CostBreakdown | null;
  activeScenarios: WhatIfScenario[];
  activeConflict: AgentConflict | null;
  activeDecision: DecisionResult | null;
  appliedScenarioId: string | null;

  // Simulation & Procedural controls
  isSimulating: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  injectAnomaly: (machineId?: string) => void;
  injectRandomIncident: (machineId?: string) => void;
  generateNewFactorySetup: () => void;

  // Machine #07 Demo orchestrator controls
  isDemoRunning: boolean;
  demoStepIndex: number;
  runMachine07Demo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  nextDemoStep: () => void;
  resetDemo: () => void;

  // Action methods
  triggerDiagnosisForMachine: (machineId: string) => void;
  reservePart: (partId: string) => void;
  releasePart: (partId: string) => void;
  addPartStock: (partId: string, quantity: number) => void;
  assignTechnicianToMachine: (machineId: string, techId: string) => void;
  
  approveIncident: (incidentId: string) => void;
  rejectIncident: (incidentId: string, reason?: string) => void;
  modifyIncidentAction: (incidentId: string, newAction: string) => void;
  
  createTicket: (ticket: Partial<MaintenanceTicket>) => void;
  updateTicketStatus: (
    ticketId: string,
    status: TicketStatus,
    notes?: string,
    actualIssue?: string,
    partsUsed?: string[]
  ) => void;
  
  applyScenario: (scenarioId: 'A' | 'B' | 'C' | 'D') => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetAllData: () => void;

  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const LOCAL_STORAGE_KEY = 'forgesyn_app_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or persisted state
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage:', e);
    }
    return null;
  };

  const persisted = getInitialState();

  const [machines, setMachines] = useState<Machine[]>(persisted?.machines || INITIAL_MACHINES);
  const [selectedMachineId, setSelectedMachineId] = useState<string>(persisted?.selectedMachineId || 'm-07');
  const [incidents, setIncidents] = useState<Incident[]>(persisted?.incidents || []);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(persisted?.selectedIncidentId || '');
  const [agents, setAgents] = useState<AgentInfo[]>(persisted?.agents || INITIAL_AGENTS);
  const [agentLogs, setAgentLogs] = useState<AgentActivityLog[]>(persisted?.agentLogs || []);
  const [inventory, setInventory] = useState<InventoryPart[]>(persisted?.inventory || INITIAL_INVENTORY);
  const [technicians, setTechnicians] = useState<Technician[]>(persisted?.technicians || INITIAL_TECHNICIANS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(persisted?.tickets || []);
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>(persisted?.learningRecords || INITIAL_LEARNING_RECORDS);
  const [notifications, setNotifications] = useState<AppNotification[]>(persisted?.notifications || INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<SystemSettings>(persisted?.settings || INITIAL_SETTINGS);
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  // Diagnosis & Decision State
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisResult | null>(persisted?.activeDiagnosis || null);
  const [activeCostBreakdown, setActiveCostBreakdown] = useState<CostBreakdown | null>(persisted?.activeCostBreakdown || null);
  const [activeScenarios, setActiveScenarios] = useState<WhatIfScenario[]>(persisted?.activeScenarios || getWhatIfScenarios());
  const [activeConflict, setActiveConflict] = useState<AgentConflict | null>(persisted?.activeConflict || generateAgentConflict());
  const [activeDecision, setActiveDecision] = useState<DecisionResult | null>(persisted?.activeDecision || null);
  const [appliedScenarioId, setAppliedScenarioId] = useState<string | null>(persisted?.appliedScenarioId || null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Simulation & Demo State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const demoTimerRef = useRef<any>(null);

  // Persistence side-effect
  useEffect(() => {
    try {
      const stateToSave = {
        machines,
        selectedMachineId,
        incidents,
        selectedIncidentId,
        agents,
        agentLogs: agentLogs.slice(-100), // Keep last 100 logs
        inventory,
        technicians,
        tickets,
        learningRecords,
        notifications: notifications.slice(-50),
        settings,
        activeDiagnosis,
        activeCostBreakdown,
        activeScenarios,
        activeConflict,
        activeDecision,
        appliedScenarioId
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [
    machines, selectedMachineId, incidents, selectedIncidentId, agents,
    agentLogs, inventory, technicians, tickets, learningRecords,
    notifications, settings, activeDiagnosis, activeCostBreakdown,
    activeScenarios, activeConflict, activeDecision, appliedScenarioId
  ]);

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const addAgentLog = (agentId: AgentId, message: string, type: 'info' | 'success' | 'warning' | 'error' | 'decision' = 'info') => {
    const agent = agents.find(a => a.id === agentId);
    const newLog: AgentActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId,
      agentName: agent ? agent.name : agentId,
      message,
      type
    };
    setAgentLogs(prev => [newLog, ...prev]);

    // Update Agent status in agent list
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          lastActive: 'Just now',
          status: type === 'error' ? 'warning' : type === 'success' ? 'completed' : 'working'
        };
      }
      return a;
    }));
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'], relatedEntityId?: string, relatedEntityType?: AppNotification['relatedEntityType']) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      relatedEntityId,
      relatedEntityType
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Live Sensor Engine Simulation interval
  useEffect(() => {
    if (!isSimulating && !isDemoRunning) return;

    const interval = setInterval(() => {
      setMachines(prevMachines => prevMachines.map(m => {
        // Machine #07 degrades if demo or anomaly is running; others fluctuate normally
        const isDegrading = (m.id === 'm-07' && (isDemoRunning || m.status === 'warning' || m.status === 'critical'));
        const newSensors = generateNextSensorTelemetry(m, isDegrading, 1.2);
        const anomalyScore = calculateSensorAnomalyScore(newSensors);
        const healthScore = Math.max(5, 100 - anomalyScore);

        const newPoint = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          ...newSensors
        };

        const newHistory = [...(m.telemetryHistory || []), newPoint].slice(-30);

        let status = m.status;
        if (anomalyScore > 80) status = 'critical';
        else if (anomalyScore > 35) status = 'warning';
        else if (status !== 'maintenance') status = 'healthy';

        return {
          ...m,
          sensors: newSensors,
          anomalyScore,
          healthScore,
          status,
          telemetryHistory: newHistory
        };
      }));
    }, 1500 / (settings.simulationSpeedMultiplier || 1));

    return () => clearInterval(interval);
  }, [isSimulating, isDemoRunning, settings.simulationSpeedMultiplier]);

  // Simulation Controls
  const startSimulation = () => {
    setIsSimulating(true);
    addNotification('Simulation Started', 'Live sensor telemetry feed activated.', 'info');
  };

  const pauseSimulation = () => {
    setIsSimulating(false);
    addNotification('Simulation Paused', 'Sensor stream update frozen.', 'info');
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setIsDemoRunning(false);
    setDemoStepIndex(0);
    setMachines(INITIAL_MACHINES);
    addNotification('Simulation Reset', 'All machines restored to baseline telemetry.', 'info');
  };

  const generateNewFactorySetup = () => {
    const newMachines = generateRandomizedMachines();
    setMachines(newMachines);
    setSelectedMachineId(newMachines[0].id);
    setIncidents([]);
    setSelectedIncidentId('');
    setActiveDiagnosis(null);
    setActiveCostBreakdown(null);
    setActiveDecision(null);
    addNotification('Factory Environment Regenerated', 'Dynamic stochastic baseline telemetry loaded across all units.', 'info');
    addAgentLog('monitoring', 'System re-initialized with fresh procedural factory telemetry.', 'info');
  };

  const injectRandomIncident = (targetId?: string) => {
    const targetM = targetId
      ? machines.find(m => m.id === targetId) || machines[0]
      : machines[Math.floor(Math.random() * machines.length)];

    const { incident, diagnosis, cost, conflict, decision } = generateDynamicIncident(targetM);

    setMachines(prev => prev.map(m => {
      if (m.id === targetM.id) {
        return {
          ...m,
          status: 'critical',
          anomalyScore: incident.anomalyScore,
          healthScore: 100 - incident.anomalyScore,
          predictedFailure: diagnosis.probableIssue,
          failureConfidence: diagnosis.confidence
        };
      }
      return m;
    }));

    setIncidents(prev => [incident, ...prev]);
    setSelectedIncidentId(incident.id);
    setSelectedMachineId(targetM.id);

    setActiveDiagnosis(diagnosis);
    setActiveCostBreakdown(cost);
    setActiveConflict(conflict);
    setActiveDecision(decision);

    addAgentLog('monitoring', `DYNAMIC ANOMALY DETECTED on ${targetM.name}: ${incident.triggerSensor}`, 'error');
    addAgentLog('diagnosis', `Diagnosis Agent synthesized issue: ${diagnosis.probableIssue} (${diagnosis.confidence}% confidence)`, 'decision');
    addAgentLog('cost', `Cost Agent calculated planned cost $${cost.totalMaintenanceCost} vs catastrophic penalty $${cost.potentialFailureCostIfIgnored} (Net Savings $${cost.estimatedSavings})`, 'info');
    addAgentLog('decision', `Decision Agent generated winning strategy: "${decision.recommendedAction}"`, 'decision');

    addNotification(`🚨 Anomaly Detected: ${targetM.name}`, `${incident.summary}`, 'anomaly', targetM.id, 'machine');
    setIsSimulating(true);
    setActiveView('incidents');
  };

  const injectAnomaly = (targetId: string = 'm-07') => {
    injectRandomIncident(targetId);
  };

  // Execution of Machine #07 Demo Steps
  const executeDemoStep = (stepIdx: number) => {
    setDemoStepIndex(stepIdx);
    const step = DEMO_STEPS.find(s => s.stepIndex === stepIdx);
    if (!step) {
      setIsDemoRunning(false);
      addNotification('Demo Complete', 'Machine #07 end-to-end multi-agent orchestration completed.', 'completion');
      return;
    }

    setActiveView(step.targetView);

    switch (stepIdx) {
      case 1:
        // Inject Anomaly & sensor degradation
        injectAnomaly('m-07');
        break;
      case 2: {
        // Monitoring Agent Log
        const m07Mon = machines.find(m => m.id === 'm-07') || INITIAL_MACHINES[6];
        const monRes = runMonitoringAgent(m07Mon);
        addAgentLog('monitoring', `Monitoring Agent verified vibration signal anomaly: ${monRes.triggerSensor} (Anomaly Score ${monRes.anomalyScore}%). Generated Incident INC-700.`, 'warning');
        break;
      }
      case 3:
        // Diagnosis Agent
        const targetM = machines.find(m => m.id === 'm-07') || INITIAL_MACHINES[6];
        const diag = runDiagnosisAgent(targetM, incidents[0] || { id: 'INC-700', machineId: 'm-07', machineName: targetM.name } as Incident);
        setActiveDiagnosis(diag);
        addAgentLog('diagnosis', `Diagnosis Agent identified: ${diag.probableIssue} (Confidence: ${diag.confidence}%).`, 'decision');
        break;
      case 4:
        // History Agent
        addAgentLog('history', 'History Agent found 2 similar historical bearing spalling incidents (2025-11-10 & 2026-03-22). Average repair time: 2.5h.', 'info');
        break;
      case 5:
        // Inventory Agent
        const invResult = runInventoryAgent(inventory);
        addAgentLog('inventory', `Inventory Agent verified part ${invResult.part.name}: ${invResult.quantity} available in Shelf A-14. Stock RESERVED.`, 'success');
        reservePart(invResult.part.id);
        break;
      case 6:
        // Cost Agent
        const part = inventory.find(p => p.partNumber === 'B-204') || inventory[0];
        const tech = technicians[0];
        const costB = runCostAgent(part, tech);
        setActiveCostBreakdown(costB);
        addAgentLog('cost', `Cost Agent calculated planned maintenance cost: $${costB.totalMaintenanceCost} vs catastrophic failure risk: $${costB.potentialFailureCostIfIgnored}. Net Savings: $${costB.estimatedSavings}.`, 'decision');
        break;
      case 7:
        // Workforce Agent
        const bestTech = runWorkforceAgent(technicians);
        addAgentLog('workforce', `Workforce Agent matched ${bestTech.name} (${bestTech.role}, Match Score: ${bestTech.matchScore}%). Assigned to dispatch queue.`, 'info');
        break;
      case 8:
        // Scheduler Agent
        const mObj = machines.find(m => m.id === 'm-07') || INITIAL_MACHINES[6];
        const slot = runSchedulerAgent(mObj, technicians[0], inventory[0]);
        addAgentLog('scheduler', `Scheduler Agent generated optimal maintenance slot: ${slot.startTime} - ${slot.endTime} (Shift Handover Window).`, 'info');
        break;
      case 9:
        // Multi-Agent Synthesis
        addAgentLog('decision', 'All 11 specialized agents completed analysis phase. Synthesizing recommendations.', 'info');
        break;
      case 10:
        // Conflict Detected
        const conflict = generateAgentConflict();
        setActiveConflict(conflict);
        addAgentLog('decision', `AGENT CONFLICT DETECTED: Diagnosis Agent (Immediate Halt) vs Production Operations (Line Continuity).`, 'warning');
        break;
      case 11:
        // What-If Simulator
        setActiveScenarios(getWhatIfScenarios());
        addAgentLog('decision', 'What-If Simulator evaluated 4 scenarios (A, B, C, D). Scenario C minimizes overall impact.', 'decision');
        break;
      case 12:
        // Decision Agent
        const m7 = machines.find(m => m.id === 'm-07') || INITIAL_MACHINES[6];
        const inc = incidents[0] || { id: 'INC-700', machineId: 'm-07', machineName: m7.name } as Incident;
        const cb = activeCostBreakdown || runCostAgent(inventory[0], technicians[0]);
        const dec = runDecisionAgent(m7, inc, cb);
        setActiveDecision(dec);
        setAppliedScenarioId('C');
        addAgentLog('decision', `Decision Agent selected winning strategy: "${dec.recommendedAction}" (Confidence: ${dec.confidence}%).`, 'decision');
        break;
      case 13:
        // Risk Agent
        addAgentLog('risk', 'Risk Agent classified action as MEDIUM RISK (Safety index compliant, 30% derate safe). Escalated to Human Approval Queue.', 'warning');
        addNotification('⚠️ Approval Required', 'Machine #07 load reduction & bearing replacement strategy requires operator approval.', 'approval');
        break;
      case 14:
        // Wait for human authorization (in demo, pauses brief moment before auto-approval)
        addAgentLog('action', 'Waiting for Human Authorization...', 'info');
        break;
      case 15:
        // Auto approve in demo
        if (incidents.length > 0) {
          approveIncident(incidents[0].id);
        } else {
          addAgentLog('action', 'Human Operator Approved maintenance action.', 'success');
        }
        break;
      case 16:
        // Action Agent creates Ticket
        const newTicket: MaintenanceTicket = {
          id: 'TCK-700',
          incidentId: incidents[0]?.id || 'INC-700',
          machineId: 'm-07',
          machineName: 'Turbine Generator T-700',
          machineCode: 'M-07',
          title: 'Bearing B-204 Replacement & Thermal Flush',
          issue: 'Main Drive Shaft Bearing B-204 Wear & Thermal Degradation',
          priority: 'critical',
          recommendedAction: 'Derate Turbine Load by 30% immediately and replace Bearing B-204 at 14:30',
          requiredPartId: inventory[0].id,
          requiredPartName: 'High-Precision Tapered Roller Bearing B-204',
          assignedTechnicianId: technicians[0].id,
          assignedTechnicianName: technicians[0].name,
          scheduledTime: '14:30 PM - 16:30 PM',
          estimatedDowntimeHours: 2.0,
          status: 'Open',
          createdAt: new Date().toLocaleTimeString()
        };
        setTickets(prev => [newTicket, ...prev.filter(t => t.id !== 'TCK-700')]);
        addAgentLog('action', 'Action Agent generated Maintenance Ticket TCK-700 and dispatched to Marcus Vance.', 'success');
        break;
      case 17:
        // Technician Starts Ticket
        updateTicketStatus('TCK-700', 'In Progress');
        addAgentLog('action', 'Technician Marcus Vance accepted ticket TCK-700 and initiated work at Bay 2.', 'info');
        break;
      case 18:
        // Complete Ticket
        updateTicketStatus(
          'TCK-700',
          'Completed',
          'Bearing B-204 replaced cleanly. Shaft re-aligned with laser tool. Oil seal renewed.',
          'Bearing B-204 Inner Race Micro-Spalling & Thermal Grease Breakdown',
          ['Bearing B-204', 'Viton Shaft Seal S-102']
        );
        addAgentLog('action', 'Technician Marcus Vance completed repair on Machine #07.', 'success');
        break;
      case 19:
        // Inventory Deduction
        setInventory(prev => prev.map(p => {
          if (p.partNumber === 'B-204') {
            return {
              ...p,
              quantity: Math.max(0, p.quantity - 1),
              reservedQuantity: Math.max(0, p.reservedQuantity - 1)
            };
          }
          return p;
        }));
        addAgentLog('inventory', 'Inventory System updated: Bearing B-204 stock decremented from 3 to 2.', 'info');
        break;
      case 20:
        // Machine Restoration
        setMachines(prev => prev.map(m => {
          if (m.id === 'm-07') {
            return {
              ...m,
              status: 'healthy',
              sensors: {
                temperature: 63.5,
                vibration: 2.4,
                pressure: 5.9,
                current: 11.1,
                rpm: 1485,
                load: 60,
                acousticLevel: 64
              },
              healthScore: 98,
              anomalyScore: 2,
              lastMaintenance: new Date().toISOString().split('T')[0],
              maintenanceHistory: [
                {
                  id: `rec-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  type: 'Corrective',
                  description: 'Bearing B-204 Replacement & Thermal Flush',
                  technicianId: technicians[0].id,
                  technicianName: technicians[0].name,
                  partsReplaced: ['Bearing B-204', 'Viton Shaft Seal S-102'],
                  cost: 1750,
                  downtimeHours: 2.0,
                  outcome: 'Successful'
                },
                ...m.maintenanceHistory
              ]
            };
          }
          return m;
        }));
        addAgentLog('monitoring', 'Machine #07 telemetry verified baseline. Status restored to HEALTHY (Health Score 98%).', 'success');
        break;
      case 21:
        // Learning Agent Record
        const mRec = machines.find(m => m.id === 'm-07') || INITIAL_MACHINES[6];
        const incRec = incidents[0] || { id: 'INC-700', machineId: 'm-07', machineName: mRec.name } as Incident;
        const newMemory = createLearningMemoryFromRepair(
          incRec,
          mRec,
          'Bearing B-204 Inner Race Micro-Spalling & Thermal Grease Breakdown',
          'Bearing replacement completed cleanly. Shaft laser aligned.',
          ['Bearing B-204', 'Viton Shaft Seal S-102']
        );
        setLearningRecords(prev => [newMemory, ...prev]);
        addAgentLog('learning', `Learning Agent recorded 94% diagnostic accuracy. Recalibrated vibration sensitivity threshold rules.`, 'decision');
        addNotification('✅ Learning Loop Completed', 'Post-repair feedback logged to AI Knowledge Memory.', 'completion');
        break;
    }
  };

  const runMachine07Demo = () => {
    setIsDemoRunning(true);
    setIsSimulating(true);
    executeDemoStep(1);
  };

  // Demo step timer loop
  useEffect(() => {
    if (!isDemoRunning) return;

    const currentStep = DEMO_STEPS.find(s => s.stepIndex === demoStepIndex);
    if (!currentStep) return;

    demoTimerRef.current = setTimeout(() => {
      if (demoStepIndex < DEMO_STEPS.length) {
        executeDemoStep(demoStepIndex + 1);
      } else {
        setIsDemoRunning(false);
      }
    }, currentStep.autoDelayMs);

    return () => clearTimeout(demoTimerRef.current);
  }, [isDemoRunning, demoStepIndex]);

  const pauseDemo = () => {
    setIsDemoRunning(false);
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
  };

  const resumeDemo = () => {
    setIsDemoRunning(true);
    if (demoStepIndex === 0) {
      executeDemoStep(1);
    }
  };

  const nextDemoStep = () => {
    if (demoStepIndex < DEMO_STEPS.length) {
      executeDemoStep(demoStepIndex + 1);
    }
  };

  const resetDemo = () => {
    pauseDemo();
    setDemoStepIndex(0);
    resetSimulation();
  };

  // Action Triggers
  const triggerDiagnosisForMachine = (machineId: string) => {
    const targetM = machines.find(m => m.id === machineId) || selectedMachine;
    setSelectedMachineId(targetM.id);
    const mockInc: Incident = {
      id: `INC-DIAG-${Date.now().toString().slice(-4)}`,
      machineId: targetM.id,
      machineName: targetM.name,
      machineCode: targetM.code,
      detectionTime: new Date().toLocaleTimeString(),
      severity: targetM.anomalyScore > 60 ? 'critical' : 'warning',
      anomalyScore: targetM.anomalyScore,
      triggerSensor: `Multi-Sensor Assessment (${targetM.anomalyScore}% Anomaly)`,
      status: 'diagnosing',
      approvalStatus: 'pending',
      summary: `Automated AI diagnostic investigation triggered for ${targetM.name}`
    };

    const diag = runDiagnosisAgent(targetM, mockInc);
    setActiveDiagnosis(diag);
    const cost = runCostAgent(inventory[0], technicians[0]);
    setActiveCostBreakdown(cost);
    const dec = runDecisionAgent(targetM, mockInc, cost);
    setActiveDecision(dec);

    addAgentLog('diagnosis', `Manual Diagnosis triggered for ${targetM.name}. Issue: ${diag.probableIssue} (${diag.confidence}% confidence).`, 'decision');
    setActiveView('diagnosis');
  };

  const reservePart = (partId: string) => {
    setInventory(prev => prev.map(p => {
      if (p.id === partId || p.partNumber === partId) {
        return {
          ...p,
          reservedQuantity: Math.min(p.quantity, p.reservedQuantity + 1),
          status: p.quantity - (p.reservedQuantity + 1) === 0 ? 'RESERVED' : p.status
        };
      }
      return p;
    }));
    addNotification('Part Reserved', `Spare part stock reserved successfully.`, 'inventory');
  };

  const releasePart = (partId: string) => {
    setInventory(prev => prev.map(p => {
      if (p.id === partId || p.partNumber === partId) {
        return {
          ...p,
          reservedQuantity: Math.max(0, p.reservedQuantity - 1),
          status: 'AVAILABLE'
        };
      }
      return p;
    }));
    addNotification('Part Released', `Spare part reservation released.`, 'inventory');
  };

  const addPartStock = (partId: string, qty: number) => {
    setInventory(prev => prev.map(p => {
      if (p.id === partId || p.partNumber === partId) {
        const newQty = p.quantity + qty;
        return {
          ...p,
          quantity: newQty,
          status: newQty > p.minStock ? 'AVAILABLE' : 'LOW_STOCK'
        };
      }
      return p;
    }));
    addNotification('Stock Updated', `Added ${qty} units to inventory.`, 'inventory');
  };

  const assignTechnicianToMachine = (machineId: string, techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    if (!tech) return;

    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        return { ...m, assignedTechnicianId: techId };
      }
      return m;
    }));

    addAgentLog('workforce', `Technician ${tech.name} assigned to Machine ${machineId}.`, 'info');
    addNotification('Technician Assigned', `${tech.name} assigned to service machine.`, 'workforce');
  };

  const approveIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId || incidentId === 'INC-700') {
        return {
          ...inc,
          approvalStatus: 'approved',
          status: 'ticket_created'
        };
      }
      return inc;
    }));

    addAgentLog('action', `Human Operator APPROVED recommendation for incident ${incidentId}.`, 'success');
    addNotification('Action Approved', `Maintenance action approved by human operator.`, 'approval');
  };

  const rejectIncident = (incidentId: string, reason: string = 'Operator override') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          approvalStatus: 'rejected',
          status: 'resolved'
        };
      }
      return inc;
    }));

    addAgentLog('action', `Human Operator REJECTED recommendation for incident ${incidentId}. Reason: ${reason}`, 'warning');
    addNotification('Action Rejected', `Maintenance recommendation rejected: ${reason}`, 'approval');
  };

  const modifyIncidentAction = (incidentId: string, newAction: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          recommendedAction: newAction,
          approvalStatus: 'modified'
        };
      }
      return inc;
    }));

    addAgentLog('action', `Human Operator MODIFIED action for incident ${incidentId} to: "${newAction}".`, 'info');
  };

  const createTicket = (ticketData: Partial<MaintenanceTicket>) => {
    const newT: MaintenanceTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      machineId: ticketData.machineId || 'm-07',
      machineName: ticketData.machineName || 'Turbine Generator T-700',
      machineCode: ticketData.machineCode || 'M-07',
      title: ticketData.title || 'Scheduled Preventive Maintenance',
      issue: ticketData.issue || 'Vibration anomaly check',
      priority: ticketData.priority || 'high',
      recommendedAction: ticketData.recommendedAction || 'Inspect and recalibrate bearing housing',
      requiredPartId: ticketData.requiredPartId || 'p-204',
      requiredPartName: ticketData.requiredPartName || 'Bearing B-204',
      assignedTechnicianId: ticketData.assignedTechnicianId || 't-03',
      assignedTechnicianName: ticketData.assignedTechnicianName || 'Marcus Vance',
      scheduledTime: ticketData.scheduledTime || '14:30 PM',
      estimatedDowntimeHours: ticketData.estimatedDowntimeHours || 2.0,
      status: 'Open',
      createdAt: new Date().toLocaleTimeString()
    };

    setTickets(prev => [newT, ...prev]);
    addAgentLog('action', `Maintenance Ticket ${newT.id} created successfully.`, 'success');
    addNotification('Ticket Created', `Work Order ${newT.id} generated for ${newT.machineName}.`, 'ticket');
  };

  const updateTicketStatus = (
    ticketId: string,
    status: TicketStatus,
    notes?: string,
    actualIssue?: string,
    partsUsed?: string[]
  ) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId || (ticketId === 'TCK-700' && t.id.includes('700'))) {
        const updated: MaintenanceTicket = {
          ...t,
          status,
          startedAt: status === 'In Progress' ? new Date().toLocaleTimeString() : t.startedAt,
          completedAt: status === 'Completed' ? new Date().toLocaleTimeString() : t.completedAt,
          technicianNotes: notes || t.technicianNotes,
          actualIssueFound: actualIssue || t.actualIssueFound,
          actualPartsUsed: partsUsed || t.actualPartsUsed
        };
        return updated;
      }
      return t;
    }));

    addAgentLog('action', `Ticket ${ticketId} status updated to: ${status}.`, 'info');
    if (status === 'Completed') {
      addNotification('🔧 Maintenance Completed', `Work Order ${ticketId} completed by technician.`, 'completion');
    }
  };

  const applyScenario = (scenarioId: 'A' | 'B' | 'C' | 'D') => {
    setAppliedScenarioId(scenarioId);
    const sc = activeScenarios.find(s => s.id === scenarioId);
    if (!sc) return;

    if (activeDecision) {
      setActiveDecision({
        ...activeDecision,
        recommendedAction: sc.action,
        reason: `Applied What-If Scenario ${sc.id}: ${sc.description}`,
        riskLevel: sc.riskLevel
      });
    }

    addAgentLog('decision', `Applied What-If Scenario ${sc.id}: "${sc.name}" (Estimated Impact: $${sc.totalEstimatedImpact}).`, 'decision');
    addNotification('Scenario Applied', `Scenario ${sc.id} set as active operational response plan.`, 'info');
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addNotification('Settings Saved', 'System operational parameters updated.', 'info');
  };

  const resetAllData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setMachines(INITIAL_MACHINES);
    setSelectedMachineId('m-07');
    setIncidents([]);
    setSelectedIncidentId('');
    setAgents(INITIAL_AGENTS);
    setAgentLogs([]);
    setInventory(INITIAL_INVENTORY);
    setTechnicians(INITIAL_TECHNICIANS);
    setTickets([]);
    setLearningRecords(INITIAL_LEARNING_RECORDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setActiveDiagnosis(null);
    setActiveCostBreakdown(null);
    setActiveScenarios(getWhatIfScenarios());
    setActiveConflict(generateAgentConflict());
    setActiveDecision(null);
    setAppliedScenarioId(null);
    setIsSimulating(false);
    setIsDemoRunning(false);
    setDemoStepIndex(0);
    setActiveView('overview');
    addNotification('System Reset', 'All application data restored to original default factory state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        machines,
        selectedMachineId,
        setSelectedMachineId,
        selectedMachine,
        incidents,
        selectedIncidentId,
        setSelectedIncidentId,
        selectedIncident,
        agents,
        agentLogs,
        inventory,
        technicians,
        tickets,
        learningRecords,
        notifications,
        settings,
        activeView,
        setActiveView,
        activeDiagnosis,
        activeCostBreakdown,
        activeScenarios,
        activeConflict,
        activeDecision,
        appliedScenarioId,
        isSimulating,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        injectAnomaly,
        isDemoRunning,
        demoStepIndex,
        runMachine07Demo,
        pauseDemo,
        resumeDemo,
        nextDemoStep,
        resetDemo,
        triggerDiagnosisForMachine,
        reservePart,
        releasePart,
        addPartStock,
        assignTechnicianToMachine,
        approveIncident,
        rejectIncident,
        modifyIncidentAction,
        createTicket,
        updateTicketStatus,
        applyScenario,
        dismissNotification,
        clearAllNotifications,
        updateSettings,
        resetAllData,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
