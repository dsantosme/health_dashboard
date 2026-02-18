// Dados de recomendações de especialistas, exames e exercícios

export interface SpecialistRecommendation {
  id: string;
  specialty: string;
  reason: string;
  frequency: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  suggestedActions: string[];
}

export interface ExamRecommendation {
  id: string;
  name: string;
  reason: string;
  frequency: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  relatedExams?: string[];
}

export interface ExerciseProgram {
  id: string;
  name: string;
  type: 'cycling' | 'running' | 'pilates' | 'swimming';
  intensity: 'low' | 'moderate' | 'high';
  duration: string;
  frequency: string;
  benefits: string[];
  precautions: string[];
  progressionWeeks: {
    week: number;
    description: string;
    intensity: string;
  }[];
}

export const specialistRecommendations: SpecialistRecommendation[] = [
  {
    id: 'hematologist',
    specialty: 'Hematologista',
    reason: 'Anemia severa (Ferro sérico 1.0 mcg/dL) requer investigação urgente',
    frequency: 'Imediato + acompanhamento mensal',
    urgency: 'critical',
    suggestedActions: [
      'Investigar causa da anemia (sangramento, má absorção, dieta)',
      'Prescrever suplementação de ferro',
      'Monitorar hemograma a cada 4 semanas',
      'Avaliar necessidade de transfusão se sintomas severos'
    ]
  },
  {
    id: 'gastroenterologist',
    specialty: 'Gastroenterologista',
    reason: 'Investigar possível sangramento gastrointestinal ou má absorção',
    frequency: 'Próximas 2-4 semanas',
    urgency: 'high',
    suggestedActions: [
      'Teste de sangue oculto nas fezes',
      'Endoscopia digestiva alta se indicado',
      'Colonoscopia se indicado',
      'Avaliação de absorção intestinal'
    ]
  },
  {
    id: 'nutritionist',
    specialty: 'Nutricionista',
    reason: 'Plano de redução de peso (25 kg) e reposição de ferro dietético',
    frequency: 'Imediato + mensal',
    urgency: 'high',
    suggestedActions: [
      'Criar plano de redução de 0.5-1 kg/semana',
      'Aumentar ingestão de ferro (carnes, feijão, espinafre)',
      'Ajustar calorias para déficit de 500-750 kcal/dia',
      'Monitorar macronutrientes para exercício intenso'
    ]
  },
  {
    id: 'sports-medicine',
    specialty: 'Médico do Esporte',
    reason: 'Prescrever programa de exercício seguro considerando anemia',
    frequency: 'Imediato + a cada 3 meses',
    urgency: 'high',
    suggestedActions: [
      'Avaliar capacidade aeróbica atual',
      'Prescrever progressão de exercício',
      'Monitorar frequência cardíaca e fadiga',
      'Ajustar intensidade conforme melhora de ferro'
    ]
  },
  {
    id: 'cardiologist',
    specialty: 'Cardiologista',
    reason: 'Avaliação preventiva de risco cardiovascular (obesidade, circunferência abdominal)',
    frequency: 'Próximos 3 meses',
    urgency: 'medium',
    suggestedActions: [
      'Avaliação clínica de risco cardiovascular',
      'Possível teste de esforço',
      'Monitoramento de pressão arterial',
      'Avaliação de lipídios'
    ]
  },
  {
    id: 'endocrinologist',
    specialty: 'Endocrinologista',
    reason: 'Monitoramento de metabolismo glicêmico e síndrome metabólica',
    frequency: 'Anualmente',
    urgency: 'low',
    suggestedActions: [
      'Avaliação de resistência à insulina',
      'Monitoramento de hormônios',
      'Avaliação de tireoide',
      'Prevenção de diabetes'
    ]
  }
];

export const examRecommendations: ExamRecommendation[] = [
  {
    id: 'hemograma',
    name: 'Hemograma Completo',
    reason: 'Avaliar hemoglobina, hematócrito e contagem de células vermelhas',
    frequency: 'Imediato + a cada 4 semanas',
    urgency: 'critical',
    relatedExams: ['Ferro Sérico', 'Ferritina']
  },
  {
    id: 'ferritina',
    name: 'Ferritina Sérica',
    reason: 'Avaliar estoques de ferro corporal',
    frequency: 'Imediato + a cada 4 semanas',
    urgency: 'critical',
    relatedExams: ['Ferro Sérico', 'Hemograma']
  },
  {
    id: 'transferrina',
    name: 'Transferrina',
    reason: 'Avaliar capacidade de transporte de ferro',
    frequency: 'Imediato',
    urgency: 'high',
    relatedExams: ['Ferro Sérico', 'Ferritina']
  },
  {
    id: 'sangue-oculto',
    name: 'Teste de Sangue Oculto nas Fezes',
    reason: 'Investigar possível sangramento gastrointestinal',
    frequency: 'Próximas 2 semanas',
    urgency: 'high',
    relatedExams: ['Ferro Sérico']
  },
  {
    id: 'lipidios',
    name: 'Perfil Lipídico Completo',
    reason: 'Avaliar colesterol total, LDL, HDL, triglicerídeos',
    frequency: 'Próximas 4 semanas',
    urgency: 'high',
    relatedExams: ['Glicose', 'A1C']
  },
  {
    id: 'pressao',
    name: 'Monitoramento de Pressão Arterial',
    reason: 'Avaliar pressão arterial em repouso e durante exercício',
    frequency: 'Semanal',
    urgency: 'high',
    relatedExams: ['Peso', 'Circunferência']
  },
  {
    id: 'glicose-recorrente',
    name: 'Glicose em Jejum',
    reason: 'Monitorar controle glicêmico',
    frequency: 'A cada 6 meses',
    urgency: 'medium',
    relatedExams: ['A1C']
  },
  {
    id: 'a1c-recorrente',
    name: 'Hemoglobina Glicada (A1C)',
    reason: 'Monitorar controle glicêmico de longo prazo',
    frequency: 'Anualmente',
    urgency: 'medium',
    relatedExams: ['Glicose']
  },
  {
    id: 'funcao-renal',
    name: 'Função Renal (Creatinina, Ureia)',
    reason: 'Avaliar saúde renal',
    frequency: 'Anualmente',
    urgency: 'low',
    relatedExams: []
  },
  {
    id: 'funcao-hepatica',
    name: 'Função Hepática (ALT, AST, GGT)',
    reason: 'Avaliar saúde hepática',
    frequency: 'Anualmente',
    urgency: 'low',
    relatedExams: []
  }
];

export const exercisePrograms: ExerciseProgram[] = [
  {
    id: 'cycling-road',
    name: 'Ciclismo de Estrada - Programa de Progressão',
    type: 'cycling',
    intensity: 'high',
    duration: '45-90 minutos',
    frequency: '3-4 dias/semana',
    benefits: [
      'Queima de calorias: 600-900 kcal/sessão',
      'Melhora capacidade cardiovascular',
      'Baixo impacto nas articulações',
      'Ideal para redução de peso',
      'Fortalecimento de pernas e core'
    ],
    precautions: [
      '⚠️ CRÍTICO: Corrigir anemia (ferro) ANTES de intensificar',
      'Começar com intensidade baixa-moderada',
      'Monitorar frequência cardíaca',
      'Hidratar adequadamente',
      'Usar equipamento de segurança (capacete, luzes)',
      'Fazer aquecimento de 10 minutos',
      'Fazer resfriamento de 5-10 minutos'
    ],
    progressionWeeks: [
      {
        week: 1,
        description: 'Adaptação - Ciclos leves em terreno plano',
        intensity: 'Baixa (50-60% FCmáx)'
      },
      {
        week: 2,
        description: 'Resistência - Aumentar duração gradualmente',
        intensity: 'Baixa-Moderada (60-70% FCmáx)'
      },
      {
        week: 3,
        description: 'Velocidade - Adicionar intervalos de velocidade',
        intensity: 'Moderada (70-80% FCmáx)'
      },
      {
        week: 4,
        description: 'Força - Adicionar subidas suaves',
        intensity: 'Moderada-Alta (75-85% FCmáx)'
      },
      {
        week: 5,
        description: 'Consolidação - Combinar velocidade e força',
        intensity: 'Alta (80-90% FCmáx)'
      },
      {
        week: 6,
        description: 'Manutenção - Treinos variados',
        intensity: 'Variada (60-90% FCmáx)'
      },
      {
        week: 7,
        description: 'Progressão - Aumentar duração ou intensidade',
        intensity: 'Alta (80-90% FCmáx)'
      },
      {
        week: 8,
        description: 'Recuperação - Semana leve para adaptação',
        intensity: 'Baixa-Moderada (50-70% FCmáx)'
      }
    ]
  },

  {
    id: 'mtb',
    name: 'Mountain Bike (MTB) - Programa de Progressão',
    type: 'cycling',
    intensity: 'high',
    duration: '60-120 minutos',
    frequency: '2-3 dias/semana',
    benefits: [
      'Queima de calorias: 700-1000 kcal/sessão',
      'Melhora força e equilíbrio',
      'Trabalho de core intenso',
      'Melhora coordenação motora',
      'Excelente para redução de peso'
    ],
    precautions: [
      '⚠️ CRÍTICO: Corrigir anemia ANTES de iniciar MTB',
      'Usar equipamento de proteção completo',
      'Começar em trilhas fáceis',
      'Aumentar dificuldade gradualmente',
      'Treinar técnica em terreno controlado',
      'Monitorar fadiga e recuperação',
      'Descanso de 48h entre sessões intensas'
    ],
    progressionWeeks: [
      {
        week: 1,
        description: 'Técnica - Trilhas fáceis, foco em controle',
        intensity: 'Baixa-Moderada (60-70% FCmáx)'
      },
      {
        week: 2,
        description: 'Resistência - Aumentar duração em trilhas fáceis',
        intensity: 'Moderada (65-75% FCmáx)'
      },
      {
        week: 3,
        description: 'Dificuldade - Introduzir trilhas moderadas',
        intensity: 'Moderada (70-80% FCmáx)'
      },
      {
        week: 4,
        description: 'Força - Subidas técnicas em trilhas moderadas',
        intensity: 'Moderada-Alta (75-85% FCmáx)'
      },
      {
        week: 5,
        description: 'Velocidade - Descidas técnicas com segurança',
        intensity: 'Alta (80-90% FCmáx)'
      },
      {
        week: 6,
        description: 'Consolidação - Trilhas variadas',
        intensity: 'Variada (70-90% FCmáx)'
      },
      {
        week: 7,
        description: 'Progressão - Trilhas difíceis ou duração maior',
        intensity: 'Alta (85-95% FCmáx)'
      },
      {
        week: 8,
        description: 'Recuperação - Trilhas fáceis',
        intensity: 'Baixa-Moderada (50-70% FCmáx)'
      }
    ]
  },

  {
    id: 'running',
    name: 'Corrida de Rua - Programa de Progressão',
    type: 'running',
    intensity: 'high',
    duration: '30-60 minutos',
    frequency: '3-4 dias/semana',
    benefits: [
      'Queima de calorias: 500-800 kcal/sessão',
      'Melhora cardiovascular significativa',
      'Fortalecimento de pernas',
      'Excelente para redução de peso',
      'Melhora resistência aeróbica'
    ],
    precautions: [
      '⚠️ CRÍTICO: Corrigir anemia ANTES de intensificar',
      'Usar tênis apropriado para corrida',
      'Começar com caminhada/trote alternado',
      'Aumentar volume gradualmente',
      'Descanso de 48h entre corridas intensas',
      'Fazer aquecimento de 5-10 minutos',
      'Fazer resfriamento com caminhada',
      'Monitorar dor nas articulações'
    ],
    progressionWeeks: [
      {
        week: 1,
        description: 'Adaptação - Alternância caminhada/trote',
        intensity: 'Baixa (50-60% FCmáx)'
      },
      {
        week: 2,
        description: 'Resistência - Aumentar tempo de trote',
        intensity: 'Baixa-Moderada (60-70% FCmáx)'
      },
      {
        week: 3,
        description: 'Continuidade - Correr sem parar',
        intensity: 'Moderada (65-75% FCmáx)'
      },
      {
        week: 4,
        description: 'Distância - Aumentar distância gradualmente',
        intensity: 'Moderada (70-75% FCmáx)'
      },
      {
        week: 5,
        description: 'Velocidade - Adicionar intervalos rápidos',
        intensity: 'Moderada-Alta (75-85% FCmáx)'
      },
      {
        week: 6,
        description: 'Consolidação - Treinos variados',
        intensity: 'Variada (65-85% FCmáx)'
      },
      {
        week: 7,
        description: 'Progressão - Aumentar intensidade ou distância',
        intensity: 'Alta (80-90% FCmáx)'
      },
      {
        week: 8,
        description: 'Recuperação - Corrida leve',
        intensity: 'Baixa-Moderada (50-70% FCmáx)'
      }
    ]
  },

  {
    id: 'pilates',
    name: 'Pilates - Programa de Progressão',
    type: 'pilates',
    intensity: 'moderate',
    duration: '45-60 minutos',
    frequency: '3-4 dias/semana',
    benefits: [
      'Fortalecimento de core',
      'Melhora postura e flexibilidade',
      'Queima de calorias: 200-400 kcal/sessão',
      'Baixo impacto',
      'Melhora equilíbrio e coordenação',
      'Complementa bem ciclismo e corrida'
    ],
    precautions: [
      'Fazer com instrutor qualificado inicialmente',
      'Respeitar limitações de movimento',
      'Focar em qualidade vs. quantidade',
      'Respiração controlada é essencial',
      'Não fazer com dor'
    ],
    progressionWeeks: [
      {
        week: 1,
        description: 'Fundamentos - Aprender posição neutra e respiração',
        intensity: 'Baixa'
      },
      {
        week: 2,
        description: 'Estabilização - Exercícios básicos de core',
        intensity: 'Baixa-Moderada'
      },
      {
        week: 3,
        description: 'Força - Adicionar resistência',
        intensity: 'Moderada'
      },
      {
        week: 4,
        description: 'Flexibilidade - Alongamentos e mobilidade',
        intensity: 'Moderada'
      },
      {
        week: 5,
        description: 'Integração - Combinar força e flexibilidade',
        intensity: 'Moderada-Alta'
      },
      {
        week: 6,
        description: 'Consolidação - Treinos variados',
        intensity: 'Moderada'
      },
      {
        week: 7,
        description: 'Progressão - Exercícios avançados',
        intensity: 'Moderada-Alta'
      },
      {
        week: 8,
        description: 'Manutenção - Rotina regular',
        intensity: 'Moderada'
      }
    ]
  },

  {
    id: 'swimming',
    name: 'Natação - Programa de Progressão',
    type: 'swimming',
    intensity: 'moderate',
    duration: '30-60 minutos',
    frequency: '2-3 dias/semana',
    benefits: [
      'Exercício de corpo inteiro',
      'Queima de calorias: 400-600 kcal/sessão',
      'Muito baixo impacto nas articulações',
      'Excelente para recuperação',
      'Melhora capacidade aeróbica',
      'Ideal para iniciantes em exercício'
    ],
    precautions: [
      '⚠️ IMPORTANTE: Você não sabe nadar - começar com aulas',
      'Fazer aulas com instrutor qualificado',
      'Começar na água rasa',
      'Usar flutuadores se necessário',
      'Respeitar seu ritmo de aprendizado',
      'Não se forçar além de suas capacidades',
      'Sempre ter supervisor presente',
      'Usar óculos para melhor visão'
    ],
    progressionWeeks: [
      {
        week: 1,
        description: 'Adaptação - Familiarização com água',
        intensity: 'Muito Baixa'
      },
      {
        week: 2,
        description: 'Flutuação - Aprender a flutuar e respirar',
        intensity: 'Baixa'
      },
      {
        week: 3,
        description: 'Nado Básico - Aprender técnica de nado',
        intensity: 'Baixa'
      },
      {
        week: 4,
        description: 'Resistência - Aumentar duração',
        intensity: 'Baixa-Moderada'
      },
      {
        week: 5,
        description: 'Velocidade - Aumentar velocidade gradualmente',
        intensity: 'Moderada'
      },
      {
        week: 6,
        description: 'Técnica - Melhorar eficiência de movimento',
        intensity: 'Moderada'
      },
      {
        week: 7,
        description: 'Variação - Aprender diferentes estilos',
        intensity: 'Moderada'
      },
      {
        week: 8,
        description: 'Manutenção - Rotina regular',
        intensity: 'Moderada'
      }
    ]
  }
];

// Programa semanal recomendado
export const weeklySchedule = {
  description: 'Programa semanal balanceado considerando anemia crítica',
  note: '⚠️ IMPORTANTE: Corrigir ferro ANTES de intensificar exercício',
  weeks: [
    {
      week: 1,
      title: 'Semana 1 - Adaptação e Recuperação',
      activities: [
        { day: 'Segunda', activity: 'Pilates (45 min) - Baixa intensidade', intensity: 'low' },
        { day: 'Terça', activity: 'Repouso ou caminhada leve (20 min)', intensity: 'low' },
        { day: 'Quarta', activity: 'Natação - Aula iniciante (30 min)', intensity: 'low' },
        { day: 'Quinta', activity: 'Repouso', intensity: 'low' },
        { day: 'Sexta', activity: 'Pilates (45 min) - Baixa intensidade', intensity: 'low' },
        { day: 'Sábado', activity: 'Ciclismo leve em terreno plano (30 min)', intensity: 'low' },
        { day: 'Domingo', activity: 'Repouso completo', intensity: 'low' }
      ]
    },
    {
      week: 2,
      title: 'Semana 2 - Progressão Gradual',
      activities: [
        { day: 'Segunda', activity: 'Pilates (45 min) - Intensidade moderada', intensity: 'moderate' },
        { day: 'Terça', activity: 'Corrida/Caminhada alternada (20 min)', intensity: 'moderate' },
        { day: 'Quarta', activity: 'Natação - Aula 2 (30 min)', intensity: 'low' },
        { day: 'Quinta', activity: 'Repouso ou alongamento (15 min)', intensity: 'low' },
        { day: 'Sexta', activity: 'Pilates (45 min) - Intensidade moderada', intensity: 'moderate' },
        { day: 'Sábado', activity: 'Ciclismo moderado (45 min)', intensity: 'moderate' },
        { day: 'Domingo', activity: 'Repouso completo', intensity: 'low' }
      ]
    }
  ]
};
