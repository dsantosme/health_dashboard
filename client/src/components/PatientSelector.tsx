import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatient } from '@/contexts/PatientContext';
import { getPatient } from '@/data/patientsData';
import { User } from 'lucide-react';

export function PatientSelector() {
  const { selectedPatientId, setSelectedPatientId, availablePatients } = usePatient();
  const currentPatient = getPatient(selectedPatientId);

  return (
    <div className="flex items-center gap-3">
      <User className="w-5 h-5 text-slate-600" />
      <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione um paciente" />
        </SelectTrigger>
        <SelectContent>
          {availablePatients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              <div className="flex flex-col">
                <span className="font-medium">{patient.name}</span>
                <span className="text-xs text-gray-500">{patient.age} anos</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentPatient && (
        <div className="text-sm text-slate-600">
          <span className="font-medium">{currentPatient.name}</span>
          <span className="text-xs ml-2">({currentPatient.age} anos)</span>
        </div>
      )}
    </div>
  );
}
