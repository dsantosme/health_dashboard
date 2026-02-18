// Dataset completo com todos os 17 exames realizados
// Estrutura preparada para receber histórico de futuras coletas

export interface ExamHistory {
  date: string;
  value: number | string;
  status: 'normal' | 'low' | 'high' | 'critical' | 'unknown' | 'not-captured';
}

export interface ExamData {
  id: string;
  name: string;
  category: string;
  
  // Dados atuais (coleta 1 - 14/02/2026)
  currentValue: number | string | null;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  referenceText?: string;
  status: 'normal' | 'low' | 'high' | 'critical' | 'unknown' | 'not-captured';
  
  // Histórico (para futuras coletas)
  history: ExamHistory[];
  
  // Metadados
  collectionDate: string;
  source: string;
}

export const allExamsData: ExamData[] = [
  // 1. GLICOSE EM JEJUM
  {
    id: 'glucose-fasting',
    name: 'Glicose em Jejum (Fluoreto)',
    category: 'Metabolismo de Glicose',
    currentValue: 94,
    unit: 'mg/dL',
    referenceMin: 60,
    referenceMax: 99,
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 94,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 2. HEMOGLOBINA GLICADA (A1C)
  {
    id: 'hemoglobin-a1c',
    name: 'Hemoglobina Glicada (A1C)',
    category: 'Metabolismo de Glicose',
    currentValue: '<5.7',
    unit: '%',
    referenceMax: 5.7,
    referenceText: 'MENOR QUE 5,7%',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: '<5.7',
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 3. FERRO SÉRICO
  {
    id: 'iron-serum',
    name: 'Ferro Sérico',
    category: 'Hematologia',
    currentValue: 1.0,
    unit: 'mcg/dL',
    referenceMin: 65,
    referenceMax: 175,
    referenceText: 'HOMEM: DE 65 A 175 mcg/dL',
    status: 'critical',
    history: [
      {
        date: '2026-02-14',
        value: 1.0,
        status: 'critical'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 4. VITAMINA B12
  {
    id: 'vitamin-b12',
    name: 'Vitamina B12',
    category: 'Hematologia',
    currentValue: 331,
    unit: 'pg/mL',
    referenceMin: 172,
    referenceMax: 890,
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 331,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 5. PROLACTINA
  {
    id: 'prolactin',
    name: 'Prolactina',
    category: 'Hormônios',
    currentValue: 6,
    unit: 'ng/mL',
    referenceText: 'MULHER: PRÉ-MENOPAUSA: DE 2,8 A 29,2 ng/mL | HOMEM: DE 2,1 A 17,7 ng/mL',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 6,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 6. TESTOSTERONA LIVRE CALCULADA
  {
    id: 'testosterone-free',
    name: 'Testosterona Livre Calculada',
    category: 'Hormônios',
    currentValue: 317,
    unit: 'ng/dL',
    referenceText: 'HOMEM DE 21 A 49 ANOS: DE 14,6 A 94,6 nmol/L (Nota: valor em ng/dL pode estar em unidade diferente)',
    status: 'unknown',
    history: [
      {
        date: '2026-02-14',
        value: 317,
        status: 'unknown'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 7. GLOBULINA LIGADORA DE HORMÔNIOS SEXUAIS (SHBG)
  {
    id: 'shbg',
    name: 'Globulina Ligadora de Hormônios Sexuais (SHBG)',
    category: 'Hormônios',
    currentValue: 25.0,
    unit: 'nmol/L',
    referenceText: 'HOMEM DE 21 A 49 ANOS: DE 14,6 A 94,6 nmol/L',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 25.0,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 8. ESTRADIOL, 17 BETA
  {
    id: 'estradiol-17beta',
    name: 'Estradiol, 17 Beta',
    category: 'Hormônios',
    currentValue: 35.3,
    unit: 'pg/mL',
    referenceText: 'ADULTOS: HOMEM: DE 10 A 40 pg/mL | MULHER: FASE FOLICULAR: DE 19,5 A 144,2 pg/mL',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 35.3,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 9. HORMÔNIO FOLÍCULO ESTIMULANTE (FSH)
  {
    id: 'fsh',
    name: 'Hormônio Folículo Estimulante (FSH)',
    category: 'Hormônios',
    currentValue: 2,
    unit: 'mUI/mL',
    referenceText: 'ADULTOS: HOMEM: DE 1,7 A 8,6 mUI/mL | MULHER: FASE FOLICULAR: DE 2,50 A 10,20 mUI/mL',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 2,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 10. TIREOPEROXIDASE, ANTICORPOS ANTI (TPO)
  {
    id: 'tpo-antibodies',
    name: 'Tireoperoxidase, Anticorpos Anti (TPO)',
    category: 'Tireoide',
    currentValue: 1,
    unit: 'UI/mL',
    referenceMax: 13.8,
    referenceText: 'INFERIOR A 13,8 UI/mL',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 1,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 11. T4 LIVRE
  {
    id: 't4-free',
    name: 'T4 Livre',
    category: 'Tireoide',
    currentValue: 1.05,
    unit: 'ng/dL',
    referenceMin: 0.89,
    referenceMax: 1.61,
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 1.05,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 12. PARATORMÔNIO PTH INTACTO
  {
    id: 'pth-intact',
    name: 'Paratormônio PTH Intacto (Molécula Inteira)',
    category: 'Minerais e Ossos',
    currentValue: 36.4,
    unit: 'pg/mL',
    referenceMin: 18.5,
    referenceMax: 88.0,
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 36.4,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 13. MAGNÉSIO
  {
    id: 'magnesium',
    name: 'Magnésio',
    category: 'Eletrólitos',
    currentValue: 1.9,
    unit: 'mg/dL',
    referenceMin: 1.6,
    referenceMax: 2.6,
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 1.9,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 14. POTÁSSIO
  {
    id: 'potassium',
    name: 'Potássio',
    category: 'Eletrólitos',
    currentValue: 4.3,
    unit: 'mEq/L',
    referenceMin: 3.5,
    referenceMax: 5.1,
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 4.3,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 15. FÓSFORO
  {
    id: 'phosphorus',
    name: 'Fósforo',
    category: 'Minerais e Ossos',
    currentValue: 4.2,
    unit: 'mg/dL',
    referenceMin: 2.5,
    referenceMax: 4.5,
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 4.2,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 16. TRANSAMINASE OXALACÉTICA (AST)
  {
    id: 'ast',
    name: 'Transaminase Oxalacética (AST)',
    category: 'Função Hepática',
    currentValue: 24,
    unit: 'U/L',
    referenceMax: 40,
    referenceText: 'HOMENS: INFERIOR OU IGUAL A 40 U/L',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 24,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 17. TRANSAMINASE PIRÚVICA (ALT)
  {
    id: 'alt',
    name: 'Transaminase Pirúvica (ALT)',
    category: 'Função Hepática',
    currentValue: 32,
    unit: 'U/L',
    referenceMax: 58,
    referenceText: 'HOMENS: INFERIOR OU IGUAL A 58 U/L',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 32,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 18. GAMA GT
  {
    id: 'gamma-gt',
    name: 'Gama GT',
    category: 'Função Hepática',
    currentValue: 5,
    unit: 'U/L',
    referenceMax: 73,
    referenceText: 'HOMENS: INFERIOR A 73 U/L',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: 5,
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 19. CREATININA (Função Renal)
  {
    id: 'creatinine',
    name: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    currentValue: '>90',
    unit: 'mL/min/1,73 m²',
    referenceMin: 0.76,
    referenceMax: 1.24,
    referenceText: 'HOMEM: DE 0,76 A 1,24 mg/dL (ou > 90 mL/min/1,73 m² = Normal)',
    status: 'normal',
    history: [
      {
        date: '2026-02-14',
        value: '>90',
        status: 'normal'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  },

  // 20. COLESTEROL TOTAL E FRAÇÕES
  {
    id: 'cholesterol-total',
    name: 'Colesterol Total e Frações',
    category: 'Lipídios',
    currentValue: null,
    unit: 'mg/dL',
    referenceText: 'Desejável: < 200 mg/dL',
    status: 'unknown',
    history: [
      {
        date: '2026-02-14',
        value: 'Não capturado',
        status: 'unknown'
      }
    ],
    collectionDate: '2026-02-14',
    source: 'resultados.pdf'
  }
];

// Dados antropométricos
export interface AnthropometricData {
  date: string;
  weight: number;
  height: number;
  waistCircumference: number;
  bmi: number;
  bmiStatus: string;
  waistHeightRatio: number;
}

export const anthropometricData: AnthropometricData[] = [
  {
    date: '2026-02-14',
    weight: 107,
    height: 182,
    waistCircumference: 111,
    bmi: 32.30,
    bmiStatus: 'Obesidade Grau I',
    waistHeightRatio: 0.610
  }
];

// Categorias de exames
export const examCategories = [
  'Metabolismo de Glicose',
  'Hematologia',
  'Hormônios',
  'Tireoide',
  'Minerais e Ossos',
  'Eletrólitos',
  'Função Hepática',
  'Função Renal',
  'Lipídios',
  'Antropometria'
];

// Sumário de status
export const statusSummary = {
  total: 20,
  normal: 14,
  low: 1,
  high: 0,
  critical: 1,
  unknown: 4,
  notCaptured: 0
};

// Estrutura para futuras coletas
export interface FutureCollection {
  collectionNumber: number;
  plannedDate: string;
  status: 'planned' | 'completed' | 'pending';
  exams: ExamData[];
}

export const futureCollections: FutureCollection[] = [
  {
    collectionNumber: 2,
    plannedDate: '2026-05-14',
    status: 'planned',
    exams: []
  },
  {
    collectionNumber: 3,
    plannedDate: '2026-08-14',
    status: 'planned',
    exams: []
  },
  {
    collectionNumber: 4,
    plannedDate: '2026-11-14',
    status: 'planned',
    exams: []
  }
];
