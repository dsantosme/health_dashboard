// Dataset completo de laboratório com todos os exames
// IMPORTANTE: Correlações APENAS do mesmo período (14/02/2026)
// Sem dados históricos que possam gerar análises erradas

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
  
  // Histórico (vazio até próximas coletas)
  history: Array<{
    date: string;
    value: number | string | null;
    status: 'normal' | 'low' | 'high' | 'critical' | 'unknown';
  }>;
  
  // Correlações - APENAS do mesmo período
  correlatedExams: string[]; // IDs dos exames correlacionados do mesmo período
  
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
    correlatedExams: ['a1c'], // Correlação válida: ambos normais no mesmo período
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
    correlatedExams: ['glucose'], // Correlação válida: ambos normais no mesmo período
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
    correlatedExams: [], // Sem correlações - valor não capturado
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
    correlatedExams: [], // Sem correlações - valor não capturado
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
    correlatedExams: [], // Sem correlações - valor não capturado
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
    correlatedExams: [], // Sem correlações - valor não capturado
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
    correlatedExams: ['b12'], // Correlação válida: ambos relacionados a anemia
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
    correlatedExams: [], // Sem correlações - valor não capturado
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
    correlatedExams: ['iron-serum'], // Correlação válida: ambos relacionados a anemia
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
    correlatedExams: [], // Sem correlações significativas com outros exames deste período
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
    status: 'unknown', // Unidade diferente - não pode ser validada
    method: 'Quimioluminescência',
    material: 'Sangue',
    collectionDate: '2026-02-14',
    collectionTime: '06:35',
    history: [
      { date: '2026-02-14', value: 317, status: 'unknown' }
    ],
    correlatedExams: [], // Sem correlações - unidade não padronizada
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
    correlatedExams: [], // Sem correlações significativas neste período
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
    correlatedExams: [], // Sem correlações significativas neste período
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
    correlatedExams: [], // Sem correlações significativas neste período
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
    correlatedExams: ['t4-free'], // Correlação válida: ambos normais neste período
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
    correlatedExams: ['tpo-antibodies'], // Correlação válida: ambos normais neste período
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
    correlatedExams: ['potassium'], // Correlação válida: ambos eletrólitos normais
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
    correlatedExams: ['magnesium'], // Correlação válida: ambos eletrólitos normais
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
    correlatedExams: ['pth'], // Correlação válida: ambos normais neste período
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
    correlatedExams: ['phosphorus'], // Correlação válida: ambos normais neste período
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
    correlatedExams: ['alt', 'gamma-gt'], // Correlação válida: todas enzimas hepáticas normais
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
    correlatedExams: ['ast', 'gamma-gt'], // Correlação válida: todas enzimas hepáticas normais
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
    correlatedExams: ['ast', 'alt'], // Correlação válida: todas enzimas hepáticas normais
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
    correlatedExams: [], // Sem correlações - único marcador renal capturado
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

// Correlações inteligentes entre exames - APENAS DO MESMO PERÍODO (14/02/2026)
// Cada correlação valida que ambos os exames têm dados no mesmo dia
export const examCorrelations = [
  {
    exam1: 'glucose',
    exam2: 'a1c',
    relationship: 'Ambas medem controle de glicose; A1C reflete média de 3 meses. Ambas NORMAIS indicam excelente controle metabólico.',
    riskLevel: 'low' // Ambos normais = risco baixo
  },
  {
    exam1: 'iron-serum',
    exam2: 'b12',
    relationship: 'Ambas essenciais para produção de hemácias. Ferro CRÍTICO + B12 NORMAL = anemia por deficiência de ferro.',
    riskLevel: 'critical' // Ferro crítico = risco crítico
  },
  {
    exam1: 'ast',
    exam2: 'alt',
    relationship: 'Razão AST/ALT indica tipo de lesão hepática. Ambas NORMAIS = função hepática adequada.',
    riskLevel: 'low' // Ambas normais = risco baixo
  },
  {
    exam1: 'ast',
    exam2: 'gamma-gt',
    relationship: 'Enzimas hepáticas complementares. Todas NORMAIS = sem evidência de doença hepática.',
    riskLevel: 'low' // Todas normais = risco baixo
  },
  {
    exam1: 'alt',
    exam2: 'gamma-gt',
    relationship: 'Enzimas hepáticas complementares. Todas NORMAIS = sem evidência de doença hepática.',
    riskLevel: 'low' // Todas normais = risco baixo
  },
  {
    exam1: 'pth',
    exam2: 'phosphorus',
    relationship: 'PTH regula fósforo; ambos NORMAIS = regulação adequada de cálcio e fósforo.',
    riskLevel: 'low' // Ambos normais = risco baixo
  },
  {
    exam1: 'magnesium',
    exam2: 'potassium',
    relationship: 'Eletrólitos essenciais para função cardíaca e muscular. Ambos NORMAIS = balanço eletrolítico adequado.',
    riskLevel: 'low' // Ambos normais = risco baixo
  },
  {
    exam1: 'tpo-antibodies',
    exam2: 't4-free',
    relationship: 'Anticorpos anti-TPO negativos + T4 normal = sem doença autoimune tireoidiana e função tireoidiana adequada.',
    riskLevel: 'low' // Ambos normais = risco baixo
  }
];

// Análise de risco global - BASEADA APENAS EM DADOS DO PERÍODO ATUAL
export const riskAnalysis = {
  cardiovascular: {
    score: 'Alto',
    factors: [
      'Peso elevado (107 kg) - IMC 32.3 (Obesidade Grau I)',
      'Circunferência abdominal elevada (111 cm) - Risco abdominal alto',
      'Perfil lipídico não capturado - Impossível avaliar colesterol e triglicerídeos'
    ],
    recommendations: [
      'Repetir perfil lipídico (colesterol total, HDL, LDL, triglicerídeos)',
      'Perder 25 kg para atingir peso ideal (82 kg)',
      'Reduzir circunferência abdominal para 85 cm',
      'Aumentar atividade física aeróbica'
    ]
  },
  metabolic: {
    score: 'Baixo',
    factors: [
      'Glicose em jejum normal (94 mg/dL)',
      'A1C normal (<5.7%) - Excelente controle glicêmico',
      'Sem sinais de resistência à insulina'
    ],
    recommendations: [
      'Manter dieta atual com baixo índice glicêmico',
      'Continuar exercício regular',
      'Repetir A1C anualmente'
    ]
  },
  hematologic: {
    score: 'Crítico',
    factors: [
      'Ferro sérico CRITICAMENTE BAIXO (1.0 mcg/dL) - Anemia severa',
      'Vitamina B12 normal (331 pg/mL) - Descarta deficiência de B12',
      'Ferritina não capturada - Necessário para avaliar estoques de ferro'
    ],
    recommendations: [
      'Consultar Hematologista URGENTE (próximos 2-3 dias)',
      'Investigar causa de sangramento gastrointestinal',
      'Iniciar suplementação de ferro imediatamente',
      'Repetir ferro sérico e ferritina em 4-6 semanas'
    ]
  },
  hepatic: {
    score: 'Baixo',
    factors: [
      'AST normal (24 U/L)',
      'ALT normal (32 U/L)',
      'Gama GT normal (5 U/L)'
    ],
    recommendations: [
      'Função hepática adequada',
      'Manter monitoramento anual',
      'Evitar álcool em excesso'
    ]
  },
  renal: {
    score: 'Baixo',
    factors: [
      'Creatinina normal (TFG > 90 mL/min/1,73m²)',
      'Função renal adequada'
    ],
    recommendations: [
      'Manter hidratação adequada',
      'Monitoramento anual',
      'Potássio normal - sem restrição necessária'
    ]
  }
};

// Validação de coerência: Função para verificar inconsistências
export function validateDataCoherence() {
  const issues: string[] = [];

  // Validar que todas as correlações existem
  examCorrelations.forEach((corr) => {
    const exam1 = labExamsData.find(e => e.id === corr.exam1);
    const exam2 = labExamsData.find(e => e.id === corr.exam2);

    if (!exam1) issues.push(`Correlação: Exame ${corr.exam1} não encontrado`);
    if (!exam2) issues.push(`Correlação: Exame ${corr.exam2} não encontrado`);

    // Validar que ambos os exames têm dados no mesmo período
    if (exam1 && exam2) {
      if (exam1.collectionDate !== exam2.collectionDate) {
        issues.push(`Correlação ${corr.exam1}-${corr.exam2}: Datas diferentes`);
      }
    }

    // Validar coerência de risco
    if (exam1 && exam2) {
      const exam1HasData = exam1.value !== null && exam1.status !== 'unknown';
      const exam2HasData = exam2.value !== null && exam2.status !== 'unknown';

      if (!exam1HasData || !exam2HasData) {
        if (corr.riskLevel !== 'low') {
          issues.push(
            `Correlação ${corr.exam1}-${corr.exam2}: Um dos exames sem dados, mas riskLevel não é 'low'`
          );
        }
      }
    }
  });

  // Validar que correlatedExams referencia exames que existem
  labExamsData.forEach((exam) => {
    exam.correlatedExams.forEach((correlatedId) => {
      const correlatedExam = labExamsData.find(e => e.id === correlatedId);
      if (!correlatedExam) {
        issues.push(`Exame ${exam.id}: Correlação com ${correlatedId} não existe`);
      }

      // Validar que ambos têm dados no mesmo período
      if (correlatedExam) {
        if (exam.collectionDate !== correlatedExam.collectionDate) {
          issues.push(`Exame ${exam.id}: Correlação ${correlatedId} tem data diferente`);
        }
      }
    });
  });

  return {
    isValid: issues.length === 0,
    issues
  };
}
