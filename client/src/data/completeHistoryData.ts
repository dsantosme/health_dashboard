// Histórico completo de exames - Todos os períodos (2022-2026)
// Owner Patient

export const allPeriodsExams = [
  // ============ 2022-03-20 ============
  {
    id: 'glicose-2022-03',
    name: 'Glicose',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 95,
    status: 'normal' as const,
    date: '2022-03-20',
    referenceMin: 70,
    referenceMax: 100,
    sourceFile: 'resultado7801602231.pdf'
  },
  {
    id: 'creatinina-2022-03',
    name: 'Creatinina',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 1.2,
    status: 'normal' as const,
    date: '2022-03-20',
    referenceMin: 0.7,
    referenceMax: 1.3,
    sourceFile: 'resultado7801602231.pdf'
  },
  {
    id: 'ureia-2022-03',
    name: 'Ureia',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 35,
    status: 'normal' as const,
    date: '2022-03-20',
    referenceMin: 15,
    referenceMax: 45,
    sourceFile: 'resultado7801602231.pdf'
  },

  // ============ 2023-01-06 ============
  {
    id: 'glicose-2023-01',
    name: 'Glicose',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 91,
    status: 'normal' as const,
    date: '2023-01-06',
    referenceMin: 70,
    referenceMax: 100,
    sourceFile: 'GLICOSE(1).pdf'
  },
  {
    id: 'hemoglobina-2023-01',
    name: 'Hemoglobina',
    category: 'Hematologia',
    unit: 'g/dL',
    value: 14.2,
    status: 'normal' as const,
    date: '2023-01-06',
    referenceMin: 13.5,
    referenceMax: 17.5,
    sourceFile: 'HemogramacomPlaquetas(1).pdf'
  },
  {
    id: 'potassio-2023-01',
    name: 'Potássio',
    category: 'Eletrólitos',
    unit: 'mEq/L',
    value: 4.5,
    status: 'normal' as const,
    date: '2023-01-06',
    referenceMin: 3.5,
    referenceMax: 5.1,
    sourceFile: 'POTASSIO(1).pdf'
  },
  {
    id: 'sodio-2023-01',
    name: 'Sódio',
    category: 'Eletrólitos',
    unit: 'mEq/L',
    value: 140,
    status: 'normal' as const,
    date: '2023-01-06',
    referenceMin: 135,
    referenceMax: 145,
    sourceFile: 'SODIO(1).pdf'
  },
  {
    id: 'ferritina-2023-01',
    name: 'Ferritina',
    category: 'Hematologia',
    unit: 'ng/mL',
    value: 299,
    status: 'normal' as const,
    date: '2023-01-06',
    referenceMin: 30,
    referenceMax: 400,
    sourceFile: 'FERRITINA(1).pdf'
  },

  // ============ 2023-04-25 ============
  {
    id: 'glicose-2023-04',
    name: 'Glicose (Glicosímetro)',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 89,
    status: 'normal' as const,
    date: '2023-04-25',
    referenceMin: 70,
    referenceMax: 100,
    sourceFile: 'Glicosimetro(2).pdf'
  },

  // ============ 2023-06-20 ============
  {
    id: 'glicose-2023-06',
    name: 'Glicose (Glicosímetro)',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 92,
    status: 'normal' as const,
    date: '2023-06-20',
    referenceMin: 70,
    referenceMax: 100,
    sourceFile: 'Glicosimetro(1).pdf'
  },

  // ============ 2023-11-28 ============
  {
    id: 'glicose-2023-11',
    name: 'Glicose (Glicosímetro)',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 90,
    status: 'normal' as const,
    date: '2023-11-28',
    referenceMin: 70,
    referenceMax: 100,
    sourceFile: 'Glicosimetro.pdf'
  },

  // ============ 2024-01-16 ============
  {
    id: 'glicose-2024-01',
    name: 'Glicose',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 91,
    status: 'normal' as const,
    date: '2024-01-16',
    referenceMin: 70,
    referenceMax: 100,
    sourceFile: 'GLICOSE.pdf'
  },
  {
    id: 'hemoglobina-2024-01',
    name: 'Hemoglobina',
    category: 'Hematologia',
    unit: 'g/dL',
    value: 14.5,
    status: 'normal' as const,
    date: '2024-01-16',
    referenceMin: 13.5,
    referenceMax: 17.5,
    sourceFile: 'HemogramacomPlaquetas.pdf'
  },
  {
    id: 'potassio-2024-01',
    name: 'Potássio',
    category: 'Eletrólitos',
    unit: 'mEq/L',
    value: 4.3,
    status: 'normal' as const,
    date: '2024-01-16',
    referenceMin: 3.5,
    referenceMax: 5.1,
    sourceFile: 'POTASSIO.pdf'
  },
  {
    id: 'sodio-2024-01',
    name: 'Sódio',
    category: 'Eletrólitos',
    unit: 'mEq/L',
    value: 142,
    status: 'normal' as const,
    date: '2024-01-16',
    referenceMin: 135,
    referenceMax: 145,
    sourceFile: 'SODIO.pdf'
  },
  {
    id: 'ferritina-2024-01',
    name: 'Ferritina',
    category: 'Hematologia',
    unit: 'ng/mL',
    value: 301,
    status: 'normal' as const,
    date: '2024-01-16',
    referenceMin: 30,
    referenceMax: 400,
    sourceFile: 'FERRITINA.pdf'
  },

  // ============ 2026-02-14 ============
  {
    id: 'vitb12-2026-02',
    name: 'Vitamina B12',
    category: 'Hematologia',
    unit: 'pg/mL',
    value: 331,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 172,
    referenceMax: 890,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'glicose-2026-02',
    name: 'Glicose',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 94,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 60,
    referenceMax: 99,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'a1c-2026-02',
    name: 'Hemoglobina Glicada (A1C)',
    category: 'Metabolismo de Glicose',
    unit: '%',
    value: 5.4,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: null,
    referenceMax: 5.7,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'tfg-2026-02',
    name: 'Taxa de Filtração Glomerular',
    category: 'Função Renal',
    unit: 'mL/min/1.73m²',
    value: 90,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 60,
    referenceMax: null,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'creatinina-2026-02',
    name: 'Creatinina',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 1.9,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 1.6,
    referenceMax: 2.6,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'ureia-2026-02',
    name: 'Ureia',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 32,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: null,
    referenceMax: 58,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'potassio-2026-02',
    name: 'Potássio',
    category: 'Eletrólitos',
    unit: 'mEq/L',
    value: 4.3,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 3.5,
    referenceMax: 5.1,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'sodio-2026-02',
    name: 'Sódio',
    category: 'Eletrólitos',
    unit: 'mEq/L',
    value: 142,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 135,
    referenceMax: 145,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'tgo-2026-02',
    name: 'TGO (AST)',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 32,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: null,
    referenceMax: 58,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'tgp-2026-02',
    name: 'TGP (ALT)',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 24,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: null,
    referenceMax: 40,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'tsh-2026-02',
    name: 'TSH',
    category: 'Tireoide',
    unit: 'µUI/mL',
    value: 1.05,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 0.89,
    referenceMax: 1.61,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'cortisol-2026-02',
    name: 'Cortisol Matinal',
    category: 'Hormônios',
    unit: 'pg/mL',
    value: 36.4,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 18.5,
    referenceMax: 88.0,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'estradiol-2026-02',
    name: 'Estradiol',
    category: 'Hormônios',
    unit: 'pg/mL',
    value: 2.0,
    status: 'low' as const,
    date: '2026-02-14',
    referenceMin: 2.5,
    referenceMax: 10.2,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'shbg-2026-02',
    name: 'SHBG',
    category: 'Hormônios',
    unit: 'ng/dL',
    value: 317.0,
    status: 'high' as const,
    date: '2026-02-14',
    referenceMin: 21.0,
    referenceMax: 49.0,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'hemoglobina-2026-02',
    name: 'Hemoglobina',
    category: 'Hematologia',
    unit: 'g/dL',
    value: 14.5,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 13.5,
    referenceMax: 17.5,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'hematocrito-2026-02',
    name: 'Hematócrito',
    category: 'Hematologia',
    unit: '%',
    value: 43.0,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 40.0,
    referenceMax: 54.0,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'plaquetas-2026-02',
    name: 'Plaquetas',
    category: 'Hematologia',
    unit: '1000/mm³',
    value: 250.0,
    status: 'normal' as const,
    date: '2026-02-14',
    referenceMin: 150.0,
    referenceMax: 450.0,
    sourceFile: 'resultados.pdf'
  },
  {
    id: 'ferro-2026-02',
    name: 'Ferro Sérico',
    category: 'Hematologia',
    unit: 'mcg/dL',
    value: 59,
    status: 'low' as const,
    date: '2026-02-14',
    referenceMin: 65,
    referenceMax: 175,
    sourceFile: 'resultados.pdf'
  }
];

// Agrupar por período para visualização
export const periodsSummary = {
  '2022-03-20': {
    date: '2022-03-20',
    label: 'Março 2022',
    exams: allPeriodsExams.filter(e => e.date === '2022-03-20'),
    count: allPeriodsExams.filter(e => e.date === '2022-03-20').length
  },
  '2023-01-06': {
    date: '2023-01-06',
    label: 'Janeiro 2023',
    exams: allPeriodsExams.filter(e => e.date === '2023-01-06'),
    count: allPeriodsExams.filter(e => e.date === '2023-01-06').length
  },
  '2023-04-25': {
    date: '2023-04-25',
    label: 'Abril 2023',
    exams: allPeriodsExams.filter(e => e.date === '2023-04-25'),
    count: allPeriodsExams.filter(e => e.date === '2023-04-25').length
  },
  '2023-06-20': {
    date: '2023-06-20',
    label: 'Junho 2023',
    exams: allPeriodsExams.filter(e => e.date === '2023-06-20'),
    count: allPeriodsExams.filter(e => e.date === '2023-06-20').length
  },
  '2023-11-28': {
    date: '2023-11-28',
    label: 'Novembro 2023',
    exams: allPeriodsExams.filter(e => e.date === '2023-11-28'),
    count: allPeriodsExams.filter(e => e.date === '2023-11-28').length
  },
  '2024-01-16': {
    date: '2024-01-16',
    label: 'Janeiro 2024',
    exams: allPeriodsExams.filter(e => e.date === '2024-01-16'),
    count: allPeriodsExams.filter(e => e.date === '2024-01-16').length
  },
  '2026-02-14': {
    date: '2026-02-14',
    label: 'Fevereiro 2026',
    exams: allPeriodsExams.filter(e => e.date === '2026-02-14'),
    count: allPeriodsExams.filter(e => e.date === '2026-02-14').length
  }
};

// Função para obter exames de um período
export function getExamsByPeriod(date: string) {
  return allPeriodsExams.filter(exam => exam.date === date);
}

// Função para obter histórico de um exame
export function getExamHistory(examName: string) {
  return allPeriodsExams.filter(exam => exam.name === examName).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// Função para obter períodos disponíveis
export function getAvailablePeriods() {
  const periods = new Set(allPeriodsExams.map(e => e.date));
  return Array.from(periods).sort();
}
