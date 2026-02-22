/**
 * Medical Analysis Service
 * 
 * Serviço separado para análise médica de correlações entre exames.
 * Estruturado para futuro consumo via MCP (Model Context Protocol).
 * 
 * Funcionalidades:
 * - Busca valores reais dos exames correlacionados
 * - Calcula índices clínicos (TG/HDL, CT/HDL, etc)
 * - Gera análise em linguagem natural como especialista
 * - Contextualiza com dados antropométricos do paciente
 */

import { invokeLLM } from '../_core/llm';
import { getDb } from '../db';
import { examHistory, patients } from '../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface ExamValue {
  name: string;
  value: number;
  unit: string;
  date: string;
  referenceMin?: number;
  referenceMax?: number;
  status: 'normal' | 'low' | 'high';
}

export interface ClinicalIndices {
  tgHdlRatio?: number;
  ctHdlRatio?: number;
  ldlHdlRatio?: number;
  nonHdlCholesterol?: number;
}

export interface MedicalAnalysisInput {
  patientId: string;
  userId: number;
  examNames: string[];
  correlationDate?: string;
}

export interface MedicalAnalysisOutput {
  specialist: string;
  specialtyEmoji: string;
  patientName: string;
  analysis: string;
  examValues: ExamValue[];
  clinicalIndices: ClinicalIndices;
  urgencyLevel: 'good' | 'attention' | 'urgent';
  recommendations: string[];
}

/**
 * Busca valores mais recentes dos exames especificados
 */
async function fetchExamValues(
  patientId: string,
  userId: number,
  examNames: string[],
  correlationDate?: string
): Promise<ExamValue[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const examValues: ExamValue[] = [];

  for (const examName of examNames) {
    const results = await db
      .select()
      .from(examHistory)
      .where(
        and(
          eq(examHistory.patientId, patientId),
          eq(examHistory.userId, userId),
          eq(examHistory.examName, examName)
        )
      )
      .orderBy(desc(examHistory.date))
      .limit(1);

    const exam = results[0];

    if (exam) {
      examValues.push({
        name: exam.examName,
        value: parseFloat(exam.value),
        unit: '', // Will be filled from exams table if needed
        date: exam.date.toString(),
        referenceMin: undefined,
        referenceMax: undefined,
        status: exam.status as 'normal' | 'low' | 'high',
      });
    }
  }

  return examValues;
}

/**
 * Busca dados antropométricos do paciente
 */
async function fetchPatientData(patientId: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const [patient] = await db
    .select()
    .from(patients)
    .where(and(eq(patients.id, patientId), eq(patients.userId, userId)));

  return patient;
}

/**
 * Calcula índices clínicos baseado nos valores dos exames
 */
function calculateClinicalIndices(examValues: ExamValue[]): ClinicalIndices {
  const indices: ClinicalIndices = {};

  const hdl = examValues.find(e => e.name.toLowerCase().includes('hdl'))?.value;
  const ldl = examValues.find(e => e.name.toLowerCase().includes('ldl'))?.value;
  const tg = examValues.find(e => e.name.toLowerCase().includes('triglicerídeos') || e.name.toLowerCase().includes('triglicerides'))?.value;
  const ct = examValues.find(e => e.name.toLowerCase() === 'colesterol total')?.value;

  if (tg && hdl) {
    indices.tgHdlRatio = tg / hdl;
  }

  if (ct && hdl) {
    indices.ctHdlRatio = ct / hdl;
  }

  if (ldl && hdl) {
    indices.ldlHdlRatio = ldl / hdl;
  }

  if (ct && hdl) {
    indices.nonHdlCholesterol = ct - hdl;
  }

  return indices;
}

/**
 * Determina o especialista adequado baseado nos exames
 */
function determineSpecialist(examNames: string[]): { specialist: string; emoji: string } {
  const examsLower = examNames.map(n => n.toLowerCase()).join(' ');

  if (examsLower.includes('hdl') || examsLower.includes('ldl') || examsLower.includes('colesterol') || examsLower.includes('triglicerídeos')) {
    return { specialist: 'Cardiologista – Prevenção Cardiovascular', emoji: '👨‍⚕️' };
  }

  if (examsLower.includes('glicose') || examsLower.includes('hemoglobina glicada') || examsLower.includes('insulina')) {
    return { specialist: 'Endocrinologista – Metabolismo e Diabetes', emoji: '👩‍⚕️' };
  }

  if (examsLower.includes('creatinina') || examsLower.includes('ureia') || examsLower.includes('ácido úrico')) {
    return { specialist: 'Nefrologista – Saúde Renal', emoji: '👨‍⚕️' };
  }

  if (examsLower.includes('tgo') || examsLower.includes('tgp') || examsLower.includes('gama gt') || examsLower.includes('bilirrubina')) {
    return { specialist: 'Hepatologista – Saúde Hepática', emoji: '👩‍⚕️' };
  }

  if (examsLower.includes('tsh') || examsLower.includes('t4') || examsLower.includes('t3')) {
    return { specialist: 'Endocrinologista – Função Tireoidiana', emoji: '👨‍⚕️' };
  }

  if (examsLower.includes('hemoglobina') || examsLower.includes('ferro') || examsLower.includes('ferritina')) {
    return { specialist: 'Hematologista – Saúde Sanguínea', emoji: '👩‍⚕️' };
  }

  return { specialist: 'Clínico Geral – Análise Integrada', emoji: '👨‍⚕️' };
}

/**
 * Gera análise médica em linguagem natural usando LLM
 */
export async function generateMedicalAnalysis(
  input: MedicalAnalysisInput
): Promise<MedicalAnalysisOutput> {
  // 1. Buscar valores dos exames
  const examValues = await fetchExamValues(
    input.patientId,
    input.userId,
    input.examNames,
    input.correlationDate
  );

  // 2. Buscar dados do paciente
  const patient = await fetchPatientData(input.patientId, input.userId);

  if (!patient) {
    throw new Error('Paciente não encontrado');
  }

  // 3. Calcular índices clínicos
  const clinicalIndices = calculateClinicalIndices(examValues);

  // 4. Determinar especialista
  const { specialist, emoji } = determineSpecialist(input.examNames);

  // 5. Preparar contexto para LLM
  const examContext = examValues
    .map(e => {
      const refRange = e.referenceMin && e.referenceMax 
        ? `(Referência: ${e.referenceMin}-${e.referenceMax} ${e.unit})`
        : '';
      return `- ${e.name}: ${e.value} ${e.unit} ${refRange} [Status: ${e.status}]`;
    })
    .join('\n');

  const indicesContext = Object.entries(clinicalIndices)
    .map(([key, value]) => `- ${key}: ${value?.toFixed(2)}`)
    .join('\n');

  const weight = patient.weight ? parseFloat(patient.weight) : null;
  const bmi = patient.bmi ? parseFloat(patient.bmi) : null;
  const waist = patient.waist;

  const anthropometricContext = `
Peso: ${weight} kg
Altura: ${patient.height} cm
IMC: ${bmi?.toFixed(1)}
Circunferência Abdominal: ${waist} cm
  `.trim();

  const prompt = `Você é um ${specialist.split('–')[0].trim()} experiente analisando exames de um paciente.

**DADOS DO PACIENTE:**
Nome: ${patient.name}
${anthropometricContext}

**EXAMES REALIZADOS:**
${examContext}

**ÍNDICES CLÍNICOS CALCULADOS:**
${indicesContext}

**INSTRUÇÕES:**
1. Fale diretamente com o paciente usando "Sr./Sra. ${patient.name.split(' ')[0]}"
2. Analise cada exame individualmente primeiro, explicando:
   - O valor atual
   - A faixa de referência ideal
   - Se está normal, baixo ou alto
3. Depois, correlacione os exames entre si, explicando:
   - Padrões identificados (ex: HDL baixo + TG alto = resistência à insulina)
   - Índices calculados e seu significado clínico
   - Relação com dados antropométricos (peso, IMC, circunferência)
4. Explique o risco de forma clara e objetiva:
   - Não é urgência? Diga claramente
   - Requer atenção? Explique por quê
   - É urgente? Indique a gravidade
5. Termine com orientações práticas e próximos passos
6. Use linguagem acessível mas precisa
7. Seja empático mas direto
8. Não use markdown, apenas texto corrido com parágrafos

**FORMATO DE RESPOSTA:**
Escreva uma análise em linguagem natural, como se estivesse conversando com o paciente no consultório. Use parágrafos bem estruturados. Seja específico com os números e valores.`;

  // 6. Invocar LLM
  const response = await invokeLLM({
    messages: [
      { role: 'system', content: 'Você é um médico especialista experiente que explica resultados de exames de forma clara e empática.' },
      { role: 'user', content: prompt }
    ],
  });

  const messageContent = response.choices[0].message.content;
  const analysis = typeof messageContent === 'string' ? messageContent : 'Análise não disponível';

  // 7. Determinar nível de urgência baseado nos status
  let urgencyLevel: 'good' | 'attention' | 'urgent' = 'good';
  const highCount = examValues.filter(e => e.status === 'high').length;
  const lowCount = examValues.filter(e => e.status === 'low').length;

  if (highCount >= 2 || lowCount >= 2) {
    urgencyLevel = 'attention';
  }
  if (highCount >= 3) {
    urgencyLevel = 'urgent';
  }

  // 8. Gerar recomendações
  const recommendations: string[] = [];
  if (clinicalIndices.tgHdlRatio && clinicalIndices.tgHdlRatio > 5) {
    recommendations.push('Reduzir gordura visceral através de dieta e exercícios');
    recommendations.push('Melhorar sensibilidade à insulina');
  }
  if (examValues.some(e => e.name.toLowerCase().includes('ldl') && e.status === 'high')) {
    recommendations.push('Reduzir LDL através de alimentação balanceada');
  }
  const bmiValue = patient.bmi ? parseFloat(patient.bmi) : null;
  if (bmiValue && bmiValue > 30) {
    recommendations.push('Programa estruturado de perda de peso');
  }
  if (urgencyLevel === 'attention' || urgencyLevel === 'urgent') {
    recommendations.push('Acompanhamento médico regular');
  }

  return {
    specialist,
    specialtyEmoji: emoji,
    patientName: patient.name,
    analysis,
    examValues,
    clinicalIndices,
    urgencyLevel,
    recommendations,
  };
}
