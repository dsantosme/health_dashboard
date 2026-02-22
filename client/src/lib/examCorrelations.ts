/**
 * Sistema de Correlação entre Exames
 * Analisa relações entre diferentes exames e fornece insights de especialista
 */

export interface ExamData {
  name: string;
  value: number;
  referenceMin: number;
  referenceMax: number;
  unit: string;
  date: string;
}

export interface CorrelationAnalysis {
  exams: ExamData[];
  correlationType: string;
  status: 'bom' | 'ruim' | 'precisa-melhorar' | 'neutro';
  explanation: string;
  recommendation: string;
  specialists: Specialist[];
  riskLevel: 'baixo' | 'moderado' | 'alto';
}

export interface Specialist {
  name: string;
  specialty: string;
  reason: string;
  priority: 'alta' | 'média' | 'baixa';
}

/**
 * Definições de correlações entre exames
 */
const EXAM_CORRELATIONS: Record<string, string[]> = {
  'Glicose Jejum': ['Hemoglobina Glicada (HbA1c)', 'Triglicerídeos', 'Colesterol Total', 'Colesterol HDL', 'Colesterol LDL'],
  'Hemoglobina Glicada (HbA1c)': ['Glicose Jejum', 'Triglicerídeos', 'Colesterol Total'],
  'Colesterol Total': ['Colesterol HDL', 'Colesterol LDL', 'Colesterol VLDL', 'Triglicerídeos', 'Glicose Jejum'],
  'Colesterol HDL': ['Colesterol Total', 'Colesterol LDL', 'Triglicerídeos', 'Glicose Jejum'],
  'Colesterol LDL': ['Colesterol Total', 'Colesterol HDL', 'Triglicerídeos'],
  'Triglicerídeos': ['Colesterol Total', 'Colesterol HDL', 'Glicose Jejum', 'Hemoglobina Glicada (HbA1c)'],
  'Ferro Sérico': ['Ferritina Sérica', 'Hemoglobina', 'Hematócrito'],
  'Ferritina Sérica': ['Ferro Sérico', 'Hemoglobina', 'Hematócrito'],
  'Hemoglobina': ['Ferro Sérico', 'Ferritina Sérica', 'Hematócrito'],
  'Hematócrito': ['Hemoglobina', 'Ferro Sérico', 'Ferritina Sérica'],
  'TSH Ultra Sensível': ['T4 Livre', 'Anticorpos Anti-TPO'],
  'T4 Livre': ['TSH Ultra Sensível', 'Anticorpos Anti-TPO'],
};

/**
 * Análises de correlação entre pares de exames
 */
function analyzeGlicoseColesterol(glicose: ExamData, colesterol: ExamData): CorrelationAnalysis {
  const glicoseHigh = glicose.value > glicose.referenceMax;
  const colesterolHigh = colesterol.value > colesterol.referenceMax;

  let status: CorrelationAnalysis['status'] = 'bom';
  let explanation = '';
  let recommendation = '';
  let specialists: Specialist[] = [];
  let riskLevel: CorrelationAnalysis['riskLevel'] = 'baixo';

  if (glicoseHigh && colesterolHigh) {
    status = 'ruim';
    riskLevel = 'alto';
    explanation = `Tanto a glicose jejum (${glicose.value} ${glicose.unit}) quanto o colesterol total (${colesterol.value} ${colesterol.unit}) estão elevados. Esta combinação indica um padrão metabólico preocupante que aumenta significativamente o risco cardiovascular. A elevação simultânea desses marcadores sugere resistência à insulina e dislipidemia, condições que frequentemente coexistem e potencializam o risco de doença cardiovascular e diabetes tipo 2.`;
    recommendation = `É necessário intervenção imediata com mudanças no estilo de vida (dieta hipocalórica com redução de carboidratos refinados e gorduras saturadas, atividade física regular) e possível farmacoterapia. Monitoramento frequente é essencial.`;
    specialists = [
      { name: 'Cardiologista', specialty: 'Cardiologia', reason: 'Avaliar risco cardiovascular e prescrever medicações se necessário', priority: 'alta' },
      { name: 'Endocrinologista', specialty: 'Endocrinologia', reason: 'Investigar resistência à insulina e diabetes', priority: 'alta' },
      { name: 'Nutricionista', specialty: 'Nutrição', reason: 'Prescrever dieta terapêutica personalizada', priority: 'alta' },
    ];
  } else if (glicoseHigh && !colesterolHigh) {
    status = 'precisa-melhorar';
    riskLevel = 'moderado';
    explanation = `A glicose jejum está elevada (${glicose.value} ${glicose.unit}), enquanto o colesterol total encontra-se dentro dos limites normais. Isso pode indicar um estágio inicial de intolerância à glicose ou pré-diabetes. O colesterol ainda controlado é um ponto positivo, mas a glicemia elevada requer atenção.`;
    recommendation = `Implementar mudanças no estilo de vida com foco em redução de peso (se aplicável), aumento da atividade física e ajustes dietéticos. Repetir testes em 3 meses para monitorar a progressão.`;
    specialists = [
      { name: 'Endocrinologista', specialty: 'Endocrinologia', reason: 'Avaliar risco de diabetes e prescrever tratamento', priority: 'alta' },
      { name: 'Nutricionista', specialty: 'Nutrição', reason: 'Orientar sobre alimentação para controle glicêmico', priority: 'média' },
    ];
  } else if (!glicoseHigh && colesterolHigh) {
    status = 'precisa-melhorar';
    riskLevel = 'moderado';
    explanation = `O colesterol total está elevado (${colesterol.value} ${colesterol.unit}), mas a glicose jejum encontra-se normal. Isso sugere uma dislipidemia isolada, possivelmente relacionada a fatores genéticos ou dietéticos. O controle glicêmico adequado é favorável.`;
    recommendation = `Focar em redução de gorduras saturadas na dieta, aumentar atividade física e considerar medicação se não houver resposta às mudanças de estilo de vida em 3 meses.`;
    specialists = [
      { name: 'Cardiologista', specialty: 'Cardiologia', reason: 'Avaliar risco cardiovascular e prescrever estatinas se necessário', priority: 'alta' },
      { name: 'Nutricionista', specialty: 'Nutrição', reason: 'Orientar sobre alimentação para redução de colesterol', priority: 'média' },
    ];
  } else {
    status = 'bom';
    riskLevel = 'baixo';
    explanation = `Tanto a glicose jejum (${glicose.value} ${glicose.unit}) quanto o colesterol total (${colesterol.value} ${colesterol.unit}) encontram-se dentro dos limites normais. Este é um padrão metabólico favorável que indica bom controle glicêmico e lipídico.`;
    recommendation = `Manter o atual estilo de vida com atividade física regular e alimentação balanceada. Repetir testes anualmente como parte do acompanhamento preventivo.`;
    specialists = [
      { name: 'Clínico Geral', specialty: 'Clínica Geral', reason: 'Acompanhamento preventivo anual', priority: 'baixa' },
    ];
  }

  return {
    exams: [glicose, colesterol],
    correlationType: 'Glicose e Colesterol - Síndrome Metabólica',
    status,
    explanation,
    recommendation,
    specialists,
    riskLevel,
  };
}

/**
 * Análise de Ferro e Ferritina
 */
function analyzeIronCorrelation(ferro: ExamData, ferritina: ExamData): CorrelationAnalysis {
  const ferroLow = ferro.value < ferro.referenceMin;
  const ferritinLow = ferritina.value < ferritina.referenceMin;

  let status: CorrelationAnalysis['status'] = 'bom';
  let explanation = '';
  let recommendation = '';
  let specialists: Specialist[] = [];
  let riskLevel: CorrelationAnalysis['riskLevel'] = 'baixo';

  if (ferroLow && ferritinLow) {
    status = 'ruim';
    riskLevel = 'moderado';
    explanation = `Tanto o ferro sérico (${ferro.value} ${ferro.unit}) quanto a ferritina (${ferritina.value} ${ferritina.unit}) estão baixos. Isso indica deficiência de ferro com depleção de estoques, sugerindo anemia ferropriva. Esta condição pode resultar em fadiga, fraqueza, dispneia e comprometer a qualidade de vida.`;
    recommendation = `Investigar a causa da deficiência (sangramento, má absorção, dieta inadequada). Iniciar suplementação de ferro e considerar transfusão se hemoglobina estiver muito baixa. Investigar possível sangramento gastrointestinal.`;
    specialists = [
      { name: 'Hematologista', specialty: 'Hematologia', reason: 'Investigar causa da anemia e prescrever tratamento', priority: 'alta' },
      { name: 'Gastroenterologista', specialty: 'Gastroenterologia', reason: 'Descartar sangramento gastrointestinal', priority: 'alta' },
      { name: 'Nutricionista', specialty: 'Nutrição', reason: 'Orientar sobre alimentos ricos em ferro', priority: 'média' },
    ];
  } else if (ferroLow || ferritinLow) {
    status = 'precisa-melhorar';
    riskLevel = 'baixo';
    explanation = `Um dos marcadores de ferro está baixo enquanto o outro está normal. Isso pode indicar deficiência de ferro em estágio inicial ou variação normal. O padrão não é totalmente consistente com anemia ferropriva clássica.`;
    recommendation = `Repetir testes em 3 meses. Aumentar ingestão de alimentos ricos em ferro (carnes vermelhas, feijão, espinafre). Considerar suplementação se sintomas de fadiga estiverem presentes.`;
    specialists = [
      { name: 'Nutricionista', specialty: 'Nutrição', reason: 'Orientar sobre alimentação rica em ferro', priority: 'média' },
    ];
  } else {
    status = 'bom';
    riskLevel = 'baixo';
    explanation = `Tanto o ferro sérico (${ferro.value} ${ferro.unit}) quanto a ferritina (${ferritina.value} ${ferritina.unit}) encontram-se dentro dos limites normais. Os estoques de ferro estão adequados e não há evidência de anemia ferropriva.`;
    recommendation = `Manter dieta balanceada com alimentos ricos em ferro. Repetir testes anualmente ou conforme indicação clínica.`;
    specialists = [
      { name: 'Clínico Geral', specialty: 'Clínica Geral', reason: 'Acompanhamento preventivo', priority: 'baixa' },
    ];
  }

  return {
    exams: [ferro, ferritina],
    correlationType: 'Ferro e Ferritina - Status de Ferro',
    status,
    explanation,
    recommendation,
    specialists,
    riskLevel,
  };
}

/**
 * Encontrar exames correlacionados dentro de um período aceitável
 */
export function findCorrelatedExams(
  currentExam: string,
  allExams: ExamData[]
): ExamData[] {
  const correlatedNames = EXAM_CORRELATIONS[currentExam] || [];
  
  return allExams.filter(exam => {
    if (!correlatedNames.includes(exam.name)) return false;
    
    // Filtrar por período aceitável (mesma data ou até 30 dias de diferença)
    const currentDate = new Date(allExams.find(e => e.name === currentExam)?.date || new Date());
    const examDate = new Date(exam.date);
    const daysDifference = Math.abs((currentDate.getTime() - examDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDifference <= 30;
  });
}

/**
 * Analisar correlação entre dois exames
 */
export function analyzeExamCorrelation(exam1: ExamData, exam2: ExamData): CorrelationAnalysis {
  // Normalizar nomes para comparação
  const name1 = exam1.name.toLowerCase();
  const name2 = exam2.name.toLowerCase();

  // Correlação Glicose e Colesterol
  if ((name1.includes('glicose') && name2.includes('colesterol')) ||
      (name1.includes('colesterol') && name2.includes('glicose'))) {
    const glicose = name1.includes('glicose') ? exam1 : exam2;
    const colesterol = name1.includes('colesterol') ? exam1 : exam2;
    return analyzeGlicoseColesterol(glicose as ExamData, colesterol as ExamData);
  }

  // Correlação Ferro e Ferritina
  if ((name1.includes('ferro') && name2.includes('ferritina')) ||
      (name1.includes('ferritina') && name2.includes('ferro'))) {
    const ferro = name1.includes('ferro') ? exam1 : exam2;
    const ferritina = name1.includes('ferritina') ? exam1 : exam2;
    return analyzeIronCorrelation(ferro as ExamData, ferritina as ExamData);
  }

  // Correlação padrão se não houver análise específica
  return {
    exams: [exam1, exam2],
    correlationType: `${exam1.name} e ${exam2.name}`,
    status: 'neutro',
    explanation: `Análise de correlação entre ${exam1.name} e ${exam2.name} ainda não implementada.`,
    recommendation: `Consulte um especialista para análise detalhada.`,
    specialists: [
      { name: 'Clínico Geral', specialty: 'Clínica Geral', reason: 'Avaliação geral', priority: 'média' },
    ],
    riskLevel: 'baixo',
  };
}
