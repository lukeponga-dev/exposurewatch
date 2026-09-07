export type ExposureLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;

export interface Breach {
  breachName: string;
  dataClasses?: string[];
  date?: string;
  description?: string;
}

export interface ExposureResult {
  score: number;
  level: ExposureLevel;
  breaches: Breach[];
  email?: string;
  message?: string;
}
