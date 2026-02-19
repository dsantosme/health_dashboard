import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { trpc } from '@/lib/trpc';

export default function CompleteHistory() {
  const [, navigate] = useLocation();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedExam, setSelectedExam] = useState<string | undefined>();

  // Carregar todos os exames do paciente
  const { data: allExams = [], isLoading } = trpc.exams.listByPatient.useQuery({
    patientId: 'denis-santos'
  });

  // Carregar histórico do exame selecionado
  const { data: examHistory = [] } = trpc.exams.getHistory.useQuery(
    {
      patientId: 'denis-santos',
      examName: selectedExam || ''
    },
    {
      enabled: !!selectedExam
    }
  );

  // Agrupar exames por ano
  const examsByYear = useMemo(() => {
    const grouped: Record<number, typeof allExams> = {};
    allExams.forEach(exam => {
      const year = new Date(exam.date).getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(exam);
    });
    return grouped;
  }, [allExams]);

  // Lista de anos disponíveis (ordenados do mais recente para o mais antigo)
  const years = useMemo(() => {
    return Object.keys(examsByYear)
      .map(Number)
      .sort((a, b) => b - a); // 2026 primeiro
  }, [examsByYear]);

  // Exames do ano selecionado
  const selectedYearExams = selectedYear ? examsByYear[selectedYear] || [] : [];

  // Preparar dados para gráfico
  const chartData = useMemo(() => {
    return examHistory
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        value: typeof e.value === 'number' ? e.value : parseFloat(String(e.value)),
        referenceMin: e.referenceMin,
        referenceMax: e.referenceMax
      }));
  }, [examHistory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Histórico Completo</h1>
              <p className="text-slate-600">Todos os períodos de coleta (2022-2026)</p>
            </div>
          </div>
        </div>

        {/* Indicador de Historico */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Historico Completo (2022-2026):</strong> Todos os exames de todos os periodos. Para ver apenas dados atuais de 2026, retorne a Home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Anos */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white border-slate-200 sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Períodos
              </h2>
              <div className="space-y-2">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setSelectedExam(undefined);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedYear === year
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-900 font-semibold'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-medium">{year}</div>
                    <div className="text-sm opacity-75">{examsByYear[year].length} exames</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {selectedYear ? (
              <>
                {/* Exames do Ano */}
                <Card className="p-6 bg-white border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Exames de {selectedYear}
                  </h2>
                  {selectedYearExams.length > 0 ? (
                    <div className="space-y-3">
                      {selectedYearExams.map(exam => (
                        <button
                          key={exam.id}
                          onClick={() => setSelectedExam(exam.examName)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition ${
                            selectedExam === exam.examName
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-slate-900">{exam.examName}</div>
                              <div className="text-sm text-slate-600">{exam.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">
                                {exam.value} {exam.unit}
                              </div>
                              <div className={`text-sm font-semibold ${
                                exam.status === 'normal' ? 'text-green-600' :
                                exam.status === 'low' ? 'text-orange-600' :
                                exam.status === 'high' ? 'text-red-600' :
                                'text-slate-600'
                              }`}>
                                {exam.status.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-8">Nenhum exame encontrado para este ano</p>
                  )}
                </Card>

                {/* Gráfico de Histórico */}
                {examHistory.length > 1 && (
                  <Card className="p-6 bg-white border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                      Evolução: {selectedExam}
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => `${value} ${examHistory[0]?.unit || ''}`}
                          labelFormatter={(label) => `Data: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 4 }}
                          name={selectedExam}
                        />
                        {examHistory[0]?.referenceMin && (
                          <ReferenceLine 
                            y={examHistory[0].referenceMin} 
                            stroke="#f59e0b" 
                            strokeDasharray="5 5"
                            label={{ value: 'Mín', position: 'right', fill: '#f59e0b' }}
                          />
                        )}
                        {examHistory[0]?.referenceMax && (
                          <ReferenceLine 
                            y={examHistory[0].referenceMax} 
                            stroke="#f59e0b" 
                            strokeDasharray="5 5"
                            label={{ value: 'Máx', position: 'right', fill: '#f59e0b' }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>

                    {/* Análise de Tendência */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-3">Análise de Tendência</h3>
                      {examHistory.length >= 2 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const firstValue = parseFloat(String(examHistory[0].value));
                              const lastValue = parseFloat(String(examHistory[examHistory.length - 1].value));
                              
                              if (!isNaN(firstValue) && !isNaN(lastValue) && lastValue > firstValue) {
                                return (
                                  <>
                                    <TrendingUp className="w-5 h-5 text-red-600" />
                                    <span className="text-slate-700">
                                      <strong>Aumentando:</strong> {firstValue} → {lastValue}
                                    </span>
                                  </>
                                );
                              } else if (!isNaN(firstValue) && !isNaN(lastValue) && lastValue < firstValue) {
                                return (
                                  <>
                                    <TrendingDown className="w-5 h-5 text-green-600" />
                                    <span className="text-slate-700">
                                      <strong>Diminuindo:</strong> {firstValue} → {lastValue}
                                    </span>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <Minus className="w-5 h-5 text-blue-600" />
                                    <span className="text-slate-700">
                                      <strong>Estável:</strong> {firstValue}
                                    </span>
                                  </>
                                );
                              }
                            })()}
                          </div>
                          <div className="text-sm text-slate-600">
                            {(() => {
                              const firstValue = parseFloat(String(examHistory[0].value));
                              const lastValue = parseFloat(String(examHistory[examHistory.length - 1].value));
                              
                              if (isNaN(firstValue) || isNaN(lastValue)) {
                                return 'Variação: N/A';
                              }
                              
                              const variation = (((lastValue - firstValue) / firstValue) * 100).toFixed(1);
                              return `Variação: ${variation}%`;
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-12 bg-white border-slate-200 text-center">
                <p className="text-slate-600">Selecione um período para ver os exames</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
