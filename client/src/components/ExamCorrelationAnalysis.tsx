import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { 
  analyzeExamCorrelation, 
  findCorrelatedExams, 
  type ExamData, 
  type CorrelationAnalysis 
} from '@/lib/examCorrelations';

interface ExamCorrelationAnalysisProps {
  currentExam: ExamData;
  allExams: ExamData[];
}

export function ExamCorrelationAnalysis({
  currentExam,
  allExams,
}: ExamCorrelationAnalysisProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedCorrelation, setSelectedCorrelation] = useState<CorrelationAnalysis | null>(null);

  const correlatedExams = findCorrelatedExams(currentExam.name, allExams);

  const handleAnalyzeCorrelation = (correlatedExam: ExamData) => {
    const analysis = analyzeExamCorrelation(currentExam, correlatedExam);
    setSelectedCorrelation(analysis);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'bom':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'ruim':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'precisa-melhorar':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'bom':
        return 'Bom';
      case 'ruim':
        return 'Requer Atenção';
      case 'precisa-melhorar':
        return 'Precisa Melhorar';
      default:
        return 'Neutro';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'alto':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'moderado':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'baixo':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (correlatedExams.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!showAnalysis ? (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                🔗 Correlações Disponíveis
              </h3>
              <p className="text-sm text-slate-600">
                Encontramos {correlatedExams.length} exame(s) correlacionado(s) com{' '}
                <strong>{currentExam.name}</strong> dentro de um período aceitável
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {correlatedExams.map((exam) => (
              <Button
                key={exam.name}
                onClick={() => handleAnalyzeCorrelation(exam)}
                className="justify-start h-auto py-3 px-4 bg-white text-left hover:bg-blue-50 border border-blue-200"
                variant="outline"
              >
                <div>
                  <div className="font-semibold text-slate-900">{exam.name}</div>
                  <div className="text-sm text-slate-600">
                    {exam.value} {exam.unit}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      ) : selectedCorrelation ? (
        <Card className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(selectedCorrelation.status)}
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCorrelation.correlationType}
                </h3>
                <p className="text-sm text-slate-600">
                  Status: <span className="font-semibold">{getStatusLabel(selectedCorrelation.status)}</span>
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowAnalysis(false)}
              variant="outline"
              size="sm"
            >
              ← Voltar
            </Button>
          </div>

          {/* Risk Level Badge */}
          <div className={`p-3 rounded-lg border ${getRiskColor(selectedCorrelation.riskLevel)}`}>
            <div className="text-sm font-semibold">
              Nível de Risco: {selectedCorrelation.riskLevel.charAt(0).toUpperCase() + selectedCorrelation.riskLevel.slice(1)}
            </div>
          </div>

          {/* Exams Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            {selectedCorrelation.exams.map((exam) => (
              <div key={exam.name}>
                <p className="text-sm font-semibold text-slate-600 mb-1">{exam.name}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {exam.value} <span className="text-sm text-slate-600">{exam.unit}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Referência: {exam.referenceMin}-{exam.referenceMax}
                </p>
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">💡 Análise Médica</h4>
            <p className="text-slate-700 leading-relaxed text-justify">
              {selectedCorrelation.explanation}
            </p>
          </div>

          {/* Recommendation */}
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-slate-900">📋 Recomendações</h4>
            <p className="text-slate-700 leading-relaxed text-justify">
              {selectedCorrelation.recommendation}
            </p>
          </div>

          {/* Specialists */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-slate-600" />
              <h4 className="font-bold text-slate-900">👨‍⚕️ Especialistas Recomendados</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedCorrelation.specialists.map((specialist) => (
                <div
                  key={specialist.specialty}
                  className={`p-4 rounded-lg border-2 ${
                    specialist.priority === 'alta'
                      ? 'bg-red-50 border-red-300'
                      : specialist.priority === 'média'
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-green-50 border-green-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-900">{specialist.name}</p>
                      <p className="text-sm text-slate-600">{specialist.specialty}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        specialist.priority === 'alta'
                          ? 'bg-red-200 text-red-800'
                          : specialist.priority === 'média'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {specialist.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{specialist.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={() => setShowAnalysis(false)}
              variant="outline"
              className="flex-1"
            >
              Voltar às Correlações
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Agendar Consulta
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
