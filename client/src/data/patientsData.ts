// Dados de pacientes com histórico completo de exames
// Cada paciente tem seus próprios dados de exames, histórico e análises

export interface Patient {
  id: string;
  name: string;
  cpf?: string;
  birthDate?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: string;
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  avatar?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface PatientExam {
  id: string;
  patientId: string;
  name: string;
  category: string;
  unit: string;
  value: number | string | null;
  status: 'normal' | 'low' | 'high' | 'critical' | 'unknown';
  date: string;
  referenceMin?: number;
  referenceMax?: number;
  referenceText?: string;
  method?: string;
  sourceFile?: string;
}

export interface PatientTrend {
  id: string;
  patientId: string;
  examName: string;
  category: string;
  unit: string;
  trend: 'up' | 'down' | 'stable' | 'insufficient_data';
  trendValue?: number;
  interpretation: string;
  history: Array<{
    date: string;
    value: number | string | null;
  }>;
}

// Dados do paciente Sample Patient - HISTÓRICO COMPLETO 2022-2026
export const sampleExams: PatientExam[] = [
  // GLICOSE - 2022
  {
    id: 'glucose-2022',
    patientId: 'john-doe',
    name: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 5.3,
    status: 'low',
    date: '2022-03-20',
    referenceMin: 70,
    referenceMax: 100
  },
  // GLICOSE - 2023
  {
    id: 'glucose-2023',
    patientId: 'john-doe',
    name: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 91,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 70,
    referenceMax: 100
  },
  // GLICOSE - 2024
  {
    id: 'glucose-2024',
    patientId: 'john-doe',
    name: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 91,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 70,
    referenceMax: 100
  },

  // CREATININA - 2023
  {
    id: 'creatinine-2023',
    patientId: 'john-doe',
    name: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 1.16,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 0.76,
    referenceMax: 1.24
  },
  // CREATININA - 2024
  {
    id: 'creatinine-2024',
    patientId: 'john-doe',
    name: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 1.06,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 0.76,
    referenceMax: 1.24
  },

  // FERRITINA - 2023
  {
    id: 'ferritin-2023',
    patientId: 'john-doe',
    name: 'Ferritina Sérica',
    category: 'Hematologia',
    unit: 'ng/mL',
    value: 299,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 22,
    referenceMax: 491
  },
  // FERRITINA - 2024
  {
    id: 'ferritin-2024',
    patientId: 'john-doe',
    name: 'Ferritina Sérica',
    category: 'Hematologia',
    unit: 'ng/mL',
    value: 301,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 22,
    referenceMax: 491
  },
  // FERRITINA - 2026
  {
    id: 'ferritin-2026',
    patientId: 'john-doe',
    name: 'Ferritina Sérica',
    category: 'Hematologia',
    unit: 'ng/mL',
    value: 174.4,
    status: 'normal',
    date: '2026-02-14',
    referenceMin: 30,
    referenceMax: 400
  },

  // FOSFATASE ALCALINA - 2023
  {
    id: 'alk-phos-2023',
    patientId: 'john-doe',
    name: 'Fosfatase Alcalina',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 83,
    status: 'normal',
    date: '2023-01-06',
    referenceMax: 104
  },
  // FOSFATASE ALCALINA - 2024
  {
    id: 'alk-phos-2024',
    patientId: 'john-doe',
    name: 'Fosfatase Alcalina',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 76,
    status: 'normal',
    date: '2024-01-16',
    referenceMax: 104
  },

  // HEMOGLOBINA - 2023
  {
    id: 'hemoglobin-2023',
    patientId: 'john-doe',
    name: 'Hemoglobina',
    category: 'Hematologia',
    unit: 'g/dL',
    value: 15.0,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 13.5,
    referenceMax: 17.5
  },
  // HEMOGLOBINA - 2024
  {
    id: 'hemoglobin-2024',
    patientId: 'john-doe',
    name: 'Hemoglobina',
    category: 'Hematologia',
    unit: 'g/dL',
    value: 13.0,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 13.5,
    referenceMax: 17.5
  },

  // PLAQUETAS - 2023
  {
    id: 'platelets-2023',
    patientId: 'john-doe',
    name: 'Plaquetas',
    category: 'Hematologia',
    unit: '10³/µL',
    value: 250,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 150,
    referenceMax: 400
  },
  // PLAQUETAS - 2024
  {
    id: 'platelets-2024',
    patientId: 'john-doe',
    name: 'Plaquetas',
    category: 'Hematologia',
    unit: '10³/µL',
    value: 245,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 150,
    referenceMax: 400
  },

  // COLESTEROL TOTAL - 2023
  {
    id: 'cholesterol-2023',
    patientId: 'john-doe',
    name: 'Colesterol Total',
    category: 'Lipídios',
    unit: 'mg/dL',
    value: 174,
    status: 'normal',
    date: '2023-01-06',
    referenceMax: 200
  },
  // COLESTEROL TOTAL - 2024
  {
    id: 'cholesterol-2024',
    patientId: 'john-doe',
    name: 'Colesterol Total',
    category: 'Lipídios',
    unit: 'mg/dL',
    value: 171,
    status: 'normal',
    date: '2024-01-16',
    referenceMax: 200
  },

  // GAMA GT - 2023
  {
    id: 'gamma-gt-2023',
    patientId: 'john-doe',
    name: 'Gama GT',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 13,
    status: 'normal',
    date: '2023-01-06',
    referenceMax: 65
  },
  // GAMA GT - 2024
  {
    id: 'gamma-gt-2024',
    patientId: 'john-doe',
    name: 'Gama GT',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 15,
    status: 'normal',
    date: '2024-01-16',
    referenceMax: 65
  },

  // FERRO SÉRICO - 2026
  {
    id: 'iron-2026',
    patientId: 'john-doe',
    name: 'Ferro Sérico',
    category: 'Hematologia',
    unit: 'mcg/dL',
    value: 59.0,
    status: 'low',
    date: '2026-02-14',
    referenceMin: 65,
    referenceMax: 175
  },

  // VITAMINA B12 - 2026
  {
    id: 'b12-2026',
    patientId: 'john-doe',
    name: 'Vitamina B12',
    category: 'Hematologia',
    unit: 'pg/mL',
    value: 331.0,
    status: 'normal',
    date: '2026-02-14',
    referenceMin: 172,
    referenceMax: 890
  }
];

// Tendências do paciente Sample Patient
export const sampleTrends: PatientTrend[] = [
  {
    id: 'trend-glucose',
    patientId: 'john-doe',
    examName: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    trend: 'stable',
    interpretation: 'Glicose estável ao longo do período, mantendo níveis normais',
    history: [
      { date: '2022-03-20', value: 5.3 },
      { date: '2023-01-06', value: 91 },
      { date: '2024-01-16', value: 91 }
    ]
  },
  {
    id: 'trend-creatinine',
    patientId: 'john-doe',
    examName: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    unit: 'mg/dL',
    trend: 'down',
    trendValue: -8.6,
    interpretation: 'Creatinina em queda, indicando melhora na função renal',
    history: [
      { date: '2023-01-06', value: 1.16 },
      { date: '2024-01-16', value: 1.06 }
    ]
  },
  {
    id: 'trend-ferritin',
    patientId: 'john-doe',
    examName: 'Ferritina Sérica',
    category: 'Hematologia',
    unit: 'ng/mL',
    trend: 'stable',
    interpretation: 'Ferritina estável em níveis normais',
    history: [
      { date: '2023-01-06', value: 299 },
      { date: '2024-01-16', value: 301 },
      { date: '2026-02-14', value: 174.4 }
    ]
  },
  {
    id: 'trend-hemoglobin',
    patientId: 'john-doe',
    examName: 'Hemoglobina',
    category: 'Hematologia',
    unit: 'g/dL',
    trend: 'down',
    trendValue: -13.3,
    interpretation: 'Hemoglobina em queda, requer acompanhamento',
    history: [
      { date: '2023-01-06', value: 15.0 },
      { date: '2024-01-16', value: 13.0 }
    ]
  }
];

// Paciente Sample Patient
export const samplePatient: Patient = {
  id: 'john-doe',
  name: 'Sample Patient',
  birthDate: '1984-02-17',
  age: 41,
  gender: 'Masculino',
  createdAt: '2022-03-20',
  lastUpdated: '2026-02-14'
};

// Lista de pacientes
export const patients: Patient[] = [samplePatient];

// Função para obter paciente
export function getPatient(patientId: string): Patient | undefined {
  return patients.find(p => p.id === patientId);
}

// Função para obter exames de um paciente
export function getPatientExams(patientId: string): PatientExam[] {
  if (patientId === 'john-doe') {
    return sampleExams;
  }
  return [];
}

// Função para obter tendências de um paciente
export function getPatientTrends(patientId: string): PatientTrend[] {
  if (patientId === 'john-doe') {
    return sampleTrends;
  }
  return [];
}

// Função para obter exames de um período específico
export function getExamsByPeriod(patientId: string, period: string): PatientExam[] {
  const exams = getPatientExams(patientId);
  return exams.filter(exam => exam.date.startsWith(period.substring(0, 4)));
}

// Função para obter histórico de um exame específico
export function getExamHistory(patientId: string, examName: string): PatientExam[] {
  const exams = getPatientExams(patientId);
  return exams
    .filter(exam => exam.name === examName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
