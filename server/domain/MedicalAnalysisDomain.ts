/**
 * Medical Analysis Domain (Core Business Logic)
 * 
 * Pure business logic without external dependencies.
 * Implements the IMedicalAnalysisService port.
 */

import {
  IMedicalAnalysisService,
  MedicalAnalysisInput,
  MedicalAnalysisOutput,
  PersonalizedRecommendations,
} from '../ports/IMedicalAnalysisService';
import { ILLMProvider } from '../ports/ILLMProvider';
import { IDataRepository, ExamData, AnthropometricData } from '../ports/IDataRepository';

interface ClinicalIndices {
  tgHdlRatio?: number;
  ctHdlRatio?: number;
  ldlHdlRatio?: number;
  nonHdlCholesterol?: number;
}

export class MedicalAnalysisDomain implements IMedicalAnalysisService {
  constructor(
    private llmProvider: ILLMProvider,
    private dataRepository: IDataRepository
  ) {}

  async generateAnalysis(input: MedicalAnalysisInput): Promise<MedicalAnalysisOutput> {
    // 1. Fetch exam data
    const examData = await this.dataRepository.getExamsByNames(input.patientId, input.examNames);
    
    if (examData.length === 0) {
      throw new Error('No exam data found for the specified exams');
    }

    // 2. Fetch anthropometric data
    const anthropometricData = await this.dataRepository.getAnthropometricData(input.patientId);

    // 3. Calculate clinical indices
    const clinicalIndices = this.calculateClinicalIndices(examData);

    // 4. Determine specialist based on exam types
    const specialist = this.determineSpecialist(input.examNames);

    // 5. Build exam values with status
    const examValues = examData.map(exam => ({
      name: exam.examName,
      value: exam.value,
      unit: exam.unit,
      status: this.determineStatus(exam.value, exam.referenceMin, exam.referenceMax),
    }));

    // 6. Generate medical analysis using LLM
    const analysis = await this.generateMedicalAnalysisText(
      examData,
      anthropometricData,
      clinicalIndices,
      specialist
    );

    // 7. Generate personalized recommendations using LLM
    const personalizedRecommendations = await this.generatePersonalizedRecommendations(
      examData,
      anthropometricData,
      clinicalIndices,
      specialist
    );

    // 8. Determine urgency level
    const urgencyLevel = this.determineUrgencyLevel(examValues);

    // 9. Extract recommendations from analysis
    const recommendations = this.extractRecommendations(analysis);

    return {
      specialist,
      specialtyEmoji: this.getSpecialistEmoji(specialist),
      patientName: 'Paciente', // TODO: Get from patient data
      analysis,
      urgencyLevel,
      recommendations,
      personalizedRecommendations,
      clinicalIndices,
      examValues,
    };
  }

  private calculateClinicalIndices(examData: ExamData[]): ClinicalIndices {
    const indices: ClinicalIndices = {};

    const findExam = (name: string) => examData.find(e => 
      e.examName.toLowerCase().includes(name.toLowerCase())
    );

    const tg = findExam('triglicerídeos') || findExam('triglicerideos');
    const hdl = findExam('hdl');
    const ldl = findExam('ldl');
    const ct = findExam('colesterol total');

    if (tg && hdl && hdl.value > 0) {
      indices.tgHdlRatio = tg.value / hdl.value;
    }

    if (ct && hdl && hdl.value > 0) {
      indices.ctHdlRatio = ct.value / hdl.value;
    }

    if (ldl && hdl && hdl.value > 0) {
      indices.ldlHdlRatio = ldl.value / hdl.value;
    }

    if (ct && hdl) {
      indices.nonHdlCholesterol = ct.value - hdl.value;
    }

    return indices;
  }

  private getSpecialistEmoji(specialist: string): string {
    if (specialist.includes('Cardiologista')) return '👨‍⚕️';
    if (specialist.includes('Endocrinologista')) return '👩‍⚕️';
    if (specialist.includes('Hematologista')) return '🩸';
    if (specialist.includes('Nefrologista')) return '🫀';
    if (specialist.includes('Hepatologista')) return '🫀';
    return '👨‍⚕️';
  }

  private determineSpecialist(examNames: string[]): string {
    const examsLower = examNames.map(n => n.toLowerCase());

    if (examsLower.some(n => n.includes('colesterol') || n.includes('triglicerídeos') || n.includes('hdl') || n.includes('ldl'))) {
      return 'Cardiologista – Prevenção Cardiovascular';
    }

    if (examsLower.some(n => n.includes('glicose') || n.includes('hemoglobina glicada') || n.includes('insulina'))) {
      return 'Endocrinologista – Metabolismo e Diabetes';
    }

    if (examsLower.some(n => n.includes('ferro') || n.includes('ferritina') || n.includes('hemoglobina'))) {
      return 'Hematologista – Saúde Sanguínea';
    }

    if (examsLower.some(n => n.includes('testosterona') || n.includes('estradiol') || n.includes('fsh') || n.includes('lh'))) {
      return 'Endocrinologista – Hormônios';
    }

    if (examsLower.some(n => n.includes('creatinina') || n.includes('ureia') || n.includes('filtração'))) {
      return 'Nefrologista – Função Renal';
    }

    if (examsLower.some(n => n.includes('tgp') || n.includes('tgo') || n.includes('gama gt'))) {
      return 'Hepatologista – Função Hepática';
    }

    return 'Clínico Geral – Avaliação Integrada';
  }

  private determineStatus(value: number, refMin: number | null, refMax: number | null): 'normal' | 'low' | 'high' {
    if (refMin !== null && value < refMin) return 'low';
    if (refMax !== null && value > refMax) return 'high';
    return 'normal';
  }

  private async generateMedicalAnalysisText(
    examData: ExamData[],
    anthropometricData: AnthropometricData | null,
    clinicalIndices: ClinicalIndices,
    specialist: string
  ): Promise<string> {
    const examSummary = examData.map(e => 
      `${e.examName}: ${e.value} ${e.unit} (Referência: ${e.referenceMin ?? 'N/A'}-${e.referenceMax ?? 'N/A'})`
    ).join('\n');

    const anthropometricSummary = anthropometricData
      ? `Peso: ${anthropometricData.weight}kg, Altura: ${anthropometricData.height}cm, IMC: ${anthropometricData.bmi}, Circunferência Abdominal: ${anthropometricData.waistCircumference}cm`
      : 'Dados antropométricos não disponíveis';

    const indicesSummary = Object.entries(clinicalIndices)
      .map(([key, value]) => `${key}: ${value?.toFixed(2)}`)
      .join(', ');

    const prompt = `Você é um ${specialist} experiente analisando exames de um paciente.

**Dados do Paciente:**
${anthropometricSummary}

**Exames Realizados:**
${examSummary}

**Índices Clínicos Calculados:**
${indicesSummary || 'Nenhum índice calculado'}

**Instruções:**
1. Fale diretamente com o paciente em tom empático e profissional
2. Explique os valores dos exames de forma clara e contextualizada
3. Correlacione os exames entre si (não analise isoladamente)
4. Explique padrões clínicos relevantes (ex: HDL baixo + triglicerídeos altos = resistência à insulina)
5. Contextualize com dados antropométricos (peso, IMC, circunferência)
6. Indique nível de urgência (não urgente, atenção necessária, urgente)
7. Forneça orientações práticas iniciais

**Formato esperado:**
- Cumprimento e contextualização
- Análise detalhada dos exames com valores específicos
- Explicação de correlações e padrões
- Nível de urgência e significado clínico
- Orientações iniciais

Gere a análise médica:`;

    const response = await this.llmProvider.generateCompletion([
      { role: 'system', content: 'Você é um médico especialista que explica resultados de exames de forma clara e empática.' },
      { role: 'user', content: prompt },
    ]);

    return response.content;
  }

  private async generatePersonalizedRecommendations(
    examData: ExamData[],
    anthropometricData: AnthropometricData | null,
    clinicalIndices: ClinicalIndices,
    specialist: string
  ): Promise<PersonalizedRecommendations> {
    const examSummary = examData.map(e => 
      `${e.examName}: ${e.value} ${e.unit}`
    ).join(', ');

    const anthropometricSummary = anthropometricData
      ? `Peso: ${anthropometricData.weight}kg, IMC: ${anthropometricData.bmi}, Circunferência: ${anthropometricData.waistCircumference}cm`
      : 'Dados não disponíveis';

    const prompt = `Você é um ${specialist} criando um plano de ação personalizado.

**Dados:** ${anthropometricSummary} | Exames: ${examSummary}

**Gere um plano estruturado em 4 seções:**

## 📋 Plano de Ação Personalizado
[Metas específicas: peso, IMC, circunferência, valores de exames. Marcos intermediários mensais.]

## 🥗 Sugestões de Dieta
[Alimentos a priorizar, evitar, exemplo de cardápio diário, dicas práticas]

## 🏃 Plano de Exercícios
[Tipo recomendado, frequência semanal, duração, progressão ao longo do tempo]

## 📅 Cronograma de Acompanhamento
[Repetição de exames, consultas médicas, sinais de alerta]

Seja específico, prático e acionável:`;

    const response = await this.llmProvider.generateCompletion([
      { role: 'system', content: 'Você é um médico criando planos de ação personalizados.' },
      { role: 'user', content: prompt },
    ]);

    return this.parseRecommendations(response.content);
  }

  private parseRecommendations(content: string): PersonalizedRecommendations {
    const sections = {
      actionPlan: '',
      goals: '',
      dietSuggestions: '',
      exercisePlan: '',
      followUpSchedule: '',
    };

    const actionPlanMatch = content.match(/##\s*📋\s*Plano de Ação.*?\n([\s\S]*?)(?=##|$)/);
    const goalsMatch = content.match(/##\s*🎯\s*Metas.*?\n([\s\S]*?)(?=##|$)/);
    const dietMatch = content.match(/##\s*🥗.*?\n([\s\S]*?)(?=##|$)/);
    const exerciseMatch = content.match(/##\s*🏃.*?\n([\s\S]*?)(?=##|$)/);
    const scheduleMatch = content.match(/##\s*📅.*?\n([\s\S]*?)(?=##|$)/);

    if (actionPlanMatch) sections.actionPlan = actionPlanMatch[1].trim();
    if (goalsMatch) sections.goals = goalsMatch[1].trim();
    if (dietMatch) sections.dietSuggestions = dietMatch[1].trim();
    if (exerciseMatch) sections.exercisePlan = exerciseMatch[1].trim();
    if (scheduleMatch) sections.followUpSchedule = scheduleMatch[1].trim();

    // Fallback: if actionPlan is empty, use goals
    if (!sections.actionPlan && sections.goals) {
      sections.actionPlan = sections.goals;
    }

    return sections;
  }

  private determineUrgencyLevel(examValues: Array<{ status: string }>): 'good' | 'attention' | 'urgent' {
    const abnormalCount = examValues.filter(e => e.status !== 'normal').length;
    const totalCount = examValues.length;
    const abnormalRatio = abnormalCount / totalCount;

    if (abnormalRatio >= 0.5) return 'urgent';
    if (abnormalRatio >= 0.25) return 'attention';
    return 'good';
  }

  private extractRecommendations(analysis: string): string[] {
    const recommendations: string[] = [];
    
    const lines = analysis.split('\n');
    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        recommendations.push(line.replace(/^\d+\.\s*/, '').trim());
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Manter hábitos saudáveis');
      recommendations.push('Acompanhamento médico regular');
    }

    return recommendations;
  }
}
