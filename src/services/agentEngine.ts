import type {
  Machine,
  Incident,
  DiagnosisResult,
  InventoryPart,
  Technician,
  CostBreakdown,
  MaintenanceScheduleSlot,
  WhatIfScenario,
  AgentConflict,
  DecisionResult,
  LearningRecord
} from '../types';

export function runMonitoringAgent(machine: Machine): { anomalyDetected: boolean; anomalyScore: number; triggerSensor: string } {
  const { temperature, vibration, pressure, current } = machine.sensors;
  
  let trigger = '';
  if (vibration > 5.0) trigger = `Vibration (${vibration} mm/s - baseline 2.8 mm/s)`;
  else if (temperature > 75) trigger = `Temperature (${temperature}°C - baseline 64.5°C)`;
  else if (current > 14) trigger = `Current Draw (${current} A - baseline 11.4 A)`;
  else if (pressure > 7.0 || pressure < 4.5) trigger = `Pressure Spike (${pressure} bar)`;
  else trigger = 'Multi-sensor variance';

  const anomalyScore = machine.anomalyScore;
  const anomalyDetected = anomalyScore >= 40 || vibration > 5.0 || temperature > 75;

  return {
    anomalyDetected,
    anomalyScore,
    triggerSensor: trigger
  };
}

export function runDiagnosisAgent(machine: Machine, incident: Incident): DiagnosisResult {
  const { vibration, temperature, current, acousticLevel } = machine.sensors;
  
  const vibrationIncreasePercent = Math.round(((vibration - 2.8) / 2.8) * 100);
  const tempIncreasePercent = Math.round(((temperature - 64.5) / 64.5) * 100);

  return {
    id: `diag-${Date.now()}`,
    incidentId: incident.id,
    machineId: machine.id,
    probableIssue: 'Main Drive Shaft Bearing B-204 Degradation & Thermal Breakdown',
    confidence: 87,
    severity: vibration > 8.0 ? 'critical' : vibration > 5.0 ? 'high' : 'medium',
    supportingEvidence: [
      {
        signal: 'Vibration Amplitude',
        baseline: '2.8 mm/s',
        currentValue: `${vibration} mm/s`,
        change: `+${vibrationIncreasePercent}% spike`,
        impact: 'High'
      },
      {
        signal: 'Bearing Housing Temperature',
        baseline: '64.5 °C',
        currentValue: `${temperature} °C`,
        change: `+${tempIncreasePercent}% drift`,
        impact: 'High'
      },
      {
        signal: 'Stator Current Harmonic Ripple',
        baseline: '11.4 A',
        currentValue: `${current} A`,
        change: '+18% load fluctuation',
        impact: 'Medium'
      },
      {
        signal: 'Acoustic Emission Level',
        baseline: '65 dB',
        currentValue: `${acousticLevel} dB`,
        change: '+19 dB high-frequency click',
        impact: 'Medium'
      }
    ],
    rootCauseHypotheses: [
      {
        cause: 'Bearing B-204 Mechanical Wear & Micro-Spalling',
        probability: 87,
        description: 'Vibration frequency analysis matches inner/outer ring defect characteristic frequency.'
      },
      {
        cause: 'Synthetic Oil Lubrication Breakdown / Seal Leakage',
        probability: 74,
        description: 'Rapid temperature rise accompanies increased friction torque on drive shaft.'
      },
      {
        cause: 'Rotor Imbalance due to Thermal Expansion',
        probability: 42,
        description: 'Secondary harmonic current ripple observed during peak rotational speeds.'
      }
    ],
    historicalSimilarIncidentsCount: 3,
    timestamp: new Date().toLocaleTimeString()
  };
}

export function runInventoryAgent(parts: InventoryPart[]): { part: InventoryPart; available: boolean; quantity: number } {
  const part = parts.find(p => p.partNumber === 'B-204') || parts[0];
  const available = part.quantity - part.reservedQuantity > 0;

  return {
    part,
    available,
    quantity: part.quantity - part.reservedQuantity
  };
}

export function runCostAgent(part: InventoryPart, technician: Technician): CostBreakdown {
  const sparePartsCost = part.unitCost;
  const laborCost = technician.estimatedRepairTimeHours * 150; // $150/hr labor rate
  const estimatedDowntimeHours = technician.estimatedRepairTimeHours;
  const productionLossCostPerMin = 75; // $75/min production loss on Main Turbine line
  const productionLossCost = estimatedDowntimeHours * 60 * productionLossCostPerMin;
  const potentialFailureCostIfIgnored = 28500; // Cost of catastrophic turbine rotor burst

  const totalMaintenanceCost = sparePartsCost + laborCost + productionLossCost;
  const estimatedSavings = potentialFailureCostIfIgnored - totalMaintenanceCost;

  return {
    sparePartsCost,
    laborCost,
    estimatedDowntimeHours,
    productionLossCost,
    potentialFailureCostIfIgnored,
    totalMaintenanceCost,
    estimatedSavings: Math.max(0, estimatedSavings),
    calculationDetails: [
      `Spare Part (${part.partNumber}): $${sparePartsCost}`,
      `Technician Labor (${technician.estimatedRepairTimeHours}h @ $150/h): $${laborCost}`,
      `Planned Downtime (${estimatedDowntimeHours}h @ $75/min): $${productionLossCost}`,
      `Catastrophic Failure Avoidance Value: $${potentialFailureCostIfIgnored}`,
      `Net Cost Saved by Preventive Repair: $${estimatedSavings}`
    ]
  };
}

export function runWorkforceAgent(technicians: Technician[]): Technician {
  // Finds highest match score tech available
  const sorted = [...technicians].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  return sorted[0];
}

export function runSchedulerAgent(machine: Machine, technician: Technician, part: InventoryPart): MaintenanceScheduleSlot {
  return {
    id: `slot-${Date.now()}`,
    machineId: machine.id,
    machineName: machine.name,
    startTime: '14:30',
    endTime: '16:30',
    durationMinutes: 120,
    technicianId: technician.id,
    technicianName: technician.name,
    sparePartId: part.id,
    sparePartName: part.name,
    urgency: 'high',
    productionLossRisk: 'Low',
    status: 'Proposed'
  };
}

export function getWhatIfScenarios(): WhatIfScenario[] {
  return [
    {
      id: 'A',
      name: 'Immediate Factory Line Emergency Shutdown',
      description: 'Halt Turbine Generator T-700 immediately and begin emergency replacement.',
      action: 'Immediate Power Cut & Immediate Repair',
      riskLevel: 'low',
      downtimeHours: 4.5,
      productionLossCost: 20250,
      maintenanceCost: 2900,
      potentialFailureCost: 0,
      totalEstimatedImpact: 23150,
      failureProbabilityPercent: 2,
      isRecommended: false
    },
    {
      id: 'B',
      name: 'Continue Normal Operation (No Intervention)',
      description: 'Keep machine running at 100% load until shift ends in 6 hours.',
      action: 'Defer Maintenance to Weekend',
      riskLevel: 'critical',
      downtimeHours: 18.0,
      productionLossCost: 81000,
      maintenanceCost: 28500,
      potentialFailureCost: 28500,
      totalEstimatedImpact: 109500,
      failureProbabilityPercent: 89,
      isRecommended: false
    },
    {
      id: 'C',
      name: 'Controlled Load Reduction (30%) + Shift Maintenance Slot',
      description: 'Derate machine load to 70% to stabilize thermal/vibration stress, perform preventive repair at 2:30 PM.',
      action: 'Derate Load 30% -> Repair at 14:30',
      riskLevel: 'medium',
      downtimeHours: 2.0,
      productionLossCost: 9000,
      maintenanceCost: 1750,
      potentialFailureCost: 1200,
      totalEstimatedImpact: 11950,
      failureProbabilityPercent: 12,
      isRecommended: true
    },
    {
      id: 'D',
      name: 'Online High-Pressure Lubrication Flush Only',
      description: 'Inject synthetic grease flush while running without replacing bearing.',
      action: 'Temporary Lubrication Patch',
      riskLevel: 'high',
      downtimeHours: 0.5,
      productionLossCost: 2250,
      maintenanceCost: 450,
      potentialFailureCost: 18000,
      totalEstimatedImpact: 20700,
      failureProbabilityPercent: 62,
      isRecommended: false
    }
  ];
}

export function generateAgentConflict(): AgentConflict {
  return {
    id: 'conflict-700',
    title: 'Operational Conflict: Immediate Shutdown vs Production Line Continuity',
    description: 'Diagnosis Agent advocates immediate emergency halt, whereas Production Operations Agent demands zero downtime during peak shift.',
    recommendations: [
      {
        agentId: 'diagnosis',
        agentName: 'Diagnosis Agent',
        recommendation: 'Halt Machine #07 immediately to prevent shaft destruction.',
        priority: 'Immediate',
        reasoning: 'Vibration at 8.4 mm/s poses high risk of irreversible rotor housing damage.'
      },
      {
        agentId: 'cost',
        agentName: 'Cost & Impact Agent',
        recommendation: 'Immediate full shutdown incurs $23,150 in unbudgeted peak-hour lost production.',
        priority: 'Conditional',
        reasoning: 'Derating load preserves 70% throughput while mitigating catastrophic risk.'
      },
      {
        agentId: 'inventory',
        agentName: 'Inventory Agent',
        recommendation: 'Bearing B-204 is available in Shelf A-14, but reserve buffer will hit 0.',
        priority: 'Scheduled',
        reasoning: 'Part is reserved; emergency re-order required for warehouse safety stock.'
      },
      {
        agentId: 'scheduler',
        agentName: 'Scheduler Agent',
        recommendation: 'Schedule repair for 2:30 PM (Shift Handover Window).',
        priority: 'Scheduled',
        reasoning: '2:30 PM slot aligns with planned batch changeover, reducing production loss by 55%.'
      }
    ],
    conflictReason: 'Direct conflict between mechanical safety threshold enforcement and plant production quota deadlines.',
    resolutionStrategy: 'Dynamic Risk-Weighted Load Derating with Scheduled Shift Handover Repair.',
    winningDecision: 'Reduce load by 30% immediately, continue operation for 45 mins, perform Bearing B-204 replacement at 2:30 PM.',
    tradeoffRationale: 'Derating load reduces vibration amplitude by ~42% below damage threshold, preventing failure while saving $11,200 in production loss compared to immediate shutdown.'
  };
}

export function runDecisionAgent(
  machine: Machine,
  incident: Incident,
  costBreakdown: CostBreakdown
): DecisionResult {
  return {
    id: `dec-${Date.now()}`,
    incidentId: incident.id,
    machineId: machine.id,
    recommendedAction: 'Derate Turbine Load by 30% immediately and perform Bearing B-204 replacement at 2:30 PM',
    reason: 'Derating stabilizes mechanical vibration below danger threshold (reducing amplitude to ~4.2 mm/s), enabling safe production continuation until scheduled shift changeover at 2:30 PM.',
    confidence: 91,
    evidenceSummary: [
      `Vibration spike (+112% to ${machine.sensors.vibration} mm/s) matches Bearing B-204 degradation pattern.`,
      `Part B-204 confirmed in stock (Shelf A-14, Bay 2).`,
      `Technician Marcus Vance (92% skill match, ISO Level III) available at 14:30.`,
      `What-If Scenario C minimizes total financial impact to $11,950 vs $109,500 failure cost.`
    ],
    expectedImpact: 'Prevents catastrophic turbine rotor failure, avoids $18,500 in unplanned downtime loss, restores machine health score to 98%.',
    costBreakdown,
    riskLevel: 'medium',
    alternativesRejected: [
      { option: 'Immediate Full Shutdown', reason: 'High production loss cost ($23,150) when derating load safely bridges to shift change.' },
      { option: 'Continue 100% Load', reason: 'Unacceptable 89% failure probability with $109,500 catastrophic loss exposure.' },
      { option: 'Lubrication Flush Only', reason: 'Does not remedy structural micro-spalling of bearing inner race (62% failure risk).' }
    ],
    timestamp: new Date().toLocaleTimeString()
  };
}

export function createLearningMemoryFromRepair(
  incident: Incident,
  machine: Machine,
  actualIssue: string,
  techNotes: string,
  partsUsed: string[]
): LearningRecord {
  return {
    id: `lr-${Date.now()}`,
    incidentId: incident.id,
    machineId: machine.id,
    machineName: machine.name,
    date: new Date().toISOString().split('T')[0],
    aiPredictedIssue: 'Main Drive Shaft Bearing B-204 Wear / Thermal Breakdown',
    actualIssueFound: actualIssue || 'Bearing B-204 Inner Race Spalling & Lubricant Thermal Degradation',
    accuracyScore: 94,
    technicianFeedback: techNotes || 'Bearing replacement completed successfully. Shaft alignment verified with laser tool.',
    partsUsed: partsUsed.length > 0 ? partsUsed : ['Bearing B-204', 'Viton Shaft Seal S-102'],
    actualRepairDurationHours: 2.0,
    modelAdjustmentMade: 'Validated 8.0 mm/s vibration threshold sensitivity for turbine drive assemblies.',
    outcome: 'Exact Match'
  };
}
