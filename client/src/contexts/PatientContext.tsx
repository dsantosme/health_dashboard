import React, { createContext, useContext, useState } from 'react';
import { patients } from '@/data/patientsData';

interface PatientContextType {
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  availablePatients: typeof patients;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');

  return (
    <PatientContext.Provider value={{ selectedPatientId, setSelectedPatientId, availablePatients: patients }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient deve ser usado dentro de PatientProvider');
  }
  return context;
}
