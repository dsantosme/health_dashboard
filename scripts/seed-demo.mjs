#!/usr/bin/env node
/**
 * Demo Data Seeder
 * 
 * Populates the database with fictional patient data for local testing.
 * Run with: pnpm seed:demo
 * 
 * Demo Account:
 * - Email: health.demo@manus.im
 * - Patient: Denis Santos (fictional)
 * - Data: Complete exam history 2022-2026
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const DEMO_USER_OPEN_ID = 'demo-user-open-id-12345';
const DEMO_USER_EMAIL = 'health.demo@manus.im';
const DEMO_USER_NAME = 'Demo User';

// Fictional patient data
const DEMO_PATIENT = {
  name: 'Denis Santos',
  birthDate: '1985-03-15',
  gender: 'male',
};

// Anthropometric data over time
const ANTHROPOMETRIC_DATA = [
  { date: '2022-02-10', weight: 115, height: 182, waistCircumference: 118 },
  { date: '2023-02-15', weight: 112, height: 182, waistCircumference: 115 },
  { date: '2024-02-12', weight: 110, height: 182, waistCircumference: 113 },
  { date: '2025-02-14', weight: 108, height: 182, waistCircumference: 112 },
  { date: '2026-02-14', weight: 107, height: 182, waistCircumference: 111 },
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

// Exam history data (2022-2026)
const EXAM_HISTORY = {
  'COLESTEROL HDL': [
    { date: '2022-02-10', value: 41 },
    { date: '2023-02-15', value: 40 },
    { date: '2024-02-12', value: 39 },
    { date: '2025-02-14', value: 38 },
    { date: '2026-02-14', value: 38 },
  ],
  'COLESTEROL LDL': [
    { date: '2022-02-10', value: 138 },
    { date: '2023-02-15', value: 130 },
    { date: '2024-02-12', value: 125 },
    { date: '2025-02-14', value: 117 },
    { date: '2026-02-14', value: 109 },
  ],
  'COLESTEROL TOTAL': [
    { date: '2022-02-10', value: 219 },
    { date: '2023-02-15', value: 210 },
    { date: '2024-02-12', value: 195 },
    { date: '2025-02-14', value: 179 },
    { date: '2026-02-14', value: 172 },
  ],
  'Triglicerídeos': [
    { date: '2022-02-10', value: 198 },
    { date: '2023-02-15', value: 180 },
    { date: '2024-02-12', value: 155 },
    { date: '2025-02-14', value: 120 },
    { date: '2026-02-14', value: 100 },
  ],
  'COLESTEROL VLDL': [
    { date: '2022-02-10', value: 40 },
    { date: '2023-02-15', value: 36 },
    { date: '2024-02-12', value: 31 },
    { date: '2025-02-14', value: 24 },
    { date: '2026-02-14', value: 25 },
  ],
  'COLESTEROL NÃO-HDL': [
    { date: '2022-02-10', value: 178 },
    { date: '2023-02-15', value: 170 },
    { date: '2024-02-12', value: 156 },
    { date: '2025-02-14', value: 141 },
    { date: '2026-02-14', value: 134 },
  ],
  'Glicose Jejum': [
    { date: '2022-02-10', value: 102 },
    { date: '2023-02-15', value: 98 },
    { date: '2024-02-12', value: 96 },
    { date: '2025-02-14', value: 95 },
    { date: '2026-02-14', value: 94 },
  ],
  'TESTOSTERONA': [
    { date: '2022-02-10', value: 285 },
    { date: '2023-02-15', value: 295 },
    { date: '2024-02-12', value: 305 },
    { date: '2025-02-14', value: 312 },
    { date: '2026-02-14', value: 317 },
  ],
  'TESTOSTERONA LIVRE': [
    { date: '2022-02-10', value: 6.5 },
    { date: '2023-02-15', value: 6.8 },
    { date: '2024-02-12', value: 7.0 },
    { date: '2025-02-14', value: 7.2 },
    { date: '2026-02-14', value: 7.31 },
  ],
  'ESTRADIOL': [
    { date: '2022-02-10', value: 38.5 },
    { date: '2023-02-15', value: 37.2 },
    { date: '2024-02-12', value: 36.0 },
    { date: '2025-02-14', value: 35.5 },
    { date: '2026-02-14', value: 35.3 },
  ],
  'TSH ULTRA SENSÍVEL': [
    { date: '2022-02-10', value: 1.85 },
    { date: '2023-02-15', value: 1.78 },
    { date: '2024-02-12', value: 1.72 },
    { date: '2025-02-14', value: 1.70 },
    { date: '2026-02-14', value: 1.68 },
  ],
  'T4 LIVRE': [
    { date: '2022-02-10', value: 1.12 },
    { date: '2023-02-15', value: 1.10 },
    { date: '2024-02-12', value: 1.08 },
    { date: '2025-02-14', value: 1.06 },
    { date: '2026-02-14', value: 1.05 },
  ],
  'CREATININA': [
    { date: '2022-02-10', value: 1.05 },
    { date: '2023-02-15', value: 1.02 },
    { date: '2024-02-12', value: 1.00 },
    { date: '2025-02-14', value: 0.99 },
    { date: '2026-02-14', value: 0.99 },
  ],
  'UREIA': [
    { date: '2022-02-10', value: 42.5 },
    { date: '2023-02-15', value: 40.8 },
    { date: '2024-02-12', value: 39.2 },
    { date: '2025-02-14', value: 38.0 },
    { date: '2026-02-14', value: 37.2 },
  ],
  'RITMO DE FILTRAÇÃO GLOMERULAR': [
    { date: '2022-02-10', value: 85 },
    { date: '2023-02-15', value: 87 },
    { date: '2024-02-12', value: 89 },
    { date: '2025-02-14', value: 90 },
    { date: '2026-02-14', value: 90 },
  ],
  '25-HIDROXIVITAMINA D': [
    { date: '2022-02-10', value: 28.5 },
    { date: '2023-02-15', value: 30.2 },
    { date: '2024-02-12', value: 31.8 },
    { date: '2025-02-14', value: 32.5 },
    { date: '2026-02-14', value: 33.3 },
  ],
  'VITAMINA B12': [
    { date: '2022-02-10', value: 295 },
    { date: '2023-02-15', value: 310 },
    { date: '2024-02-12', value: 320 },
    { date: '2025-02-14', value: 328 },
    { date: '2026-02-14', value: 331 },
  ],
  'FERRITINA SÉRICA': [
    { date: '2022-02-10', value: 185.2 },
    { date: '2023-02-15', value: 180.5 },
    { date: '2024-02-12', value: 177.8 },
    { date: '2025-02-14', value: 176.0 },
    { date: '2026-02-14', value: 174.4 },
  ],
  'FERRO SÉRICO': [
    { date: '2022-02-10', value: 65 },
    { date: '2023-02-15', value: 62 },
    { date: '2024-02-12', value: 60 },
    { date: '2025-02-14', value: 59 },
    { date: '2026-02-14', value: 59 },
  ],
  'CÁLCIO': [
    { date: '2022-02-10', value: 8.8 },
    { date: '2023-02-15', value: 8.7 },
    { date: '2024-02-12', value: 8.6 },
    { date: '2025-02-14', value: 8.5 },
    { date: '2026-02-14', value: 8.5 },
  ],
  'MAGNÉSIO': [
    { date: '2022-02-10', value: 1.95 },
    { date: '2023-02-15', value: 1.93 },
    { date: '2024-02-12', value: 1.91 },
    { date: '2025-02-14', value: 1.90 },
    { date: '2026-02-14', value: 1.90 },
  ],
  'FÓSFORO': [
    { date: '2022-02-10', value: 4.5 },
    { date: '2023-02-15', value: 4.4 },
    { date: '2024-02-12', value: 4.3 },
    { date: '2025-02-14', value: 4.2 },
    { date: '2026-02-14', value: 4.2 },
  ],
  'POTÁSSIO': [
    { date: '2022-02-10', value: 4.5 },
    { date: '2023-02-15', value: 4.4 },
    { date: '2024-02-12', value: 4.3 },
    { date: '2025-02-14', value: 4.3 },
    { date: '2026-02-14', value: 4.3 },
  ],
  'SÓDIO': [
    { date: '2022-02-10', value: 140 },
    { date: '2023-02-15', value: 141 },
    { date: '2024-02-12', value: 141 },
    { date: '2025-02-14', value: 142 },
    { date: '2026-02-14', value: 142 },
  ],
  'TGO': [
    { date: '2022-02-10', value: 28 },
    { date: '2023-02-15', value: 26 },
    { date: '2024-02-12', value: 25 },
    { date: '2025-02-14', value: 24 },
    { date: '2026-02-14', value: 24 },
  ],
  'TGP': [
    { date: '2022-02-10', value: 38 },
    { date: '2023-02-15', value: 36 },
    { date: '2024-02-12', value: 34 },
    { date: '2025-02-14', value: 33 },
    { date: '2026-02-14', value: 32 },
  ],
  'GAMA GT': [
    { date: '2022-02-10', value: 25 },
    { date: '2023-02-15', value: 23 },
    { date: '2024-02-12', value: 21 },
    { date: '2025-02-14', value: 20 },
    { date: '2026-02-14', value: 19 },
  ],
  'PARATORMÔNIO PTH': [
    { date: '2022-02-10', value: 42.5 },
    { date: '2023-02-15', value: 40.2 },
    { date: '2024-02-12', value: 38.5 },
    { date: '2025-02-14', value: 37.0 },
    { date: '2026-02-14', value: 36.4 },
  ],
  'FSH': [
    { date: '2022-02-10', value: 8.2 },
    { date: '2023-02-15', value: 7.9 },
    { date: '2024-02-12', value: 7.7 },
    { date: '2025-02-14', value: 7.65 },
    { date: '2026-02-14', value: 7.63 },
  ],
  'LH': [
    { date: '2022-02-10', value: 4.5 },
    { date: '2023-02-15', value: 4.3 },
    { date: '2024-02-12', value: 4.1 },
    { date: '2025-02-14', value: 4.0 },
    { date: '2026-02-14', value: 3.95 },
  ],
  'SHBG': [
    { date: '2022-02-10', value: 22 },
    { date: '2023-02-15', value: 23 },
    { date: '2024-02-12', value: 24 },
    { date: '2025-02-14', value: 25 },
    { date: '2026-02-14', value: 25 },
  ],
  'ANTICORPOS ANTI-TPO': [
    { date: '2022-02-10', value: 8.5 },
    { date: '2023-02-15', value: 7.8 },
    { date: '2024-02-12', value: 7.2 },
    { date: '2025-02-14', value: 6.8 },
    { date: '2026-02-14', value: 6.6 },
  ],
};

async function main() {
  console.log('🌱 Seeding demo data...\n');

  // Connect to database
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  try {
    // 1. Create or update demo user
    console.log('👤 Creating demo user...');
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.openId, DEMO_USER_OPEN_ID),
    });

    let userId;
    if (existingUser) {
      console.log('   ✓ Demo user already exists, updating...');
      await db
        .update(schema.user)
        .set({
          name: DEMO_USER_NAME,
          email: DEMO_USER_EMAIL,
          updatedAt: new Date(),
        })
        .where(eq(schema.user.openId, DEMO_USER_OPEN_ID));
      userId = existingUser.id;
    } else {
      console.log('   ✓ Creating new demo user...');
      const [newUser] = await db.insert(schema.user).values({
        openId: DEMO_USER_OPEN_ID,
        name: DEMO_USER_NAME,
        email: DEMO_USER_EMAIL,
        role: 'user',
      });
      userId = newUser.insertId;
    }

    // 2. Create or update demo patient
    console.log('\n🏥 Creating demo patient...');
    const existingPatient = await db.query.patient.findFirst({
      where: eq(schema.patient.userId, userId),
    });

    let patientId;
    if (existingPatient) {
      console.log('   ✓ Demo patient already exists, updating...');
      await db
        .update(schema.patient)
        .set({
          name: DEMO_PATIENT.name,
          birthDate: DEMO_PATIENT.birthDate,
          gender: DEMO_PATIENT.gender,
        })
        .where(eq(schema.patient.id, existingPatient.id));
      patientId = existingPatient.id;
    } else {
      console.log('   ✓ Creating new demo patient...');
      const [newPatient] = await db.insert(schema.patient).values({
        userId,
        name: DEMO_PATIENT.name,
        birthDate: DEMO_PATIENT.birthDate,
        gender: DEMO_PATIENT.gender,
      });
      patientId = newPatient.insertId;
    }

    // 3. Insert anthropometric data
    console.log('\n📏 Inserting anthropometric data...');
    for (const data of ANTHROPOMETRIC_DATA) {
      const existing = await db.query.anthropometricData.findFirst({
        where: eq(schema.anthropometricData.patientId, patientId),
      });

      if (!existing) {
        await db.insert(schema.anthropometricData).values({
          patientId,
          date: data.date,
          weight: data.weight,
          height: data.height,
          waistCircumference: data.waistCircumference,
        });
        console.log(`   ✓ ${data.date}: ${data.weight}kg, ${data.waistCircumference}cm waist`);
      }
    }

    // 4. Insert exam definitions
    console.log('\n🧪 Inserting exam definitions...');
    const examIds = {};
    for (const exam of EXAM_DEFINITIONS) {
      const existing = await db.query.exams.findFirst({
        where: eq(schema.exams.name, exam.name),
      });

      if (existing) {
        examIds[exam.name] = existing.id;
      } else {
        const [newExam] = await db.insert(schema.exams).values({
          name: exam.name,
          unit: exam.unit,
          category: exam.category,
          referenceMin: exam.referenceMin,
          referenceMax: exam.referenceMax,
        });
        examIds[exam.name] = newExam.insertId;
        console.log(`   ✓ ${exam.name} (${exam.category})`);
      }
    }

    // 5. Insert exam history
    console.log('\n📊 Inserting exam history...');
    let totalExams = 0;
    for (const [examName, history] of Object.entries(EXAM_HISTORY)) {
      const examId = examIds[examName];
      if (!examId) {
        console.log(`   ⚠ Skipping ${examName} (exam not found)`);
        continue;
      }

      for (const record of history) {
        const existing = await db.query.examHistory.findFirst({
          where: eq(schema.examHistory.examId, examId),
        });

        if (!existing) {
          await db.insert(schema.examHistory).values({
            patientId,
            examId,
            value: record.value,
            date: record.date,
          });
          totalExams++;
        }
      }
    }
    console.log(`   ✓ Inserted ${totalExams} exam records across ${Object.keys(EXAM_HISTORY).length} exam types`);

    console.log('\n✅ Demo data seeding completed successfully!\n');
    console.log('🎉 You can now login with:');
    console.log(`   Email: ${DEMO_USER_EMAIL}`);
    console.log(`   Patient: ${DEMO_PATIENT.name}`);
    console.log('\n');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
