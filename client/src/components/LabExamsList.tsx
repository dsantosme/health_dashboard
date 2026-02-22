import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatient } from '@/contexts/PatientContext';
import { getPatientExams } from '@/data/patientsData';
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

export function LabExamsList() {
  const { selectedPatientId } = usePatient();
  const exams = getPatientExams(selectedPatientId);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Agrupar por categoria
  const categories = Array.from(new Set(exams.map(e => e.category)));
  const filteredExams = selectedCategory 
    ? exams.filter(e => e.category === selectedCategory)
    : exams;

  // Agrupar por nome de exame para mostrar histórico
  const examsByName = filteredExams.reduce((acc, exam) => {
    if (!acc[exam.name]) {
      acc[exam.name] = [];
    }
    acc[exam.name].push(exam);
    return acc;
  }, {} as Record<string, typeof exams>);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'low':
      case 'high':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Normal</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">⬇️ Baixo</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">⬆️ Alto</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">🔴 Crítico</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtro por Categoria */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({exams.length})
        </button>
        {categories.map(category => {
          const count = exams.filter(e => e.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de Exames */}
      <div className="space-y-4">
        {Object.entries(examsByName).map(([examName, examRecords]) => (
          <Card key={examName} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{examName}</h3>
                <p className="text-sm text-slate-600">{examRecords[0].category}</p>
              </div>
              {examRecords.length > 0 && getStatusIcon(examRecords[examRecords.length - 1].status)}
            </div>

            {/* Histórico */}
            <div className="space-y-3">
              {examRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((exam, idx) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {exam.date}
                      </span>
                      <span className="text-sm text-slate-600">
                        {exam.value} {exam.unit}
                      </span>
                      {exam.referenceMin && exam.referenceMax && (
                        <span className="text-xs text-slate-500">
                          (Ref: {exam.referenceMin}-{exam.referenceMax})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(exam.status)}
                    {idx === 0 && examRecords.length > 1 && (
                      <div className="text-xs text-slate-600">
                        {typeof examRecords[0].value === 'number' && typeof examRecords[1].value === 'number' && (
                          examRecords[0].value > examRecords[1].value ? (
                            <TrendingUp className="w-4 h-4 text-red-600" />
                          ) : examRecords[0].value < examRecords[1].value ? (
                            <TrendingDown className="w-4 h-4 text-green-600" />
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
