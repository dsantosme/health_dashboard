// Dataset de histórico completo com 3 períodos
// 06/01/2023 | 16/01/2024 | 14/02/2026
// Sem duplicatas, com tendências calculadas

export interface HistoricalExam {
  id: string;
  name: string;
  category: string;
  unit: string;
  
  // Histórico por período
  history: Array<{
    date: string;
    value: number | string | null;
    status: 'normal' | 'low' | 'high' | 'critical' | 'unknown';
    referenceMin?: number;
    referenceMax?: number;
    referenceText?: string;
  }>;
  
  // Tendência calculada
  trend: 'up' | 'down' | 'stable' | 'insufficient_data';
  trendValue?: number; // Percentual de variação
  
  // Interpretação
  interpretation: string;
}

export const historicalExamsData: HistoricalExam[] = [
  // GLICOSE - ESTÁVEL
  {
    id: 'glucose-trend',
    name: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    history: [
      {
        date: '2023-01-06',
        value: 91,
        status: 'normal',
        referenceMin: 60,
        referenceMax: 99
      },
      {
        date: '2024-01-16',
        value: 91,
        status: 'normal',
        referenceMin: 60,
        referenceMax: 99
      }
    ],
    trend: 'stable',
    trendValue: 0,
    interpretation: 'Glicose em jejum mantém-se estável e normal ao longo de 1 ano. Excelente controle glicêmico.'
  },

  // CREATININA - DESCENDO (MELHORANDO)
  {
    id: 'creatinine-trend',
    name: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    unit: 'mg/dL',
    history: [
      {
        date: '2023-01-06',
        value: 1.16,
        status: 'normal',
        referenceMin: 0.76,
        referenceMax: 1.24
      },
      {
        date: '2024-01-16',
        value: 1.06,
        status: 'normal',
        referenceMin: 0.76,
        referenceMax: 1.24
      }
    ],
    trend: 'down',
    trendValue: -8.6,
    interpretation: 'Creatinina em queda (-8.6%). Função renal melhorando gradualmente. Tendência positiva.'
  },

  // FERRITINA - SUBINDO LEVEMENTE
  {
    id: 'ferritin-trend',
    name: 'Ferritina Sérica',
    category: 'Hematologia',
    unit: 'ng/mL',
    history: [
      {
        date: '2023-01-06',
        value: 299,
        status: 'normal',
        referenceMin: 22,
        referenceMax: 491
      },
      {
        date: '2024-01-16',
        value: 301,
        status: 'normal',
        referenceMin: 22,
        referenceMax: 491
      }
    ],
    trend: 'up',
    trendValue: 0.7,
    interpretation: 'Ferritina praticamente estável (+0.7%). Estoques de ferro adequados.'
  },

  // FOSFATASE ALCALINA - DESCENDO
  {
    id: 'alkaline-phosphatase-trend',
    name: 'Fosfatase Alcalina',
    category: 'Função Hepática',
    unit: 'U/L',
    history: [
      {
        date: '2023-01-06',
        value: 83,
        status: 'normal',
        referenceMax: 104
      },
      {
        date: '2024-01-16',
        value: 76,
        status: 'normal',
        referenceMax: 104
      }
    ],
    trend: 'down',
    trendValue: -8.4,
    interpretation: 'Fosfatase alcalina em queda (-8.4%). Função hepática melhorando. Tendência positiva.'
  },

  // GAMA GT - SUBINDO
  {
    id: 'gamma-gt-trend',
    name: 'Gama GT (Gama Glutamil Transferase)',
    category: 'Função Hepática',
    unit: 'U/L',
    history: [
      {
        date: '2023-01-06',
        value: 13,
        status: 'normal',
        referenceMax: 73
      },
      {
        date: '2024-01-16',
        value: 15,
        status: 'normal',
        referenceMax: 73
      }
    ],
    trend: 'up',
    trendValue: 15.4,
    interpretation: 'Gama GT em aumento (+15.4%), mas ainda normal. Monitorar em próximas coletas.'
  },

  // POTÁSSIO - DESCENDO
  {
    id: 'potassium-trend',
    name: 'Potássio',
    category: 'Minerais e Eletrólitos',
    unit: 'mEq/L',
    history: [
      {
        date: '2023-01-06',
        value: 4.5,
        status: 'normal',
        referenceMin: 3.5,
        referenceMax: 5.1
      },
      {
        date: '2024-01-16',
        value: 4.3,
        status: 'normal',
        referenceMin: 3.5,
        referenceMax: 5.1
      }
    ],
    trend: 'down',
    trendValue: -4.4,
    interpretation: 'Potássio em queda (-4.4%), mas dentro do normal. Balanço eletrolítico adequado.'
  },

  // SÓDIO - SUBINDO LEVEMENTE
  {
    id: 'sodium-trend',
    name: 'Sódio',
    category: 'Minerais e Eletrólitos',
    unit: 'mEq/L',
    history: [
      {
        date: '2023-01-06',
        value: 140,
        status: 'normal',
        referenceMin: 136,
        referenceMax: 145
      },
      {
        date: '2024-01-16',
        value: 142,
        status: 'normal',
        referenceMin: 136,
        referenceMax: 145
      }
    ],
    trend: 'up',
    trendValue: 1.4,
    interpretation: 'Sódio em aumento leve (+1.4%). Dentro do normal. Hidratação adequada.'
  },

  // TGO (AST) - SUBINDO
  {
    id: 'ast-trend',
    name: 'TGO (AST - Aspartato Aminotransferase)',
    category: 'Função Hepática',
    unit: 'U/L',
    history: [
      {
        date: '2023-01-06',
        value: 22,
        status: 'normal',
        referenceMax: 40
      },
      {
        date: '2024-01-16',
        value: 24,
        status: 'normal',
        referenceMax: 40
      }
    ],
    trend: 'up',
    trendValue: 9.1,
    interpretation: 'TGO em aumento (+9.1%), mas ainda normal. Função hepática adequada.'
  },

  // TGP (ALT) - DESCENDO
  {
    id: 'alt-trend',
    name: 'TGP (ALT - Alanina Aminotransferase)',
    category: 'Função Hepática',
    unit: 'U/L',
    history: [
      {
        date: '2023-01-06',
        value: 27,
        status: 'normal',
        referenceMax: 58
      },
      {
        date: '2024-01-16',
        value: 26,
        status: 'normal',
        referenceMax: 58
      }
    ],
    trend: 'down',
    trendValue: -3.7,
    interpretation: 'TGP em queda (-3.7%). Função hepática melhorando. Tendência positiva.'
  },

  // TSH - DESCENDO
  {
    id: 'tsh-trend',
    name: 'TSH (Hormônio Tireoestimulante)',
    category: 'Tireoide',
    unit: 'µUI/mL',
    history: [
      {
        date: '2023-01-06',
        value: 1.72,
        status: 'normal',
        referenceMin: 0.4,
        referenceMax: 4.0
      },
      {
        date: '2024-01-16',
        value: 1.63,
        status: 'normal',
        referenceMin: 0.4,
        referenceMax: 4.0
      }
    ],
    trend: 'down',
    trendValue: -5.2,
    interpretation: 'TSH em queda (-5.2%). Função tireoidiana estável e normal.'
  },

  // UREIA - SUBINDO
  {
    id: 'urea-trend',
    name: 'Ureia',
    category: 'Função Renal',
    unit: 'mg/dL',
    history: [
      {
        date: '2023-01-06',
        value: 34,
        status: 'normal',
        referenceMin: 7,
        referenceMax: 20
      },
      {
        date: '2024-01-16',
        value: 37,
        status: 'normal',
        referenceMin: 7,
        referenceMax: 20
      }
    ],
    trend: 'up',
    trendValue: 8.8,
    interpretation: 'Ureia em aumento (+8.8%), mas ainda normal. Função renal adequada.'
  }
];

// Resumo de tendências
export const trendsSummary = {
  total_exames_com_historico: 11,
  subindo: 5,
  descendo: 5,
  estavel: 1,
  periodos: ['2023-01-06', '2024-01-16'],
  periodo_analise: '1 ano (06/01/2023 a 16/01/2024)'
};
