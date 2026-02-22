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
  personalizedRecommendations?: {
    actionPlan: string;
    dietSuggestions: string;
    exercisePlan: string;
    followUpSchedule: string;
  };
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

  const isMultipleExams = input.examNames.length > 1;
  const examType = isMultipleExams ? 'perfil integrado' : 'exame';

  const prompt = `Você é um ${specialist.split('–')[0].trim()} experiente analisando ${examType} de um paciente.

**DADOS DO PACIENTE:**
Nome: ${patient.name}
${anthropometricContext}

**EXAMES REALIZADOS:**
${examContext}

**ÍNDICES CLÍNICOS CALCULADOS:**
${indicesContext}

**INSTRUÇÕES:**
1. Fale diretamente com o paciente usando "Sr./Sra. ${patient.name.split(' ')[0]}"
2. ${isMultipleExams 
  ? `Como está analisando MÚLTIPLOS EXAMES CORRELACIONADOS, foque na ANÁLISE INTEGRADA:
   - Comece explicando brevemente cada exame (valor, referência, status)
   - PRIORIZE a correlação entre os exames e o que esse CONJUNTO revela
   - Explique padrões clínicos (ex: HDL baixo + TG alto + LDL elevado = perfil aterogênico)
   - Use os índices calculados para reforçar a análise integrada
   - Correlacione com dados antropométricos (peso, IMC, circunferência)
   - Explique o que esse perfil COMPLETO significa para a saúde do paciente`
  : `Analise o exame individualmente:
   - O valor atual
   - A faixa de referência ideal
   - Se está normal, baixo ou alto
   - Correlação com dados antropométricos (peso, IMC, circunferência)`}
3. Explique o risco de forma clara e objetiva:
   - Não é urgência? Diga claramente
   - Requer atenção? Explique por quê
   - É urgente? Indique a gravidade
4. Termine com orientações práticas e próximos passos
5. Use linguagem acessível mas precisa
6. Seja empático mas direto
7. Não use markdown, apenas texto corrido com parágrafos

**FORMATO DE RESPOSTA:**
Escreva uma análise em linguagem natural, como se estivesse conversando com o paciente no consultório. ${isMultipleExams ? 'Dê ênfase à visão INTEGRADA do perfil completo, não apenas exames isolados.' : 'Seja específico com os números e valores.'} Use parágrafos bem estruturados.`;

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

  // 9. Gerar recomendações personalizadas com LLM
  const recommendationsPrompt = `Baseado na análise médica do paciente ${patient.name}, gere recomendações personalizadas e práticas.

**CONTEXTO:**
${examContext}
${anthropometricContext}
Índices clínicos: ${indicesContext}
Nível de urgência: ${urgencyLevel}

**GERE 4 SEÇÕES DE RECOMENDAÇÕES:**

1. **PLANO DE AÇÃO (3-6 meses):**
   - Metas específicas e mensuráveis (ex: "Reduzir 5kg em 3 meses")
   - Objetivos de exames (ex: "Elevar HDL para acima de 40 mg/dL")
   - Marcos intermediários

2. **SUGESTÕES DE DIETA:**
   - Alimentos a priorizar (específicos, não genéricos)
   - Alimentos a evitar ou reduzir
   - Exemplo de cardápio diário
   - Dicas práticas de preparo

3. **PLANO DE EXERCÍCIOS:**
   - Tipo de exercício recomendado (aeróbico, resistência, etc)
   - Frequência semanal
   - Duração e intensidade
   - Progressão ao longo do tempo

4. **CRONOGRAMA DE ACOMPANHAMENTO:**
   - Quando repetir os exames
   - Consultas de acompanhamento
   - Sinais de alerta para buscar atendimento antes

**FORMATO:** Retorne um JSON com as chaves: actionPlan, dietSuggestions, exercisePlan, followUpSchedule. Cada valor deve ser uma string em markdown com parágrafos bem formatados.`;

  const recommendationsResponse = await invokeLLM({
    messages: [
      { role: 'system', content: 'Você é um médico especialista criando um plano de ação personalizado para o paciente.' },
      { role: 'user', content: recommendationsPrompt }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'personalized_recommendations',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            actionPlan: { type: 'string', description: 'Plano de ação com metas específicas' },
            dietSuggestions: { type: 'string', description: 'Sugestões de dieta e alimentação' },
            exercisePlan: { type: 'string', description: 'Plano de exercícios físicos' },
            followUpSchedule: { type: 'string', description: 'Cronograma de acompanhamento' },
          },
          required: ['actionPlan', 'dietSuggestions', 'exercisePlan', 'followUpSchedule'],
          additionalProperties: false,
        },
      },
    },
  });

  const recommendationsContent = recommendationsResponse.choices[0].message.content;
  const personalizedRecommendations = typeof recommendationsContent === 'string' 
    ? JSON.parse(recommendationsContent) 
    : undefined;

  return {
    specialist,
    specialtyEmoji: emoji,
    patientName: patient.name,
    analysis,
    examValues,
    clinicalIndices,
    urgencyLevel,
    recommendations,
    personalizedRecommendations,
  };
}
