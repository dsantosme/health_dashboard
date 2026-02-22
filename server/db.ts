import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, patients, exams, examHistory, InsertPatient, InsertExam, InsertExamHistory } from "../drizzle/schema";
import { ENV } from './_core/env';
import { sql } from "drizzle-orm";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== FUNÇÕES DE PACIENTES =====

export async function getAllPatients() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get patients: database not available");
    return [];
  }

  return await db.select().from(patients);
}

export async function getPatientById(patientId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get patient: database not available");
    return undefined;
  }

  const result = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== FUNÇÕES DE EXAMES =====

export async function getAllExams() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get exams: database not available");
    return [];
  }

  return await db.select().from(exams);
}

export async function getExamByName(examName: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get exam: database not available");
    return undefined;
  }

  const result = await db.select().from(exams).where(eq(exams.name, examName)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== FUNÇÕES DE HISTÓRICO DE EXAMES =====

export async function getExamsByPatientId(patientId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get exam history: database not available");
    return [];
  }

  // Buscar histórico de exames com informações do catálogo
  const history = await db
    .select({
      id: examHistory.id,
      examName: examHistory.examName,
      date: examHistory.date,
      value: examHistory.value,
      status: examHistory.status,
      sourceFile: examHistory.sourceFile,
      category: exams.category,
      unit: exams.unit,
      referenceMin: exams.referenceMin,
      referenceMax: exams.referenceMax,
    })
    .from(examHistory)
    .leftJoin(exams, eq(examHistory.examName, exams.name))
    .where(eq(examHistory.patientId, patientId));

  return history;
}

export async function getExamsByPatientIdAndPeriod(patientId: string, year: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get exams: database not available");
    return [];
  }

  // Buscar histórico de exames com informações do catálogo, filtrado por ano
  const history = await db
    .select({
      id: examHistory.id,
      examName: examHistory.examName,
      date: examHistory.date,
      value: examHistory.value,
      status: examHistory.status,
      sourceFile: examHistory.sourceFile,
      category: exams.category,
      unit: exams.unit,
      referenceMin: exams.referenceMin,
      referenceMax: exams.referenceMax,
    })
    .from(examHistory)
    .leftJoin(exams, eq(examHistory.examName, exams.name))
    .where(
      and(
        eq(examHistory.patientId, patientId),
        sql`YEAR(${examHistory.date}) = ${year}`
      )
    );

  return history;
}

export async function getExamHistoryByName(patientId: string, examName: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get exam history: database not available");
    return [];
  }

  // Buscar histórico de um exame específico com informações do catálogo
  const history = await db
    .select({
      id: examHistory.id,
      examName: examHistory.examName,
      date: examHistory.date,
      value: examHistory.value,
      status: examHistory.status,
      sourceFile: examHistory.sourceFile,
      category: exams.category,
      unit: exams.unit,
      referenceMin: exams.referenceMin,
      referenceMax: exams.referenceMax,
    })
    .from(examHistory)
    .leftJoin(exams, eq(examHistory.examName, exams.name))
    .where(
      and(
        eq(examHistory.patientId, patientId),
        eq(examHistory.examName, examName)
      )
    )
    .orderBy(examHistory.date);

  return history;
}

export async function getExamHistoryByPatientId(patientId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get exam history: database not available");
    return [];
  }

  return await db.select().from(examHistory).where(eq(examHistory.patientId, patientId));
}


/**
 * Insere um ou mais exames no histórico e dispara processamento de correlações
 */
export async function insertExamHistory(examsData: InsertExamHistory | InsertExamHistory[]): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert exam history: database not available");
    return;
  }

  const examsArray = Array.isArray(examsData) ? examsData : [examsData];
  
  try {
    // Inserir exames
    await db.insert(examHistory).values(examsArray);
    
    // Disparar processamento de correlações para cada paciente/data única
    const uniquePatientDates = new Set(
      examsArray.map(e => `${e.patientId}|${e.date}`)
    );
    
    // Importar dinamicamente para evitar dependência circular
    const { processCorrelationsForDate } = await import('./correlationEngine');
    
    for (const patientDate of Array.from(uniquePatientDates)) {
      const [patientId, date] = patientDate.split('|');
      // Processar em background (não bloquear a inserção)
      processCorrelationsForDate(patientId, date).catch(error => {
        console.error(`[Correlations] Failed to process for ${patientId} on ${date}:`, error);
      });
    }
    
    console.log(`✅ ${examsArray.length} exame(s) inserido(s) com sucesso`);
  } catch (error) {
    console.error("[Database] Failed to insert exam history:", error);
    throw error;
  }
}

/**
 * Insere um exame no catálogo
 */
export async function insertExam(examData: InsertExam): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert exam: database not available");
    return;
  }

  try {
    await db.insert(exams).values(examData).onDuplicateKeyUpdate({
      set: {
        category: examData.category,
        unit: examData.unit,
        referenceMin: examData.referenceMin,
        referenceMax: examData.referenceMax,
      }
    });
  } catch (error) {
    console.error("[Database] Failed to insert exam:", error);
    throw error;
  }
}
