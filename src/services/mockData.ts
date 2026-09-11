import type {
  Machine,
  InventoryPart,
  Technician,
  AgentInfo,
  LearningRecord,
  AppNotification,
  SystemSettings
} from '../types';

export const INITIAL_MACHINES: Machine[] = [
  {
    id: 'm-01',
    code: 'M-01',
    name: 'CNC Milling Center Alpha',
    type: '5-Axis CNC Mill',
    location: 'Bay A - Machining',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 62.4,
      vibration: 2.1,
      pressure: 5.8,
      current: 11.2,
      rpm: 1480,
      load: 58,
      acousticLevel: 64
    },
    telemetryHistory: Array.from({ length: 15 }, (_, i) => ({
      timestamp: `${10 + Math.floor(i / 2)}:${(i % 2) * 30}:00`,
      temperature: 60 + Math.sin(i) * 2,
      vibration: 2.0 + Math.cos(i) * 0.2,
      pressure: 5.8,
      current: 11.0 + Math.sin(i) * 0.3,
      rpm: 1480 + (i % 3) * 2,
      load: 55 + (i % 4) * 2,
      acousticLevel: 63 + (i % 2)
    })),
    healthScore: 96,
    anomalyScore: 4,
    lastMaintenance: '2026-08-15',
    nextMaintenance: '2026-10-15',
    operatingHours: 4210,
    maintenanceHistory: [
      {
        id: 'rec-01',
        date: '2026-08-15',
        type: 'Preventive',
        description: 'Spindle lubrication & alignment calibration',
        technicianId: 't-02',
        technicianName: 'Sarah Chen',
        partsReplaced: ['Synthetic Lubricant L-40'],
        cost: 450,
        downtimeHours: 2,
        outcome: 'Successful'
      }
    ]
  },
  {
    id: 'm-02',
    code: 'M-02',
    name: 'Robotic Welding Cell 4',
    type: '6-Axis Articulated Robot',
    location: 'Bay B - Body Shop',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 58.1,
      vibration: 1.8,
      pressure: 6.1,
      current: 10.5,
      rpm: 1450,
      load: 62,
      acousticLevel: 61
    },
    telemetryHistory: [],
    healthScore: 94,
    anomalyScore: 6,
    lastMaintenance: '2026-07-28',
    nextMaintenance: '2026-09-28',
    operatingHours: 5890,
    maintenanceHistory: []
  },
  {
    id: 'm-03',
    code: 'M-03',
    name: 'Hydraulic Press 500T',
    type: 'Heavy Stamping Press',
    location: 'Bay C - Stamping',
    factory: 'Factory Alpha - Detroit',
    status: 'warning',
    sensors: {
      temperature: 76.5,
      vibration: 4.8,
      pressure: 7.2,
      current: 14.8,
      rpm: 1420,
      load: 84,
      acousticLevel: 78
    },
    telemetryHistory: [],
    healthScore: 74,
    anomalyScore: 42,
    predictedFailure: 'Hydraulic Seal Leakage',
    failureConfidence: 68,
    timeToFailureHours: 48,
    lastMaintenance: '2026-06-10',
    nextMaintenance: '2026-09-15',
    operatingHours: 8900,
    maintenanceHistory: []
  },
  {
    id: 'm-04',
    code: 'M-04',
    name: 'Automated Conveyor Line 2',
    type: 'Modular Belt Conveyor',
    location: 'Bay D - Logistics',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 54.0,
      vibration: 1.5,
      pressure: 5.2,
      current: 8.9,
      rpm: 1200,
      load: 42,
      acousticLevel: 58
    },
    telemetryHistory: [],
    healthScore: 98,
    anomalyScore: 2,
    lastMaintenance: '2026-08-01',
    nextMaintenance: '2026-11-01',
    operatingHours: 3100,
    maintenanceHistory: []
  },
  {
    id: 'm-05',
    code: 'M-05',
    name: 'Laser Cutting Workstation',
    type: 'Fiber Laser Cutter 6kW',
    location: 'Bay A - Fabrication',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 64.2,
      vibration: 2.4,
      pressure: 6.0,
      current: 12.1,
      rpm: 1500,
      load: 68,
      acousticLevel: 66
    },
    telemetryHistory: [],
    healthScore: 91,
    anomalyScore: 9,
    lastMaintenance: '2026-08-20',
    nextMaintenance: '2026-10-20',
    operatingHours: 4720,
    maintenanceHistory: []
  },
  {
    id: 'm-06',
    code: 'M-06',
    name: 'Industrial Air Compressor C-3',
    type: 'Rotary Screw Compressor',
    location: 'Utility Room 1',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 68.0,
      vibration: 3.1,
      pressure: 8.5,
      current: 18.2,
      rpm: 1490,
      load: 72,
      acousticLevel: 73
    },
    telemetryHistory: [],
    healthScore: 89,
    anomalyScore: 11,
    lastMaintenance: '2026-07-05',
    nextMaintenance: '2026-10-05',
    operatingHours: 11400,
    maintenanceHistory: []
  },
  {
    id: 'm-07',
    code: 'M-07',
    name: 'Turbine Generator T-700',
    type: 'High-Velocity Steam Turbine',
    location: 'Power Generation Hub - Main Line',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy', // Initial baseline state, degrades in simulation/demo
    sensors: {
      temperature: 64.5,
      vibration: 2.8,
      pressure: 5.9,
      current: 11.4,
      rpm: 1485,
      load: 62,
      acousticLevel: 65
    },
    telemetryHistory: [
      { timestamp: '09:00:00', temperature: 63.8, vibration: 2.6, pressure: 5.9, current: 11.2, rpm: 1485, load: 60, acousticLevel: 64 },
      { timestamp: '09:05:00', temperature: 64.1, vibration: 2.7, pressure: 5.9, current: 11.3, rpm: 1485, load: 61, acousticLevel: 65 },
      { timestamp: '09:10:00', temperature: 64.5, vibration: 2.8, pressure: 5.9, current: 11.4, rpm: 1485, load: 62, acousticLevel: 65 }
    ],
    healthScore: 92,
    anomalyScore: 8,
    predictedFailure: 'Bearing B-204 Wear / Lubrication Breakdown',
    failureConfidence: 87,
    timeToFailureHours: 14,
    lastMaintenance: '2026-05-14',
    nextMaintenance: '2026-09-20',
    operatingHours: 9840,
    maintenanceHistory: [
      {
        id: 'rec-07-1',
        date: '2025-11-10',
        type: 'Corrective',
        description: 'Main Drive Bearing Replacement due to inner ring spalling',
        technicianId: 't-03',
        technicianName: 'Marcus Vance',
        partsReplaced: ['Bearing B-204', 'Synthetic Oil Seal S-102'],
        cost: 2850,
        downtimeHours: 3.5,
        outcome: 'Successful',
        notes: 'Replaced bearing housing seal. High vibration resolved immediately.'
      },
      {
        id: 'rec-07-2',
        date: '2026-05-14',
        type: 'Preventive',
        description: 'Semi-annual Turbine Balancing & Acoustic Inspection',
        technicianId: 't-01',
        technicianName: 'Alex Rivera',
        partsReplaced: ['Filter Element FE-12'],
        cost: 620,
        downtimeHours: 1.5,
        outcome: 'Successful'
      }
    ]
  },
  {
    id: 'm-08',
    code: 'M-08',
    name: 'Injection Molding Unit 12',
    type: 'Electric Injection Molding',
    location: 'Plastics Division',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 66.8,
      vibration: 2.9,
      pressure: 6.3,
      current: 12.8,
      rpm: 1460,
      load: 65,
      acousticLevel: 67
    },
    telemetryHistory: [],
    healthScore: 95,
    anomalyScore: 5,
    lastMaintenance: '2026-08-10',
    nextMaintenance: '2026-11-10',
    operatingHours: 6420,
    maintenanceHistory: []
  },
  {
    id: 'm-09',
    code: 'M-09',
    name: 'Cooling Tower Pump Beta',
    type: 'Centrifugal Water Pump',
    location: 'HVAC Complex',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 52.1,
      vibration: 2.0,
      pressure: 4.8,
      current: 9.5,
      rpm: 1440,
      load: 50,
      acousticLevel: 60
    },
    telemetryHistory: [],
    healthScore: 97,
    anomalyScore: 3,
    lastMaintenance: '2026-07-19',
    nextMaintenance: '2026-10-19',
    operatingHours: 14200,
    maintenanceHistory: []
  },
  {
    id: 'm-10',
    code: 'M-10',
    name: 'Paint Spraying Robot Unit 1',
    type: 'Precision Electrostatic Painter',
    location: 'Paint Shop - Line 1',
    factory: 'Factory Alpha - Detroit',
    status: 'healthy',
    sensors: {
      temperature: 59.4,
      vibration: 1.9,
      pressure: 5.5,
      current: 10.1,
      rpm: 1475,
      load: 54,
      acousticLevel: 62
    },
    telemetryHistory: [],
    healthScore: 96,
    anomalyScore: 4,
    lastMaintenance: '2026-08-25',
    nextMaintenance: '2026-11-25',
    operatingHours: 3950,
    maintenanceHistory: []
  }
];

export const INITIAL_INVENTORY: InventoryPart[] = [
  {
    id: 'p-204',
    partNumber: 'B-204',
    name: 'High-Precision Tapered Roller Bearing B-204',
    category: 'Bearings & Drive Components',
    quantity: 3,
    minStock: 2,
    warehouseLocation: 'Shelf A-14, Bay 2',
    compatibleMachines: ['Turbine Generator T-700 (M-07)', 'CNC Milling Center Alpha (M-01)'],
    unitCost: 1450,
    supplier: 'SKF Industrial Technologies',
    leadTimeDays: 3,
    status: 'AVAILABLE',
    reservedQuantity: 0
  },
  {
    id: 'p-102',
    partNumber: 'S-102',
    name: 'Viton Heavy Duty Shaft Seal S-102',
    category: 'Seals & Gaskets',
    quantity: 8,
    minStock: 4,
    warehouseLocation: 'Bin C-03',
    compatibleMachines: ['Turbine Generator T-700 (M-07)', 'Cooling Tower Pump Beta (M-09)'],
    unitCost: 180,
    supplier: 'Freudenberg Sealing Tech',
    leadTimeDays: 1,
    status: 'AVAILABLE',
    reservedQuantity: 0
  },
  {
    id: 'p-70',
    partNumber: 'RB-70',
    name: 'Titanium Rotor Blade Assembly RB-70',
    category: 'Turbine Rotors',
    quantity: 1,
    minStock: 1,
    warehouseLocation: 'Vault B-01',
    compatibleMachines: ['Turbine Generator T-700 (M-07)'],
    unitCost: 8200,
    supplier: 'GE Industrial Aero',
    leadTimeDays: 14,
    status: 'AVAILABLE',
    reservedQuantity: 0
  },
  {
    id: 'p-45',
    partNumber: 'C-45',
    name: 'Flexible Jaw Shaft Coupling C-45',
    category: 'Couplings',
    quantity: 2,
    minStock: 2,
    warehouseLocation: 'Shelf D-08',
    compatibleMachines: ['Hydraulic Press 500T (M-03)', 'Industrial Air Compressor C-3 (M-06)'],
    unitCost: 650,
    supplier: 'KTR Systems',
    leadTimeDays: 2,
    status: 'AVAILABLE',
    reservedQuantity: 0
  },
  {
    id: 'p-90',
    partNumber: 'PV-90',
    name: 'Electro-Hydraulic Servo Valve PV-90',
    category: 'Hydraulics & Valves',
    quantity: 1,
    minStock: 2,
    warehouseLocation: 'Shelf E-02',
    compatibleMachines: ['Hydraulic Press 500T (M-03)'],
    unitCost: 2300,
    supplier: 'Moog Motion Controls',
    leadTimeDays: 5,
    status: 'LOW_STOCK',
    reservedQuantity: 0
  },
  {
    id: 'p-12',
    partNumber: 'FE-12',
    name: 'High-Efficiency Micro-Glass Filter Element FE-12',
    category: 'Filtration',
    quantity: 14,
    minStock: 5,
    warehouseLocation: 'Bin A-08',
    compatibleMachines: ['Turbine Generator T-700 (M-07)', 'Industrial Air Compressor C-3 (M-06)'],
    unitCost: 95,
    supplier: 'Parker Hannifin',
    leadTimeDays: 1,
    status: 'AVAILABLE',
    reservedQuantity: 0
  }
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 't-03',
    name: 'Marcus Vance',
    role: 'Senior Vibration & Mechanical Specialist',
    skill: 'Mechanical & Turbine Dynamics',
    certifications: ['ISO Vibration Analyst Level III', 'Master Turbomachinery Specialist', 'Certified Safety Engineer'],
    availability: 'Available',
    currentWorkload: 1,
    location: 'Factory Floor - Zone A',
    estimatedRepairTimeHours: 2.0,
    matchScore: 92,
    rating: 4.9,
    phone: '+1 (555) 234-8901'
  },
  {
    id: 't-01',
    name: 'Alex Rivera',
    role: 'Lead Industrial Systems Engineer',
    skill: 'Electrical & Automation',
    certifications: ['Siemens PLC Certified Master', 'High-Voltage Safety Specialist'],
    availability: 'On Shift',
    currentWorkload: 2,
    location: 'Control Center West',
    estimatedRepairTimeHours: 2.5,
    matchScore: 84,
    rating: 4.8,
    phone: '+1 (555) 345-9012'
  },
  {
    id: 't-02',
    name: 'Sarah Chen',
    role: 'Robotics & CNC Specialist',
    skill: 'Robotics & Precision Machining',
    certifications: ['FANUC Robotics Master Tech', '5-Axis CNC Calibration Pro'],
    availability: 'Available',
    currentWorkload: 0,
    location: 'Bay B Workshop',
    estimatedRepairTimeHours: 1.5,
    matchScore: 76,
    rating: 4.95,
    phone: '+1 (555) 456-0123'
  },
  {
    id: 't-04',
    name: 'Elena Rostova',
    role: 'Hydraulics & Pressure Systems Specialist',
    skill: 'Fluid Power & Press Dynamics',
    certifications: ['IFPS Certified Fluid Power Specialist', 'Safety Valve Inspector'],
    availability: 'Busy',
    currentWorkload: 3,
    location: 'Bay C Stamping Complex',
    estimatedRepairTimeHours: 3.0,
    matchScore: 68,
    rating: 4.7,
    phone: '+1 (555) 567-1234'
  }
];

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'monitoring',
    name: 'Monitoring Agent',
    role: 'Sensor Stream Telemetry & Threshold Analysis',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Continuously scans 7 sensor dimensions across 10 machines for physical drift and micro-anomalies.'
  },
  {
    id: 'diagnosis',
    name: 'Diagnosis Agent',
    role: 'Root Cause & Failure Hypotheses Generation',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Correlates multi-sensor anomalies with structural failure modes and physical degradation models.'
  },
  {
    id: 'history',
    name: 'History Agent',
    role: 'Case-Based Reasoning & Historical Pattern Retrieval',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Matches telemetry fingerprints against historical plant failure archives and past maintenance outcomes.'
  },
  {
    id: 'inventory',
    name: 'Inventory Agent',
    role: 'Spare Parts Compatibility & Warehouse Stock Allocation',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Verifies spare part cross-compatibility, checks real-time shelf stock, and issues instant reservations.'
  },
  {
    id: 'cost',
    name: 'Cost & Impact Agent',
    role: 'Financial Risk & Production Loss Calculation',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Computes net impact considering labor rates, downtime cost per minute, spare parts, and catastrophic failure risk.'
  },
  {
    id: 'workforce',
    name: 'Workforce Agent',
    role: 'Technician Skill Matrix & Workload Dispatch',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Evaluates technician ISO certifications, current location, shift availability, and match compatibility scores.'
  },
  {
    id: 'scheduler',
    name: 'Scheduler Agent',
    role: 'Production Window Optimization & Slot Planning',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Schedules maintenance windows to minimize factory production line interruption.'
  },
  {
    id: 'decision',
    name: 'Decision Agent',
    role: 'Multi-Agent Goal Evaluation & Trade-off Optimization',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Synthesizes competing agent objectives (e.g. immediate repair vs continued operation vs stock constraints).'
  },
  {
    id: 'risk',
    name: 'Risk Agent',
    role: 'Safety & Operational Risk Tier Classification',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Evaluates hazard probability and classifies decision workflows into Green, Yellow, Orange, or Red risk tiers.'
  },
  {
    id: 'action',
    name: 'Action Agent',
    role: 'Work Order Creation & Execution Dispatch',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Generates formal work order tickets and dispatches job assignments upon human authorization.'
  },
  {
    id: 'learning',
    name: 'Learning Agent',
    role: 'Post-Repair Audit & Predictive Model Recalibration',
    status: 'idle',
    lastActive: 'Just now',
    description: 'Compares AI diagnosis against technician actual repair findings to update memory rules and confidence weights.'
  }
];

export const INITIAL_LEARNING_RECORDS: LearningRecord[] = [
  {
    id: 'lr-101',
    incidentId: 'inc-old-01',
    machineId: 'm-07',
    machineName: 'Turbine Generator T-700',
    date: '2025-11-10',
    aiPredictedIssue: 'Bearing B-204 Outer Ring Fatigue',
    actualIssueFound: 'Bearing B-204 Inner Ring Spalling & Lubrication Failure',
    accuracyScore: 88,
    technicianFeedback: 'AI correctly pinpointed bearing assembly, though damage was localized on inner ring due to oil seal failure.',
    partsUsed: ['Bearing B-204', 'Synthetic Oil Seal S-102'],
    actualRepairDurationHours: 3.5,
    modelAdjustmentMade: 'Increased weight of acoustic spike correlation during high temperature drift.',
    outcome: 'Close Match'
  },
  {
    id: 'lr-102',
    incidentId: 'inc-old-02',
    machineId: 'm-03',
    machineName: 'Hydraulic Press 500T',
    date: '2026-03-22',
    aiPredictedIssue: 'Hydraulic Valve PV-90 Sticking',
    actualIssueFound: 'Hydraulic Valve PV-90 Sticking due to fluid contamination',
    accuracyScore: 96,
    technicianFeedback: 'Exact diagnostic call. Replaced valve and flushed reservoir.',
    partsUsed: ['Electro-Hydraulic Servo Valve PV-90'],
    actualRepairDurationHours: 2.2,
    modelAdjustmentMade: 'Validated pressure ripple threshold rule for hydraulic series.',
    outcome: 'Exact Match'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: 'System Initialized',
    message: 'ForgeSyn Autonomous Orchestration Platform active across 10 machines.',
    type: 'info',
    timestamp: '09:00 AM',
    read: true
  },
  {
    id: 'notif-02',
    title: 'Hydraulic Press Warning',
    message: 'Machine #03 (Hydraulic Press 500T) pressure fluctuation detected.',
    type: 'anomaly',
    timestamp: '09:15 AM',
    read: false,
    relatedEntityId: 'm-03',
    relatedEntityType: 'machine'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  simulationSpeedMultiplier: 1,
  tempWarningThreshold: 75,
  tempCriticalThreshold: 85,
  vibrationWarningThreshold: 5.0,
  vibrationCriticalThreshold: 8.0,
  autoApproveLowRisk: false,
  demoModeActive: true,
  notificationsEnabled: true,
  factoryName: 'Factory Alpha - Detroit',
  soundAlerts: true
};
