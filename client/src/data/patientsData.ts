// Sistema de múltiplos pacientes
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

// Dados do paciente Denis Santos
export const denisExams: PatientExam[] = [
  // GLICOSE - ESTÁVEL
  {
    id: 'glucose-2023',
    patientId: 'denis-santos',
    name: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 91,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 60,
    referenceMax: 99
  },
  {
    id: 'glucose-2024',
    patientId: 'denis-santos',
    name: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    value: 91,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 60,
    referenceMax: 99
  },

  // CREATININA - DESCENDO
  {
    id: 'creatinine-2023',
    patientId: 'denis-santos',
    name: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 1.16,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 0.76,
    referenceMax: 1.24
  },
  {
    id: 'creatinine-2024',
    patientId: 'denis-santos',
    name: 'Creatinina (Função Renal)',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 1.06,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 0.76,
    referenceMax: 1.24
  },

  // FERRITINA - SUBINDO LEVEMENTE
  {
    id: 'ferritin-2023',
    patientId: 'denis-santos',
    name: 'Ferritina Sérica',
    category: 'Hematologia',
    unit: 'ng/mL',
    value: 299,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 22,
    referenceMax: 491
  },
  {
    id: 'ferritin-2024',
    patientId: 'denis-santos',
    name: 'Ferritina Sérica',
    category: 'Hematologia',
    unit: 'ng/mL',
    value: 301,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 22,
    referenceMax: 491
  },

  // FOSFATASE ALCALINA - DESCENDO
  {
    id: 'alk-phos-2023',
    patientId: 'denis-santos',
    name: 'Fosfatase Alcalina',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 83,
    status: 'normal',
    date: '2023-01-06',
    referenceMax: 104
  },
  {
    id: 'alk-phos-2024',
    patientId: 'denis-santos',
    name: 'Fosfatase Alcalina',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 76,
    status: 'normal',
    date: '2024-01-16',
    referenceMax: 104
  },

  // GAMA GT - SUBINDO
  {
    id: 'gamma-gt-2023',
    patientId: 'denis-santos',
    name: 'Gama GT',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 13,
    status: 'normal',
    date: '2023-01-06',
    referenceMax: 73
  },
  {
    id: 'gamma-gt-2024',
    patientId: 'denis-santos',
    name: 'Gama GT',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 15,
    status: 'normal',
    date: '2024-01-16',
    referenceMax: 73
  },

  // POTÁSSIO - DESCENDO
  {
    id: 'potassium-2023',
    patientId: 'denis-santos',
    name: 'Potássio',
    category: 'Minerais e Eletrólitos',
    unit: 'mEq/L',
    value: 4.5,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 3.5,
    referenceMax: 5.1
  },
  {
    id: 'potassium-2024',
    patientId: 'denis-santos',
    name: 'Potássio',
    category: 'Minerais e Eletrólitos',
    unit: 'mEq/L',
    value: 4.3,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 3.5,
    referenceMax: 5.1
  },

  // SÓDIO - SUBINDO LEVEMENTE
  {
    id: 'sodium-2023',
    patientId: 'denis-santos',
    name: 'Sódio',
    category: 'Minerais e Eletrólitos',
    unit: 'mEq/L',
    value: 140,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 136,
    referenceMax: 145
  },
  {
    id: 'sodium-2024',
    patientId: 'denis-santos',
    name: 'Sódio',
    category: 'Minerais e Eletrólitos',
    unit: 'mEq/L',
    value: 142,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 136,
    referenceMax: 145
  },

  // TGO (AST) - SUBINDO
  {
    id: 'ast-2023',
    patientId: 'denis-santos',
    name: 'TGO (AST)',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 22,
    status: 'normal',
    date: '2023-01-06',
    referenceMax: 40
  },
  {
    id: 'ast-2024',
    patientId: 'denis-santos',
    name: 'TGO (AST)',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 24,
    status: 'normal',
    date: '2024-01-16',
    referenceMax: 40
  },

  // TGP (ALT) - DESCENDO
  {
    id: 'alt-2023',
    patientId: 'denis-santos',
    name: 'TGP (ALT)',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 27,
    status: 'normal',
    date: '2023-01-06',
    referenceMax: 58
  },
  {
    id: 'alt-2024',
    patientId: 'denis-santos',
    name: 'TGP (ALT)',
    category: 'Função Hepática',
    unit: 'U/L',
    value: 26,
    status: 'normal',
    date: '2024-01-16',
    referenceMax: 58
  },

  // TSH - DESCENDO
  {
    id: 'tsh-2023',
    patientId: 'denis-santos',
    name: 'TSH',
    category: 'Tireoide',
    unit: 'µUI/mL',
    value: 1.72,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 0.4,
    referenceMax: 4.0
  },
  {
    id: 'tsh-2024',
    patientId: 'denis-santos',
    name: 'TSH',
    category: 'Tireoide',
    unit: 'µUI/mL',
    value: 1.63,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 0.4,
    referenceMax: 4.0
  },

  // UREIA - SUBINDO
  {
    id: 'urea-2023',
    patientId: 'denis-santos',
    name: 'Ureia',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 34,
    status: 'normal',
    date: '2023-01-06',
    referenceMin: 7,
    referenceMax: 20
  },
  {
    id: 'urea-2024',
    patientId: 'denis-santos',
    name: 'Ureia',
    category: 'Função Renal',
    unit: 'mg/dL',
    value: 37,
    status: 'normal',
    date: '2024-01-16',
    referenceMin: 7,
    referenceMax: 20
  }
];

// Dados do paciente Denis Santos - Tendências
export const denisTrends: PatientTrend[] = [
  {
    id: 'glucose-trend',
    patientId: 'denis-santos',
    examName: 'Glicose em Jejum',
    category: 'Metabolismo de Glicose',
    unit: 'mg/dL',
    trend: 'stable',
    trendValue: 0,
    interpretation: 'Glicose em jejum mantém-se estável e normal.',
    history: [
      { date: '2023-01-06', value: 91 },
      { date: '2024-01-16', value: 91 }
    ]
  },
  {
    id: 'creatinine-trend',
    patientId: 'denis-santos',
    examName: 'Creatinina',
    category: 'Função Renal',
    unit: 'mg/dL',
    trend: 'down',
    trendValue: -8.6,
    interpretation: 'Função renal melhorando gradualmente.',
    history: [
      { date: '2023-01-06', value: 1.16 },
      { date: '2024-01-16', value: 1.06 }
    ]
  }
];

// Perfil do paciente Denis Santos
export const denisSantos: Patient = {
  id: 'denis-santos',
  name: 'Denis Santos',
  age: 42,
  gender: 'Masculino',
  email: 'denis@example.com',
  createdAt: '2023-01-06',
  lastUpdated: '2024-01-16'
};

// Lista de pacientes
export const patients: Patient[] = [denisSantos];

// Função para obter exames de um paciente
export function getPatientExams(patientId: string): PatientExam[] {
  if (patientId === 'denis-santos') {
    return denisExams;
  }
  return [];
}

// Função para obter tendências de um paciente
export function getPatientTrends(patientId: string): PatientTrend[] {
  if (patientId === 'denis-santos') {
    return denisTrends;
  }
  return [];
}

// Função para obter paciente
export function getPatient(patientId: string): Patient | undefined {
  return patients.find(p => p.id === patientId);
}
