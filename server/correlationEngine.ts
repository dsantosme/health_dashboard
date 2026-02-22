import { getDb } from './db';
import { examHistory, examCorrelations, exams } from '../drizzle/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { invokeLLM } from './_core/llm';

/**
 * Motor de Correlações Automáticas
 * Processa exames por data e gera análises em linguagem natural
 */

interface ExamData {
  name: string;
  value: number;
  date: string;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: string;
}

interface CorrelationGroup {
  date: string;
  exams: ExamData[];
}

/**
 * Agrupa exames por período (mesma semana)
 */
function groupExamsByPeriod(exams: ExamData[]): CorrelationGroup[] {
  const groups: Map<string, ExamData[]> = new Map();
  
  for (const exam of exams) {
    const examDate = new Date(exam.date);
    // Agrupar por semana (início da semana)
    const weekStart = new Date(examDate);
    weekStart.setDate(examDate.getDate() - examDate.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!groups.has(weekKey)) {
      groups.set(weekKey, []);
    }
    groups.get(weekKey)!.push(exam);
  }
  
  return Array.from(groups.entries()).map(([date, exams]) => ({
    date,
    exams
  }));
}

/**
 * Identifica exames correlacionáveis em um grupo
 */
function findCorrelatableExams(exams: ExamData[]): string[][] {
  const examNames = exams.filter(e => e.name).map(e => e.name.toUpperCase());
  const correlations: string[][] = [];
  
  // Painel Lipídico (Colesterol)
  const lipidPanel = ['COLESTEROL TOTAL', 'COLESTEROL HDL', 'COLESTEROL LDL', 'COLESTEROL VLDL', 'TRIGLICERÍDEOS'];
  const foundLipids = lipidPanel.filter(name => examNames.includes(name));
  if (foundLipids.length >= 2) {
    correlations.push(foundLipids);
  }
  
  // Metabolismo de Glicose
  const glucosePanel = ['GLICOSE JEJUM', 'HEMOGLOBINA GLICADA (HBA1C)', 'INSULINA'];
  const foundGlucose = glucosePanel.filter(name => examNames.includes(name));
  if (foundGlucose.length >= 1) {
    correlations.push(foundGlucose);
  }
  
  // Função Renal
  const renalPanel = ['CREATININA', 'UREIA', 'RITMO DE FILTRAÇÃO GLOMERULAR'];
  const foundRenal = renalPanel.filter(name => examNames.includes(name));
  if (foundRenal.length >= 2) {
    correlations.push(foundRenal);
  }
  
  // Função Hepática
  const liverPanel = ['TGP', 'TGO', 'GAMA GT', 'BILIRRUBINA TOTAL'];
  const foundLiver = liverPanel.filter(name => examNames.includes(name));
  if (foundLiver.length >= 2) {
    correlations.push(foundLiver);
  }
  
  // Ferro e Ferritina
  const ironPanel = ['FERRO SÉRICO', 'FERRITINA SÉRICA', 'SATURAÇÃO DE TRANSFERRINA'];
  const foundIron = ironPanel.filter(name => examNames.includes(name));
  if (foundIron.length >= 2) {
    correlations.push(foundIron);
  }
  
  // Função Tireoidiana
  const thyroidPanel = ['TSH ULTRA SENSÍVEL', 'T4 LIVRE', 'T3 LIVRE', 'ANTICORPOS ANTI-TPO'];
  const foundThyroid = thyroidPanel.filter(name => examNames.includes(name));
  if (foundThyroid.length >= 2) {
    correlations.push(foundThyroid);
  }
  
  // Hormônios Sexuais
  const hormonePanel = ['TESTOSTERONA', 'TESTOSTERONA LIVRE', 'ESTRADIOL', 'FSH', 'LH', 'SHBG'];
  const foundHormones = hormonePanel.filter(name => examNames.includes(name));
  if (foundHormones.length >= 2) {
    correlations.push(foundHormones);
  }
  
  return correlations;
}

/**
 * Gera análise em linguagem natural usando LLM
 */
async function generateAnalysis(exams: ExamData[]): Promise<{
  analysis: string;
  recommendations: string;
  specialists: string[];
  severity: 'good' | 'attention' | 'urgent';
}> {
  const examDetails = exams.map(e => 
    `${e.name}: ${e.value} ${e.unit} (Referência: ${e.referenceMin}-${e.referenceMax}) - Status: ${e.status}`
  ).join('\n');
  
  const prompt = `Você é um médico especialista analisando resultados de exames laboratoriais. Analise os seguintes exames realizados no mesmo período:

${examDetails}

Forneça uma análise médica completa em linguagem natural, como se estivesse explicando para o paciente. Inclua:

1. **Análise Geral**: O que esses exames revelam sobre a saúde do paciente? Há correlações importantes entre eles?

2. **Interpretação**: Os resultados são bons, requerem atenção ou são urgentes?

3. **Recomendações**: O que o paciente deve fazer? Mudanças de estilo de vida, dieta, exercícios?

4. **Especialistas**: Quais especialistas devem ser consultados? (cardiologista, endocrinologista, nutrólogo, nefrologista, hepatologista, hematologista, etc.)

5. **Gravidade**: Classifique como "bom", "atenção" ou "urgente"

Responda em JSON com a seguinte estrutura:
{
  "analysis": "texto da análise completa em português",
  "recommendations": "recomendações detalhadas em português",
  "specialists": ["especialista1", "especialista2"],
  "severity": "good|attention|urgent"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'Você é um médico especialista em análise de exames laboratoriais. Sempre responda em português do Brasil com linguagem clara e acessível.' },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'exam_analysis',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              analysis: { type: 'string', description: 'Análise completa dos exames' },
              recommendations: { type: 'string', description: 'Recomendações para o paciente' },
              specialists: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Lista de especialistas recomendados'
              },
              severity: { 
                type: 'string', 
                enum: ['good', 'attention', 'urgent'],
                description: 'Gravidade da situação'
              }
            },
            required: ['analysis', 'recommendations', 'specialists', 'severity'],
            additionalProperties: false
          }
        }
      }
    });
    
    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : '{}');
    return result;
  } catch (error) {
    console.error('Erro ao gerar análise com LLM:', error);
    // Fallback para análise básica
    return {
      analysis: 'Análise automática não disponível no momento.',
      recommendations: 'Consulte seu médico para interpretação detalhada dos resultados.',
      specialists: ['Clínico Geral'],
      severity: 'attention'
    };
  }
}

/**
 * Processa correlações para um paciente em uma data específica
 */
export async function processCorrelationsForDate(patientId: string, targetDate: string, userId: number): Promise<void> {
  // Buscar exames do paciente em um período de 7 dias ao redor da data alvo
  const dateObj = new Date(targetDate);
  const weekBefore = new Date(dateObj);
  weekBefore.setDate(dateObj.getDate() - 7);
  const weekAfter = new Date(dateObj);
  weekAfter.setDate(dateObj.getDate() + 7);
  
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const examsData: any[] = await db.execute(sql`
    SELECT 
      eh.examName,
      eh.value,
      eh.date,
      eh.status,
      e.unit,
      e.referenceMin,
      e.referenceMax
    FROM exam_history eh
    INNER JOIN exams e ON eh.examName = e.name
    WHERE eh.patientId = ${patientId}
      AND eh.date >= ${weekBefore.toISOString().split('T')[0]}
      AND eh.date <= ${weekAfter.toISOString().split('T')[0]}
  `);
  
  if (examsData.length === 0) {
    return;
  }
  
  const examsList: ExamData[] = examsData.map((e: any) => ({
    name: e.examName,
    value: parseFloat(String(e.value)),
    date: e.date ? (e.date instanceof Date ? e.date.toISOString().split('T')[0] : String(e.date)) : targetDate,
    unit: e.unit || '',
    referenceMin: parseFloat(String(e.referenceMin || '0')),
    referenceMax: parseFloat(String(e.referenceMax || '100')),
    status: e.status || 'normal'
  }));
  
  // Agrupar exames por período
  const groups = groupExamsByPeriod(examsList);
  
  for (const group of groups) {
    if (group.exams.length < 2) continue;
    
    // Identificar exames correlacionáveis
    const correlatableSets = findCorrelatableExams(group.exams);
    
    for (const examSet of correlatableSets) {
      const relevantExams = group.exams.filter(e => 
        examSet.includes(e.name.toUpperCase())
      );
      
      if (relevantExams.length < 2) continue;
      
      // Verificar se já existe correlação para essa data e exames
      const existingCorrelation = await db
        .select()
        .from(examCorrelations)
        .where(
          and(
            eq(examCorrelations.patientId, patientId),
            sql`${examCorrelations.correlationDate} = ${group.date}`
          )
        )
        .limit(1);
      
      if (existingCorrelation.length > 0) {
        console.log(`Correlação já existe para ${patientId} em ${group.date}`);
        continue;
      }
      
      // Gerar análise com LLM
      const analysis = await generateAnalysis(relevantExams);
      
      // Salvar correlação no banco
      await db.insert(examCorrelations).values({
        userId,
        patientId,
        correlationDate: new Date(group.date),
        examsInvolved: JSON.stringify(relevantExams.map(e => e.name)),
        analysis: analysis.analysis,
        recommendations: analysis.recommendations,
        specialists: JSON.stringify(analysis.specialists),
        severity: analysis.severity
      });
      
      console.log(`✅ Correlação gerada para ${patientId} em ${group.date}`);
    }
  }
}

/**
 * Processa todas as correlações para um paciente (histórico completo)
 */
export async function processAllCorrelationsForPatient(patientId: string, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Buscar todas as datas únicas de exames do paciente
  const allExams: any[] = await db.execute(sql`
    SELECT DISTINCT date FROM exam_history
    WHERE patientId = ${patientId}
    ORDER BY date DESC
  `);
  
  const uniqueDates = allExams.map((e: any) => e.date);
  
  for (const date of uniqueDates) {
    await processCorrelationsForDate(patientId, String(date), userId);
  }
}

/**
 * Busca correlações de um paciente (mais recente primeiro)
 */
export async function getPatientCorrelations(patientId: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(examCorrelations)
    .where(eq(examCorrelations.patientId, patientId))
    .orderBy(desc(examCorrelations.correlationDate))
    .limit(limit);
}

/**
 * Busca correlação específica por ID
 */
export async function getCorrelationById(correlationId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(examCorrelations)
    .where(eq(examCorrelations.id, correlationId))
    .limit(1);
  
  return result[0] || null;
}


/**
 * Busca correlações com análise médica para um paciente e data
 */
export async function getCorrelationsWithMedicalAnalysis(patientId: string, date: string, userId: number) {
  const db = await getDb();
  if (!db) return [];

  // Buscar correlações processadas para essa data
  const correlations = await db
    .select()
    .from(examCorrelations)
    .where(
      and(
        eq(examCorrelations.patientId, patientId),
        sql`${examCorrelations.correlationDate} = ${date}`,
        eq(examCorrelations.userId, userId)
      )
    )
    .orderBy(desc(examCorrelations.createdAt));

  return correlations;
}
