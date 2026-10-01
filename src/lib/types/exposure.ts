export type ExposureLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Breach {
  breachName: string;
  dataClasses: string[];
}

export interface ExposureResult {
  email: string;
  score: number;
  level: ExposureLevel;
  breaches: Breach[];
}
