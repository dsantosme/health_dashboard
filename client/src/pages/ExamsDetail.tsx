import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExamChart } from '@/components/ExamChart';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { DownloadExams } from '@/components/DownloadExams';
import { trpc } from '@/lib/trpc';

export default function ExamsDetail() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamName, setSelectedExamName] = useState<string | null>(null);

  // Carregar APENAS exames de 2026 (ano vigente)
  const { data: exams = [], isLoading } = trpc.exams.listByPatientAndPeriod.useQuery({
    patientId: 'denis-santos',
    year: 2026
  });

  // Carregar histórico do exame selecionado
  const { data: examHistory = [] } = trpc.exams.getHistory.useQuery(
    {
      patientId: 'denis-santos',
      examName: selectedExamName || ''
    },
    {
      enabled: !!selectedExamName
    }
  );

  // Agrupar por nome de exame
  const examsByName = exams.reduce((acc, exam) => {
    const name = exam.examName;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(exam);
    return acc;
  }, {} as Record<string, typeof exams>);

  // Filtrar por busca
  const filteredExams = Object.entries(examsByName).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedExam = selectedExamName ? examsByName[selectedExamName] : null;
  const selectedExamData = selectedExam ? selectedExam[0] : null;

  // Verificar se há exames com histórico (para mostrar evolução)
  const examsWithHistory = selectedExam ? selectedExam.filter(e => {
    // Verificar se existe histórico anterior (2025 ou antes)
    return examHistory.length > 1;
  }) : [];

  // O ExamChart agora lida com a preparação dos dados internamente

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-600">Carregando exames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Exames Detalhados</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Indicador de Periodo */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Dados de 2026:</strong> Exibindo apenas exames do ano vigente. Selecione um exame para ver o historico completo de evolucao.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Exames */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white border-slate-200 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Exames ({filteredExams.length})</h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar exame..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Exam List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExams.map(([name]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedExamName(name)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedExamName === name
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-medium text-sm">{name}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {examsByName[name].length} coleta{examsByName[name].length > 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Detalhes do Exame */}
          <div className="lg:col-span-2 space-y-6">
            {selectedExamData ? (
              <>
                {/* Header */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedExamData.examName}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedExamData.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">
                        {selectedExam?.[selectedExam.length - 1]?.value}
                      </p>
                      <p className="text-sm text-slate-600">{selectedExamData.unit}</p>
                    </div>
                  </div>
                </Card>

                {/* Faixa de Referência */}
                {(selectedExamData.referenceMin || selectedExamData.referenceMax) && (
                  <Card className="p-6 bg-white border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Faixa de Referência</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedExamData.referenceMin && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Mínimo</p>
                          <p className="text-2xl font-bold text-green-900">{selectedExamData.referenceMin}</p>
                        </div>
                      )}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Atual</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedExam?.[selectedExam.length - 1]?.value}</p>
                      </div>
                      {selectedExamData.referenceMax && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Máximo</p>
                          <p className="text-2xl font-bold text-green-900">{selectedExamData.referenceMax}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Gráfico Temporal */}
                <Card className="p-6 bg-white border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Evolução Temporal (2022-2026)</h4>
                  {examHistory.length > 0 ? (
                    <ExamChart 
                      data={examHistory}
                      examName={selectedExamName || ''}
                      unit={selectedExamData?.unit || ''}
                    />
                  ) : (
                    <p className="text-center text-slate-500 py-8">Sem dados históricos disponíveis</p>
                  )}
                </Card>

                {/* Histórico Detalhado */}
                <Card className="p-6 bg-white border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Histórico Completo</h4>
                  <div className="space-y-3">
                    {examHistory.length > 0 ? (
                      examHistory
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((exam, idx) => {
                          const value = typeof exam.value === 'number' ? exam.value : parseFloat(String(exam.value));
                          const prevValue = idx < examHistory.length - 1 
                            ? (typeof examHistory[idx + 1].value === 'number' 
                                ? examHistory[idx + 1].value 
                                : parseFloat(String(examHistory[idx + 1].value)))
                            : null;
                          
                          return (
                            <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                  {new Date(exam.date).toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {exam.value} {exam.unit}
                                  {exam.referenceMin && exam.referenceMax && (
                                    <span className="ml-2 text-xs text-slate-500">
                                      (Ref: {exam.referenceMin}-{exam.referenceMax})
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {prevValue !== null && typeof prevValue === 'number' && (
                                  <div className="text-xs text-slate-600">
                                    {value > prevValue ? (
                                      <span className="text-red-600">↑ +{(value - prevValue).toFixed(2)}</span>
                                    ) : value < prevValue ? (
                                      <span className="text-green-600">↓ -{(prevValue - value).toFixed(2)}</span>
                                    ) : (
                                      <span className="text-gray-600">→ Estável</span>
                                    )}
                                  </div>
                                )}
                                {exam.status === 'normal' && <span className="text-lg">✅</span>}
                                {exam.status === 'low' && <span className="text-lg">⬇️</span>}
                                {exam.status === 'high' && <span className="text-lg">⬆️</span>}
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-center text-slate-500 py-8">Nenhum histórico disponível</p>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 bg-white border-slate-200 text-center">
                <p className="text-slate-600">Selecione um exame para ver detalhes</p>
              </Card>
            )}

            {/* Download */}
            <DownloadExams />
          </div>
        </div>
      </main>
    </div>
  );
}
