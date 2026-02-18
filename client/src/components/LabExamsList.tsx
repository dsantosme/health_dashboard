import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { labExamsData, LabExam } from '@/data/labExamsData';
import { AlertCircle, TrendingUp, Info } from 'lucide-react';

interface LabExamsListProps {
  category: string;
  onSelectExam: (exam: LabExam) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'bg-green-100 text-green-800';
    case 'low':
      return 'bg-orange-100 text-orange-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'unknown':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'normal':
      return '✅ Normal';
    case 'low':
      return '⬇️ Baixo';
    case 'high':
      return '⬆️ Alto';
    case 'critical':
      return '🚨 Crítico';
    case 'unknown':
      return '❓ Sem Ref.';
    default:
      return status;
  }
};

export function LabExamsList({ category, onSelectExam }: LabExamsListProps) {
  const [selectedExam, setSelectedExam] = useState<LabExam | null>(null);

  const exams = labExamsData.filter(exam => exam.category === category);

  const handleSelectExam = (exam: LabExam) => {
    setSelectedExam(exam);
    onSelectExam(exam);
  };

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
        <p className="text-gray-600">
          {exams.length} exame{exams.length !== 1 ? 's' : ''} nesta categoria
        </p>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map(exam => (
          <Card
            key={exam.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedExam?.id === exam.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleSelectExam(exam)}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{exam.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{exam.subcategory}</p>
                </div>
                <Badge className={getStatusColor(exam.status)}>
                  {getStatusLabel(exam.status)}
                </Badge>
              </div>

              {/* Value */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-600">Valor</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {exam.value !== null ? exam.value : 'N/A'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{exam.unit}</p>
                </div>
              </div>

              {/* Reference */}
              {(exam.referenceMin !== undefined || exam.referenceMax !== undefined) && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold">Referência:</span>
                    {exam.referenceMin !== undefined && exam.referenceMax !== undefined
                      ? ` ${exam.referenceMin} - ${exam.referenceMax}`
                      : exam.referenceMin !== undefined
                        ? ` > ${exam.referenceMin}`
                        : ` < ${exam.referenceMax}`}
                    {' '}
                    {exam.unit}
                  </p>
                </div>
              )}

              {exam.referenceText && (
                <div className="text-xs text-gray-600">
                  <p>{exam.referenceText}</p>
                </div>
              )}

              {/* Collection Info */}
              <div className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                <p>
                  {exam.collectionDate} às {exam.collectionTime}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      {selectedExam && (
        <Card className="p-6 border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedExam.name}</h2>
                <p className="text-gray-600 mt-1">{selectedExam.subcategory}</p>
              </div>
              <Badge className={`${getStatusColor(selectedExam.status)} text-lg px-4 py-2`}>
                {getStatusLabel(selectedExam.status)}
              </Badge>
            </div>

            {/* Value Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Valor Atual</p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedExam.value !== null ? selectedExam.value : 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1">{selectedExam.unit}</p>
              </div>

              {selectedExam.referenceMin !== undefined && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Mínimo</p>
                  <p className="text-3xl font-bold text-green-600">{selectedExam.referenceMin}</p>
                </div>
              )}

              {selectedExam.referenceMax !== undefined && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Máximo</p>
                  <p className="text-3xl font-bold text-green-600">{selectedExam.referenceMax}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="significance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="significance">Significado</TabsTrigger>
                <TabsTrigger value="causes">Causas</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>

              {/* Significado Clínico */}
              <TabsContent value="significance" className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Significado Clínico</h3>
                      <p className="text-gray-700">{selectedExam.clinicalSignificance}</p>
                    </div>
                  </div>
                </div>

                {selectedExam.correlatedExams.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3">Exames Correlacionados</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExam.correlatedExams.map(examId => {
                        const correlatedExam = labExamsData.find(e => e.id === examId);
                        return correlatedExam ? (
                          <Badge key={examId} variant="secondary">
                            {correlatedExam.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Possíveis Causas */}
              <TabsContent value="causes" className="space-y-4">
                {selectedExam.possibleCauses && selectedExam.possibleCauses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedExam.possibleCauses.map((cause, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{cause}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-600">
                    Nenhuma causa específica identificada. Resultado dentro da normalidade.
                  </div>
                )}
              </TabsContent>

              {/* Recomendações */}
              <TabsContent value="recommendations" className="space-y-4">
                {selectedExam.recommendations && selectedExam.recommendations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedExam.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-600">
                    Nenhuma recomendação específica. Continuar monitoramento regular.
                  </div>
                )}
              </TabsContent>

              {/* Histórico */}
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-2">
                  {selectedExam.history.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{entry.date}</p>
                        <p className="text-sm text-gray-600">
                          {entry.value !== null ? entry.value : 'N/A'} {selectedExam.unit}
                        </p>
                      </div>
                      <Badge className={getStatusColor(entry.status)}>
                        {getStatusLabel(entry.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Metadata */}
            <div className="p-4 bg-white rounded-lg border border-gray-200 text-sm text-gray-600 space-y-1">
              <p>
                <strong>Método:</strong> {selectedExam.method}
              </p>
              <p>
                <strong>Material:</strong> {selectedExam.material}
              </p>
              <p>
                <strong>Data da Coleta:</strong> {selectedExam.collectionDate} às{' '}
                {selectedExam.collectionTime}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
