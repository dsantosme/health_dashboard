/**
 * Internal Data Adapter
 * 
 * Adapter that uses the existing internal database (Drizzle ORM)
 */

import { IDataRepository, ExamData, AnthropometricData } from '../../ports/IDataRepository';
import { getDb } from '../../db';
import { examHistory, patients, exams } from '../../../drizzle/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';

export class InternalDataAdapter implements IDataRepository {
  async getExamsByNames(patientId: string, examNames: string[]): Promise<ExamData[]> {
    const db = await getDb();

    if (!db) {
      throw new Error('Database connection failed');
    }

    const examHistoryResults = await db
      .select({
        id: examHistory.id,
        patientId: examHistory.patientId,
        examName: examHistory.examName,
        value: examHistory.value,
        date: examHistory.date,
        unit: exams.unit,
        referenceMin: exams.referenceMin,
        referenceMax: exams.referenceMax,
      })
      .from(examHistory)
      .leftJoin(exams, eq(examHistory.examName, exams.name))
      .where(
        and(
          eq(examHistory.patientId, patientId),
          inArray(examHistory.examName, examNames)
        )
      )
      .orderBy(desc(examHistory.date));

    // Group by exam name and get the most recent value for each
    const latestExams = new Map<string, typeof examHistoryResults[0]>();
    for (const exam of examHistoryResults) {
      if (!latestExams.has(exam.examName)) {
        latestExams.set(exam.examName, exam);
      }
    }

    return Array.from(latestExams.values()).map(exam => ({
      id: exam.id,
      patientId: exam.patientId,
      examName: exam.examName,
      value: parseFloat(exam.value),
      unit: exam.unit || '',
      date: exam.date,
      referenceMin: exam.referenceMin ? parseFloat(exam.referenceMin) : null,
      referenceMax: exam.referenceMax ? parseFloat(exam.referenceMax) : null,
    }));
  }

  async getAnthropometricData(patientId: string): Promise<AnthropometricData | null> {
    const db = await getDb();

    if (!db) {
      throw new Error('Database connection failed');
    }

    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId))
      .limit(1);

    if (patient.length === 0) {
      return null;
    }

    const p = patient[0];

    if (!p.weight || !p.height || !p.waist || !p.bmi) {
      return null;
    }

    return {
      weight: parseFloat(p.weight),
      height: p.height,
      waistCircumference: p.waist,
      bmi: parseFloat(p.bmi),
    };
  }
}
