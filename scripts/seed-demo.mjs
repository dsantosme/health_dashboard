#!/usr/bin/env node
/**
 * Demo Data Seeder
 * 
 * Populates the database with COMPLETELY FICTIONAL patient data for local testing.
 * Run with: pnpm seed:demo
 * 
 * Demo Account:
 * - Email: health.demo@manus.im
 * - Patient: John Doe (FICTIONAL - all data is randomly generated)
 * - Data: Complete exam history 2022-2026
 * 
 * ⚠️ IMPORTANT: All values are FICTIONAL and do not represent any real person's medical data.
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const DEMO_USER_OPEN_ID = 'demo-user-open-id-12345';
const DEMO_USER_EMAIL = 'health.demo@manus.im';
const DEMO_USER_NAME = 'Demo User';

// FICTIONAL patient data - John Doe
const DEMO_PATIENT = {
  name: 'John Doe',
  birthDate: '1980-06-20', // 45 years old
  gender: 'male',
};

// FICTIONAL anthropometric data over time (progressive weight loss)
const ANTHROPOMETRIC_DATA = [
  { date: '2022-02-10', weight: 92, height: 178, waistCircumference: 98 },
  { date: '2023-02-15', weight: 89, height: 178, waistCircumference: 95 },
  { date: '2024-02-12', weight: 87, height: 178, waistCircumference: 93 },
  { date: '2025-02-14', weight: 85, height: 178, waistCircumference: 91 },
  { date: '2026-02-14', weight: 83, height: 178, waistCircumference: 89 },
];

// Complete exam definitions with reference ranges
const EXAM_DEFINITIONS = [
  { name: 'COLESTEROL HDL', unit: 'mg/dL', category: 'Lipid Profile', referenceMin: 40, referenceMax: null },
  { name: 'COLESTEROL LDL', unit: 'mg/dL', category: 'Lipid Profile', referenceMin: null, referenceMax: 100 },
  { name: 'COLESTEROL TOTAL', unit: 'mg/dL', category: 'Lipid Profile', referenceMin: null, referenceMax: 200 },
  { name: 'Triglicerídeos', unit: 'mg/dL', category: 'Lipid Profile', referenceMin: null, referenceMax: 150 },
  { name: 'COLESTEROL VLDL', unit: 'mg/dL', category: 'Lipid Profile', referenceMin: null, referenceMax: 30 },
  { name: 'COLESTEROL NÃO-HDL', unit: 'mg/dL', category: 'Lipid Profile', referenceMin: null, referenceMax: 130 },
  { name: 'Glicose Jejum', unit: 'mg/dL', category: 'Metabolic', referenceMin: 70, referenceMax: 99 },
  { name: 'TESTOSTERONA', unit: 'ng/dL', category: 'Hormonal', referenceMin: 300, referenceMax: 1000 },
  { name: 'TESTOSTERONA LIVRE', unit: 'ng/dL', category: 'Hormonal', referenceMin: 5, referenceMax: 21 },
  { name: 'ESTRADIOL', unit: 'pg/mL', category: 'Hormonal', referenceMin: 10, referenceMax: 50 },
  { name: 'TSH ULTRA SENSÍVEL', unit: 'microUI/mL', category: 'Thyroid', referenceMin: 0.4, referenceMax: 4.0 },
  { name: 'T4 LIVRE', unit: 'ng/dL', category: 'Thyroid', referenceMin: 0.8, referenceMax: 1.8 },
  { name: 'CREATININA', unit: 'mg/dL', category: 'Kidney Function', referenceMin: 0.7, referenceMax: 1.3 },
  { name: 'UREIA', unit: 'mg/dL', category: 'Kidney Function', referenceMin: 10, referenceMax: 50 },
  { name: 'RITMO DE FILTRAÇÃO GLOMERULAR', unit: 'mL/min/1.73m2', category: 'Kidney Function', referenceMin: 90, referenceMax: null },
  { name: '25-HIDROXIVITAMINA D', unit: 'ng/mL', category: 'Vitamins', referenceMin: 30, referenceMax: 100 },
  { name: 'VITAMINA B12', unit: 'pg/mL', category: 'Vitamins', referenceMin: 200, referenceMax: 900 },
  { name: 'FERRITINA SÉRICA', unit: 'ng/mL', category: 'Iron Metabolism', referenceMin: 30, referenceMax: 400 },
  { name: 'FERRO SÉRICO', unit: 'mcg/dL', category: 'Iron Metabolism', referenceMin: 50, referenceMax: 150 },
  { name: 'CÁLCIO', unit: 'mg/dL', category: 'Minerals', referenceMin: 8.5, referenceMax: 10.5 },
  { name: 'MAGNÉSIO', unit: 'mg/dL', category: 'Minerals', referenceMin: 1.7, referenceMax: 2.2 },
  { name: 'FÓSFORO', unit: 'mg/dL', category: 'Minerals', referenceMin: 2.5, referenceMax: 4.5 },
  { name: 'POTÁSSIO', unit: 'mEq/L', category: 'Electrolytes', referenceMin: 3.5, referenceMax: 5.0 },
  { name: 'SÓDIO', unit: 'mEq/L', category: 'Electrolytes', referenceMin: 135, referenceMax: 145 },
  { name: 'TGO', unit: 'U/L', category: 'Liver Function', referenceMin: null, referenceMax: 40 },
  { name: 'TGP', unit: 'U/L', category: 'Liver Function', referenceMin: null, referenceMax: 41 },
  { name: 'GAMA GT', unit: 'U/L', category: 'Liver Function', referenceMin: null, referenceMax: 60 },
  { name: 'PARATORMÔNIO PTH', unit: 'pg/mL', category: 'Hormonal', referenceMin: 15, referenceMax: 65 },
  { name: 'FSH', unit: 'mUI/mL', category: 'Hormonal', referenceMin: 1.5, referenceMax: 12.4 },
  { name: 'LH', unit: 'mUI/mL', category: 'Hormonal', referenceMin: 1.7, referenceMax: 8.6 },
  { name: 'SHBG', unit: 'nmol/L', category: 'Hormonal', referenceMin: 18, referenceMax: 54 },
  { name: 'ANTICORPOS ANTI-TPO', unit: 'UI/mL', category: 'Thyroid', referenceMin: null, referenceMax: 34 },
];

// FICTIONAL exam history data (2022-2026) - All values are randomly generated
const EXAM_HISTORY = {
  'COLESTEROL HDL': [
    { date: '2022-02-10', value: 45 },
    { date: '2023-02-15', value: 47 },
    { date: '2024-02-12', value: 49 },
    { date: '2025-02-14', value: 51 },
    { date: '2026-02-14', value: 53 },
  ],
  'COLESTEROL LDL': [
    { date: '2022-02-10', value: 125 },
    { date: '2023-02-15', value: 118 },
    { date: '2024-02-12', value: 110 },
    { date: '2025-02-14', value: 102 },
    { date: '2026-02-14', value: 95 },
  ],
  'COLESTEROL TOTAL': [
    { date: '2022-02-10', value: 210 },
    { date: '2023-02-15', value: 198 },
    { date: '2024-02-12', value: 185 },
    { date: '2025-02-14', value: 172 },
    { date: '2026-02-14', value: 165 },
  ],
  'Triglicerídeos': [
    { date: '2022-02-10', value: 165 },
    { date: '2023-02-15', value: 152 },
    { date: '2024-02-12', value: 138 },
    { date: '2025-02-14', value: 125 },
    { date: '2026-02-14', value: 112 },
  ],
  'COLESTEROL VLDL': [
    { date: '2022-02-10', value: 33 },
    { date: '2023-02-15', value: 30 },
    { date: '2024-02-12', value: 28 },
    { date: '2025-02-14', value: 25 },
    { date: '2026-02-14', value: 22 },
  ],
  'COLESTEROL NÃO-HDL': [
    { date: '2022-02-10', value: 165 },
    { date: '2023-02-15', value: 151 },
    { date: '2024-02-12', value: 136 },
    { date: '2025-02-14', value: 121 },
    { date: '2026-02-14', value: 112 },
  ],
  'Glicose Jejum': [
    { date: '2022-02-10', value: 96 },
    { date: '2023-02-15', value: 92 },
    { date: '2024-02-12', value: 88 },
    { date: '2025-02-14', value: 85 },
    { date: '2026-02-14', value: 82 },
  ],
  'TESTOSTERONA': [
    { date: '2022-02-10', value: 520 },
    { date: '2023-02-15', value: 535 },
    { date: '2024-02-12', value: 550 },
    { date: '2025-02-14', value: 565 },
    { date: '2026-02-14', value: 580 },
  ],
  'TESTOSTERONA LIVRE': [
    { date: '2022-02-10', value: 12.5 },
    { date: '2023-02-15', value: 13.2 },
    { date: '2024-02-12', value: 13.8 },
    { date: '2025-02-14', value: 14.5 },
    { date: '2026-02-14', value: 15.2 },
  ],
  'ESTRADIOL': [
    { date: '2022-02-10', value: 28 },
    { date: '2023-02-15', value: 26 },
    { date: '2024-02-12', value: 25 },
    { date: '2025-02-14', value: 24 },
    { date: '2026-02-14', value: 23 },
  ],
  'TSH ULTRA SENSÍVEL': [
    { date: '2022-02-10', value: 2.1 },
    { date: '2023-02-15', value: 2.0 },
    { date: '2024-02-12', value: 1.9 },
    { date: '2025-02-14', value: 1.8 },
    { date: '2026-02-14', value: 1.7 },
  ],
  'T4 LIVRE': [
    { date: '2022-02-10', value: 1.2 },
    { date: '2023-02-15', value: 1.25 },
    { date: '2024-02-12', value: 1.3 },
    { date: '2025-02-14', value: 1.32 },
    { date: '2026-02-14', value: 1.35 },
  ],
  'CREATININA': [
    { date: '2022-02-10', value: 1.05 },
    { date: '2023-02-15', value: 1.02 },
    { date: '2024-02-12', value: 0.98 },
    { date: '2025-02-14', value: 0.95 },
    { date: '2026-02-14', value: 0.92 },
  ],
  'UREIA': [
    { date: '2022-02-10', value: 35 },
    { date: '2023-02-15', value: 33 },
    { date: '2024-02-12', value: 31 },
    { date: '2025-02-14', value: 29 },
    { date: '2026-02-14', value: 27 },
  ],
  'RITMO DE FILTRAÇÃO GLOMERULAR': [
    { date: '2022-02-10', value: 95 },
    { date: '2023-02-15', value: 97 },
    { date: '2024-02-12', value: 99 },
    { date: '2025-02-14', value: 101 },
    { date: '2026-02-14', value: 103 },
  ],
  '25-HIDROXIVITAMINA D': [
    { date: '2022-02-10', value: 28 },
    { date: '2023-02-15', value: 32 },
    { date: '2024-02-12', value: 36 },
    { date: '2025-02-14', value: 40 },
    { date: '2026-02-14', value: 44 },
  ],
  'VITAMINA B12': [
    { date: '2022-02-10', value: 450 },
    { date: '2023-02-15', value: 480 },
    { date: '2024-02-12', value: 510 },
    { date: '2025-02-14', value: 540 },
    { date: '2026-02-14', value: 570 },
  ],
  'FERRITINA SÉRICA': [
    { date: '2022-02-10', value: 180 },
    { date: '2023-02-15', value: 175 },
    { date: '2024-02-12', value: 170 },
    { date: '2025-02-14', value: 165 },
    { date: '2026-02-14', value: 160 },
  ],
  'FERRO SÉRICO': [
    { date: '2022-02-10', value: 95 },
    { date: '2023-02-15', value: 98 },
    { date: '2024-02-12', value: 101 },
    { date: '2025-02-14', value: 104 },
    { date: '2026-02-14', value: 107 },
  ],
  'CÁLCIO': [
    { date: '2022-02-10', value: 9.2 },
    { date: '2023-02-15', value: 9.3 },
    { date: '2024-02-12', value: 9.4 },
    { date: '2025-02-14', value: 9.5 },
    { date: '2026-02-14', value: 9.6 },
  ],
  'MAGNÉSIO': [
    { date: '2022-02-10', value: 1.9 },
    { date: '2023-02-15', value: 1.92 },
    { date: '2024-02-12', value: 1.94 },
    { date: '2025-02-14', value: 1.96 },
    { date: '2026-02-14', value: 1.98 },
  ],
  'FÓSFORO': [
    { date: '2022-02-10', value: 3.2 },
    { date: '2023-02-15', value: 3.3 },
    { date: '2024-02-12', value: 3.4 },
    { date: '2025-02-14', value: 3.5 },
    { date: '2026-02-14', value: 3.6 },
  ],
  'POTÁSSIO': [
    { date: '2022-02-10', value: 4.2 },
    { date: '2023-02-15', value: 4.1 },
    { date: '2024-02-12', value: 4.0 },
    { date: '2025-02-14', value: 3.9 },
    { date: '2026-02-14', value: 3.8 },
  ],
  'SÓDIO': [
    { date: '2022-02-10', value: 140 },
    { date: '2023-02-15', value: 139 },
    { date: '2024-02-12', value: 138 },
    { date: '2025-02-14', value: 139 },
    { date: '2026-02-14', value: 140 },
  ],
  'TGO': [
    { date: '2022-02-10', value: 28 },
    { date: '2023-02-15', value: 26 },
    { date: '2024-02-12', value: 24 },
    { date: '2025-02-14', value: 22 },
    { date: '2026-02-14', value: 20 },
  ],
  'TGP': [
    { date: '2022-02-10', value: 32 },
    { date: '2023-02-15', value: 30 },
    { date: '2024-02-12', value: 28 },
    { date: '2025-02-14', value: 26 },
    { date: '2026-02-14', value: 24 },
  ],
  'GAMA GT': [
    { date: '2022-02-10', value: 45 },
    { date: '2023-02-15', value: 42 },
    { date: '2024-02-12', value: 39 },
    { date: '2025-02-14', value: 36 },
    { date: '2026-02-14', value: 33 },
  ],
  'PARATORMÔNIO PTH': [
    { date: '2022-02-10', value: 42 },
    { date: '2023-02-15', value: 40 },
    { date: '2024-02-12', value: 38 },
    { date: '2025-02-14', value: 36 },
    { date: '2026-02-14', value: 34 },
  ],
  'FSH': [
    { date: '2022-02-10', value: 6.5 },
    { date: '2023-02-15', value: 6.8 },
    { date: '2024-02-12', value: 7.1 },
    { date: '2025-02-14', value: 7.4 },
    { date: '2026-02-14', value: 7.7 },
  ],
  'LH': [
    { date: '2022-02-10', value: 4.2 },
    { date: '2023-02-15', value: 4.4 },
    { date: '2024-02-12', value: 4.6 },
    { date: '2025-02-14', value: 4.8 },
    { date: '2026-02-14', value: 5.0 },
  ],
  'SHBG': [
    { date: '2022-02-10', value: 35 },
    { date: '2023-02-15', value: 36 },
    { date: '2024-02-12', value: 37 },
    { date: '2025-02-14', value: 38 },
    { date: '2026-02-14', value: 39 },
  ],
  'ANTICORPOS ANTI-TPO': [
    { date: '2022-02-10', value: 12 },
    { date: '2023-02-15', value: 11 },
    { date: '2024-02-12', value: 10 },
    { date: '2025-02-14', value: 9 },
    { date: '2026-02-14', value: 8 },
  ],
};

async function main() {
  console.log('🌱 Starting demo data seeder...\n');

  // Connect to database
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  try {
    // 1. Create or get demo user
    console.log('👤 Creating demo user...');
    let demoUser = await db.query.user.findFirst({
      where: eq(schema.user.openId, DEMO_USER_OPEN_ID),
    });

    if (!demoUser) {
      const [insertedUser] = await db.insert(schema.user).values({
        openId: DEMO_USER_OPEN_ID,
        email: DEMO_USER_EMAIL,
        name: DEMO_USER_NAME,
        role: 'user',
      });
      demoUser = await db.query.user.findFirst({
        where: eq(schema.user.id, insertedUser.insertId),
      });
    }

    console.log(`✅ Demo user ready: ${demoUser.email} (ID: ${demoUser.id})\n`);

    // 2. Create or get demo patient
    console.log('🏥 Creating demo patient (John Doe - FICTIONAL)...');
    let demoPatient = await db.query.patients.findFirst({
      where: eq(schema.patients.userId, demoUser.id),
    });

    if (!demoPatient) {
      const patientId = `john-doe-${Date.now()}`;
      await db.insert(schema.patients).values({
        id: patientId,
        userId: demoUser.id,
        name: DEMO_PATIENT.name,
        birthDate: DEMO_PATIENT.birthDate,
        gender: DEMO_PATIENT.gender,
      });
      demoPatient = await db.query.patients.findFirst({
        where: eq(schema.patients.id, patientId),
      });
    }

    console.log(`✅ Demo patient ready: ${demoPatient.name} (ID: ${demoPatient.id})\n`);

    // 3. Insert exam definitions
    console.log('📋 Inserting exam definitions...');
    for (const examDef of EXAM_DEFINITIONS) {
      const existing = await db.query.exams.findFirst({
        where: eq(schema.exams.name, examDef.name),
      });

      if (!existing) {
        await db.insert(schema.exams).values(examDef);
      }
    }
    console.log(`✅ ${EXAM_DEFINITIONS.length} exam definitions ready\n`);

    // 4. Insert anthropometric data
    console.log('📏 Inserting anthropometric data...');
    for (const anthro of ANTHROPOMETRIC_DATA) {
      const existing = await db.query.anthropometricData.findFirst({
        where: (table, { and, eq }) =>
          and(
            eq(table.patientId, demoPatient.id),
            eq(table.date, anthro.date)
          ),
      });

      if (!existing) {
        await db.insert(schema.anthropometricData).values({
          patientId: demoPatient.id,
          userId: demoUser.id,
          date: anthro.date,
          weight: anthro.weight,
          height: anthro.height,
          waistCircumference: anthro.waistCircumference,
        });
      }
    }
    console.log(`✅ ${ANTHROPOMETRIC_DATA.length} anthropometric records inserted\n`);

    // 5. Insert exam history
    console.log('🧪 Inserting exam history (FICTIONAL data)...');
    let totalExams = 0;

    for (const [examName, history] of Object.entries(EXAM_HISTORY)) {
      const exam = await db.query.exams.findFirst({
        where: eq(schema.exams.name, examName),
      });

      if (!exam) {
        console.warn(`⚠️  Exam not found: ${examName}`);
        continue;
      }

      for (const record of history) {
        const existing = await db.query.examHistory.findFirst({
          where: (table, { and, eq }) =>
            and(
              eq(table.patientId, demoPatient.id),
              eq(table.examId, exam.id),
              eq(table.date, record.date)
            ),
        });

        if (!existing) {
          await db.insert(schema.examHistory).values({
            patientId: demoPatient.id,
            userId: demoUser.id,
            examId: exam.id,
            date: record.date,
            value: record.value,
          });
          totalExams++;
        }
      }
    }

    console.log(`✅ ${totalExams} exam records inserted\n`);

    console.log('✨ Demo data seeding completed successfully!\n');
    console.log('📝 Demo Account Details:');
    console.log(`   Email: ${DEMO_USER_EMAIL}`);
    console.log(`   Patient: ${DEMO_PATIENT.name} (FICTIONAL)`);
    console.log(`   Exam History: 2022-2026 (${totalExams} records)`);
    console.log('\n⚠️  IMPORTANT: All data is FICTIONAL and does not represent any real person.\n');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
