import { getDb } from './db';
import { patients, examHistory, examCorrelations, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ENV } from './_core/env';

/**
 * Script de inicialização que garante que os dados do Owner Patient
 * estejam vinculados ao owner (OWNER_OPEN_ID)
 * 
 * Roda automaticamente no startup do servidor
 */
export async function initOwnerData(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn('[InitOwnerData] Database not available, skipping initialization');
    return;
  }

  try {
    // 1. Verificar se owner já existe na tabela users
    let ownerUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, ENV.ownerOpenId))
      .limit(1);

    let ownerUserId: number;

    if (ownerUser.length === 0) {
      // Owner não existe, criar registro
      console.log('[InitOwnerData] Owner not found, creating user record...');
      
      await db.insert(users).values({
        openId: ENV.ownerOpenId,
        name: 'Owner Patient',
        email: 'health.demo@manus.im',
        role: 'admin',
        lastSignedIn: new Date(),
      });

      // Buscar novamente para pegar o ID
      ownerUser = await db
        .select()
        .from(users)
        .where(eq(users.openId, ENV.ownerOpenId))
        .limit(1);

      ownerUserId = ownerUser[0].id;
      console.log(`[InitOwnerData] ✅ Owner user created with userId=${ownerUserId}`);
    } else {
      ownerUserId = ownerUser[0].id;
      console.log(`[InitOwnerData] Owner user found with userId=${ownerUserId}`);
    }

    // 2. Verificar se dados já estão vinculados ao owner
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.id, 'john-doe'))
      .limit(1);

    if (patient.length === 0) {
      console.log('[InitOwnerData] Patient john-doe not found, skipping migration');
      return;
    }

    if (patient[0].userId === ownerUserId) {
      console.log('[InitOwnerData] Data already linked to owner, skipping migration');
      return;
    }

    // 3. Migrar dados para o owner
    console.log(`[InitOwnerData] Migrating data from userId=${patient[0].userId} to userId=${ownerUserId}...`);

    // Atualizar paciente
    await db
      .update(patients)
      .set({ userId: ownerUserId })
      .where(eq(patients.id, 'john-doe'));

    // Atualizar exames
    await db
      .update(examHistory)
      .set({ userId: ownerUserId })
      .where(eq(examHistory.patientId, 'john-doe'));

    // Atualizar correlações
    await db
      .update(examCorrelations)
      .set({ userId: ownerUserId })
      .where(eq(examCorrelations.patientId, 'john-doe'));

    console.log('[InitOwnerData] ✅ Data migration completed successfully!');
    console.log(`[InitOwnerData] All data for 'john-doe' is now linked to owner userId=${ownerUserId}`);
  } catch (error) {
    console.error('[InitOwnerData] ❌ Error during initialization:', error);
  }
}
