// Dados dos exames mais recentes - 14/02/2026
// Extraído do PDF resultados.pdf com faixas de referência atualizadas

export const latestExamsData = [
  // Hematologia
  {
    id: 'vitb12-2026',
    name: 'Vitamina B12',
    value: 331,
    unit: 'pg/mL',
    category: 'Hematologia',
    referenceMin: 172,
    referenceMax: 890,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Vitamina B12 (Cobalamina) - essencial para síntese de DNA e função neurológica',
    insights: [
      'Nível normal indica absorção adequada de B12',
      'Importante para energia e função cognitiva',
      'Monitorar anualmente'
    ]
  },
  
  // Metabolismo de Glicose
  {
    id: 'glicose-2026',
    name: 'Glicose em Jejum',
    value: 94,
    unit: 'mg/dL',
    category: 'Metabolismo de Glicose',
    referenceMin: 60,
    referenceMax: 99,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Glicose em jejum - indicador de controle glicêmico',
    insights: [
      'Valor normal indica bom controle metabólico',
      'Manter dieta equilibrada',
      'Continuar com exercícios regulares'
    ]
  },
  
  {
    id: 'a1c-2026',
    name: 'Hemoglobina Glicada (A1C)',
    value: 5.4,
    unit: '%',
    category: 'Metabolismo de Glicose',
    referenceMin: null,
    referenceMax: 5.7,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Hemoglobina Glicada - média de glicose dos últimos 3 meses',
    insights: [
      'Valor excelente (<5.7% = não diabético)',
      'Glicemia média estimada: 107.4 mg/dL',
      'Manter hábitos saudáveis'
    ]
  },
  
  // Função Renal
  {
    id: 'tfg-2026',
    name: 'Taxa de Filtração Glomerular (TFG)',
    value: 90,
    unit: 'mL/min/1.73m²',
    category: 'Função Renal',
    referenceMin: 60,
    referenceMax: null,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'TFG - indicador de função renal',
    insights: [
      'Função renal normal (Estágio 1)',
      'Manter hidratação adequada',
      'Monitorar anualmente'
    ]
  },
  
  {
    id: 'creatinina-2026',
    name: 'Creatinina',
    value: 1.9,
    unit: 'mg/dL',
    category: 'Função Renal',
    referenceMin: 1.6,
    referenceMax: 2.6,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Creatinina - produto do metabolismo muscular',
    insights: [
      'Valor normal indica função renal adequada',
      'Correlaciona com massa muscular',
      'Monitorar em conjunto com ureia'
    ]
  },
  
  {
    id: 'ureia-2026',
    name: 'Ureia',
    value: 32,
    unit: 'mg/dL',
    category: 'Função Renal',
    referenceMin: null,
    referenceMax: 58,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Ureia - produto do metabolismo proteico',
    insights: [
      'Valor normal indica função renal adequada',
      'Razão Ureia/Creatinina normal',
      'Hidratação adequada'
    ]
  },
  
  // Eletrólitos
  {
    id: 'potassio-2026',
    name: 'Potássio',
    value: 4.3,
    unit: 'mEq/L',
    category: 'Eletrólitos',
    referenceMin: 3.5,
    referenceMax: 5.1,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Potássio - eletrólito essencial para função cardíaca',
    insights: [
      'Nível normal para função cardíaca adequada',
      'Importante para atletas (ciclismo, corrida)',
      'Consumir alimentos ricos em potássio'
    ]
  },
  
  {
    id: 'sodio-2026',
    name: 'Sódio',
    value: 142,
    unit: 'mEq/L',
    category: 'Eletrólitos',
    referenceMin: 135,
    referenceMax: 145,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Sódio - eletrólito essencial para equilíbrio hídrico',
    insights: [
      'Nível normal para hidratação adequada',
      'Importante durante exercícios intensos',
      'Manter ingestão adequada de sal'
    ]
  },
  
  // Função Hepática
  {
    id: 'tgo-2026',
    name: 'TGO (AST)',
    value: 32,
    unit: 'U/L',
    category: 'Função Hepática',
    referenceMin: null,
    referenceMax: 58,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Transaminase Glutâmica Oxalacética (TGO/AST)',
    insights: [
      'Valor normal indica função hepática adequada',
      'Também presente em músculo (correlação com exercício)',
      'Monitorar em conjunto com TGP'
    ]
  },
  
  {
    id: 'tgp-2026',
    name: 'TGP (ALT)',
    value: 24,
    unit: 'U/L',
    category: 'Função Hepática',
    referenceMin: null,
    referenceMax: 40,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Transaminase Glutâmica Pirúvica (TGP/ALT)',
    insights: [
      'Valor normal indica função hepática adequada',
      'Mais específica para fígado que TGO',
      'Razão AST/ALT normal'
    ]
  },
  
  // Hormônios
  {
    id: 'tsh-2026',
    name: 'TSH',
    value: 1.05,
    unit: 'µUI/mL',
    category: 'Tireoide',
    referenceMin: 0.89,
    referenceMax: 1.61,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Hormônio Estimulante da Tireoide (TSH)',
    insights: [
      'Função tireoidiana normal',
      'Metabolismo adequado',
      'Monitorar anualmente'
    ]
  },
  
  {
    id: 'cortisol-2026',
    name: 'Cortisol Matinal',
    value: 36.4,
    unit: 'pg/mL',
    category: 'Hormônios',
    referenceMin: 18.5,
    referenceMax: 88.0,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Cortisol matinal - hormônio do estresse',
    insights: [
      'Nível normal de cortisol matinal',
      'Resposta ao estresse adequada',
      'Importante para recuperação pós-exercício'
    ]
  },
  
  {
    id: 'testosterona-2026',
    name: 'Testosterona Total',
    value: 1.0,
    unit: 'ng/dL',
    category: 'Hormônios',
    referenceMin: null,
    referenceMax: null,
    status: 'unknown' as const,
    date: '2026-02-14',
    description: 'Testosterona Total - hormônio sexual',
    insights: [
      'Importante para desempenho atlético',
      'Correlaciona com força muscular',
      'Monitorar se houver sintomas'
    ]
  },
  
  {
    id: 'estradiol-2026',
    name: 'Estradiol',
    value: 2.0,
    unit: 'pg/mL',
    category: 'Hormônios',
    referenceMin: 2.5,
    referenceMax: 10.2,
    status: 'low' as const,
    date: '2026-02-14',
    description: 'Estradiol - hormônio sexual',
    insights: [
      'Nível abaixo do esperado',
      'Pode afetar saúde óssea',
      'Consultar endocrinologista'
    ]
  },
  
  {
    id: 'shbg-2026',
    name: 'SHBG (Globulina Ligadora de Hormônios Sexuais)',
    value: 317.0,
    unit: 'ng/dL',
    category: 'Hormônios',
    referenceMin: 21.0,
    referenceMax: 49.0,
    status: 'high' as const,
    date: '2026-02-14',
    description: 'SHBG - proteína transportadora de hormônios sexuais',
    insights: [
      'Nível elevado de SHBG',
      'Pode reduzir biodisponibilidade de hormônios sexuais',
      'Correlaciona com exercício intenso'
    ]
  },
  
  // Hematologia - Hemograma
  {
    id: 'hemoglobina-2026',
    name: 'Hemoglobina',
    value: 14.5,
    unit: 'g/dL',
    category: 'Hematologia',
    referenceMin: 13.5,
    referenceMax: 17.5,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Hemoglobina - proteína transportadora de oxigênio',
    insights: [
      'Nível normal para transporte de oxigênio',
      'Importante para desempenho em esportes aeróbicos',
      'Monitorar em atletas'
    ]
  },
  
  {
    id: 'hematocrito-2026',
    name: 'Hematócrito',
    value: 43.0,
    unit: '%',
    category: 'Hematologia',
    referenceMin: 40.0,
    referenceMax: 54.0,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Hematócrito - percentual de glóbulos vermelhos',
    insights: [
      'Proporção normal de células vermelhas',
      'Correlaciona com hemoglobina',
      'Importante para capacidade aeróbica'
    ]
  },
  
  {
    id: 'plaquetas-2026',
    name: 'Plaquetas',
    value: 250.0,
    unit: '1000/mm³',
    category: 'Hematologia',
    referenceMin: 150.0,
    referenceMax: 450.0,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Plaquetas - células de coagulação',
    insights: [
      'Contagem normal de plaquetas',
      'Coagulação adequada',
      'Importante para recuperação de lesões'
    ]
  },
  
  // Ferro
  {
    id: 'ferro-2026',
    name: 'Ferro Sérico',
    value: 59,
    unit: 'mcg/dL',
    category: 'Hematologia',
    referenceMin: 65,
    referenceMax: 175,
    status: 'low' as const,
    date: '2026-02-14',
    description: 'Ferro Sérico - mineral essencial para oxigenação',
    insights: [
      '⚠️ CRÍTICO: Ferro abaixo do normal',
      'Pode causar fadiga e reduzir desempenho',
      'Aumentar ingestão de ferro (carne vermelha, feijão)',
      'Considerar suplementação após consulta médica',
      'Monitorar em próximos exames (3 meses)'
    ]
  },
  
  {
    id: 'ferritina-2026',
    name: 'Ferritina Sérica',
    value: 94,
    unit: 'ng/mL',
    category: 'Hematologia',
    referenceMin: null,
    referenceMax: null,
    status: 'normal' as const,
    date: '2026-02-14',
    description: 'Ferritina - armazenamento de ferro',
    insights: [
      'Nível adequado de armazenamento de ferro',
      'Correlaciona com ferro sérico baixo',
      'Monitorar ambos os indicadores'
    ]
  },
];

// Função para obter exame por ID
export function getLatestExamById(id: string) {
  return latestExamsData.find(exam => exam.id === id);
}

// Função para obter exames por categoria
export function getLatestExamsByCategory(category: string) {
  return latestExamsData.filter(exam => exam.category === category);
}

// Função para obter exames anormais
export function getAbnormalLatestExams() {
  return latestExamsData.filter(exam => exam.status !== 'normal');
}

// Função para obter exames críticos
export function getCriticalLatestExams() {
  return latestExamsData.filter(exam => exam.status === 'high' || exam.status === 'low');
}
