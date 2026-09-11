export type MachineStatus = 'healthy' | 'warning' | 'critical' | 'maintenance' | 'offline';

export interface SensorData {
  temperature: number;      // °C (normal: 50-70)
  vibration: number;        // mm/s (normal: 1.5-4.0)
  pressure: number;         // bar (normal: 5.0-6.5)
  current: number;          // A (normal: 9.0-13.0)
  rpm: number;              // RPM (normal: 1450-1500)
  load: number;             // % (normal: 45-75)
  acousticLevel: number;    // dB (normal: 60-75)
}

export interface TelemetryPoint extends SensorData {
  timestamp: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection';
  description: string;
  technicianId: string;
  technicianName: string;
  partsReplaced: string[];
  cost: number;
  downtimeHours: number;
  outcome: 'Successful' | 'Partial' | 'Recurred';
  notes?: string;
}

export interface Machine {
  id: string;
  code: string; // e.g. "M-07"
  name: string;
  type: string;
  location: string;
  factory: string;
  status: MachineStatus;
  sensors: SensorData;
  telemetryHistory: TelemetryPoint[];
  healthScore: number;       // 0 - 100
  anomalyScore: number;      // 0 - 100%
  predictedFailure?: string;
  failureConfidence?: number;// 0 - 100%
  timeToFailureHours?: number;
  lastMaintenance: string;
  nextMaintenance: string;
  operatingHours: number;
  maintenanceHistory: MaintenanceRecord[];
  assignedTechnicianId?: string;
  activeIncidentId?: string;
  image?: string;
}

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical' | 'warning';
export type IncidentStatus = 'detected' | 'diagnosing' | 'simulating' | 'pending_approval' | 'ticket_created' | 'in_progress' | 'resolved';

export interface Incident {
  id: string;
  machineId: string;
  machineName: string;
  machineCode: string;
  detectionTime: string;
  severity: SeverityLevel;
  anomalyScore: number;
  triggerSensor: string; // e.g., "Vibration (8.4 mm/s)"
  status: IncidentStatus;
  assignedTechnicianId?: string;
  recommendedAction?: string;
  approvalStatus: 'none' | 'pending' | 'approved' | 'rejected' | 'modified';
  ticketId?: string;
  summary: string;
}

export type AgentId = 
  | 'monitoring'
  | 'diagnosis'
  | 'history'
  | 'inventory'
  | 'cost'
  | 'workforce'
  | 'scheduler'
  | 'decision'
  | 'risk'
  | 'action'
  | 'learning';

export type AgentStatus = 'idle' | 'working' | 'completed' | 'waiting' | 'warning' | 'failed';

export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  lastActive: string;
  description: string;
  currentTask?: string;
}

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  agentId: AgentId;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'decision';
  dataPayload?: any;
}

export interface SupportingEvidence {
  signal: string;
  change: string;
  baseline: string;
  currentValue: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface RootCauseHypothesis {
  cause: string;
  probability: number;
  description: string;
}

export interface DiagnosisResult {
  id: string;
  incidentId: string;
  machineId: string;
  probableIssue: string;
  confidence: number; // %
  severity: SeverityLevel;
  supportingEvidence: SupportingEvidence[];
  rootCauseHypotheses: RootCauseHypothesis[];
  historicalSimilarIncidentsCount: number;
  timestamp: string;
}

export interface InventoryPart {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  warehouseLocation: string;
  compatibleMachines: string[];
  unitCost: number;
  supplier: string;
  leadTimeDays: number;
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'RESERVED';
  reservedQuantity: number;
}

export interface Technician {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  skill: string;
  certifications: string[];
  availability: 'Available' | 'On Shift' | 'Busy' | 'Off Duty';
  currentWorkload: number; // tasks active
  location: string;
  estimatedRepairTimeHours: number;
  matchScore?: number; // %
  rating: number; // 1-5
  phone?: string;
}

export interface CostBreakdown {
  sparePartsCost: number;
  laborCost: number;
  estimatedDowntimeHours: number;
  productionLossCost: number;
  potentialFailureCostIfIgnored: number;
  totalMaintenanceCost: number;
  estimatedSavings: number;
  calculationDetails: string[];
}

export interface MaintenanceScheduleSlot {
  id: string;
  machineId: string;
  machineName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  technicianId: string;
  technicianName: string;
  sparePartId: string;
  sparePartName: string;
  urgency: SeverityLevel;
  productionLossRisk: 'Low' | 'Medium' | 'High';
  status: 'Proposed' | 'Accepted' | 'Rescheduled' | 'Cancelled';
}

export interface WhatIfScenario {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  description: string;
  action: string;
  riskLevel: SeverityLevel;
  downtimeHours: number;
  productionLossCost: number;
  maintenanceCost: number;
  potentialFailureCost: number;
  totalEstimatedImpact: number;
  failureProbabilityPercent: number;
  isRecommended?: boolean;
}

export interface AgentRecommendation {
  agentId: AgentId;
  agentName: string;
  recommendation: string;
  priority: 'Immediate' | 'Scheduled' | 'Deferred' | 'Conditional';
  reasoning: string;
}

export interface AgentConflict {
  id: string;
  title: string;
  description: string;
  recommendations: AgentRecommendation[];
  conflictReason: string;
  resolutionStrategy: string;
  winningDecision: string;
  tradeoffRationale: string;
}

export interface DecisionResult {
  id: string;
  incidentId: string;
  machineId: string;
  recommendedAction: string;
  reason: string;
  confidence: number;
  evidenceSummary: string[];
  expectedImpact: string;
  costBreakdown: CostBreakdown;
  riskLevel: SeverityLevel;
  alternativesRejected: { option: string; reason: string }[];
  timestamp: string;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'Open' | 'Approved' | 'Assigned' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface MaintenanceTicket {
  id: string;
  incidentId?: string;
  machineId: string;
  machineName: string;
  machineCode: string;
  title: string;
  issue: string;
  priority: TicketPriority;
  recommendedAction: string;
  requiredPartId: string;
  requiredPartName: string;
  assignedTechnicianId: string;
  assignedTechnicianName: string;
  scheduledTime: string;
  estimatedDowntimeHours: number;
  actualDowntimeHours?: number;
  status: TicketStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  technicianNotes?: string;
  actualIssueFound?: string;
  actualPartsUsed?: string[];
}

export interface LearningRecord {
  id: string;
  incidentId: string;
  machineId: string;
  machineName: string;
  date: string;
  aiPredictedIssue: string;
  actualIssueFound: string;
  accuracyScore: number; // 0-100%
  technicianFeedback: string;
  partsUsed: string[];
  actualRepairDurationHours: number;
  modelAdjustmentMade: string;
  outcome: 'Exact Match' | 'Close Match' | 'Misdiagnosis';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'anomaly' | 'diagnosis' | 'inventory' | 'workforce' | 'approval' | 'ticket' | 'completion' | 'info';
  timestamp: string;
  read: boolean;
  relatedEntityId?: string;
  relatedEntityType?: 'machine' | 'incident' | 'ticket' | 'approval';
}

export interface SystemSettings {
  simulationSpeedMultiplier: number; // 1x, 2x, 5x, 10x
  tempWarningThreshold: number;      // e.g. 75°C
  tempCriticalThreshold: number;     // e.g. 85°C
  vibrationWarningThreshold: number; // e.g. 5.0 mm/s
  vibrationCriticalThreshold: number;// e.g. 8.0 mm/s
  autoApproveLowRisk: boolean;
  demoModeActive: boolean;
  notificationsEnabled: boolean;
  factoryName: string;
  soundAlerts: boolean;
}

export type ActiveView = 
  | 'overview'
  | 'monitoring'
  | 'machines'
  | 'incidents'
  | 'agents'
  | 'diagnosis'
  | 'inventory'
  | 'workforce'
  | 'scheduler'
  | 'simulator'
  | 'decision'
  | 'tickets'
  | 'history'
  | 'memory'
  | 'analytics'
  | 'settings';
