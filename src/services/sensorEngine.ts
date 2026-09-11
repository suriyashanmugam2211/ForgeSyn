import type { SensorData, Machine } from '../types';

export function calculateSensorAnomalyScore(sensors: SensorData): number {
  let score = 0;

  // Temperature weight (normal: 50-70 °C, warn >75, crit >85)
  if (sensors.temperature > 85) score += 35;
  else if (sensors.temperature > 75) score += 20;
  else if (sensors.temperature > 70) score += 8;

  // Vibration weight (normal: 1.5-4.0 mm/s, warn >5.0, crit >8.0)
  if (sensors.vibration > 8.0) score += 45;
  else if (sensors.vibration > 5.0) score += 25;
  else if (sensors.vibration > 4.0) score += 10;

  // Pressure weight (normal: 5.0-6.5 bar)
  if (sensors.pressure > 7.5 || sensors.pressure < 4.0) score += 15;
  else if (sensors.pressure > 6.8 || sensors.pressure < 4.5) score += 8;

  // Current weight (normal: 9.0-13.0 A)
  if (sensors.current > 15.0) score += 15;
  else if (sensors.current > 13.5) score += 8;

  // Acoustic weight (normal: 60-75 dB)
  if (sensors.acousticLevel > 80) score += 10;
  else if (sensors.acousticLevel > 75) score += 5;

  return Math.min(Math.round(score), 99);
}

export function generateNextSensorTelemetry(
  machine: Machine,
  isDegrading: boolean = false,
  degradationSeverityFactor: number = 1.0
): SensorData {
  const current = { ...machine.sensors };

  if (isDegrading) {
    // Progressive degradation curve tailored for Machine #07
    const tempInc = (0.4 + Math.random() * 0.6) * degradationSeverityFactor;
    const vibInc = (0.25 + Math.random() * 0.45) * degradationSeverityFactor;
    const currInc = (0.15 + Math.random() * 0.3) * degradationSeverityFactor;
    const pressVar = (Math.random() - 0.4) * 0.2;
    const rpmVar = (Math.random() - 0.5) * 12;
    const loadInc = (0.5 + Math.random() * 1.0) * degradationSeverityFactor;
    const acousticInc = (0.3 + Math.random() * 0.5) * degradationSeverityFactor;

    return {
      temperature: Number(Math.min(92.0, current.temperature + tempInc).toFixed(1)),
      vibration: Number(Math.min(12.5, current.vibration + vibInc).toFixed(1)),
      pressure: Number(Math.max(3.5, Math.min(8.8, current.pressure + pressVar)).toFixed(1)),
      current: Number(Math.min(18.5, current.current + currInc).toFixed(1)),
      rpm: Math.round(Math.max(1380, Math.min(1530, current.rpm + rpmVar))),
      load: Math.round(Math.min(98, current.load + loadInc)),
      acousticLevel: Math.round(Math.min(90, current.acousticLevel + acousticInc))
    };
  } else {
    // Subtle normal operational variance (micro noise)
    const tempNoise = (Math.random() - 0.5) * 0.3;
    const vibNoise = (Math.random() - 0.5) * 0.1;
    const pressNoise = (Math.random() - 0.5) * 0.05;
    const currNoise = (Math.random() - 0.5) * 0.1;
    const rpmNoise = Math.round((Math.random() - 0.5) * 4);

    return {
      temperature: Number(Math.max(45, Math.min(72, current.temperature + tempNoise)).toFixed(1)),
      vibration: Number(Math.max(1.2, Math.min(4.2, current.vibration + vibNoise)).toFixed(1)),
      pressure: Number(Math.max(4.8, Math.min(6.6, current.pressure + pressNoise)).toFixed(1)),
      current: Number(Math.max(8.5, Math.min(13.2, current.current + currNoise)).toFixed(1)),
      rpm: Math.round(Math.max(1440, Math.min(1510, current.rpm + rpmNoise))),
      load: current.load,
      acousticLevel: current.acousticLevel
    };
  }
}
