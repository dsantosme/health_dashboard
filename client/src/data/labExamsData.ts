// Dataset completo de laboratório com todos os exames
// Estrutura para análise inteligente e correlações

export interface LabExam {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  
  // Dados atuais
  value: number | string | null;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  referenceText?: string;
  status: 'normal' | 'low' | 'high' | 'critical' | 'unknown';
  
  // Método e material
  method: string;
  material: string;
  
  // Datas
  collectionDate: string;
  collectionTime: string;
  
  // Histórico
  history: Array<{
    date: string;
    value: number | string | null;
    status: 'normal' | 'low' | 'high' | 'critical' | 'unknown';
  }>;
  
  // Correlações
  correlatedExams: string[]; // IDs dos exames correlacionados
  
  // Interpretação clínica
  clinicalSignificance: string;
  possibleCauses?: string[];
  recommendations?: string[];
}

export const labExamsData: LabExam[] = [
  // METABOLISMO DE GLICOSE
  {
    id: 'glucose',
    name: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    subcategory: 'Glicemia',
    value: 94,
    unit: 'mg/dL',
    referenceMin: 60,
    referenceMax: 99,
    status: 'normal',
    method: 'Enzimático',
    material: 'Sangue (Fluoreto)',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 94, status: 'normal' }
    ],
    correlatedExams: ['a1c', 'insulin', 'triglycerides'],
    clinicalSignificance: 'Glicose normal em jejum indica metabolismo glicêmico adequado e ausência de diabetes.',
    possibleCauses: [],
    recommendations: ['Manter dieta com baixo índice glicêmico', 'Exercício regular']
  },

  {
    id: 'a1c',
    name: 'Hemoglobina Glicada (A1C)',
    category: 'Metabolismo de Glicose',
    subcategory: 'Glicemia',
    value: '<5.7',
    unit: '%',
    referenceMax: 5.7,
    referenceText: 'MENOR QUE 5,7%',
    status: 'normal',
    method: 'Imunoturbidimetria',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: '<5.7', status: 'normal' }
    ],
    correlatedExams: ['glucose', 'insulin'],
    clinicalSignificance: 'A1C < 5.7% indica excelente controle glicêmico nos últimos 3 meses.',
    recommendations: ['Manter rotina atual', 'Repetir anualmente']
  },

  // LIPÍDIOS
  {
    id: 'cholesterol-total',
    name: 'Colesterol Total',
    category: 'Lipídios',
    subcategory: 'Perfil Lipídico',
    value: null,
    unit: 'mg/dL',
    referenceMax: 200,
    status: 'unknown',
    method: 'Colorimétrico Enzimático',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: null, status: 'unknown' }
    ],
    correlatedExams: ['hdl', 'ldl', 'triglycerides'],
    clinicalSignificance: 'Colesterol total não foi capturado no resultado. Necessário repetir análise.',
    recommendations: ['Repetir exame', 'Solicitar frações de colesterol']
  },

  {
    id: 'hdl',
    name: 'Colesterol HDL (Bom)',
    category: 'Lipídios',
    subcategory: 'Perfil Lipídico',
    value: null,
    unit: 'mg/dL',
    referenceMin: 40,
    status: 'unknown',
    method: 'Colorimétrico Enzimático',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: null, status: 'unknown' }
    ],
    correlatedExams: ['ldl', 'triglycerides', 'cholesterol-total'],
    clinicalSignificance: 'HDL não foi capturado. HDL elevado é protetor cardiovascular.',
    recommendations: ['Repetir exame', 'Aumentar exercício aeróbico']
  },

  {
    id: 'ldl',
    name: 'Colesterol LDL (Ruim)',
    category: 'Lipídios',
    subcategory: 'Perfil Lipídico',
    value: null,
    unit: 'mg/dL',
    referenceMax: 130,
    status: 'unknown',
    method: 'Colorimétrico Enzimático',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: null, status: 'unknown' }
    ],
    correlatedExams: ['hdl', 'triglycerides', 'cholesterol-total'],
    clinicalSignificance: 'LDL não foi capturado. LDL elevado aumenta risco cardiovascular.',
    recommendations: ['Repetir exame', 'Reduzir gordura saturada na dieta']
  },

  {
    id: 'triglycerides',
    name: 'Triglicerídeos',
    category: 'Lipídios',
    subcategory: 'Perfil Lipídico',
    value: null,
    unit: 'mg/dL',
    referenceMax: 150,
    status: 'unknown',
    method: 'Colorimétrico Enzimático',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: null, status: 'unknown' }
    ],
    correlatedExams: ['glucose', 'weight', 'hdl'],
    clinicalSignificance: 'Triglicerídeos não foram capturados. Elevados aumentam risco cardiovascular.',
    recommendations: ['Repetir exame', 'Reduzir carboidratos simples']
  },

  // HEMATOLOGIA
  {
    id: 'iron-serum',
    name: 'Ferro Sérico',
    category: 'Hematologia',
    subcategory: 'Metabolismo de Ferro',
    value: 1.0,
    unit: 'mcg/dL',
    referenceMin: 65,
    referenceMax: 175,
    status: 'critical',
    method: 'Colorimétrico',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 1.0, status: 'critical' }
    ],
    correlatedExams: ['ferritin', 'hemoglobin', 'hematocrit', 'b12'],
    clinicalSignificance: 'Ferro sérico CRITICAMENTE BAIXO (1.0 mcg/dL). Indica anemia severa.',
    possibleCauses: [
      'Deficiência de ferro',
      'Sangramento gastrointestinal',
      'Má absorção intestinal',
      'Dieta inadequada'
    ],
    recommendations: [
      'Consultar Hematologista URGENTE',
      'Iniciar suplementação de ferro',
      'Investigar causa de sangramento'
    ]
  },

  {
    id: 'ferritin',
    name: 'Ferritina Sérica',
    category: 'Hematologia',
    subcategory: 'Metabolismo de Ferro',
    value: null,
    unit: 'ng/mL',
    referenceMin: 30,
    referenceMax: 400,
    status: 'unknown',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: null, status: 'unknown' }
    ],
    correlatedExams: ['iron-serum', 'hemoglobin', 'b12'],
    clinicalSignificance: 'Ferritina não foi capturada. Essencial para avaliar estoques de ferro.',
    recommendations: ['Repetir exame', 'Avaliar com Hematologista']
  },

  {
    id: 'b12',
    name: 'Vitamina B12',
    category: 'Hematologia',
    subcategory: 'Vitaminas',
    value: 331,
    unit: 'pg/mL',
    referenceMin: 172,
    referenceMax: 890,
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 331, status: 'normal' }
    ],
    correlatedExams: ['iron-serum', 'hemoglobin', 'folate'],
    clinicalSignificance: 'B12 normal. Essencial para formação de hemácias e função neurológica.',
    recommendations: ['Manter ingestão adequada', 'Repetir anualmente']
  },

  // HORMÔNIOS
  {
    id: 'prolactin',
    name: 'Prolactina',
    category: 'Hormônios',
    subcategory: 'Hormônios Hipofisários',
    value: 6,
    unit: 'ng/mL',
    referenceText: 'HOMEM: DE 2,1 A 17,7 ng/mL',
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 6, status: 'normal' }
    ],
    correlatedExams: ['testosterone', 'fsh'],
    clinicalSignificance: 'Prolactina normal. Indica função hipofisária adequada.',
    recommendations: ['Manter monitoramento anual']
  },

  {
    id: 'testosterone',
    name: 'Testosterona Livre Calculada',
    category: 'Hormônios',
    subcategory: 'Hormônios Sexuais',
    value: 317,
    unit: 'ng/dL',
    referenceText: 'HOMEM 21-49 ANOS: DE 14,6 A 94,6 nmol/L',
    status: 'unknown',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 317, status: 'unknown' }
    ],
    correlatedExams: ['shbg', 'prolactin', 'fsh'],
    clinicalSignificance: 'Testosterona em unidade diferente. Necessário converter para nmol/L para comparação.',
    recommendations: ['Repetir exame com unidade padrão']
  },

  {
    id: 'shbg',
    name: 'SHBG (Globulina Ligadora de Hormônios Sexuais)',
    category: 'Hormônios',
    subcategory: 'Hormônios Sexuais',
    value: 25.0,
    unit: 'nmol/L',
    referenceText: 'HOMEM 21-49 ANOS: DE 14,6 A 94,6 nmol/L',
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 25.0, status: 'normal' }
    ],
    correlatedExams: ['testosterone', 'estradiol'],
    clinicalSignificance: 'SHBG normal. Proteína que transporta hormônios sexuais.',
    recommendations: ['Manter monitoramento']
  },

  {
    id: 'estradiol',
    name: 'Estradiol, 17 Beta',
    category: 'Hormônios',
    subcategory: 'Hormônios Sexuais',
    value: 35.3,
    unit: 'pg/mL',
    referenceText: 'HOMEM: DE 10 A 40 pg/mL',
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 35.3, status: 'normal' }
    ],
    correlatedExams: ['testosterone', 'shbg'],
    clinicalSignificance: 'Estradiol normal. Balanço hormonal adequado.',
    recommendations: ['Manter monitoramento']
  },

  {
    id: 'fsh',
    name: 'FSH (Hormônio Folículo Estimulante)',
    category: 'Hormônios',
    subcategory: 'Hormônios Hipofisários',
    value: 2,
    unit: 'mUI/mL',
    referenceText: 'HOMEM: DE 1,7 A 8,6 mUI/mL',
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 2, status: 'normal' }
    ],
    correlatedExams: ['prolactin', 'testosterone'],
    clinicalSignificance: 'FSH normal. Indica função gonadal adequada.',
    recommendations: ['Manter monitoramento anual']
  },

  // TIREOIDE
  {
    id: 'tpo-antibodies',
    name: 'Anticorpos Anti-TPO',
    category: 'Tireoide',
    subcategory: 'Autoimunidade Tireoidiana',
    value: 1,
    unit: 'UI/mL',
    referenceMax: 13.8,
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 1, status: 'normal' }
    ],
    correlatedExams: ['t4-free', 'tsh'],
    clinicalSignificance: 'Anticorpos anti-TPO negativos. Sem evidência de doença autoimune tireoidiana.',
    recommendations: ['Manter monitoramento']
  },

  {
    id: 't4-free',
    name: 'T4 Livre',
    category: 'Tireoide',
    subcategory: 'Hormônios Tireoidianos',
    value: 1.05,
    unit: 'ng/dL',
    referenceMin: 0.89,
    referenceMax: 1.61,
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 1.05, status: 'normal' }
    ],
    correlatedExams: ['tpo-antibodies', 'tsh'],
    clinicalSignificance: 'T4 livre normal. Função tireoidiana adequada.',
    recommendations: ['Manter monitoramento anual']
  },

  // MINERAIS E ELETRÓLITOS
  {
    id: 'magnesium',
    name: 'Magnésio',
    category: 'Minerais e Eletrólitos',
    subcategory: 'Eletrólitos',
    value: 1.9,
    unit: 'mg/dL',
    referenceMin: 1.6,
    referenceMax: 2.6,
    status: 'normal',
    method: 'Colorimétrico',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 1.9, status: 'normal' }
    ],
    correlatedExams: ['potassium', 'calcium'],
    clinicalSignificance: 'Magnésio normal. Essencial para função muscular e nervosa.',
    recommendations: ['Manter ingestão adequada']
  },

  {
    id: 'potassium',
    name: 'Potássio',
    category: 'Minerais e Eletrólitos',
    subcategory: 'Eletrólitos',
    value: 4.3,
    unit: 'mEq/L',
    referenceMin: 3.5,
    referenceMax: 5.1,
    status: 'normal',
    method: 'Eletrodo Seletivo',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 4.3, status: 'normal' }
    ],
    correlatedExams: ['magnesium', 'sodium'],
    clinicalSignificance: 'Potássio normal. Essencial para função cardíaca e muscular.',
    recommendations: ['Manter ingestão adequada']
  },

  {
    id: 'phosphorus',
    name: 'Fósforo',
    category: 'Minerais e Eletrólitos',
    subcategory: 'Minerais Ósseos',
    value: 4.2,
    unit: 'mg/dL',
    referenceMin: 2.5,
    referenceMax: 4.5,
    status: 'normal',
    method: 'Fotométrico',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 4.2, status: 'normal' }
    ],
    correlatedExams: ['pth', 'calcium'],
    clinicalSignificance: 'Fósforo normal. Importante para saúde óssea e metabolismo energético.',
    recommendations: ['Manter ingestão adequada']
  },

  {
    id: 'pth',
    name: 'PTH Intacto (Paratormônio)',
    category: 'Minerais e Eletrólitos',
    subcategory: 'Minerais Ósseos',
    value: 36.4,
    unit: 'pg/mL',
    referenceMin: 18.5,
    referenceMax: 88.0,
    status: 'normal',
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 36.4, status: 'normal' }
    ],
    correlatedExams: ['phosphorus', 'calcium'],
    clinicalSignificance: 'PTH normal. Regulação de cálcio e fósforo adequada.',
    recommendations: ['Manter ingestão de cálcio e vitamina D']
  },

  // FUNÇÃO HEPÁTICA
  {
    id: 'ast',
    name: 'AST (TGO - Transaminase Oxalacética)',
    category: 'Função Hepática',
    subcategory: 'Enzimas Hepáticas',
    value: 24,
    unit: 'U/L',
    referenceMax: 40,
    status: 'normal',
    method: 'Cinético Ultra Violeta',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 24, status: 'normal' }
    ],
    correlatedExams: ['alt', 'gamma-gt', 'bilirubin'],
    clinicalSignificance: 'AST normal. Indica função hepática adequada.',
    recommendations: ['Manter monitoramento anual']
  },

  {
    id: 'alt',
    name: 'ALT (TGP - Transaminase Pirúvica)',
    category: 'Função Hepática',
    subcategory: 'Enzimas Hepáticas',
    value: 32,
    unit: 'U/L',
    referenceMax: 58,
    status: 'normal',
    method: 'Cinético Ultra Violeta',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 32, status: 'normal' }
    ],
    correlatedExams: ['ast', 'gamma-gt', 'bilirubin'],
    clinicalSignificance: 'ALT normal. Indica função hepática adequada.',
    recommendations: ['Manter monitoramento anual']
  },

  {
    id: 'gamma-gt',
    name: 'Gama GT',
    category: 'Função Hepática',
    subcategory: 'Enzimas Hepáticas',
    value: 5,
    unit: 'U/L',
    referenceMax: 73,
    status: 'normal',
    method: 'Colorimétrico',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 5, status: 'normal' }
    ],
    correlatedExams: ['ast', 'alt'],
    clinicalSignificance: 'Gama GT normal. Sem evidência de colestase ou doença hepática.',
    recommendations: ['Manter monitoramento anual']
  },

  // FUNÇÃO RENAL
  {
    id: 'creatinine',
    name: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    subcategory: 'Marcadores Renais',
    value: '>90',
    unit: 'mL/min/1,73m²',
    referenceMin: 0.76,
    referenceMax: 1.24,
    status: 'normal',
    method: 'Enzimático',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: '>90', status: 'normal' }
    ],
    correlatedExams: ['urea', 'potassium'],
    clinicalSignificance: 'Creatinina normal (TFG > 90). Função renal adequada.',
    recommendations: ['Manter hidratação adequada', 'Monitoramento anual']
  }
];

// Categorias de exames
export const labCategories = [
  'Metabolismo de Glicose',
  'Lipídios',
  'Hematologia',
  'Hormônios',
  'Tireoide',
  'Minerais e Eletrólitos',
  'Função Hepática',
  'Função Renal'
];

// Correlações inteligentes entre exames
export const examCorrelations = [
  {
    exam1: 'glucose',
    exam2: 'a1c',
    relationship: 'Ambas medem controle de glicose; A1C reflete média de 3 meses',
    riskLevel: 'high'
  },
  {
    exam1: 'iron-serum',
    exam2: 'b12',
    relationship: 'Ambas essenciais para produção de hemácias; deficiência em ambas causa anemia',
    riskLevel: 'critical'
  },
  {
    exam1: 'ast',
    exam2: 'alt',
    relationship: 'Razão AST/ALT indica tipo de lesão hepática',
    riskLevel: 'medium'
  },
  {
    exam1: 'cholesterol-total',
    exam2: 'triglycerides',
    relationship: 'Ambas indicam risco cardiovascular; elevadas aumentam risco de infarto',
    riskLevel: 'high'
  },
  {
    exam1: 'pth',
    exam2: 'phosphorus',
    relationship: 'PTH regula fósforo; desequilíbrio indica problema renal ou ósseo',
    riskLevel: 'medium'
  }
];

// Análise de risco global
export const riskAnalysis = {
  cardiovascular: {
    score: 'Alto',
    factors: ['Peso elevado (107 kg)', 'Circunferência abdominal elevada (111 cm)', 'Lipídios não capturados'],
    recommendations: ['Perder 25 kg', 'Reduzir circunferência abdominal', 'Repetir perfil lipídico']
  },
  metabolic: {
    score: 'Baixo',
    factors: ['Glicose normal', 'A1C normal', 'Sem sinais de resistência à insulina'],
    recommendations: ['Manter dieta atual', 'Exercício regular']
  },
  hematologic: {
    score: 'Crítico',
    factors: ['Ferro sérico criticamente baixo (1.0 mcg/dL)', 'Anemia severa'],
    recommendations: ['Consultar Hematologista URGENTE', 'Iniciar suplementação de ferro', 'Investigar causa']
  },
  hepatic: {
    score: 'Baixo',
    factors: ['AST normal', 'ALT normal', 'Gama GT normal'],
    recommendations: ['Manter monitoramento anual']
  },
  renal: {
    score: 'Baixo',
    factors: ['Creatinina normal', 'TFG > 90'],
    recommendations: ['Manter hidratação', 'Monitoramento anual']
  }
};
