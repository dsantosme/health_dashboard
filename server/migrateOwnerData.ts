import { getDb } from './db';
import { patients, examHistory, examCorrelations } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Script de migração automática de dados para o owner
 * Vincula todos os dados do paciente 'john-doe' ao userId do owner
 */
export async function migrateOwnerData(ownerUserId: number, ownerEmail: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  console.log(`[Migration] Starting data migration for owner userId=${ownerUserId}, email=${ownerEmail}`);

  try {
    // 1. Atualizar paciente Owner Patient
    const patientResult = await db
      .update(patients)
      .set({ 
        userId: ownerUserId,
      })
      .where(eq(patients.id, 'john-doe'));
    
    console.log(`[Migration] Updated patient 'john-doe' to userId=${ownerUserId}`);

    // 2. Atualizar todos os exames do paciente
    const examsResult = await db
      .update(examHistory)
      .set({ userId: ownerUserId })
      .where(eq(examHistory.patientId, 'john-doe'));
    
    console.log(`[Migration] Updated exam_history for patient 'john-doe' to userId=${ownerUserId}`);

    // 3. Atualizar todas as correlações do paciente
    const correlationsResult = await db
      .update(examCorrelations)
      .set({ userId: ownerUserId })
      .where(eq(examCorrelations.patientId, 'john-doe'));
    
    console.log(`[Migration] Updated exam_correlations for patient 'john-doe' to userId=${ownerUserId}`);

    console.log(`[Migration] ✅ Data migration completed successfully!`);
    console.log(`[Migration] All data for 'john-doe' is now linked to userId=${ownerUserId} (${ownerEmail})`);
  } catch (error) {
    console.error(`[Migration] ❌ Error during data migration:`, error);
    throw error;
  }
}

/**
 * Verifica se a migração já foi executada
 */
export async function checkMigrationStatus(ownerUserId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  const patient = await db
    .select()
    .from(patients)
    .where(eq(patients.id, 'john-doe'))
    .limit(1);

  if (patient.length === 0) {
    return false;
  }

  return patient[0].userId === ownerUserId;
}
