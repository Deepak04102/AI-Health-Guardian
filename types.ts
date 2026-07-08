
export interface HealthData {
  symptoms: string;
  duration: string;
  intensity: 'low' | 'moderate' | 'high';
  age: string;
  gender: string;
  history: string;
}

export interface DiagnosisResult {
  condition: string;
  description: string;
  probability: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  keyInsights: string[];
}

export interface WellnessPlan {
  dietaryAdvice: string[];
  lifestyleChanges: string[];
  preventativeMeasures: string[];
  followUp: string;
}

export interface GuardianResponse {
  analysis: DiagnosisResult[];
  wellnessPlan: WellnessPlan;
}
