import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { periodsSummary, getExamHistory } from '@/data/completeHistoryData';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';

export default function CompleteHistory() {
  const [, navigate] = useLocation();
  const { selectedPatientId } = usePatient();
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>();
  const [selectedExam, setSelectedExam] = useState<string | undefined>();

  const periods = Object.values(periodsSummary).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const examHistory = selectedExam ? getExamHistory(selectedExam) : null;

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Períodos */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white border-slate-200 sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Períodos
              </h2>
              <div className="space-y-2">
                {periods.map(period => (
                  <button
                    key={period.date}
                    onClick={() => setSelectedPeriod(period.date)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedPeriod === period.date
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-900 font-semibold'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-medium">{period.label}</div>
                    <div className="text-sm opacity-75">{period.count} exames</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPeriod ? (
              <>
                {/* Exames do Período */}
                <Card className="p-6 bg-white border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Exames - {periodsSummary[selectedPeriod as keyof typeof periodsSummary]?.label}
                  </h2>
                  <div className="space-y-3">
                    {periodsSummary[selectedPeriod as keyof typeof periodsSummary]?.exams.map(exam => (
                      <button
                        key={exam.id}
                        onClick={() => setSelectedExam(exam.name)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${
                          selectedExam === exam.name
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-900">{exam.name}</div>
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
                </Card>

                {/* Gráfico de Histórico */}
                {examHistory && examHistory.length > 1 && (
                  <Card className="p-6 bg-white border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                      Evolução: {selectedExam}
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={examHistory}>
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
                            {examHistory[examHistory.length - 1].value > examHistory[0].value ? (
                              <>
                                <TrendingUp className="w-5 h-5 text-red-600" />
                                <span className="text-slate-700">
                                  <strong>Aumentando:</strong> {examHistory[0].value} → {examHistory[examHistory.length - 1].value}
                                </span>
                              </>
                            ) : examHistory[examHistory.length - 1].value < examHistory[0].value ? (
                              <>
                                <TrendingDown className="w-5 h-5 text-green-600" />
                                <span className="text-slate-700">
                                  <strong>Diminuindo:</strong> {examHistory[0].value} → {examHistory[examHistory.length - 1].value}
                                </span>
                              </>
                            ) : (
                              <>
                                <Minus className="w-5 h-5 text-blue-600" />
                                <span className="text-slate-700">
                                  <strong>Estável:</strong> {examHistory[0].value}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-sm text-slate-600">
                            Variação: {(((examHistory[examHistory.length - 1].value - examHistory[0].value) / examHistory[0].value) * 100).toFixed(1)}%
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
