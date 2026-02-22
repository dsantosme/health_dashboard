/**
 * Port (Interface) for Data Repository
 * Defines the contract for data access operations
 */

export interface ExamData {
  id: number;
  patientId: string;
  examName: string;
  value: number;
  unit: string;
  date: Date;
  referenceMin: number | null;
  referenceMax: number | null;
}

export interface AnthropometricData {
  weight: number;
  height: number;
  waistCircumference: number;
  bmi: number;
}

export interface IDataRepository {
  /**
   * Get exam values by names for a patient
   */
  getExamsByNames(patientId: string, examNames: string[]): Promise<ExamData[]>;

  /**
   * Get anthropometric data for a patient
   */
  getAnthropometricData(patientId: string): Promise<AnthropometricData | null>;
}
