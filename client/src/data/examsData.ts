// Estrutura de dados completa para exames médicos
export interface ExamDetail {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  
  // Explicação detalhada
  explanation: string;
  whatItMeans: string;
  
  // Descobertas e correlações
  findings: string[];
  correlations: {
    exam: string;
    relationship: string;
  }[];
  
  // Artigos sintetizados
  articles: {
    title: string;
    summary: string;
    source: string;
    relevance: 'high' | 'medium' | 'low';
  }[];
  
  // Alertas com tempestividade
  alerts: {
    message: string;
    severity: 'info' | 'warning' | 'danger';
    timeframe: string;
    action: string;
  }[];
  
  // Recomendações
  recommendations: {
    type: 'specialist' | 'exam' | 'lifestyle';
    description: string;
    frequency?: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }[];
}

export const examsData: ExamDetail[] = [
  {
    id: 'glucose',
    name: 'Glicose em Jejum',
    value: 94,
    unit: 'mg/dL',
    referenceMin: 60,
    referenceMax: 99,
    status: 'normal',
    urgency: 'low',
    date: '2026-02-14',
    
    explanation: 'A glicose em jejum mede o nível de açúcar no sangue após 8-12 horas sem ingestão de alimentos. É um indicador fundamental para avaliar o metabolismo de carboidratos e detectar pré-diabetes ou diabetes.',
    
    whatItMeans: 'Seu nível de glicose está dentro da faixa normal, indicando que seu corpo está regulando bem o açúcar no sangue. Isso é um sinal positivo de metabolismo saudável.',
    
    findings: [
      'Metabolismo de glicose normal',
      'Sem sinais de resistência à insulina',
      'Risco baixo de diabetes tipo 2',
      'Função pancreática adequada'
    ],
    
    correlations: [
      {
        exam: 'Hemoglobina Glicada (A1C)',
        relationship: 'Ambas medem controle de glicose; A1C reflete média de 3 meses'
      },
      {
        exam: 'Peso e Circunferência Abdominal',
        relationship: 'Obesidade aumenta risco de resistência à insulina'
      }
    ],
    
    articles: [
      {
        title: 'Fasting Glucose and Cardiovascular Disease Risk',
        summary: 'Estudos mostram que glicose em jejum entre 100-125 mg/dL aumenta risco cardiovascular em 50%. Seu nível de 94 mg/dL está em zona segura.',
        source: 'American Heart Association',
        relevance: 'high'
      },
      {
        title: 'Metabolic Syndrome and Abdominal Obesity',
        summary: 'Circunferência abdominal elevada pode levar a resistência à insulina mesmo com glicose normal. Monitorar junto com peso.',
        source: 'Endocrine Society',
        relevance: 'high'
      }
    ],
    
    alerts: [
      {
        message: 'Glicose normal mantém você fora da zona de risco de diabetes',
        severity: 'info',
        timeframe: 'Imediato',
        action: 'Manter hábitos atuais e monitorar a cada 6 meses'
      }
    ],
    
    recommendations: [
      {
        type: 'exam',
        description: 'Repetir Glicose em Jejum',
        frequency: 'A cada 6 meses',
        priority: 'medium'
      },
      {
        type: 'exam',
        description: 'Hemoglobina Glicada (A1C)',
        frequency: 'Anualmente',
        priority: 'medium'
      },
      {
        type: 'specialist',
        description: 'Consulta com Endocrinologista',
        frequency: 'Anualmente (preventivo)',
        priority: 'low'
      },
      {
        type: 'lifestyle',
        description: 'Manter dieta com baixo índice glicêmico',
        frequency: 'Contínuo',
        priority: 'high'
      }
    ]
  },

  {
    id: 'hemoglobina-a1c',
    name: 'Hemoglobina Glicada (A1C)',
    value: '<5.7',
    unit: '%',
    referenceMin: 0,
    referenceMax: 5.7,
    status: 'normal',
    urgency: 'low',
    date: '2026-02-14',
    
    explanation: 'A hemoglobina glicada (A1C) mede a porcentagem de hemoglobina no sangue que está ligada ao açúcar. Reflete o nível médio de glicose nos últimos 2-3 meses.',
    
    whatItMeans: 'Seu A1C está abaixo de 5.7%, indicando excelente controle de glicose nos últimos 3 meses. Você está em zona de risco muito baixo para diabetes.',
    
    findings: [
      'Controle de glicose excelente',
      'Sem evidência de pré-diabetes',
      'Metabolismo estável',
      'Risco muito baixo de complicações diabéticas'
    ],
    
    correlations: [
      {
        exam: 'Glicose em Jejum',
        relationship: 'Correlação forte; ambas indicam controle glicêmico'
      },
      {
        exam: 'Peso',
        relationship: 'Manutenção de peso favorece controle de A1C'
      }
    ],
    
    articles: [
      {
        title: 'A1C Targets and Cardiovascular Outcomes',
        summary: 'A1C < 5.7% associado a menor risco de eventos cardiovasculares. Seu valor está em zona ótima.',
        source: 'Diabetes Care Journal',
        relevance: 'high'
      }
    ],
    
    alerts: [
      {
        message: 'Excelente controle glicêmico - continue monitorando',
        severity: 'info',
        timeframe: 'Imediato',
        action: 'Manter rotina atual'
      }
    ],
    
    recommendations: [
      {
        type: 'exam',
        description: 'Repetir A1C',
        frequency: 'Anualmente',
        priority: 'low'
      }
    ]
  },

  {
    id: 'ferro-serico',
    name: 'Ferro Sérico',
    value: 1.0,
    unit: 'mcg/dL',
    referenceMin: 65,
    referenceMax: 175,
    status: 'critical',
    urgency: 'critical',
    date: '2026-02-14',
    
    explanation: 'O ferro sérico mede a quantidade de ferro livre no sangue. É essencial para transporte de oxigênio, produção de energia e função cognitiva. Valores muito baixos indicam anemia severa.',
    
    whatItMeans: 'Seu ferro sérico está CRITICAMENTE BAIXO (1.0 mcg/dL vs. normal 65-175). Isso indica anemia severa que requer investigação urgente e intervenção médica imediata.',
    
    findings: [
      'Anemia severa confirmada',
      'Possível deficiência de ferro',
      'Risco de fadiga extrema',
      'Comprometimento da função cognitiva',
      'Possível impacto em desempenho físico'
    ],
    
    correlations: [
      {
        exam: 'Hemoglobina',
        relationship: 'Ferro baixo causa redução de hemoglobina'
      },
      {
        exam: 'Peso e Circunferência',
        relationship: 'Anemia reduz energia para exercício, afetando perda de peso'
      },
      {
        exam: 'Vitamina B12',
        relationship: 'Ambas essenciais para produção de hemácias'
      }
    ],
    
    articles: [
      {
        title: 'Iron Deficiency Anemia: Diagnosis and Management',
        summary: 'Ferro < 30 mcg/dL indica anemia severa. Requer investigação de causa (sangramento, má absorção, dieta inadequada). Suplementação urgente necessária.',
        source: 'Mayo Clinic',
        relevance: 'high'
      },
      {
        title: 'Iron and Athletic Performance',
        summary: 'Atletas com anemia têm redução de 20-30% em capacidade aeróbica. Crítico para seu plano de exercício.',
        source: 'Sports Medicine Reviews',
        relevance: 'high'
      },
      {
        title: 'Iron Supplementation Protocols',
        summary: 'Suplementação oral com sulfato ferroso 325mg/dia. Absorção melhor com vitamina C. Efeitos colaterais: constipação, náusea.',
        source: 'Hematology Society',
        relevance: 'high'
      }
    ],
    
    alerts: [
      {
        message: '🚨 CRÍTICO: Ferro sérico severamente baixo',
        severity: 'danger',
        timeframe: 'URGENTE - próximos 2-3 dias',
        action: 'Consultar médico IMEDIATAMENTE para investigação de causa'
      },
      {
        message: 'Anemia severa pode comprometer seu plano de exercício',
        severity: 'warning',
        timeframe: 'Imediato',
        action: 'Iniciar suplementação sob orientação médica antes de intensificar exercício'
      },
      {
        message: 'Possível sangramento oculto ou má absorção',
        severity: 'warning',
        timeframe: 'Próximas 2 semanas',
        action: 'Investigar causa: endoscopia, colonoscopia ou avaliação de absorção'
      }
    ],
    
    recommendations: [
      {
        type: 'specialist',
        description: 'Consulta URGENTE com Hematologista',
        frequency: 'Próximos 2-3 dias',
        priority: 'critical'
      },
      {
        type: 'specialist',
        description: 'Avaliação com Gastroenterologista',
        frequency: 'Próximas 2-4 semanas',
        priority: 'high'
      },
      {
        type: 'exam',
        description: 'Hemograma completo',
        frequency: 'Imediato',
        priority: 'critical'
      },
      {
        type: 'exam',
        description: 'Ferritina sérica',
        frequency: 'Imediato',
        priority: 'critical'
      },
      {
        type: 'exam',
        description: 'Transferrina',
        frequency: 'Imediato',
        priority: 'high'
      },
      {
        type: 'exam',
        description: 'Teste de sangue oculto nas fezes',
        frequency: 'Próximas 2 semanas',
        priority: 'high'
      },
      {
        type: 'lifestyle',
        description: 'Aumentar ingestão de ferro dietético (carnes vermelhas, feijão, espinafre)',
        frequency: 'Contínuo',
        priority: 'high'
      },
      {
        type: 'lifestyle',
        description: 'Suplementação de ferro (sob orientação médica)',
        frequency: 'Diário',
        priority: 'critical'
      }
    ]
  },

  {
    id: 'peso-imc',
    name: 'Peso e IMC',
    value: 107,
    unit: 'kg',
    referenceMin: 65,
    referenceMax: 82,
    status: 'high',
    urgency: 'high',
    date: '2026-02-14',
    
    explanation: 'Peso corporal e Índice de Massa Corporal (IMC) são indicadores de composição corporal. IMC = Peso(kg) / Altura(m)². Seu IMC atual é 32.3 kg/m², classificado como Obesidade Grau I.',
    
    whatItMeans: 'Seu peso está 25 kg acima do ideal para sua altura (182 cm). Isso aumenta significativamente o risco de doenças cardiovasculares, diabetes, e problemas articulares.',
    
    findings: [
      'Obesidade Grau I confirmada',
      'IMC 32.3 (normal: 18.5-24.9)',
      'Aumento de risco cardiovascular',
      'Possível gordura visceral elevada',
      'Impacto em capacidade aeróbica'
    ],
    
    correlations: [
      {
        exam: 'Circunferência Abdominal',
        relationship: 'Indicador de distribuição de gordura visceral'
      },
      {
        exam: 'Glicose e A1C',
        relationship: 'Obesidade aumenta risco de resistência à insulina'
      },
      {
        exam: 'Ferro Sérico',
        relationship: 'Anemia reduz energia para exercício'
      }
    ],
    
    articles: [
      {
        title: 'Obesity and Cardiovascular Disease Risk',
        summary: 'Cada 5 kg de peso perdido reduz pressão arterial em 2-3 mmHg. Seu alvo de 25 kg pode reduzir risco cardiovascular em 30-40%.',
        source: 'American Heart Association',
        relevance: 'high'
      },
      {
        title: 'Weight Loss and Athletic Performance',
        summary: 'Redução de 10% do peso corporal melhora capacidade aeróbica em 15-20%, velocidade em 8-12%. Crítico para seu plano de ciclismo e corrida.',
        source: 'Sports Science Journal',
        relevance: 'high'
      }
    ],
    
    alerts: [
      {
        message: 'Peso acima do ideal aumenta risco cardiovascular',
        severity: 'warning',
        timeframe: 'Médio prazo (3-6 meses)',
        action: 'Implementar plano de redução de peso'
      },
      {
        message: 'Anemia severa pode comprometer exercício intenso',
        severity: 'danger',
        timeframe: 'Imediato',
        action: 'Corrigir ferro antes de intensificar exercício'
      }
    ],
    
    recommendations: [
      {
        type: 'specialist',
        description: 'Consulta com Nutricionista',
        frequency: 'Imediato + mensal',
        priority: 'high'
      },
      {
        type: 'specialist',
        description: 'Avaliação com Educador Físico',
        frequency: 'Imediato + quinzenal',
        priority: 'high'
      },
      {
        type: 'lifestyle',
        description: 'Plano de redução de peso: 0.5-1 kg/semana',
        frequency: 'Contínuo',
        priority: 'critical'
      },
      {
        type: 'lifestyle',
        description: 'Exercício: 150 min/semana atividade moderada',
        frequency: 'Contínuo',
        priority: 'high'
      }
    ]
  },

  {
    id: 'circunferencia-abdominal',
    name: 'Circunferência Abdominal',
    value: 111,
    unit: 'cm',
    referenceMin: 0,
    referenceMax: 102,
    status: 'high',
    urgency: 'high',
    date: '2026-02-14',
    
    explanation: 'A circunferência abdominal mede a gordura visceral (ao redor dos órgãos internos). É mais preditiva de risco cardiometabólico que o IMC sozinho.',
    
    whatItMeans: 'Sua circunferência abdominal de 111 cm está 9 cm acima do limite seguro (102 cm). Isso indica acúmulo significativo de gordura visceral, associada a maior risco de doença cardiovascular e diabetes.',
    
    findings: [
      'Gordura visceral elevada',
      'Risco moderado-alto de síndrome metabólica',
      'Inflamação sistêmica provável',
      'Risco aumentado de aterosclerose'
    ],
    
    correlations: [
      {
        exam: 'Peso',
        relationship: 'Correlação direta; redução de peso reduz circunferência'
      },
      {
        exam: 'Glicose',
        relationship: 'Gordura visceral causa resistência à insulina'
      }
    ],
    
    articles: [
      {
        title: 'Waist Circumference and Cardiometabolic Risk',
        summary: 'Circunferência > 102 cm em homens aumenta risco de infarto em 2-3x. Redução de 10 cm reduz risco em 40%.',
        source: 'Circulation Journal',
        relevance: 'high'
      }
    ],
    
    alerts: [
      {
        message: 'Circunferência abdominal acima do seguro',
        severity: 'warning',
        timeframe: 'Médio prazo',
        action: 'Reduzir circunferência para < 100 cm'
      }
    ],
    
    recommendations: [
      {
        type: 'lifestyle',
        description: 'Redução de circunferência: 2 cm/mês',
        frequency: 'Contínuo',
        priority: 'high'
      }
    ]
  }
];
