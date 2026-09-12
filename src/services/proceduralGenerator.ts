import type {
  Machine,
  Incident,
  DiagnosisResult,
  CostBreakdown,
  AgentConflict,
  DecisionResult
} from '../types';

import { calculateSensorAnomalyScore } from './sensorEngine';

const MACHINE_TEMPLATES = [
  {
    name: 'CNC Milling Center Alpha',
    type: '5-Axis CNC Mill',
    location: 'Bay A - Machining'
  },
  {
    name: 'Robotic Welding Cell 4',
    type: '6-Axis Articulated Robot',
    location: 'Bay B - Body Shop'
  },
  {
    name: 'Hydraulic Press 500T',
    type: 'Heavy Stamping Press',
    location: 'Bay C - Stamping'
  },
  {
    name: 'Cooling Pump Centrifugal P-102',
    type: 'High-Volume Liquid Pump',
    location: 'Utility Annex'
  },
  {
    name: 'Conveyor Drive Motor D-09',
    type: 'Variable Speed Drive Motor',
    location: 'Assembly Line 2'
  },
  {
    name: 'Plasma Cutter HD-3000',
    type: 'High-Precision Plasma Table',
    location: 'Bay D - Fabrication'
  },
  {
    name: 'Turbine Generator T-700',
    type: 'Heavy Duty Gas Turbine',
    location: 'Power Generation Station'
  },
  {
    name: 'Injection Molding Unit M-12',
    type: 'Automated Polymer Injector',
    location: 'Plastics Division'
  },
  {
    name: 'Rotary Air Compressor C-40',
    type: 'Twin-Screw Air Compressor',
    location: 'Pneumatics Room'
  },
  {
    name: 'Induction Hardening Furnace H-05',
    type: 'High-Frequency Heat Treater',
    location: 'Heat Treat Bay'
  }
];

const ROOT_CAUSE_CATALOG = [
  {
    issue:
      'Main Drive Shaft Bearing B-204 Degradation & Thermal Breakdown',
    sensorTarget: 'Vibration',
    evidence:
      'Vibration increased 114% over baseline, temp up 22°C',
    part:
      'High-Precision Tapered Roller Bearing B-204'
  },
  {
    issue:
      'Hydraulic Proportioning Valve Seals Degradation & Cavitation',
    sensorTarget: 'Pressure',
    evidence:
      'Hydraulic pressure drop 28% with severe fluctuation',
    part:
      'High-Pressure Hydraulic Seal Kit S-500'
  },
  {
    issue:
      'Stator Phase Winding Overheating & Insulation Resistance Failure',
    sensorTarget: 'Current',
    evidence:
      'Current draw unbalance +38% with elevated thermal signature',
    part:
      'Heavy Duty Stator Coil Assembly C-101'
  },
  {
    issue:
      'Planetary Gearbox Pinion Tooth Pitting & Backlash Slop',
    sensorTarget: 'Acoustic',
    evidence:
      'Acoustic noise spiked to 88 dB with high-frequency harmonics',
    part:
      'Hardened Helical Planetary Gear Set G-88'
  },
  {
    issue:
      'Coolant Circulation Impeller Cavitation & Thermal Lock',
    sensorTarget: 'Temperature',
    evidence:
      'Temperature steady rise to 82.5°C despite active chilling',
    part:
      'Stainless Steel Impeller & Viton Gasket I-30'
  }
];

export function generateRandomizedMachines(): Machine[] {
  const now = new Date();

  return MACHINE_TEMPLATES.map((tmpl, idx) => {
    const isTargetDemo = idx === 6;

    const code = `M-0${idx + 1}`;
    const id = `m-0${idx + 1}`;

    const baseTemp = 58 + Math.random() * 8;
    const baseVib = 1.8 + Math.random() * 1.5;
    const basePress = 5.2 + Math.random() * 1.0;
    const baseCurr = 10.0 + Math.random() * 2.5;
    const baseRpm = 1450 + Math.floor(Math.random() * 50);
    const baseLoad = 50 + Math.floor(Math.random() * 20);
    const baseAcoustic =
      60 + Math.floor(Math.random() * 10);

    const sensors = {
      temperature: Number(baseTemp.toFixed(1)),
      vibration: Number(baseVib.toFixed(1)),
      pressure: Number(basePress.toFixed(1)),
      current: Number(baseCurr.toFixed(1)),
      rpm: baseRpm,
      load: baseLoad,
      acousticLevel: baseAcoustic
    };

    const anomalyScore =
      calculateSensorAnomalyScore(sensors);

    const healthScore = Math.max(
      10,
      100 - anomalyScore
    );

    const telemetryHistory = Array.from(
      { length: 15 },
      (_, i) => {
        const timeStr = new Date(
          now.getTime() -
            (15 - i) * 60000
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        return {
          timestamp: timeStr,
          temperature: Number(
            (
              baseTemp +
              (Math.random() * 2 - 1)
            ).toFixed(1)
          ),
          vibration: Number(
            (
              baseVib +
              (Math.random() * 0.4 - 0.2)
            ).toFixed(1)
          ),
          pressure: Number(
            (
              basePress +
              (Math.random() * 0.2 - 0.1)
            ).toFixed(1)
          ),
          current: Number(
            (
              baseCurr +
              (Math.random() * 0.6 - 0.3)
            ).toFixed(1)
          ),
          rpm:
            baseRpm +
            Math.floor(
              Math.random() * 6 - 3
            ),
          load: Math.min(
            100,
            Math.max(
              10,
              baseLoad +
                Math.floor(
                  Math.random() * 6 - 3
                )
            )
          ),
          acousticLevel:
            baseAcoustic +
            Math.floor(
              Math.random() * 4 - 2
            )
        };
      }
    );

    const status = isTargetDemo
      ? 'healthy'
      : anomalyScore > 60
        ? 'critical'
        : anomalyScore > 35
          ? 'warning'
          : 'healthy';

    const lastMaintDays = Math.floor(
      10 + Math.random() * 40
    );

    const lastMaintDate = new Date(
      now.getTime() -
        lastMaintDays * 86400000
    )
      .toISOString()
      .split('T')[0];

    const nextMaintDate = new Date(
      now.getTime() +
        (60 - lastMaintDays) *
          86400000
    )
      .toISOString()
      .split('T')[0];

    return {
      id,
      code,
      name: tmpl.name,
      type: tmpl.type,
      location: tmpl.location,
      factory: 'ForgeSyn Smart Factory #1',
      status,
      sensors,
      telemetryHistory,
      healthScore,
      anomalyScore,
      predictedFailure:
        anomalyScore > 30
          ? 'Drive Shaft Bearing Wear Imminent'
          : undefined,
      failureConfidence:
        anomalyScore > 30
          ? Math.floor(
              75 + Math.random() * 20
            )
          : undefined,
      timeToFailureHours:
        anomalyScore > 30
          ? Math.floor(
              12 + Math.random() * 60
            )
          : undefined,
      lastMaintenance: lastMaintDate,
      nextMaintenance: nextMaintDate,
      operatingHours: Math.floor(
        2000 + Math.random() * 6000
      ),
      maintenanceHistory: [
        {
          id: `hist-${idx}-1`,
          date: lastMaintDate,
          type: 'Preventive',
          description:
            'Scheduled multi-point inspection & fluid replacement',
          technicianId: 't-01',
          technicianName: 'Marcus Vance',
          partsReplaced: [
            'Synthetic Lubricant L-40'
          ],
          cost: Math.floor(
            400 + Math.random() * 600
          ),
          downtimeHours: 1.5,
          outcome: 'Successful'
        }
      ]
    };
  });
}

export function generateDynamicIncident(
  machine: Machine
): {
  incident: Incident;
  diagnosis: DiagnosisResult;
  cost: CostBreakdown;
  conflict: AgentConflict;
  decision: DecisionResult;
} {
  const catalogItem =
    ROOT_CAUSE_CATALOG[
      Math.floor(
        Math.random() *
          ROOT_CAUSE_CATALOG.length
      )
    ];

  const incId = `INC-${machine.code.replace(
    'M-',
    ''
  )}${Math.floor(
    100 + Math.random() * 900
  )}`;

  const incident: Incident = {
    id: incId,
    machineId: machine.id,
    machineName: machine.name,
    machineCode: machine.code,
    detectionTime:
      new Date().toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      ),
    severity: 'critical',
    anomalyScore: Math.floor(
      82 + Math.random() * 14
    ),
    triggerSensor: `${catalogItem.sensorTarget} Anomaly (${catalogItem.evidence})`,
    status: 'detected',
    approvalStatus: 'pending',
    summary: `Autonomous multi-agent alert: ${catalogItem.issue} detected on ${machine.name}.`
  };

  const confidence = Math.floor(
    84 + Math.random() * 12
  );

  const diagnosis: DiagnosisResult = {
    id: `diag-${Date.now()}`,
    incidentId: incId,
    machineId: machine.id,
    probableIssue:
      catalogItem.issue,
    confidence,
    severity: 'critical',
    supportingEvidence: [
      {
        signal:
          catalogItem.sensorTarget,
        change: `+${Math.floor(
          90 + Math.random() * 40
        )}% Variance`,
        baseline:
          'Nominal Operating Threshold',
        currentValue: `${(
          machine.sensors.vibration *
          2.2
        ).toFixed(1)} peak`,
        impact: 'High'
      },
      {
        signal:
          'Thermal Signature',
        change: `+${Math.floor(
          15 + Math.random() * 20
        )}°C Thermal Rise`,
        baseline: '64.5°C Normal',
        currentValue: `${(
          machine.sensors.temperature +
          12
        ).toFixed(1)}°C`,
        impact: 'High'
      },
      {
        signal:
          'Power Draw Drift',
        change:
          '+24% Amperage Surge',
        baseline: '11.0 A Normal',
        currentValue: `${(
          machine.sensors.current + 3.2
        ).toFixed(1)} A`,
        impact: 'Medium'
      }
    ],
    rootCauseHypotheses: [
      {
        cause:
          catalogItem.issue,
        probability: confidence,
        description:
          'Primary structural degradation detected via high-frequency vibration spectrum.'
      },
      {
        cause:
          'Secondary Lubricant Contamination & Seal Deterioration',
        probability: Math.floor(
          (100 - confidence) * 0.7
        ),
        description:
          'Thermal breakdown of barrier grease inducing micro-pitting.'
      }
    ],
    historicalSimilarIncidentsCount:
      Math.floor(
        2 + Math.random() * 4
      ),
    timestamp:
      new Date().toLocaleTimeString()
  };

  const partsCost = Math.floor(
    1200 + Math.random() * 1000
  );

  const laborCost = Math.floor(
    400 + Math.random() * 300
  );

  const downtimeHours = Number(
    (
      1.5 +
      Math.random() * 1.5
    ).toFixed(1)
  );

  const hourlyProdLoss = Math.floor(
    2500 + Math.random() * 2000
  );

  const prodLossCost = Math.floor(
    downtimeHours *
      hourlyProdLoss
  );

  const potentialFailureCost =
    Math.floor(
      prodLossCost * 4.5 +
        partsCost * 3
    );

  const totalMaintCost =
    partsCost +
    laborCost +
    prodLossCost;

  const estimatedSavings =
    potentialFailureCost -
    totalMaintCost;

  const cost: CostBreakdown = {
    sparePartsCost: partsCost,
    laborCost,
    estimatedDowntimeHours:
      downtimeHours,
    productionLossCost:
      prodLossCost,
    potentialFailureCostIfIgnored:
      potentialFailureCost,
    totalMaintenanceCost:
      totalMaintCost,
    estimatedSavings,
    calculationDetails: [
      `Spare Part (${catalogItem.part}): $${partsCost}`,
      `Certified Specialist Labor (${downtimeHours}h @ $160/h): $${laborCost}`,
      `Planned Line Downtime (${downtimeHours}h @ $${hourlyProdLoss}/h loss): $${prodLossCost}`,
      `Catastrophic Failure Imminent Penalty Risk: $${potentialFailureCost}`,
      `Net Savings Realized via Agentic Intervention: $${estimatedSavings}`
    ]
  };

  const conflict: AgentConflict = {
    id: `conf-${Date.now()}`,
    title:
      'Operational Conflict: Emergency Halt vs Production Output Schedule',
    description:
      'Diagnosis Agent demands immediate machine isolation; Production Operations Agent requests 45-minute shift completion buffer.',
    recommendations: [
      {
        agentId: 'diagnosis',
        agentName:
          'Diagnosis Agent',
        recommendation:
          'Immediate Machine Isolation',
        priority: 'Immediate',
        reasoning:
          'Prevent progressive fatigue failure of mechanical assembly.'
      },
      {
        agentId: 'cost',
        agentName:
          'Cost & Impact Agent',
        recommendation:
          '30% Derate Load + Scheduled Shift Maintenance',
        priority: 'Scheduled',
        reasoning:
          'Derating load reduces mechanical stress below threshold while saving peak production value.'
      }
    ],
    conflictReason:
      'Trade-off between zero risk of machine damage and meeting shift manufacturing quotas.',
    resolutionStrategy:
      'Derate operational load by 30% immediately to preserve structural integrity, while scheduling repair at 14:30 PM shift change.',
    winningDecision:
      `Reduce ${machine.name} load by 30% immediately, continue operation for 45 minutes, then execute ${catalogItem.part} replacement at shift change.`,
    tradeoffRationale:
      `Derating load reduces stress amplitude by 40% below failure threshold, eliminating catastrophic risk while protecting $${prodLossCost} of shift production output.`
  };

  const decision: DecisionResult = {
    id: `dec-${Date.now()}`,
    incidentId: incId,
    machineId: machine.id,
    recommendedAction:
      conflict.winningDecision,
    reason:
      conflict.tradeoffRationale,
    confidence,
    evidenceSummary: [
      `${catalogItem.sensorTarget} variance exceeds 3-sigma safety envelope`,
      `Part ${catalogItem.part} verified available in inventory`,
      `Financial optimization proves $${estimatedSavings} net savings over catastrophic failure`
    ],
    expectedImpact: `Downtime: ${downtimeHours}h • Total Cost: $${totalMaintCost} • Net Savings: $${estimatedSavings}`,
    costBreakdown: cost,
    riskLevel: 'medium',
    alternativesRejected: [
      {
        option:
          'Immediate Emergency Shutdown',
        reason:
          'Causes unscheduled upstream line stoppage costing $18,400 in lost work-in-progress.'
      },
      {
        option:
          'Continue Unmodified Operation',
        reason:
          '89% probability of catastrophic bearing seize within 3.5 operating hours.'
      }
    ],
    timestamp:
      new Date().toLocaleTimeString()
  };

  return {
    incident,
    diagnosis,
    cost,
    conflict,
    decision
  };
}

