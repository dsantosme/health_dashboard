/**
 * Port (Interface) for Medical Analysis Service
 * Defines the contract for medical analysis operations
 */

export interface MedicalAnalysisInput {
  patientId: string;
  examNames: string[];
}

export interface PersonalizedRecommendations {
  actionPlan: string;
  goals: string;
  dietSuggestions: string;
  exercisePlan: string;
  followUpSchedule: string;
}

export interface ClinicalIndices {
  tgHdlRatio?: number;
  ctHdlRatio?: number;
  ldlHdlRatio?: number;
  nonHdlCholesterol?: number;
}

export interface MedicalAnalysisOutput {
  specialist: string;
  specialtyEmoji: string;
  patientName: string;
  analysis: string;
  urgencyLevel: 'good' | 'attention' | 'urgent';
  recommendations: string[];
  personalizedRecommendations: PersonalizedRecommendations;
  clinicalIndices: ClinicalIndices;
  examValues: Array<{
    name: string;
    value: number;
    unit: string;
    status: 'normal' | 'low' | 'high';
  }>;
}

export interface IMedicalAnalysisService {
  /**
   * Generate medical analysis for given exams
   */
  generateAnalysis(input: MedicalAnalysisInput): Promise<MedicalAnalysisOutput>;
}
